// Copyright 2022 Google LLC.
// SPDX-License-Identifier: Apache-2.0

// This module converts 2.00 into $2.00
import formatCurrency from "/assets/node_modules/fake-currency-demo/dist/index.js";

for (const el of document.querySelectorAll(".amount")) {
	formatCurrency(el, "USD");
}

// This function runs when the user clicks 'View' for a transaction message
async function viewTransaction(event) {
	event.preventDefault();
	const { id, type } = event.target.dataset;
	const url = `/bank/get-transaction-message/${type}/${id}`;
	const transactionMessageResponse = await fetch(url);
	const transactionMessage = await transactionMessageResponse.text();
	event.target.outerHTML = `<span>${transactionMessage}</span>`;
}

for (const el of document.querySelectorAll(".load-reference-message")) {
	el.addEventListener("click", viewTransaction);
}
