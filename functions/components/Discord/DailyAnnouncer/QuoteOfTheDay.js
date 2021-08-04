module.exports.QuoteOfTheDay = async function (channelEl) {
		const fetch = require("node-fetch");
	fetch("https://api.quotable.io/random")
		.then((res) => res.json())
		.then((data) => {
			channelEl.send(`
														\n ☀🌞🌇😎🌄🌅🌆🔆=→☀🌞🌇😎🌄🌅🌆🔆=→
														\n**Quote Of The Day**
														\n
														\n Quotable.io/random:
														${"```"}${data.content}${"```"}📚📚📚📚📚📚📚📚📚📚📚📚📚📚
								`);
		});
};
