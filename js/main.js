// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES');
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC'
    }).format(amount);
}

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    `;
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('Texto copiado al portapapeles'))
        .catch(err => console.error('Error al copiar:', err));
}

function addScrollToTopButton() {
    const button = document.createElement('button');
    button.id = 'scrollToTop';
    button.innerHTML = '<i class="fas fa-chevron-up"></i>';
    button.title = 'Volver arriba';
    
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
        transition: all 0.3s;
        align-items: center;
        justify-content: center;
    `;
    
    button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
    });
    
    button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', () => {
        button.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    
    document.body.appendChild(button);
}

function checkConnection() {
    if (!navigator.onLine) {
        const alert = document.createElement('div');
        alert.id = 'offlineAlert';
        alert.innerHTML = `
            <i class="fas fa-wifi-slash"></i>
            <span>Está trabajando sin conexión a internet</span>
        `;
        
        alert.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #e74c3c;
            color: white;
            text-align: center;
            padding: 10px;
            z-index: 2000;
            font-weight: 500;
        `;
        
        document.body.appendChild(alert);
    }
}

function saveFormState(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    localStorage.setItem(`form_${formId}`, JSON.stringify(data));
}

function loadFormState(formId) {
    const savedData = localStorage.getItem(`form_${formId}`);
    if (!savedData) return;
    
    const data = JSON.parse(savedData);
    const form = document.getElementById(formId);
    if (!form) return;
    
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) input.value = data[key];
    });
}

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. Manejo de formularios
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('#email')?.value;
            const password = this.querySelector('#password')?.value;
            
            if (!email || !password) {
                alert('Por favor complete todos los campos');
                return;
            }
            
            // Simulación de login exitoso
            window.location.href = 'admin/dashboard.html';
        });
    }
    
    // 2. Manejo de tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            if (!tabId) return;
            
            // Remover activo de todos
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
                el.classList.remove('active');
            });
            
            // Activar elementos seleccionados
            this.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) targetContent.classList.add('active');
        });
    });
    
    // 3. Búsqueda en tablas
    document.querySelectorAll('.search-input').forEach(input => {
        input.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.card')?.querySelector('.data-table');
            
            if (!table) return;
            
            table.querySelectorAll('tbody tr').forEach(row => {
                row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
            });
        });
    });
    
    // 4. Confirmación de eliminación
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('¿Está seguro de eliminar este registro?')) {
                e.preventDefault();
            }
        });
    });
    
    // 5. Manejo de envío de formularios con estado
    document.querySelectorAll('form').forEach(form => {
        if (form.id) {
            // Cargar estado guardado
            loadFormState(form.id);
            
            // Guardar estado cada 5 segundos
            setInterval(() => saveFormState(form.id), 5000);
            
            // Deshabilitar botón al enviar
            form.addEventListener('submit', function() {
                const submitButton = this.querySelector('button[type="submit"]');
                if (!submitButton) return;
                
                // Guardar texto original si no existe
                if (!submitButton.getAttribute('data-original-text')) {
                    submitButton.setAttribute('data-original-text', submitButton.innerHTML);
                }
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                
                // Restaurar después de 5 segundos (simulación)
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = submitButton.getAttribute('data-original-text');
                }, 5000);
            });
        }
    });
    
    // 6. Verificación de conexión
    window.addEventListener('online', () => {
        const alert = document.getElementById('offlineAlert');
        if (alert) alert.remove();
    });
    
    window.addEventListener('offline', checkConnection);
    checkConnection();
    
    // 7. Inicializar botón de scroll to top
    addScrollToTopButton();
    
    // 8. Detección de dispositivo móvil
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
    }
    
    // 9. Agregar estilos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
        }
    `;
    document.head.appendChild(style);
    
    // 10. Datos de ejemplo y funciones de simulación
    const mockData = {
        clients: [
            { id: 1, name: "Juan Pérez", email: "juan@email.com", phone: "1234-5678", status: "Activo" },
            { id: 2, name: "María López", email: "maria@email.com", phone: "8765-4321", status: "Activo" }
        ],
        orders: [
            { id: 1, client: "Juan Pérez", motor: "ABC-123", status: "En reparación", date: "2024-01-15" }
        ]
    };
    
    function populateTable(tableId, data) {
        const table = document.getElementById(tableId);
        if (table) console.log(`Tabla ${tableId} recibiría datos:`, data);
    }
    
    function simulateLoading() {
        document.querySelectorAll('.loading').forEach(el => {
            el.innerHTML = '<div class="loading-spinner"></div>';
            setTimeout(() => {
                el.innerHTML = '<p>Datos cargados exitosamente</p>';
            }, 1000);
        });
    }
    
    simulateLoading();
    
    console.log('Sistema de Taller Mecánico inicializado');
    console.log('Versión: 1.0.0');
    console.log('Fecha:', new Date().toLocaleDateString());
});