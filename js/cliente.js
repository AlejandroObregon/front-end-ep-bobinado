// ============================================
// CLIENTE.JS - Funcionalidades específicas área cliente
// ============================================

// Estado de la sesión del cliente
let clienteSession = {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan@email.com",
    telefono: "2222-5555",
    motores: 3,
    ordenesActivas: 2,
    historialServicios: 15
};

// Datos de ejemplo para órdenes
const ordenesEjemplo = [
    {
        id: 'ORD-2024-0015',
        motor: 'SIEMENS 20HP',
        serial: 'SI-2020-4587',
        fechaIngreso: '2024-01-15',
        fechaEstimada: '2024-01-25',
        tecnico: 'Carlos Vargas',
        estado: 'En reparación',
        progreso: 75,
        descripcion: 'Reparación completa de bobinado y cambio de rodamientos',
        historial: [
            { fecha: '2024-01-15 09:00', evento: 'Orden recibida', descripcion: 'Motor ingresado al taller' },
            { fecha: '2024-01-16 10:30', evento: 'Diagnóstico inicial', descripcion: 'Se identificó falla en bobinado' },
            { fecha: '2024-01-18 14:00', evento: 'En reparación', descripcion: 'Inicio de rebobinado' },
            { fecha: '2024-01-20 11:00', evento: 'Repuestos solicitados', descripcion: 'Rodamientos especiales pedidos' },
            { fecha: '2024-01-22 16:00', evento: 'Pruebas finales', descripcion: 'Motor en pruebas de funcionamiento' }
        ]
    },
    {
        id: 'ORD-2024-0016',
        motor: 'WEG 5HP',
        serial: 'WEG-2021-7890',
        fechaIngreso: '2024-01-18',
        fechaEstimada: '2024-01-30',
        tecnico: 'Ana Rodríguez',
        estado: 'Espera repuestos',
        progreso: 40,
        descripcion: 'Cambio de rodamientos y balanceo dinámico',
        historial: [
            { fecha: '2024-01-18 11:00', evento: 'Orden recibida', descripcion: 'Motor con vibración excesiva' },
            { fecha: '2024-01-19 09:30', evento: 'Diagnóstico', descripcion: 'Rodamientos dañados identificados' },
            { fecha: '2024-01-20 15:00', evento: 'Espera repuestos', descripcion: 'Rodamientos especiales en camino' }
        ]
    }
];

// Datos de ejemplo para historial
const historialEjemplo = [
    {
        id: 'ORD-2023-1245',
        fecha: '2023-12-10',
        motor: 'ABB 10HP',
        servicio: 'Mantenimiento preventivo',
        tecnico: 'Carlos Vargas',
        monto: '₡85,000',
        estado: 'Completado'
    },
    {
        id: 'ORD-2023-1189',
        fecha: '2023-11-25',
        motor: 'SIEMENS 20HP',
        servicio: 'Reparación bobinado',
        tecnico: 'Ana Rodríguez',
        monto: '₡120,000',
        estado: 'Completado'
    }
];

// ============================================
// FUNCIONES DE GESTIÓN DE SESIÓN
// ============================================

function initClienteSession() {
    // Verificar si hay sesión activa
    const sessionData = localStorage.getItem('clienteSession');
    if (sessionData) {
        clienteSession = JSON.parse(sessionData);
    } else {
        // Para demostración, guardamos datos de ejemplo
        localStorage.setItem('clienteSession', JSON.stringify(clienteSession));
    }
    
    // Actualizar bienvenida en todas las páginas
    const welcomeElements = document.querySelectorAll('.user-welcome, .welcome-message');
    welcomeElements.forEach(el => {
        if (el.classList.contains('user-welcome')) {
            el.innerHTML = `Bienvenido, <strong>${clienteSession.nombre}</strong>`;
        } else if (el.classList.contains('welcome-message')) {
            el.textContent = `Aquí puede gestionar sus ${clienteSession.motores} motores y ${clienteSession.ordenesActivas} órdenes activas`;
        }
    });
}

function logoutCliente() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        localStorage.removeItem('clienteSession');
        window.location.href = '../public-index.html';
    }
}

// ============================================
// FUNCIONES PARA ÓRDENES
// ============================================

function verDetalleOrden(ordenId) {
    const orden = ordenesEjemplo.find(o => o.id === ordenId);
    if (!orden) {
        showNotification('Orden no encontrada', 'error');
        return;
    }
    
    // Mostrar modal con detalles
    const modalHtml = `
        <div class="modal-overlay active" id="ordenModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-clipboard-list"></i> ${orden.id} - ${orden.motor}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="order-info">
                        <p><strong>Serial:</strong> ${orden.serial}</p>
                        <p><strong>Fecha ingreso:</strong> ${formatDate(orden.fechaIngreso)}</p>
                        <p><strong>Fecha estimada:</strong> ${formatDate(orden.fechaEstimada)}</p>
                        <p><strong>Técnico asignado:</strong> ${orden.tecnico}</p>
                        <p><strong>Estado:</strong> <span class="badge bg-${getEstadoColor(orden.estado)}">${orden.estado}</span></p>
                        <p><strong>Descripción:</strong> ${orden.descripcion}</p>
                    </div>
                    
                    <div class="timeline">
                        <h4><i class="fas fa-history"></i> Historial de la orden</h4>
                        ${orden.historial.map(item => `
                            <div class="timeline-item">
                                <div class="timeline-date">${formatDateTime(item.fecha)}</div>
                                <div class="timeline-content">
                                    <strong>${item.evento}</strong>
                                    <p>${item.descripcion}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="contactarTecnico('${orden.tecnico}')">
                        <i class="fas fa-comment"></i> Contactar a ${orden.tecnico}
                    </button>
                    <button class="btn btn-outline" onclick="descargarReporte('${orden.id}')">
                        <i class="fas fa-download"></i> Descargar reporte
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function contactarTecnico(tecnico) {
    const mensaje = `Hola ${tecnico}, necesito información sobre mi orden en el taller eléctrico.`;
    const whatsappUrl = `https://wa.me/50622225555?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
}

function descargarReporte(ordenId) {
    showNotification(`Generando reporte de ${ordenId}...`, 'info');
    // Simulación de descarga
    setTimeout(() => {
        showNotification(`Reporte ${ordenId} descargado exitosamente`, 'success');
    }, 1500);
}

// ============================================
// FUNCIONES PARA FILTROS Y BÚSQUEDA
// ============================================

function aplicarFiltros() {
    const estado = document.getElementById('filterEstado')?.value;
    const fechaDesde = document.getElementById('filterFechaDesde')?.value;
    const fechaHasta = document.getElementById('filterFechaHasta')?.value;
    const tecnico = document.getElementById('filterTecnico')?.value;
    
    // Aquí se aplicaría la lógica de filtrado real
    showNotification(`Filtros aplicados: ${estado || 'Todos'} ${fechaDesde ? 'desde ' + fechaDesde : ''}`, 'info');
    
    // Simular recarga de datos
    setTimeout(() => {
        // En un sistema real, aquí se haría una petición al servidor
        console.log('Filtros:', { estado, fechaDesde, fechaHasta, tecnico });
    }, 500);
}

function buscarOrdenes() {
    const searchInput = document.getElementById('searchOrders');
    if (!searchInput) return;
    
    const termino = searchInput.value.toLowerCase();
    
    // Filtrar órdenes en la interfaz
    document.querySelectorAll('.order-card').forEach(card => {
        const textoCard = card.textContent.toLowerCase();
        card.style.display = textoCard.includes(termino) ? '' : 'none';
    });
    
    if (termino) {
        showNotification(`Buscando: "${termino}"`, 'info');
    }
}

// ============================================
// FUNCIONES PARA HISTORIAL
// ============================================

function cambiarTabHistorial(tabId) {
    // Remover activo de todos los tabs
    document.querySelectorAll('.history-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activar tab seleccionado
    const tab = document.querySelector(`[data-tab="${tabId}"]`);
    if (tab) tab.classList.add('active');
    
    const content = document.getElementById(tabId);
    if (content) content.classList.add('active');
}

function generarReporteHistorial() {
    const formato = document.getElementById('reportFormat')?.value || 'pdf';
    const periodo = document.getElementById('reportPeriod')?.value || 'ultimo-mes';
    
    showNotification(`Generando reporte en ${formato.toUpperCase()} del ${periodo}...`, 'info');
    
    // Simulación de generación de reporte
    setTimeout(() => {
        showNotification('Reporte generado exitosamente. Descargando...', 'success');
        // Aquí se iniciaría la descarga real
    }, 2000);
}

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateTimeString) {
    return new Date(dateTimeString).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getEstadoColor(estado) {
    const colores = {
        'Recibido': 'info',
        'En diagnóstico': 'info',
        'En reparación': 'warning',
        'Espera repuestos': 'warning',
        'Pruebas finales': 'primary',
        'Completado': 'success',
        'Entregado': 'success'
    };
    return colores[estado] || 'secondary';
}

function closeModal() {
    const modal = document.getElementById('ordenModal');
    if (modal) modal.remove();
}

function expandirDetalle(element) {
    const targetId = element.getAttribute('data-target');
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const isExpanded = target.classList.contains('show');
    
    // Cerrar todos los demás detalles
    document.querySelectorAll('.order-detail-expand').forEach(el => {
        el.classList.remove('show');
    });
    
    // Si no estaba expandido, expandirlo
    if (!isExpanded) {
        target.classList.add('show');
        element.innerHTML = '<i class="fas fa-chevron-up"></i> Ver menos';
    } else {
        element.innerHTML = '<i class="fas fa-chevron-down"></i> Ver más';
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cliente.js cargado - Área del cliente');
    
    // Inicializar sesión
    initClienteSession();
    
    // Configurar botones de logout
    document.querySelectorAll('[onclick*="logout"]').forEach(btn => {
        btn.onclick = logoutCliente;
    });
    
    // Configurar filtros
    const filterButtons = document.querySelectorAll('.filter-group select, .filter-group input');
    filterButtons.forEach(input => {
        input.addEventListener('change', aplicarFiltros);
    });
    
    // Configurar búsqueda en tiempo real
    const searchInput = document.getElementById('searchOrders');
    if (searchInput) {
        searchInput.addEventListener('input', buscarOrdenes);
    }
    
    // Configurar tabs de historial
    document.querySelectorAll('.history-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            cambiarTabHistorial(tabId);
        });
    });
    
    // Configurar botones de ver detalle
    document.querySelectorAll('.btn-ver-detalle').forEach(btn => {
        btn.addEventListener('click', function() {
            const ordenId = this.getAttribute('data-orden');
            verDetalleOrden(ordenId);
        });
    });
    
    // Configurar botones de expandir
    document.querySelectorAll('[data-target]').forEach(btn => {
        if (btn.getAttribute('data-target')) {
            btn.addEventListener('click', function() {
                expandirDetalle(this);
            });
        }
    });
    
    // Inicializar tooltips
    document.querySelectorAll('[title]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.title;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--text-dark);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2) + 'px';
            
            this._tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });

    
});

// ============================================
// NUEVAS FUNCIONES PARA MOTORES Y PERFIL
// ============================================

// Datos de ejemplo para motores
const motoresEjemplo = [
    {
        id: 1,
        serial: 'SI-2020-4587',
        marca: 'SIEMENS',
        modelo: '20HP Industrial',
        tipo: 'Trifásico',
        potencia: '20 HP',
        voltaje: '440V',
        rpm: 1750,
        peso: '150 kg',
        dimensiones: '400x400x600 mm',
        añoFabricacion: 2020,
        fechaCompra: '2020-03-15',
        estado: 'Activo',
        salud: 85,
        proximoMantenimiento: '2024-02-15',
        ubicacion: 'Planta principal',
        notas: 'Motor para sistema de ventilación',
        historialServicios: 5,
        ultimoServicio: '2023-12-10'
    },
    {
        id: 2,
        serial: 'WEG-2021-7890',
        marca: 'WEG',
        modelo: '5HP Standard',
        tipo: 'Monofásico',
        potencia: '5 HP',
        voltaje: '220V',
        rpm: 3450,
        peso: '45 kg',
        dimensiones: '250x250x400 mm',
        añoFabricacion: 2021,
        fechaCompra: '2021-06-20',
        estado: 'En reparación',
        salud: 40,
        proximoMantenimiento: '2024-03-01',
        ubicacion: 'Taller secundario',
        notas: 'Para bomba de agua',
        historialServicios: 3,
        ultimoServicio: '2023-11-15'
    },
    {
        id: 3,
        serial: 'ABB-2019-1234',
        marca: 'ABB',
        modelo: '10HP Efficiency',
        tipo: 'Trifásico',
        potencia: '10 HP',
        voltaje: '220V/440V',
        rpm: 1450,
        peso: '85 kg',
        dimensiones: '300x300x500 mm',
        añoFabricacion: 2019,
        fechaCompra: '2019-11-10',
        estado: 'Activo',
        salud: 92,
        proximoMantenimiento: '2024-04-01',
        ubicacion: 'Sala de máquinas',
        notas: 'Motor principal de compresor',
        historialServicios: 8,
        ultimoServicio: '2023-11-25'
    }
];

// Datos de perfil
const perfilEjemplo = {
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
    telefono: '2222-5555',
    celular: '8888-9999',
    direccion: 'San José, Costa Rica',
    empresa: 'Industrias Pérez S.A.',
    puesto: 'Gerente de Mantenimiento',
    fechaRegistro: '2020-01-15',
    ultimoAcceso: '2024-01-20',
    notificaciones: {
        emailOrdenes: true,
        emailMantenimiento: true,
        smsUrgentes: true,
        newsletter: false
    }
};

// ============================================
// FUNCIONES PARA GESTIÓN DE MOTORES
// ============================================

function verDetalleMotor(motorId) {
    const motor = motoresEjemplo.find(m => m.id === motorId);
    if (!motor) {
        showNotification('Motor no encontrado', 'error');
        return;
    }
    
    const modalHtml = `
        <div class="modal-overlay active" id="motorModal">
            <div class="modal-content motor-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-motorcycle"></i> ${motor.marca} ${motor.modelo}</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="motor-details-modal">
                        <div class="motor-image-modal">
                            <div class="motor-avatar-large">
                                <i class="fas fa-industry"></i>
                            </div>
                            <div class="motor-badges">
                                <span class="badge bg-${motor.estado === 'Activo' ? 'success' : 'warning'}">${motor.estado}</span>
                                <span class="badge bg-primary">${motor.tipo}</span>
                                <span class="badge bg-info">${motor.potencia}</span>
                            </div>
                        </div>
                        
                        <div class="motor-info-modal">
                            <h3>${motor.marca} ${motor.modelo}</h3>
                            <p class="motor-serial">Serial: ${motor.serial}</p>
                            
                            <div class="motor-specs-modal">
                                <div class="motor-spec-modal">
                                    <span class="label">Potencia</span>
                                    <span class="value">${motor.potencia}</span>
                                </div>
                                <div class="motor-spec-modal">
                                    <span class="label">Voltaje</span>
                                    <span class="value">${motor.voltaje}</span>
                                </div>
                                <div class="motor-spec-modal">
                                    <span class="label">RPM</span>
                                    <span class="value">${motor.rpm}</span>
                                </div>
                                <div class="motor-spec-modal">
                                    <span class="label">Año</span>
                                    <span class="value">${motor.añoFabricacion}</span>
                                </div>
                            </div>
                            
                            <div class="motor-health-indicator">
                                <h4><i class="fas fa-heartbeat"></i> Estado de salud: ${motor.salud}%</h4>
                                <div class="health-bar">
                                    <div class="health-fill" style="width: ${motor.salud}%"></div>
                                </div>
                            </div>
                            
                            <div class="motor-details">
                                <h4><i class="fas fa-info-circle"></i> Información adicional</h4>
                                <div class="detail-item">
                                    <span class="detail-label">Ubicación:</span>
                                    <span class="detail-value">${motor.ubicacion}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Próximo mantenimiento:</span>
                                    <span class="detail-value">${formatDate(motor.proximoMantenimiento)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Último servicio:</span>
                                    <span class="detail-value">${formatDate(motor.ultimoServicio)}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Servicios realizados:</span>
                                    <span class="detail-value">${motor.historialServicios}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Notas:</span>
                                    <span class="detail-value">${motor.notas}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="motor-history">
                        <h4><i class="fas fa-history"></i> Historial reciente de servicios</h4>
                        <div class="history-list">
                            <!-- Aquí se cargaría el historial real -->
                            <p>Se cargarían los últimos 5 servicios de este motor</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="programarMantenimientoMotor(${motor.id})">
                        <i class="fas fa-calendar-plus"></i> Programar mantenimiento
                    </button>
                    <button class="btn btn-outline" onclick="generarReporteMotor('${motor.serial}')">
                        <i class="fas fa-download"></i> Descargar reporte
                    </button>
                    <button class="btn btn-outline" onclick="editarMotor(${motor.id})">
                        <i class="fas fa-edit"></i> Editar información
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Agregar estilos para el modal
    const style = document.createElement('style');
    style.textContent = `
        .motor-avatar-large {
            width: 200px;
            height: 200px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 80px;
            margin: 0 auto 20px;
        }
        
        .motor-badges {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-bottom: 20px;
        }
        
        .motor-serial {
            color: var(--text-muted);
            font-family: monospace;
            margin-bottom: 20px;
        }
        
        .motor-health-indicator {
            margin: 20px 0;
            padding: 15px;
            background: var(--light-bg);
            border-radius: 8px;
        }
        
        .health-bar {
            height: 10px;
            background: #e0e0e0;
            border-radius: 5px;
            overflow: hidden;
            margin-top: 10px;
        }
        
        .health-fill {
            height: 100%;
            background: ${motor.salud >= 70 ? 'linear-gradient(90deg, var(--secondary-color), #10b981)' : 
                         motor.salud >= 40 ? 'linear-gradient(90deg, var(--accent-color), #f59e0b)' : 
                         'linear-gradient(90deg, #ef4444, #f87171)'};
            border-radius: 5px;
            transition: width 0.3s;
        }
        
        .motor-details {
            margin-top: 20px;
        }
        
        .detail-item {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid var(--border-light);
        }
        
        .detail-item:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            flex: 1;
            font-weight: 500;
            color: var(--text-muted);
        }
        
        .detail-value {
            flex: 2;
            color: var(--text-dark);
        }
        
        .motor-history {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid var(--border-light);
        }
    `;
    document.head.appendChild(style);
}

function programarMantenimientoMotor(motorId) {
    const motor = motoresEjemplo.find(m => m.id === motorId);
    if (!motor) return;
    
    alert(`Programando mantenimiento para ${motor.marca} ${motor.modelo} (${motor.serial})...\n\nSería redirigido al formulario de agendamiento.`);
}

function generarReporteMotor(serial) {
    showNotification(`Generando reporte completo del motor ${serial}...`, 'info');
    setTimeout(() => {
        showNotification('Reporte generado y listo para descargar', 'success');
    }, 2000);
}

function editarMotor(motorId) {
    alert(`Editando información del motor ID: ${motorId}\n\nSe abriría el formulario de edición.`);
}

function agregarNuevoMotor() {
    // Redirigir o mostrar formulario para nuevo motor
    window.location.href = 'cliente-nuevo-motor.html'; // Asumiendo que existe esta página
}

function filtrarMotores(criterio) {
    const motoresGrid = document.querySelector('.motores-grid');
    if (!motoresGrid) return;
    
    const cards = motoresGrid.querySelectorAll('.motor-card-detailed');
    cards.forEach(card => {
        const estado = card.getAttribute('data-estado');
        const tipo = card.getAttribute('data-tipo');
        
        let mostrar = true;
        
        if (criterio === 'activos' && estado !== 'Activo') mostrar = false;
        if (criterio === 'reparacion' && estado !== 'En reparación') mostrar = false;
        if (criterio === 'monofasicos' && tipo !== 'Monofásico') mostrar = false;
        if (criterio === 'trifasicos' && tipo !== 'Trifásico') mostrar = false;
        
        card.style.display = mostrar ? 'block' : 'none';
    });
    
    // Actualizar contador
    const contador = document.querySelector('.motores-count');
    if (contador) {
        const visibles = motoresGrid.querySelectorAll('.motor-card-detailed[style*="block"]').length;
        contador.textContent = `${visibles} motores`;
    }
}

// ============================================
// FUNCIONES PARA GESTIÓN DE PERFIL
// ============================================

function cargarDatosPerfil() {
    const perfil = perfilEjemplo;
    
    // Actualizar datos en el formulario
    document.querySelectorAll('[data-profile]').forEach(element => {
        const field = element.getAttribute('data-profile');
        if (perfil[field]) {
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
                element.value = perfil[field];
            } else {
                element.textContent = perfil[field];
            }
        }
    });
    
    // Actualizar toggles de notificaciones
    Object.keys(perfil.notificaciones).forEach(key => {
        const toggle = document.getElementById(`toggle-${key}`);
        if (toggle) {
            toggle.checked = perfil.notificaciones[key];
        }
    });
    
    // Actualizar estadísticas
    document.querySelectorAll('[data-stat]').forEach(element => {
        const stat = element.getAttribute('data-stat');
        const valor = clienteSession[stat] || 0;
        element.textContent = valor;
    });
}

function guardarPerfil() {
    const form = document.getElementById('profileForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const datos = {};
    formData.forEach((value, key) => {
        datos[key] = value;
    });
    
    // Guardar notificaciones
    datos.notificaciones = {
        emailOrdenes: document.getElementById('toggle-emailOrdenes')?.checked || false,
        emailMantenimiento: document.getElementById('toggle-emailMantenimiento')?.checked || false,
        smsUrgentes: document.getElementById('toggle-smsUrgentes')?.checked || false,
        newsletter: document.getElementById('toggle-newsletter')?.checked || false
    };
    
    // Simular guardado en servidor
    showNotification('Guardando cambios en el perfil...', 'info');
    
    setTimeout(() => {
        showNotification('Perfil actualizado exitosamente', 'success');
        
        // Actualizar sesión local
        Object.assign(clienteSession, datos);
        localStorage.setItem('clienteSession', JSON.stringify(clienteSession));
        
        // Actualizar bienvenida
        const welcomeElements = document.querySelectorAll('.user-welcome, .profile-info h1');
        welcomeElements.forEach(el => {
            if (el.classList.contains('user-welcome')) {
                el.innerHTML = `Bienvenido, <strong>${clienteSession.nombre}</strong>`;
            } else if (el.tagName === 'H1') {
                el.textContent = clienteSession.nombre;
            }
        });
    }, 1500);
}

function cambiarContrasena() {
    const modalHtml = `
        <div class="modal-overlay active" id="passwordModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-lock"></i> Cambiar Contraseña</h3>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="changePasswordForm">
                        <div class="form-group">
                            <label for="currentPassword">Contraseña actual *</label>
                            <input type="password" id="currentPassword" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="newPassword">Nueva contraseña *</label>
                            <input type="password" id="newPassword" required minlength="8">
                            <small class="form-text">Mínimo 8 caracteres, con mayúsculas, minúsculas y números</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="confirmPassword">Confirmar nueva contraseña *</label>
                            <input type="password" id="confirmPassword" required>
                        </div>
                        
                        <div class="password-strength" id="passwordStrength">
                            <div class="strength-bar"></div>
                            <div class="strength-bar"></div>
                            <div class="strength-bar"></div>
                            <span class="strength-text">Seguridad: Muy débil</span>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="confirmarCambioContrasena()">
                        <i class="fas fa-save"></i> Cambiar contraseña
                    </button>
                    <button class="btn btn-outline" onclick="closeModal()">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Configurar validación de fortaleza de contraseña
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const strengthBars = document.querySelectorAll('#passwordStrength .strength-bar');
    const strengthText = document.querySelector('#passwordStrength .strength-text');
    
    if (newPassword && strengthBars.length > 0 && strengthText) {
        newPassword.addEventListener('input', function() {
            const pass = this.value;
            let strength = 0;
            
            if (pass.length >= 8) strength++;
            if (/\d/.test(pass)) strength++;
            if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
            if (/[^a-zA-Z0-9]/.test(pass)) strength++;
            
            strengthBars.forEach((bar, index) => {
                bar.classList.remove('active', 'medium', 'strong');
                if (index < strength) {
                    bar.classList.add('active');
                    if (strength >= 3) bar.classList.add('strong');
                    else if (strength >= 2) bar.classList.add('medium');
                }
            });
            
            const texts = ['Muy débil', 'Débil', 'Moderada', 'Fuerte', 'Muy fuerte'];
            strengthText.textContent = `Seguridad: ${texts[strength] || 'Muy débil'}`;
        });
    }
    
    // Validar coincidencia de contraseñas
    if (newPassword && confirmPassword) {
        [newPassword, confirmPassword].forEach(input => {
            input.addEventListener('input', function() {
                if (newPassword.value && confirmPassword.value) {
                    if (newPassword.value === confirmPassword.value) {
                        confirmPassword.style.borderColor = '';
                    } else {
                        confirmPassword.style.borderColor = '#ef4444';
                    }
                }
            });
        });
    }
}

function confirmarCambioContrasena() {
    const current = document.getElementById('currentPassword')?.value;
    const nueva = document.getElementById('newPassword')?.value;
    const confirmar = document.getElementById('confirmPassword')?.value;
    
    if (!current || !nueva || !confirmar) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    if (nueva !== confirmar) {
        alert('Las contraseñas nuevas no coinciden');
        return;
    }
    
    if (nueva.length < 8) {
        alert('La nueva contraseña debe tener al menos 8 caracteres');
        return;
    }
    
    // Simular cambio de contraseña
    showNotification('Cambiando contraseña...', 'info');
    
    setTimeout(() => {
        showNotification('Contraseña cambiada exitosamente', 'success');
        closeModal();
    }, 2000);
}

function exportarDatos() {
    showNotification('Preparando exportación de datos...', 'info');
    
    setTimeout(() => {
        showNotification('Archivo con todos sus datos está listo para descargar', 'success');
    }, 2500);
}

function eliminarCuenta() {
    if (confirm('¿Está seguro de eliminar su cuenta? Esta acción no se puede deshacer y se perderán todos sus datos.')) {
        if (confirm('Por favor confirme nuevamente. ¿Realmente desea eliminar su cuenta?')) {
            showNotification('Solicitando eliminación de cuenta...', 'info');
            
            // En un sistema real, aquí se enviaría una solicitud al servidor
            setTimeout(() => {
                showNotification('Solicitud de eliminación enviada. Un administrador procesará su solicitud.', 'warning');
            }, 2000);
        }
    }
}

// ============================================
// INICIALIZACIÓN MEJORADA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicialización existente...
    initClienteSession();
    
    // Configurar filtros de motores
    document.querySelectorAll('.motor-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const filtro = this.getAttribute('data-filter');
            if (filtro) {
                filtrarMotores(filtro);
                
                // Actualizar tabs activos
                document.querySelectorAll('.motor-tab').forEach(t => {
                    t.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Cargar datos de perfil si estamos en esa página
    if (document.getElementById('profileForm')) {
        cargarDatosPerfil();
        
        // Configurar envío del formulario
        document.getElementById('profileForm').addEventListener('submit', function(e) {
            e.preventDefault();
            guardarPerfil();
        });
    }
    
    // Configurar botones de motor
    document.querySelectorAll('.btn-ver-motor').forEach(btn => {
        btn.addEventListener('click', function() {
            const motorId = parseInt(this.getAttribute('data-motor'));
            if (motorId) {
                verDetalleMotor(motorId);
            }
        });
    });
    
    // Configurar tooltips para motores
    document.querySelectorAll('.motor-tooltip').forEach(el => {
        el.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: var(--text-dark);
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                z-index: 1000;
                max-width: 200px;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 5) + 'px';
            tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2) + 'px';
            
            this._tooltip = tooltip;
        });
        
        el.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
    
    // Inicializar gráficos de métricas si existen
    const metricCharts = document.querySelectorAll('.metric-chart');
    if (metricCharts.length > 0) {
        inicializarMetricas();
    }
});

function inicializarMetricas() {
    // Simular datos para gráficos
    const metricData = {
        usoMensual: [85, 92, 78, 95, 88, 91, 82],
        fallasPorMotor: [2, 5, 1, 3, 2],
        costosMantenimiento: [45000, 120000, 65000, 85000, 45000]
    };
    
    // Crear gráfico de uso mensual
    const usoChart = document.querySelector('.metric-chart[data-chart="uso"]');
    if (usoChart) {
        const maxValue = Math.max(...metricData.usoMensual);
        usoChart.innerHTML = '';
        
        metricData.usoMensual.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'metric-bar';
            bar.style.height = `${(value / maxValue) * 100}%`;
            bar.title = `Mes ${index + 1}: ${value}% de uso`;
            usoChart.appendChild(bar);
        });
    }
}

// ============================================
// FUNCIONES PARA SOLICITUDES Y NUEVOS MOTORES
// ============================================

// Datos para solicitudes de inspección
const horariosDisponibles = [
    { hora: '07:00', disponible: true },
    { hora: '08:00', disponible: true },
    { hora: '09:00', disponible: true },
    { hora: '10:00', disponible: false },
    { hora: '11:00', disponible: true },
    { hora: '13:00', disponible: true },
    { hora: '14:00', disponible: true },
    { hora: '15:00', disponible: true }
];

// Datos para tipos de motor
const tiposMotor = [
    { id: 'monofasico', nombre: 'Monofásico', icono: 'fas fa-bolt', descripcion: 'Motor de 1 fase, ideal para aplicaciones domésticas' },
    { id: 'trifasico', nombre: 'Trifásico', icono: 'fas fa-bolt', descripcion: 'Motor de 3 fases, para aplicaciones industriales' },
    { id: 'dc', nombre: 'Corriente Continua', icono: 'fas fa-car-battery', descripcion: 'Motor DC para aplicaciones especiales' },
    { id: 'especial', nombre: 'Especial', icono: 'fas fa-cogs', descripcion: 'Motores con especificaciones particulares' }
];

// ============================================
// FUNCIONES PARA SOLICITUD DE INSPECCIÓN
// ============================================

let solicitudInspeccion = {
    pasoActual: 1,
    totalPasos: 4,
    datos: {
        tipoServicio: '',
        motorId: null,
        fecha: '',
        hora: '',
        direccion: '',
        contacto: '',
        problema: '',
        urgencia: 'normal'
    }
};

function initSolicitudInspeccion() {
    // Cargar datos guardados si existen
    const savedData = localStorage.getItem('solicitudInspeccion');
    if (savedData) {
        solicitudInspeccion = JSON.parse(savedData);
    }
    
    // Inicializar stepper
    actualizarStepper();
    
    // Cargar datos en formulario si existen
    if (solicitudInspeccion.datos.tipoServicio) {
        const radio = document.querySelector(`input[value="${solicitudInspeccion.datos.tipoServicio}"]`);
        if (radio) radio.checked = true;
    }
    
    if (solicitudInspeccion.datos.motorId) {
        const motorOption = document.querySelector(`.motor-option[data-id="${solicitudInspeccion.datos.motorId}"]`);
        if (motorOption) motorOption.classList.add('selected');
    }
    
    if (solicitudInspeccion.datos.fecha) {
        document.getElementById('fechaInspeccion').value = solicitudInspeccion.datos.fecha;
    }
    
    if (solicitudInspeccion.datos.hora) {
        const timeSlot = document.querySelector(`.time-slot[data-hora="${solicitudInspeccion.datos.hora}"]`);
        if (timeSlot) timeSlot.classList.add('selected');
    }
    
    // Inicializar selectores de hora
    inicializarHorarios();
}

function actualizarStepper() {
    // Actualizar estado de pasos
    document.querySelectorAll('.step-item').forEach((step, index) => {
        const stepNumber = index + 1;
        
        step.classList.remove('active', 'completed');
        
        if (stepNumber === solicitudInspeccion.pasoActual) {
            step.classList.add('active');
        } else if (stepNumber < solicitudInspeccion.pasoActual) {
            step.classList.add('completed');
        }
    });
    
    // Mostrar paso actual
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === solicitudInspeccion.pasoActual) {
            step.classList.add('active');
        }
    });
}

function siguientePaso() {
    if (!validarPasoActual()) {
        showNotification('Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    if (solicitudInspeccion.pasoActual < solicitudInspeccion.totalPasos) {
        solicitudInspeccion.pasoActual++;
        guardarDatosSolicitud();
        actualizarStepper();
        actualizarResumen();
        
        // Scroll al top del formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function pasoAnterior() {
    if (solicitudInspeccion.pasoActual > 1) {
        solicitudInspeccion.pasoActual--;
        actualizarStepper();
        
        // Scroll al top del formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function validarPasoActual() {
    switch(solicitudInspeccion.pasoActual) {
        case 1:
            // Validar tipo de servicio
            const tipoServicio = document.querySelector('input[name="tipoServicio"]:checked');
            if (!tipoServicio) return false;
            
            // Validar motor seleccionado
            if (tipoServicio.value !== 'nuevo' && !solicitudInspeccion.datos.motorId) {
                const motorOption = document.querySelector('.motor-option.selected');
                if (!motorOption) return false;
            }
            return true;
            
        case 2:
            // Validar fecha y hora
            if (!solicitudInspeccion.datos.fecha || !solicitudInspeccion.datos.hora) return false;
            return true;
            
        case 3:
            // Validar dirección y contacto
            if (!solicitudInspeccion.datos.direccion || !solicitudInspeccion.datos.contacto) return false;
            return true;
            
        default:
            return true;
    }
}

function seleccionarTipoServicio(tipo) {
    solicitudInspeccion.datos.tipoServicio = tipo;
    
    // Mostrar/ocultar selector de motor según tipo
    const motorSelector = document.querySelector('.motor-selector');
    if (motorSelector) {
        if (tipo === 'nuevo') {
            motorSelector.style.display = 'none';
            solicitudInspeccion.datos.motorId = null;
        } else {
            motorSelector.style.display = 'block';
        }
    }
    
    guardarDatosSolicitud();
}

function seleccionarMotor(motorId) {
    // Deseleccionar todos
    document.querySelectorAll('.motor-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Seleccionar el actual
    const selected = document.querySelector(`.motor-option[data-id="${motorId}"]`);
    if (selected) {
        selected.classList.add('selected');
        solicitudInspeccion.datos.motorId = motorId;
        guardarDatosSolicitud();
    }
}

function inicializarHorarios() {
    const container = document.querySelector('.time-slots');
    if (!container) return;
    
    container.innerHTML = '';
    
    horariosDisponibles.forEach(horario => {
        const slot = document.createElement('div');
        slot.className = `time-slot ${horario.disponible ? '' : 'disabled'}`;
        slot.setAttribute('data-hora', horario.hora);
        
        if (!horario.disponible) {
            slot.innerHTML = `
                <span class="time">${horario.hora}</span>
                <span class="availability">No disponible</span>
            `;
        } else {
            slot.innerHTML = `
                <span class="time">${horario.hora}</span>
                <span class="availability">Disponible</span>
            `;
            slot.addEventListener('click', () => seleccionarHora(horario.hora));
        }
        
        container.appendChild(slot);
    });
}

function seleccionarHora(hora) {
    // Deseleccionar todos
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Seleccionar la hora
    const selected = document.querySelector(`.time-slot[data-hora="${hora}"]`);
    if (selected) {
        selected.classList.add('selected');
        solicitudInspeccion.datos.hora = hora;
        guardarDatosSolicitud();
    }
}

function actualizarResumen() {
    // Actualizar previsualización
    document.querySelectorAll('.preview-value').forEach(element => {
        const field = element.getAttribute('data-field');
        if (solicitudInspeccion.datos[field]) {
            element.textContent = solicitudInspeccion.datos[field];
        }
    });
    
    // Actualizar nombre del motor si está seleccionado
    if (solicitudInspeccion.datos.motorId) {
        const motor = motoresEjemplo.find(m => m.id == solicitudInspeccion.datos.motorId);
        if (motor) {
            const element = document.querySelector('.preview-value[data-field="motorNombre"]');
            if (element) element.textContent = `${motor.marca} ${motor.modelo}`;
        }
    }
}

function guardarDatosSolicitud() {
    // Guardar datos del formulario
    const fechaInput = document.getElementById('fechaInspeccion');
    const direccionInput = document.getElementById('direccionInspeccion');
    const contactoInput = document.getElementById('contactoInspeccion');
    const problemaInput = document.getElementById('problemaDescripcion');
    const urgenciaSelect = document.getElementById('urgenciaInspeccion');
    
    if (fechaInput) solicitudInspeccion.datos.fecha = fechaInput.value;
    if (direccionInput) solicitudInspeccion.datos.direccion = direccionInput.value;
    if (contactoInput) solicitudInspeccion.datos.contacto = contactoInput.value;
    if (problemaInput) solicitudInspeccion.datos.problema = problemaInput.value;
    if (urgenciaSelect) solicitudInspeccion.datos.urgencia = urgenciaSelect.value;
    
    // Guardar en localStorage
    localStorage.setItem('solicitudInspeccion', JSON.stringify(solicitudInspeccion));
}

function enviarSolicitud() {
    if (!validarPasoActual()) {
        showNotification('Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    // Generar ID de solicitud
    const solicitudId = `INS-${Date.now().toString().slice(-6)}`;
    
    // Simular envío
    showNotification('Enviando solicitud de inspección...', 'info');
    
    setTimeout(() => {
        // Mostrar confirmación
        solicitudInspeccion.pasoActual++;
        actualizarStepper();
        
        // Mostrar ID de solicitud
        const idElement = document.getElementById('solicitudId');
        if (idElement) idElement.textContent = solicitudId;
        
        // Limpiar datos guardados
        localStorage.removeItem('solicitudInspeccion');
        
        showNotification('Solicitud enviada exitosamente', 'success');
        
        // Scroll al top de la confirmación
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// ============================================
// FUNCIONES PARA NUEVO MOTOR
// ============================================

let nuevoMotor = {
    pasoActual: 1,
    totalPasos: 3,
    datos: {
        tipo: '',
        marca: '',
        modelo: '',
        serial: '',
        potencia: '',
        voltaje: '',
        rpm: '',
        añoFabricacion: '',
        fechaCompra: '',
        ubicacion: '',
        notas: '',
        documentos: []
    }
};

function initNuevoMotor() {
    // Cargar datos guardados si existen
    const savedData = localStorage.getItem('nuevoMotor');
    if (savedData) {
        nuevoMotor = JSON.parse(savedData);
    }
    
    // Inicializar stepper
    actualizarStepperMotor();
    
    // Inicializar tipo de motor
    if (nuevoMotor.datos.tipo) {
        const typeOption = document.querySelector(`.type-option[data-type="${nuevoMotor.datos.tipo}"]`);
        if (typeOption) typeOption.classList.add('selected');
    }
    
    // Cargar datos en campos
    Object.keys(nuevoMotor.datos).forEach(key => {
        const element = document.getElementById(key);
        if (element && nuevoMotor.datos[key]) {
            element.value = nuevoMotor.datos[key];
        }
    });
    
    // Inicializar upload de documentos
    inicializarUploadDocumentos();
}

function actualizarStepperMotor() {
    // Actualizar estado de pasos
    document.querySelectorAll('.step-item').forEach((step, index) => {
        const stepNumber = index + 1;
        
        step.classList.remove('active', 'completed');
        
        if (stepNumber === nuevoMotor.pasoActual) {
            step.classList.add('active');
        } else if (stepNumber < nuevoMotor.pasoActual) {
            step.classList.add('completed');
        }
    });
    
    // Mostrar paso actual
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === nuevoMotor.pasoActual) {
            step.classList.add('active');
        }
    });
}

function siguientePasoMotor() {
    if (!validarPasoMotorActual()) {
        showNotification('Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    if (nuevoMotor.pasoActual <= nuevoMotor.totalPasos) {
        nuevoMotor.pasoActual++;
        guardarDatosMotor();
        actualizarStepperMotor();
        actualizarResumenMotor();
        
        // Scroll al top del formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function pasoAnteriorMotor() {
    if (nuevoMotor.pasoActual > 1) {
        nuevoMotor.pasoActual--;
        actualizarStepperMotor();
        
        // Scroll al top del formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function validarPasoMotorActual() {
    switch(nuevoMotor.pasoActual) {
        case 1:
            // Validar tipo de motor
            if (!nuevoMotor.datos.tipo) return false;
            return true;
            
        case 2:
            // Validar datos básicos
            if (!nuevoMotor.datos.marca || !nuevoMotor.datos.modelo || !nuevoMotor.datos.serial) return false;
            return true;
            
        default:
            return true;
    }
}

function seleccionarTipoMotor(tipo) {
    // Deseleccionar todos
    document.querySelectorAll('.type-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Seleccionar el tipo
    const selected = document.querySelector(`.type-option[data-type="${tipo}"]`);
    if (selected) {
        selected.classList.add('selected');
        nuevoMotor.datos.tipo = tipo;
        guardarDatosMotor();
    }
}

function inicializarUploadDocumentos() {
    const uploadArea = document.querySelector('.document-upload');
    const fileInput = document.getElementById('documentUpload');
    
    if (!uploadArea || !fileInput) return;
    
    // Click en área de upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            procesarArchivos(Array.from(e.dataTransfer.files));
        }
    });
    
    // Cambio en input de archivos
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            procesarArchivos(Array.from(e.target.files));
        }
    });
}

function procesarArchivos(archivos) {
    archivos.forEach(archivo => {
        // Validar tipo y tamaño
        if (archivo.size > 10 * 1024 * 1024) { // 10MB max
            showNotification(`El archivo ${archivo.name} es demasiado grande (máx. 10MB)`, 'error');
            return;
        }
        
        if (!archivo.type.match(/(image|pdf)/)) {
            showNotification(`El archivo ${archivo.name} debe ser una imagen o PDF`, 'error');
            return;
        }
        
        // Agregar a la lista
        const documento = {
            id: Date.now(),
            nombre: archivo.name,
            tamaño: formatFileSize(archivo.size),
            tipo: archivo.type,
            archivo: archivo
        };
        
        nuevoMotor.datos.documentos.push(documento);
        actualizarListaDocumentos();
        guardarDatosMotor();
    });
}

function actualizarListaDocumentos() {
    const container = document.querySelector('.uploaded-files');
    if (!container) return;
    
    container.innerHTML = '';
    
    nuevoMotor.datos.documentos.forEach(doc => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-alt file-icon"></i>
                <div>
                    <div class="file-name">${doc.nombre}</div>
                    <div class="file-size">${doc.tamaño}</div>
                </div>
            </div>
            <i class="fas fa-times file-remove" onclick="eliminarDocumento(${doc.id})"></i>
        `;
        container.appendChild(fileItem);
    });
}

function eliminarDocumento(id) {
    nuevoMotor.datos.documentos = nuevoMotor.datos.documentos.filter(doc => doc.id !== id);
    actualizarListaDocumentos();
    guardarDatosMotor();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function actualizarResumenMotor() {
    // Actualizar resumen
    document.querySelectorAll('.summary-value').forEach(element => {
        const field = element.getAttribute('data-field');
        if (nuevoMotor.datos[field]) {
            element.textContent = nuevoMotor.datos[field];
        }
    });
    
    // Actualizar tipo de motor
    if (nuevoMotor.datos.tipo) {
        const tipo = tiposMotor.find(t => t.id === nuevoMotor.datos.tipo);
        if (tipo) {
            const element = document.querySelector('.summary-value[data-field="tipoNombre"]');
            if (element) element.textContent = tipo.nombre;
        }
    }
}

function guardarDatosMotor() {
    // Guardar datos del formulario
    const campos = ['marca', 'modelo', 'serial', 'potencia', 'voltaje', 'rpm', 'añoFabricacion', 'fechaCompra', 'ubicacion', 'notas'];
    
    campos.forEach(campo => {
        const element = document.getElementById(campo);
        if (element) nuevoMotor.datos[campo] = element.value;
    });
    
    // Guardar en localStorage
    localStorage.setItem('nuevoMotor', JSON.stringify(nuevoMotor));
}

function registrarNuevoMotor() {
    if (!validarPasoMotorActual()) {
        showNotification('Por favor complete todos los campos requeridos', 'error');
        return;
    }
    
    // Generar ID de motor
    const motorId = motoresEjemplo.length + 1;
    const serial = nuevoMotor.datos.serial || `MOT-${Date.now().toString().slice(-6)}`;
    
    // Crear objeto de motor
    const motorNuevo = {
        id: motorId,
        serial: serial,
        marca: nuevoMotor.datos.marca,
        modelo: nuevoMotor.datos.modelo,
        tipo: nuevoMotor.datos.tipo === 'monofasico' ? 'Monofásico' : 'Trifásico',
        potencia: nuevoMotor.datos.potencia,
        voltaje: nuevoMotor.datos.voltaje,
        rpm: parseInt(nuevoMotor.datos.rpm) || 0,
        añoFabricacion: parseInt(nuevoMotor.datos.añoFabricacion) || new Date().getFullYear(),
        fechaCompra: nuevoMotor.datos.fechaCompra,
        estado: 'Activo',
        salud: 100,
        proximoMantenimiento: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ubicacion: nuevoMotor.datos.ubicacion,
        notas: nuevoMotor.datos.notas,
        historialServicios: 0,
        ultimoServicio: new Date().toISOString().split('T')[0]
    };
    
    // Simular registro
    showNotification('Registrando nuevo motor...', 'info');
    
    setTimeout(() => {
        // Agregar a la lista (en un sistema real, se enviaría al servidor)
        motoresEjemplo.push(motorNuevo);
        
        // Mostrar confirmación
        nuevoMotor.pasoActual++;
        actualizarStepperMotor();
        
        // Mostrar datos del motor registrado
        const serialElement = document.getElementById('motorSerial');
        if (serialElement) serialElement.textContent = serial;
        
        // Limpiar datos guardados
        localStorage.removeItem('nuevoMotor');
        
        showNotification('Motor registrado exitosamente', 'success');
        
        // Scroll al top de la confirmación
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
}

// ============================================
// INICIALIZACIÓN MEJORADA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inicialización existente...
    
    // Inicializar solicitud de inspección si estamos en esa página
    if (document.getElementById('solicitudInspeccionForm')) {
        initSolicitudInspeccion();
        
        // Configurar eventos para radios de tipo de servicio
        document.querySelectorAll('input[name="tipoServicio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                seleccionarTipoServicio(e.target.value);
            });
        });
        
        // Configurar selector de fecha
        const fechaInput = document.getElementById('fechaInspeccion');
        if (fechaInput) {
            // Establecer fecha mínima como mañana
            const mañana = new Date();
            mañana.setDate(mañana.getDate() + 1);
            fechaInput.min = mañana.toISOString().split('T')[0];
            
            // Establecer fecha máxima como dentro de 30 días
            const maxFecha = new Date();
            maxFecha.setDate(maxFecha.getDate() + 30);
            fechaInput.max = maxFecha.toISOString().split('T')[0];
            
            fechaInput.addEventListener('change', guardarDatosSolicitud);
        }
        
        // Configurar otros campos
        ['direccionInspeccion', 'contactoInspeccion', 'problemaDescripcion', 'urgenciaInspeccion'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', guardarDatosSolicitud);
            }
        });
    }
    
    // Inicializar nuevo motor si estamos en esa página
    if (document.getElementById('nuevoMotorForm')) {
        initNuevoMotor();
        
        // Configurar eventos para campos del formulario
        const campos = ['marca', 'modelo', 'serial', 'potencia', 'voltaje', 'rpm', 'añoFabricacion', 'fechaCompra', 'ubicacion', 'notas'];
        campos.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', guardarDatosMotor);
            }
        });
    }
});