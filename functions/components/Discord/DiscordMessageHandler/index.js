module.exports.DiscordAlwaysOnline = async function () {
	const admin = require("firebase-admin");
	const Discord = require("discord.js");

	var dbData = {};
	var DiscordAPI = "";

	console.log("|D| Running Daily Discord Announcement");
	async function getDBData() {
		var db = admin.firestore();
		db
			.collection("Secrets")
			.get()
			.then((snapshot) => {
				snapshot.forEach((doc) => {
					var key = doc.id;
					var data = doc.data();
					data["key"] = key;
					dbData[key] = data;
				});
				DiscordAPI = String(dbData.APIKeys.DiscordAPI);
				//Begin Development With ENV Variables
				const client = new Discord.Client();
				//Login To DiscordAP
				console.log("|D| Discord Logging In");
				// response.send("LoginRes1");
				client.login(DiscordAPI).then((discordRes) => {
					console.log(discordRes);
				});
				// Log When Ready
				loginDiscord();
				async function loginDiscord() {
					client.on("ready", () => {
						console.log(`|D| Logged in as ${client.user.tag}!`);
						///////////////////////////////////////////////
						var resetVar = true;
						setInterval(() => {
							resetVar = !resetVar;
						}, 60000);
						///////////////////////////////////////////////

						client.on("message", (el) => {
							if (JSON.stringify(el).length < 2000) {
								const list = client.users.cache.find(
									(user) => user.username === "JahHoku"
								);
								list.send(`MessageData ${JSON.stringify(el)}`);
							} else {
								console.log(JSON.stringify(el));
							}
						});
					});
				}
			});
	}
	getDBData();
};
