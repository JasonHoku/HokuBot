module.exports.DiscordDailyAnnouncer = function () {
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
				const data = [];
				//Login To DiscordAPI
				client.login(DiscordAPI);
				// Log When Ready
				client.on("ready", () => {
					console.log(`|D| Logged in as ${client.user.tag}!`);
					///Find User and Send Message
					const list = client.users.cache.find(
						(user) => user.username === "JasonHoku"
					);

					async function checkDailyTimer() {
						var genDBData = {};
						var listArray = [];
						var listArray2 = [];
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

								var date = genDBData.DailyDiscord.LastRun.toDate();
								var tempKeys = Object.keys(genDBData.GeneratedData.GlobalClickData);

								tempKeys.sort((v, i) => {
									// console.log(v, data[v]);
									return null;
								});

								setTimeout(() => {
									// console.log(client.channels.cache.length);

									const fetch = require("node-fetch");
									client.channels.cache.forEach((channelEl) => {
										////////////////////////////////////////////////////
										//////////////     Daily Word    /////////////////
										////////////////////////////////////////////////////
										if (channelEl.name === "🤖-daily-words") {
											setTimeout(() => {
												//

												const WordOfTheDay = require("./DailyAnnouncer/WordOfTheDay");
												WordOfTheDay.WordOfTheDay(fetch, convert, channelEl);
												//
											}, 3000);
										}

										////////////////////////////////////////////////////
										//////////////     Daily Quote    /////////////////
										////////////////////////////////////////////////////
										if (channelEl.name === "🤖-daily-quotes") {
											setTimeout(() => {
												//
												const QuoteOfTheDay = require("./DailyAnnouncer/QuoteOfTheDay");
												QuoteOfTheDay.QuoteOfTheDay(channelEl);

												//
											}, 4000);
										}

										///////////////////////////////////////////////////
										//////////////     Daily Stats    /////////////////
										///////////////////////////////////////////////////
										if (channelEl.name === "🤖-daily-stats") {
											setTimeout(() => {
												const FirebaseStats = require("./DailyAnnouncer/FirebaseStats");
												FirebaseStats.FirebaseStats(channelEl, genDBData);
											}, 5000);
										}

										////////////////////////////////////////////////////
										//////////////     Daily Trends    /////////////////
										////////////////////////////////////////////////////
										if (channelEl.name === "🤖-daily-trends") {
											setTimeout(() => {
												const googleTrends = require("google-trends-api");
												const GoogleTrends = require("./DailyAnnouncer/GoogleTrends");
												//
												GoogleTrends.GoogleTrends(googleTrends, channelEl);
												//
											}, 5000);
										}
										////////////////////////////////////////////////////
										//////////////     Daily Weather    ////////////////
										////////////////////////////////////////////////////
										if (channelEl.name === "🤖-daily-weather") {
											setTimeout(() => {
												//

												const DailyWeather = require("./DailyAnnouncer/DailyWeather");
												//
												DailyWeather.DailyWeather(channelEl, dbData.APIKeys.WeatherAPI);
												//
											}, 6000);
										}

										////////////////////////////////////////////////////
										//////////////     End Daily    ////////////////
										////////////////////////////////////////////////////
									});
								});
							}, 2500);
					}
					checkDailyTimer();
					//
				});
			});
	}
	getDBData();
	return null;
};
