<header>
    <noscript> <!-- NOSCRIPT WARNING -->
        <section id="noscript-warning" data-i18n="noscriptWarn">
            <?= $H('noscriptWarn'); ?>
        </section>
    </noscript>
    <nav>
        <ul class="js-disabled">
            <li> <!-- DARK THEME -->
                <button data-i18n-attr="aria-label:darkBtn" id="theme-dark-btn" class="dark-mode-btn icons-scale" aria-label="<?= $L('darkBtn', 'aria-label'); ?>" type="button">🌓</button>
            </li>
            <!-- LANG MENU -->
            <?php foreach ($supportedLangs as $lang): ?>
                <li>
                    <button data-lang="<?= htmlspecialchars($lang[0], ENT_QUOTES | ENT_HTML5); ?>" class="icons-scale" aria-label="<?= htmlspecialchars($lang[1], ENT_QUOTES | ENT_HTML5); ?>" type="button">
                        <svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet">
                            <use href="img/sprite.svg#<?= htmlspecialchars($lang[0], ENT_QUOTES | ENT_HTML5); ?>" xlink:href="img/sprite.svg#<?= htmlspecialchars($lang[0], ENT_QUOTES | ENT_HTML5); ?>"></use>
                        </svg>
                    </button>
                </li>
            <?php endforeach; ?>
        </ul>
    </nav>
</header>
