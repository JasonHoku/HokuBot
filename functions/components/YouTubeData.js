module.exports.YouTubeTools = async function (props) {
	/// Not Yet Implemented
	console.log("|Y| Running YouTube API");
	const { YTSearcher, validOptions } = require("ytsearcher");
	const admin = require("firebase-admin");
	let youTubeAPIKey = "";
	var dbData = {};
	console.log("|Y| Running YouTube API");
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
				console.log("|Y| Got Keys, Initiating Query Now");
				youTubeAPIKey = String(dbData.APIKeys.YTAPI);
				console.log("|Y| Set Online To True");
				async function getYouTubeData() {
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
							const searcher = new YTSearcher(dbData.APIKeys.YTAPI);
							let content = [];
							let concResults = [];
							console.log("|Y|Connected Getting Data");
							async function runSendData(props) {
								let result = await searcher.search(props.searchString, {
									type: "video, channel",
									publishedAfter: "2021-05-04T00:00:00Z",
									order: "date",
									maxResults: 2,
								});
								result.currentPage.forEach((ele) => {
									if (ele.channelTitle === props.searchString) {
										content.push(ele);

										var db3 = admin.firestore();
										db3.collection("YouTubeCollection").doc().set(
											{
												Title: ele.title,
												LatestRun: admin.firestore.FieldValue.serverTimestamp(),
											},
											{ merge: true }
										);
									}
								});
								console.log("|Y| Sending Results");
								console.log(content);
								console.log(result.currentPage);
								content.forEach((ele) => {
									concResults.push({});
								});
								console.log(concResults);
								console.log(
									`This is an automated JavaScript bot that queries YouTube channels incrementally for new releases. \r\n`
								);
								if (JSON.stringify(concResults).length > 5) {
									db.collection("Public").doc("DailyYoutube").set(
										{
											LastRun: admin.firestore.FieldValue.serverTimestamp(),
										},
										{ merge: true }
									);
								}

								// Database

								//begin detection of YouTubeOnOff
								if (!dbData.MetaData.YouTubeOn) {
									//Call Database Every 60s For OffOn Switch
								}
								return null;
								// Detect FireStoreData
							}
							return runSendData({ searchString: "CollegeHumor" });
						});
				}
				return getYouTubeData();
			});
		return null;
	}
	getDBData();
};
