document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // 1. CARGA DE DATOS DESDE JSON / API
    // =============================================
    let eventos = [];
    
    // =============================================
    // 2. REFERENCIAS A ELEMENTOS DEL DOM
    // =============================================
    const contenedorTarjetas = document.getElementById('contenedor-tarjetas');

    // =============================================
    // 3. CARGA DE EVENTOS (Desde GitHub)
    // =============================================
    function cargarEventos() {
        const urlNube = 'https://raw.githubusercontent.com/BelenBaneg/Programacion/refs/heads/main/TAP3/js/eventos.js';
        
        fetch(urlNube)
            .then(response => {
                if (!response.ok) throw new Error('No se encontró el archivo de eventos en la nube');
                return response.json();
            })
            .then(data => {
                eventos = data;
                actualizarTarjetas();
            })
            .catch(error => {
                console.error('Falló la carga desde la nube, usando Plan B:', error);
                
                // EL PLAN B: Datos de emergencia por si falla internet
                eventos = [
                    {
                        "evento": "Concierto de Rock",
                        "fecha": "2026-11-14",
                        "lugar": "Estadio Madre de Ciudades",
                        "ciudad": "Santiago del Estero",
                        "horario": "21:00",
                        "descripcion": "La noche más esperada del rock nacional. Grandes bandas y solistas se unen en un escenario único."
                    },
                    {
                        "evento": "Noche de Indie Pop",
                        "fecha": "2026-11-14",
                        "lugar": "Escenario Norte",
                        "ciudad": "Santiago del Estero",
                        "horario": "19:30",
                        "descripcion": "Sonidos frescos y modernos con las mejores bandas emergentes del indie pop argentino."
                    }
                ];
                actualizarTarjetas();
            });
    }

    // =============================================
    // 4. ACTUALIZACIÓN DINÁMICA DE TARJETAS (N Cantidades)
    // =============================================
    function actualizarTarjetas() {
        if (eventos && eventos.length > 0) {
            
            if (contenedorTarjetas) {
                contenedorTarjetas.innerHTML = ''; // Limpiamos el indicador de carga
                
                eventos.forEach((evento) => {
                    // Si el evento en el JSON no tiene imagen, se aplica la imagen IA por defecto local
                    const rutaImagen = evento.imagen || 'img/instrumentos-musicales-escenario-vacio-imagen-generada-ia_377307-1617.jpg';
                    
                    const tarjetaHTML = `
                        <div class="tarjeta-artista">
                            <div class="contenedor-imagen-artista">
                                <img src="${rutaImagen}" alt="${evento.evento}" class="imagen-artista">
                            </div>
                            <h3>${evento.evento}</h3>
                            <p>${evento.descripcion}</p>
                        </div>
                    `;
                    contenedorTarjetas.innerHTML += tarjetaHTML;
                });
            }
        }
    }

    // =============================================
    // 5. INICIALIZACIÓN
    // =============================================
    cargarEventos();
});