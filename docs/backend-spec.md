# Backend Specification - API Proxy для интерактивного резюме

## Архитектура решения

**Назначение:** Минимальный backend для безопасной работы с LLM API и устранения CORS ограничений

**Подход:** Serverless Functions или Lightweight Express.js сервер как API proxy

**Альтернатива:** Frontend-only решение с демо-данными (для MVP за 1 день)

## Зачем нужен бэкенд

### Проблемы client-side подхода
```javascript
// ❌ Небезопасно - API ключи видны в коде
const OPENAI_API_KEY = 'sk-proj-xxx...'; 

// ❌ CORS ограничения браузера
fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
}); // Блокируется браузером

// ❌ Rate limiting на клиенте невозможен
```

### Решения через backend
```javascript
// ✅ API ключи в environment variables
// ✅ Прокси для обхода CORS
// ✅ Rate limiting и caching
// ✅ Логирование и аналитика
```

## Технический стек

### Вариант 1: Serverless Functions (Рекомендуемый)
**Платформы:** Vercel, Netlify Functions, Railway
**Преимущества:** Быстрый деплой, автоскейлинг, минимальная настройка

```javascript
// Vercel Function: api/chat.js
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  // Proxy to OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  });
  
  const data = await response.json();
  res.json(data);
}
```

### Вариант 2: Express.js микросервис
**Платформы:** Railway, Render, Heroku
**Преимущества:** Больше контроля, middleware, сложная логика

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await callOpenAI(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000);
```

## API Endpoints

### 1. RAG Chat Endpoint
```typescript
POST /api/chat
Content-Type: application/json

Request:
{
  "message": "Расскажи о опыте с мультиагентными системами",
  "context": ["document1", "document2"], // Релевантные документы
  "conversation_id": "uuid-string" // Для истории чата
}

Response:
{
  "response": "На основе предоставленного контекста...",
  "sources": ["doc1", "doc2"], // Источники информации
  "tokens_used": 150,
  "response_time": 1200 // ms
}

Errors:
400 - Invalid request format
429 - Rate limit exceeded  
500 - Internal server error
```

### 2. Knowledge Base Search
```typescript
GET /api/search?q={query}&limit={number}

Response:
{
  "results": [
    {
      "title": "Face-Swap Bot для партии Новые Люди",
      "excerpt": "Создание telegram-бота с технологией замены лиц...",
      "relevance": 0.95,
      "source": "article-1"
    }
  ],
  "total": 12,
  "query_time": 50
}
```

### 3. Analytics Endpoint (опционально)
```typescript
POST /api/analytics
{
  "event": "chat_interaction",
  "data": {
    "question": "опыт с Mistral",
    "response_length": 250,
    "user_session": "session-id"
  }
}
```

## Реализация RAG системы

### Простая версия (быстрая разработка)
```javascript
// api/chat.js - Serverless function
import { searchDocuments } from '../lib/search.js';
import { callOpenAI } from '../lib/openai.js';

export default async function handler(req, res) {
  const { message } = req.body;
  
  // 1. Поиск релевантных документов
  const relevantDocs = searchDocuments(message, {
    limit: 3,
    threshold: 0.3
  });
  
  // 2. Формирование контекста
  const context = relevantDocs.map(doc => doc.content).join('\n\n');
  
  // 3. Промпт для LLM
  const prompt = `
    Контекст об экспертизе кандидата:
    ${context}
    
    Вопрос: ${message}
    
    Отвечай как эксперт по ИИ, используя только информацию из контекста.
    Если в контексте нет информации - честно скажи об этом.
  `;
  
  // 4. Вызов API
  const response = await callOpenAI(prompt);
  
  res.json({ 
    response: response.choices[0].message.content,
    sources: relevantDocs.map(d => d.title)
  });
}
```

### Продвинутая версия (с векторным поиском)
```javascript
// lib/vector-search.js
import { OpenAI } from 'openai';

class VectorSearch {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.embeddings = new Map(); // В production: векторная БД
  }
  
  async searchSimilar(query, limit = 3) {
    // 1. Получить embedding запроса
    const queryEmbedding = await this.getEmbedding(query);
    
    // 2. Найти похожие документы по косинусному расстоянию
    const similarities = [];
    for (const [docId, embedding] of this.embeddings) {
      const similarity = this.cosineSimilarity(queryEmbedding, embedding);
      similarities.push({ docId, similarity });
    }
    
    // 3. Отсортировать и вернуть топ результаты
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }
  
  async getEmbedding(text) {
    const response = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text
    });
    return response.data[0].embedding;
  }
  
  cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }
}
```

## Структура проекта

### Serverless (Vercel/Netlify)
```
backend/
├── api/
│   ├── chat.js           # RAG чат endpoint
│   ├── search.js         # Поиск в базе знаний
│   └── health.js         # Проверка статуса
├── lib/
│   ├── openai.js         # OpenAI интеграция
│   ├── search.js         # Поисковая логика
│   └── rate-limit.js     # Rate limiting
├── data/
│   ├── knowledge-base.json # База знаний
│   └── embeddings.json   # Предвычисленные embeddings
├── package.json
└── vercel.json          # Конфигурация Vercel
```

### Express.js сервер
```
backend/
├── src/
│   ├── routes/
│   │   ├── chat.js       # RAG endpoints
│   │   └── analytics.js  # Аналитика
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── rate-limit.js
│   │   └── auth.js
│   ├── services/
│   │   ├── openai.js
│   │   └── search.js
│   └── app.js
├── data/
├── package.json
└── Dockerfile           # Для контейнеризации
```

## Конфигурация и переменные

### Environment Variables
```bash
# .env файл
OPENAI_API_KEY=sk-proj-xxx...
CLAUDE_API_KEY=sk-ant-xxx...  # Альтернативный провайдер

# Rate limiting
RATE_LIMIT_REQUESTS=100       # Запросов в час
RATE_LIMIT_WINDOW=3600        # Окно в секундах

# Безопасность
ALLOWED_ORIGINS=https://your-resume.github.io
CORS_ENABLED=true

# Аналитика (опционально)
GOOGLE_ANALYTICS_ID=GA-xxx
```

### Vercel конфигурация
```json
// vercel.json
{
  "functions": {
    "api/chat.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "OPENAI_API_KEY": "@openai-key",
    "NODE_ENV": "production"
  }
}
```

## Безопасность

### Rate Limiting
```javascript
// lib/rate-limit.js
const rateLimits = new Map();

export function checkRateLimit(ip, limit = 10, window = 3600000) {
  const now = Date.now();
  const userLimits = rateLimits.get(ip) || [];
  
  // Очистить старые записи
  const validRequests = userLimits.filter(time => now - time < window);
  
  if (validRequests.length >= limit) {
    return false; // Превышен лимит
  }
  
  validRequests.push(now);
  rateLimits.set(ip, validRequests);
  
  return true; // Запрос разрешен
}
```

### CORS настройка
```javascript
// Безопасная настройка CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-resume.github.io']  // Только production домен
    : true,  // В development разрешить все
  credentials: false,  // Не передаем cookies
  methods: ['POST', 'GET', 'OPTIONS']
}));
```

## Кэширование

### In-memory кэш для частых запросов
```javascript
// lib/cache.js
class SimpleCache {
  constructor(ttl = 300000) { // 5 минут
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  set(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }
  
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }
}

// Использование
const responseCache = new SimpleCache();

export async function getCachedResponse(query) {
  const cacheKey = `chat:${query}`;
  let response = responseCache.get(cacheKey);
  
  if (!response) {
    response = await callLLMAPI(query);
    responseCache.set(cacheKey, response);
  }
  
  return response;
}
```

## Мониторинг и логирование

### Простое логирование
```javascript
// lib/logger.js
export function logRequest(req, response, duration) {
  const log = {
    timestamp: new Date().toISOString(),
    ip: req.ip,
    endpoint: req.path,
    query: req.body?.message?.slice(0, 100), // Первые 100 символов
    response_length: response.length,
    duration,
    status: 'success'
  };
  
  console.log(JSON.stringify(log));
}
```

## Развертывание

### Быстрый деплой на Vercel
```bash
# 1. Установить Vercel CLI
npm i -g vercel

# 2. Инициализировать проект
vercel init

# 3. Настроить environment variables
vercel env add OPENAI_API_KEY

# 4. Деплой
vercel --prod
```

### Railway (альтернатива)
```bash
# 1. Установить Railway CLI
npm i -g @railway/cli

# 2. Логин и деплой
railway login
railway init
railway up
```

## Стоимость и лимиты

### OpenAI API расходы (приблизительно)
```
GPT-4 Turbo: $0.01 / 1K tokens input, $0.03 / 1K tokens output
GPT-3.5 Turbo: $0.001 / 1K tokens

Средний запрос:
- Промпт: 500 tokens (база знаний + вопрос)
- Ответ: 200 tokens
- Стоимость на GPT-4: ~$0.011
- Стоимость на GPT-3.5: ~$0.0007

100 запросов в день: $1.1 (GPT-4) или $0.07 (GPT-3.5)
```

### Хостинг
- **Vercel:** 100GB bandwidth, 100GB/hour функций - бесплатно
- **Railway:** $5/месяц за активные проекты
- **Netlify:** 100GB bandwidth - бесплатно

## Переход с Frontend-only

### Минимальные изменения в frontend
```javascript
// Было (небезопасно):
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});

// Стало (через proxy):
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userMessage })
});
```

### Graceful fallback
```javascript
// Frontend код с fallback
async function getChatResponse(message) {
  try {
    // Попытка использовать backend
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Backend недоступен, переход на demo режим');
  }
  
  // Fallback на демо-ответы
  return getDemoResponse(message);
}
```

## Рекомендации по реализации

### Для MVP (1 день)
1. **Начать с frontend-only** с demo данными
2. **Добавить backend позже** для production версии
3. **Использовать Vercel** для быстрого деплоя
4. **Минимальный функционал** - только RAG chat proxy

### Для production версии
1. **Полноценный backend** с кэшированием и мониторингом
2. **Векторный поиск** для лучшего quality RAG
3. **Rate limiting** и безопасность
4. **Аналитика** для отслеживания использования

---

**Итог:** Backend нужен для production, но для MVP за 1 день можно обойтись frontend-only решением с демо-данными.