module.exports.MorningDiscordDaily = async function () {
	const { convert } = require("html-to-text");
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

						setTimeout(() => {
							const list = client.users.cache
								.find((user) => user.username === "JahHoku")
								.send("XYZ");
							console.log(list);
						}, 50000);
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

									// tempKeys.sort((v, i) => {
									// 	// console.log(v, data[v]);
									// 	return null;
									// });

									setTimeout(() => {
										// console.log(client.channels.cache.length);

										const fetch = require("node-fetch");
										// client.channels.cache.forEach((channelEl) => {
										// 	////////////////////////////////////////////////////
										// 	//////////////     Daily Word    /////////////////
										// 	////////////////////////////////////////////////////
										// 	if (channelEl.name === "🤖-daily-words") {
										// 		setTimeout(() => {
										// 			//
										// 			try {
										// 				const WordOfTheDay = require("./WordOfTheDay");
										// 				WordOfTheDay.WordOfTheDay(fetch, convert, channelEl);
										// 			} catch (error) {
										// 				console.log("Daily Word Error");
										// 				console.log(error);
										// 			}
										// 			//
										// 		}, 1500);
										// 	}

										// 	////////////////////////////////////////////////////
										// 	//////////////     Daily Quote    /////////////////
										// 	////////////////////////////////////////////////////
										// 	if (channelEl.name === "🤖-daily-quotes") {
										// 		setTimeout(() => {
										// 			//
										// 			try {
										// 				const QuoteOfTheDay = require("./QuoteOfTheDay");
										// 				QuoteOfTheDay.QuoteOfTheDay(channelEl);
										// 			} catch (error) {
										// 				console.log("Daily Quote Error");
										// 				console.log(error);
										// 			}
										// 			//
										// 		}, 3000);
										// 	}

										// 	///////////////////////////////////////////////////
										// 	//////////////     Daily Stats    /////////////////
										// 	///////////////////////////////////////////////////
										// 	if (channelEl.name === "🤖-daily-stats") {
										// 		setTimeout(() => {
										// 			try {
										// 				const FirebaseStats = require("./FirebaseStats");
										// 				FirebaseStats.FirebaseStats(channelEl, genDBData);
										// 			} catch (error) {
										// 				console.log("Fire Stats Error");
										// 				console.log(error);
										// 			}
										// 		}, 4500);
										// 	}

										// 	////////////////////////////////////////////////////
										// 	//////////////     Daily Trends    /////////////////
										// 	////////////////////////////////////////////////////
										// 	if (channelEl.name === "🤖-daily-trends") {
										// 		setTimeout(() => {
										// 			try {
										// 				const googleTrends = require("google-trends-api");
										// 				const GoogleTrends = require("./GoogleTrends");
										// 				//
										// 				GoogleTrends.GoogleTrends(googleTrends, channelEl);
										// 				//
										// 			} catch (error) {
										// 				console.log("googleTrends Error");
										// 				console.log(error);
										// 			}
										// 		}, 6000);
										// 	}
										// 	////////////////////////////////////////////////////
										// 	//////////////     Daily Weather    ////////////////
										// 	////////////////////////////////////////////////////
										// 	if (channelEl.name === "🤖-daily-weather") {
										// 		setTimeout(() => {
										// 			//

										// 			try {
										// 				const DailyWeather = require("./DailyWeather");
										// 				//
										// 				 DailyWeather.DailyWeather(
										// 					channelEl,
										// 					dbData.APIKeys.WeatherAPI
										// 				);
										// 			} catch (error) {
										// 				console.log("Daily Weather Error");
										// 				console.log(error);
										// 			}
										// 			//

										// 		}, 6000);
										// 	}

										// 	////////////////////////////////////////////////////
										// 	//////////////     End Daily    ////////////////
										// 	////////////////////////////////////////////////////
										// });
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
