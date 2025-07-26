// ADD YEAR INTO SIGNATURE
export function signature(selector = '#signature-year') {
	const el = document.querySelector(selector); // GET TARGET ELEMENT
	const year = new Date().getFullYear(); // GET CURRENT YEAR
	if (el && el.textContent !== year.toString()) {
		el.textContent = year; // SET CURRENT YEAR
	}
}