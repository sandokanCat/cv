<?php
// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    header('Location: /partials/error.php?code=403');
    exit;
}
?>

<!-- SIGNATURE -->
<a id="signature"
    href="<?= htmlspecialchars($path['social']['orcid'], ENT_QUOTES | ENT_HTML5); ?>"
    target="_blank" rel="noopener noreferrer">
    <small> ©
        <span id="signature-year">
            <noscript><?= htmlspecialchars(gmdate('Y'), ENT_QUOTES | ENT_HTML5); ?></noscript>
        </span>
        <?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?>
    </small>
</a>