<div id="left-panel">
    <section>
        <figure id="me">
            <picture>
                <source type="image/webp" srcset="img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@3x.webp 3x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@2x.webp 2x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@1x.webp 1x"> <!-- WEBP SOURCES -->
                <source type="image/png" srcset="img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@3x.png 3x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@2x.png 2x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@1x.png 1x"> <!-- PNG FALLBACK -->
                <img data-i18n-attr="alt:portrait" src="img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@3x.png" fetchpriority="high" decoding="sync" loading="eager" alt="<?= $A('portrait') ?>"> <!-- FALLBACK IMG (LAST RESORT) -->
            </picture>
            <figcaption>
                <h1 lang="es-ES"><?= $brand['name']; ?></h1>
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
                    <a id="mail" data-i18n-attr="aria-label:mail" href="mailto:<?= $brand['email']; ?>" aria-label="<?= $L('mail'); ?>"><strong><?= $brand['email']; ?></strong></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="25" height="25" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#email" xlink:href="img/sprite.svg#email"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:mobile" href="tel:<?= $brand['tel']; ?>" aria-label="<?= $L('mobile'); ?>"><?= $brand['tel']; ?></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#whatsapp" xlink:href="img/sprite.svg#whatsapp"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:linkedin" href="<?= $path['social']['linkedin']; ?>" target="_blank" rel="noopener noreferrer" aria-label="<?= $L('linkedin'); ?>">in/<?= $brand['user']; ?></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#linkedin" xlink:href="img/sprite.svg#linkedin"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:discord" href="<?= $path['social']['discord']; ?>" target="_blank" rel="noopener noreferrer" aria-label="<?= $L('discord'); ?>"><?= $brand['nick']; ?></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="24" height="24" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#discord" xlink:href="img/sprite.svg#discord"></use>
                </svg>
            </li>
            <li>
                <address data-i18n-attr="aria-label:location"><?= $brand['postal']; ?> <span lang="ca-ES"><?= $brand['city']; ?></span></address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#address" xlink:href="img/sprite.svg#address"></use>
                </svg>
            </li>
        </ol>
    </section>
</div>
