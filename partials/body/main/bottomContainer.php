<div id="bottom-container">
    <section>
        <h4 data-i18n="workExp"><?= $T('workExp'); ?></h4>
        <div id="workExp">
            <article>
                <h5 data-i18n="backDev"><?= $H('backDev'); ?></h5>
                <h6 lang="es-ES">Escuela de Negocios y Administración de Empresas</h6>
                <ol>
                    <li data-i18n="appDev"><?= $T('appDev'); ?></li>
                </ol>
            </article>
            <article>
                <h5 data-i18n="RRPP"><?= $T('RRPP'); ?></h5>
                <h6 lang="en-GB">Sunlife</h6>
                <ol>
                    <li data-i18n="teamCoord"><?= $T('teamCoord'); ?></li>
                </ol>
            </article>
            <article>
                <h5 data-i18n="volunteer"><?= $T('volunteer'); ?></h5>
                <h6 lang="es-ES">Banco de Alimentos</h6>
                <ol>
                    <li data-i18n="sorting"><?= $T('sorting'); ?></li>
                </ol>
            </article>
        </div>
    </section>
    <section>
        <div class="others">
            <h4 data-i18n="otherData"><?= $T('otherData'); ?></h4>
            <a class="other-links icons-snippet active" data-i18n-attr="aria-label:downloadCV" href="doc/pdf_signed/CV_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" download="CV_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="Download CV pdf">
                <svg class="icons-color-2" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#pdf" xlink:href="img/sprite.svg#pdf"></use>
                </svg>
            </a>
        </div>
        <div id="other-data">
            <ol>
                <li data-i18n="drivingLic"><?= $T('drivingLic'); ?></li>
                <li data-i18n="availability"><?= $H('availability'); ?></li>
            </ol>
            <p id="random-phrases" aria-live="polite"></p>
        </div>
    </section>
    <section>
        <div class="others">
            <h4 data-i18n="portfolio"><?= $T('portfolio'); ?></h4>
            <!-- DROPDOWN MENU -->
            <aside class="other-links js-disabled"> <!-- JS ENABLED -->
                <ul id="burger-links" data-i18n-attr="aria-label:burger" aria-label="<?= $L('burger'); ?>">
                    <li>
                        <button class="icons-snippet active" id="burger-btn" aria-label="<?= $L('burgerBtn.aria-label.open'); ?>" aria-expanded="false" aria-pressed="false" type="button" aria-controls="burger-links">
                            <span id="burger-icon">
                                <span id="burger-icon-top"></span>
                                <span id="burger-icon-middle"></span>
                                <span id="burger-icon-bottom"></span>
                            </span>
                        </button>
                    </li>
                    <li>
                        <a id="github-icon" class="icons-snippet" href="<?= htmlspecialchars($path['social']['github'], ENT_QUOTES | ENT_HTML5); ?>" target="_blank" rel="noopener noreferrer" aria-label="Github">
                            <svg class="icons-color-2" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                                <use href="img/sprite.svg#github" xlink:href="img/sprite.svg#github"></use>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a id="vercel-icon" class="icons-snippet" href="<?= htmlspecialchars($path['social']['vercel'], ENT_QUOTES | ENT_HTML5); ?>" target="_blank" rel="noopener noreferrer" aria-label="Vercel">
                            <svg class="icons-color-2" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                                <use href="img/sprite.svg#vercel" xlink:href="img/sprite.svg#vercel"></use>
                            </svg>
                        </a>
                    </li>
                </ul>
            </aside>
            <noscript> <!-- FALLBACK -->
                <aside class="other-links">
                    <ul aria-label="Repository menu">
                        <li>
                            <a href="<?= htmlspecialchars($path['social']['github'], ENT_QUOTES | ENT_HTML5); ?>" target="_blank" rel="noopener noreferrer" aria-label="Github">
                                <svg class="icons-color-2 icons-snippet active" aria-hidden="true" width="28" height="28" preserveAspectRatio="xMinYMin meet">
                                    <use href="img/sprite.svg#github" xlink:href="img/sprite.svg#github"></use>
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a href="<?= htmlspecialchars($path['social']['vercel'], ENT_QUOTES | ENT_HTML5); ?>" target="_blank" rel="noopener noreferrer" aria-label="Vercel">
                                <svg class="icons-color-2 icons-snippet active" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                                    <use href="img/sprite.svg#vercel" xlink:href="img/sprite.svg#vercel"></use>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </aside>
            </noscript>
            <!--//MENU END -->
        </div>
        <div id="portfolio">
            <?php require_once __DIR__."/../../includes/signature.php"; // LOAD SIGNATURE ?>
            <a href="https://<?= htmlspecialchars($brand['user'], ENT_QUOTES | ENT_HTML5); ?>.github.io/estopa/" target="_blank" data-status>
                <img data-i18n-attr="alt:estopa" src="img/portfolio/estopa.png" decoding="async" loading="lazy" alt="<?= $A('estopa'); ?>">
            </a>
        </div>
    </section>
</div>
