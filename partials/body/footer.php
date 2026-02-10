<?php
// PREVENT DIRECT ACCESS
if (!defined('ENTRY_POINT')) {
    http_response_code(403);
    exit('Forbidden');
}
?>

<!-- COOKIES BLOCK -->
<footer id="cookies-bar">
    <p>🍪🐱 <strong><?= htmlspecialchars($brand['nick'], ENT_QUOTES | ENT_HTML5); ?></strong> <span
        data-i18n="cookies"><?= $H('cookies'); ?></span>
    </p>
</footer>
<!--//COOKIES END -->