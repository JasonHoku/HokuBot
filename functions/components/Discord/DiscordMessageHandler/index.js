module.exports.DiscordAlwaysOnline = async function () {
	const admin = require("firebase-admin");
	try {
		if (!admin.app.length < 1) admin.initializeApp();
	} catch (error) {}

	const Discord = require("discord.js");
	// const Canvas = require("canvas");
	var dbData = {};
	var DiscordAPI = "";

	console.log("|D| Booting Discord Always On Manager");

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

				DiscordAPI = String(dbData.APIKeys.DiscordAPI);
				//Begin Development With ENV Variables
				let client = new Discord.Client();

				client.options.restRequestTimeout = 30000;
				//Login To DiscordAP
				console.log("|D| Discord Testing Logged-In");
				console.log(dbData.MetaData.DiscordCheckIn);
				console.log(
					parseInt(parseInt(new Date().getTime() - dbData.MetaData.DiscordCheckIn))
				);

				if (client.user) {
					console.log(client.user.tag);
				} else {
					// Log When Ready
					console.log("No User Found");
					loginDiscord();
					if (
						parseInt(new Date().getTime() - dbData.MetaData.DiscordCheckIn) >
						1000 * 60
					) {
						console.log("Check in is late");
						loginDiscord().then(() => {
							// 	setTimeout(() => {
							// 		client.destroy();
							// 		client.ws.destroy();
							// console.log(client)
							// 	}, 10000);
						});
					}
					async function loginDiscord() {
						console.log("|D| Discord Logging In");

						client.login(DiscordAPI).then((discordRes) => {
							// console.log(discordRes);
						});

						client.on("ready", (el) => {
							console.log(`|D| Logged in as ${client.user.tag}!`);
							///////////////////////////////////////////////
							const list = client.users.cache.find(
								(user) => user.username === "Jahoku"
							);
							// console.log(list)
							//
							list.send(`Logged In`);
							var resetVar = true;
							setInterval(() => {
								resetVar = !resetVar;

								var date = String(new Date().getTime());
								try {
									// console.log("client.uptime:" + client.uptime);
									// console.log("client.user:" + client.user.tag);
									if (client.uptime) {
										console.log("Service Is Warm at " + date);
										db.collection("Secrets").doc("MetaData").set(
											{
												DiscordCheckIn: date,
											},
											{ merge: true }
										);
									} else {
										console.log("No UpTime Found");
									}
								} catch (error) {
									console.log("Caught Discord Client Error");
								}
							}, 10000);
							///////////////////////////////////////////////
							client.on("message", (el) => {
								if (el.author.id !== "719591367113703526") {
									//
									if (JSON.stringify(el).length < 2000) {
										//
										const list = client.users.cache.find(
											(user) => user.username === "Jahoku"
										);
										//
										list.send(`Message Data 2: ${JSON.stringify(el)}`);
										//

										setTimeout(() => {
											sendImage();
											async function sendImage() {
												// or with async/await:

												// do something with image

												// 	const background = await Canvas.loadImage(
												// 		"https://firebasestorage.googleapis.com/v0/b/hokubot.appspot.com/o/canvas-plain.078bfbd1.png?alt=media&token=5a2cefe6-92c3-4cd6-85bc-67ec80857f9b"
												// 	);

												const { createCanvas, loadImage } = require("canvas");
												const myimg = await loadImage(
													"https://firebasestorage.googleapis.com/v0/b/hokubot.appspot.com/o/canvas-plain.078bfbd1.png?alt=media&token=5a2cefe6-92c3-4cd6-85bc-67ec80857f9b"
												);
												const canvas = createCanvas(700, 250);
												const context = canvas.getContext("2d");

												context.drawImage(myimg, 0, 0, canvas.width, canvas.height);

												context.font = "28px sans-serif";
												context.fillStyle = "#ffffff";
												context.fillText(
													el.author.username + ":",
													canvas.width / 2.5,
													canvas.height / 3.5
												);

												context.fillStyle = "#ffffff";
												context.fillText(
													`${el.cleanContent}!`,
													canvas.width / 2.5,
													canvas.height / 1.8
												);

												// const avatar = Canvas.loadImage(
												// 	interaction.user.displayAvatarURL({ format: "jpg" })
												// );
												// context.drawImage(avatar, 25, 25, 200, 200);

												const { MessageAttachment } = require("discord.js");
												const attachment = new MessageAttachment(
													canvas.toBuffer(),
													"profile-image.png"
												);

												list.send({ files: [attachment] });

												// console.log(JSON.parse(el).authorID)
												// console.log(el.author.id);
												// console.log(el.cleanContent);
											}
										}, 3500);
									} else {
										// console.log(JSON.stringify(el));
									}
								}
							});
						});
					}
				}
			});
	}
	getDBData().then(() => {
		console.log("Finished");
	});
};
