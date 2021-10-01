module.exports.TwitterTrends = async function (channelEl) {
	const admin = require("firebase-admin");
	const { convert } = require("html-to-text");

	//

	let conjStringDailyTrends = "";
	let arrayDailyTrends = [];

	try {
		const fetch = require("node-fetch");
		fetch("https://trends24.in/")
			.then((fetchRes) => {
				// console.log(fetchRes);
				if (fetchRes.status !== 200) {
				} else {
					fetchRes.text().then((resHTML) => {
						//
						var gotTrendsArray = [];
						//
						for (let i = 0; i <= 9; i++) {
							var tempJSON = {};

							tempJSON.Source = "Twitter";
							///////////// Title ////////////////////////////////
							const gotTitle = convert(resHTML)
								.split(parseInt(i + 1) + ".")[1]
								.split(parseInt(i + 2) + ".")[0]
								.split("tweets")[0]
								.split("[")[0]
								.replace(/ /g, "")
								.replace(/(\r\n|\n|\r)/gm, "");
							if (gotTitle.length < 6) {
								console.log("Title for " + parseInt(i + 1));
								console.log(gotTitle);
								tempJSON.Title = gotTitle;
							} else {
								console.log("Error Getting Title Data");
							}
							///////////// Traffic /////////////////////////////////////////////
							console.log("Traffic for " + parseInt(i + 1));
							function isNumeric(str) {
								if (typeof str != "string") return false; // we only process strings!
								return (
									!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
									!isNaN(parseFloat(str))
								); // ...and ensure strings of whitespace fail
							}
							const gotTraffic = convert(resHTML)
								.split(parseInt(i + 1) + ".")[1]
								.split("tweets")[0]
								.split("]")[1]
								.split("K")[0]
								.replace(/ /g, "")
								.replace(/(\r\n|\n|\r)/gm, "");
							if (isNumeric(gotTraffic)) {
								console.log(gotTraffic);
								tempJSON.Traffic = gotTraffic;
							} else {
								console.log("No Traffic Data");
							}
							////////////////////////////////////////////////////////////////
							gotTrendsArray.push(tempJSON);
						}
						///

						// resHTML.split("<div").forEach((divEls) => {
						// 	if (divEls.includes("trend-card")) {
						// 		// console.log(divEls);
						// 		divEls.split("<li").forEach((liEls) => {

						// 			console.log(liEls);
						// 		});
						// 	}
						// });

						for (let i = 0; i <= gotTrendsArray.length; i++) {
							conjStringDailyTrends += "Daily Trend " + [i + 1] + "\n";
							conjStringDailyTrends += gotTrendsArray[i].Title + "\n";
							conjStringDailyTrends += gotTrendsArray[i].Traffic + "\n";
						}

						admin
							.firestore()
							.collection("TrendData")
							.doc(String(Math.round(new Date())))
							.set(
								{
									gotTrendsArray,
								},
								{ merge: true }
							);

						channelEl.send(`\n
	📈📉📊💹
	\n**Search Trends Of The Day**:${"```"}
	\n
	\nTwitter Search WorldWide
	\n${new Date(Date.now())}
	${conjStringDailyTrends}${"```"}
`);
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	} catch (error) {
		console.log(error);
		conjStringDailyTrends += " Error Getting Trends Data";
	}
};
