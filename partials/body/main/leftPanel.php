<div id="left-panel">
    <section>
        <figure id="#<?= htmlspecialchars($shortName); ?>">
            <picture>
                <source type="image/webp" srcset="img/photos/<?= htmlspecialchars($shortName); ?>@3x.webp 3x, img/photos/<?= htmlspecialchars($shortName); ?>@2x.webp 2x, img/photos/<?= htmlspecialchars($shortName); ?>@1x.webp 1x"> <!-- WEBP SOURCES -->
                <source type="image/png" srcset="img/photos/<?= htmlspecialchars($shortName); ?>@3x.png 3x, img/photos/<?= htmlspecialchars($shortName); ?>@2x.png 2x, img/photos/<?= htmlspecialchars($shortName); ?>@1x.png 1x"> <!-- PNG FALLBACK -->
                <img data-i18n-attr="alt:<?= htmlspecialchars($shortName); ?>" src="img/photos/<?= htmlspecialchars($shortName); ?>@3x.png" fetchpriority="high" decoding="sync" loading="eager" alt="Portrait of <?= htmlspecialchars($G('brand.name')); ?>"> <!-- FALLBACK IMG (LAST RESORT) -->
            </picture>
            <figcaption>
                <h1 lang="es-ES"><?= $G('brand.name'); ?></h1>
                <h2 data-i18n="profile"><span lang="en-GB">FullstacK</span> Web Developer</h2>
                <p data-i18n="biography">I’m passionate with clean, functional code. I train every day—both through formal courses and self-learning—because learning doesn’t stop when the bell rings. I like breaking things to understand (and fix) them better, which is why <span lang="en-GB">Red Teaming</span> strongly appeals to me. I don’t follow the standard path; I prefer carving my own with a keyboard and coffee. I look for projects where I can learn, contribute, and leave a mark—without pretension or empty promises. If I don’t know something, I dig into it. And if something motivates me, I won’t stop until I get it right.</p>
            </figcaption>
        </figure>
    </section>
    <section>
        <h3 data-i18n="languages">Languages</h3>
        <ul id="languages">
            <li data-i18n="catalan">Catalan
                <svg class="icons-color-1" role="img" aria-label="Native level" aria-hidden="false" width="124" height="18" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#native-lang" xlink:href="img/sprite.svg#native-lang"></use>
                </svg>
            </li>
            <li data-i18n="spanish">Spanish
                <svg class="icons-color-1" role="img" aria-label="Native level" aria-hidden="false" width="124" height="18" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#native-lang" xlink:href="img/sprite.svg#native-lang"></use>
                </svg>
            </li>
            <li data-i18n="english">English
                <svg class="icons-color-1" role="img" aria-label="Intermediate level" aria-hidden="false" width="124" height="18" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#native-lang" xlink:href="img/sprite.svg#medium-lang"></use>
                </svg>
            </li>
        </ul>
    </section>
    <section>
        <h3 data-i18n="contact">Contact</h3>
        <ol id="contact">
            <li>
                <address>
                    <a id="mail" data-i18n-attr="aria-label:mail" href="mailto:dev@sandokan.cat" aria-label="Send an E-mail"><strong>dev@sandokan.cat</strong></a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="25" height="25" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#email" xlink:href="img/sprite.svg#email"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:mobile" href="tel:+34631306583" aria-label="Send a WhatsApp or call">+34 631306583</a>
                </address>
                <svg class="icons-color-1" aria-hidden="true" width="22" height="22" preserveAspectRatio="xMinYMin meet">
                    <use href="img/sprite.svg#whatsapp" xlink:href="img/sprite.svg#whatsapp"></use>
                </svg>
            </li>
            <li>
                <address>
                    <a data-i18n-attr="aria-label:linkedin" href="https://linkedin.com/in/sandokanCat" target="_blank" rel="noopener noreferrer" aria-label="Visit Linkedin profile">in/sandokanCat</a>
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
