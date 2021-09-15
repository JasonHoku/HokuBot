	module.exports.FirebaseStats = async function (channelEl, genDBData) {
	channelEl.send(`\n👋👋🏻👋🏼👋🏽👋🏾👋🏿
														\nHello, everyone!\n${new Date(Date.now())}\n👋👋🏻👋🏼👋🏽👋🏾👋🏿
									\n **Web Asset Data Results:**
										${"```"}MicroHawaii.com : 	*${genDBData.GeneratedData.GlobalClickData.microHawaii[0]}*${"```"}${"```"}A-A-Roots.web.app : *${genDBData.GeneratedData.GlobalClickData.aARoots[0]}*${"```"}${"```"}PonoMap.com : 	*${genDBData.GeneratedData.GlobalClickData.PonoMap[0]}*${"```"}**All Tests Have Passed ✓**
									\n ☀🌞🌇😎🌄🌅🌆🔆=→☀🌞🌇😎🌄🌅🌆🔆=→
			`);
}
