<?php
// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    header('Location: /partials/error.php?code=403');
    exit;
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
            <h5 data-i18n="otherKnow"><?= $T('otherKnow'); ?></h5>
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
                <?php foreach ($cybersec as $cybersecItem): ?>
                    <li><?= $cybersecItem; ?></li>
                <?php endforeach; ?>
                <li data-i18n="netSecurity"><?= $T('netSecurity'); ?></li>
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
                <li data-i18n="software"><?= $T('software'); ?></li>
                <?php foreach ($backTech as $backItem): ?>
                    <li><?= $backItem; ?></li>
                <?php endforeach; ?>
                <li data-i18n="network"><?= $T('network'); ?></li>
                <li><abbr lang='en-GB' title='Apache HTTP Server'>Apache</abbr></li>
                <li><span lang='en-GB'>Java</span></li>
                <li><abbr lang='en-GB' title='JavaServer Pages'>JSP</abbr></li>
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
                <li data-i18n="performance"><?= $T('performance'); ?></li>
                <li data-i18n="a11y"><?= $T('a11y'); ?></li>
                <li data-i18n="responsive"><?= $T('responsive'); ?></li>
                <li data-i18n="seo"><?= $T('seo'); ?></li>
                <li data-i18n="publi"><?= $T('publi'); ?></li>
                <li lang="en-GB">GitHub</li>
                <li>
                    <a data-i18n-attr="aria-label:seeCertificate" data-i18n="addTraining" class="modal-link"
                        href="doc/pdf_signed/IFCD0110-FC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        target="_blank"
                        data-modal="doc/pdf_signed/IFCD0110-FC_<?= htmlspecialchars($shortName, ENT_QUOTES | ENT_HTML5); ?>.pdf"
                        aria-label="<?= $L('seeCertificate'); ?>"><?= $T('addTraining'); ?></a>
                </li>
            </ol>
        </article>
    </section>
</div>
