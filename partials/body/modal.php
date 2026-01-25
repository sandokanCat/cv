<!-- MODAL WINDOW -->
<div id="modal-container" role="dialog" aria-hidden="true" tabindex="-1">
    <div id="modal-content">
        <div id="modal-iframe-wrapper">
            <iframe data-i18n-attr="aria-label:modalIframe" id="modal-iframe" src="about:blank"
                aria-label="<?= $L('modalIframe'); ?>"></iframe>
        </div>
        <div id="modal-img-wrapper"></div>
        <button data-i18n-attr="aria-label:modalClose" id="modal-close" class="icons-color-1"
            aria-label="<?= $L('modalClose'); ?>" type="button">
            <svg class="icons-snippet active" aria-hidden="true" width="50" height="50"
                preserveAspectRatio="xMinYMin meet">
                <use href="img/sprite.svg#close" xlink:href="img/sprite.svg#close"></use>
            </svg>
        </button>
    </div>
</div>
<!--//MODAL END -->
