(async () => {
    try {
        const res = await fetch("/js/schemaPerson.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`SCHEMA FETCH ERROR → ${res.status}`);

        const json = await res.json(); // LOAD JSON

        // CREATE SCRIPT TAG
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.textContent = JSON.stringify(json);

        // INJECT INTO <head>
        document.head.appendChild(script);

        console.log("Schema LD+JSON injected!");
    } catch (err) {
        console.error("injectSchema.js ERROR →", err);
    }
})();