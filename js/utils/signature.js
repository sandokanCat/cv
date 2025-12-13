// ADD YEAR INTO SIGNATURE
export function signature(yearSelector) {
	const el = document.querySelector(yearSelector); // GET TARGET ELEMENT
	const year = new Date().getFullYear(); // GET CURRENT YEAR
	if (el && el.textContent !== year.toString()) {
		el.textContent = year; // SET CURRENT YEAR
	}
}