<div id="right-panel">
    <section>
        <h4 data-i18n="studies"><?= $T('studies'); ?></h4>
        <article>
            <h5>
                <strong data-i18n="cybersec"><?= $T('cybersec'); ?></strong>
            </h5>
            <h6 lang="es-ES">Formación Tajamar</h6>
            <ol>
                <li>
                    <a data-i18n-attr="aria-label:cyberIntro" data-i18n="cyberIntro" class="modal-link" href="doc/diplomaCIBERSEGURIDAD_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" target="_blank" data-modal="doc/diplomaCIBERSEGURIDAD_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('cyberIntro'); ?>"><?= $T('cyberIntro'); ?></a>
                </li>
            </ol>
        </article>
        <article>
            <h5 data-i18n="appDev"><?= $T('appDev'); ?></h5>
            <h6 lang="ca-ES">Institució Pau Casals</h6>
            <ol>
                <li data-i18n="JSONandAJAX"><?= $H('JSONandAJAX'); ?></li>
                <li data-i18n="PHPandMySQL"><?= $H('PHPandMySQL'); ?></li>
                <li lang="en-GB">Java</li>
            </ol>
        </article>
        <article>
            <h5 data-i18n="webDev"><?= $T('webDeb'); ?></h5>
            <h6 lang="es-ES">ADAMS Formación</h6>
            <ol>
                <li data-i18n="HTMLandCSS"><?= $H('HTMLandCSS'); ?></li>
                <li>
                    <a data-i18n-attr="aria-label:JSandWP" data-i18n="JSandWP" class="modal-link" href="doc/IFCD0110-JSiPW_<?= htmlspecialchars($shortName); ?>.pdf" target="_blank" data-modal="doc/IFCD0110-JSiPW_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('JSandWP'); ?>"><?= $H('JSandWP'); ?></a>
                </li>
                <li>
                    <a data-i18n-attr="aria-label:AddTraining" data-i18n="AddTraining" class="modal-link" href="doc/IFCD0110-FC_<?= htmlspecialchars($shortName); ?>.pdf" target="_blank" data-modal="doc/IFCD0110-FC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('addTraining'); ?>"><?= $T('addTraining'); ?></a>
                </li>
            </ol>
        </article>
        <article id="carousel">
            <h6 data-i18n="otherCert"><?= $T('otherCert'); ?></h6>
            <!-- CAROUSEL -->
            <noscript> <!-- FALLBACK -->
                <ol id="carousel-fallback" class="carousel-track">
                    <li>
                        <img src="img/carousel/FRONT-END_certificate@3x.png" fetchpriority="high" decoding="sync" loading="eager" alt="Front-End certificate">
                    </li>
                    <li>
                        <img src="img/carousel/WEB-DEV_certificate@3x.png" decoding="async" loading="lazy" alt="Web development certificate">
                    </li>
                    <li>
                        <img src="img/carousel/HTML_certificate@3x.png" decoding="async" loading="lazy" alt="HTML certificate">
                    </li>
                    <li>
                        <img src="img/carousel/CSS_certificate@3x.png" decoding="async" loading="lazy" alt="CSS certificate">
                    </li>
                    <li>
                        <img src="img/carousel/JS_certificate@3x.png" decoding="async" loading="lazy" alt="JavaScript certificate">
                    </li>
                    <li>
                        <img src="img/carousel/JS-2_certificate@3x.png" decoding="async" loading="lazy" alt="JavaScript intermediate certificate">
                    </li>
                </ol>
            </noscript>
            <figure class="carousel-container js-disabled"> <!-- JS ENABLED -->
                <div class="carousel-imgs">
                    <ol class="carousel-track" aria-live="polite"></ol>
                </div>
                <aside data-i18n-attr="aria-label:carouselCtrl" class="carousel-control" aria-label="C<?= $L('carouselCtrl'); ?>">
                    <button data-i18n-attr="aria-label:carouselBack" class="carousel-back" aria-label="<?= $L('carouselBack'); ?>" type="button">
                        <svg class="icons-scale" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                            <use href="img/sprite.svg#arrow-left" xlink:href="img/sprite.svg#arrow-left"></use>
                        </svg>
                    </button>
                    <button data-i18n-attr="aria-label:carouselAdvance" class="carousel-advance" aria-label="<?= $L('carouselAdvance'); ?>" type="button">
                        <svg class="icons-scale" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                            <use href="img/sprite.svg#arrow-right" xlink:href="img/sprite.svg#arrow-right"></use>
                        </svg>
                    </button>
                </aside>
                <div class="carousel-scrollbar"></div>
            </figure>
            <!--//CAROUSEL END -->
        </article>
        <article>
            <h6 lang="es-ES">Universidad Nacional de Educación a Distancia</h6>
            <ol>
                <li>
                    <a data-i18n-attr="aria-label:UNEDaccess" data-i18n="UNEDaccess" class="modal-link" href="doc/accesoUNED_<?= htmlspecialchars($shortName); ?>.pdf" target="_blank" data-modal="doc/accesoUNED_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('UNEDaccess'); ?>"><?= $T('UNEDaccess'); ?></a>
                </li>
            </ol>
        </article>
        <article>
            <h6 lang="ca-ES">IES Joan Coromines</h6>
            <ol>
                <li>
                    <a data-i18n-attr="aria-label:ESO" data-i18n="ESO" class="modal-link" href="doc/certificatESO_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" target="_blank" data-modal="doc/certificatESO_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('ESO'); ?>"><?= $H('ESO'); ?></a>
                </li>
            </ol>
        </article>
    </section>
</div>
