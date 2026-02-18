<?php
// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    header('Location: /partials/error.php?code=403');
    exit;
}
?>

<!-- SIGNATURE -->
<p id="signature">
    <strong> ©
        <span id="signature-year">
            <noscript><?= htmlspecialchars(gmdate('Y'), ENT_QUOTES | ENT_HTML5); ?></noscript>
        </span>
        <?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?>
    </strong>
</p>