module.exports.GoogleTrends = async function (googleTrends, channelEl) {
	const admin = require("firebase-admin");
	//
	googleTrends.dailyTrends({ geo: "US" }).then(function (results) {
		let conjStringDailyTrends = "";
		let arrayDailyTrends = [];
		var trendData =
			JSON.parse(results).default.trendingSearchesDays[0].trendingSearches;
		try {
			for (let i = 0; i <= 5; i++) {
				arrayDailyTrends.push({
					Source: "GoogleTrends",
					Title: trendData[i].title.query,
					Traffic: trendData[i].formattedTraffic,
				});
				conjStringDailyTrends +=
					"GT-US Trend " + [i + 1] + " @ " + trendData[i].formattedTraffic;
				conjStringDailyTrends += trendData[i].title.query + "\n";
			}
		} catch (error) {
			console.log(error);
			conjStringDailyTrends += " Error Getting Trends Data";
		}

		admin
			.firestore()
			.collection("TrendData")
			.doc(String(Math.round(new Date())))
			.set(
				{
					arrayDailyTrends,
				},
				{ merge: true }
			);

			channelEl.send(`${"```"}\n${conjStringDailyTrends}${"```"}`);
	});
};
