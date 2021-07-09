module.exports.DiscordTools = function (props) {
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
