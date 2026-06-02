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
            $mainDir = $carouselData['mainDir'] ?? 'img/carousel/';
            $scales = $carouselData['scales'] ?? ['3x' => '@3x', '2x' => '@2x', '1x' => '@1x'];
            
            // Get the first scale value as the highest resolution fallback
            reset($scales);
            $highestScaleVal = current($scales) ?: '@3x';
            
            $items = [];

            if (isset($carouselData['stacks']) && is_array($carouselData['stacks'])) {
                foreach ($carouselData['stacks'] as $stackKey => $stack) {
                    $stackDir = $stack['stackDir'] ?? '';
                    $stackExt = $stack['ext'] ?? null;

                    // Nested closure to process files under a directory and extension context
                    $processFiles = function($filesObj, $typeDir = '', $typeExt = null) use (&$items, $mainDir, $stackDir, $stackExt, $highestScaleVal) {
                        if (!is_array($filesObj)) return;

                        $filesGroup = [];
                        if (isset($filesObj['name'])) {
                            $filesGroup[] = $filesObj;
                        } else {
                            foreach ($filesObj as $fKey => $fObj) {
                                if (is_array($fObj)) {
                                    $filesGroup[] = $fObj;
                                }
                            }
                        }

                        foreach ($filesGroup as $fileObj) {
                            $fileName = $fileObj['name'] ?? '';
                            $alt = $fileObj['alt'] ?? [];

                            if ($fileName) {
                                $dirPath = $mainDir . $stackDir . $typeDir;

                                // Resolve extension using stack -> type -> file hierarchy (directly as string)
                                $fallbackExt = $fileObj['ext'] ?? $typeExt ?? $stackExt ?? '.png';
                                if (substr($fallbackExt, 0, 1) !== '.') {
                                    $fallbackExt = '.' . $fallbackExt;
                                }

                                $items[] = [
                                    'png' => [
                                        'fallback' => $dirPath . $fileName . $highestScaleVal . $fallbackExt
                                    ],
                                    'alt' => $alt
                                ];
                            }
                        }
                    };

                    // 1. Process files directly under the stack (if present)
                    if (isset($stack['files'])) {
                        $processFiles($stack['files'], '', $stackExt);
                    }

                    // 2. Process types and their files under the stack (if present)
                    if (isset($stack['types']) && is_array($stack['types'])) {
                        foreach ($stack['types'] as $typeKey => $type) {
                            $typeDir = $type['typeDir'] ?? $type['dir'] ?? '';
                            $typeExt = $type['ext'] ?? $stackExt;

                            if (isset($type['files'])) {
                                $processFiles($type['files'], $typeDir, $typeExt);
                            }
                        }
                    }
                }
            }

            $i = 0;
            foreach ($items as $item):
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