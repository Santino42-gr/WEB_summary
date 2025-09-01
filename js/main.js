/*
========================================
MAIN JAVASCRIPT - Основная логика проекта
========================================
Модульная архитектура для интерактивного веб-резюме
*/

// ===== ОСНОВНОЙ КЛАСС ПРИЛОЖЕНИЯ =====

// ПРИНУДИТЕЛЬНАЯ ОЧИСТКА КЭША - версия 2.2
console.log('🔄 ВЕРСИЯ JS: 2.2 - ТОЛЬКО 5 ПРОЕКТОВ БЕЗ КНОПКИ');

class WebResumeApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.config = {
            apiBaseUrl: window.location.hostname === 'localhost' 
                ? 'http://localhost:3001/api' 
                : 'https://your-vercel-app.vercel.app/api',
            animationSpeed: 300,
            chatTypingDelay: 1000
        };
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Инициализация WebResumeApp...');
            
            // Ждем загрузки DOM
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeApp());
            } else {
                this.initializeApp();
            }
        } catch (error) {
            console.error('❌ Ошибка инициализации приложения:', error);
            this.showError('Ошибка загрузки приложения');
        }
    }

    async initializeApp() {
        try {
            // Инициализируем основные компоненты
            await this.initializeComponents();
            
            // Настраиваем обработчики событий
            this.setupEventListeners();
            
            // Инициализируем библиотеки
            this.initializeLibraries();
            
            // Загружаем данные
            await this.loadData();
            
            this.isInitialized = true;
            console.log('✅ WebResumeApp успешно инициализировано');
            
            // Скрываем загрузочный экран если есть
            this.hideLoadingIndicator();
            
        } catch (error) {
            console.error('❌ Ошибка инициализации компонентов:', error);
            this.showError('Не удалось загрузить все компоненты');
        }
    }

    async initializeComponents() {
        console.log('📦 Инициализация компонентов...');
        
        // Навигация
        this.components.navigation = new NavigationComponent();
        
        // RAG Чат
        this.components.ragChat = new RAGChat('chat');
        
        // Мультиагентная визуализация
        this.components.multiagentViz = new MultiagentVisualization();
        
        // AI Readiness Checklist
        this.components.aiReadiness = new AIReadinessChecklist();
        
        // Управление проектами
        this.components.projectsManager = new ProjectsManager();
        
        // Навыки и технологии
        this.components.skillsManager = new SkillsManager();
        
        // Утилиты
        this.components.utils = new UtilsHelper();
    }

    setupEventListeners() {
        // Smooth scrolling для навигации
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Обработка форм
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleContactForm.bind(this));
        }

        // Обработка ошибок
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));
    }

    initializeLibraries() {
        // Инициализируем AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out',
                once: true,
                offset: 100
            });
        }

        // Инициализируем Lucide иконки
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    async loadData() {
        console.log('📊 Загрузка данных...');
        
        try {
            // RAG Chat загружает базу знаний самостоятельно
            console.log('📚 RAG Chat загружает базу знаний самостоятельно...');

            // Загружаем проекты
            console.log('🔄 Начинаем загрузку проектов...');
            const projects = await this.loadJSON('./data/projects.json');
            console.log('📦 Данные проектов:', projects);
            
            if (projects) {
                console.log('✅ Проекты найдены, устанавливаем данные...');
                this.components.projectsManager.setProjects(projects.projects);
                this.components.projectsManager.render();
            } else {
                console.error('❌ Проекты не загружены, используем demo данные');
                this.loadDemoData();
            }

            // Загружаем навыки
            const skills = await this.loadJSON('./data/skills.json');
            if (skills) {
                this.components.skillsManager.setSkills(skills.skillCategories);
                this.components.skillsManager.render();
            }

            // Предложенные вопросы загружаются автоматически в RAGChat
            console.log('❓ RAG Chat загружает предложенные вопросы самостоятельно...');

            // Индекс поиска загружается автоматически в RAGChat
            console.log('🔍 RAG Chat загружает индекс поиска самостоятельно...');

            console.log('✅ Все данные успешно загружены');

        } catch (error) {
            console.warn('⚠️ Некоторые данные не удалось загрузить:', error);
            // Используем демо-данные
            this.loadDemoData();
        }
    }

    async loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.warn(`Не удалось загрузить ${url}:`, error);
            return null;
        }
    }

    loadDemoData() {
        console.log('🎭 Загрузка демо-данных...');
        
        // Демо проекты
        const demoProjects = [
            {
                id: 1,
                title: "RAG Chat System",
                subtitle: "Интеллектуальный чат-бот",
                description: "Система чат-бота с использованием RAG архитектуры для точных ответов на основе базы знаний",
                technologies: ["Python", "LangChain", "OpenAI", "FastAPI"],
                github: "https://github.com/example/rag-chat",
                demo: "https://rag-chat-demo.vercel.app",
                featured: true
            },
            {
                id: 2,
                title: "ML Pipeline Automation",
                subtitle: "Автоматизированный ML пайплайн",
                description: "Автоматизированный пайплайн для обучения и деплоя моделей машинного обучения с мониторингом",
                technologies: ["MLFlow", "Docker", "Kubernetes", "Python"],
                github: "https://github.com/example/ml-pipeline",
                featured: true
            }
        ];

        this.components.projectsManager.setProjects(demoProjects);
        this.components.projectsManager.render();

        // Демо навыки
        const demoSkills = [
            {
                category: "AI & Machine Learning",
                icon: "brain",
                skills: [
                    { name: "Python", level: "Эксперт", progress: 95 },
                    { name: "LangChain", level: "Продвинутый", progress: 85 },
                    { name: "OpenAI API", level: "Продвинутый", progress: 90 },
                    { name: "Transformers", level: "Средний", progress: 75 }
                ]
            },
            {
                category: "Frontend Development",
                icon: "code",
                skills: [
                    { name: "JavaScript", level: "Эксперт", progress: 90 },
                    { name: "React", level: "Продвинутый", progress: 85 },
                    { name: "Vue.js", level: "Средний", progress: 70 },
                    { name: "CSS/SCSS", level: "Продвинутый", progress: 88 }
                ]
            }
        ];

        this.components.skillsManager.setSkills(demoSkills);
        this.components.skillsManager.render();
    }

    async handleContactForm(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            this.showLoadingIndicator();
            
            // Здесь будет отправка на сервер
            console.log('📧 Отправка сообщения:', data);
            
            // Симуляция отправки
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showSuccess('Сообщение отправлено успешно!');
            e.target.reset();
            
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            this.showError('Не удалось отправить сообщение');
        } finally {
            this.hideLoadingIndicator();
        }
    }

    handleGlobalError(event) {
        console.error('Глобальная ошибка:', event.error);
        this.showError('Произошла неожиданная ошибка');
    }

    handleUnhandledRejection(event) {
        console.error('Необработанный promise:', event.reason);
        this.showError('Ошибка загрузки данных');
    }

    showLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.classList.remove('hidden');
        }
    }

    hideLoadingIndicator() {
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    showError(message) {
        const notification = document.getElementById('error-notification');
        if (notification) {
            const messageEl = notification.querySelector('.error-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
            notification.classList.remove('hidden');
            
            // Автоматически скрыть через 5 секунд
            setTimeout(() => {
                notification.classList.add('hidden');
            }, 5000);
        }
    }

    showSuccess(message) {
        // Создаем временное уведомление об успехе
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.style.backgroundColor = 'var(--success)';
        notification.innerHTML = `
            <div class="error-content">
                <i data-lucide="check-circle" class="error-icon"></i>
                <span class="error-message">${message}</span>
                <button class="error-close">
                    <i data-lucide="x"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);
        
        // Инициализируем иконки
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Обработчик закрытия
        notification.querySelector('.error-close').addEventListener('click', () => {
            notification.remove();
        });

        // Автоматическое удаление
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// ===== КОМПОНЕНТ НАВИГАЦИИ =====

class NavigationComponent {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Активация ссылок при скролле
        this.updateActiveLink();
        window.addEventListener('scroll', this.updateActiveLink.bind(this));
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('open');
        this.navToggle.classList.toggle('open');
        this.navToggle.setAttribute('aria-expanded', 
            this.navMenu.classList.contains('open'));
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ===== RAG CHAT КОМПОНЕНТ =====

class RAGChat {
    constructor(containerId = 'chat') {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.knowledgeBase = null;
        this.chatHistory = [];
        this.suggestedQuestions = null;
        this.searchIndex = null;
        
        // UI элементы (инициализируются в renderChatInterface)
        this.chatMessages = null;
        this.chatInput = null;
        this.sendButton = null;
        this.suggestions = null;
        
        this.init();
    }

    async init() {
        try {
            console.log('🤖 Инициализация RAG Chat...');
            
            // 1. Загружаем базу знаний
            await this.loadKnowledgeBase();
            
            // 2. Рендерим интерфейс чата (если контейнер найден)
            if (this.container) {
                this.renderChatInterface();
            } else {
                console.warn('⚠️ Контейнер чата не найден:', this.containerId);
                return;
            }
            
            // 3. Настраиваем обработчики событий
            this.setupEventListeners();
            
            console.log('✅ RAG Chat успешно инициализирован');
        } catch (error) {
            console.error('❌ Ошибка инициализации RAG Chat:', error);
            this.showErrorState();
        }
    }

    async loadKnowledgeBase() {
        try {
            // Загружаем основную базу знаний
            const knowledgeResponse = await fetch('./data/knowledge-base.json');
            this.knowledgeBase = await knowledgeResponse.json();
            console.log('📚 База знаний загружена:', this.knowledgeBase.documents?.length, 'документов');
            
            // Загружаем предложенные вопросы
            const questionsResponse = await fetch('./data/suggested-questions.json');
            this.suggestedQuestions = await questionsResponse.json();
            console.log('❓ Загружено вопросов:', this.suggestedQuestions.categories?.length, 'категорий');
            
            // Загружаем поисковый индекс
            const searchResponse = await fetch('./data/search-index.json');
            this.searchIndex = await searchResponse.json();
            console.log('🔍 Индекс поиска загружен');
            
        } catch (error) {
            console.error('❌ Ошибка загрузки базы знаний:', error);
            // Используем fallback данные
            this.knowledgeBase = this.getFallbackData();
            this.suggestedQuestions = this.getFallbackQuestions();
        }
    }

    renderChatInterface() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="chat-container">
                <div class="chat-header">
                    <h3 class="chat-title">
                        <i data-lucide="bot" style="width: 1.25em; height: 1.25em;"></i>
                        AI Ассистент
                    </h3>
                    <div class="chat-status">
                        <div class="chat-status-indicator"></div>
                        <span>Онлайн</span>
                    </div>
                </div>
                
                <div class="chat-messages custom-scrollbar" id="chat-messages">
                    ${this.renderWelcomeMessage()}
                </div>
                
                <!-- Chat States -->
                <div class="chat-empty-state" id="chat-empty-state" style="display: none;">
                    <div class="chat-empty-icon">
                        <i data-lucide="message-circle" style="width: 3rem; height: 3rem; opacity: 0.5;"></i>
                    </div>
                    <h3 class="chat-empty-title">Начните диалог</h3>
                    <p class="chat-empty-description">Выберите один из предложенных вопросов или напишите свой</p>
                </div>
                
                <div class="chat-loading-state" id="chat-loading-state" style="display: none;">
                    <div class="chat-loading-spinner">
                        <div class="chat-spinner"></div>
                    </div>
                    <p class="chat-loading-text">Инициализация AI-ассистента...</p>
                </div>
                
                <div class="chat-error-state" id="chat-error-state" style="display: none;">
                    <div class="chat-error-icon">
                        <i data-lucide="alert-circle" style="width: 2.5rem; height: 2.5rem; color: var(--error);"></i>
                    </div>
                    <h3 class="chat-error-title">Ошибка подключения</h3>
                    <p class="chat-error-description">Не удалось связаться с AI-ассистентом. Попробуйте обновить страницу.</p>
                    <button class="chat-retry-btn" id="chat-retry-btn">
                        <i data-lucide="refresh-cw" style="width: 1em; height: 1em;"></i>
                        Попробовать снова
                    </button>
                </div>
                
                <div class="chat-suggestions" id="chat-suggestions">
                    ${this.renderSuggestedQuestions()}
                </div>
                
                <div class="chat-input-container">
                    <textarea 
                        class="chat-input" 
                        id="chat-input"
                        placeholder="Напишите ваш вопрос..."
                        rows="1"
                        aria-label="Поле ввода сообщения чата"></textarea>
                    <button class="chat-send-btn" id="chat-send-btn" aria-label="Отправить сообщение">
                        <i data-lucide="send" style="width: 1.25em; height: 1.25em;"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Инициализируем UI элементы после рендеринга
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('chat-send-btn');
        this.suggestions = document.querySelectorAll('.chat-suggestion');
        
        // Инициализируем Lucide иконки
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    setupEventListeners() {
        if (this.sendButton) {
            this.sendButton.addEventListener('click', this.sendMessage.bind(this));
        }

        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Обновляем обработчики для suggested questions
        this.updateSuggestedQuestions();
        
        // Обработчик для кнопки retry
        const retryBtn = document.getElementById('chat-retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.hideErrorState();
                this.init();
            });
        }
    }

    // Методы для обратной совместимости (deprecated - используйте loadKnowledgeBase())
    setKnowledgeBase(knowledgeBase) {
        this.knowledgeBase = knowledgeBase;
        console.log('📚 База знаний загружена (deprecated method):', knowledgeBase.documents?.length, 'документов');
    }

    setSuggestedQuestions(suggestedQuestions) {
        this.suggestedQuestions = suggestedQuestions;
        this.updateSuggestedQuestions();
        console.log('❓ Загружено вопросов (deprecated method):', suggestedQuestions.categories?.length, 'категорий');
    }

    setSearchIndex(searchIndex) {
        this.searchIndex = searchIndex;
        console.log('🔍 Индекс поиска загружен (deprecated method)');
    }

    updateSuggestedQuestions() {
        if (!this.suggestedQuestions) return;

        const suggestionsContainer = document.getElementById('chat-suggestions');
        if (!suggestionsContainer) return;

        // Берем первые 4 быстрых вопроса
        const quickQuestions = this.suggestedQuestions.quickQuestions?.slice(0, 4) || [];
        
        suggestionsContainer.innerHTML = quickQuestions.map(question => 
            `<button class="chat-suggestion" data-question="${question}">
                ${question}
            </button>`
        ).join('');

        // Обновляем обработчики событий
        suggestionsContainer.querySelectorAll('.chat-suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                if (question && this.chatInput) {
                    this.chatInput.value = question;
                    this.sendMessage();
                }
            });
        });
    }

    async sendMessage() {
        const message = this.chatInput?.value.trim();
        if (!message) return;

        // Добавляем сообщение пользователя
        this.addMessage(message, 'user');
        this.addToHistory(message, 'user');
        this.chatInput.value = '';
        
        // Показываем индикатор печатания
        this.showTypingIndicator();
        
        // Блокируем кнопку отправки
        if (this.sendButton) {
            this.sendButton.disabled = true;
        }

        try {
            // Обрабатываем сообщение пользователя
            const responseData = await this.handleUserMessage(message);
            
            this.hideTypingIndicator();
            this.addMessage(responseData.text, 'assistant', responseData.sources);
            this.addToHistory(responseData.text, 'assistant');
            
        } catch (error) {
            this.hideTypingIndicator();
            const errorMessage = 'Извините, произошла ошибка при обработке вашего запроса. Попробуйте еще раз.';
            this.addMessage(errorMessage, 'assistant');
            console.error('❌ Ошибка RAG чата:', error);
        } finally {
            // Разблокируем кнопку отправки
            if (this.sendButton) {
                this.sendButton.disabled = false;
            }
        }
    }

    async handleUserMessage(message) {
        // Основная логика обработки сообщения пользователя согласно спецификации
        
        // 1. Поиск релевантного контекста
        const context = this.searchKnowledge(message);
        
        // 2. В production: вызов LLM API
        // const response = await this.callLLMAPI(message, context);
        
        // 3. Fallback для демо
        const response = await this.generateDemoResponse(message, context);
        
        return response;
    }

    async generateDemoResponse(message, context) {
        // Имитируем задержку API
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
        
        // Используем улучшенную логику генерации ответов с источниками
        return await this.generateResponseWithSources(message);
    }

    addToHistory(message, sender) {
        this.chatHistory.push({
            message,
            sender,
            timestamp: new Date().toISOString()
        });
        
        // Ограничиваем историю последними 20 сообщениями
        if (this.chatHistory.length > 20) {
            this.chatHistory = this.chatHistory.slice(-20);
        }
    }

    // Deprecated: используйте generateDemoResponse() или generateResponseWithSources()
    async generateResponse(message) {
        console.warn('⚠️ generateResponse() deprecated. Используйте generateDemoResponse()');
        const response = await this.generateDemoResponse(message, []);
        return response.text;
    }

    async generateResponseWithSources(message) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const lowerMessage = message.toLowerCase();
        let responseText = '';
        let sources = [];

        // Проверяем вопросы о LLM и промпт-инжиниринге
        if (lowerMessage.includes('llm') || lowerMessage.includes('промпт') || lowerMessage.includes('модел')) {
            responseText = "Мой опыт с LLM включает работу с Mistral API, создание RAG-систем и промпт-инжиниринг. Я руковожу командой из 7 ИИ-агентов, что ускоряет разработку в 5 раз. Специализируюсь на интеграции LLM в бизнес-процессы и создании мультиагентных архитектур.";
            sources = [
                { title: "Prompt Engineer & LLM Architect", type: "experience", relevance: 95, url: "#experience" },
                { title: "Mistral API Integration", type: "technology", relevance: 90, url: "#tech-stack" },
                { title: "Мультиагентная команда (7 ИИ-агентов)", type: "achievement", relevance: 88, url: "#projects" }
            ];
        }
        // Проверяем вопросы о RAG-системах
        else if (lowerMessage.includes('rag') || lowerMessage.includes('поиск') || lowerMessage.includes('вектор')) {
            responseText = "У меня есть глубокий опыт создания RAG-систем. Реализовал проекты: RAG для бухгалтерской компании, нейро-юриста с автоматизацией консультаций на 95%, и MCP Server для YClients. Использую векторные базы данных и advanced search для максимальной точности ответов.";
            sources = [
                { title: "RAG для бизнеса (бухгалтерская компания)", type: "project", relevance: 92, url: "#projects" },
                { title: "Нейро-Юрист (95% автоматизации)", type: "project", relevance: 90, url: "#projects" },
                { title: "MCP Server для YClients", type: "project", relevance: 88, url: "#projects" },
                { title: "Vector Database", type: "technology", relevance: 85, url: "#tech-stack" }
            ];
        }
        // Проверяем вопросы о техническом стеке
        else if (lowerMessage.includes('стек') || lowerMessage.includes('технолог') || lowerMessage.includes('инструмент')) {
            responseText = "Мой технический стек для ИИ-разработки: Mistral API для LLM, LangChain для RAG-архитектур, Vector Databases для семантического поиска, Docker для деплоя, и n8n для автоматизации. Также использую Claude API, Telegram Bot API и современные фреймворки для создания мультиагентных систем.";
            sources = [
                { title: "AI & LLM Frameworks", type: "technology", relevance: 95, url: "#tech-stack" },
                { title: "Vector & Data Tools", type: "technology", relevance: 90, url: "#tech-stack" },
                { title: "Development Stack", type: "technology", relevance: 88, url: "#tech-stack" },
                { title: "Integration & APIs", type: "technology", relevance: 85, url: "#tech-stack" }
            ];
        }
        // Проверяем вопросы о мультиагентных системах
        else if (lowerMessage.includes('мультиагент') || lowerMessage.includes('команд') || lowerMessage.includes('агент')) {
            responseText = "Создал уникальную мультиагентную систему из 7 специализированных ИИ-агентов: дизайнер, фронтенд-разработчик, бэкенд-разработчик, DevOps, QA-тестер, проект-менеджер и продакт-менеджер. Каждый агент имеет свою экспертизу и автономно выполняет задачи, что ускоряет разработку в 5 раз.";
            sources = [
                { title: "Multiagent Development Team", type: "project", relevance: 95, url: "#projects" },
                { title: "7 специализированных ИИ-агентов", type: "achievement", relevance: 92, url: "#about" },
                { title: "Ускорение разработки в 5 раз", type: "achievement", relevance: 88, url: "#about" }
            ];
        }
        // Вопросы о проектах
        else if (lowerMessage.includes('проект') || lowerMessage.includes('портфолио') || lowerMessage.includes('работ')) {
            responseText = "В моем портфолио 5 ключевых проектов: Face-Swap Bot (10K+ строк кода, viral инструмент), RAG для бизнеса (полная автоматизация), Нейро-Юрист (95% автоматизации консультаций), MCP Server (24/7 нейро-администратор), и Мультиагентная команда разработки. Все проекты демонстрируют практическое применение ИИ в бизнесе.";
            sources = [
                { title: "Face-Swap Bot для \"Новые Люди\"", type: "project", relevance: 90, url: "#projects" },
                { title: "RAG для бизнеса", type: "project", relevance: 88, url: "#projects" },
                { title: "Нейро-Юрист", type: "project", relevance: 86, url: "#projects" },
                { title: "MCP Server", type: "project", relevance: 84, url: "#projects" },
                { title: "Multiagent Development Team", type: "project", relevance: 82, url: "#projects" }
            ];
        }
        // Дефолтный ответ
        else {
            responseText = "Спасибо за вопрос! Я специализируюсь на промпт-инжиниринге, создании RAG-систем и мультиагентных архитектур. Руковожу командой из 7 ИИ-агентов и имею опыт реализации сложных ИИ-проектов для бизнеса. Задайте более конкретный вопрос о моем опыте!";
            sources = [
                { title: "Обо мне - Экспертиза", type: "experience", relevance: 85, url: "#about" },
                { title: "Технологический стек", type: "technology", relevance: 80, url: "#tech-stack" },
                { title: "Портфолио проектов", type: "project", relevance: 75, url: "#projects" }
            ];
        }

        return { text: responseText, sources: sources };
    }

    renderWelcomeMessage() {
        return `
            <div class="chat-message">
                <div class="chat-message-avatar">AI</div>
                <div class="chat-message-content">
                    <p>Привет! Я AI-ассистент, который знает все о профессиональном опыте и проектах Александра. Задайте любой вопрос!</p>
                    <div class="chat-message-time">Сейчас</div>
                </div>
            </div>
        `;
    }

    renderSuggestedQuestions() {
        if (!this.suggestedQuestions?.quickQuestions) {
            return `
                <button class="chat-suggestion" data-question="Расскажи о твоем опыте с LLM и промпт-инжинирингом">
                    <i data-lucide="brain" style="width: 1em; height: 1em;"></i>
                    Опыт с LLM
                </button>
                <button class="chat-suggestion" data-question="Какие проекты с RAG-системами ты реализовал?">
                    <i data-lucide="search" style="width: 1em; height: 1em;"></i>
                    RAG проекты
                </button>
                <button class="chat-suggestion" data-question="Какой у тебя технический стек для ИИ разработки?">
                    <i data-lucide="layers" style="width: 1em; height: 1em;"></i>
                    Технический стек
                </button>
                <button class="chat-suggestion" data-question="Как работает мультиагентная команда из 7 ИИ-агентов?">
                    <i data-lucide="users" style="width: 1em; height: 1em;"></i>
                    Мультиагентные системы
                </button>
            `;
        }

        return this.suggestedQuestions.quickQuestions.slice(0, 4).map(question => `
            <button class="chat-suggestion" data-question="${question}">
                <i data-lucide="help-circle" style="width: 1em; height: 1em;"></i>
                ${question.length > 25 ? question.substring(0, 25) + '...' : question}
            </button>
        `).join('');
    }

    getFallbackData() {
        return {
            documents: [
                {
                    id: "experience-llm",
                    title: "Опыт с LLM и Prompt Engineering",
                    content: "Специализируюсь на разработке интеллектуальных систем с использованием LLM. Имею опыт работы с Mistral API, создания RAG-архитектур и мультиагентных команд.",
                    keywords: ["llm", "prompt", "mistral", "ai", "архитектура"],
                    category: "experience"
                },
                {
                    id: "projects-rag",
                    title: "RAG проекты",
                    content: "Реализовал несколько RAG-систем: для бухгалтерской компании, нейро-юриста с 95% автоматизации, MCP Server для YClients с 24/7 работой.",
                    keywords: ["rag", "проект", "автоматизация", "бизнес"],
                    category: "projects"
                },
                {
                    id: "tech-stack",
                    title: "Технический стек",
                    content: "Использую современные технологии: Mistral API, LangChain, Vector Databases, Docker, n8n, Claude API, Telegram Bot API для создания ИИ-решений.",
                    keywords: ["стек", "технологии", "mistral", "langchain", "docker"],
                    category: "technology"
                }
            ],
            categories: ["experience", "projects", "technology"],
            demoResponses: {
                "llm": "Мой опыт с LLM включает работу с Mistral API и создание промпт-архитектур для различных бизнес-задач.",
                "rag": "Реализовал несколько RAG-систем с высокой точностью поиска и автоматизацией процессов.",
                "проект": "В портфолио есть проекты Face-Swap Bot, RAG для бизнеса, Нейро-Юрист и мультиагентная команда."
            }
        };
    }

    getFallbackQuestions() {
        return {
            quickQuestions: [
                "Расскажи о твоем опыте с LLM",
                "Какие RAG проекты ты реализовал?",
                "Твой технический стек",
                "Как работает мультиагентная команда?"
            ],
            categories: [
                {
                    name: "Опыт и экспертиза",
                    questions: ["Опыт с LLM", "Промпт-инжиниринг", "Архитектура ИИ"]
                }
            ]
        };
    }

    showErrorState() {
        const errorState = document.getElementById('chat-error-state');
        const chatMessages = document.getElementById('chat-messages');
        const suggestions = document.getElementById('chat-suggestions');
        
        if (errorState) errorState.style.display = 'flex';
        if (chatMessages) chatMessages.style.display = 'none';
        if (suggestions) suggestions.style.display = 'none';
    }

    hideErrorState() {
        const errorState = document.getElementById('chat-error-state');
        const chatMessages = document.getElementById('chat-messages');
        const suggestions = document.getElementById('chat-suggestions');
        
        if (errorState) errorState.style.display = 'none';
        if (chatMessages) chatMessages.style.display = 'flex';
        if (suggestions) suggestions.style.display = 'flex';
    }

    showLoadingState() {
        const loadingState = document.getElementById('chat-loading-state');
        const chatMessages = document.getElementById('chat-messages');
        
        if (loadingState) loadingState.style.display = 'flex';
        if (chatMessages) chatMessages.style.display = 'none';
    }

    hideLoadingState() {
        const loadingState = document.getElementById('chat-loading-state');
        const chatMessages = document.getElementById('chat-messages');
        
        if (loadingState) loadingState.style.display = 'none';
        if (chatMessages) chatMessages.style.display = 'flex';
    }

    searchKnowledge(query) {
        if (!this.knowledgeBase?.documents) return [];

        const lowerQuery = query.toLowerCase();
        const keywords = lowerQuery.split(' ').filter(word => word.length > 2);
        const relevantDocs = [];
        
        // Поиск по документам с вычислением релевантности
        for (const doc of this.knowledgeBase.documents) {
            let relevanceScore = 0;
            
            // Поиск в заголовке (вес 3)
            if (doc.title?.toLowerCase().includes(lowerQuery)) {
                relevanceScore += 3;
            }
            
            // Поиск в ключевых словах (вес 2)
            if (doc.keywords) {
                for (const keyword of doc.keywords) {
                    if (keywords.some(q => keyword.toLowerCase().includes(q))) {
                        relevanceScore += 2;
                    }
                }
            }
            
            // Поиск в содержимом (вес 1)
            if (doc.content) {
                for (const keyword of keywords) {
                    const regex = new RegExp(keyword, 'gi');
                    const matches = doc.content.match(regex);
                    if (matches) {
                        relevanceScore += matches.length;
                    }
                }
            }
            
            if (relevanceScore > 0) {
                relevantDocs.push({
                    ...doc,
                    relevance: relevanceScore
                });
            }
        }
        
        // Сортируем по релевантности и возвращаем топ-3
        return relevantDocs
            .sort((a, b) => b.relevance - a.relevance)
            .slice(0, 3);
    }

    // Для обратной совместимости
    searchKnowledgeBase(query) {
        const results = this.searchKnowledge(query);
        return results.length > 0 ? results[0] : null;
    }

    addMessage(content, sender, sources = null) {
        if (!this.chatMessages) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message chat-message-enter ${sender === 'user' ? 'user' : 'assistant'}`;
        
        let sourcesHtml = '';
        if (sources && sources.length > 0) {
            sourcesHtml = `
                <div class="chat-sources">
                    <div class="chat-sources-header">
                        <i data-lucide="file-text" style="width: 16px; height: 16px;"></i>
                        Источники информации
                    </div>
                    <div class="chat-sources-list">
                        ${sources.map(source => `
                            <div class="chat-source-item" onclick="window.open('${source.url || '#'}', '_blank')">
                                <div class="chat-source-icon">
                                    <i data-lucide="${this.getSourceIcon(source.type)}" style="width: 16px; height: 16px;"></i>
                                </div>
                                <div class="chat-source-content">
                                    <div class="chat-source-title">${source.title}</div>
                                    <div class="chat-source-type">${source.type}</div>
                                </div>
                                <div class="chat-source-relevance">
                                    <div class="chat-relevance-bar">
                                        <div class="chat-relevance-fill" style="width: ${source.relevance || 85}%"></div>
                                    </div>
                                    <span>${source.relevance || 85}%</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        messageEl.innerHTML = `
            <div class="chat-message-avatar">${sender === 'user' ? 'Вы' : 'AI'}</div>
            <div class="chat-message-content">
                <p>${content}</p>
                <div class="chat-message-time">${new Date().toLocaleTimeString()}</div>
                ${sourcesHtml}
            </div>
        `;

        this.chatMessages.appendChild(messageEl);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        
        // Инициализируем Lucide иконки для новых элементов
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    getSourceIcon(type) {
        const icons = {
            'project': 'folder',
            'experience': 'briefcase',
            'skill': 'star',
            'technology': 'cpu',
            'achievement': 'trophy',
            'education': 'graduation-cap',
            'default': 'file-text'
        };
        return icons[type] || icons.default;
    }

    showTypingIndicator() {
        if (!this.chatMessages) return;

        const typingEl = document.createElement('div');
        typingEl.className = 'chat-typing-indicator';
        typingEl.innerHTML = `
            <div class="chat-message-avatar">AI</div>
            <div class="chat-typing-dots">
                <div class="chat-typing-dot"></div>
                <div class="chat-typing-dot"></div>
                <div class="chat-typing-dot"></div>
            </div>
        `;

        this.chatMessages.appendChild(typingEl);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = this.chatMessages?.querySelector('.chat-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// ===== ЗАГЛУШКИ ДЛЯ ДРУГИХ КОМПОНЕНТОВ =====

class MultiagentVisualization {
    constructor() {
        console.log('🤖 MultiagentVisualization инициализирован');
        // Будет реализован в следующих задачах
    }
}

class AIReadinessChecklist {
    constructor() {
        console.log('✅ AIReadinessChecklist инициализирован');
        // Будет реализован в следующих задачах
    }
}

class ProjectsManager {
    constructor() {
        this.projects = [];
        this.container = null;
        console.log('🏗️ ProjectsManager инициализирован');
    }

    setProjects(projects) {
        this.projects = projects;
        console.log('🚀 Проекты загружены:', projects?.length, 'проектов');
    }

    render() {
        // Переинициализируем контейнер если он не найден
        if (!this.container) {
            this.container = document.getElementById('projects-grid');
            console.log('🔍 Ищем контейнер projects-grid:', !!this.container);
        }
        
        if (!this.container) {
            console.error('❌ Контейнер projects-grid не найден!');
            return;
        }

        if (!this.projects || !this.projects.length) {
            console.warn('⚠️ Нет проектов для отображения, загружаем demo данные...');
            this.loadDemoProjects();
            return;
        }

        console.log('🎬 Начинаем рендеринг', this.projects?.length || 0, 'проектов');

        // Показываем все проекты (первые 5)
        const projectsToShow = (this.projects || []).slice(0, 5);

        this.container.innerHTML = projectsToShow.map((project, index) => {
            // Защита от undefined проекта
            if (!project) {
                console.warn('⚠️ Пропускаем undefined проект на индексе', index);
                return '';
            }
            
            const projectType = this.getProjectType(project);
            const glowClass = this.getGlowClass(projectType);
            const gradientClass = this.getGradientClass(projectType);
            const iconName = this.getProjectIcon(projectType);
            
            return `
                <div class="project-card-interactive" data-aos="fade-up" data-aos-delay="${100 + index * 100}" data-project-id="${project.id}" data-project-type="${projectType}">
                    <div class="project-glow-effect ${glowClass}"></div>
                    
                    ${project.featured ? '<div class="project-featured-badge">Featured</div>' : ''}
                    
                    <div class="project-icon-container ${gradientClass}">
                        <i data-lucide="${iconName}"></i>
                        <div class="project-icon-pulse"></div>
                    </div>
                    
                    <div class="project-content-interactive">
                        <h3 class="project-title-interactive">${project.title}</h3>
                        <p class="project-subtitle-interactive">${project.subtitle}</p>
                        <p class="project-description-interactive">${project.description}</p>
                        
                        <div class="project-metrics-interactive">
                            ${Array.isArray(project.metrics) ? project.metrics.slice(0, 2).map(metric => {
                                const metricStr = String(metric || '');
                                const parts = metricStr.split(' ');
                                return `
                                    <div class="project-metric-interactive">
                                        <span class="project-metric-value">${parts[0] || ''}</span>
                                        <span class="project-metric-label">${parts.slice(1).join(' ')}</span>
                                    </div>
                                `;
                            }).join('') : ''}
                        </div>
                        
                        <div class="project-tech-tags-interactive">
                            ${Array.isArray(project.technologies) ? project.technologies.slice(0, 4).map((tech, techIndex) => {
                                const techClass = this.getTechPillClass(tech, techIndex);
                                return `<span class="project-tech-pill ${techClass}">${String(tech || '')}</span>`;
                            }).join('') : ''}
                        </div>
                        
                        <div class="project-actions-interactive">
                            <button class="project-btn-interactive primary" onclick="openProjectModal(${project.id})">
                                <i data-lucide="info" style="width: 16px; height: 16px;"></i>
                                Подробнее
                            </button>
                            
                            ${project.demo ? `
                                <a href="${project.demo}" class="project-btn-interactive secondary" target="_blank" rel="noopener noreferrer">
                                    <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                                    Демо
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Инициализируем иконки Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.setupProjectInteractions();
        
        // Переинициализируем интерактивные эффекты для новых карточек
        if (window.interactiveEffects) {
            window.interactiveEffects.initMouseTrackingCards();
            window.interactiveEffects.initPulseAnimations();
        }
        
        console.log('✅ Рендеринг проектов завершен!');
    }

    loadDemoProjects() {
        console.log('🔧 Загружаем demo проекты...');
        const demoProjects = [
            {
                id: 1,
                title: "Face-Swap Bot",
                subtitle: "Viral маркетинг инструмент",
                description: "Telegram-бот для создания стикер-паков с технологией face-swap",
                technologies: ["Node.js", "Piapi AI", "Telegram Bot API", "Docker"],
                metrics: ["10K+ строк кода", "50+ пользователей"],
                featured: true,
                demo: "https://t.me/demo"
            },
            {
                id: 2,
                title: "Нейро-Юрист",
                subtitle: "AI консультант",
                description: "Система автоматизации юридических консультаций с Mistral API",
                technologies: ["Mistral API", "RAG", "Vector Database"],
                metrics: ["95% автоматизации", "100+ консультаций"],
                featured: true
            },
            {
                id: 3,
                title: "MCP Server",
                subtitle: "YClients Integration",
                description: "Нейро-администратор для автоматизации записи клиентов",
                technologies: ["MCP Protocol", "YClients API", "Claude"],
                metrics: ["100% автоматизации", "24/7 работа"],
                featured: true
            },
            {
                id: 4,
                title: "Multiagent Development Team",
                subtitle: "Автономная команда из 7 ИИ-агентов",
                description: "Система управления командой из 7 специализированных ИИ-агентов для автономной разработки",
                technologies: ["Claude Code", "Cursor", "MCP Servers", "AI Orchestration"],
                metrics: ["7 специализированных агентов", "5x ускорение разработки"],
                featured: true
            },
            {
                id: 5,
                title: "RAG-системы для бизнеса",
                subtitle: "Боты для бухгалтерской компании",
                description: "Комплексное решение RAG + CRM интеграция для автоматизации leads и базы знаний",
                technologies: ["Vector Embeddings", "Битрикс24 API", "Knowledge Base"],
                metrics: ["95% точность ответов", "Автоматизация leads"],
                featured: false
            }
        ];
        
        this.projects = demoProjects;
        console.log('🚀 Demo проекты загружены:', demoProjects.length);
        this.render();
    }

    getProjectType(project) {
        const title = project.title.toLowerCase();
        if (title.includes('bot') || title.includes('telegram')) return 'bot';
        if (title.includes('ai') || title.includes('llm') || title.includes('нейро')) return 'ai';
        if (title.includes('mcp') || title.includes('server') || title.includes('integration')) return 'integration';
        if (title.includes('rag') || title.includes('автоматизация')) return 'automation';
        return 'development';
    }

    getGlowClass(projectType) {
        const glowMap = {
            'bot': 'project-bot-glow',
            'ai': 'project-ai-glow',
            'integration': 'project-integration-glow',
            'automation': 'project-automation-glow',
            'development': 'project-development-glow'
        };
        return glowMap[projectType] || 'project-ai-glow';
    }

    getGradientClass(projectType) {
        const gradientMap = {
            'bot': 'project-bot-gradient',
            'ai': 'project-ai-gradient',
            'integration': 'project-integration-gradient',
            'automation': 'project-automation-gradient',
            'development': 'project-development-gradient'
        };
        return gradientMap[projectType] || 'project-ai-gradient';
    }

    getProjectIcon(projectType) {
        const iconMap = {
            'bot': 'message-circle',
            'ai': 'brain',
            'integration': 'plug',
            'automation': 'zap',
            'development': 'code'
        };
        return iconMap[projectType] || 'brain';
    }

    getTechPillClass(tech, index) {
        const techLower = tech.toLowerCase();
        
        // AI/LLM технологии - синий
        if (techLower.includes('ai') || techLower.includes('api') || techLower.includes('gpt') || 
            techLower.includes('claude') || techLower.includes('mistral') || techLower.includes('openai') ||
            techLower.includes('piapi')) {
            return 'primary';
        }
        
        // Базы данных и векторы - зеленый
        if (techLower.includes('vector') || techLower.includes('database') || techLower.includes('pinecone') ||
            techLower.includes('chroma') || techLower.includes('rag') || techLower.includes('langchain')) {
            return 'secondary';
        }
        
        // Integration и MCP - фиолетовый
        if (techLower.includes('mcp') || techLower.includes('protocol') || techLower.includes('integration') ||
            techLower.includes('webhook') || techLower.includes('битрикс') || techLower.includes('yclients')) {
            return 'violet';
        }
        
        // Bot технологии - розовый
        if (techLower.includes('bot') || techLower.includes('telegram')) {
            return 'rose';
        }
        
        // Development - оранжевый (по умолчанию)
        return 'accent';
    }

    setupProjectInteractions() {
        // Обработчик для карточек проектов
        document.querySelectorAll('.project-card-interactive').forEach(card => {
            card.addEventListener('click', (e) => {
                // Не открываем модал если кликнули по кнопке
                if (e.target.closest('.project-btn-interactive') || e.target.closest('a')) return;
                
                const projectId = parseInt(card.getAttribute('data-project-id'));
                if (window.openProjectModal) {
                    window.openProjectModal(projectId);
                }
            });
        });


    }


}

class SkillsManager {
    constructor() {
        this.skills = [];
        this.container = document.getElementById('skills-container');
    }

    setSkills(skills) {
        this.skills = skills;
        console.log('🎯 Навыки загружены:', skills?.length, 'категорий');
    }

    render() {
        if (!this.container || !this.skills.length) return;

        this.container.innerHTML = `
            <div class="skills-grid">
                ${this.skills.map(category => `
                    <div class="skill-category" data-aos="fade-up">
                        <h3 class="skill-category-title">
                            <i data-lucide="${category.icon}" class="skill-category-icon"></i>
                            ${category.category}
                        </h3>
                        <div class="skills-list">
                            ${category.skills.map(skill => `
                                <div class="skill-item">
                                    <div class="skill-info">
                                        <span class="skill-name">${skill.name}</span>
                                        <span class="skill-level">${skill.level}</span>
                                    </div>
                                    <div class="skill-progress">
                                        <div class="skill-progress-bar" style="width: ${skill.progress}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Обновляем иконки
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

class UtilsHelper {
    constructor() {
        console.log('🛠️ UtilsHelper инициализирован');
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('ru-RU').format(new Date(date));
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ===== MODAL FUNCTIONS =====

// Функции для работы с модальными окнами
function openProjectModal(projectId) {
    const app = window.webResumeApp;
    const project = app.components.projectsManager.projects.find(p => p.id === projectId);
    
    if (!project) return;

    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    modalTitle.textContent = project.title;
    
    // Создаем изображение проекта на основе ID
    const projectImages = {
        1: 'https://via.placeholder.com/400x250/1a1a1a/3b82f6?text=Face-Swap+Bot',
        2: 'https://via.placeholder.com/400x250/1a1a1a/10b981?text=Нейро-Юрист',
        3: 'https://via.placeholder.com/400x250/1a1a1a/8b5cf6?text=MCP+Server',
        4: 'https://via.placeholder.com/400x250/1a1a1a/f59e0b?text=Multiagent+Team',
        5: 'https://via.placeholder.com/400x250/1a1a1a/ef4444?text=RAG+Системы'
    };

    modalBody.innerHTML = `
        <div class="project-modal-content">
            <div class="project-modal-image">
                <img src="${projectImages[project.id]}" alt="${project.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: var(--radius-lg);">
                <div style="position: absolute; bottom: 10px; right: 10px; background: var(--primary-500); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${project.subtitle}
                </div>
            </div>
            
            <div>
                <h4 style="color: var(--dark-50); margin-bottom: var(--space-3);">Подробное описание</h4>
                <p style="color: var(--dark-300); line-height: 1.6; margin-bottom: var(--space-4);">
                    ${project.detailedDescription || project.description}
                </p>
            </div>

            <div>
                <h4 style="color: var(--dark-50); margin-bottom: var(--space-3);">Технологии</h4>
                <div class="project-technologies" style="margin-bottom: var(--space-4);">
                    ${Array.isArray(project.technologies) ? project.technologies.map(tech => 
                        `<span class="project-tech-tag">${tech}</span>`
                    ).join('') : ''}
                </div>
            </div>

            ${project.achievements ? `
            <div>
                <h4 style="color: var(--dark-50); margin-bottom: var(--space-3);">✅ Основные достижения</h4>
                <ul class="project-modal-list" style="color: var(--dark-300); margin-bottom: var(--space-4);">
                    ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            </div>` : ''}

            ${project.challenges ? `
            <div>
                <h4 style="color: var(--dark-50); margin-bottom: var(--space-3);">⚡ Технические вызовы</h4>
                <ul class="project-modal-list" style="color: var(--dark-300); margin-bottom: var(--space-4);">
                    ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                </ul>
            </div>` : ''}

            <div>
                <h4 style="color: var(--dark-50); margin-bottom: var(--space-3);">Результаты и метрики</h4>
                <div class="project-metrics" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); margin-bottom: var(--space-4);">
                    ${Array.isArray(project.metrics) ? project.metrics.map(metric => {
                        const parts = String(metric).split(' ');
                        return `
                            <div class="project-metric">
                                <span class="project-metric-value">${parts[0] || ''}</span>
                                <span class="project-metric-label">${parts.slice(1).join(' ')}</span>
                            </div>
                        `;
                    }).join('') : ''}
                </div>
            </div>

            <div class="project-actions" style="justify-content: center; margin-top: var(--space-6); gap: var(--space-3);">
                ${project.demo ? `<a href="${project.demo}" class="project-btn project-btn-primary" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                    Открыть проект
                </a>` : ''}
                ${project.avitoUrl ? `<a href="${project.avitoUrl}" class="project-btn project-btn-outline" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="shopping-bag" style="width: 16px; height: 16px;"></i>
                    Авито
                </a>` : ''}
                ${project.github ? `<a href="${project.github}" class="project-btn project-btn-outline" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="github" style="width: 16px; height: 16px;"></i>
                    GitHub
                </a>` : ''}
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Инициализируем иконки
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function openContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Сбрасываем форму
    const form = document.getElementById('contact-form');
    const successDiv = document.getElementById('contact-success');
    
    if (form) form.style.display = 'block';
    if (successDiv) successDiv.style.display = 'none';
    
    // Очищаем поля формы
    if (form) form.reset();
    
    // Очищаем ошибки
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
    });
}

// Обработчики для модальных окон
document.addEventListener('DOMContentLoaded', function() {
    // Закрытие модалов по клику на overlay
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeProjectModal();
            closeContactModal();
        }
        
        if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
            closeProjectModal();
            closeContactModal();
        }
    });

    // Закрытие модалов по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeProjectModal();
            closeContactModal();
        }
    });

    // Обработка формы контактов
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Простая валидация
            const name = document.getElementById('contact-name');
            const email = document.getElementById('contact-email');
            const message = document.getElementById('contact-message');
            
            let isValid = true;
            
            // Очищаем предыдущие ошибки
            document.querySelectorAll('.error-message').forEach(error => {
                error.classList.remove('show');
            });
            
            if (!name.value.trim()) {
                document.getElementById('name-error').textContent = 'Имя обязательно';
                document.getElementById('name-error').classList.add('show');
                isValid = false;
            }
            
            if (!email.value.trim() || !email.value.includes('@')) {
                document.getElementById('email-error').textContent = 'Введите корректный email';
                document.getElementById('email-error').classList.add('show');
                isValid = false;
            }
            
            if (!message.value.trim()) {
                document.getElementById('message-error').textContent = 'Сообщение обязательно';
                document.getElementById('message-error').classList.add('show');
                isValid = false;
            }
            
            if (isValid) {
                // Симуляция отправки
                setTimeout(() => {
                    contactForm.style.display = 'none';
                    document.getElementById('contact-success').style.display = 'block';
                }, 1000);
            }
        });
    }
});

// Экспортируем функции в глобальную область
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;

// ===== ИНТЕРАКТИВНЫЕ ЭФФЕКТЫ ДЛЯ КАРТОЧЕК ЭКСПЕРТИЗЫ =====

class InteractiveEffects {
    constructor() {
        this.init();
    }

    init() {
        this.initMouseTrackingCards();
        this.initPulseAnimations();
        this.initTechStackInteractions();
        console.log('🎭 Интерактивные эффекты инициализированы');
    }

    initMouseTrackingCards() {
        // Mouse tracking для карточек экспертизы
        const expertiseCards = document.querySelectorAll('.expertise-card-compact');
        
        expertiseCards.forEach(card => {
            const cardGlow = card.querySelector('.card-glow-effect');
            
            if (cardGlow) {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    cardGlow.style.setProperty('--mouse-x', `${x}px`);
                    cardGlow.style.setProperty('--mouse-y', `${y}px`);
                });
                
                card.addEventListener('mouseleave', () => {
                    cardGlow.style.removeProperty('--mouse-x');
                    cardGlow.style.removeProperty('--mouse-y');
                });
            }
        });

        // Mouse tracking для карточек проектов
        const projectCards = document.querySelectorAll('.project-card-interactive');
        
        projectCards.forEach(card => {
            const cardGlow = card.querySelector('.project-glow-effect');
            
            if (cardGlow) {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    cardGlow.style.setProperty('--mouse-x', `${x}px`);
                    cardGlow.style.setProperty('--mouse-y', `${y}px`);
                });
                
                card.addEventListener('mouseleave', () => {
                    cardGlow.style.removeProperty('--mouse-x');
                    cardGlow.style.removeProperty('--mouse-y');
                });
            }
        });
    }

    initPulseAnimations() {
        // Добавляем случайную задержку для pulse анимаций экспертизы
        const expertisePulseElements = document.querySelectorAll('.icon-pulse');
        
        expertisePulseElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.7}s`;
        });

        // Добавляем случайную задержку для pulse анимаций проектов
        const projectPulseElements = document.querySelectorAll('.project-icon-pulse');
        
        projectPulseElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 1.2}s`;
        });
    }

    // Добавляем функцию для технических карточек с hover эффектами
    initTechStackInteractions() {
        const techChips = document.querySelectorAll('.tech-chip');
        
        techChips.forEach(chip => {
            chip.addEventListener('mouseenter', () => {
                // Добавляем дополнительный glow эффект
                if (chip.classList.contains('featured')) {
                    chip.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.5)';
                } else {
                    chip.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.2)';
                }
            });
            
            chip.addEventListener('mouseleave', () => {
                // Убираем дополнительный эффект
                chip.style.boxShadow = '';
            });
        });
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====

// Создаем глобальный экземпляр приложения
window.webResumeApp = new WebResumeApp();

// Инициализируем интерактивные эффекты
document.addEventListener('DOMContentLoaded', () => {
    const interactiveEffects = new InteractiveEffects();
    window.interactiveEffects = interactiveEffects;
    
    // Принудительная проверка рендеринга проектов через 1 секунду
    setTimeout(() => {
        console.log('🔄 Принудительная проверка рендеринга проектов...');
        if (window.webResumeApp && window.webResumeApp.components.projectsManager) {
            const projectsManager = window.webResumeApp.components.projectsManager;
            if (!projectsManager.projects || !projectsManager.projects.length) {
                console.log('🔧 Принудительная загрузка demo проектов...');
                projectsManager.loadDemoProjects();
            } else {
                console.log('✅ Проекты уже загружены, повторный рендеринг...');
                projectsManager.render();
            }
        }
    }, 1000);
});

// Экспортируем компоненты для использования в других файлах
window.WebResumeComponents = {
    RAGChat,
    MultiagentVisualization,
    AIReadinessChecklist,
    ProjectsManager,
    SkillsManager,
    UtilsHelper
};

