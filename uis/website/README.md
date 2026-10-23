# `uis/website` — Brasaland public website

First version of the public website: a landing page and a sign-up form for **Brasa Points**, Brasaland's loyalty program (`CONTEXT.md`, Marketing & Digital Experience).

## Files

| File | What it is |
|---|---|
| `index.html` | Landing page: header with navigation, hero, why Brasaland, experience, call to action and a footer with contact info. Includes Schema.org (`Organization`) JSON-LD |
| `application.html` | Brasa Points sign-up form |
| `validation.js` | Form validation (dependency-free JavaScript) |
| `validation.test.js` | Tests for the validation rules (`node:test`, nothing to install) |
| `assets/` | Logo and illustration (SVG, with alt text in the HTML) |

There is no `styles.css`: all styling uses **Tailwind CSS v4** utility classes loaded from the official CDN (`@tailwindcss/browser@4`). Form error and success states use Tailwind's `aria-invalid:` and `data-[valid=true]:` variants, with no hand-written CSS.

## Run it (Codespaces or local)

From the repository root:

```bash
npx http-server uis/website -p 3000 -a 0.0.0.0
```

Open `http://localhost:3000`. In Codespaces, forward port 3000 and set it to **Public** to get the public URL.

Validation rule tests:

```bash
node --test uis/website/validation.test.js
```

## Form fields

The briefing (`CONTEXT.md`) **does not define form fields**. The ones in this version are derived from the briefing and are a proposal for the team to confirm. See [`README.es.md`](./README.es.md) for the full field and rule table (country-dependent postal code and phone rules, minimum age 18, exclusive "no updates" channel).

The form is a **simulation**: it validates and shows a success message, but it does not send or store any data (to be wired to the `services/` API later).

## Placeholder data

`contacto@brasaland.example` is a placeholder; the briefing gives no public contact. There are no store addresses, phone numbers or menu because they are not in the briefing.
