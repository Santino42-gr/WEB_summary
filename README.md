# 🤖 AI Specialist - Интерактивное веб-резюме с RAG-чатом

Современное интерактивное резюме AI-специалиста с возможностью задавать вопросы через RAG (Retrieval-Augmented Generation) чат.

## 🚀 Быстрый старт

### Локальный запуск

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd Web-summary
   ```

2. **Запустите локальный сервер:**
   ```bash
   # Python 3
   python3 -m http.server 8000
   
   # Или Node.js (если установлен)
   npx serve .
   ```

3. **Откройте в браузере:**
   ```
   http://localhost:8000
   ```

## 📁 Структура проекта

```
Web-summary/
├── index.html              # Главная страница
├── css/                     # Стили
│   ├── design-system.css    # Дизайн-система и переменные
│   ├── components-specific.css # Специфичные компоненты
│   ├── specialized-components.css # Дополнительные компоненты
│   ├── main.css            # Основные стили проекта
│   ├── components.css      # Компонентные стили
│   └── animations.css      # Анимации и переходы
├── js/                     # JavaScript
│   └── main.js            # Основная логика приложения
├── data/                  # JSON данные
│   ├── knowledge-base.json # База знаний для RAG
│   ├── projects.json      # Данные о проектах
│   └── skills.json        # Навыки и технологии
├── docs/                  # Документация
└── components-documentation.html # Документация компонентов
```

## 🎨 Технологии

### Frontend
- **HTML5** - Семантическая разметка
- **CSS3** - Современные стили с custom properties
- **JavaScript ES6+** - Модульная архитектура
- **AOS** - Анимации при скролле
- **Chart.js** - Визуализация данных
- **Lucide Icons** - Современные иконки

### Дизайн
- **Design System** - Централизованная система дизайна
- **CSS Custom Properties** - Переменные для консистентности
- **Responsive Design** - Адаптивность для всех устройств
- **Dark Theme** - Современная темная тема
- **Accessibility** - ARIA атрибуты и семантика

## ⚡ Функциональность

### ✅ Реализовано
- 🎨 **Дизайн-система** - Полная система стилей и компонентов
- 🏗️ **Базовая структура** - Семантический HTML и модульный CSS/JS
- 📱 **Адаптивный дизайн** - Поддержка всех устройств
- 🎭 **Демо-данные** - Примеры проектов, навыков и базы знаний
- 💬 **RAG чат (демо)** - Интерфейс чата с заглушкой для ответов
- 📊 **Визуализации** - Графики навыков и проектов
- ⚡ **Анимации** - Современные переходы и эффекты

### 🔄 В разработке
- 🤖 **Реальный RAG чат** - Интеграция с OpenAI API
- 🕸️ **Multiagent Visualization** - Интерактивная визуализация команды
- ✅ **AI Readiness Checklist** - Интерактивный чек-лист
- 🔄 **Автоматизация деплоя** - CI/CD pipeline

## 🔧 Разработка

### Компоненты

- **WebResumeApp** - Главный класс приложения
- **NavigationComponent** - Навигация и меню
- **RAGChatComponent** - RAG чат система
- **ProjectsManager** - Управление проектами
- **SkillsManager** - Отображение навыков
- **UtilsHelper** - Вспомогательные функции

### Добавление новых данных

1. **Проекты** - Редактируйте `data/projects.json`
2. **Навыки** - Обновите `data/skills.json`
3. **База знаний** - Дополните `data/knowledge-base.json`

### Кастомизация дизайна

Все переменные дизайна находятся в `css/design-system.css`:
```css
:root {
  --primary-500: #3b82f6;  /* Основной цвет */
  --dark-900: #0f172a;     /* Фон */
  --text-base: 1rem;       /* Базовый размер шрифта */
  /* ... другие переменные */
}
```

## 📱 Браузерная поддержка

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🤝 Вклад в проект

1. Fork репозиторий
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add some amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект является демонстрационным. Все права защищены.

## 📞 Контакты

- **Email**: ai.specialist@example.com
- **LinkedIn**: [linkedin.com/in/ai-specialist](https://linkedin.com/in/ai-specialist)
- **GitHub**: [github.com/ai-specialist](https://github.com/ai-specialist)

---

**Статус проекта**: 🚧 В активной разработке

**Последнее обновление**: Март 2025
