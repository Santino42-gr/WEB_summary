# Frontend Specification - Интерактивное веб-резюме

## Обзор архитектуры

**Тип приложения:** Single Page Application (SPA)
**Развертывание:** GitHub Pages (статический хостинг)
**Подход:** Client-side rendering с минимальными внешними зависимостями

## Технический стек

### Основные технологии
```
HTML5: Семантическая разметка, accessibility
CSS3: Grid/Flexbox layout, animations, custom properties
JavaScript ES6+: Modules, async/await, fetch API
```

### Библиотеки и зависимости
```javascript
// CDN импорты (без npm/webpack для простоты)
- AOS (Animate On Scroll): https://cdn.jsdelivr.net/aos@2.3.4/
- Chart.js: https://cdn.jsdelivr.net/npm/chart.js@4.4.0/
- Никаких тяжелых фреймворков (React/Vue) для быстрой разработки
```

### API интеграции
```javascript
// Client-side API вызовы
- OpenAI API: для RAG чата (потребует API ключ)
- Альтернатива: Claude API через прокси
- Fallback: статические ответы для демонстрации
```

## Структура проекта

```
project-root/
├── index.html              # Главная страница
├── css/
│   ├── main.css           # Основные стили
│   ├── components.css     # Компоненты (карточки, кнопки)
│   ├── animations.css     # Анимации и переходы
│   └── responsive.css     # Медиа-запросы
├── js/
│   ├── main.js           # Основная логика
│   ├── components/
│   │   ├── rag-chat.js   # RAG чат компонент
│   │   ├── multiagent.js # Визуализация агентов
│   │   └── checklist.js  # AI Readiness Checklist
│   ├── utils/
│   │   ├── api.js        # API утилиты
│   │   └── animations.js # Вспомогательные анимации
│   └── config.js         # Конфигурация
├── data/
│   ├── knowledge-base.json # База знаний для RAG
│   ├── projects.json      # Данные проектов
│   └── skills.json        # Навыки и метрики
├── assets/
│   ├── images/            # Изображения проектов
│   └── icons/             # SVG иконки
└── README.md
```

## Компоненты и их реализация

### 1. Hero Section
**Файлы:** `index.html`, `css/main.css`, `js/main.js`

```html
<section id="hero" class="hero">
  <div class="hero-content">
    <h1 class="hero-title animate-text">
      Prompt Engineer & LLM Architect
    </h1>
    <p class="hero-subtitle">
      Создаю ИИ-решения от архитектуры до продакшена
    </p>
    <div class="hero-metrics">
      <div class="metric-item" data-aos="fade-up">
        <span class="metric-value">10,000+</span>
        <span class="metric-label">строк кода</span>
      </div>
      <!-- ... остальные метрики -->
    </div>
    <button class="cta-button" onclick="scrollToSection('demos')">
      Посмотреть Live Demo
    </button>
  </div>
</section>
```

**CSS особенности:**
```css
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
}

.animate-text {
  background: linear-gradient(45deg, #00d4ff, #ffffff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 3s infinite;
}
```

### 2. RAG Chat Component
**Файл:** `js/components/rag-chat.js`

```javascript
class RAGChat {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.knowledgeBase = null;
    this.chatHistory = [];
    this.init();
  }

  async init() {
    await this.loadKnowledgeBase();
    this.renderChatInterface();
    this.setupEventListeners();
  }

  async loadKnowledgeBase() {
    try {
      const response = await fetch('./data/knowledge-base.json');
      this.knowledgeBase = await response.json();
    } catch (error) {
      console.error('Ошибка загрузки базы знаний:', error);
      this.knowledgeBase = this.getFallbackData();
    }
  }

  renderChatInterface() {
    this.container.innerHTML = `
      <div class="chat-container">
        <div class="chat-header">
          <h3>RAG Chat - База знаний экспертизы</h3>
        </div>
        <div class="chat-messages" id="chat-messages">
          ${this.renderWelcomeMessage()}
        </div>
        <div class="chat-input-container">
          <input type="text" id="chat-input" 
                 placeholder="Спросите о моем опыте с ИИ...">
          <button id="send-button">Отправить</button>
        </div>
        <div class="suggested-questions">
          ${this.renderSuggestedQuestions()}
        </div>
      </div>
    `;
  }

  async handleUserMessage(message) {
    // Показать пользовательское сообщение
    this.addMessage(message, 'user');
    
    // Найти релевантный контекст
    const context = this.searchKnowledge(message);
    
    // В production: вызов API
    // const response = await this.callLLMAPI(message, context);
    
    // Fallback для демо
    const response = this.generateDemoResponse(message, context);
    this.addMessage(response, 'assistant');
  }

  searchKnowledge(query) {
    // Простой поиск по ключевым словам
    const keywords = query.toLowerCase().split(' ');
    const relevantDocs = this.knowledgeBase.documents.filter(doc => 
      keywords.some(keyword => 
        doc.content.toLowerCase().includes(keyword) ||
        doc.title.toLowerCase().includes(keyword)
      )
    );
    
    return relevantDocs.slice(0, 3); // Топ-3 релевантных документа
  }
}
```

### 3. Multiagent Visualization
**Файл:** `js/components/multiagent.js`

```javascript
class MultiagentVisualization {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.agents = this.getAgentsData();
    this.connections = this.getConnectionsData();
    this.init();
  }

  init() {
    this.renderVisualization();
    this.setupInteractions();
    this.startAnimations();
  }

  renderVisualization() {
    this.container.innerHTML = `
      <div class="multiagent-container">
        <svg class="agents-svg" viewBox="0 0 800 600">
          ${this.renderConnections()}
          ${this.renderAgents()}
        </svg>
        <div class="agent-info-panel" id="agent-info">
          <h3>Команда ИИ-агентов</h3>
          <p>Нажмите на агента для подробной информации</p>
        </div>
      </div>
    `;
  }

  renderAgents() {
    return this.agents.map(agent => `
      <g class="agent-node" data-agent="${agent.id}" 
         transform="translate(${agent.x}, ${agent.y})">
        <circle class="agent-circle" r="40" 
                fill="${agent.color}" stroke="#00d4ff" stroke-width="2">
        </circle>
        <text class="agent-label" text-anchor="middle" dy="5">
          ${agent.icon}
        </text>
        <text class="agent-name" text-anchor="middle" dy="60">
          ${agent.name}
        </text>
      </g>
    `).join('');
  }

  getAgentsData() {
    return [
      {
        id: 'project-manager',
        name: 'Project Manager',
        icon: '👨‍💼',
        color: '#ff6b6b',
        x: 400, y: 100,
        description: 'Координирует проекты и создает roadmap за 15 минут',
        tasks: ['Планирование', 'Координация', 'Управление сроками']
      },
      {
        id: 'ai-developer',
        name: 'AI Developer', 
        icon: '🧠',
        color: '#4ecdc4',
        x: 200, y: 200,
        description: 'Подбирает ИИ-решения и создает архитектуру',
        tasks: ['Выбор моделей', 'Архитектура ИИ', 'Оптимизация']
      },
      // ... остальные агенты
    ];
  }
}
```

### 4. AI Readiness Checklist
**Файл:** `js/components/checklist.js`

```javascript
class AIReadinessChecklist {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.questions = this.getQuestions();
    this.answers = new Map();
    this.init();
  }

  init() {
    this.renderChecklist();
    this.setupEventListeners();
  }

  renderChecklist() {
    this.container.innerHTML = `
      <div class="checklist-container">
        <div class="checklist-header">
          <h3>AI Readiness Assessment</h3>
          <div class="progress-bar">
            <div class="progress-fill" id="progress-fill"></div>
            <span class="progress-text" id="progress-text">0/10</span>
          </div>
        </div>
        
        <div class="questions-list">
          ${this.questions.map((q, index) => this.renderQuestion(q, index)).join('')}
        </div>
        
        <div class="results-section" id="results" style="display: none;">
          <div class="score-display">
            <div class="score-circle">
              <span class="score-value" id="final-score">0</span>
              <span class="score-label">из 100</span>
            </div>
          </div>
          <div class="recommendations" id="recommendations"></div>
        </div>
      </div>
    `;
  }

  renderQuestion(question, index) {
    return `
      <div class="question-item" data-question="${index}">
        <div class="question-text">
          <span class="question-number">${index + 1}.</span>
          ${question.text}
        </div>
        <div class="question-options">
          <label class="option">
            <input type="radio" name="q${index}" value="yes">
            <span class="option-text">Да</span>
          </label>
          <label class="option">
            <input type="radio" name="q${index}" value="partial">
            <span class="option-text">Частично</span>
          </label>
          <label class="option">
            <input type="radio" name="q${index}" value="no">
            <span class="option-text">Нет</span>
          </label>
        </div>
        <div class="question-hint">${question.hint}</div>
      </div>
    `;
  }

  calculateScore() {
    const total = this.questions.length;
    let score = 0;
    
    this.answers.forEach(answer => {
      switch(answer) {
        case 'yes': score += 10; break;
        case 'partial': score += 5; break;
        case 'no': score += 0; break;
      }
    });
    
    return Math.round(score);
  }
}
```

## Стилизация (CSS)

### Цветовая палитра
```css
:root {
  /* Основные цвета */
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-card: #252525;
  
  /* Акценты */
  --accent-primary: #00d4ff;
  --accent-secondary: #ff6b6b;
  
  /* Текст */
  --text-primary: #ffffff;
  --text-secondary: #cccccc;
  --text-muted: #888888;
  
  /* Состояния */
  --success: #4ecdc4;
  --warning: #ffe66d;
  --error: #ff6b6b;
}
```

### Компонентные стили
```css
/* Карточки проектов */
.project-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid transparent;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 212, 255, 0.1);
  border-color: var(--accent-primary);
}

/* Анимации */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

## Адаптивность

### Breakpoints
```css
/* Mobile First подход */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1200px) { /* Large Desktop */ }
```

### Мобильные особенности
- Упрощенные анимации для производительности
- Touch-friendly размеры кнопок (min 44px)
- Оптимизированная навигация
- Сжатие контента без потери функциональности

## Производительность

### Оптимизации
```javascript
// Lazy loading для тяжелых компонентов
const initializeComponent = (element) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Инициализация компонента при появлении
        loadComponent(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });
  
  observer.observe(element);
};

// Throttling для scroll events
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};
```

## Безопасность (Client-side)

### API ключи (проблема)
```javascript
// ПРОБЛЕМА: API ключи в client-side коде
const OPENAI_API_KEY = 'sk-...'; // Небезопасно!

// РЕШЕНИЯ:
// 1. Environment variables (не работает в статических сайтах)
// 2. Proxy сервер (требует backend)
// 3. Демо-режим с заранее подготовленными ответами
// 4. Использование публичных API без ключей

// Рекомендуемый подход для MVP:
const isDemoMode = true;
if (isDemoMode) {
  // Статические ответы для демонстрации
  return getDemoResponse(query);
} else {
  // Реальные API вызовы через proxy
  return await callAPI(query);
}
```

## Развертывание

### GitHub Pages настройка
1. Создать репозиторий с названием `username.github.io` или любым другим
2. В настройках репозитория включить GitHub Pages
3. Выбрать источник: main branch
4. Сайт будет доступен по адресу: `https://username.github.io/repo-name`

### Структура для деплоя
```
repo-root/
├── index.html      # Главная страница (обязательно)
├── css/           # Статические файлы
├── js/
├── data/
└── assets/
```

## Ограничения Frontend-only подхода

### Технические ограничения
- **API ключи:** Невозможно безопасно хранить на клиенте
- **CORS:** Ограничения браузера для cross-origin запросов
- **Производительность:** Вся обработка на клиенте
- **SEO:** Ограниченная индексация динамического контента

### Рекомендации
1. **MVP версия:** Client-side с demo данными
2. **Production версия:** Минимальный backend для API proxy
3. **Гибридный подход:** Статический контент + serverless функции

## Тестирование

### Локальная разработка
```bash
# Простой HTTP сервер для разработки
python -m http.server 8000
# или
npx serve .
```

### Тестирование компонентов
```javascript
// Простые unit тесты без фреймворка
const testRAGChat = () => {
  const chat = new RAGChat('test-container');
  console.assert(chat.knowledgeBase !== null, 'База знаний должна загрузиться');
};

// Тестирование в браузере
window.runTests = () => {
  testRAGChat();
  console.log('Все тесты пройдены');
};
```

## Следующие шаги

1. **Создать базовую HTML структуру**
2. **Настроить CSS стили** по дизайн-системе
3. **Реализовать статические компоненты** (карточки, hero)
4. **Добавить интерактивность** по порядку сложности
5. **Тестировать на разных устройствах**
6. **Деплой на GitHub Pages**

---

**Альтернатива:** Если нужен полноценный API функционал, рассмотреть backend решение.