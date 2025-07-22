// ADD COPYRIGHT SIGNATURE TO FOOTER
export function signature(selector = '#signature-text') {
	const el = document.querySelector(selector); // GET TARGET ELEMENT
	if (el) el.textContent = `© ${new Date().getFullYear()} sandokan.cat`; // SET CURRENT YEAR + AUTHOR
}