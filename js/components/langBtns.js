function setCurrentLangButton(langBtns, currentLang) {
    langBtns.forEach(b => {
        const isCurrent = b.dataset.lang === currentLang;
        b.classList.toggle("active", isCurrent);
        b.style.zIndex = isCurrent ? 999 : 998;
        b.setAttribute("aria-pressed", isCurrent ? "true" : "false");
        b.setAttribute("aria-expanded", "false");
    });
}

export function initLangMenu(currentLang, onSelectLang) {
    const langBtns = document.querySelectorAll("nav button[data-lang]");
    let menuOpen = false;

    setCurrentLangButton(langBtns, currentLang);

    const closeMenu = () => {
        langBtns.forEach(b => {
            b.classList.remove("expanded");
            b.style.transform = "translateY(0)";
            b.setAttribute("aria-expanded", "false");
        });
        menuOpen = false;
    };

    langBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            const lang = btn.dataset.lang;
            const isCurrent = btn.classList.contains("active");

            // MENU CLOSED
            if (!menuOpen) {
                // ONLY OPEN MENU IF CURRENT LANGUAGE
                if (!isCurrent) return;

                let offset = btn.offsetHeight + 20;
                langBtns.forEach(b => {
                    if (b !== btn) {
                        b.classList.add("expanded");
                        b.style.transform = `translateY(${offset}px)`;
                        b.style.zIndex = 998;
                        b.setAttribute("aria-expanded", "true");
                        offset += b.offsetHeight + 20;
                    }
                });

                btn.setAttribute("aria-expanded", "true");
                menuOpen = true;
                return;
            }

            // MENU OPEN → SELECT NEW LANGUAGE
            if (lang !== currentLang && typeof onSelectLang === "function") {
                await onSelectLang(lang);
                currentLang = lang;
            }

            setCurrentLangButton(langBtns, currentLang);
            closeMenu();
        });
    });
}
