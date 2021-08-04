module.exports.WordOfTheDay = async function (fetch, convert, channelEl) {
	fetch("https://www.merriam-webster.com/word-of-the-day").then((res2) => {
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
			channelEl.send(`
									\n 📚📚📚📚📚📚📚📚📚📚📚📚📚📚
					\n **Word Of The Day**:
					\n ${"```"}merriam-webster.com/word-of-the-day/
					\n
					\n ${text}
					\n
					\nPronounced:
					\n ${text2}
					\n
					\nDefined:
					\n ${text3.replace("Definition", "")}
					\n ${"```"}

			`);
		});
	});
};
