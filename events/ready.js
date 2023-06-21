const { Events } = require('discord.js');
const mysql = require('mysql');
const config = require('../Configurations/bdd');

module.exports = {
	name: Events.ClientReady,
	once: false,
	execute(client) {
		const db = mysql.createConnection(config);
		db.connect(function (err) {

			if (err) console.log(err);
			console.log("Base de données connectée avec succès !");
		}),
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};

