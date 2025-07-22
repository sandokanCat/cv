export async function validateJSON(url) {
    const api = "https://open-utils-alpha.vercel.app/api/validateJSON";
    const params = new URLSearchParams({
        url: "https://a679-46-6-46-122.ngrok-free.app/js/data/phrases.json",
        timeout: "6000",
        requireContent: true,
        requiredKeys: "es-es,ca-es,en-gb",
        debug: false
    });

    const res = await fetch(`${api}?${params}`);
    const json = await res.json();

    if (!json.valid) throw new Error(json.error);
    return json.data;
}