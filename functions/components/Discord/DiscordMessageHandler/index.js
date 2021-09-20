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
						var counter = 0;
						setInterval(() => {
							counter++;
							const list = client.users.cache
								.find((user) => user.username === "JahHoku")
								.send(`Count ${counter}`);
							console.log(list);
						}, 60000);
						///////////////////////////////////////////////
						async function checkDailyTimer() {
							var genDBData = {};
							await db
								.collection("Public")
								.get()
								.then((snapshot2) => {
									snapshot2.forEach((doc2) => {
										var key = doc2.id;
										var data = doc2.data();
										data["key"] = key;
										genDBData[key] = data;
									});

									// Get Latest 1Minute Generated Public Data

									db.collection("Public").doc("DailyDiscord").set(
										{
											AAR: genDBData.GeneratedData.GlobalClickData.aARoots,
											PM: genDBData.GeneratedData.GlobalClickData.PonoMap,
											MH: genDBData.GeneratedData.GlobalClickData.microHawaii,
										},
										{ merge: true }
									);
								});
						}
						checkDailyTimer();
					});
				}
			});
	}
	getDBData();
};
