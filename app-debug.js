// Debug version - Version simplificada para diagnosticar
console.log('=== App Debug Script Cargado ===');

// Variables globales
let isConnected = false;
let lastUpdateTime = null;

// Función simple de test
async function testConnection() {
    try {
        console.log('Haciendo fetch a /api/stats...');
        const response = await fetch('/api/stats');
        console.log('Respuesta:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Datos recibidos:', data);
            
            // Mostrar datos en los elementos
            document.getElementById('today-count').textContent = data.todayCount;
            document.getElementById('yesterday-count').textContent = data.yesterdayCount;
            document.getElementById('total-count').textContent = data.totalCount;
            
            // Agregar fechas
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            
            // Formatear fechas
            const todayFormatted = today.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const yesterdayFormatted = yesterday.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // Mostrar fechas en las tarjetas
            const todayDateElement = document.getElementById('today-date');
            const yesterdayDateElement = document.getElementById('yesterday-date');
            
            if (todayDateElement) {
                todayDateElement.textContent = todayFormatted;
            }
            if (yesterdayDateElement) {
                yesterdayDateElement.textContent = yesterdayFormatted;
            }
            
            // Actualizar estado
            document.getElementById('status-text').textContent = 'Conectado al servidor';
            
            // Actualizar gráfico si hay datos
            if (data.weeklyData) {
                updateWeeklyChart(data.weeklyData);
            }
            
            // Cargar gráfico de top hoteles
            loadTopHotels();
            
            // Actualizar fecha
            updateLastUpdateTime();
            
            console.log('Dashboard actualizado correctamente');
        } else {
            console.error('Error en respuesta:', response.status);
        }
    } catch (error) {
        console.error('Error en conexión:', error);
        document.getElementById('status-text').textContent = 'Error: ' + error.message;
    }
}

// Función para actualizar el gráfico
function updateWeeklyChart(weeklyData) {
    const chartContainer = document.getElementById('weekly-chart');
    const loadingDiv = document.getElementById('loading');
    
    if (!chartContainer) return;
    
    // Ocultar loading y mostrar gráfico
    loadingDiv.style.display = 'none';
    chartContainer.style.display = 'block';
    
    // Crear HTML del gráfico con barras horizontales
    let chartHTML = '';
    const maxCount = Math.max(...weeklyData.map(d => d.count));
    
    weeklyData.forEach(dayData => {
        const width = maxCount > 0 ? (dayData.count / maxCount) * 100 : 0;
        chartHTML += `
            <div class="chart-bar" title="${dayData.dayFull} ${dayData.date}: ${dayData.count} registros">
                <div class="bar-label">
                    <strong>${dayData.day}</strong>
                    <small>${dayData.date}</small>
                </div>
                <div class="bar" style="width: ${width}%"></div>
                <div class="bar-count">${dayData.count}</div>
            </div>
        `;
    });
    
    chartContainer.innerHTML = chartHTML;
    console.log('Gráfico actualizado con barras horizontales y fechas');
}

// Función para cargar top hoteles
async function loadTopHotels() {
    try {
        console.log('=== CARGANDO TOP HOTELES ===');
        console.log('Haciendo fetch a /api/top-hotels...');
        const response = await fetch('/api/top-hotels');
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Top hoteles obtenidos desde la base de datos:', data);
            updateHotelsChart(data.topHotels);
        } else {
            console.error('Error cargando top hoteles:', response.status);
            // Mostrar mensaje de error en lugar de carga infinita
            const loadingDiv = document.getElementById('loading-hotels');
            if (loadingDiv) {
                loadingDiv.style.display = 'none';
            }
            const chartContainer = document.getElementById('hotels-chart');
            if (chartContainer) {
                chartContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Error cargando datos de hoteles</p>';
                chartContainer.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('Error en carga de top hoteles:', error);
        // Mostrar mensaje de error en lugar de carga infinita
        const loadingDiv = document.getElementById('loading-hotels');
        if (loadingDiv) {
            loadingDiv.style.display = 'none';
        }
        const chartContainer = document.getElementById('hotels-chart');
        if (chartContainer) {
            chartContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Error de conexión</p>';
            chartContainer.style.display = 'block';
        }
    }
}

// Función para actualizar el gráfico de hoteles
function updateHotelsChart(topHotels) {
    const chartContainer = document.getElementById('hotels-chart');
    const loadingDiv = document.getElementById('loading-hotels');
    
    if (!chartContainer) return;
    
    // Ocultar loading y mostrar gráfico
    loadingDiv.style.display = 'none';
    chartContainer.style.display = 'block';
    
    if (!topHotels || topHotels.length === 0) {
        chartContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No hay datos de hoteles disponibles</p>';
        return;
    }
    
    // Crear HTML del gráfico de hoteles
    let chartHTML = '';
    const maxCount = Math.max(...topHotels.map(h => h.count));
    console.log('Valor máximo para escalado:', maxCount);
    console.log('Datos de hoteles recibidos:', topHotels);
    
    topHotels.forEach((hotel, index) => {
        const width = maxCount > 0 ? Math.max((hotel.count / maxCount) * 100, 5) : 5; // Mínimo 5%
        console.log(`Hotel ${hotel.hotelId}: ${hotel.count} usuarios -> ${width.toFixed(1)}% de ancho`);
        chartHTML += `
            <div class="chart-bar" title="Hotel ${hotel.hotelId}: ${hotel.count} usuarios registrados">
                <div class="bar-label">${hotel.hotelId}</div>
                <div class="bar" style="width: ${width}%"></div>
                <div class="bar-count">${hotel.count}</div>
            </div>
        `;
    });
    
    chartContainer.innerHTML = chartHTML;
    console.log('Gráfico de hoteles actualizado');
}

// Función para actualizar fecha
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES');
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = timeString;
    }
}

// Función para buscar por hotel
async function searchHotel() {
    const hotelId = document.getElementById('hotel-search-input').value.trim();
    if (!hotelId) {
        alert('Por favor ingresa un ID de hotel');
        return;
    }
    
    try {
        console.log('Buscando hotel:', hotelId);
        const response = await fetch(`/api/hotel-users/${hotelId}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Datos del hotel:', data);
            
            document.getElementById('hotel-result').textContent = data.userCount;
            console.log(`Hotel ${hotelId} tiene ${data.userCount} usuarios`);
        } else {
            console.error('Error buscando hotel:', response.status);
            document.getElementById('hotel-result').textContent = '0';
        }
    } catch (error) {
        console.error('Error en búsqueda de hotel:', error);
        document.getElementById('hotel-result').textContent = 'Error';
    }
}

// Ejecutar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOM Cargado, ejecutando test ===');
    testConnection();
    
    // Agregar listener para Enter en búsqueda de hotel
    const searchInput = document.getElementById('hotel-search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchHotel();
            }
        });
    }
});

// Función para botón actualizar
function refreshData() {
    console.log('Actualizando datos...');
    testConnection();
}

// Función de debug para probar top hoteles independientemente
function testTopHotels() {
    console.log('=== TEST TOP HOTELES ===');
    loadTopHotels();
}

// Hacer disponible en window para debug
window.testTopHotels = testTopHotels;
