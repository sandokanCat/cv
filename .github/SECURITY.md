# SECURITY.md

## Purpose

This document explains the security practices for this repository and how potential security issues should be handled.

Although this is a **personal portfolio project**, security best practices are applied throughout **frontend and backend code**.

> **Note:** Security measures cover `HTML`, `CSS`, `JS`, and `PHP` to demonstrate `fullstack`

---

## Reporting Security Issues

If you discover a vulnerability or potential security issue, please contact me **privately**:  

- Email: [dev@sandokan.cat](mailto:dev@sandokan.cat) (personal, monitored)  
- Alternatively, GitHub [issues](https://github.com/sandokanCat/cv/issues) **can be used only for non-sensitive questions**.

> Do not create public issues containing sensitive security details.

---

## Security Practices

- **Input validation**: all user input is treated as untrusted.
- **Output escaping**: using `htmlspecialchars` or equivalent in PHP.
- **No unsafe evals**: `eval` or `new Function` are strictly avoided.
- **Content Security Policy (CSP)** compatible.
- **Accessible and semantic HTML**: prevents misuse and ensures predictable DOM structure.
- **Separation of concerns**: logic, presentation, and configuration are clearly separated.
- **Dependencies**: minimal, only official browser APIs or verified libraries; no external frameworks by design.

---

## Personal Security Notes

- This project is not intended for production deployment.  
- Any personal data (if added for testing) is simulated or anonymized.  
- Security practices are implemented to demonstrate knowledge of safe coding and to showcase professionalism.

---

© 2026 [sandokan.cat](https://sandokan.cat)

> Personal project for learning, demonstration, and portfolio purposes.
