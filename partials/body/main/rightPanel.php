<?php
// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    exit('Forbidden');
}
?>

<div id="right-panel">
    <section>
        <h4 data-i18n="studies"><?= $T('studies'); ?></h4>
        <article>
            <h5>
                <strong data-i18n="blockchain"><?= $H('blockchain'); ?></strong>
            </h5>
            <h6 lang="en-GB"><?= htmlspecialchars($academy['blockchain']['name'], ENT_QUOTES | ENT_HTML5); ?></h6>
            <ol>
                <?php foreach ($blockchain as $blockchainItem): ?>
                    <li><?= $blockchainItem; ?></li>
                <?php endforeach; ?>
            </ol>
        </article>
        <article>
            <h5 data-i18n="otherLangs"><?= $T('otherLangs'); ?></h5>
            <h6 lang="ca-ES"><?= htmlspecialchars($academy['42bcn']['name'], ENT_QUOTES | ENT_HTML5); ?></h6>
            <ol>
                <?php foreach ($fortyTwo as $fortyTwoItem): ?>
                    <li><?= $fortyTwoItem; ?></li>
                <?php endforeach; ?>
            </ol>
        </article>
        <article>
            <h5>
                <strong data-i18n="cybersec"><?= $T('cybersec'); ?></strong>
            </h5>
            <h6 lang="es-ES"><?= htmlspecialchars($academy['cybersec']['name'], ENT_QUOTES | ENT_HTML5); ?></h6>
            <ol>
                <li>
                    <a data-i18n-attr="aria-label:seeCertificate" data-i18n="cyberIntro" class="modal-link"
                        href="doc/pdf_signed/IFCT0023-CYBERSEC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        target="_blank"
                        data-modal="doc/pdf_signed/IFCT0023-CYBERSEC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        aria-label="<?= $L('seeCertificate'); ?>"><?= $T('cyberIntro'); ?></a>
                </li>
                <li>
                    <a data-i18n-attr="aria-label:seeCertificate" data-i18n="cyberUsers" class="modal-link"
                        href="doc/pdf_signed/IFCT0024-CYBERSEC-USERS_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        target="_blank"
                        data-modal="doc/pdf_signed/IFCT0024-CYBERSEC-USERS_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        aria-label="<?= $L('seeCertificate'); ?>"><?= $T('cyberUsers'); ?></a>
                </li>
            </ol>
        </article>
        <article>
            <h5>
                <a data-i18n="appDev" data-i18n-attr="aria-label:seeCertificate" class="modal-link"
                    href="doc/pdf_signed/IFCD0210-BACKEND_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                    target="_blank"
                    data-modal="doc/pdf_signed/IFCD0210-BACKEND_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                    aria-label="<?= $L('seeCertificate'); ?>"><?= $T('appDev'); ?></a>
            </h5>
            <h6 lang="ca-ES"><?= htmlspecialchars($academy['backend']['name'], ENT_QUOTES | ENT_HTML5); ?></h6>
            <ol>
                <?php foreach ($backTech as $backItem): ?>
                    <li><?= $backItem; ?></li>
                <?php endforeach; ?>
                <li data-i18n="network"><?= $T('network'); ?></li>
                <li>
                    <a data-i18n-attr="aria-label:seeCertificate" data-i18n="addTraining" class="modal-link"
                        href="doc/pdf_signed/IFCD0210-FC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        target="_blank"
                        data-modal="doc/pdf_signed/IFCD0210-FC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        aria-label="<?= $L('seeCertificate'); ?>"><?= $T('addTraining'); ?></a>
                </li>
            </ol>
        </article>
        <article>
            <h5>
                <a data-i18n="webDev" data-i18n-attr="aria-label:seeCertificate" class="modal-link"
                    href="doc/pdf_signed/IFCD0110-JSiPW_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                    target="_blank"
                    data-modal="doc/pdf_signed/IFCD0110-JSiPW_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                    aria-label="<?= $L('seeCertificate'); ?>"><?= $T('webDev'); ?></a>
            </h5>
            <h6 lang="es-ES"><?= htmlspecialchars($academy['frontend']['name'], ENT_QUOTES | ENT_HTML5); ?></h6>
            <ol>
                <?php foreach ($frontTech as $frontItem): ?>
                    <li><?= $frontItem; ?></li>
                <?php endforeach; ?>
                <li data-i18n="responsive"><?= $T('responsive'); ?></li>
                <li data-i18n="a11y"><?= $T('a11y'); ?></li>
                <li data-i18n="seo"><?= $T('seo'); ?></li>
                <li data-i18n="publi"><?= $T('publi'); ?></li>
                <li>
                    <a data-i18n-attr="aria-label:seeCertificate" data-i18n="addTraining" class="modal-link"
                        href="doc/pdf_signed/IFCD0110-FC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        target="_blank"
                        data-modal="doc/pdf_signed/IFCD0110-FC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        aria-label="<?= $L('seeCertificate'); ?>"><?= $T('addTraining'); ?></a>
                </li>
            </ol>
        </article>
        <article>
            <h6 lang="es-ES"><?= htmlspecialchars($academy['university']['name'], ENT_QUOTES | ENT_HTML5); ?></h6>
            <ol>
                <li>
                    <a data-i18n-attr="aria-label:seeCertificate" data-i18n="UNEDaccess" class="modal-link"
                        href="doc/pdf_signed/accesoUNED_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        target="_blank"
                        data-modal="doc/pdf_signed/accesoUNED_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        aria-label="<?= $L('seeCertificate'); ?>"><?= $T('UNEDaccess'); ?></a>
                </li>
            </ol>
        </article>
        <article>
            <h6 lang="ca-ES"><?= htmlspecialchars($academy['highschool']['name'], ENT_QUOTES | ENT_HTML5); ?></h6>
            <ol>
                <li>
                    <a data-i18n-attr="aria-label:seeCertificate" data-i18n="ESO" class="modal-link"
                        href="doc/pdf_signed/certificatESO_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        target="_blank"
                        data-modal="doc/pdf_signed/certificatESO_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        aria-label="<?= $L('seeCertificate'); ?>"><?= $H('ESO'); ?></a>
                </li>
            </ol>
        </article>
    </section>
</div>
<article id="carousel">
    <h6 data-i18n="otherCert"><?= $T('otherCert'); ?></h6>
    <!-- CAROUSEL -->
    <figure class="carousel-container js-disabled"> <!-- JS ENABLED -->
        <div class="carousel-imgs">
            <ol class="carousel-track" aria-live="polite" role="group" aria-roledescription="carousel"></ol>
        </div>
        <aside data-i18n-attr="aria-label:carouselCtrl" class="carousel-control"
            aria-label="<?= $L('carouselCtrl'); ?>">
            <button data-i18n-attr="aria-label:carouselBack" class="carousel-back"
                aria-label="<?= $L('carouselBack'); ?>" type="button" aria-controls="carousel-track">
                <svg class="icons-snippet active" aria-hidden="true" width="30" height="30"
                    preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#arrow-left" xlink:href="img/sprite.svg#arrow-left"></use>
                </svg>
            </button>
            <button data-i18n-attr="aria-label:carouselAdvance" class="carousel-advance"
                aria-label="<?= $L('carouselAdvance'); ?>" type="button" aria-controls="carousel-track">
                <svg class="icons-snippet active" aria-hidden="true" width="30" height="30"
                    preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#arrow-right" xlink:href="img/sprite.svg#arrow-right"></use>
                </svg>
            </button>
        </aside>
        <div class="carousel-scrollbar"></div>
    </figure>
    <noscript> <!-- FALLBACK -->
        <ol id="carousel-fallback" class="carousel-track" role="group" aria-roledescription="carousel">
            <?php
            $carouselData = json_decode(file_get_contents('js/data/carousel.json'), true);
            $i = 0;

            foreach ($carouselData as $item):
                $imgSrc = $item['png']['fallback'] ?? '';
                $alt = $item['alt'][$currentLang] ?? '';
                $isFirst = ($i === 0);
                ?>
                <li>
                    <img src="<?= htmlspecialchars($imgSrc, ENT_QUOTES | ENT_HTML5); ?>"
                        fetchpriority="<?= $isFirst ? 'high' : 'auto'; ?>" decoding="<?= $isFirst ? 'sync' : 'async'; ?>" loading="<?= $isFirst ? 'eager' : 'lazy'; ?>" alt="<?= htmlspecialchars($alt, ENT_QUOTES | ENT_HTML5); ?>">
                </li>
            <?php $i++; endforeach; ?>
        </ol>
    </noscript>
    <!--//CAROUSEL END -->
</article>