module.exports.DiscordTools = function (props) {
	const { convert } = require("html-to-text");
	const admin = require("firebase-admin");
	const Discord = require("discord.js");

	var dbData = {};
	var DiscordAPI = "";
	var userID = props.userID;

	console.log("|D| Booting Discord API Bot");
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
				function setDiscordOnline() {
					var db3 = admin.firestore();
					db3
						.collection("Secrets")
						.doc("MetaData")
						.set({ DiscordOn: true }, { merge: true });
				}
				setDiscordOnline();
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

					// client.channels.cache.forEach((channelEl) => {
					// 	console.log(channelEl.name);
					//
					// 	if (channelEl.name === "🤖-bot-feed") {
					// 		channelEl.send("I am HokuBot! Beep.");
					// 	}
					// });

					//

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
									console.log(v, data[v]);
									return null;
								});

								// async function getGMetrics() {
								// 	const monitoring = require("@google-cloud/monitoring");
								// 	// Creates a client
								// 	const client = new monitoring.MetricServiceClient();
								// 	const filter =
								// 		'metric.type="compute.googleapis.com/instance/cpu/utilization"';
								// 	const request = {
								// 		name: client.projectPath("xyz"),
								// 		filter: filter,
								// 		interval: {
								// 			startTime: {
								// 				// Limit results to the last 20 minutes
								// 				seconds: Date.now() / 1000 - 60 * 20,
								// 			},
								// 			endTime: {
								// 				seconds: Date.now() / 1000,
								// 			},
								// 		},
								// 	};
								// 	// Writes time series data
								// 	const [timeSeries] = await client.listTimeSeries(request);
								// 	timeSeries.forEach((data) => {
								// 		console.log(`${data.metric.labels.instance_name}:`);
								// 		data.points.forEach((point) => {
								// 			console.log(JSON.stringify(point.value));
								// 		});
								// 	});
								// }

								// Run Per 12 Hrs
								// if (true){
								if (
									Math.round(
										(Math.abs(new Date(Date.now()) - new Date(String(date))) / 3600000 -
											12) *
											10000
									) /
										10000 >=
									0
								) {
									setTimeout(() => {
										console.log(client.channels.cache.length);

										const fetch = require("node-fetch");
										fetch("https://api.quotable.io/random")
											.then((res) => res.json())
											.then((data) => {
												client.channels.cache.forEach((channelEl) => {
													console.log(channelEl.name);
													if (channelEl.name === "🤖-bot-feed") {
														async function getWordOfDay() {
															await fetch(
																"https://www.merriam-webster.com/word-of-the-day"
															).then((res2) => {
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
								\n**Fresh Inspiration**:${"```"}${
																		data.content
																	}${"```"}📚📚📚📚📚📚📚📚📚📚📚📚📚📚
								\n **Word Of The Day**:${"```"}${text}${"```"}**Pronounced:**${"```"}${text2}${"```"}**Defined:**${"```"}${text3}${"```"}⏹🛑⛔⏹⏱`);
																});
															});
														}
														getWordOfDay();
													}
												});
											});
									}, 2500);
								} else {
									const fetch = require("node-fetch");
									fetch("https://api.quotable.io/random")
										.then((res) => res.json())
										.then((data) => {
											async function getWordOfDay() {
												await fetch("https://www.merriam-webster.com/word-of-the-day").then(
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

															list.send(
																`\n👋👋🏻👋🏼👋🏽👋🏾👋🏿
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
							\n**Fresh Inspiration**:${"```"}${
																	data.content
																}${"```"}📚📚📚📚📚📚📚📚📚📚📚📚📚📚
							\n **Word Of The Day**:${"```"}${text}${"```"}**Pronounced:**${"```"}${text2}${"```"}**Defined:**${"```"}${text3}${"```"}⏹🛑⛔⏹⏱` +
																	"|D| Daily Message Trigger In: " +
																	String(
																		Math.round(
																			(Math.abs(new Date(Date.now()) - new Date(String(date))) /
																				3600000 -
																				12) *
																				10000
																		) / 10000
																	) +
																	" Hours"
															);
														});
													}
												);
											}
											getWordOfDay();
										});
								}

								db
									.collection("Public")
									.doc("GeneratedData")
									.set(
										{
											LatestRun: admin.firestore.FieldValue.serverTimestamp(),
											RawText: ` ${
												Date(genDBData.GeneratedData.LatestRun).split("(")[0]
											} -@!%!%!@-  ${String(parseInt(genDBData.RunCounter.count) + 1)}
														-@!%!%!@-  ${String(listArray).replace(/,/g, " ")} -@!%!%!@-  ${String(
												listArray2
											).replace(/,/g, " ")}`,
										},
										{ merge: true }
									);
							});
					}
					checkDailyTimer();
					//

					// Detect On Message Events + Reply
					client.on("message", (msg) => {
						async function addCount() {
							var db = admin.firestore();
							db
								.collection("Public")
								.doc("RunCounter")
								.get()
								.then((doc) => {
									db
										.collection("Public")
										.doc("RunCounter")
										.set({ count: parseInt(doc.data().count) + 1 });
								});
						}

						data.push(msg);

						if (msg.content === "ping") {
							msg.reply("pong");
						}
						if (msg.content === "!stats") {
							addCount();
							var db = admin.firestore();
							db
								.collection("Public")
								.doc("RunCounter")
								.get()
								.then((doc) => {
									msg.reply(`Run Counter: ${parseInt(doc.data().count) + 1}`);
								});
						}

						if (msg.content.includes("!todo")) {
							let todoList;
							let listArray = [];

							var db = admin.firestore();
							db
								.collection("Users")
								.doc(String(userID))
								.get()
								.then((doc) => {
									todoList = JSON.parse(JSON.stringify(doc.data())).Todo;
									String(todoList)
										.split(",")
										.forEach((todo) => listArray.push(todo));

									db.collection("Public").doc("GeneratedData").set(
										{
											LatestRun: admin.firestore.FieldValue.serverTimestamp(),
											ToDoList: todoList,
										},
										{ merge: true }
									);
								});

							addCount();
							//
							//Split !todo Message
							let splittedMessage = String(msg.content).split(" ");
							if (splittedMessage[1] === "add") {
								//
								//Todo Add !todo add
							}
							//remove todo item !todo fin X
							if (splittedMessage[1] === "fin") {
								async function runTodoRemove() {
									let todoList = "";
									let listArray = [];
									let removedTodoList = "";
									let removedListArray = [];
									let newJoinedListArray = [];

									var db = admin.firestore();

									// Remove from current Todo
									db
										.collection("Users")
										.doc(String(userID))
										.get()
										.then((doc) => {
											todoList = JSON.parse(JSON.stringify(doc.data())).Todo;

											// Detect if in Todo
											todoList.forEach((todo) => {
												if (!String(todo).includes(splittedMessage[2])) {
													if (todo != ",") {
														if (todo != " ") {
															listArray.push(todo);
															//set new array
															db
																.collection("Users")
																.doc(String(userID))
																.update({ Todo: listArray });
														}
													}
												}
											});
											//Development
											//Add to FinTodo
											//Query FinTodo
											db
												.collection("Users")
												.doc(String(userID))
												.get()
												.then((doc) => {
													removedTodoList = JSON.parse(JSON.stringify(doc.data())).TodoFin;
													//Query Join New Fin Item to Fin List
													removedTodoList.forEach((todo) => {
														removedListArray.push(todo);
														//Check for dupes
														removedListArray.forEach((newTodo) => {
															if (!String(splittedMessage[2]).includes(newTodo)) {
																removedListArray.push(splittedMessage[2]);
															}
														});
													});

													msg.reply(`${splittedMessage[2]} Removed!`);
												});
										});
								}

								// const todoList = JSON.parse(
								//   await fs.readFile(
								//     "./liveData/todo.json",
								//     "UTF-8"
								//   )
								// );

								// const listArray = todoList.List;
								// const removedListArray =
								//   todoList.RemovedList;

								// listArray.forEach((element) => {
								//   if (
								//     !element.includes(splittedMessage[2])
								//   ) {
								//     joinArrays.List.push(element);

								//     fs.writeFile(
								//       "./liveData/todo.json",
								//       JSON.stringify(joinArrays, null, 4),
								//       "UTF-8"
								//     );
								//   }
								// });

								// removedListArray.forEach((element) => {
								//   joinArrays.RemovedList.push(element);

								//   fs.writeFile(
								//     "./liveData/todo.json",
								//     JSON.stringify(joinArrays, null, 4),
								//     "UTF-8"
								//   );
								// });

								runTodoRemove().then(msg.reply(`${splittedMessage[2]} Finished!`));
							} else {
								if (msg.content === "!todo") {
									//run todo echo stats
									async function runTodo() {
										addCount();
										async function readTodo() {
											// console.log(todoList);
											// console.log(listArray);
											setTimeout(() => {
												msg.reply(`${listArray.length} ToDos: ${listArray}`);
											}, 1500);
										}
										readTodo();
									}
									runTodo();
								}
							}
						}
					});
				});

				//
				function detectDiscordOffOn() {
					if (detectDiscordOffOnInterval) {
						clearInterval(detectDiscordOffOnInterval);
					}
					var detectDiscordOffOnInterval;
					detectDiscordOffOnInterval = setInterval(() => {
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
								if (client && client.user)
									console.log("|D| Discord Connection: " + client.user.bot);
								if (!dbData.MetaData.DiscordOn) {
									if (client && client.user) client.destroy();
									if (client && client.user)
										console.log("|D| Quitting Discord Connection: " + client.user.bot);
									async function setDiscordOffline() {
										var db4 = admin.firestore();
										db4
											.collection("Secrets")
											.doc("MetaData")
											.set({ DiscordOn: false }, { merge: true });
									}
									if (!dbData.MetaData.DiscordOn) {
										console.log("|D| Discord Connection Quit");
										setDiscordOffline().then(() => {
											clearInterval(detectDiscordOffOnInterval);
											client.destroy();
										});
									}
								}
							});
					}, 60000);
				}
				detectDiscordOffOn();
			});
	}
	getDBData();
};
