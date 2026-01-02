export function initLangMenu(currentLang, onSelectLang) {
    // 🟢 DOM ELEMENTS
    const langBtns = [...document.querySelectorAll("nav button[data-lang]")];

    // ⚡ FLAGS
    let menuOpen = false;
    let isAnimating = false;

    // ⬇ INIT BASE TRANSLATE FOR ALL BUTTONS
    langBtns.forEach(btn => btn._baseTranslateY = 0);

    // 🔄 UPDATE BUTTON TRANSFORM
    function updateBtnTransform(btn, scale = 1) {
        if (btn.matches(':hover') && btn.classList.contains('selected')) scale = 1.2; // MAINTAIN HOVER SCALE FOR SELECTED BUTTON UNDER CURSOR

        btn.style.transform = `translateY(${btn._baseTranslateY}px) scale(${scale})`;
    }

    // 🎯 SET CURRENT LANGUAGE BUTTON STATE
    function setCurrentLangButton(langBtns, currentLang) {
        langBtns.forEach(b => {
            const isCurrent = b.dataset.lang === currentLang;

            // UPDATE BUTTON CLASS AND A11Y
            b.classList.toggle("selected", isCurrent);
            b.style.zIndex = isCurrent ? 999 : 998;
            b.setAttribute("aria-pressed", isCurrent ? "true" : "false");
            b.setAttribute("aria-expanded", "false");

            if (isCurrent) b._baseTranslateY = 0;  // RESET TRANSLATE FOR CURRENT

            updateBtnTransform(b); // APPLY TRANSFORM
        });
    }

    // 🎈 HOVER EFFECT HANDLERS
    langBtns.forEach(btn => {
        btn.addEventListener("mouseenter", () => {
            if (isAnimating) return; // SKIP IF ANIMATION IN PROGRESS
            updateBtnTransform(btn, 1.2);
        });
        btn.addEventListener("mouseleave", () => {
            if (isAnimating) return;
            updateBtnTransform(btn, 1);
        });
    });

    // ⏱ ANIMATE BTN HELPER
    const animateBtns = (callback) => {
        isAnimating = true; // BLOCK HOVER DURING ANIMATION

        // EXECUTE MOVEMENT AND RESET FLAG WHEN FINISHED
        callback();
        requestAnimationFrame(() => { isAnimating = false; }, 500);
    };

    // ❌ CLOSE MENU FUNCTION
    const closeMenu = () => {
        animateBtns(() => {
            langBtns.forEach(b => {
                // HIDE NON-SELECTED BUTTONS
                if (!b.classList.contains("selected")) {
                    b.classList.remove("active");
                    b.setAttribute("aria-expanded", "false");
                    b._baseTranslateY = 0;
                }
                updateBtnTransform(b); // APPLY TRANSFORM
            });
            menuOpen = false; // UPDATE FLAG
        });
    };

    // 🔘 BUTTON CLICK HANDLER
    langBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const lang = btn.dataset.lang;

            // ⬇ OPEN MENU IF CLOSED
            if (!menuOpen) {
                if (!btn.classList.contains("selected")) return; // ONLY CURRENT BTN OPENS MENU

                // START OPENING ANIMATION
                let offset = btn.offsetHeight + 20;
                animateBtns(() => {
                    langBtns.forEach(b => {
                        if (b !== btn) {
                            b.classList.add("active");
                            b._baseTranslateY = offset;

                            updateBtnTransform(b);

                            b.style.zIndex = 998;
                            b.setAttribute("aria-expanded", "true");
                            offset += b.offsetHeight + 20;
                        }
                    });

                    // A11Y AND FLAG UPDATE
                    btn.setAttribute("aria-expanded", "true");
                    menuOpen = true;
                });

                return;
            }

            // ⬇ SELECT NEW LANGUAGE
            if (lang !== currentLang && typeof onSelectLang === "function") {
                await onSelectLang(lang);

                currentLang = lang;
            }

            // RESET SELECTED BUTTON AND CLOSE MENU
            setCurrentLangButton(langBtns, currentLang);
            closeMenu();
        });
    });

    // 🔹 INITIALIZE CURRENT BUTTON
    setCurrentLangButton(langBtns, currentLang);
}
