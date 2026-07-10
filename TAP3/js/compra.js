document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // 1. CARGA DE DATOS DESDE JSON
    // =============================================
    
    let eventos = [];
    let paises = [];
    let precioBase = 0;
    
    // Precios por tipo de entrada
    const PRECIOS = {
        'General': 5000,
        'VIP': 12000,
        'Palco': 20000
    };
    
    // =============================================
    // 2. REFERENCIAS A ELEMENTOS DEL DOM
    // =============================================
    
    const form = document.getElementById('formCompra');
    const selectEvento = document.getElementById('evento');
    const selectTipoEntrada = document.getElementById('tipoEntrada');
    const inputCantidad = document.getElementById('cantidad');
    const inputNombre = document.getElementById('nombre');
    const inputEmail = document.getElementById('email');
    const inputTelefono = document.getElementById('telefono');
    const inputFechaNac = document.getElementById('fechaNacimiento');
    const selectPais = document.getElementById('pais');
    const inputTarjeta = document.getElementById('tarjeta');
    const inputVencimiento = document.getElementById('vencimiento');
    const inputCvv = document.getElementById('cvv');
    const inputNombreTarjeta = document.getElementById('nombreTarjeta');
    
    const campoEventoDesc = document.getElementById('eventoDescripcion');
    const campoEventoFecha = document.getElementById('eventoFecha');
    const campoEventoUbicacion = document.getElementById('eventoUbicacion');
    const campoPrecioTotal = document.getElementById('precioTotal');
    const campoResumen = document.getElementById('resumenCompra');
    const btnSubmit = document.getElementById('btnSubmit');
    const mensajeEstado = document.getElementById('mensajeEstado');
    const contadorTiempo = document.getElementById('contadorTiempo');
    
// =============================================
// 3. CARGA DE PAÍSES (Desde GitHub Gist)
// =============================================

function cargarPaises() {
    console.log('🔄 Cargando países desde la nube...');
    const urlPaises = 'https://gist.githubusercontent.com/eduardolat/b2a252d17b17363fab0974bb0634d259/raw/f96ed93dd28fbaf00c4c22fe634ef646a05923e3/countries.json';
    
    fetch(urlPaises)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar la lista de países');
            return response.json();
        })
        .then(data => {
            paises = data;
            
            // Ordenar alfabéticamente por nombre en español (clave 'name_es')
            paises.sort((a, b) => {
                const nombreA = a.name_es || a.name || '';
                const nombreB = b.name_es || b.name || '';
                return nombreA.localeCompare(nombreB);
            });
            
            llenarSelectPaises(paises);
        })
        .catch(error => {
            console.error('Falló la carga de países desde la nube, usando Plan B:', error);
            // Fallback local con países más comunes de Latinoamérica y España
            const fallback = [
                { nameES: 'Argentina', iso2: 'AR' },
                { nameES: 'Bolivia', iso2: 'BO' },
                { nameES: 'Brasil', iso2: 'BR' },
                { nameES: 'Chile', iso2: 'CL' },
                { nameES: 'Colombia', iso2: 'CO' },
                { nameES: 'Costa Rica', iso2: 'CR' },
                { nameES: 'Cuba', iso2: 'CU' },
                { nameES: 'Ecuador', iso2: 'EC' },
                { nameES: 'El Salvador', iso2: 'SV' },
                { nameES: 'España', iso2: 'ES' },
                { nameES: 'Estados Unidos', iso2: 'US' },
                { nameES: 'Guatemala', iso2: 'GT' },
                { nameES: 'Honduras', iso2: 'HN' },
                { nameES: 'México', iso2: 'MX' },
                { nameES: 'Nicaragua', iso2: 'NI' },
                { nameES: 'Panamá', iso2: 'PA' },
                { nameES: 'Paraguay', iso2: 'PY' },
                { nameES: 'Perú', iso2: 'PE' },
                { nameES: 'Uruguay', iso2: 'UY' },
                { nameES: 'Venezuela', iso2: 'VE' }
            ];
            fallback.sort((a, b) => a.nameES.localeCompare(b.nameES));
            llenarSelectPaises(fallback);
        });
}

function llenarSelectPaises(listaPaises) {
    selectPais.innerHTML = '<option value="">Seleccionar país...</option>';
    
    if (!listaPaises || listaPaises.length === 0) {
        selectPais.innerHTML = '<option value="">No hay países disponibles</option>';
        return;
    }
    
    listaPaises.forEach(pais => {
        const option = document.createElement('option');
       
        option.value = pais.code || pais.iso2 || pais.codigo || '';
        option.textContent = pais.name_es || pais.nameES || pais.nombre || pais.name || 'País desconocido';
        selectPais.appendChild(option);
    });
    
    console.log(`✅ Select de países poblado con ${listaPaises.length} opciones`);
}

// =============================================
    // 4. CARGA DE EVENTOS (Desde GitHub)
    // =============================================
    
    function cargarEventos() {
        const urlEventos = 'https://raw.githubusercontent.com/BelenBaneg/Programacion/refs/heads/main/TAP3/js/eventos.js';
        
        fetch(urlEventos)
            .then(response => {
                if (!response.ok) throw new Error('No se encontró el archivo de eventos en la nube');
                return response.json();
            })
            .then(data => {
                eventos = data;
           
                eventos.forEach((evento, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `${evento.evento} - ${formatearFecha(evento.fecha)}`;
                    selectEvento.appendChild(option);
                });
                if (eventos.length > 0) {
                    selectEvento.value = 0;
                    actualizarInfoEvento(0);
                }
            })
            .catch(error => {
                console.error('Error al cargar eventos desde la nube, usando Plan B:', error);
               
                eventos = [
                    {
                        "evento": "Concierto de Rock",
                        "fecha": "2026-11-14",
                        "lugar": "Estadio Madre de Ciudades",
                        "ciudad": "Santiago del Estero",
                        "horario": "21:00",
                        "descripcion": "La noche más esperada del rock nacional."
                    },
                    {
                        "evento": "Noche de Indie Pop",
                        "fecha": "2026-11-14",
                        "lugar": "Escenario Norte",
                        "ciudad": "Santiago del Estero",
                        "horario": "19:30",
                        "descripcion": "Sonidos frescos y modernos con las mejores bandas emergentes."
                    },
                    {
                        "evento": "Folclore Fusión",
                        "fecha": "2026-11-15",
                        "lugar": "Escenario Principal",
                        "ciudad": "Santiago del Estero",
                        "horario": "20:00",
                        "descripcion": "Una fusión única de ritmos autóctonos con instrumentos modernos."
                    }
                ];
                eventos.forEach((evento, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `${evento.evento} - ${formatearFecha(evento.fecha)}`;
                    selectEvento.appendChild(option);
                });
                if (eventos.length > 0) {
                    selectEvento.value = 0;
                    actualizarInfoEvento(0);
                }
            });
    }
    
    // =============================================
    // 5. FUNCIONES AUXILIARES
    // =============================================
    
    function formatearFecha(fechaStr) {
       
        const fecha = new Date(fechaStr + 'T00:00:00');
        const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        
        if (isNaN(fecha.getTime())) return fechaStr;
        
        return `${dias[fecha.getDay()]} ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
    }
    
    function formatearFechaCorta(fechaStr) {
        const fecha = new Date(fechaStr);
        return `${fecha.getDate()}/${fecha.getMonth()+1}/${fecha.getFullYear()}`;
    }
    

function esFechaValida(fechaStr) {
  
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fechaStr)) return false;
    
   
    const fecha = new Date(fechaStr + 'T00:00:00');
    return !isNaN(fecha.getTime());
}

function esMayorDeEdad(fechaStr) {

    const partes = fechaStr.split('-');
    const anio = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Los meses en JS van de 0 a 11
    const dia = parseInt(partes[2], 10);
    
    const fechaNac = new Date(anio, mes, dia);
    const hoy = new Date();
    
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const diferenciaMes = hoy.getMonth() - fechaNac.getMonth();
    
    if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    
    return edad >= 18;
}
    
    function esFechaVencimientoValida(fechaStr) {
        const regex = /^(\d{2})\/(\d{2})$/;
        if (!regex.test(fechaStr)) return false;
        const [, mes, anio] = fechaStr.match(regex);
        const mesNum = parseInt(mes);
        const anioNum = parseInt(anio);
        if (mesNum < 1 || mesNum > 12) return false;
        const fechaVenc = new Date(2000 + anioNum, mesNum - 1, 1);
        const hoy = new Date();
        const hoyMes = hoy.getMonth() + 1;
        const hoyAnio = hoy.getFullYear() % 100;
        if (anioNum > hoyAnio) return true;
        if (anioNum < hoyAnio) return false;
        return mesNum >= hoyMes;
    }
    
    function detectarTipoTarjeta(numero) {
        const num = numero.replace(/\s/g, '');
        if (/^4/.test(num)) return 'Visa';
        if (/^5[1-5]/.test(num)) return 'MasterCard';
        if (/^3[47]/.test(num)) return 'American Express';
        return null;
    }
    
    function calcularTotal() {
        const tipo = selectTipoEntrada.value;
        const cantidad = parseInt(inputCantidad.value) || 0;
        const precio = PRECIOS[tipo] || 0;
        const total = precio * cantidad;
        campoPrecioTotal.textContent = `$${total.toLocaleString('es-AR')}`;
        return total;
    }
    
    function actualizarResumen() {
        const eventoIndex = parseInt(selectEvento.value);
        const evento = eventos[eventoIndex];
        const tipo = selectTipoEntrada.value;
        const cantidad = parseInt(inputCantidad.value) || 0;
        const total = calcularTotal();
        
        if (evento && cantidad > 0) {
            campoResumen.innerHTML = `
                <div class="resumen-item">
                    <strong>Evento:</strong> ${evento.evento}
                </div>
                <div class="resumen-item">
                    <strong>Fecha:</strong> ${formatearFecha(evento.fecha)}
                </div>
                <div class="resumen-item">
                    <strong>Lugar:</strong> ${evento.lugar} - ${evento.ciudad}
                </div>
                <div class="resumen-item">
                    <strong>Horario:</strong> ${evento.horario}
                </div>
                <div class="resumen-item">
                    <strong>Tipo de Entrada:</strong> ${tipo}
                </div>
                <div class="resumen-item">
                    <strong>Cantidad:</strong> ${cantidad}
                </div>
                <div class="resumen-item total">
                    <strong>Total a Pagar:</strong> $${total.toLocaleString('es-AR')}
                </div>
            `;
        } else {
            campoResumen.innerHTML = '<p class="resumen-vacio">Seleccione un evento y cantidad para ver el resumen.</p>';
        }
    }
    
    // =============================================
    // 6. ACTUALIZACIÓN DE INFO DEL EVENTO
    // =============================================
    
    function actualizarInfoEvento(index) {
        const evento = eventos[index];
        if (!evento) return;
        
        campoEventoDesc.textContent = evento.descripcion || 'Sin descripción disponible.';
        campoEventoFecha.textContent = formatearFecha(evento.fecha);
        campoEventoUbicacion.textContent = `${evento.lugar} - ${evento.ciudad}`;
        
        actualizarResumen();
        validarFormulario();
    }
    
    // =============================================
    // 7. FUNCIONES DE VALIDACIÓN CON REGEX
    // =============================================
    
    const validadores = {
        nombre: function(valor) {
            const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/;
            return regex.test(valor.trim());
        },
        email: function(valor) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(valor.trim());
        },
        telefono: function(valor) {
            const regex = /^[0-9]{10}$/;
            return regex.test(valor.trim());
        },
        fechaNacimiento: function(valor) {
            return esFechaValida(valor) && esMayorDeEdad(valor);
        },
        pais: function(valor) {
            return valor !== '';
        },
        cantidad: function(valor) {
            const num = parseInt(valor);
            return !isNaN(num) && num >= 1 && num <= 6;
        },
        tarjeta: function(valor) {
            const num = valor.replace(/\s/g, '');
            const tipo = detectarTipoTarjeta(num);
            if (!tipo) return false;
            if (tipo === 'American Express') {
                return /^3[47][0-9]{13}$/.test(num);
            }
            return /^4[0-9]{15}$/.test(num) || /^5[1-5][0-9]{14}$/.test(num);
        },
        vencimiento: function(valor) {
            return esFechaVencimientoValida(valor);
        },
        cvv: function(valor) {
            const num = valor.trim();
            const tipo = detectarTipoTarjeta(inputTarjeta.value.replace(/\s/g, ''));
            if (tipo === 'American Express') {
                return /^[0-9]{4}$/.test(num);
            }
            return /^[0-9]{3}$/.test(num);
        },
        nombreTarjeta: function(valor) {
            const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{2,}$/;
            return regex.test(valor.trim());
        }
    };
    
    // =============================================
    // 8. FUNCIÓN DE VALIDACIÓN DE CAMPO INDIVIDUAL
    // =============================================
    
    function validarCampo(input, validador, mensajeError) {
        const valor = input.value;
        const esValido = validador(valor);
        const contenedor = input.closest('.campo-grupo');
        const mensajeExistente = contenedor.querySelector('.mensaje-validacion');
        
        // Remover mensaje anterior
        if (mensajeExistente) {
            mensajeExistente.remove();
        }
        
        // Limpiar clases
        input.classList.remove('valido', 'invalido');
        
        if (esValido) {
            input.classList.add('valido');
            if (input.id === 'tarjeta' && valor.length > 0) {
                mostrarLogoTarjeta(valor);
            }
        } else if (valor.length > 0) {
            input.classList.add('invalido');
            const mensaje = document.createElement('span');
            mensaje.className = 'mensaje-validacion error';
            mensaje.textContent = mensajeError;
            contenedor.appendChild(mensaje);
        }
        
        return esValido;
    }
    
    function mostrarLogoTarjeta(numero) {
        const contenedor = document.getElementById('logoTarjeta');
        const tipo = detectarTipoTarjeta(numero);
        
        if (tipo) {
            let claseIcono = '';
            switch(tipo) {
                case 'Visa': claseIcono = 'fa-brands fa-cc-visa'; break;
                case 'MasterCard': claseIcono = 'fa-brands fa-cc-mastercard'; break;
                case 'American Express': claseIcono = 'fa-brands fa-cc-amex'; break;
            }
            contenedor.innerHTML = `<i class="${claseIcono}" style="font-size: 2.5rem; color: #4f46e5;"></i>`;
            contenedor.style.display = 'block';
        } else if (numero.length > 0) {
            contenedor.innerHTML = '<span style="color: #f43f5e;">⚠️</span>';
            contenedor.style.display = 'block';
        } else {
            contenedor.style.display = 'none';
        }
    }
    
    // =============================================
    // 9. VALIDACIÓN COMPLETA DEL FORMULARIO
    // =============================================
    
    function validarFormulario() {
        const nombreValido = validarCampo(inputNombre, validadores.nombre, 'Debe contener solo letras y espacios, mínimo 3 caracteres.');
        const emailValido = validarCampo(inputEmail, validadores.email, 'Ingrese un correo electrónico válido.');
        const telefonoValido = validarCampo(inputTelefono, validadores.telefono, 'Debe tener exactamente 10 dígitos numéricos.');
        const fechaValida = validarCampo(inputFechaNac, validadores.fechaNacimiento, 'Debe ser mayor de 18 años (formato: dd/mm/yyyy).');
        const paisValido = validarCampo(selectPais, validadores.pais, 'Seleccione un país de residencia.');
        const cantidadValida = validarCampo(inputCantidad, validadores.cantidad, 'Debe ser entre 1 y 6 entradas.');
        const tarjetaValida = validarCampo(inputTarjeta, validadores.tarjeta, 'Ingrese un número de tarjeta válido (Visa, MasterCard o AmEx).');
        const vencimientoValido = validarCampo(inputVencimiento, validadores.vencimiento, 'Ingrese una fecha de vencimiento futura (MM/AA).');
        const cvvValido = validarCampo(inputCvv, validadores.cvv, 'CVV inválido (3 o 4 dígitos según el tipo).');
        const nombreTarjetaValido = validarCampo(inputNombreTarjeta, validadores.nombreTarjeta, 'Debe contener solo letras y espacios.');
        
        const todosValidos = nombreValido && emailValido && telefonoValido && fechaValida &&
                            paisValido && cantidadValida && tarjetaValida && vencimientoValido &&
                            cvvValido && nombreTarjetaValido;
        
       
        if (todosValidos) {
            mensajeEstado.textContent = '✅ Todos los campos están correctos. ¡Puede enviar el formulario!';
            mensajeEstado.className = 'mensaje-estado exito';
            btnSubmit.disabled = false;
        } else {
            btnSubmit.disabled = true;
        
            const campos = [inputNombre, inputEmail, inputTelefono, inputFechaNac, selectPais, 
                           inputCantidad, inputTarjeta, inputVencimiento, inputCvv, inputNombreTarjeta];
            let mensaje = '❌ Complete y valide todos los campos correctamente.';
            for (const campo of campos) {
                if (campo.classList.contains('invalido')) {
                    const label = document.querySelector(`label[for="${campo.id}"]`);
                    if (label) {
                        mensaje = `❌ Error en "${label.textContent.trim()}"`;
                        break;
                    }
                }
                if (campo.value === '' || campo.value === '') {
                    const label = document.querySelector(`label[for="${campo.id}"]`);
                    if (label) {
                        mensaje = `❌ Complete el campo "${label.textContent.trim()}"`;
                        break;
                    }
                }
            }
            mensajeEstado.textContent = mensaje;
            mensajeEstado.className = 'mensaje-estado error';
        }
        
        // Actualizar resumen y total
        actualizarResumen();
        calcularTotal();
        
        return todosValidos;
    }
    
    // =============================================
    // 10. EVENT LISTENERS
    // =============================================
    
  
    inputNombre.addEventListener('input', validarFormulario);
    inputEmail.addEventListener('input', validarFormulario);
    inputTelefono.addEventListener('input', validarFormulario);
    inputFechaNac.addEventListener('input', validarFormulario);
    selectPais.addEventListener('change', validarFormulario);
    selectTipoEntrada.addEventListener('change', validarFormulario);
    inputCantidad.addEventListener('input', validarFormulario);
    inputTarjeta.addEventListener('input', function() {
      
        let valor = this.value.replace(/\s/g, '');
        if (valor.length > 16) valor = valor.slice(0, 16);
        let formateado = '';
        for (let i = 0; i < valor.length; i += 4) {
            formateado += valor.slice(i, i + 4) + ' ';
        }
        this.value = formateado.trim();
        validarFormulario();
    });
    inputVencimiento.addEventListener('input', function() {
        let valor = this.value.replace(/\//g, '');
        if (valor.length > 4) valor = valor.slice(0, 4);
        if (valor.length >= 2) {
            this.value = valor.slice(0, 2) + '/' + valor.slice(2);
        } else {
            this.value = valor;
        }
        validarFormulario();
    });
    inputCvv.addEventListener('input', function() {
        const tipo = detectarTipoTarjeta(inputTarjeta.value.replace(/\s/g, ''));
        const maxLen = (tipo === 'American Express') ? 4 : 3;
        if (this.value.length > maxLen) {
            this.value = this.value.slice(0, maxLen);
        }
        validarFormulario();
    });
    inputNombreTarjeta.addEventListener('input', validarFormulario);
    
  
    selectEvento.addEventListener('change', function() {
        const index = parseInt(this.value);
        actualizarInfoEvento(index);
        validarFormulario();
    });
    
    // =============================================
    // 11. ENVÍO DEL FORMULARIO
    // =============================================
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }
        
        // Simular procesamiento de pago
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Procesando...';
        mensajeEstado.textContent = '⏳ Procesando su pago...';
        mensajeEstado.className = 'mensaje-estado info';
        
        setTimeout(() => {
            // Mostrar confirmación
            const eventoIndex = parseInt(selectEvento.value);
            const evento = eventos[eventoIndex];
            const total = calcularTotal();
            
            mensajeEstado.innerHTML = `
                <div class="confirmacion-compra">
                    <i class="fa-solid fa-check-circle" style="color: #22c55e; font-size: 2rem;"></i>
                    <h3>¡Compra Confirmada!</h3>
                    <p><strong>Evento:</strong> ${evento.evento}</p>
                    <p><strong>Comprador:</strong> ${inputNombre.value}</p>
                    <p><strong>Entradas:</strong> ${inputCantidad.value} x ${selectTipoEntrada.value}</p>
                    <p><strong>Total Pagado:</strong> $${total.toLocaleString('es-AR')}</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem; color: #6b7280;">
                        Se ha enviado un correo de confirmación a ${inputEmail.value}
                    </p>
                  <button onclick="location.reload()" class="boton-accion" style="margin-top: 1rem;">
                        <i class="fa-solid fa-rotate"></i> Nueva Compra
                    </button>
                    <button onclick="window.location.href='/TAP2/TAP2/index.html'" class="boton-accion" style="margin-top: 1rem; margin-left: 10px; background-color: var(--color-primario);">
                        <i class="fa-solid fa-house"></i> Inicio
                    </button>
                </div>
            `;
            mensajeEstado.className = 'mensaje-estado exito';
            btnSubmit.style.display = 'none';
            detenerContador();
        }, 3000);
    });
    
    // =============================================
    // 12. TEMPORIZADOR REGRESIVO
    // =============================================
    
    let tiempoRestante = 600; // 10 minutos en segundos
    let intervaloContador = null;
    
    function iniciarContador() {
        if (intervaloContador) return;
        tiempoRestante = 600;
        actualizarContador();
        
        intervaloContador = setInterval(() => {
            tiempoRestante--;
            actualizarContador();
            
            if (tiempoRestante <= 0) {
                detenerContador();
                mensajeEstado.innerHTML = `
                    <div class="confirmacion-compra error">
                        <i class="fa-solid fa-clock" style="color: #f43f5e; font-size: 2rem;"></i>
                        <h3>⏰ Tiempo Agotado</h3>
                        <p>El tiempo para completar la compra ha expirado.</p>
                        <button onclick="reiniciarContador()" class="boton-accion" style="margin-top: 1rem;">
                            <i class="fa-solid fa-rotate"></i> Reiniciar Sesión
                        </button>
                    </div>
                `;
                mensajeEstado.className = 'mensaje-estado error';
                btnSubmit.disabled = true;
                btnSubmit.style.display = 'none';
            }
        }, 1000);
    }
    
    function actualizarContador() {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        contadorTiempo.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        
        if (tiempoRestante <= 60) {
            contadorTiempo.style.color = '#f43f5e';
        } else {
            contadorTiempo.style.color = '#4f46e5';
        }
    }
    
    function detenerContador() {
        if (intervaloContador) {
            clearInterval(intervaloContador);
            intervaloContador = null;
        }
    }
    
    function reiniciarContador() {
        detenerContador();
        btnSubmit.style.display = 'block';
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Confirmar Compra';
        mensajeEstado.textContent = '⏳ Sesión reiniciada. Complete el formulario.';
        mensajeEstado.className = 'mensaje-estado info';
        iniciarContador();
        validarFormulario();
    }
    
    // =============================================
    // 13. INICIALIZACIÓN
    // =============================================
    
    cargarPaises();
    cargarEventos();
    
    // Establecer fecha mínima (hace 18 años)
    const hoy = new Date();
    const fechaMin = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
 
    
    // Iniciar el contador cuando el usuario comienza a interactuar
    let contadorIniciado = false;
    document.addEventListener('click', function() {
        if (!contadorIniciado && document.activeElement?.tagName !== 'BUTTON') {
            contadorIniciado = true;
            iniciarContador();
        }
    });
    
    // También iniciar al hacer foco en cualquier input
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('focus', function() {
            if (!contadorIniciado) {
                contadorIniciado = true;
                iniciarContador();
            }
        });
    });
    
    // Validación inicial
    setTimeout(validarFormulario, 500);
});