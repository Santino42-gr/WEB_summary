/*
========================================
MAIN JAVASCRIPT - Основная логика проекта
========================================
Модульная архитектура для интерактивного веб-резюме
*/

// ===== ОСНОВНОЙ КЛАСС ПРИЛОЖЕНИЯ =====

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
        this.components.ragChat = new RAGChatComponent(this.config.apiBaseUrl);
        
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
            // Загружаем базу знаний
            const knowledgeBase = await this.loadJSON('/data/knowledge-base.json');
            if (knowledgeBase) {
                this.components.ragChat.setKnowledgeBase(knowledgeBase);
            }

            // Загружаем проекты
            const projects = await this.loadJSON('/data/projects.json');
            if (projects) {
                this.components.projectsManager.setProjects(projects);
                this.components.projectsManager.render();
            }

            // Загружаем навыки
            const skills = await this.loadJSON('/data/skills.json');
            if (skills) {
                this.components.skillsManager.setSkills(skills);
                this.components.skillsManager.render();
            }

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

// ===== RAG CHAT КОМПОНЕНТ (заглушка) =====

class RAGChatComponent {
    constructor(apiBaseUrl) {
        this.apiBaseUrl = apiBaseUrl;
        this.knowledgeBase = null;
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('chat-send-btn');
        this.suggestions = document.querySelectorAll('.chat-suggestion');
        
        this.init();
    }

    init() {
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

        this.suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const question = suggestion.getAttribute('data-question');
                if (question && this.chatInput) {
                    this.chatInput.value = question;
                    this.sendMessage();
                }
            });
        });
    }

    setKnowledgeBase(knowledgeBase) {
        this.knowledgeBase = knowledgeBase;
    }

    async sendMessage() {
        const message = this.chatInput?.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.showTypingIndicator();

        try {
            const response = await this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'assistant');
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('Извините, произошла ошибка. Попробуйте еще раз.', 'assistant');
            console.error('Ошибка RAG чата:', error);
        }
    }

    async generateResponse(message) {
        // Заглушка - в реальности здесь будет вызов API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const demoResponses = {
            'llm': 'Я работаю с различными LLM: GPT-4, Claude, Mistral. Создавал чат-боты и RAG-системы.',
            'rag': 'RAG (Retrieval-Augmented Generation) - это архитектура, которая сочетает поиск релевантной информации с генерацией ответов. Я использовал её в нескольких проектах.',
            'стек': 'Мой технический стек: Python, JavaScript, React, FastAPI, LangChain, OpenAI API, Docker.'
        };

        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(demoResponses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        return 'Спасибо за вопрос! Я специализируюсь на разработке AI-решений и буду рад обсудить детали моего опыта.';
    }

    addMessage(content, sender) {
        if (!this.chatMessages) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message chat-message-enter ${sender === 'user' ? 'user' : ''}`;
        
        messageEl.innerHTML = `
            <div class="chat-message-avatar">${sender === 'user' ? 'Вы' : 'AI'}</div>
            <div class="chat-message-content">
                <p>${content}</p>
                <div class="chat-message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageEl);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
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
        this.container = document.querySelector('#projects .grid');
    }

    setProjects(projects) {
        this.projects = projects;
    }

    render() {
        if (!this.container || !this.projects.length) return;

        this.container.innerHTML = this.projects.map(project => `
            <div class="project-card" data-aos="fade-up">
                <div class="project-card-header">
                    <h3 class="project-card-title">${project.title}</h3>
                    <p class="project-card-subtitle">${project.subtitle}</p>
                </div>
                <p class="project-card-description">${project.description}</p>
                <div class="project-card-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-card-footer">
                    <div class="project-links">
                        ${project.github ? `<a href="${project.github}" class="project-link" target="_blank">
                            <i data-lucide="github"></i> GitHub
                        </a>` : ''}
                        ${project.demo ? `<a href="${project.demo}" class="project-link" target="_blank">
                            <i data-lucide="external-link"></i> Demo
                        </a>` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Обновляем иконки
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

class SkillsManager {
    constructor() {
        this.skills = [];
        this.container = document.getElementById('skills-container');
    }

    setSkills(skills) {
        this.skills = skills;
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

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====

// Создаем глобальный экземпляр приложения
window.webResumeApp = new WebResumeApp();

// Экспортируем компоненты для использования в других файлах
window.WebResumeComponents = {
    RAGChatComponent,
    MultiagentVisualization,
    AIReadinessChecklist,
    ProjectsManager,
    SkillsManager,
    UtilsHelper
};
