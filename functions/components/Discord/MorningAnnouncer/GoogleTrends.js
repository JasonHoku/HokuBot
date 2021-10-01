module.exports.GoogleTrends = async function (googleTrends, channelEl) {
	googleTrends.dailyTrends({ geo: "US" }).then(function (results) {
		const admin = require("firebase-admin");
		let conjStringDailyTrends = "";
		var trendData =
			JSON.parse(results).default.trendingSearchesDays[0].trendingSearches;
		let arrayDailyTrends = [];
		try {
			for (let i = 0; i <= 5; i++) {
				arrayDailyTrends.push({
					Source: "GoogleTrends",
					Title: trendData[i].title.query,
					Traffic: trendData[i].formattedTraffic,
				});

				conjStringDailyTrends += "Daily Trend " + [i + 1] + "\n";
				conjStringDailyTrends += trendData[i].title.query + "\n";
				conjStringDailyTrends += trendData[i].formattedTraffic + "\n";
			}
		} catch (error) {
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

		channelEl.send(`\n
														📈📉📊💹
														\n**Search Trends Of The Day**:${"```"}
														\n
														\nGoogle Search USA
														\n${new Date(Date.now())}
														${conjStringDailyTrends}${"```"}
			`);
	});
};
