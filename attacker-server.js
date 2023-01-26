// Copyright 2022 Google LLC.
// SPDX-License-Identifier: Apache-2.0

import nunjucks from "nunjucks";
import express from "express";

function attackerServer(port, BANK_SERVER_PORT) {
	function getPaymentURL(req) {
		let updatedURL = new URL(
			req.protocol + "://" + req.get("host") + req.originalUrl
		);

		if (updatedURL.port && updatedURL.port.length) {
			updatedURL.port =
				// When not running on localhost, a hosted service
				// might be using a different public port
				process.env.HOSTED_SERVICE_BANK_SERVER_PUBLIC_PORT ||
				BANK_SERVER_PORT;
		}

		if (process.env.IS_HTTPS) {
			updatedURL.protocol = "https:";
		}

		updatedURL.pathname = "/bank/send";
		return updatedURL;
	}

	const app = express();
	nunjucks.configure("html/attacker", {
		autoescape: true,
		express: app,
		noCache: true,
	});

	app.get("/", (req, res) => {
		res.send(`
			<a href="/csrf">csrf</a> / <a href="/clickjacking">clickjacking</a>
			`);
	});

	app.get("/clickjacking", (req, res) => {
		const paymentURL = getPaymentURL(req);
		res.render("clickjacking.html", {
			paymentURL,
		});
	});

	app.get("/csrf", (req, res) => {
		const formURL = getPaymentURL(req);

		res.render("csrf.html", {
			formURL,
		});
	});

	app.listen(port, () => {
		const message = `Attacker Server Started: Use: http://localhost:${port}`;
		console.log(message);
	});
}

export default attackerServer;
