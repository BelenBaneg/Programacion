document.addEventListener('DOMContentLoaded', function() {
    
    let eventos = [];
    const contenedorCronograma = document.getElementById('contenedor-cronograma');

    function cargarCronograma() {
        const urlNube = 'https://raw.githubusercontent.com/BelenBaneg/Programacion/refs/heads/main/TAP3/js/eventos.js';
        
        fetch(urlNube)
            .then(response => {
                if (!response.ok) throw new Error('No se pudo descargar el archivo de eventos');
                return response.json();
            })
            .then(data => {
                eventos = data;
                
               
                eventos.sort((a, b) => {
                    const fechaA = new Date(a.fecha + 'T' + a.horario);
                    const fechaB = new Date(b.fecha + 'T' + b.horario);
                    return fechaA - fechaB;
                });

                renderizarCronograma();
            })
            .catch(error => {
                console.error('Error al cargar el cronograma:', error);
                
              
                eventos = [
                    { "evento": "Noche de Indie Pop", "fecha": "2026-11-14", "lugar": "Escenario Norte", "ciudad": "Santiago del Estero", "horario": "19:30", "descripcion": "Sonidos frescos y modernos." },
                    { "evento": "Concierto de Rock", "fecha": "2026-11-14", "lugar": "Estadio Madre de Ciudades", "ciudad": "Santiago del Estero", "horario": "21:00", "descripcion": "La noche más esperada." },
                    { "evento": "Folclore Fusión", "fecha": "2026-11-15", "lugar": "Escenario Principal", "ciudad": "Santiago del Estero", "horario": "20:00", "descripcion": "Una fusión única." }
                ];
                
       
                eventos.sort((a, b) => {
                    return new Date(a.fecha + 'T' + a.horario) - new Date(b.fecha + 'T' + b.horario);
                });
                
                renderizarCronograma();
            });
    }

    function formatearFechaBonita(fechaStr) {
        const fecha = new Date(fechaStr + 'T00:00:00');
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        if (isNaN(fecha.getTime())) return fechaStr;
        return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]}`;
    }

    function renderizarCronograma() {
        if (!contenedorCronograma) return;
        contenedorCronograma.innerHTML = '';

   
        const listaOrdenada = document.createElement('ol');
        listaOrdenada.style.listStyle = 'none';
        listaOrdenada.style.padding = '0';

        eventos.forEach((evento) => {
            const itemLista = document.createElement('li');
   
            itemLista.style.background = '#ffffff';
            itemLista.style.marginBottom = '15px';
            itemLista.style.padding = '20px';
            itemLista.style.borderRadius = '8px';
            itemLista.style.borderLeft = '4px solid var(--color-secundario)';
            itemLista.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
            itemLista.style.display = 'flex';
            itemLista.style.justifyContent = 'space-between';
            itemLista.style.alignItems = 'center';
            itemLista.style.flexWrap = 'wrap';
            itemLista.style.gap = '10px';

            itemLista.innerHTML = `
                <div style="flex: 2; min-width: 250px;">
                    <span style="font-size: 0.85rem; color: var(--color-acento); font-weight: bold; text-transform: uppercase;">
                        <i class="fa-solid fa-calendar-day"></i> ${formatearFechaBonita(evento.fecha)}
                    </span>
                    <h3 style="margin: 5px 0; font-size: 1.3rem; color: var(--color-texto-oscuro); font-family: var(--fuente-titulos);">
                        ${evento.evento}
                    </h3>
                    <p style="margin: 0; font-size: 0.95rem; color: #6b7280;">
                        <i class="fa-solid fa-location-dot"></i> ${evento.lugar}
                    </p>
                </div>
                <div style="flex: 1; text-align: right; min-width: 100px;">
                    <span style="background: #e0e7ff; color: var(--color-secundario); padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 1.1rem; display: inline-block;">
                        <i class="fa-solid fa-clock"></i> ${evento.horario} hs
                    </span>
                </div>
            `;
            listaOrdenada.appendChild(itemLista);
        });

        contenedorCronograma.appendChild(listaOrdenada);
    }

    cargarCronograma();
});