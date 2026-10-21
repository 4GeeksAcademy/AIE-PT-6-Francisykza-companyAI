/*
 * Validación del formulario de registro de Brasa Points (application.html).
 * JavaScript sin dependencias. Los estilos de error/éxito los aplica Tailwind
 * desde el HTML mediante los atributos aria-invalid y data-valid; aquí no hay CSS.
 *
 * Las reglas son funciones puras (sin DOM) para poder probarlas con Node:
 *   node --test uis/website/validation.test.js
 */
(function (root) {
  'use strict';

  // Reglas de negocio de Brasaland (única fuente; no repetir estos números en otro sitio).
  var EDAD_MINIMA = 18;
  var EDAD_MAXIMA = 120;
  var ZIP_FLORIDA_MIN = 32003;
  var ZIP_FLORIDA_MAX = 34997;
  var PAISES = { CO: 'Colombia', US: 'Estados Unidos (Florida)' };
  var IDIOMAS = ['es', 'en'];
  var CANALES = ['email', 'mensaje', 'ninguno'];

  var REGEX_NOMBRE = /^[\p{L}][\p{L}\s'’.-]*$/u;
  var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function texto(v) { return typeof v === 'string' ? v.trim() : ''; }

  function validarNombre(valor, etiqueta) {
    var v = texto(valor);
    if (!v) return 'Escribe tu ' + etiqueta + '.';
    if (v.length < 2) return 'Tu ' + etiqueta + ' debe tener al menos 2 caracteres.';
    if (v.length > 60) return 'Tu ' + etiqueta + ' no puede superar los 60 caracteres.';
    if (!REGEX_NOMBRE.test(v)) return 'Tu ' + etiqueta + ' solo puede llevar letras, espacios, guiones o apóstrofes.';
    return '';
  }

  function validarEmail(valor) {
    var v = texto(valor);
    if (!v) return 'Escribe tu correo electrónico.';
    if (v.length > 254) return 'El correo electrónico es demasiado largo (máximo 254 caracteres).';
    if (v.indexOf('..') !== -1 || !REGEX_EMAIL.test(v)) {
      return 'El correo no tiene un formato válido. Ejemplo: nombre@correo.com.';
    }
    return '';
  }

  // Convierte AAAA-MM-DD en {y, m, d} sin usar new Date("AAAA-MM-DD") (que interpreta en UTC).
  function parsearFecha(valor) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valor);
    if (!m) return null;
    var y = Number(m[1]), mes = Number(m[2]), d = Number(m[3]);
    var f = new Date(y, mes - 1, d);
    if (f.getFullYear() !== y || f.getMonth() !== mes - 1 || f.getDate() !== d) return null;
    return { y: y, m: mes, d: d };
  }

  function calcularEdad(f, hoy) {
    var edad = hoy.y - f.y;
    if (hoy.m < f.m || (hoy.m === f.m && hoy.d < f.d)) edad -= 1;
    return edad;
  }

  function hoyLocal() {
    var n = new Date();
    return { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() };
  }

  function validarFechaNacimiento(valor, hoy) {
    var v = texto(valor);
    if (!v) return 'Indica tu fecha de nacimiento.';
    var f = parsearFecha(v);
    if (!f) return 'La fecha no es válida. Revisa el día, el mes y el año.';
    var ref = hoy || hoyLocal();
    var enFuturo = f.y > ref.y || (f.y === ref.y && (f.m > ref.m || (f.m === ref.m && f.d > ref.d)));
    if (enFuturo) return 'La fecha de nacimiento no puede ser futura.';
    var edad = calcularEdad(f, ref);
    if (edad > EDAD_MAXIMA) return 'Revisa el año de nacimiento: parece demasiado antiguo.';
    if (edad < EDAD_MINIMA) return 'Debes tener al menos ' + EDAD_MINIMA + ' años para unirte a Brasa Points.';
    return '';
  }

  function validarPais(valor) {
    var v = texto(valor);
    if (!v) return 'Selecciona tu país.';
    if (!PAISES[v]) return 'Selecciona Colombia o Estados Unidos (Florida).';
    return '';
  }

  function validarCodigoPostal(valor, pais) {
    var v = texto(valor);
    if (!v) return 'Escribe tu código postal.';
    if (!/^\d+$/.test(v)) return 'El código postal solo puede llevar números.';
    if (!PAISES[pais]) return 'Selecciona primero tu país para validar el código postal.';
    if (pais === 'CO') {
      return v.length === 6 ? '' : 'En Colombia el código postal tiene 6 dígitos.';
    }
    if (v.length !== 5) return 'En Estados Unidos el código postal tiene 5 dígitos.';
    var n = Number(v);
    if (n < ZIP_FLORIDA_MIN || n > ZIP_FLORIDA_MAX) {
      return 'Brasaland solo tiene restaurantes en Florida: usa un código entre ' + ZIP_FLORIDA_MIN + ' y ' + ZIP_FLORIDA_MAX + '.';
    }
    return '';
  }

  function validarTelefono(valor, pais) {
    var v = texto(valor);
    if (!v) return 'Escribe tu teléfono móvil.';
    if (!/^\+?[\d\s().-]+$/.test(v)) return 'El teléfono solo puede llevar números, espacios, guiones, paréntesis y un + inicial.';
    if (!PAISES[pais]) return 'Selecciona primero tu país para validar el teléfono.';
    var conMas = v.charAt(0) === '+';
    var digitos = v.replace(/\D/g, '');
    if (pais === 'CO') {
      if (conMas && digitos.indexOf('57') !== 0) return 'El prefijo de Colombia es +57.';
      var nacionalCO = conMas ? digitos.slice(2) : (digitos.length === 12 && digitos.indexOf('57') === 0 ? digitos.slice(2) : digitos);
      if (nacionalCO.length !== 10) return 'Un celular colombiano tiene 10 dígitos (por ejemplo, 300 123 4567).';
      if (nacionalCO.charAt(0) !== '3') return 'Los celulares colombianos empiezan por 3.';
      return '';
    }
    if (conMas && digitos.charAt(0) !== '1') return 'El prefijo de Estados Unidos es +1.';
    var nacionalUS = conMas ? digitos.slice(1) : (digitos.length === 11 && digitos.charAt(0) === '1' ? digitos.slice(1) : digitos);
    if (nacionalUS.length !== 10) return 'Un teléfono de Estados Unidos tiene 10 dígitos (por ejemplo, 305 555 0123).';
    if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(nacionalUS)) return 'El código de área y la central no pueden empezar por 0 ni por 1.';
    return '';
  }

  function validarIdioma(valor) {
    var v = texto(valor);
    if (!v) return 'Elige el idioma en el que quieres recibir tus mensajes.';
    if (IDIOMAS.indexOf(v) === -1) return 'Elige español o English.';
    return '';
  }

  function validarTarjetaSellos(valor) {
    var v = texto(valor);
    if (!v) return 'Indica si tienes una tarjeta física de sellos.';
    if (v !== 'si' && v !== 'no') return 'Responde Sí o No.';
    return '';
  }

  function validarCanales(valores) {
    var lista = Array.isArray(valores) ? valores : [];
    if (lista.length === 0) return 'Elige al menos una opción para recibir novedades (o «No quiero recibir novedades»).';
    for (var i = 0; i < lista.length; i++) {
      if (CANALES.indexOf(lista[i]) === -1) return 'Hay una opción no válida. Vuelve a elegir tus canales.';
    }
    if (lista.indexOf('ninguno') !== -1 && lista.length > 1) {
      return '«No quiero recibir novedades» no se puede combinar con otros canales. Quita una de las dos opciones.';
    }
    return '';
  }

  function validarPrivacidad(valor) {
    return valor === 'si' ? '' : 'Debes aceptar el uso de tus datos para poder registrarte.';
  }

  // Orden de los campos tal como aparecen en el formulario.
  var CAMPOS = [
    'nombre', 'apellidos', 'email', 'fecha_nacimiento',
    'pais', 'codigo_postal', 'telefono',
    'idioma', 'tarjeta_sellos', 'canales_contacto', 'acepta_privacidad'
  ];
  // Campos cuyo resultado depende del país elegido.
  var DEPENDEN_DE_PAIS = ['codigo_postal', 'telefono'];

  var REGLAS = {
    nombre: function (v) { return validarNombre(v.nombre, 'nombre'); },
    apellidos: function (v) { return validarNombre(v.apellidos, 'apellido'); },
    email: function (v) { return validarEmail(v.email); },
    fecha_nacimiento: function (v, hoy) { return validarFechaNacimiento(v.fecha_nacimiento, hoy); },
    pais: function (v) { return validarPais(v.pais); },
    codigo_postal: function (v) { return validarCodigoPostal(v.codigo_postal, texto(v.pais)); },
    telefono: function (v) { return validarTelefono(v.telefono, texto(v.pais)); },
    idioma: function (v) { return validarIdioma(v.idioma); },
    tarjeta_sellos: function (v) { return validarTarjetaSellos(v.tarjeta_sellos); },
    canales_contacto: function (v) { return validarCanales(v.canales_contacto); },
    acepta_privacidad: function (v) { return validarPrivacidad(v.acepta_privacidad); }
  };

  function validarCampo(nombre, valores, hoy) {
    return REGLAS[nombre](valores, hoy);
  }

  function validarTodo(valores, hoy) {
    var errores = {};
    CAMPOS.forEach(function (c) {
      var m = validarCampo(c, valores, hoy);
      if (m) errores[c] = m;
    });
    return errores;
  }

  var api = {
    CAMPOS: CAMPOS,
    validarCampo: validarCampo,
    validarTodo: validarTodo,
    validarNombre: validarNombre,
    validarEmail: validarEmail,
    validarFechaNacimiento: validarFechaNacimiento,
    validarPais: validarPais,
    validarCodigoPostal: validarCodigoPostal,
    validarTelefono: validarTelefono,
    validarIdioma: validarIdioma,
    validarTarjetaSellos: validarTarjetaSellos,
    validarCanales: validarCanales,
    validarPrivacidad: validarPrivacidad
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.BrasalandValidation = api;

  /* ---------------- Parte del navegador (DOM) ---------------- */
  if (typeof document === 'undefined') return;

  function iniciar() {
    var form = document.getElementById('formulario-registro');
    if (!form) return;
    var resumen = document.getElementById('resumen-errores');
    var lista = document.getElementById('lista-errores');
    var exito = document.getElementById('exito');
    var exitoTexto = document.getElementById('exito-texto');
    var tocados = {};

    function valoresDelFormulario() {
      var d = new FormData(form);
      return {
        nombre: d.get('nombre') || '',
        apellidos: d.get('apellidos') || '',
        email: d.get('email') || '',
        fecha_nacimiento: d.get('fecha_nacimiento') || '',
        pais: d.get('pais') || '',
        codigo_postal: d.get('codigo_postal') || '',
        telefono: d.get('telefono') || '',
        idioma: d.get('idioma') || '',
        tarjeta_sellos: d.get('tarjeta_sellos') || '',
        canales_contacto: d.getAll('canales_contacto'),
        acepta_privacidad: d.get('acepta_privacidad') || ''
      };
    }

    function controles(campo) {
      return form.querySelectorAll('[name="' + campo + '"]');
    }

    function pintar(campo, mensaje) {
      var caja = document.getElementById('error-' + campo);
      var inputs = controles(campo);
      if (caja) caja.textContent = mensaje ? 'Error: ' + mensaje : '';
      Array.prototype.forEach.call(inputs, function (el) {
        if (mensaje) {
          el.setAttribute('aria-invalid', 'true');
          el.removeAttribute('data-valid');
        } else {
          el.removeAttribute('aria-invalid');
          el.setAttribute('data-valid', 'true');
        }
      });
    }

    function revisar(campo, valores) {
      var mensaje = validarCampo(campo, valores);
      pintar(campo, mensaje);
      return mensaje;
    }

    function limpiarCampo(campo) {
      var caja = document.getElementById('error-' + campo);
      if (caja) caja.textContent = '';
      Array.prototype.forEach.call(controles(campo), function (el) {
        el.removeAttribute('aria-invalid');
        el.removeAttribute('data-valid');
      });
    }

    function nombreDeCampo(el) {
      return el && el.name && CAMPOS.indexOf(el.name) !== -1 ? el.name : null;
    }

    function alCambiar(ev) {
      var campo = nombreDeCampo(ev.target);
      if (!campo) return;
      // Mientras escribe solo se revalida un campo que ya se había tocado; al salir (blur) siempre.
      if (!exito.hidden) exito.hidden = true;
      if (ev.type === 'input' && !tocados[campo]) return;
      if (ev.type === 'focusout') tocados[campo] = true;
      if (ev.type === 'change') tocados[campo] = true;
      var valores = valoresDelFormulario();
      revisar(campo, valores);
      if (campo === 'pais') {
        DEPENDEN_DE_PAIS.forEach(function (c) {
          if (tocados[c]) revisar(c, valores);
        });
      }
      if (resumen && !resumen.hidden) actualizarResumen(valores);
    }

    function actualizarResumen(valores) {
      var errores = validarTodo(valores);
      lista.textContent = '';
      var hay = false;
      CAMPOS.forEach(function (c) {
        if (!errores[c]) return;
        hay = true;
        var li = document.createElement('li');
        var a = document.createElement('a');
        var destino = controles(c)[0];
        a.href = '#' + (destino && destino.id ? destino.id : 'error-' + c);
        a.textContent = errores[c];
        a.addEventListener('click', function (e) {
          e.preventDefault();
          if (destino) destino.focus();
        });
        li.appendChild(a);
        lista.appendChild(li);
      });
      resumen.hidden = !hay;
    }

    form.addEventListener('input', alCambiar);
    form.addEventListener('change', alCambiar);
    form.addEventListener('focusout', alCambiar);

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      exito.hidden = true;
      var valores = valoresDelFormulario();
      var errores = validarTodo(valores);
      CAMPOS.forEach(function (c) { tocados[c] = true; pintar(c, errores[c] || ''); });
      var primero = CAMPOS.filter(function (c) { return errores[c]; })[0];
      if (primero) {
        actualizarResumen(valores);
        resumen.focus();
        return;
      }
      resumen.hidden = true;
      lista.textContent = '';
      var nombre = texto(valores.nombre);
      exitoTexto.textContent = 'Gracias, ' + nombre + '. Tus datos son correctos. Esto es una simulación: no se ha enviado ni guardado nada.';
      exito.hidden = false;
      form.reset();
      exito.focus();
    });

    form.addEventListener('reset', function () {
      tocados = {};
      CAMPOS.forEach(limpiarCampo);
      resumen.hidden = true;
      lista.textContent = '';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})(typeof window !== 'undefined' ? window : globalThis);
