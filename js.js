let dolar = {};
let oficial = null;
let paralelo = null;

async function getDolar() {
    try {
        // Mostrar estado de carga inicial
        document.getElementById('dolar-oficial').textContent = 'Cargando...';
        document.getElementById('dolar-paralelo').textContent = 'Cargando...';

        const response = await fetch('https://ve.dolarapi.com/v1/dolares');
        const data = await response.json();
        
        dolar = data;
        console.log(dolar);
        
        // Encontrar dólar oficial y paralelo
        oficial = dolar.find(d => d.fuente === 'oficial');
        paralelo = dolar.find(d => d.fuente === 'paralelo');
        
        if(oficial && paralelo) {
            console.log('Datos obtenidos correctamente');
            console.log(paralelo, typeof paralelo);
            console.log(oficial, typeof oficial);
            
            // Mostrar en la página solo si existen los datos
            document.getElementById('dolar-oficial').textContent = oficial.promedio + ' Bs';
            document.getElementById('dolar-paralelo').textContent = paralelo.promedio + ' Bs';
        } else {
            console.log('No se encontraron datos del dólar');
            
            // Mostrar mensaje de error
            document.getElementById('dolar-oficial').textContent = 'No disponible';
            document.getElementById('dolar-paralelo').textContent = 'No disponible';
        }
        
    } catch (error) {
        console.error('Error obteniendo datos del dólar:', error);
        
        // Mostrar mensaje de error
        document.getElementById('dolar-oficial').textContent = 'Error';
        document.getElementById('dolar-paralelo').textContent = 'Error';
    }
}                       

// Función para cambiar entre modo oscuro y claro
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Función para inicializar el tema
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    // Modo oscuro como predeterminado
    const theme = savedTheme || 'dark';
    
    document.documentElement.setAttribute('data-theme', theme);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema
    initTheme();
    
    // Configurar el botón de toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        themeToggle.addEventListener('click', () => {
            themeToggle.classList.toggle('active');
        });
    }
    
    // Obtener referencias a los elementos del DOM
    const tabParalelo = document.getElementById('tab-paralelo');
    const tabOficial = document.getElementById('tab-oficial');
    const calculadoraParalelo = document.getElementById('paralelo');
    const calculadoraOficial = document.getElementById('oficial');
    
    // Configurar tabs
    calculadoraParalelo.style.display = 'none';
    calculadoraOficial.style.display = 'block';

    tabParalelo.addEventListener('click', () => {
        calculadoraParalelo.style.display = 'block';
        calculadoraOficial.style.display = 'none';

        tabParalelo.classList.add('active');
        tabOficial.classList.remove('active');
    });
    
    tabOficial.addEventListener('click', () => {
        calculadoraParalelo.style.display = 'none';
        calculadoraOficial.style.display = 'block';
        
        tabParalelo.classList.remove('active');
        tabOficial.classList.add('active');
    });
    
    // Obtener datos del dólar
    getDolar();
});

// Función reutilizable para calcular
function setupCalculadora(tipoDolar, precioDolar) {
    // Bolívares a Dólares - cálculo automático al escribir
    const inputBolivares = document.getElementById(`cantidad-bolivares-${tipoDolar}`);
    const ctnBolivares = inputBolivares.closest('.ctn_calculo');
    
    inputBolivares.addEventListener('focus', () => {
        ctnBolivares.classList.add('filled');
    });
    
    inputBolivares.addEventListener('input', (e) => {
        ctnBolivares.classList.add('filled');
        const cantidad = parseFloat(e.target.value);
        const resultadoEl = document.getElementById(`resultado-bolivares-${tipoDolar}`);
        
        if (!precioDolar) {
            resultadoEl.textContent = 'Esperando datos del dólar...';
            return;
        }
        
        if (isNaN(cantidad) || e.target.value === '') {
            resultadoEl.textContent = '';
            return;
        }
        
        const resultado = cantidad / precioDolar;
        resultadoEl.textContent = `${resultado.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] || '0.00'} $`;
    });
    
    inputBolivares.addEventListener('blur', () => {
        if (inputBolivares.value === '') {
            ctnBolivares.classList.remove('filled');
        }
    });

    // Dólares a Bolívares - cálculo automático al escribir
    const inputDolares = document.getElementById(`cantidad-dolares-${tipoDolar}`);
    const ctnDolares = inputDolares.closest('.ctn_calculo');
    
    inputDolares.addEventListener('focus', () => {
        ctnDolares.classList.add('filled');
    });
    
    inputDolares.addEventListener('input', (e) => {
        ctnDolares.classList.add('filled');
        const cantidad = parseFloat(e.target.value);
        const resultadoEl = document.getElementById(`resultado-dolares-${tipoDolar}`);
        
        if (!precioDolar) {
            resultadoEl.textContent = 'Esperando datos del dólar...';
            return;
        }
        
        if (isNaN(cantidad) || e.target.value === '') {
            resultadoEl.textContent = '';
            return;
        }
        
        const resultado = cantidad * precioDolar;
        resultadoEl.textContent = `${resultado.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0] || '0.00'} Bs`;
    });
    
    inputDolares.addEventListener('blur', () => {
        if (inputDolares.value === '') {
            ctnDolares.classList.remove('filled');
        }
    });
}

// Configurar calculadoras cuando se carguen los datos
function configurarCalculadoras() {
    if (paralelo && paralelo.promedio) {
        setupCalculadora('paralelo', paralelo.promedio);
        console.log('Calculadora paralelo configurada');
    }
    if (oficial && oficial.promedio) {
        setupCalculadora('oficial', oficial.promedio);
        console.log('Calculadora oficial configurada');
    }
}

// Llamar después de obtener datos
const originalGetDolar = getDolar;
getDolar = function() {
    originalGetDolar().then(() => {
        configurarCalculadoras();
    });
};