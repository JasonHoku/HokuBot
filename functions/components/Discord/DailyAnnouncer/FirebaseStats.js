	module.exports.FirebaseStats = async function (channelEl, genDBData) {
	channelEl.send(`\nπππ»ππΌππ½ππΎππΏ
														\nHello, everyone!\n${new Date(Date.now())}\nπππ»ππΌππ½ππΎππΏ
									\n **Web Asset Data Results:**
										${"```"}MicroHawaii.com : 	*${genDBData.GeneratedData.GlobalClickData.microHawaii[0]}*${"```"}${"```"}A-A-Roots.web.app : *${genDBData.GeneratedData.GlobalClickData.aARoots[0]}*${"```"}${"```"}PonoMap.com : 	*${genDBData.GeneratedData.GlobalClickData.PonoMap[0]}*${"```"}**All Tests Have Passed β**
									\n βπππππππ=ββπππππππ=β
			`);
}
