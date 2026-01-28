<?php
// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    exit('Forbidden');
}
?>

<header>
    <noscript> <!-- NOSCRIPT WARNING -->
        <section id="noscript-warning" data-i18n="noscriptWarn" role="alert">
            <?= $H('noscriptWarn'); ?>
        </section>
    </noscript>

    <nav>
        <ul class="js-disabled">
            <li> <!-- DARK THEME -->
                <button data-i18n-attr="aria-label:darkBtn" id="theme-dark-btn" class="icons-snippet active" aria-label="<?= $L('darkBtn', 'aria-label'); ?>" type="button">🌓</button>
            </li>

            <!-- LANG MENU -->
            <?php foreach ($opLang as $langCode => $langData):
                $localeCode = htmlspecialchars($langData[0] ?? '', ENT_QUOTES | ENT_HTML5);
                $label = htmlspecialchars($langData[1] ?? '', ENT_QUOTES | ENT_HTML5); ?>
                <li>
                    <button data-lang="<?= $localeCode ?>" class="icons-snippet" aria-label="<?= $label; ?>" type="button">
                        <svg aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet">
                            <use href="img/sprite.svg#<?= $localeCode; ?>" xlink:href="img/sprite.svg#<?= $localeCode; ?>">
                            </use>
                        </svg>
                    </button>
                </li>
            <?php endforeach; ?>
        </ul>
    </nav>
</header>