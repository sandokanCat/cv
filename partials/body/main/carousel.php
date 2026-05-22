<?php
// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    header('Location: /partials/error.php?code=403');
    exit;
}
?>

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