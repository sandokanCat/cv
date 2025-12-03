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
                    <a data-i18n-attr="aria-label:cyberIntro" data-i18n="cyberIntro" class="modal-link" href="doc/IFCT0023-CYBERSEC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" target="_blank" data-modal="doc/IFCT0023-CYBERSEC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('cyberIntro'); ?>" lang="es-ES"><?= $T('cyberIntro'); ?></a>
                </li>
                <li>
                    <a data-i18n-attr="aria-label:cyberUsers" data-i18n="cyberUsers" class="modal-link" href="doc/IFCT0024-CYBERSEC-USERS_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" target="_blank" data-modal="doc/IFCT0024-CYBERSEC-USERS_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('cyberUsers'); ?>" lang="es-ES"><?= $T('cyberUsers'); ?></a>
                </li>
            </ol>
        </article>
        <article>
            <h5 data-i18n="appDev"><?= $T('appDev'); ?></h5>
            <h6 lang="ca-ES">Institució Pau Casals</h6>
            <ol>
                <li data-i18n="JSONandAJAX"><?= $H('JSONandAJAX'); ?></li>
                <li data-i18n="PHPandMySQL"><?= $H('PHPandMySQL'); ?></li>
                <li data-i18n="JavaAndJSP"><?= $H('JavaAndJSP') ;?></li>
            </ol>
        </article>
        <article>
            <h5 data-i18n="webDev"><?= $T('webDeb'); ?></h5>
            <h6 lang="es-ES">ADAMS Formación</h6>
            <ol>
                <li data-i18n="HTMLandCSS"><?= $H('HTMLandCSS'); ?></li>
                <li>
                    <a data-i18n-attr="aria-label:JSandWP" data-i18n="JSandWP" class="modal-link" href="doc/IFCD0110-JSiPW_<?= htmlspecialchars($shortName); ?>.pdf" target="_blank" data-modal="doc/IFCD0110-JSiPW_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('JSandWP'); ?>" lang="ca-ES"><?= $H('JSandWP'); ?></a>
                </li>
                <li>
                    <a data-i18n-attr="aria-label:addTraining" data-i18n="addTraining" class="modal-link" href="doc/IFCD0110-FC_<?= htmlspecialchars($shortName); ?>.pdf" target="_blank" data-modal="doc/IFCD0110-FC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('addTraining'); ?>" lang="ca-ES"><?= $T('addTraining'); ?></a>
                </li>
            </ol>
        </article>
        <article id="carousel">
            <h6 data-i18n="otherCert"><?= $T('otherCert'); ?></h6>
            <!-- CAROUSEL -->
            <noscript> <!-- FALLBACK -->
                <ol id="carousel-fallback" class="carousel-track" role="group" aria-roledescription="carousel">
                    <?php
                    $carouselData = json_decode(file_get_contents('js/data/carousel.json'), true);

                    foreach ($carouselData as $item):
                        $imgSrc = $item['png']['fallback'] ?? '';
                        $alt = $item['alt'][$currentLang] ?? '';?>
                        <li>
                            <img src="<?= htmlspecialchars($imgSrc, ENT_QUOTES | ENT_HTML5); ?>" 
                                fetchpriority="high" decoding="sync" loading="eager" 
                                alt="<?= htmlspecialchars($alt, ENT_QUOTES | ENT_HTML5); ?>">
                        </li>
                    <?php endforeach; ?>
                </ol>
            </noscript>
            <figure class="carousel-container js-disabled"> <!-- JS ENABLED -->
                <div class="carousel-imgs">
                    <ol class="carousel-track" aria-live="polite" role="group" aria-roledescription="carousel"></ol>
                </div>
                <aside data-i18n-attr="aria-label:carouselCtrl" class="carousel-control" aria-label="<?= $L('carouselCtrl'); ?>">
                    <button data-i18n-attr="aria-label:carouselBack" class="carousel-back" aria-label="<?= $L('carouselBack'); ?>" type="button" aria-controls="carousel-track">
                        <svg class="icons-scale" aria-hidden="true" width="30" height="30" preserveAspectRatio="xMinYMin meet">
                            <use href="img/sprite.svg#arrow-left" xlink:href="img/sprite.svg#arrow-left"></use>
                        </svg>
                    </button>
                    <button data-i18n-attr="aria-label:carouselAdvance" class="carousel-advance" aria-label="<?= $L('carouselAdvance'); ?>" type="button" aria-controls="carousel-track">
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
                    <a data-i18n-attr="aria-label:UNEDaccess" data-i18n="UNEDaccess" class="modal-link" href="doc/accesoUNED_<?= htmlspecialchars($shortName); ?>.pdf" target="_blank" data-modal="doc/accesoUNED_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('UNEDaccess'); ?>" lang="es-ES"><?= $T('UNEDaccess'); ?></a>
                </li>
            </ol>
        </article>
        <article>
            <h6 lang="ca-ES">IES Joan Coromines</h6>
            <ol>
                <li>
                    <a data-i18n-attr="aria-label:ESO" data-i18n="ESO" class="modal-link" href="doc/certificatESO_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" target="_blank" data-modal="doc/certificatESO_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf" aria-label="<?= $L('ESO'); ?>" lang="ca-ES"><?= $H('ESO'); ?></a>
                </li>
            </ol>
        </article>
    </section>
</div>
