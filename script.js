// Escola de Alinhamento do Reino de Deus - JavaScript

class EscolaAlinhamento {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.initThemeToggle();
        this.initScrollEffects();
        this.initNavigation();
        this.initAnimations();
        this.initButtons();
        this.initMobileMenu();
        this.setTheme(this.theme);
    }

    // Sistema de Tema Claro/Escuro
    initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');

        themeToggle.addEventListener('click', () => {
            this.theme = this.theme === 'dark' ? 'light' : 'dark';
            this.setTheme(this.theme);
            this.updateThemeIcon(themeIcon);
        });

        this.updateThemeIcon(themeIcon);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.theme = theme;
    }

    updateThemeIcon(icon) {
        icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Navegação Suave
    initNavigation() {
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Efeitos de Scroll
    initScrollEffects() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Navbar backdrop blur effect
            if (currentScrollY > 50) {
                navbar.style.backgroundColor = this.theme === 'light' 
                    ? 'rgba(255, 255, 255, 0.95)' 
                    : 'rgba(26, 26, 26, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.backgroundColor = this.theme === 'light' 
                    ? '#ffffff' 
                    : '#1a1a1a';
                navbar.style.backdropFilter = 'none';
            }

            // Auto-hide navbar on scroll down (mobile)
            if (window.innerWidth <= 768) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }

            lastScrollY = currentScrollY;
        });

        // Intersection Observer para animações
        this.initScrollAnimations();
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Elementos para animar
        const animatedElements = document.querySelectorAll(
            '.service-card, .course-card, .contact-card, .video-item, .mentor-content'
        );

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Animações e Interações
    initAnimations() {
        // Efeito de digitação no hero
        this.typeWriter();

        // Contadores animados
        this.animateCounters();

        // Efeitos de hover melhorados
        this.enhanceHoverEffects();
    }

    typeWriter() {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (!heroSubtitle) return;

        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.borderRight = '2px solid var(--gold)';

        let i = 0;
        const typeSpeed = 50;

        const type = () => {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(type, typeSpeed);
            } else {
                // Remove cursor após completar
                setTimeout(() => {
                    heroSubtitle.style.borderRight = 'none';
                }, 1000);
            }
        };

        // Inicia após um pequeno delay
        setTimeout(type, 1000);
    }

    animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const options = {
            threshold: 0.7
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, options);

        counters.forEach(counter => observer.observe(counter));
    }

    enhanceHoverEffects() {
        // Efeito parallax sutil nos cards
        const cards = document.querySelectorAll('.service-card, .course-card, .contact-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    }

    // Funcionalidade dos Botões
    initButtons() {
        this.initCourseButtons();
        this.initContactButtons();
        this.initSocialButtons();
    }

    initCourseButtons() {
        const courseButtons = document.querySelectorAll('.btn-course');
        
        courseButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const courseName = button.closest('.course-card').querySelector('h3').textContent;
                this.showCourseModal(courseName);
            });
        });
    }

    showCourseModal(courseName) {
        // Criar modal dinamicamente
        const modal = document.createElement('div');
        modal.className = 'course-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Interesse no Curso: ${courseName}</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Para adquirir este curso, entre em contato conosco através do WhatsApp ou Telegram.</p>
                        <div class="modal-buttons">
                            <button class="btn btn-whatsapp" onclick="window.open('https://wa.me/5527999999999?text=Olá! Tenho interesse no curso: ${encodeURIComponent(courseName)}', '_blank')">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </button>
                            <button class="btn btn-telegram" onclick="window.open('https://t.me/escolaalinhamento', '_blank')">
                                <i class="fab fa-telegram"></i> Telegram
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Adicionar estilos do modal
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .course-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            .modal-overlay {
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .modal-content {
                background: var(--bg-primary);
                border-radius: 16px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: var(--shadow-xl);
            }
            .modal-header {
                padding: 2rem 2rem 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--border-color);
            }
            .modal-header h3 {
                margin: 0;
                color: var(--text-primary);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary);
            }
            .modal-body {
                padding: 2rem;
            }
            .modal-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
                flex-wrap: wrap;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;

        document.head.appendChild(modalStyles);
        document.body.appendChild(modal);

        // Fechar modal
        const closeModal = () => {
            modal.remove();
            modalStyles.remove();
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === modal.querySelector('.modal-overlay')) {
                closeModal();
            }
        });

        // Fechar com ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    initContactButtons() {
        const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
        const telegramButtons = document.querySelectorAll('.btn-telegram');

        whatsappButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const message = 'Olá! Gostaria de saber mais sobre a Escola de Alinhamento do Reino de Deus.';
                window.open(`https://wa.me/5527999999999?text=${encodeURIComponent(message)}`, '_blank');
            });
        });

        telegramButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://t.me/escolaalinhamento', '_blank');
            });
        });
    }

    initSocialButtons() {
        const youtubeButtons = document.querySelectorAll('.btn-youtube');
        
        youtubeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.open('https://youtube.com/@escolaalinhamento', '_blank');
            });
        });

        // Links do footer
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const platform = link.classList.contains('whatsapp') ? 'whatsapp' :
                               link.classList.contains('telegram') ? 'telegram' : 'youtube';
                
                const urls = {
                    whatsapp: 'https://wa.me/5527999999999',
                    telegram: 'https://t.me/escolaalinhamento',
                    youtube: 'https://youtube.com/@escolaalinhamento'
                };
                
                window.open(urls[platform], '_blank');
            });
        });
    }

    // Menu Mobile (para futuras implementações)
    initMobileMenu() {
        // Placeholder para menu mobile hamburger
        // Pode ser implementado se necessário
    }

    // Utilitários
    debounce(func, wait) {
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

    // Loading states para botões
    setButtonLoading(button, loading = true) {
        if (loading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        } else {
            button.disabled = false;
            // Restaurar conteúdo original seria necessário salvar antes
        }
    }

    // Feedback de ações
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para a notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
            zIndex: '3000',
            animation: 'slideInRight 0.3s ease'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Validação de formulários (para uso futuro)
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return re.test(phone);
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new EscolaAlinhamento();
});

// Adicionar estilos para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        font-weight: 500;
    }
`;
document.head.appendChild(notificationStyles);

// Adicionar alguns efeitos visuais extras
document.addEventListener('DOMContentLoaded', () => {
    // Efeito de partículas sutil no hero (opcional)
    const createParticles = () => {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: var(--gold);
                border-radius: 50%;
                opacity: 0.3;
                animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
            `;
            hero.appendChild(particle);
        }
    };

    // Adicionar animação de float
    const floatAnimation = document.createElement('style');
    floatAnimation.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.3;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 0.6;
            }
        }
    `;
    document.head.appendChild(floatAnimation);

    // Criar partículas após um delay
    setTimeout(createParticles, 1000);
});

// Service Worker para PWA (futuro)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Placeholder para registrar service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}