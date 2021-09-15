module.exports.DailyWeather = async function (channelEl, weatherKey) {
	const fetch = require("node-fetch");

	fetch(
		`http://api.openweathermap.org/data/2.5/weather?q=Lahaina&appid=${String(
			weatherKey
		)}&units=imperial`
	)
		.then((res) => res.json())
		.then((data) => {
			///////////////

			channelEl.send(`
			${"```"}
			\nLahaina Weather:
			\n${data.weather[0].main}
			\n
			\nTemp:
			\n${data.main.temp}
			\n
			\nHumidity:
			\n${data.main.humidity}
			\n
			\nVisibility:
			\n${data.visibility}
			\n
			\nWind:
			\nSpeed: ${data.wind.speed}
			\nDegree: ${data.wind.deg}
			\nGust: ${data.wind.gust}
			\n
			\nClouds:
			\n${data.clouds.all}
			\n
			\nSunrise:
			\n${new Date(parseInt(data.sys.sunrise * 1000))}
			\n
			\nSunset:
			\n${new Date(parseInt(data.sys.sunset * 1000))}
			${"```"}
			`);

			///////////////
		});
};
