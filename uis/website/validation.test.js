// Pruebas de las reglas de validation.js. Ejecutar con: node --test uis/website/validation.test.js
const test = require('node:test');
const assert = require('node:assert/strict');
const V = require('./validation.js');

const HOY = { y: 2026, m: 10, d: 21 };
const ok = (msg) => assert.equal(msg, '');
const mal = (msg, trozo) => { assert.notEqual(msg, ''); if (trozo) assert.match(msg, trozo); };

test('nombre y apellidos', () => {
  ok(V.validarNombre('María José', 'nombre'));
  ok(V.validarNombre("O'Brien-Núñez", 'apellido'));
  mal(V.validarNombre('', 'nombre'), /Escribe/);
  mal(V.validarNombre('   ', 'nombre'), /Escribe/);
  mal(V.validarNombre('A', 'nombre'), /al menos 2/);
  mal(V.validarNombre('x'.repeat(61), 'nombre'), /60/);
  mal(V.validarNombre('Juan3', 'nombre'), /solo puede llevar letras/);
  mal(V.validarNombre('1234', 'nombre'), /solo puede llevar letras/);
});

test('correo electrónico', () => {
  ok(V.validarEmail('ana.perez@correo.com'));
  ok(V.validarEmail('a+b@sub.dominio.co'));
  mal(V.validarEmail(''), /Escribe/);
  mal(V.validarEmail('ana@'), /formato/);
  mal(V.validarEmail('ana@correo'), /formato/);
  mal(V.validarEmail('ana perez@correo.com'), /formato/);
  mal(V.validarEmail('ana..p@correo.com'), /formato/);
  mal(V.validarEmail('a@' + 'b'.repeat(260) + '.com'), /largo/);
});

test('fecha de nacimiento: formato, futuro y edad mínima de 18', () => {
  ok(V.validarFechaNacimiento('1990-05-17', HOY));
  ok(V.validarFechaNacimiento('2008-10-21', HOY));      // cumple 18 hoy
  mal(V.validarFechaNacimiento('2008-10-22', HOY), /al menos 18/); // le falta un día
  mal(V.validarFechaNacimiento('2015-01-01', HOY), /al menos 18/);
  mal(V.validarFechaNacimiento('2027-01-01', HOY), /futura/);
  mal(V.validarFechaNacimiento('1890-01-01', HOY), /antiguo/);
  mal(V.validarFechaNacimiento('2000-02-30', HOY), /no es válida/);
  mal(V.validarFechaNacimiento('2001-02-29', HOY), /no es válida/);
  ok(V.validarFechaNacimiento('2000-02-29', HOY));      // año bisiesto real
  mal(V.validarFechaNacimiento('17/05/1990', HOY), /no es válida/);
  mal(V.validarFechaNacimiento('', HOY), /Indica/);
});

test('país', () => {
  ok(V.validarPais('CO'));
  ok(V.validarPais('US'));
  mal(V.validarPais(''), /Selecciona/);
  mal(V.validarPais('ES'), /Colombia o Estados Unidos/);
});

test('código postal: Colombia 6 dígitos, Florida 32003–34997', () => {
  ok(V.validarCodigoPostal('050001', 'CO'));
  mal(V.validarCodigoPostal('5001', 'CO'), /6 dígitos/);
  mal(V.validarCodigoPostal('0500012', 'CO'), /6 dígitos/);
  ok(V.validarCodigoPostal('33101', 'US'));             // Miami
  ok(V.validarCodigoPostal('32003', 'US'));             // límite inferior
  ok(V.validarCodigoPostal('34997', 'US'));             // límite superior
  mal(V.validarCodigoPostal('32002', 'US'), /Florida/);
  mal(V.validarCodigoPostal('34998', 'US'), /Florida/);
  mal(V.validarCodigoPostal('10001', 'US'), /Florida/); // Nueva York
  mal(V.validarCodigoPostal('3310', 'US'), /5 dígitos/);
  mal(V.validarCodigoPostal('33A01', 'US'), /solo puede llevar números/);
  mal(V.validarCodigoPostal('33101', ''), /primero tu país/);
  mal(V.validarCodigoPostal('', 'US'), /Escribe/);
});

test('teléfono: celular colombiano y número de Estados Unidos', () => {
  ok(V.validarTelefono('300 123 4567', 'CO'));
  ok(V.validarTelefono('3001234567', 'CO'));
  ok(V.validarTelefono('+57 300 123 4567', 'CO'));
  ok(V.validarTelefono('573001234567', 'CO'));
  mal(V.validarTelefono('200 123 4567', 'CO'), /empiezan por 3/);
  mal(V.validarTelefono('300 123 456', 'CO'), /10 dígitos/);
  mal(V.validarTelefono('+1 300 123 4567', 'CO'), /\+57/);
  ok(V.validarTelefono('305 555 0123', 'US'));
  ok(V.validarTelefono('(305) 555-0123', 'US'));
  ok(V.validarTelefono('+1 305 555 0123', 'US'));
  ok(V.validarTelefono('13055550123', 'US'));
  mal(V.validarTelefono('105 555 0123', 'US'), /0 ni por 1/);
  mal(V.validarTelefono('305 155 0123', 'US'), /0 ni por 1/);
  mal(V.validarTelefono('+57 305 555 0123', 'US'), /\+1/);
  mal(V.validarTelefono('305 555', 'US'), /10 dígitos/);
  mal(V.validarTelefono('abc', 'US'), /solo puede llevar números/);
  mal(V.validarTelefono('305 555 0123', ''), /primero tu país/);
  mal(V.validarTelefono('', 'US'), /Escribe/);
});

test('idioma, tarjeta de sellos y privacidad', () => {
  ok(V.validarIdioma('es')); ok(V.validarIdioma('en'));
  mal(V.validarIdioma(''), /Elige/); mal(V.validarIdioma('fr'), /español o English/);
  ok(V.validarTarjetaSellos('si')); ok(V.validarTarjetaSellos('no'));
  mal(V.validarTarjetaSellos(''), /Indica/); mal(V.validarTarjetaSellos('quizá'), /Sí o No/);
  ok(V.validarPrivacidad('si'));
  mal(V.validarPrivacidad(''), /aceptar/);
});

test('canales de contacto: al menos uno y «ninguno» es exclusivo', () => {
  ok(V.validarCanales(['email']));
  ok(V.validarCanales(['email', 'mensaje']));
  ok(V.validarCanales(['ninguno']));
  mal(V.validarCanales([]), /al menos una/);
  mal(V.validarCanales(['ninguno', 'email']), /no se puede combinar/);
  mal(V.validarCanales(['fax']), /no válida/);
});

test('validarTodo: formulario correcto no da errores y uno vacío da un error por campo', () => {
  const bueno = {
    nombre: 'Ana', apellidos: 'Pérez', email: 'ana@correo.com', fecha_nacimiento: '1990-05-17',
    pais: 'US', codigo_postal: '33101', telefono: '305 555 0123',
    idioma: 'es', tarjeta_sellos: 'no', canales_contacto: ['email'], acepta_privacidad: 'si'
  };
  assert.deepEqual(V.validarTodo(bueno, HOY), {});
  const vacio = { canales_contacto: [] };
  assert.deepEqual(Object.keys(V.validarTodo(vacio, HOY)).sort(), [...V.CAMPOS].sort());
});

test('al cambiar de país, teléfono y código postal vuelven a evaluarse', () => {
  const v = { pais: 'CO', codigo_postal: '050001', telefono: '300 123 4567' };
  assert.equal(V.validarCampo('codigo_postal', v), '');
  assert.equal(V.validarCampo('telefono', v), '');
  v.pais = 'US';
  assert.notEqual(V.validarCampo('codigo_postal', v), '');
  assert.notEqual(V.validarCampo('telefono', v), '');
});
