module.exports.GoogleTrends = async function (googleTrends, channelEl) {
	googleTrends.dailyTrends({ geo: "US" }).then(function (results) {
		let conjStringDailyTrends = "";
		var trendData =
			JSON.parse(results).default.trendingSearchesDays[0].trendingSearches;
		try {
			for (let i = 0; i <= 5; i++) {
				conjStringDailyTrends += "Daily Trend " + [i + 1] + "\n";
				conjStringDailyTrends += trendData[i].title.query + "\n";
				conjStringDailyTrends += trendData[i].formattedTraffic + "\n";
			}
		} catch (error) {
			conjStringDailyTrends += " Error Getting Trends Data";
		}
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
