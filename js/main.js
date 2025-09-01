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
            const knowledgeBase = await this.loadJSON('./data/knowledge-base.json');
            if (knowledgeBase) {
                this.components.ragChat.setKnowledgeBase(knowledgeBase);
            }

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

            // Загружаем предложенные вопросы
            const suggestedQuestions = await this.loadJSON('./data/suggested-questions.json');
            if (suggestedQuestions) {
                this.components.ragChat.setSuggestedQuestions(suggestedQuestions);
            }

            // Загружаем индекс поиска
            const searchIndex = await this.loadJSON('./data/search-index.json');
            if (searchIndex) {
                this.components.ragChat.setSearchIndex(searchIndex);
            }

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
        console.log('📚 База знаний загружена:', knowledgeBase.documents?.length, 'документов');
    }

    setSuggestedQuestions(suggestedQuestions) {
        this.suggestedQuestions = suggestedQuestions;
        this.updateSuggestedQuestions();
        console.log('❓ Загружено вопросов:', suggestedQuestions.categories?.length, 'категорий');
    }

    setSearchIndex(searchIndex) {
        this.searchIndex = searchIndex;
        console.log('🔍 Индекс поиска загружен');
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
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Используем улучшенные демо-ответы из базы знаний
        if (this.knowledgeBase?.demoResponses) {
            const lowerMessage = message.toLowerCase();
            
            // Проверяем демо-ответы
            for (const [key, response] of Object.entries(this.knowledgeBase.demoResponses)) {
                if (lowerMessage.includes(key)) {
                    return response;
                }
            }
        }

        // Поиск в документах базы знаний
        if (this.knowledgeBase?.documents) {
            const relevantDoc = this.searchKnowledgeBase(message);
            if (relevantDoc) {
                return `${relevantDoc.content}\n\n💡 *Источник: ${relevantDoc.title}*`;
            }
        }

        // Fallback responses
        const fallbackResponses = [
            'Спасибо за вопрос! Я специализируюсь на Prompt Engineering, RAG системах и мультиагентных решениях. Уточните, что именно вас интересует?',
            'Интересная тема! Хотя точной информации по этому вопросу нет, я могу рассказать о релевантном опыте из моих проектов.',
            'Могу поделиться опытом из схожих проектов. Например, в работе с Mistral API или RAG системами я сталкивался с похожими задачами.'
        ];

        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }

    searchKnowledgeBase(query) {
        if (!this.knowledgeBase?.documents) return null;

        const lowerQuery = query.toLowerCase();
        
        // Простой поиск по ключевым словам и содержимому
        for (const doc of this.knowledgeBase.documents) {
            const hasKeywordMatch = doc.keywords?.some(keyword => 
                lowerQuery.includes(keyword.toLowerCase())
            );
            
            const hasContentMatch = doc.content?.toLowerCase().includes(lowerQuery.split(' ')[0]);
            
            if (hasKeywordMatch || hasContentMatch) {
                return doc;
            }
        }
        
        return null;
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

        // Показываем только топ 3 проекта изначально
        const featuredProjects = (this.projects || []).filter(p => p?.featured).slice(0, 3);
        const projectsToShow = featuredProjects.length > 0 ? featuredProjects : (this.projects || []).slice(0, 3);

        this.container.innerHTML = projectsToShow.map((project, index) => {
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
                            ${(project.metrics || []).slice(0, 2).map(metric => `
                                <div class="project-metric-interactive">
                                    <span class="project-metric-value">${(metric || '').split(' ')[0] || ''}</span>
                                    <span class="project-metric-label">${(metric || '').split(' ').slice(1).join(' ')}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="project-tech-tags-interactive">
                            ${(project.technologies || []).slice(0, 4).map((tech, techIndex) => {
                                const techClass = this.getTechPillClass(tech, techIndex);
                                return `<span class="project-tech-pill ${techClass}">${tech || ''}</span>`;
                            }).join('')}
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

        // Обработчик для кнопки "Показать больше проектов"
        const loadMoreBtn = document.getElementById('load-more-projects');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.showAllProjects();
            });
        }
    }

    showAllProjects() {
        if (!this.container || !this.projects.length) return;

        this.container.innerHTML = this.projects.map(project => `
            <div class="project-card" data-aos="fade-up" data-project-id="${project.id}">
                <div class="project-header">
                    <div>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-subtitle">${project.subtitle}</p>
                    </div>
                    ${project.featured ? '<span class="project-status featured">Featured</span>' : ''}
                </div>
                
                <p class="project-description">${project.description}</p>
                
                <div class="project-technologies">
                    ${project.technologies.map(tech => 
                        `<span class="project-tech-tag">${tech}</span>`
                    ).join('')}
                </div>
                
                <div class="project-metrics">
                    ${project.metrics.slice(0, 2).map(metric => `
                        <div class="project-metric">
                            <span class="project-metric-value">${metric.split(' ')[0]}</span>
                            <span class="project-metric-label">${metric.split(' ').slice(1).join(' ')}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="project-actions">
                    <button class="project-btn project-btn-primary" onclick="openProjectModal(${project.id})">
                        <i data-lucide="info" style="width: 16px; height: 16px;"></i>
                        Подробнее
                    </button>
                    ${project.github ? `<a href="${project.github}" class="project-btn project-btn-outline" target="_blank">
                        <i data-lucide="github" style="width: 16px; height: 16px;"></i>
                        GitHub
                    </a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" class="project-btn project-btn-outline" target="_blank">
                        <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                        Demo
                    </a>` : ''}
                </div>
            </div>
        `).join('');

        // Скрываем кнопку "Показать больше"
        const loadMoreBtn = document.getElementById('load-more-projects');
        if (loadMoreBtn) {
            loadMoreBtn.parentElement.style.display = 'none';
        }

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.setupProjectInteractions();
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
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <div class="project-modal-image">
                <i data-lucide="image" style="font-size: 3rem; opacity: 0.3;"></i>
                <div style="position: absolute; bottom: 10px; right: 10px; background: var(--primary-500); color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                    ${project.subtitle}
                </div>
            </div>
            
            <div>
                <h4 style="color: var(--dark-50); margin-bottom: var(--space-3);">Описание проекта</h4>
                <p style="color: var(--dark-300); line-height: 1.6; margin-bottom: var(--space-4);">
                    ${project.description}
                </p>
            </div>

            <div>
                <h4 style="color: var(--dark-50); margin-bottom: var(--space-3);">Ключевые особенности</h4>
                <ul class="project-modal-features">
                    ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
            </div>

            <div>
                <h4 style="color: var(--dark-50); margin-bottom: var(--space-3);">Технологии</h4>
                <div class="project-technologies" style="margin-bottom: var(--space-4);">
                    ${project.technologies.map(tech => 
                        `<span class="project-tech-tag">${tech}</span>`
                    ).join('')}
                </div>
            </div>

            <div>
                <h4 style="color: var(--dark-50); margin-bottom: var(--space-3);">Результаты и метрики</h4>
                <div class="project-metrics" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));">
                    ${project.metrics.map(metric => `
                        <div class="project-metric">
                            <span class="project-metric-value">${metric.split(' ')[0]}</span>
                            <span class="project-metric-label">${metric.split(' ').slice(1).join(' ')}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="project-actions" style="justify-content: center; margin-top: var(--space-6);">
                ${project.github ? `<a href="${project.github}" class="project-btn project-btn-primary" target="_blank">
                    <i data-lucide="github" style="width: 16px; height: 16px;"></i>
                    Посмотреть код
                </a>` : ''}
                ${project.demo ? `<a href="${project.demo}" class="project-btn project-btn-outline" target="_blank">
                    <i data-lucide="external-link" style="width: 16px; height: 16px;"></i>
                    Открыть демо
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
    RAGChatComponent,
    MultiagentVisualization,
    AIReadinessChecklist,
    ProjectsManager,
    SkillsManager,
    UtilsHelper
};
