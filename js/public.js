// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function simulateLoading(elementId, duration = 1000) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '<div class="loading-spinner"></div>';
    setTimeout(() => {
        element.innerHTML = '<p>Operación completada</p>';
    }, duration);
}

// ============================================
// FUNCIONALIDAD DEL FORMULARIO DE REGISTRO
// ============================================

function setupRegistrationForm() {
    const registroForm = document.getElementById('registroForm');
    if (!registroForm) return;
    
    console.log('Formulario de registro encontrado');
    
    // Validación de coincidencia de contraseñas
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    const passwordMatch = document.getElementById('password-match');
    
    function validatePasswordMatch() {
        if (!password || !confirmPassword) return false;
        
        const passwordsMatch = password.value === confirmPassword.value;
        
        if (passwordMatch) {
            passwordMatch.textContent = passwordsMatch 
                ? '✓ Las contraseñas coinciden' 
                : '✗ Las contraseñas no coinciden';
            passwordMatch.className = passwordsMatch 
                ? 'form-feedback valid' 
                : 'form-feedback invalid';
        }
        
        return passwordsMatch;
    }
    
    if (password && confirmPassword) {
        [password, confirmPassword].forEach(input => {
            input.addEventListener('input', validatePasswordMatch);
        });
    }
    
    // Medidor de fortaleza de contraseña
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (password && strengthBars.length > 0 && strengthText) {
        password.addEventListener('input', function() {
            const pass = this.value;
            let strength = 0;
            
            if (pass.length >= 8) strength++;
            if (/\d/.test(pass)) strength++;
            if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
            if (/[^a-zA-Z0-9]/.test(pass)) strength++;
            
            // Actualizar barras
            strengthBars.forEach((bar, index) => {
                bar.classList.remove('active', 'medium', 'strong');
                if (index < strength) {
                    bar.classList.add('active');
                    if (strength >= 3) bar.classList.add('strong');
                    else if (strength >= 2) bar.classList.add('medium');
                }
            });
            
            // Actualizar texto
            const texts = ['Muy débil', 'Débil', 'Moderada', 'Fuerte', 'Muy fuerte'];
            strengthText.textContent = `Seguridad: ${texts[strength] || 'Muy débil'}`;
        });
    }
    
    // Envío del formulario
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validatePasswordMatch()) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        const terminos = document.querySelector('input[name="terminos"]');
        if (terminos && !terminos.checked) {
            alert('Debe aceptar los términos y condiciones');
            return;
        }
        
        console.log('Enviando registro...');
        alert('¡Registro exitoso! Redirigiendo a su cuenta...');
        
        setTimeout(() => {
            window.location.href = '../cliente-dashboard.html';
        }, 2000);
    });
}

// ============================================
// FUNCIONALIDAD DEL FORMULARIO DE LOGIN
// ============================================

function setupLoginForm() {
    const loginPublicForm = document.getElementById('loginPublicForm');
    if (!loginPublicForm) return;
    
    console.log('Formulario de login público encontrado');
    
    // Toggle de visibilidad de contraseña
    const togglePassword = document.getElementById('togglePassword');
    const loginPassword = document.getElementById('loginPassword');
    
    if (togglePassword && loginPassword) {
        togglePassword.addEventListener('click', function() {
            const isPassword = loginPassword.type === 'password';
            loginPassword.type = isPassword ? 'text' : 'password';
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            }
        });
    }
    
    // Botones de login social
    document.querySelectorAll('.btn-social').forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('btn-google') ? 'Google' : 'Facebook';
            alert(`Iniciando sesión con ${provider} (función simulada)`);
        });
    });
    
    // Envío del formulario
    loginPublicForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (!emailInput || !passwordInput) {
            alert('Error: No se encontraron los campos de entrada');
            return;
        }
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        if (!email || !password) {
            alert('Por favor complete todos los campos');
            return;
        }
        
        console.log('Autenticando:', email);
        alert('Credenciales válidas (simulado). Redirigiendo a su cuenta...');
        
        setTimeout(() => {
            window.location.href = '../cliente-dashboard.html';
        }, 1500);
    });
}

// ============================================
// MEJORAS DE UX GENERALES
// ============================================

function setupUXEnhancements() {
    // Resaltar campos al enfocar
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Validación de email en tiempo real
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', function() {
            const email = this.value;
            if (!email || isValidEmail(email)) {
                this.style.borderColor = '';
                const errorMsg = this.nextElementSibling;
                if (errorMsg?.classList.contains('email-error')) {
                    errorMsg.remove();
                }
                return;
            }
            
            this.style.borderColor = '#e74c3c';
            
            let errorMsg = this.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('email-error')) {
                errorMsg = document.createElement('small');
                errorMsg.className = 'email-error form-feedback invalid';
                this.parentNode.appendChild(errorMsg);
            }
            
            errorMsg.textContent = 'Por favor ingrese un email válido';
        });
    });
    
    // Máscara para teléfono
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            if (value.length > 4) {
                value = value.substring(0, 4) + '-' + value.substring(4);
            }
            this.value = value;
        });
    });
    
    // Menú móvil
    function setupMobileMenu() {
        const nav = document.querySelector('.public-nav');
        const navLinks = document.querySelector('.nav-links');
        
        if (window.innerWidth > 768 || !nav || !navLinks) return;
        
        if (!document.querySelector('.menu-toggle')) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            nav.insertBefore(menuToggle, navLinks);
            
            menuToggle.addEventListener('click', function() {
                navLinks.classList.toggle('show');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = navLinks.classList.contains('show') 
                        ? 'fas fa-times' 
                        : 'fas fa-bars';
                }
            });
            
            // Cerrar menú al hacer clic en enlace
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('show');
                    const toggleIcon = menuToggle.querySelector('i');
                    if (toggleIcon) toggleIcon.className = 'fas fa-bars';
                });
            });
        }
    }
    
    setupMobileMenu();
    window.addEventListener('resize', setupMobileMenu);
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// ANIMACIONES Y EFECTOS PARA LA PÁGINA PRINCIPAL
// ============================================

function setupHomepageEffects() {
    // Actualizar año en footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Animación para contadores de estadísticas
    document.querySelectorAll('.stat-number').forEach(stat => {
        const originalText = stat.textContent;
        const target = parseInt(originalText);
        
        if (isNaN(target)) return;
        
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            const suffix = originalText.includes('+') ? '+' : '';
            stat.textContent = Math.floor(current) + suffix;
        }, 30);
    });
    
    // Botón flotante de WhatsApp
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/50622225555';
    whatsappBtn.target = '_blank';
    whatsappBtn.className = 'whatsapp-float fade-in';
    whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappBtn.title = 'Contactar por WhatsApp';
    document.body.appendChild(whatsappBtn);
    
    // Observer para animaciones de entrada
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Aplicar animaciones a elementos
    document.querySelectorAll('.service-card, .stat-item, .testimonial, .feature-item, .brand-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Asegurar que elementos visibles al cargar tengan la animación
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
}

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Script público cargado');
    
    // Inicializar funcionalidades
    setupRegistrationForm();
    setupLoginForm();
    setupUXEnhancements();
    setupHomepageEffects();
    
    // Contador de visitas (simulado)
    const visitCount = localStorage.getItem('visitCount') || 0;
    localStorage.setItem('visitCount', parseInt(visitCount) + 1);
    console.log('Visitas a esta página:', localStorage.getItem('visitCount'));
});