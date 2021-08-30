module.exports.TwitchTools = async function (props) {
	//Connect To Twitch
	const { RefreshableAuthProvider } = require("twitch-auth");
	const { StaticAuthProvider } = require("twitch-auth");
	const { ChatClient } = require("twitch-chat-client");

	const admin = require("firebase-admin");

	const commandsList = [
		"!stats ",
		"!todo ",
		"!discord ",
		"!cra ",
		"!github ",
		"!firebase ",
		"!tts ",
	];

	let twitchClientSecret = "";
	let twitchClientId = "";
	let twitchClientAccess = "";
	let twitchClientRefresh = "";
	var dbData = {};
	let userID = props.userID;

	console.log("|T| Running Twitch API");
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

				twitchClientId = String(dbData.APIKeys.TwitchID);
				twitchClientAccess = String(dbData.APIKeys.TwitchAccess);
				twitchClientSecret = String(dbData.APIKeys.TwitchSecret);
				twitchClientRefresh = String(dbData.APIKeys.TwitchRefresh);

				if (dbData.MetaData.TwitchOn === false) {
					async function setTwitchOnline() {
						var db3 = admin.firestore();
						db3
							.collection("Secrets")
							.doc("MetaData")
							.set({ TwitchOn: true }, { merge: true });
					}
					setTwitchOnline();
				}
				const clientId = twitchClientId;
				const clientSecret = twitchClientSecret;

				const tokenData = {
					accessToken: twitchClientAccess,
					refreshToken: twitchClientRefresh,
					expiryTimestamp: 0,
				};

				const authProvider = new RefreshableAuthProvider(
					new StaticAuthProvider(clientId, tokenData.accessToken),
					{
						clientSecret,
						refreshToken: tokenData.refreshToken,
						expiry:
							tokenData.expiryTimestamp === null
								? null
								: new Date(tokenData.expiryTimestamp),
						onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
							const newTokenData = {
								accessToken,
								refreshToken,
								expiryTimestamp: expiryDate === null ? null : expiryDate.getTime(),
							};
							var db3 = admin.firestore();
							db3.collection("Secrets").doc("APIKeys").set(
								{
									TwitchAccess: newTokenData.accessToken,
									TwitchRefresh: newTokenData.refreshToken,
									TwitchTokenExpire: newTokenData.expiryTimestamp,
								},
								{ merge: true }
							);
						},
					}
				);

				console.log("|T| Joining Channel ");

				const chatClient = new ChatClient(authProvider, {
					channels: ["JasonHoku"],
				});

				try {
					chatClient.connect();
				} catch (error) {
					console.log(error);
				}

				var db3 = admin.firestore();
				db3
					.collection("Secrets")
					.doc("MetaData")
					.set({ TwitchOn: true }, { merge: true });

				//begin detection of TwitchOnOff

				chatClient.onMessage((channel, user, message) => {
					console.log(message);
					async function addCount() {
						var db = admin.firestore();
						db
							.collection("Public")
							.doc("RunCounter")
							.get()
							.then((doc) => {
								console.log("|T| Adding Count:" + doc.data());
								db
									.collection("Public")
									.doc("RunCounter")
									.set({ count: parseInt(doc.data().count) + 1 });
							});
					}
					if (message === "!ping") {
						addCount();
						chatClient.say(channel, "Pong!");
					} else if (message === "!dice") {
						addCount();
						const diceRoll = Math.floor(Math.random() * 6) + 1;
						chatClient.say(channel, `@${user} rolled a ${diceRoll}`);
					} else if (message === "!stats") {
						console.log(message, channel);
						addCount();
						let todoList = [];
						let listArray = [];
						async function readStats() {
							//Reading Stats from UserDB
							console.log("|T| Reading Users Stats");
							var db = admin.firestore();
							db
								.collection("Users")
								.doc(String(userID.userID))
								.get()
								.then((doc) => {
									todoList = JSON.parse(JSON.stringify(doc.data())).Todo;
									todoList.forEach((todo) => listArray.push(todo));
								});

							setTimeout(() => {
								chatClient.say(
									channel,
									`${commandsList.length} Commands: ${commandsList}`
								);
							}, 1500);
							setTimeout(() => {
								chatClient.say(channel, `${listArray.length} Goals @ ${"!todo"}`);
							}, 3000);
						}
						readStats();
					} else if (message === "!discord") {
						addCount();
						chatClient.say(channel, `https://discord.gg/euxY54d`);
					} else if (message === "!reactiflux") {
						addCount();
						chatClient.say(channel, `https://discord.gg/JStWzRV3`);
					} else if (message === "!github") {
						addCount();
						chatClient.say(channel, `http://github.com/JasonHoku/`);
					} else if (message === "!firebase") {
						addCount();
						chatClient.say(channel, `http://github.com/JasonHoku/`);
					} else if (message === "!cra") {
						addCount();
						chatClient.say(channel, `https://create-react-app.dev/`);
					}
					if (String(message).includes("!tts")) {
						console.log("|T| Running TTS" + message);
						let splittedMessage = String(message).split(" ");
						console.log(splittedMessage[0]);
						if (splittedMessage[0].includes("!tts")) {
							if (splittedMessage[1]) {
								// Convert Words To Array & Remove !tts
								let gotTTSString;
								var db = admin.firestore();
								db
									.collection("Public")
									.doc("GeneratedData")
									.get()
									.then((doc) => {
										gotTTSString = JSON.parse(JSON.stringify(doc.data())).TTSString;
										db.collection("Public").doc("GeneratedData").set(
											{
												LatestRun: admin.firestore.FieldValue.serverTimestamp(),
												TTSString: message,
											},
											{ merge: true }
										);
										addCount();
									});
							}
						}
					}
					//Todo Command
					if (String(message).includes("!todo")) {
						let todoList;
						let listArray = [];

						var db = admin.firestore();
						db
							.collection("Users")
							.doc(String(userID.userID))
							.get()
							.then((doc) => {
								todoList = JSON.parse(JSON.stringify(doc.data())).Todo;
								todoList.forEach((todo) => listArray.push(todo));

								db.collection("Public").doc("GeneratedData").set(
									{
										LatestRun: admin.firestore.FieldValue.serverTimestamp(),
										ToDoList: todoList,
									},
									{ merge: true }
								);

								addCount();
								//
								//Split !todo Message
								let splittedMessage = String(message).split(" ");
								if (splittedMessage[1] === "add") {
									//
									//Todo Add !todo add
									async function runTodoAdd() {
										let todoList = "";
										let listArray = [];
										//query database for todo
										var db = admin.firestore();
										db
											.collection("Users")
											.doc(String(userID.userID))
											.get()
											.then((doc) => {
												todoList = JSON.parse(JSON.stringify(doc.data())).Todo;
												todoList.forEach((todo) => listArray.push(todo));
												//join database todo to message add
												listArray.push(String(splittedMessage[2]));
												//set joined to database
												db
													.collection("Users")
													.doc(String(userID.userID))
													.set({ Todo: listArray }, { merge: true });
											});
										chatClient.say(channel, `${splittedMessage[2]} Added!`);
									}
									runTodoAdd();
								}
								//remove todo item !todo fin X
								if (splittedMessage[1] === "fin") {
									let todoList = "";
									let listArray = [];
									let removedTodoList = "";
									let removedListArray = [];
									let uniqueListArray = [];
									let newJoinedListArray = [];
									async function runTodoRemove() {
										var db = admin.firestore();

										// Remove from current Todo
										db
											.collection("Users")
											.doc(String(userID.userID))
											.get()
											.then((doc) => {
												todoList = JSON.parse(JSON.stringify(doc.data())).Todo;

												// Detect if in Todo
												todoList.forEach((todo) => {
													if (!String(todo).includes(splittedMessage[2])) {
														if (todo != " ") {
															listArray.push(todo);
															//set new array
															db
																.collection("Users")
																.doc(String(userID.userID))
																.update({ Todo: listArray });
														}
													}
												});
												//Development
												//Add to FinTodo
												//Query FinTodo
												db
													.collection("Users")
													.doc(String(userID.userID))
													.get()
													.then((doc) => {
														removedTodoList = JSON.parse(JSON.stringify(doc.data())).TodoFin;
														//Create Unique Set From TodoFin Array
														uniqueListArray = [...new Set(removedTodoList)];
														//Apply message[2] to array
														uniqueListArray.push(splittedMessage[2]);
														db
															.collection("Users")
															.doc(String(userID.userID))
															.set({ TodoFin: uniqueListArray }, { merge: true });
														chatClient.say(
															channel,
															`${splittedMessage[2]} finished! ${uniqueListArray.length} Completed.`
														);
													});
											});
									}
									let joinArrays = {
										List: [],
										RemovedList: [],
									};
									joinArrays.RemovedList.push(splittedMessage[2]);
									runTodoRemove();
								} else if (message === "!todo") {
									console.log("Todo Echo Begin");
									//run todo echo stats
									// console.log(todoList);
									// console.log(listArray);'

									// If Todo List Characters Too Long, Split
									if (String(listArray).length > 450) {
										let splittedTextOverflowArray = [];

										splittedTextOverflowArray.push(String(listArray).substring(0, 450));
										splittedTextOverflowArray.push(String(listArray).substring(450));

										chatClient.say(
											"JasonHoku",
											`${listArray.length} Todo Items ${splittedTextOverflowArray[0]} `
										);

										setTimeout(() => {
											chatClient.say(
												"JasonHoku",
												`${listArray.length} Todo Items ${splittedTextOverflowArray[1]}`
											);
										}, 1500);
									} else {
										setTimeout(() => {
											chatClient.say(
												"JasonHoku",
												`${listArray.length} ToDos: ${listArray}`
											);
										}, 1500);
									}
									addCount();
								}
							});

						// Detect FireStoreData
						//   function buildGeneratedData() {
						//     addCount();
						//     let todoList = "";
						//     let listArray = [];
						//     var dbData2 = {};
						//     var db = admin.firestore();
						//     db.collection("Secrets")
						//       .get()
						//       .then((snapshot) => {
						//         snapshot.forEach((doc) => {
						//           var key = doc.id;
						//           var data = doc.data();
						//           data["key"] = key;
						//           dbData[key] = data;
						//         });
						//         db.collection("Public")
						//           .get()
						//           .then((snapshot) => {
						//             snapshot.forEach((doc) => {
						//               var key2 = doc.id;
						//               var data2 = doc.data();
						//               data2["key"] = key2;
						//               dbData2[key2] = data2;
						//             });
						//             console.log("|T| Building GeneratedData");
						//             //Got Secrets then Build Public Data
						//             var db = admin.firestore();
						//             db.collection("Users")
						//               .doc(String(dbData.Admins[0]))
						//               .get()
						//               .then((doc) => {
						//                 todoList = JSON.parse(JSON.stringify(doc.data()))
						//                   .Todo;
						//                 todoList.forEach((todo) =>
						//                   listArray.push(String(todo + " "))
						//                 );
						//                 //Got Admin ToDo Now Generate Text

						//                 async function sendGeneratedData() {
						//                   var db2 = admin.firestore();
						//                   db2
						//                     .collection("Public")
						//                     .doc("GeneratedData")
						//                     .set(
						//                       {
						//                         LatestRun: admin.firestore.FieldValue.serverTimestamp(),
						//                         RawText: ` ${
						//                           Date(dbData2.GeneratedData.LatestRun).split(
						//                             "("
						//                           )[0]
						//                         } -@!%!%!@-  ${String(
						//                           parseInt(dbData2.RunCounter.count) + 1
						//                         )}
						// -@!%!%!@-  ${String(listArray).replace(/,/g, " ")}`,
						//                       },
						//                       { merge: true }
						//                     );
						//                 }
						//                 sendGeneratedData();
						//               });
						//           });
						//       });
						//   }
						//   buildGeneratedData();
					}

					chatClient.onSub((channel, user) => {
						chatClient.say(
							channel,
							`Thanks to @${user} for subscribing to the channel!`
						);
					});

					chatClient.onResub((channel, user, subInfo) => {
						chatClient.say(
							channel,
							`Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`
						);
					});

					chatClient.onSubGift((channel, user, subInfo) => {
						chatClient.say(
							channel,
							`Thanks to ${subInfo.gifter} for gifting a subscription to ${user}!`
						);
					});
				});

				function detectTwitchOffOn() {
					console.log("|T| Setting Twitch Detection Interval");
					var DetectTwitchOffOnInterval;
					if (DetectTwitchOffOnInterval) {
						clearInterval(DetectTwitchOffOnInterval);
					}
					DetectTwitchOffOnInterval = setInterval(() => {
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
								console.log("|T| Twitch Connection: " + chatClient.isConnected);

								if (!dbData.MetaData.TwitchOn) {
									async function setTwitchOffline() {
										var db4 = admin.firestore();
										db4
											.collection("Secrets")
											.doc("MetaData")
											.set({ TwitchOn: false }, { merge: true });
									}
									console.log("|T| Connection Quit");
									setTwitchOffline().then(() => {
										clearInterval(DetectTwitchOffOnInterval);
										chatClient.quit();
									});
								}
							});
					}, 15000);
				}
				detectTwitchOffOn();

				function twitchDecaHourlyChatSend() {
					var decaHourlyCounter = 0;
					console.log("|T| Setting Twitch DecaHourly Interval");
					var twitchDecaHourlyChatSendVar;
					if (twitchDecaHourlyChatSendVar) {
						clearInterval(twitchDecaHourlyChatSendVar);
					}
					twitchDecaHourlyChatSendVar = setInterval(() => {
						var docCounter = 0;
						decaHourlyCounter++;
						var db = admin.firestore();
						db
							.collection("Public")
							.get()
							.then((snapshot) => {
								snapshot.forEach((doc) => {
									var key = doc.id;
									var data = doc.data();
									data["key"] = key;
									dbData[key] = data;
									docCounter++;
								});
								if (docCounter > decaHourlyCounter) {
									chatClient.say(
										"JasonHoku",
										dbData.TwitchAnnouncements[decaHourlyCounter]
									);
								} else {
									chatClient.say("JasonHoku", dbData.TwitchAnnouncements[0]);
									decaHourlyCounter = 1;
								}
								// dbData.TwitchAnnouncements.forEach((ele, index) => {
								//   if (index === decaHourlyCounter) {
								//     console.log(ele);
								//
								//   }
								// });

								console.log("|T| Running Announcement " + chatClient.isConnected);
							});
					}, 1000 * 60 * 10);
				}
				twitchDecaHourlyChatSend();
			});
	}
	getDBData();
};
