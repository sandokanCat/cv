// Import the rendercv function and all the refactored components
#import "@preview/rendercv:0.1.0": *

// Apply the rendercv template with custom configuration
#show: rendercv.with(
  name: "Gonzalo Cabezas Núñez",
  footer: context { [#emph[Gonzalo Cabezas Núñez -- #str(here().page())\/#str(counter(page).final().first())]] },
  top-note: [ #emph[Última actualización Feb 2026] ],
  locale-catalog-language: "es",
  page-size: "us-letter",
  page-top-margin: 0.7in,
  page-bottom-margin: 0.7in,
  page-left-margin: 0.7in,
  page-right-margin: 0.7in,
  page-show-footer: true,
  page-show-top-note: true,
  colors-body: rgb(0, 0, 0),
  colors-name: rgb(29, 42, 66),
  colors-headline: rgb(0, 79, 144),
  colors-connections: rgb(29, 42, 66),
  colors-section-titles: rgb(29, 42, 66),
  colors-links: rgb(255, 180, 0),
  colors-footer: rgb(128, 128, 128),
  colors-top-note: rgb(128, 128, 128),
  typography-line-spacing: 0.6em,
  typography-alignment: "justified",
  typography-date-and-location-column-alignment: right,
  typography-font-family-body: "Source Sans 3",
  typography-font-family-name: "Source Sans 3",
  typography-font-family-headline: "Source Sans 3",
  typography-font-family-connections: "Source Sans 3",
  typography-font-family-section-titles: "Source Sans 3",
  typography-font-size-body: 10pt,
  typography-font-size-name: 30pt,
  typography-font-size-headline: 10pt,
  typography-font-size-connections: 10pt,
  typography-font-size-section-titles: 1.4em,
  typography-small-caps-name: false,
  typography-small-caps-headline: false,
  typography-small-caps-connections: false,
  typography-small-caps-section-titles: false,
  typography-bold-name: true,
  typography-bold-headline: false,
  typography-bold-connections: false,
  typography-bold-section-titles: true,
  links-underline: false,
  links-show-external-link-icon: false,
  header-alignment: center,
  header-photo-width: 3.5cm,
  header-space-below-name: 0.7cm,
  header-space-below-headline: 0.7cm,
  header-space-below-connections: 0.7cm,
  header-connections-hyperlink: true,
  header-connections-show-icons: true,
  header-connections-display-urls-instead-of-usernames: false,
  header-connections-separator: "",
  header-connections-space-between-connections: 0.5cm,
  section-titles-type: "with_partial_line",
  section-titles-line-thickness: 0.5pt,
  section-titles-space-above: 0.5cm,
  section-titles-space-below: 0.3cm,
  sections-allow-page-break: true,
  sections-space-between-text-based-entries: 0.3em,
  sections-space-between-regular-entries: 1.2em,
  entries-date-and-location-width: 4.15cm,
  entries-side-space: 0.2cm,
  entries-space-between-columns: 0.1cm,
  entries-allow-page-break: false,
  entries-short-second-row: true,
  entries-summary-space-left: 0cm,
  entries-summary-space-above: 0cm,
  entries-highlights-bullet:  "•" ,
  entries-highlights-nested-bullet:  "•" ,
  entries-highlights-space-left: 0.15cm,
  entries-highlights-space-above: 0cm,
  entries-highlights-space-between-items: 0cm,
  entries-highlights-space-between-bullet-and-text: 0.5em,
  date: datetime(
    year: 2026,
    month: 2,
    day: 12,
  ),
)

// Override the education-entry function to increase the degree column width:
#let education-entry(main-column, date-and-location-column, degree-column: none, main-column-second-row: none) = {
  metadata("skip-content-area")

  context {
    let config = rendercv-config.get()
    let entries-space-between-columns = config.at("entries-space-between-columns")

    // The width was hardcoded to 1cm in previous versions, which is too small for some degrees.
    // We increased it to 2.4cm and disabled hyphenation to prevent word breaks like "certifica-do":
    let degree-column-width = 2.4cm 

    regular-entry(
      if degree-column != none {
        grid(
          columns: (degree-column-width, 1fr),
          column-gutter: entries-space-between-columns + 0.4cm,
          align: (left, auto),
          [
            #set text(hyphenate: false)
            #degree-column
          ],
          [
            #main-column
          ],
        )
      } else {
        main-column
      },
      date-and-location-column,
      main-column-second-row: if main-column-second-row != none {
        [
          #block(
            main-column-second-row,
            inset: (
              left: if degree-column != none { degree-column-width + entries-space-between-columns } else { 0cm },
              right: 0cm,
            ),
          )
        ]
      } else { none },
    )
  }
}


= Gonzalo Cabezas Núñez

#connections(
  [#link("https://sandokan.cat/", icon: false, if-underline: false, if-color: false)[#connection-with-icon("link")[sandokan.cat]]],
  [#link("mailto:dev@sandokan.cat", icon: false, if-underline: false, if-color: false)[#connection-with-icon("envelope")[dev\@sandokan.cat]]],
  [#link("tel:+34-631-30-65-83", icon: false, if-underline: false, if-color: false)[#connection-with-icon("phone")[631 30 65 83]]],
  [#link("https://linkedin.com/in/sandokanCat", icon: false, if-underline: false, if-color: false)[#connection-with-icon("linkedin")[sandokanCat]]],
  [#link("https://github.com/sandokanCat", icon: false, if-underline: false, if-color: false)[#connection-with-icon("github")[sandokanCat]]],
  [#connection-with-icon("location-dot")[08014 Barcelona, España]],
)


== Biografía

Me apasiona el código limpio y funcional. Me formo a diario, tanto en academias como por libre, porque el conocimiento no se acaba cuando suena el timbre. Me gusta romper cosas para entenderlas (y arreglarlas mejor), por eso el Red Team me llama fuerte. No sigo el camino estándar; prefiero trazar el mío con teclado y café. Busco proyectos donde pueda aprender, aportar y dejar huella, sin postureos ni promesas vacías. Si algo no lo sé, lo investigo. Y si algo me motiva, no paro hasta hacerlo bien.

== Habilidades Técnicas

#strong[Frontend:] HTML5, CSS3, JavaScript (Vanilla), JSON, AJAX, XHTML, WordPress, Responsive Design, A11y, SEO.

#strong[Backend:] PHP, Python, SQL (MariaDB), JWT, XML, Java, JSP, Apache HTTP Server.

#strong[Blockchain & Low-Level:] Solidity, Blockchain Architecture, C.

#strong[Herramientas & IT:] Git, GitHub, Linux (Bash), Ciberseguridad, Markdown, Arquitectura de Redes.

== Experiencia

#regular-entry(
  [
    #strong[Escuela de Negocios y Administración de Empresas], Desarrollador Web Backend

    - Desarrollo del Dashboard de la academia para la gestión de cursos, exámenes y expedientes.

    - Implementación de sistemas de generación y exportación de Newsletters personalizables.

  ],
  [
    L’Hospitalet de Llobregat

    Nov 2025 – Dic 2025

    2 meses

  ],
)

#regular-entry(
  [
    #strong[Gold Group], Coordinador de Relaciones Públicas

    - Coordinación de equipos y creación de marca en redes sociales.

    - Gestión del Marketing de eventos y venta de Merchandising.

  ],
  [
    Barcelona

    Sep 2012 – Abr 2015

    2 años 8 meses

  ],
)

== Educación

#education-entry(
  [
    #strong[Blockchain Accelerator], Desarrollo de Blockchain

    - Máster en Desarrollo Blockchain

  ],
  [
    Online

    Feb 2026 – Actualidad

    1 mes

  ],
  degree-column: [
    #strong[Máster]
  ],
)

#education-entry(
  [
    #strong[Institució Pau Casals], Inglés como lengua extranjera

    - Cambridge B1

  ],
  [
    L’Hospitalet de Llobregat

    Feb 2026 – Actualidad

    1 mes

  ],
  degree-column: [
    #strong[Certificado]
  ],
)

#education-entry(
  [
    #strong[Formación Tajamar], Ciberseguridad

    - Especialización en Ciberseguridad para usuarios y entornos empresariales.

  ],
  [
    Online

    Sep 2025 – Nov 2025

    3 meses

  ],
  degree-column: [
    #strong[Certificado Profesional]
  ],
)

#education-entry(
  [
    #strong[42 Barcelona], Programación

    - Formación intensiva basada en proyectos y aprendizaje entre pares.

  ],
  [
    Barcelona

    Ago 2025 – Dic 2025

    5 meses

  ],
  degree-column: [
    #strong[Sin certificado]
  ],
)

#education-entry(
  [
    #strong[Institució Pau Casals], Desarrollo de aplicaciones con tecnologías web

    - Desarrollo Web Backend centrado en arquitecturas escalables.

  ],
  [
    L’Hospitalet de Llobregat

    May 2025 – Dic 2025

    8 meses

  ],
  degree-column: [
    #strong[Certificado Profesional]
  ],
)

#education-entry(
  [
    #strong[ADAMS Formación], Confección y publicación de páginas web

    - Desarrollo Web Frontend centrado en el diseño web adaptable, accesibilidad y SEO.

  ],
  [
    Barcelona

    Abr 2024 – Jul 2024

    4 meses

  ],
  degree-column: [
    #strong[Certificado Profesional]
  ],
)

== Otros Datos

- Permiso de conducir B y vehículo propio.

- Disponibilidad total dentro de la provincia de Barcelona.
