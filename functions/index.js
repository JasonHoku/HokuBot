const { StaticAuthProvider } = require("twitch-auth");
const { ChatClient } = require("twitch-chat-client");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

console.log("Initiating Hoku Bot Framework");

exports.FireFunctionAPI = functions.https.onRequest((req, res) => {
	let twitchClientId = "";
	let twitchClientAccess = "";
	var dbData = {};
	let userID = {};

	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);

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
						//Development block for localhost emulator

						//Begin Auth Comparison
						if (String(gotUID) === String(dbData.Admins[0])) {
							//Successful Admin UID
							res.send(JSON.stringify("Welcome Admin"));
							if (runOnce === 0) {
								//Begin Twitch API Connection & Functions
								async function setAPIsOnline() {
									var db3 = admin.firestore();
									db3.collection("Secrets").doc("MetaData").set(
										{
											TwitchOn: true,
											DiscordOn: true,
											YouTubeOn: true,
											FireConnected: true,
										},
										{ merge: true }
									);
								}
								//Launch Discord API
								// const DiscordTools = require("./components/DiscordTools");
								// DiscordTools.DiscordTools((userID = { userID }));
								// //Launch TwitchAPI API
								// const TwitchTools = require("./components/TwitchTools");
								// TwitchTools.TwitchTools((userID = { userID }));
								// setAPIsOnline();
								//
							} else {
								//
								res.send(JSON.stringify("Welcome User"));
							}
							res.status(200).send();
						} else {
							//
							res.send(JSON.stringify("Bot Already Online"));
						}
					});
			}
			return getDBData();
		});
	} catch (error) {}
});

//Shutdown Function
exports.FireFunctionShutDown = functions.https.onRequest((req, res) => {
	let twitchClientId = "";
	let twitchClientAccess = "";
	var dbData = {};
	let userID = {};
	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);

			async function getDBData() {
				var db = admin.firestore();
				await db
					.collection("Secrets")
					.get()
					.then((snapshot) => {
						snapshot.forEach((doc) => {
							var key = doc.id;
							var data = doc.data();
							data["key"] = key;
							dbData[key] = data;
						});
						if (dbData !== undefined) {
							//Begin Auth Comparison
							if (String(gotUID) === String(dbData.Admins.Key)) {
								//Successful Admin UID
								res.send(JSON.stringify("Shutting Down Via Admin"));

								const authProvider = new StaticAuthProvider(
									twitchClientId,
									twitchClientAccess
								);
								const chatClient = new ChatClient(authProvider, {
									channels: ["JasonHoku"],
								});
								async function setAPIsOffline() {
									var db3 = admin.firestore();
									db3.collection("Secrets").doc("MetaData").set(
										{
											TwitchOn: false,
											DiscordOn: false,
											YouTubeOn: false,
											FireConnected: false,
										},
										{ merge: true }
									);
								}

								chatClient.quit();
								setAPIsOffline();
							} else {
								//Not Admin UID
								res.send(JSON.stringify("No Access For Regular User"));
							}
							res.status(200).send();
						}
					});
			}
			getDBData();
		});
	} catch (error) {}
});

exports.StartTwitchBot = functions.https.onRequest((req, res) => {
	let twitchClientId = "";
	let twitchClientAccess = "";
	var dbData = {};
	let userID = {};

	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);

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
						//Development block for localhost emulator

						//Begin Auth Comparison
						if (String(gotUID) === String(dbData.Admins[0])) {
							if (!dbData.MetaData.TwitchOn) {
								//Successful Admin UID
								res.send(JSON.stringify("Welcome Admin"));
								//Begin Twitch API Connection & Functions
								async function setAPIsOnline() {
									var db3 = admin.firestore();
									db3.collection("Secrets").doc("MetaData").set(
										{
											TwitchOn: true,
										},
										{ merge: true }
									);
								}
								//Launch TwitchAPI API
								// const TwitchTools = require("./components/TwitchTools");
								// TwitchTools.TwitchTools((userID = { userID }));
								// setAPIsOnline();
								//
							} else {
								//
								res.send(JSON.stringify("Bot Already Online"));
							}
							res.status(200).send();
						}
						//
						res.send(JSON.stringify("Welcome User"));
						res.status(200).send();
					});
			}
			return getDBData();
		});
	} catch (error) {}
});

exports.TwitchShutDown = functions.https.onRequest((req, res) => {
	let twitchClientId = "";
	let twitchClientAccess = "";
	var dbData = {};
	let userID = {};
	res.status(200);
	const cors = require("cors")({ origin: true });
	res.set("Access-Control-Allow-Origin", "*");
	res.set("Access-Control-Allow-Headers", "Content-Type");
	try {
		let runOnce = 0;
		//Declare CORs Rules
		const cors = require("cors")({ origin: true });
		res.status(200);
		res.set("Access-Control-Allow-Origin", "*");
		res.set("Access-Control-Allow-Headers", "Content-Type");
		cors(req, res, () => {
			const cors = require("cors")({ origin: true });
			res.status(200);
			res.set("Access-Control-Allow-Origin", "*");
			res.set("Access-Control-Allow-Headers", "Content-Type");
			const gotUID = JSON.parse(req.headers["headertokens"]).uid;
			userID = JSON.parse(req.headers["headertokens"]).uid;
			const gotHeaders = JSON.stringify(req.headers["headertokens"]);

			async function getDBData() {
				var db = admin.firestore();
				await db
					.collection("Secrets")
					.get()
					.then((snapshot) => {
						snapshot.forEach((doc) => {
							var key = doc.id;
							var data = doc.data();
							data["key"] = key;
							dbData[key] = data;
						});
						if (dbData !== undefined) {
							//Begin Auth Comparison
							if (String(gotUID) === String(dbData.Admins.Key)) {
								//Successful Admin UID
								res.send(JSON.stringify("Shutting Down Via Admin"));
								const authProvider = new StaticAuthProvider(
									twitchClientId,
									twitchClientAccess
								);

								const chatClient = new ChatClient(authProvider, {
									channels: ["JasonHoku"],
								});
								async function setAPIsOffline() {
									var db3 = admin.firestore();
									db3.collection("Secrets").doc("MetaData").set(
										{
											TwitchOn: false,
										},
										{ merge: true }
									);
								}

								chatClient.quit();
								setAPIsOffline();
							} else {
								//Not Admin UID
								res.send(JSON.stringify("No Access For Regular User"));
							}
							res.status(200).send();
						}
					});
			}
			getDBData();
		});
	} catch (error) {}
});

exports.oneMinuteInterval = functions.pubsub
	.schedule("every 1 minutes")
	.onRun((context) => {
		let twitchClientId = "";
		let twitchClientAccess = "";
		var genDBData = {};
		var dbData = {};
		var dbData2 = {};
		// Detect FireStoreData
		function buildGeneratedData() {
			// console.log("||| Running Build Data");
			let todoList = "";
			let todoListFin = "";
			let todoListActive = "";
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
					//     console.log("||| Stopping FireStore Public Data Build Interval");

					if (dbData.MetaData.FireConnected) {
						//    console.log("||| Connection True");
						let listArray = [];
						let listArray2 = [];
						let listArray3 = [];
						//    console.log("||| Building GeneratedData");
						//Got Secrets then Build Public Data
						var db = admin.firestore();
						db
							.collection("Users")
							.doc(String(dbData.Admins[0]))
							.get()
							.then((doc) => {
								todoList = JSON.parse(JSON.stringify(doc.data())).Todo;
								todoList.forEach((todo) => listArray.push(String(todo + " ")));
								//
								todoListFin = JSON.parse(JSON.stringify(doc.data())).TodoFin;
								todoListFin.forEach((todo) => listArray2.push(String(todo + " ")));
								//
								todoListActive = JSON.parse(JSON.stringify(doc.data())).TodoActive;
								todoListActive.forEach((todo) => listArray3.push(String(todo + " ")));

								//

								//Got Admin ToDo Now Get Comparisons & Generate
								async function sendGeneratedData() {
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

											//

											//

											// Query APIs And Generate Minutely

											async function getAARootsData() {
												console.log("Running Get AARootsData");
												console.log("Running Get 2");
												const fetch = require("node-fetch");

												console.log("Running Get 2");
												//Emulator local url for development:
												let fetchURL = "";
												const urlLive =
													"https://us-central1-a-a-roots.cloudfunctions.net/getAARootsData";
												fetchURL = urlLive;
												//Send Details

												console.log("Running Get 2");
												const rawResponse = await fetch(fetchURL, {
													method: "post",
													body: JSON.stringify({ X: "XYZ" }),
													headers: {
														"Content-Type": "application/json",
														Accept: "application/json",
														HeaderTokens: JSON.stringify({
															uid: dbData.Admins[0],
														}),
													},
												});
												const content = await rawResponse.json();

												console.log("Running Get 2");
												console.log(content);
												db
													.collection("Public")
													.doc("GeneratedData")
													.set(
														{
															LatestRun: admin.firestore.FieldValue.serverTimestamp(),
															RunCounter: genDBData.GeneratedData.RunCounter + 1,
															GlobalClickData: {
																aARoots: [
																	content,
																	genDBData.GeneratedData.GlobalClickData.aARoots[0],
																],
															},
														},
														{ merge: true }
													);
											}
											getAARootsData();

											async function getMicroHawaiiData() {
												const fetch = require("node-fetch");
												//Emulator local url for development:
												let fetchURL = "";
												const urlLive =
													"https://us-central1-microhawaii-5f97b.cloudfunctions.net/getMicroHawaiiData";
												fetchURL = urlLive;
												//Send Details

												console.log("Running Get 2");
												const rawResponse = await fetch(fetchURL, {
													method: "post",
													body: JSON.stringify({ X: "XYZ" }),
													headers: {
														"Content-Type": "application/json",
														Accept: "application/json",
														HeaderTokens: JSON.stringify({
															uid: dbData.Admins[0],
														}),
													},
												});
												const content = await rawResponse.json();

												console.log("Running Get 2");
												console.log(content);
												db
													.collection("Public")
													.doc("GeneratedData")
													.set(
														{
															LatestRun: admin.firestore.FieldValue.serverTimestamp(),
															RunCounter: genDBData.GeneratedData.RunCounter + 1,
															GlobalClickData: {
																microHawaii: [
																	content,
																	genDBData.GeneratedData.GlobalClickData.microHawaii[0],
																],
															},
														},
														{ merge: true }
													);
											}
											getMicroHawaiiData();

											async function getPonoMapData() {
												console.log("Running Get AARootsData");
												console.log("Running Get 2");
												const fetch = require("node-fetch");

												console.log("Running Get 2");
												//Emulator local url for development:
												let fetchURL = "";
												const urlLive =
													"https://us-central1-ponomap-c8faa.cloudfunctions.net/getPonoMapData";
												fetchURL = urlLive;
												//Send Details

												console.log("Running Get 2");
												const rawResponse = await fetch(fetchURL, {
													method: "post",
													body: JSON.stringify({ X: "XYZ" }),
													headers: {
														"Content-Type": "application/json",
														Accept: "application/json",
														HeaderTokens: JSON.stringify({
															uid: dbData.Admins[0],
														}),
													},
												});
												const content = await rawResponse.json();

												console.log("Running Get 2");
												console.log(content);
												db
													.collection("Public")
													.doc("GeneratedData")
													.set(
														{
															LatestRun: admin.firestore.FieldValue.serverTimestamp(),
															RunCounter: genDBData.GeneratedData.RunCounter + 1,
															GlobalClickData: {
																PonoMap: [
																	content,
																	genDBData.GeneratedData.GlobalClickData.PonoMap[0],
																],
															},
														},
														{ merge: true }
													);
											}
											getPonoMapData();
										});
								}

								sendGeneratedData();
							});
					}
				});
		}
		buildGeneratedData();
	});

// exports.oneHourInterval = functions.pubsub
// 	.schedule("every 60 minutes")
// 	.onRun(() => {
// 		var genDBData = {};
// 		var dbData = {};
// 		let todoList = "";
// 		let todoListFin = "";
// 		var db = admin.firestore();
// 		db
// 			.collection("Secrets")
// 			.get()
// 			.then((snapshot) => {
// 				snapshot.forEach((doc) => {
// 					var key = doc.id;
// 					var data = doc.data();
// 					data["key"] = key;
// 					dbData[key] = data;
// 				});

// 				if (dbData.MetaData.FireConnected) {
// 					//    console.log("||| Connection True");
// 					let listArray = [];
// 					let listArray2 = [];
// 					//    console.log("||| Building GeneratedData");

// 					//Got Secrets then Build Public Data
// 					var db = admin.firestore();
// 					db
// 						.collection("Users")
// 						.doc(String(dbData.Admins[0]))
// 						.get()
// 						.then((doc) => {
// 							todoList = JSON.parse(JSON.stringify(doc.data())).Todo;
// 							todoList.forEach((todo) => listArray.push(String(todo + " ")));
// 							//
// 							todoListFin = JSON.parse(JSON.stringify(doc.data())).TodoFin;
// 							todoListFin.forEach((todo) => listArray2.push(String(todo + " ")));
// 							//Got Admin ToDo Now Generate Text
// 							async function sendGeneratedData() {
// 								db
// 									.collection("Public")
// 									.get()
// 									.then((snapshot2) => {
// 										snapshot2.forEach((doc2) => {
// 											var key = doc2.id;
// 											var data = doc2.data();
// 											data["key"] = key;
// 											genDBData[key] = data;
// 										});

// 										var date = genDBData.DailyYoutube.LastRun.toDate();

// 										if (
// 											Math.round(
// 												(Math.abs(new Date(Date.now()) - new Date(String(date))) / 3600000 -
// 													24) *
// 													10000
// 											) /
// 												10000 >=
// 											0
// 										) {
// 											// const YouTubeTools = require("./components/YouTubeData");
// 											// YouTubeTools.YouTubeTools();
// 										}
// 										//

// 										// const DiscordTools = require("./components/DiscordTools");
// 										// DiscordTools.DiscordTools({ userID: dbData.Admins[0] });
// 									});
// 							}
// 							sendGeneratedData();
// 						});
// 				}
// 			});
// 	});

var hasRanDaily = false;

exports.MorningDailyFun = functions.pubsub
	.schedule("30 07 * * *")
	.timeZone("Pacific/Honolulu")
	.onRun(() => {
		//

		if (!hasRanDaily) {
			hasRanDaily = true;
			setTimeout(() => {
				hasRanDaily = false;
			}, 30000);
			return DailyDiscordAnnounceFunction().then((el) => {
				console.log("NoonDiscord Ran");
				resetDailyTodos();
				//
				//
				async function resetDailyTodos() {
					//
					var db = admin.firestore();
					var dbData = {};
					db
						.collection("ToDoCollection")
						.get()
						.then((snapshot) => {
							snapshot.forEach((doc) => {
								var key = doc.id;
								var data = doc.data();
								data["key"] = key;
								dbData[key] = data;
							});
							//

							if (dbData) {
								// If status repeatable & finished
								// set status to active
								Object.values(dbData).forEach((el) => {
									if (el.status === 4) {
										console.log(el.status);

										var db = admin.firestore();
										db.collection("ToDoCollection").doc(el.title).set(
											{
												status: 3,
												priority: 10,
												timeStamp: admin.firestore.FieldValue.serverTimestamp(),
											},
											{ merge: true }
										);
									}
								});
							}
						});
				}
			});
			async function DailyDiscordAnnounceFunction() {
				try {
					const DiscordDaily = require("./components/Discord/MorningAnnouncer/MorningDiscordIndex");
					DiscordDaily.DiscordDaily();
				} catch (error) {
					console.log(error);
				}
			}

			//
		}
		//
		//
	});

exports.NoonDailyFun = functions.pubsub
	.schedule("03 12 * * *")
	.timeZone("Pacific/Honolulu")
	.onRun(() => {
		//
		if (!hasRanDaily) {
			hasRanDaily = true;
			setTimeout(() => {
				hasRanDaily = false;
			}, 30000);
			return DailyDiscordAnnounceFunction().then((el) => {
				console.log("NoonDiscord Ran");
				console.log(el);
			});
			async function DailyDiscordAnnounceFunction() {
				try {
					const DiscordDaily = require("./components/Discord/NoonAnnounce/NoonDiscordIndex");
					DiscordDaily.DiscordDaily();
				} catch (error) {
					console.log(error);
				}
			}
		}
	});

exports.EveningDailyFun = functions.pubsub
	.schedule("00 19 * * *")
	.timeZone("Pacific/Honolulu")
	.onRun(() => {
		//
		if (!hasRanDaily) {
			hasRanDaily = true;
			setTimeout(() => {
				hasRanDaily = false;
			}, 30000);
			return DailyDiscordAnnounceFunction().then((el) => {
				console.log("Ran Evening Fun");
				console.log(el);
			});
			async function DailyDiscordAnnounceFunction() {
				try {
					const DiscordDaily = require("./components/Discord/EveningAnnouncer/EveningDiscordIndex");
					return DiscordDaily.DiscordDaily().then(() => {
						console.log("Ran Evening Discord");
					});
				} catch (error) {
					console.log(error);
				}
			}
		}
	});

exports.AlwaysOnFunction = functions
	.runWith({ minInstances: 1, maxInstances: 1, memory: "128MB" })
	.pubsub.schedule("16 13 * * *")
	.timeZone("Pacific/Honolulu")
	.onRun(() => {
		//
		DailyDiscordAnnounceFunction();
		async function DailyDiscordAnnounceFunction() {
			try {
				const DiscordAlwaysOnline = require("./components/Discord/DiscordMessageHandler");
				DiscordAlwaysOnline.DiscordAlwaysOnline();
			} catch (error) {
				console.log(error);
			}
		}
	});
