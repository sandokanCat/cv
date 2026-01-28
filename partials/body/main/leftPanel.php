<?php
// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    exit('Forbidden');
}
?>

<div id="left-panel">
    <section>
        <figure id="me">
            <picture>
                <!-- WEBP SOURCES -->
                <source type="image/webp"
                    srcset="img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@3x.webp 3x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@2x.webp 2x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@1x.webp 1x">
                <!-- PNG FALLBACK -->
                <source type="image/png"
                    srcset="img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@3x.png 3x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@2x.png 2x, img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@1x.png 1x">
                <!-- FALLBACK IMG (LAST RESORT) -->
                <img data-i18n-attr="alt:portrait"
                    src="img/photos/<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>@3x.png"
                    fetchpriority="high" decoding="sync" loading="eager" alt="<?= $A('portrait') ?>">
            </picture>
            <figcaption>
                <h1 lang="es-ES"><?= htmlspecialchars($brand['name'], ENT_QUOTES | ENT_HTML5); ?></h1>
                <h2 data-i18n="role"><?= $T('role'); ?></h2>
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
                    <a id="mail" data-i18n-attr="aria-label:mail"
                        href="mailto:<?= htmlspecialchars($brand['email'], ENT_QUOTES | ENT_HTML5); ?>"
                        aria-label="<?= $L('mail'); ?>"><strong><?= htmlspecialchars($brand['email'], ENT_QUOTES | ENT_HTML5); ?></strong></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="25" height="25"
                    preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#email" xlink:href="img/sprite.svg#email"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:mobile"
                        href="tel:<?= htmlspecialchars($brand['tel'], ENT_QUOTES | ENT_HTML5); ?>"
                        aria-label="<?= $L('mobile'); ?>"><?= htmlspecialchars($brand['tel'], ENT_QUOTES | ENT_HTML5); ?></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22"
                    preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#whatsapp" xlink:href="img/sprite.svg#whatsapp"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:linkedin" href="<?= $path['social']['linkedin']; ?>" target="_blank"
                        rel="noopener noreferrer"
                        aria-label="<?= $L('linkedin'); ?>">in/<?= htmlspecialchars($brand['user'], ENT_QUOTES | ENT_HTML5); ?></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22"
                    preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#linkedin" xlink:href="img/sprite.svg#linkedin"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:discord" href="<?= $path['social']['discord']; ?>" target="_blank"
                        rel="noopener noreferrer"
                        aria-label="<?= $L('discord'); ?>"><?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="24" height="24"
                    preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#discord" xlink:href="img/sprite.svg#discord"></use>
                </svg>
            </li>
            <li>
                <address data-i18n-attr="aria-label:location">
                    <?= htmlspecialchars($brand['postal'], ENT_QUOTES | ENT_HTML5); ?> <span
                        lang="ca-ES"><?= htmlspecialchars($brand['city'], ENT_QUOTES | ENT_HTML5); ?></span></address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22"
                    preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#address" xlink:href="img/sprite.svg#address"></use>
                </svg>
            </li>
        </ol>
    </section>
</div>