<header>
    <!-- NOSCRIPT WARNING -->
    <noscript>
        <section id="noscript-warning" data-i18n="noscriptWarn">
            <?= $H('noscriptWarn'); ?>
        </section>
    </noscript>
    <!--//NOSCRIPT END -->
    <nav>
        <!-- FALLBACK NAV -->
        <noscript>
            <ul>
                <li> <!-- DARK MODE -->
                    <a class="dark-mode-btn icons-scale" aria-label="<?= $L('darkBtn'); ?>" href="private/fallbacks/dark/index.en-GB.html">🌙</a>
                </li>
                <!-- LANG MENU -->
                <li>
                    <a aria-label="Spanish" href="private/fallbacks/light/index.es-ES.html">
                        <svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet">
                            <use href="img/sprite.svg#es-ES" xlink:href="img/sprite.svg#es-ES"></use>
                        </svg>
                    </a>
                </li>
                <li>
                    <a aria-label="Catalan" href="private/fallbacks/light/index.ca-ES.html">
                        <svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet">
                            <use href="img/sprite.svg#ca-ES" xlink:href="img/sprite.svg#ca-ES"></use>
                        </svg>
                    </a>
                </li>
            </ul>
        </noscript>
        <!--// FALLBACK NAV END -->
        <!-- JS NAV -->
        <ul class="js-disabled">
            <li> <!-- DARK MODE -->
                <button data-i18n-attr="aria-label:darkBtn" id="theme-dark-btn" class="dark-mode-btn icons-scale" aria-label="<?= t('darkBtn', 'aria-label'); ?>" type="button">🌓</button> <!-- JS ENABLED -->
            </li>
            <!-- LANG MENU -->
            <li>
                <button data-lang="ca-ES" class="icons-scale" aria-label="Català" type="button">
                    <svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet">
                        <use href="img/sprite.svg#ca-ES" xlink:href="img/sprite.svg#ca-ES"></use>
                    </svg>
                </button>
            </li>
            <li>
                <button data-lang="es-ES" class="icons-scale" aria-label="Español" type="button">
                    <svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet">
                        <use href="img/sprite.svg#es-ES" xlink:href="img/sprite.svg#es-ES"></use>
                    </svg>
                </button>
            </li>
            <li>
                <button data-lang="en-GB" class="icons-scale" aria-label="English" type="button">
                    <svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet">
                        <use href="img/sprite.svg#en-GB" xlink:href="img/sprite.svg#en-GB"></use>
                    </svg>
                </button>
            </li>
            <li>
                <button data-lang="ru-RU" class="icons-scale" aria-label="Русский" type="button">
                    <svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet">
                        <use href="img/sprite.svg#ru-RU" xlink:href="img/sprite.svg#ru-RU"></use>
                    </svg>
                </button>
            </li>
            <li>
                <button data-lang="ar-SA" class="icons-scale" aria-label="العربية" type="button">
                    <svg class="icons-scale" role="img" aria-hidden="true" width="40" height="40" preserveAspectRatio="xMinYMin meet">
                        <use href="img/sprite.svg#ar-SA" xlink:href="img/sprite.svg#ar-SA"></use>
                    </svg>
                </button>
            </li>
        </ul>
        <!--//JS NAV END -->
    </nav>
</header>
