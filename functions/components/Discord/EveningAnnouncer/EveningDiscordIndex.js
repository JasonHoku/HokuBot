module.exports.DiscordDaily = async function () {
	const { convert } = require("html-to-text");
	const admin = require("firebase-admin");
	const Discord = require("discord.js");

	var dbData = {};
	var DiscordAPI = "";

	console.log("|D| Running Daily Evening Discord Announcement");
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
				client.login(DiscordAPI);
				// Log When Ready
				loginDiscord();
				async function loginDiscord() {
					return client.on("ready", () => {
						console.log(`|D| Logged in as ${client.user.tag}!`);
						///Find User and Send Message
						// const list = client.users.cache.find(
						// 	(user) => user.username === "JasonHoku"
						// );

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

									// tempKeys.sort((v, i) => {
									// 	// console.log(v, data[v]);
									// 	return null;
									// });

									setTimeout(() => {
										// console.log(client.channels.cache.length);

										client.channels.cache.forEach((channelEl) => {
											if (channelEl.name === "🤖-daily-trends") {
												setTimeout(() => {
													try {
														const googleTrends = require("google-trends-api");
														const GoogleTrends = require("./GoogleTrends");
														//
														GoogleTrends.GoogleTrends(googleTrends, channelEl);
														//
													} catch (error) {
														console.log("googleTrends Error");
														console.log(error);
													}
												}, 1000);

												setTimeout(() => {
													try {
														const TwitterTrends = require("./components/Discord/NoonAnnounce/TwitterTrends");
														TwitterTrends.TwitterTrends(channelEl);
														//
													} catch (error) {
														console.log("googleTrends Error");
														console.log(error);
													}
												}, 2500);
											}
											////////////////////////////////////////////////////
											//////////////     End Daily    ////////////////
											////////////////////////////////////////////////////
										});
									});
								}, 500);
						}
						checkDailyTimer();
					});
				}
			});
	}
	getDBData();
};
