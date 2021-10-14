module.exports.DiscordAlwaysOnline = async function () {
	const admin = require("firebase-admin");
	const Discord = require("discord.js");
	const Canvas = require("canvas");
	var dbData = {};
	var DiscordAPI = "";

	console.log("|D| Booting Discord Always On Manager");

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
				let client = new Discord.Client();
				//Login To DiscordAP
				console.log("|D| Discord Logging In");
				// response.send("LoginRes1");

				// Log When Ready
				loginDiscord().then(() => {
					// 	setTimeout(() => {
					// 		client.destroy();
					// 		client.ws.destroy();
					// console.log(client)
					// 	}, 10000);
				});
				async function loginDiscord() {
					client.login(DiscordAPI).then((discordRes) => {
						// console.log(discordRes);
					});

					client.on("ready", (el) => {
						console.log(`|D| Logged in as ${client.user.tag}!`);
						///////////////////////////////////////////////
						var resetVar = true;
						setInterval(() => {
							resetVar = !resetVar;
							try {
								// console.log("client.uptime:" + client.uptime);
								// console.log("client.user:" + client.user.tag);
								if (client.uptime) {
									console.log("Uptime True");
								} else {
									console.log("No UpTime Found");
								}
							} catch (error) {
								console.log("Caught Discord Client Error");
							}
						}, 30000);
						///////////////////////////////////////////////
						client.on("message", (el) => {
							if (el.author.id !== "719591367113703526") {
								//
								if (JSON.stringify(el).length < 2000) {
									//
									const list = client.users.cache.find(
										(user) => user.username === "JahHoku"
									);
									//
									list.send(`Message Data 2: ${JSON.stringify(el)}`);
									//

									setTimeout(() => {
										const canvas = Canvas.createCanvas(700, 250);
										const context = canvas.getContext("2d");

										sendImage();
										async function sendImage() {
											const background = await Canvas.loadImage(
												"https://microhawaii.com/logo.png"
											);
											context.drawImage(background, 0, 0, canvas.width, canvas.height);
										}

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

										context.beginPath();
										context.arc(125, 125, 100, 0, Math.PI * 2, true);
										context.closePath();
										context.clip();

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
									}, 3500);
								} else {
									// console.log(JSON.stringify(el));
								}
							}
						});
					});
				}
			});
	}
	getDBData();
};
