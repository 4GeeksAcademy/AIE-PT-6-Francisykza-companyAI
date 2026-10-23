# `uis/website` — sitio web público de Brasaland

Primera versión de la web pública: una landing page y un formulario de registro en **Brasa Points**, el programa de fidelización de Brasaland (`CONTEXT.md`, área de Marketing y Experiencia Digital).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Landing: cabecera con navegación, hero, por qué elegir Brasaland, experiencia, llamada a la acción y pie con contacto. Incluye marcado Schema.org (`Organization`) en JSON-LD |
| `application.html` | Formulario de registro en Brasa Points |
| `validation.js` | Validación del formulario (JavaScript sin dependencias) |
| `validation.test.js` | Pruebas de las reglas de validación (`node:test`, sin instalar nada) |
| `assets/` | Logotipo e ilustración (SVG con texto alternativo en el HTML) |

No hay `styles.css`: todo el diseño usa clases de **Tailwind CSS v4** cargadas con el CDN oficial (`@tailwindcss/browser@4`). Los estados de error y de éxito del formulario se estilan con las variantes `aria-invalid:` y `data-[valid=true]:` de Tailwind, sin CSS escrito a mano.

## Cómo ejecutarlo (Codespaces o local)

Desde la raíz del repositorio:

```bash
npx http-server uis/website -p 3000 -a 0.0.0.0
```

Abre `http://localhost:3000`. En Codespaces, reenvía el puerto 3000 y ponlo como **Public** para obtener la URL pública.

Pruebas de las reglas de validación:

```bash
node --test uis/website/validation.test.js
```

## Campos del formulario

El briefing (`CONTEXT.md`) **no define campos de formulario**. Los de esta versión se deducen del briefing y son una propuesta que debe confirmar el equipo:

| Campo (`name`) | Tipo | Regla |
|---|---|---|
| `nombre`, `apellidos` | `text` | 2 a 60 caracteres; solo letras, espacios, guiones y apóstrofes |
| `email` | `email` | Formato válido, máximo 254 caracteres |
| `fecha_nacimiento` | `date` | Fecha real, no futura, **mayor de 18 años** (supuesto: no se capturan datos de menores) |
| `pais` | `select` | `CO` (Colombia) o `US` (Estados Unidos, Florida): los dos países donde opera Brasaland |
| `codigo_postal` | `text` | Colombia: 6 dígitos. EE. UU.: 5 dígitos de Florida, entre 32003 y 34997 (Brasaland solo opera en Florida) |
| `telefono` | `tel` | Colombia: celular de 10 dígitos que empieza por 3. EE. UU.: 10 dígitos, sin 0 ni 1 al inicio del código de área ni de la central. Prefijo `+57` / `+1` opcional |
| `idioma` | `radio` | `es` o `en` (los dos idiomas del briefing) |
| `tarjeta_sellos` | `radio` | `si` o `no`: si tiene la tarjeta física de sellos actual |
| `canales_contacto` | `checkbox` | Al menos uno de `email`, `mensaje`, `ninguno`; `ninguno` no se combina con los demás |
| `acepta_privacidad` | `checkbox` | Obligatorio |

El formulario es una **simulación**: valida y muestra un mensaje de éxito, pero no envía ni guarda datos (hay que conectarlo a la API de `services/` más adelante).

## Datos ficticios o pendientes

- El correo `contacto@brasaland.example` es un **marcador**: el briefing no da un contacto público. Sustituirlo cuando exista.
- No hay direcciones de locales, teléfonos ni carta: no están en el briefing.
- Los números del sitio (2008, 14 restaurantes, 2 países, ~115 personas) y los tres compromisos de marca salen de `CONTEXT.md`.
