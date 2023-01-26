// Copyright 2022 Google LLC.
// SPDX-License-Identifier: Apache-2.0

function main(amountEl, currency) {
	const originalAmount = parseInt(amountEl.textContent);

	const formattedAmount = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(originalAmount);

	amountEl.textContent = formattedAmount;
}

export default main;
