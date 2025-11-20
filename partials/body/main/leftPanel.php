<div id="left-panel">
    <section>
        <figure id="#<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>">
            <picture>
                <source type="image/webp" srcset="img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@3x.webp 3x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@2x.webp 2x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@1x.webp 1x"> <!-- WEBP SOURCES -->
                <source type="image/png" srcset="img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@3x.png 3x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@2x.png 2x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@1x.png 1x"> <!-- PNG FALLBACK -->
                <img data-i18n-attr="alt:<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>" src="img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@3x.png" fetchpriority="high" decoding="sync" loading="eager" alt="Portrait of <?= htmlspecialchars($G('brand.name', 'html'), ENT_QUOTES | ENT_HTML5); ?>"> <!-- FALLBACK IMG (LAST RESORT) -->
            </picture>
            <figcaption>
                <h1 lang="es-ES"><?= G($globals, 'brand.name', 'html'); ?></h1>
                <h2 data-i18n="profile"><?= $H('profile'); ?></h2>
                <p data-i18n="biography"><?= $H('biography'); ?></p>
            </figcaption>
        </figure>
    </section>
    <section>
        <h3 data-i18n="languages"><?= $T('languages'); ?></h3>
        <ul id="languages">
            <li data-i18n="catalan"><?= $H('catalan'); ?></li>
            <li data-i18n="spanish"><?= $H('spanish'); ?></li>
            <li data-i18n="english"><?= $H('english'); ?></li>
        </ul>
    </section>
    <section>
        <h3 data-i18n="contact"><?= $T('contact'); ?></h3>
        <ol id="contact">
            <li>
                <address>
                    <a id="mail" data-i18n-attr="aria-label:mail" href="mailto:dev@sandokan.cat" aria-label="<?= $L('mail'); ?>"><strong>dev@sandokan.cat</strong></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="25" height="25" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#email" xlink:href="img/sprite.svg#email"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:mobile" href="tel:+34631306583" aria-label="S<?= $L('mobile'); ?>">+34 631306583</a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#whatsapp" xlink:href="img/sprite.svg#whatsapp"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:linkedin" href="https://linkedin.com/in/sandokanCat" target="_blank" rel="noopener noreferrer" aria-label="<?= $L('linkedin'); ?>">in/sandokanCat</a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#linkedin" xlink:href="img/sprite.svg#linkedin"></use>
                </svg>
            </li>
            <li>
                <address>08014 <span lang="ca-ES">Barcelona</span></address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#address" xlink:href="img/sprite.svg#address"></use>
                </svg>
            </li>
        </ol>
    </section>
</div>
