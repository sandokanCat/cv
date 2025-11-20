<div id="bottom-container">
    <section>
        <h4 data-i18n="workExp">Work experience</h4>
        <div id="workExp">
            <article>
                <h5 data-i18n="RRPP">Public relations</h5>
                <h6 lang="en-GB">Sunlife</h6>
                <ol>
                    <li data-i18n="teamCoord">Team Coordinator</li>
                </ol>
            </article>
            <article>
                <h5 data-i18n="volunteer">Volunteer</h5>
                <h6 lang="es-ES">Banco de Alimentos</h6>
                <ol>
                    <li data-i18n="sorting">Sorting and packaging</li>
                </ol>
            </article>
        </div>
    </section>
    <section>
        <div class="others">
            <h4 data-i18n="otherData">Other data</h4>
            <a data-i18n-attr="aria-label:downloadCV" class="other-links" href="doc/CV_<?= htmlspecialchars($shortName); ?>.pdf" download="CV_<?= htmlspecialchars($shortName); ?>.pdf" aria-label="Download CV pdf">
                <svg class="icons-color-2 icons-scale" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#pdf" xlink:href="img/sprite.svg#pdf"></use>
                </svg>
            </a>
        </div>
        <div id="other-data">
            <ol>
                <li data-i18n="drivingLic">Driving license B and own vehicle</li>
                <li data-i18n="availability">Full availability within the province of <span lang="ca-ES">Barcelona</span></li>
            </ol>
            <p id="random-phrases" aria-live="polite"></p>
        </div>
    </section>
    <section>
        <div class="others">
            <h4 data-i18n="portfolio">Portfolio</h4>
            <!-- DROPDOWN MENU -->
            <noscript> <!-- FALLBACK -->
                <aside id="menu-fallback">
                    <ul aria-label="Repository menu">
                        <li>
                            <a href="https://github.com/sandokanCat" target="_blank" rel="noopener noreferrer" aria-label="Github">
                                <svg class="icons-color-2 icons-scale" role="img" aria-hidden="true" width="28" height="28" preserveAspectRatio="xMinYMin meet">
                                    <use href="img/sprite.svg#github" xlink:href="img/sprite.svg#github"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="https://vercel.com/dev-sandokan-cat" target="_blank" rel="noopener noreferrer" aria-label="Vercel">
                                <svg class="icons-color-2 icons-scale" role="img" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                                    <use href="img/sprite.svg#vercel" xlink:href="img/sprite.svg#vercel"></use>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </aside>
            </noscript>
            <aside class="other-links js-disabled" id="burger-nav"> <!-- JS ENABLED -->
                <ul id="burger-links" data-i18n-attr="aria-label:burger" aria-label="Repository menu">
                    <li id="burger-btn-wrapper">
                        <button id="burger-btn" aria-label="Open menu" aria-expanded="false" aria-pressed="false" type="button">
                            <span id="burger-icon" class="icons-scale">
                                <span id="burger-icon-top"></span>
                                <span id="burger-icon-middle"></span>
                                <span id="burger-icon-bottom"></span>
                            </span>
                        </button>
                    </li>
                    <li id="github-icon">
                        <a href="https://github.com/sandokanCat" target="_blank" rel="noopener noreferrer" aria-label="Github">
                            <svg class="icons-color-2 icons-scale" role="img" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                                <use href="img/sprite.svg#github" xlink:href="img/sprite.svg#github"></use>
                            </svg>
                        </a>
                    </li>
                    <li id="vercel-icon">
                        <a href="https://vercel.com/dev-sandokan-cat" target="_blank" rel="noopener noreferrer" aria-label="Vercel">
                            <svg class="icons-color-2 icons-scale" role="img" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                                <use href="img/sprite.svg#vercel" xlink:href="img/sprite.svg#vercel"></use>
                            </svg>
                        </a>
                    </li>
                </ul>
            </aside>
            <!--//MENU END -->
        </div>
        <div id="portfolio">
            <!-- SIGNATURE -->
            <p id="signature">
                <strong> © 
                    <span id="signature-year">
                        <noscript>2025</noscript>
                    </span>
                    sandokan.cat
                </strong>
            </p>
            <!--//SIGNATURE END -->
            <a href="https://sandokanCat.github.io/estopa/" target="_blank" data-status>
                <img data-i18n-attr="alt:estopa" src="img/portfolio/estopa.png" decoding="async" loading="lazy" alt="Estopa Fanpage, unfinished">
            </a>
        </div>
    </section>
</div>