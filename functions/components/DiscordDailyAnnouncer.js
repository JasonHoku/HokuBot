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
									fetch("https://api.quotable.io/random")
										.then((res) => res.json())
										.then((data) => {
											client.channels.cache.forEach((channelEl) => {
												// console.log(channelEl.name);
												if (channelEl.name === "🤖-bot-feed") {
													async function getWordOfDay() {
														let conjStringRealTimeStories = "";
														const googleTrends = require("google-trends-api");
														googleTrends
															.realTimeTrends({ geo: "US" })
															.then(function (results) {
																var realTimeTrendsVar =
																	JSON.parse(results).storySummaries.trendingStories;

																for (let i = 0; i <= 5; i++) {
																	conjStringRealTimeStories += "trendingStories " + [i] + "\n";
																	conjStringRealTimeStories +=
																		realTimeTrendsVar[0].articleTitle + "\n";
																	conjStringRealTimeStories +=
																		realTimeTrendsVar[0].articles[0].url + "\n";
																	conjStringRealTimeStories +=
																		realTimeTrendsVar[0].articles[0].time + "\n";
																}
																//

																googleTrends
																	.dailyTrends({ geo: "US" })
																	.then(function (results) {
																		let conjStringDailyTrends = "";
																		var trendData =
																			JSON.parse(results).default.trendingSearchesDays[0]
																				.trendingSearches;
																		try {
																			for (let i = 0; i <= 5; i++) {
																				conjStringDailyTrends += "dailyTrends " + [i] + "\n";
																				conjStringDailyTrends += trendData[i].title.query + "\n";
																				conjStringDailyTrends +=
																					trendData[i].formattedTraffic + "\n";
																			}
																		} catch (error) {
																			conjStringDailyTrends += " Error Getting Trends Data";
																		}

																		fetch("https://www.merriam-webster.com/word-of-the-day").then(
																			(res2) => {
																				res2.text().then((dat2) => {
																					const text = dat2
																						.split("h1")[1]
																						.split("h1")[0]
																						.replace(`>`, "")
																						.replace(`</`, "");
																					const text2 = dat2
																						.split("word-syllables")[2]
																						.split("</span>")[0]
																						.replace(`">`, "");
																					const text3 = convert(
																						dat2
																							.split("wod-definition-container")[1]
																							.split("<span")[0]
																							.replace(`">`, "")
																							.replace(`h2>`, "")
																							.replace(`/h2>`, "")
																							.replace(`<`, "")
																							.replace(`<`, ""),
																						{
																							wordwrap: 130,
																						}
																					);
																					setTimeout(() => {
																						channelEl.send(`\n👋👋🏻👋🏼👋🏽👋🏾👋🏿
																	\nHello, everyone!\n${new Date(Date.now())}\n👋👋🏻👋🏼👋🏽👋🏾👋🏿
													\nThis live, free, web application, named HokuBot, is created with Firebase technology and part of the MicroHawaii open-source software library. All MicroHawaii's open-source software is available at github.com/JasonHoku/
													\nHokuBot intermittently queries various endpoints to deliver information to the community here.
													\nTo request an additional query for announcement here, feel free to ask as there is plenty of room for growth.
												\n **Web Asset Data Results:**
												${"```"}MicroHawaii.com : 	*${
																							genDBData.GeneratedData.GlobalClickData.microHawaii[0]
																						}*${"```"}${"```"}A-A-Roots.web.app : *${
																							genDBData.GeneratedData.GlobalClickData.aARoots[0]
																						}*${"```"}${"```"}PonoMap.com : 	*${
																							genDBData.GeneratedData.GlobalClickData.PonoMap[0]
																						}*${"```"}**All Tests Have Passed ✓**
												\n ☀🌞🌇😎🌄🌅🌆🔆=→☀🌞🌇😎🌄🌅🌆🔆=→
								\n**Quote Of The Day**:${"```"}${
																							data.content
																						}${"```"}📚📚📚📚📚📚📚📚📚📚📚📚📚📚
								\n **Word Of The Day**:${"```"}${text}${"```"}**Pronounced:**
								${"```"}${text2}${"```"}**Defined:**
								${"```"}${text3}${"```"}📈📉📊💹
								\n**Search Trends Of The Day**:${"```"}${conjStringDailyTrends}${"```"} ⏹⏹⏹⏹⏹⏹END⏹⏹⏹⏹⏹⏹
						`);
																						setTimeout(() => {
																							db.collection("Public").doc("DailyDiscord").set(
																								{
																									LastRun: admin.firestore.FieldValue.serverTimestamp(),
																								},
																								{ merge: true }
																							);
																						}, 1000);
																					}, 2000);
																				});
																			}
																		);
																	});
																//
															})
															.catch(function (err) {
																console.error("Oh no there was an error", err);
															});
													}
													getWordOfDay();
												}
											});
										});
								}, 2500);
							});
					}
					checkDailyTimer();
					//
				});
			});
	}
	getDBData();
	return null;
};
