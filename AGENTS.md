# AGENTS.md

## 1. Project Scope & Intent

This repository contains a personal Fullstack web project with a strong focus on:

- clean architecture
- explicit separation of concerns
- long-term maintainability
- security-first mindset

All changes must preserve clarity, predictability, and explicit intent.
Clever code is discouraged unless it is also obvious.

> This project is designed to be read and understood by human developers worldwide, including technical recruiters.

---

## 2. Technology Stack

- **Frontend:**
  - HTML5 (semantic, accessible)
  - CSS3 (custom properties, modular files)
  - Vanilla JavaScript (ES modules, no frameworks)
- **Backend:**
  - PHP (modern syntax, strict intent)
  - JSON-based configuration and data files
- **Tooling & Environment:**
  - Git + GitHub
  - Vercel deployment
  - SVG sprite system
  - No frontend frameworks by design

---

## 3. Code Style & Conventions

### JavaScript

- Use ES modules only
- Prefer explicit function names over comments
- Avoid magic values; extract constants when relevant
- No inline logic inside event listeners
- Keep functions short and single-purpose

### PHP

- No mixed concerns (logic ≠ presentation)
- Escape output explicitly (`htmlspecialchars`)
- Avoid global state when possible
- Configuration must be externalized

---

## 4. File & Folder Organization

- Frontend public assets must live under `/public`
- JavaScript modules must be logically grouped
- Each module must have a single, clear responsibility
- Do not introduce new folders without a clear architectural reason

---

## 5. CSS Rules (Very Important)

- CSS must be modular (no monolithic files)
- Custom properties (`--variables`) are preferred for:
  - transforms
  - animations
  - theme-related values

### Custom Properties Scope Rule

If a CSS variable is consumed by a property (e.g. `transform`),
it must be defined on the same element or an ancestor.

> Never define a variable on a sibling element expecting it to work.

---

## 6. Comments & Documentation Rules

### Inline Comments

- Must be **SHORT**
- Must be **UPPERCASE**
- Must be **IN ENGLISH**
- One-line comments go at the **end of the line**
- Block comments go **directly above the block**

Example:

```js
isAnimating = true; // BLOCK HOVER DURING ANIMATION
```

### Block Comments

```js
// CHANGE LOCALE FUNCTION
const changeLocale = async () => { ... }
```

> Do not add comments that restate obvious code.

---

## 7. Accessibility (Non-Negotiable)

- Semantic HTML is mandatory
- `aria-*` attributes must be meaningful
- `aria-expanded`, `aria-controls`, and `aria-label` must reflect real state
- Interactive elements must be keyboard accessible

> No visual-only logic is allowed.

---

## 8. Internationalization (i18n)

- All user-facing text must be translatable
- Translations are handled via JSON
- Language files are structured by locale (e.g. `en-GB`)
- `data-i18n` and `data-i18n-attr` must be respected

> Never hardcode visible text unless explicitly required.

---

## 9. Security Constraints

- Treat all external input as untrusted
- Escape output by default
- Avoid inline scripts when possible
- CSP compatibility is required
- No dynamic `eval`, `new Function`, or unsafe patterns

> Security > convenience.

---

## 10. Automation & Agent Expectations

Agents modifying this repository must:

- preserve existing architecture
- reuse existing patterns instead of introducing new ones
- avoid stylistic rewrites unless explicitly requested
- never remove accessibility or security features

> If a change cannot be made cleanly, it should not be made.

---

## 11. Strict Do / Do Not Rules

- **DO**
  - Follow existing patterns
  - Be explicit
  - Prefer readability over brevity
  - Think in terms acknowledging future maintainers
- **DO NOT**
  - Introduce frameworks
  - Add unnecessary abstractions
  - Change formatting arbitrarily
  - Remove comments that explain non-obvious intent

---

© 2026 [sandokan.cat](https://sandokan.cat)

> Personal project for learning, demonstration, and portfolio purposes.
