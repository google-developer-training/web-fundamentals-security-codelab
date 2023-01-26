// Copyright 2022 Google LLC.
// SPDX-License-Identifier: Apache-2.0

import nunjucks from "nunjucks";
import session from "express-session";
import catNames from "cat-names";
import express from "express";

function randomBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function loginRequired(req, res, next) {
	if (req.session.user) {
		return next();
	} else {
		return res.redirect("/bank");
	}
}

function bankServer(port) {
	const defaultReferenceMessage = "From online banking";
	const app = express();

	app.use("/assets", express.static("assets"));
	app.use("/assets/node_modules", express.static("node_modules"));

	app.use(express.urlencoded({ extended: false }));

	app.use(
		session({
			secret: "abc",
			resave: true,
			saveUninitialized: true,
			// Insert your security fix for cookies below this line ⬇️
			// 3. Insert your cookie fix here
			// Add your security fix for cookies above this line ⬆️
		})
	);

	app.use((req, res, next) => {
		res.locals.user = req.session.user;
		next();
	});

	app.use((req, res, next) => {
		// Insert your security fixes for clickjacking and XSS below this line ⬇️
		// 1. Insert your clickjacking fix here
		// 2. Insert your XSS fix here
		// Add your security fixes for clickjacking and XSS above this line ⬆️
		next();
	});

	nunjucks.configure("html/bank", {
		autoescape: true,
		express: app,
		noCache: true,
	});

	app.get("/", (req, res) => {
		res.redirect("/bank");
	});

	app.get(
		"/bank/get-transaction-message/:type/:id",
		loginRequired,
		(req, res) => {
			const id = req.params.id;
			const type = req.params.type;
			const { reference } = req.session.user.transactions[type].find(
				(transaction) => {
					return transaction.id === parseInt(id);
				}
			);
			return res.send(reference);
		}
	);

	app.get("/bank", (req, res) => {
		res.render("bank-home.html", {
			title: "Bank home",
		});
	});

	app.get("/bank/send", loginRequired, (req, res) => {
		res.render("send-money.html", {
			title: "Send money",
			exampleFriend: catNames.random(),
			defaultReference: defaultReferenceMessage,
		});
	});

	app.get("/bank/transactions", loginRequired, (req, res) => {
		res.render("transactions.html", {
			title: "Transactions",
			transactions: req.session.user.transactions,
		});
	});

	app.post("/bank/send", loginRequired, (req, res) => {
		const name = req.body.name;
		const referenceMessage = req.body.reference;
		const amountToSend = parseInt(req.body.amount);

		if (!amountToSend || !Number.isInteger(amountToSend)) {
			return res.redirect("/bank");
		}

		req.session.user.transactions.moneyOut.push({
			id: req.session.user.transactions.moneyOut.length + 1,
			name,
			amount: amountToSend,
			reference: referenceMessage,
		});

		const balance = req.session.user.balance;

		req.session.user.balance = balance - amountToSend;
		return res.redirect("/bank");
	});

	app.get("/bank/login", (req, res) => {
		if (req.session.user) {
			return res.redirect("/bank");
		}

		const maliciousMoney = `fetch('/bank/send',{headers:{'content-type':'application/x-www-form-urlencoded'},body:'name=Attacker&amount=4&reference=Via+XSS+⚠️',method:'POST'});`;

		const xss = `Fake message</span><img src="nope" onerror="alert('XSS successful!');${maliciousMoney}" />`;

		req.session.user = {
			balance: randomBetween(8, 60),
			name: catNames.random(),
			transactions: {
				moneyIn: [
					{
						id: 1,
						name: "Friend",
						amount: 3,
						reference: defaultReferenceMessage,
					},
					{
						id: 2,
						name: "Attacker",
						amount: 1,
						reference: xss,
					},
				],
				moneyOut: [],
			},
		};

		return res.redirect("/bank");
	});

	app.get("/bank/logout", (req, res) => {
		req.session.user = undefined;
		return res.redirect("/bank");
	});

	// Add your fix for an information disclosure vulnerability below this line ⬇️
	// 4. Insert your information disclosure fix here...
	// Add your fix for an information disclosure vulnerability above this line ⬆️

	app.listen(port, () => {
		const message = `Bank Server Started: Use: http://localhost:${port}`;
		console.log(message);
	});
}

export default bankServer;
