import firebase from "firebase/app";

import React, { useState, useEffect, useRef, useCallback } from "react";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Button, Popover, PopoverBody } from "reactstrap";

import { ImCogs } from "react-icons/im";

import { FaTwitch } from "react-icons/fa";

import { IoCreateOutline } from "react-icons/io5";
import { IoCloseCircleSharp } from "react-icons/io5";
import { IoSearchCircleSharp } from "react-icons/io5";
import { IoToday } from "react-icons/io5";

import { IoIosRefreshCircle } from "react-icons/io";

import { GiRaceCar } from "react-icons/gi";

import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";

import { GoCalendar } from "react-icons/go";

import { GoGraph } from "react-icons/go";

import { TaskerComponent } from "./tasker";

import {
	FirebaseAppProvider,
	useFirestoreDocData,
	useFirestore,
} from "reactfire";

import { toast } from "react-toastify";

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE,
	authDomain: "hokubot.firebaseapp.com",
	projectId: "hokubot",
	storageBucket: "hokubot.appspot.com",
	messagingSenderId: "666507686643",
	appId: "1:666507686643:web:f3b631cd8a072b30753d86",
	measurementId: "G-FW16P1YXTP",
};
let useEmulator = true;

function ModeratorPage() {
	const [popoverOpen, setPopoverOpen] = useState(false);
	const [decideRenderTabs, setDecideRenderTabs] = useState([]);
	const [tabName, setTabName] = useState("Home");
	const toggle = () => setPopoverOpen(!popoverOpen);

	const [isTwitchOnline, setIsTwitchOnline] = useState(false);
	const [isFirebaseConnected, setIsFirebaseConnected] = useState(true);
	const [isDiscordOn, setIsDiscordOn] = useState(true);
	const [isYouTubeOn, setIsYouTubeOn] = useState(true);
	const [isStartTypeGame, setIsStartTypeGame] = useState(false);
	const [secondsCountdown, setSecondsCountdown] = useState(5);
	const [typeGameTimer, setTypeGameTimer] = useState(0);
	const [gotDailyGenData, setGotDailyGenData] = useState({});
	const [gotToDoCollection, setGotToDoCollection] = useState({});

	const [gotFireGeneratedText, setGotFireGeneratedText] = useState("");
	const [typeGameCorrect, setTypeGameCorrect] = useState(true);

	const isInitialMount = useRef(true);
	const typeGameCounterRef = useRef(true);
	const loadedTotalClicksRef = useRef(true);
	const gotDailyGenDataRef = useRef({});

	const auth = firebase.auth();

	var magBoxRef = document.getElementById("MagicBox");
	var magInpRef = document.getElementById("MagicInput");

	var mouseOverTimeout;

	function setBoxToQuote() {
		fetch("https://api.quotable.io/random")
			.then((res) => res.json())
			.then((data) => {
				magBoxRef.innerHTML = data.content;
				magInpRef.value = "";
				typeGameCounterRef.current = 0;
				setTypeGameTimer(0);
			});
	}
	//
	const startMagicBoxAnimationFunction = useCallback(() => {
		var magBoxRef = document.getElementById("MagicBox");
		var magInpRef = document.getElementById("MagicInput");
		if (!isStartTypeGame) {
			//
			let frameCounter = 0;
			//
			//
			if (window.magBoxAnimationInterval) {
				clearInterval(window.magBoxAnimationInterval);
			}
			//
			//
			//
			window.magBoxAnimationInterval = setInterval(() => {
				//
				window.AniCharArray = [];
				//
				window.AniCharArray.push("Listening \r\n ");
				for (var i = 0; i < Math.round((window.innerWidth - 50) / 13.15); i++) {
					//
					if (i === frameCounter) {
						window.AniCharArray.push("~");
					} else window.AniCharArray.push("-");
				}
				//
				frameCounter++;
				//
				magBoxRef.innerHTML = String(window.AniCharArray)
					.replace(/"/g, "")
					.replace(/,/g, "");
				//
				if (frameCounter >= Math.round((window.innerWidth - 50) / 13.15)) {
					frameCounter = 0;
				}
				//
				if (magInpRef.value.length > 0) {
					clearInterval(window.magBoxAnimationInterval);
					magBoxRef.innerHTML = magInpRef.value;
				}
			}, 9);
			//
			magInpRef.value = "";
		}
	}, [isStartTypeGame]);

	//

	function decideRenderTabsFunction() {
		if (tabName === "Tasker") {
			return (
				<TaskerComponent
					setGotToDoCollection={setGotToDoCollection}
					gotToDoCollection={gotToDoCollection}
				/>
			);
		}
	}

	//
	const getPCPData = useCallback(() => {
		let useEmulator = false;
		require("firebase/functions");

		async function sendRequest(props) {
			//Emulator local url for development:
			let fetchURL = "";

			const urlLocal = `xyz`;
			// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
			//Live  url:
			const urlLive =
				"https://us-central1-prettycoolpattern.cloudfunctions.net/getPCPData";
			if (useEmulator && window.location.hostname.includes("localhost")) {
				fetchURL = urlLocal;
			} else {
				fetchURL = urlLive;
			}
			//Send Details

			const rawResponse = await fetch(fetchURL, {
				method: "GET",
				mode: "cors",
				headers: new Headers({
					"Content-Type": "application/json",
					Accept: "application/json",
					HeaderTokens: JSON.stringify({
						refreshToken: auth.currentUser.refreshToken,
						authDomain: auth.currentUser.authDomain,
						uid: auth.currentUser.uid,
						email: auth.currentUser.email,
						hostname: auth.currentUser.hostname,
						hostname2: window.location.hostname,
					}),
				}),
			});
			const content = await rawResponse.json();
			console.log(loadedTotalClicksRef.current);
			if (loadedTotalClicksRef.current.PCP[0] === 0) {
				loadedTotalClicksRef.current.PCP.splice(0, 1, content);
			} else if (loadedTotalClicksRef.current.PCP[0] !== 0) {
				if (
					Math.abs(
						parseInt(loadedTotalClicksRef.current.PCP[0]) - parseInt(content) !== 0
					)
				) {
					document.getElementById("FireReadTTSBoxValue_Copy").value += String(
						" PCP " +
							Math.abs(
								parseInt(loadedTotalClicksRef.current.PCP[0]) - parseInt(content)
							)
					);
				}

				loadedTotalClicksRef.current.PCP.splice(0, 0, content);
				if (loadedTotalClicksRef.current.PCP[1] !== undefined) {
					if (content !== loadedTotalClicksRef.current.PCP[1]) {
						if (
							Math.abs(
								parseInt(loadedTotalClicksRef.current.PCP[0]) -
									parseInt(loadedTotalClicksRef.current.PCP[1]) !==
									0
							)
						) {
							document.getElementById("FireReadTTSBoxValue_Copy").value +=
								" PCP " +
								Math.abs(
									parseInt(loadedTotalClicksRef.current.PCP[0]) -
										parseInt(loadedTotalClicksRef.current.PCP[1])
								);
						}

						loadedTotalClicksRef.current.PCP.splice(
							1,
							1,
							loadedTotalClicksRef.current.PCP[0]
						);

						loadedTotalClicksRef.current.PCP.splice(0, 1, content);
					}
					console.log(loadedTotalClicksRef.current);
				}
			}
		}
		sendRequest();
	}, [
		auth.currentUser.authDomain,
		auth.currentUser.email,
		auth.currentUser.hostname,
		auth.currentUser.refreshToken,
		auth.currentUser.uid,
	]);
	//
	const getMicroHawaiiData = useCallback(() => {
		let useEmulator = false;
		require("firebase/functions");

		async function sendRequest(props) {
			//Emulator local url for development:
			let fetchURL = "";

			const urlLocal = `http://localhost:5001/microhawaii-5f97b/us-central1/getMicroHawaiiData`;
			// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
			//Live  url:
			const urlLive =
				"https://us-central1-microhawaii-5f97b.cloudfunctions.net/getMicroHawaiiData";
			if (useEmulator && window.location.hostname.includes("localhost")) {
				fetchURL = urlLocal;
			} else {
				fetchURL = urlLive;
			}
			//Send Details

			const rawResponse = await fetch(fetchURL, {
				method: "GET",
				mode: "cors",
				headers: new Headers({
					"Content-Type": "application/json",
					Accept: "application/json",
					HeaderTokens: JSON.stringify({
						refreshToken: auth.currentUser.refreshToken,
						authDomain: auth.currentUser.authDomain,
						uid: auth.currentUser.uid,
						email: auth.currentUser.email,
						hostname: auth.currentUser.hostname,
						hostname2: window.location.hostname,
					}),
				}),
			});
			const content = await rawResponse.json();
			console.log(content);

			console.log(loadedTotalClicksRef.current);
			//
			if (loadedTotalClicksRef.current.microHawaii[0] === 0) {
				loadedTotalClicksRef.current.microHawaii.splice(0, 1, content);
			} else if (loadedTotalClicksRef.current.microHawaii[0] !== 0) {
				if (
					Math.abs(
						parseInt(loadedTotalClicksRef.current.microHawaii[0]) -
							parseInt(content) !==
							0
					)
				) {
					document.getElementById("FireReadTTSBoxValue_Copy").value +=
						" MH " +
						Math.abs(
							parseInt(loadedTotalClicksRef.current.microHawaii[0]) - parseInt(content)
						);
				}

				if (loadedTotalClicksRef.current.microHawaii[2] !== undefined) {
					loadedTotalClicksRef.current.microHawaii.splice(0, 0, content);
				}
				if (loadedTotalClicksRef.current.microHawaii[1] !== undefined) {
					if (content !== loadedTotalClicksRef.current.microHawaii[1]) {
						if (
							Math.abs(
								parseInt(loadedTotalClicksRef.current.microHawaii[0]) -
									parseInt(loadedTotalClicksRef.current.microHawaii[1]) !==
									0
							)
						) {
							document.getElementById("FireReadTTSBoxValue_Copy").value +=
								" MH " +
								Math.abs(
									parseInt(loadedTotalClicksRef.current.microHawaii[0]) -
										parseInt(loadedTotalClicksRef.current.microHawaii[1])
								);
						}

						loadedTotalClicksRef.current.microHawaii.splice(
							1,
							1,
							loadedTotalClicksRef.current.microHawaii[0]
						);

						loadedTotalClicksRef.current.microHawaii.splice(0, 1, content);
					}
					console.log(loadedTotalClicksRef.current);
				}
			}
		}

		sendRequest();
	}, [
		auth.currentUser.authDomain,
		auth.currentUser.email,
		auth.currentUser.hostname,
		auth.currentUser.refreshToken,
		auth.currentUser.uid,
	]);
	//
	const getPonoMapData = useCallback(() => {
		let useEmulator = false;
		require("firebase/functions");

		async function sendRequest(props) {
			//Emulator local url for development:
			let fetchURL = "";

			// disabled
			const urlLocal = `xyz`;
			// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
			//Live  url:
			const urlLive =
				"https://us-central1-ponomap-c8faa.cloudfunctions.net/getPonoMapData";
			if (useEmulator && window.location.hostname.includes("localhost")) {
				fetchURL = urlLocal;
			} else {
				fetchURL = urlLive;
			}
			//Send Details

			const rawResponse = await fetch(fetchURL, {
				method: "GET",
				mode: "cors",
				headers: new Headers({
					"Content-Type": "application/json",
					Accept: "application/json",
					HeaderTokens: JSON.stringify({
						refreshToken: auth.currentUser.refreshToken,
						authDomain: auth.currentUser.authDomain,
						uid: auth.currentUser.uid,
						email: auth.currentUser.email,
						hostname: auth.currentUser.hostname,
						hostname2: window.location.hostname,
					}),
				}),
			});
			const content = await rawResponse.json();
			console.log(content);

			console.log(loadedTotalClicksRef.current);
			if (loadedTotalClicksRef.current.PonoMap[0] === 0) {
				// If Data Needs To Be Loaded, Replace New Data At Position 1
				loadedTotalClicksRef.current.PonoMap.splice(0, 1, content);
			} else if (loadedTotalClicksRef.current.PonoMap[0] !== 0) {
				// Otherwise, If Data Is Loaded
				if (loadedTotalClicksRef.current.PonoMap[2] !== undefined) {
					// If Third Position Is Found Replace First Then Delete [2]
					loadedTotalClicksRef.current.PonoMap.splice(2, 1);
				} else {
					// If Array Is Only 2 In Length, Push Data To Front
					loadedTotalClicksRef.current.PonoMap.splice(0, 0, content);
				}
				if (loadedTotalClicksRef.current.PonoMap[1] !== undefined) {
					// If Array Has [1]
					if (content !== loadedTotalClicksRef.current.PonoMap[1]) {
						// If New Data Is Not Equal Array [1]
						if (
							Math.abs(
								parseInt(loadedTotalClicksRef.current.PonoMap[0]) -
									parseInt(loadedTotalClicksRef.current.PonoMap[1]) !==
									0
							)
						) {
							// If Comparison Is Change
							document.getElementById("FireReadTTSBoxValue_Copy").value +=
								" PM " +
								Math.abs(
									parseInt(loadedTotalClicksRef.current.PonoMap[0]) -
										parseInt(loadedTotalClicksRef.current.PonoMap[1])
								);
						}

						loadedTotalClicksRef.current.PonoMap.splice(
							1,
							1,
							loadedTotalClicksRef.current.PonoMap[0]
						);

						loadedTotalClicksRef.current.PonoMap.splice(0, 1, content);
					}
					if (loadedTotalClicksRef.current.PonoMap[2] !== undefined) {
						// If Third Position Is Then Remove [2]
						loadedTotalClicksRef.current.PonoMap.splice(2, 1);
					}
					console.log(loadedTotalClicksRef.current);
				}
			}
		}
		sendRequest();
	}, [
		auth.currentUser.authDomain,
		auth.currentUser.email,
		auth.currentUser.hostname,
		auth.currentUser.refreshToken,
		auth.currentUser.uid,
	]);
	//

	const getAARootsData = useCallback(() => {
		let useEmulator = false;
		require("firebase/functions");

		async function sendRequest(props) {
			//Emulator local url for development:
			let fetchURL = "";

			const urlLocal = `http://localhost:5001/a-a-roots/us-central1/getAARootsData`;
			// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)
			//Live  url:
			const urlLive =
				"https://us-central1-a-a-roots.cloudfunctions.net/getAARootsData";
			if (useEmulator && window.location.hostname.includes("localhost")) {
				fetchURL = urlLocal;
			} else {
				fetchURL = urlLive;
			}
			//Send Details

			const rawResponse = await fetch(fetchURL, {
				method: "GET",
				mode: "cors",
				headers: new Headers({
					"Content-Type": "application/json",
					Accept: "application/json",
					HeaderTokens: JSON.stringify({
						refreshToken: auth.currentUser.refreshToken,
						authDomain: auth.currentUser.authDomain,
						uid: auth.currentUser.uid,
						email: auth.currentUser.email,
						hostname: auth.currentUser.hostname,
						hostname2: window.location.hostname,
					}),
				}),
			});
			const content = await rawResponse.json();
			console.log(content);
			console.log(loadedTotalClicksRef.current);
			//
			if (loadedTotalClicksRef.current.aARoots[0] === 0) {
				// If Data Needs To Be Loaded, Replace New Data At Position 1
				loadedTotalClicksRef.current.aARoots.splice(0, 1, content);
			} else if (loadedTotalClicksRef.current.aARoots[0] !== 0) {
				// Otherwise, If Data Is Loaded

				if (loadedTotalClicksRef.current.aARoots[2] !== undefined) {
					// If Third Position Is Found Replace First Then Delete [2]
					loadedTotalClicksRef.current.aARoots.splice(2, 1);
				} else {
					// If Array Is Only 2 In Length, Push Data To Front
					loadedTotalClicksRef.current.aARoots.splice(0, 0, content);
				}
				if (loadedTotalClicksRef.current.aARoots[1] !== undefined) {
					// If Array Has [1]
					if (content !== loadedTotalClicksRef.current.aARoots[1]) {
						// If New Data Is Not Equal Array [1]
						if (
							Math.abs(
								parseInt(loadedTotalClicksRef.current.aARoots[0]) -
									parseInt(loadedTotalClicksRef.current.aARoots[1]) !==
									0
							)
						) {
							// If Comparison Is Change
							document.getElementById("FireReadTTSBoxValue_Copy").value +=
								" AAR " +
								Math.abs(
									parseInt(loadedTotalClicksRef.current.aARoots[0]) -
										parseInt(loadedTotalClicksRef.current.aARoots[1])
								);
						}

						loadedTotalClicksRef.current.aARoots.splice(
							1,
							1,
							loadedTotalClicksRef.current.aARoots[0]
						);

						loadedTotalClicksRef.current.aARoots.splice(0, 1, content);
					}
					if (loadedTotalClicksRef.current.aARoots[2] !== undefined) {
						// If Third Position Is Then Remove [2]
						loadedTotalClicksRef.current.aARoots.splice(2, 1);
					}
					console.log(loadedTotalClicksRef.current);
				}
			}
		}
		sendRequest();
	}, [
		auth.currentUser.authDomain,
		auth.currentUser.email,
		auth.currentUser.hostname,
		auth.currentUser.refreshToken,
		auth.currentUser.uid,
	]);

	//
	useEffect(() => {
		console.log("State Refresh");
		if (isInitialMount.current) {
			//
			document.addEventListener("mousemove", (event) => {
				if (document.getElementById("allOnlineStatuses").hidden === false) {
					if (event.toElement.id.includes("StatusSpan") === false) {
						if (!window.mouseOverTimeout)
							window.mouseOverTimeout = setTimeout(() => {
								document.getElementById("allOnlineStatuses").hidden = false;
							}, 250);
						clearTimeout(window.mouseOverTimeout);
						document.getElementById("allOnlineStatuses").hidden = true;
					}
				}
			});
			//
			console.log("Load Oncce UseEffect");
			//
			gotDailyGenDataRef.current = { LastRun: 0 };
			loadedTotalClicksRef.current = {
				microHawaii: [0],
				aARoots: [0],
				PonoMap: [0],
				PCP: [0],
			};
			startMagicBoxAnimationFunction();
			var db = firebase.firestore();
			db
				.collection("Public")
				.doc("GeneratedDaily")
				.get()
				.then((doc) => {
					var dbData = Object.assign(doc.data()).LastRun;

					var date = String(new Date(dbData.toDate()));

					console.log(date);
					gotDailyGenDataRef.current.LastRun = date;
					document.getElementById("LastDailyRunSpan").innerHTML = String(date)
						.replace(" GMT-1000", "")
						.replace("(Hawaii-Aleutian Standard Time)", "")
						.replace(" 2021", "");

					console.log(dbData);
				});

			db
				.collection("ToDoCollection")
				.get()
				.then((snapshot) => {
					var dbData = {};
					snapshot.forEach((doc) => {
						var key = doc.id;
						var data = doc.data();
						data["key"] = key;
						dbData[key] = data;
					});
					console.log(dbData);
					var tempVar = "";
					var tempVar2 = "";
					var tempVar3 = "";
					var tempVar4 = "";

					//
					Object.values(dbData).forEach((el) => {
						if (
							Math.round(
								(Math.abs(new Date(Date.now()) - new Date(el.timeStamp.toDate())) /
									3600000 -
									24) *
									10000
							) /
								10000 <=
							0
						) {
							console.log("XYZ");
							console.log(el.title);

							tempVar4 += String(el.title + " |$%$|");
						}

						if (el.timeStamp === null) {
							console.log(" ");
							console.log(el.title);
							console.log(" ");
							el.timeStamp = firebase.firestore.FieldValue.serverTimestamp();
						}
					});

					var sorted = Object.values(dbData).sort(function (a, b) {
						return new Date(b.timeStamp.toDate()) - new Date(a.timeStamp.toDate());
					});

					setGotToDoCollection(sorted);

					console.log(sorted);

					sorted.forEach((el) => {
						if (el.status === 1 || el.status === 3) {
							if (window.activeToDoCounter === undefined) {
								window.activeToDoCounter = 1;
							} else window.activeToDoCounter++;
							tempVar += String(el.title + " |$%$|");
						}
						if (el.status === 0) {
							tempVar2 += String(el.title + " |$%$|");
							window.stashedToDoCounter++;
						}

						if (el.status === 2 || el.status === 2) {
							tempVar3 += String(el.title + " |$%$|");
							window.FinToDoCounter++;
						}
					});
					window.todoListAction = tempVar;
					window.todoList = tempVar2;
					window.todoListFin = tempVar3;
					window.todoList24h = tempVar4;
					window.toDoData = dbData;
				});
			//setGotDailyGenData
			// require("./loadAudioVideoControls.js");
			var timeout;
			document.onmousemove = function () {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					var magInpRef = document.getElementById("MagicInput");
					if (magInpRef.value.length < 1) {
						startMagicBoxAnimationFunction();
					}
				}, 5000);
			};
			document.onkeypress = function () {
				clearTimeout(timeout);
				timeout = setTimeout(function () {
					var magInpRef = document.getElementById("MagicInput");
					if (magInpRef.value.length < 1) {
						startMagicBoxAnimationFunction();
					}
				}, 5000);
			};

			document.addEventListener(
				"keydown",
				function (e) {
					if (e.code === "Enter") {
						document.getElementById("MagicInput").focus();
					}
				},
				false
			);
			isInitialMount.current = false;

			window.timerFunction = function timerFunction() {
				// First Time Load
				window.window.varInt = 5;
				// Init Interval for TTS
				window.varInt2 = 5;
				// Init Interval for TypeGame
				window.varInt3 = typeGameTimer;

				setInterval(() => {
					document.getElementById("DailyRunCountdownSpan").innerHTML = String(
						Math.round(
							(Math.abs(
								new Date(Date.now()) -
									new Date(String(gotDailyGenDataRef.current.LastRun))
							) /
								3600000 -
								24) *
								10000
						) /
							10000 +
							" Hours"
					);

					window.varInt = window.varInt - 1;
					window.varInt2 = window.varInt2 - 1;

					if (typeGameCounterRef.current === 0) {
						window.varInt3 = window.varInt3 + 1;
					} else {
						window.varInt3 = 0;
					}
					setTypeGameTimer(window.varInt3);

					setIsStartTypeGame((isStartTypeGame) => {
						setIsStartTypeGame(isStartTypeGame);
						if (!isStartTypeGame) {
							window.varInt3 = 0;
						}
					});
					let FireReadBox = document.getElementById("FireReadTTSBoxValue").innerHTML;

					if (window.varInt <= 0) {
						// getAARootsData();
						// getMicroHawaiiData();
						// getPonoMapData();
						// getPCPData();

						if (
							FireReadBox !== "" ||
							document.getElementById("FireReadTTSBoxValue_Copy").value !== ""
						) {
							console.log(FireReadBox);
							console.log("Sending HokuBot Database Updates");
							var db3 = firebase.firestore();
							db3
								.collection("Public")
								.doc("GeneratedData")
								.set(
									{ TTSString: "", GlobalClickData: loadedTotalClicksRef.current },
									{ merge: true }
								);

							if (
								Math.round(
									(Math.abs(
										new Date(Date.now()) -
											new Date(String(gotDailyGenDataRef.current.LastRun))
									) /
										3600000 -
										24) *
										10000
								) /
									10000 >=
								0
							) {
								db3.collection("Public").doc("GeneratedDaily").set(
									{
										LastRun: firebase.firestore.FieldValue.serverTimestamp(),
										GlobalClickData: loadedTotalClicksRef.current,
									},
									{ merge: true }
								);
							}
						}
						if (window.varInt <= 3) {
							if (document.getElementById("FireReadTTSBoxValue_Copy").value !== "") {
								document.getElementById("FireReadTTSBoxValue_Copy").value = "";
							}
						}
						window.varInt2 = 60;
						window.varInt = 60;
					} else {
						setSecondsCountdown(window.varInt - 1);
						// Reset TTS Detect at 0s
						//	console.log(parseInt(window.varInt2) % 10);
						if (parseInt(window.varInt2) === 1) {
							console.log("Checking TTS");

							let _speechSynth;
							let _voices;
							const _cache = {};

							/**
							 * retries until there have been voices loaded. No stopper flag included in this example.
							 * Note that this function assumes, that there are voices installed on the host system.
							 */

							function loadVoicesWhenAvailable(onComplete = () => {}) {
								_speechSynth = window.speechSynthesis;
								const voices = _speechSynth.getVoices();

								if (voices.length !== 0) {
									_voices = voices;
									onComplete();
								} else {
									return setTimeout(function () {
										loadVoicesWhenAvailable(onComplete);
									}, 100);
								}
							}

							/**
							 * Returns the first found voice for a given language code.
							 */

							function getVoices(locale) {
								if (!_speechSynth) {
									throw new Error("Browser does not support speech synthesis");
								}
								if (_cache[locale]) return _cache[locale];

								_cache[locale] = _voices.filter((voice) => voice.lang === locale);
								return _cache[locale];
							}

							/**
							 * Speak a certain text
							 * @param locale the locale this voice requires
							 * @param text the text to speak
							 * @param onEnd callback if tts is finished
							 */

							function playByText(locale, text, onEnd) {
								const voices = getVoices(locale);

								// TODO load preference here, e.g. male / female etc.
								// TODO but for now we just use the first occurrence
								const utterance = new window.SpeechSynthesisUtterance();
								utterance.voice = voices[0];
								utterance.pitch = 1;
								utterance.rate = 1;
								utterance.voiceURI = "native";
								utterance.volume = 1;
								utterance.rate = 1;
								utterance.pitch = 0.8;
								utterance.text = text;
								utterance.lang = locale;

								if (onEnd) {
									utterance.onend = onEnd;
								}

								_speechSynth.cancel(); // cancel current speak, if any is running
								_speechSynth.speak(utterance);
							}

							// on document ready
							loadVoicesWhenAvailable(function () {
								console.log("Checking TTS");
							});

							function speak() {
								setTimeout(
									() =>
										playByText(
											"en-US",
											document.getElementById("FireReadTTSBoxValue_Copy").value
										),
									300
								);
							}

							// Reset Interval for TTS
							speak();
						}
					}
				}, 1000);
			};
			window.timerFunction();
			setInterval(() => {
				//Watch FireStore Hooks At Interval
				let TwitchSpanValue =
					document.getElementById("isTwitchOnlineSpan").innerHTML;

				let isFireOnlineValue =
					document.getElementById("isFireOnlineSpan").innerHTML;

				let isFireReadBoxValue = document.getElementById("FireReadBox").innerHTML;

				let isDiscordOnValue = document.getElementById("isDiscordOnSpan").innerHTML;

				// let FireReadTTSBox = document.getElementById(
				// 	"FireReadTTSBoxValue"
				// ).innerHTML;

				let isYouTubeOnValue = document.getElementById(
					"isYouTubeOnlineSpan"
				).innerHTML;

				//	console.log(document.getElementById("FireReadTTSBoxValue_Copy").value);

				//Send TTS String to TTS Function
				// if (FireReadTTSBox.length > 0) {
				// 	setGotGeneratedTTS(FireReadTTSBox);
				// }
				//Check Twitch Text To State
				if (TwitchSpanValue.includes("Offline")) {
					setIsTwitchOnline(false);
				}

				if (TwitchSpanValue.includes("Online")) {
					setIsTwitchOnline(true);
				}
				//Check Firestore Online Text To State
				if (isFireOnlineValue.includes("Offline")) {
					setIsFirebaseConnected(false);
				}
				if (isFireOnlineValue.includes("Online")) {
					setIsFirebaseConnected(true);
				}
				//Check DiscordAPI Online Text To State
				if (isDiscordOnValue.includes("Offline")) {
					setIsDiscordOn(false);
				}
				if (isDiscordOnValue.includes("Online")) {
					setIsDiscordOn(true);
				}
				//Check DiscordAPI Online Text To State
				if (isYouTubeOnValue.includes("Offline")) {
					setIsYouTubeOn(false);
				}
				if (isYouTubeOnValue.includes("Online")) {
					setIsYouTubeOn(true);
				}

				//Check FireStore GeneratedRawText To State
				let splitReadText = isFireReadBoxValue.split("-@!%!%!@-");
				let joinedText = [""];
				if (joinedText) {
					splitReadText.forEach((element, index) => {
						joinedText.push(element);
					});
					setGotFireGeneratedText(joinedText);
				}
			}, 250);
		}
	}, [
		secondsCountdown,
		typeGameTimer,
		startMagicBoxAnimationFunction,
		setGotDailyGenData,
		gotDailyGenData,
		getMicroHawaiiData,
		getPonoMapData,
		getPCPData,
		getAARootsData,
	]);

	function decideRenderGeneratedText() {
		let styledDivides = {
			boxShadow: "0px  2px 3px 3px #221133",
			fontFamily: "courier",
			fontSize: "22px",
			marginBottom: "15px",
			textAlign: "left",
			position: "absolute",
			width: "100%",
			maxWidth: window.innerWidth,
			background:
				"linear-gradient(to top,rgb(48, 25, 63) 95%,rgb(23, 14, 48) 100%)",
			zIndex: 1,
		};
		return (
			<span
				style={{
					marginBottom: "35px",
					width: "100%",
					position: "absolute",
					zIndex: 1,
					left: 0,
					top: "100px",
					color: "#DDCCFF",
					textShadow: " 0 0 5px #DDCCFF",
				}}
			>
				<div
					id="HokuModal"
					hidden
					style={{
						position: "absolute",
						left: "0",
						top: "25px",
						width: "100%",
						height: window.innerHeight - 250,
						zIndex: 2000,
						backgroundColor: "black",
						textAlight: "center",
					}}
				>
					<div style={{ height: "15px" }}></div>

					<div
						style={{
							textAlign: "center",
						}}
					>
						HokuBot Modal Info{" "}
						<span
							onClick={() => {
								document.getElementById("HokuModal").hidden = true;
							}}
						>
							<IoCloseCircleSharp />
						</span>
					</div>
					<div style={{ height: "35px" }}></div>
					<div
						id="HokuModalDescription"
						style={{
							fontSize: "20px",
							textAlign: "center",
						}}
					>
						Creating To Do
					</div>

					<div style={{ height: "35px" }}></div>
					<div
						style={{
							textAlign: "center",
						}}
					>
						<input
							hidden
							onChange={(e) => {
								console.log("Searching");
								console.log(e.target.value);
							}}
							id="ModalSearchInput"
							style={{
								margin: "3px",
								width: "55%",
								height: "55px",
								fontSize: "20px",
								textShadow: " 0 0 5px #FFDDEE",
								color: "#FFDDEE",
								backgroundColor: "transparent",
							}}
						></input>
						<input
							onChange={(e) => {
								console.log(e.target.value);
								if (e.target.value.includes("!")) {
									console.log("! Detected");
									console.log(e.target.value.replace("!", ""));

									async function runNewToDo() {
										var db = firebase.firestore();
										await db
											.collection("ToDoCollection")
											.get()
											.then((snapshot) => {
												var dbData = {};
												snapshot.forEach((doc) => {
													var key = doc.id;
													var data = doc.data();
													data["key"] = key;
													dbData[key] = data;
												});
												console.log(dbData);
												//
												//
												Object.values(dbData).forEach((el) => {
													if (el.title === e.target.value.replace("!", "")) {
														console.log("Detected Duplicate ");
														console.log(el.title);
														console.log(el.count || 2);
														db
															.collection("ToDoCollection")
															.doc(e.target.value.replace("!", ""))
															.set(
																{
																	status: 1,
																	note: el.note,
																	priority: 10,
																	title: e.target.value.replace("!", ""),
																	timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
																	count: el.count + 1 || 2,
																},
																{ merge: true }
															);
													}
												});

												db
													.collection("ToDoCollection")
													.doc(e.target.value.replace("!", ""))
													.set(
														{
															status: 1,
															note: "",
															priority: 10,
															title: e.target.value.replace("!", ""),
															timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
														},
														{ merge: true }
													)
													.then(
														setTimeout(() => {
															db
																.collection("ToDoCollection")
																.get()
																.then((snapshot) => {
																	var dbData = {};
																	snapshot.forEach((doc) => {
																		var key = doc.id;
																		var data = doc.data();
																		data["key"] = key;
																		dbData[key] = data;
																	});
																	console.log(dbData);
																	var tempVar = "";
																	var tempVar2 = "";
																	var tempVar3 = "";
																	//
																	//
																	Object.values(dbData).forEach((el) => {
																		if (el.timeStamp === null) {
																			console.log(" ");
																			console.log(el.title);
																			console.log(" ");
																			el.timeStamp =
																				firebase.firestore.FieldValue.serverTimestamp();
																		}
																	});

																	var sorted = Object.values(dbData).sort(function (a, b) {
																		if (a.timeStamp === null || b.timeStamp === null) {
																			return (a.timeStamp =
																				firebase.firestore.FieldValue.serverTimestamp());
																		}
																		return (
																			new Date(b.timeStamp.toDate()) -
																			new Date(a.timeStamp.toDate())
																		);
																	});

																	console.log(sorted);

																	setGotToDoCollection(sorted);

																	document.getElementById("HokuModal").hidden = true;
																	document.getElementById("ModalInput").value = "";
																});
														}, 250)
													);
											});
									}
									runNewToDo();
								}
							}}
							id="ModalInput"
							style={{
								margin: "3px",
								width: "55%",
								height: "55px",
								fontSize: "20px",
								textShadow: " 0 0 5px #FFDDEE",
								color: "#FFDDEE",
								backgroundColor: "transparent",
							}}
						></input>
					</div>
				</div>
				<div
					style={{
						top: "-10px",
						position: "relative",
						textAlign: "center",
						width: "100%",
						display: "flex",
					}}
				>
					{" "}
					<span
						onClick={() => {
							setTabName("Home");
						}}
						style={{ position: "relative", margin: "auto" }}
					>
						<IoIosRefreshCircle size="35px" />
					</span>{" "}
					<span
						onClick={() => {
							document.getElementById("HokuModal").hidden = false;
							document.getElementById("ModalSearchInput").hidden = true;
							document.getElementById("ModalInput").hidden = false;
							document.getElementById("HokuModalDescription").innerHTML =
								"Creating To-Do Task";
						}}
						style={{ position: "relative", margin: "auto" }}
					>
						<IoCreateOutline size="35px" />
					</span>{" "}
					<span style={{ position: "relative", margin: "auto" }}>
						<GiRaceCar size="35px" />
					</span>{" "}
					<span
						onClick={() => {
							document.getElementById("HokuModalDescription").innerHTML = String(
								"<br /> 24H Total :" +
									window.todoList24h.split("|$%").length +
									"<br />" +
									"<br />" +
									window.todoList24h
							).replaceAll("|$%$|", "<br />");
							document.getElementById("HokuModal").hidden = false;
						}}
						style={{ position: "relative", margin: "auto" }}
					>
						<GoGraph size="35px" />
					</span>{" "}
					<span
						onClick={() => {
							let randTodo;
							function decideActiveToDo() {
								randTodo =
									Object.values(gotToDoCollection)[
										Math.floor(Math.random() * Object.values(gotToDoCollection).length)
									];
								if (randTodo.status === 0) {
									toast(<div>{String(randTodo.title)}</div>);
								} else {
									decideActiveToDo();
								}
							}
							decideActiveToDo();
							// alert(randTodo[Math.random() * gotToDoCollection.length]);
							// toast(<div>Feature Test</div>);
						}}
						style={{ position: "relative", margin: "auto" }}
					>
						<GiPerspectiveDiceSixFacesRandom size="35px" />
					</span>{" "}
					<span
						onClick={() => {
							alert("XYZ");
						}}
						style={{ position: "relative", margin: "auto" }}
					>
						<FaTwitch size="35px" />
					</span>{" "}
					<span
						onClick={() => {
							document.getElementById("HokuModal").hidden = false;
							document.getElementById("ModalSearchInput").hidden = false;
							document.getElementById("ModalInput").hidden = true;
							document.getElementById("HokuModalDescription").innerHTML =
								"Searching HokuBot";
						}}
						style={{ position: "relative", margin: "auto" }}
					>
						<IoSearchCircleSharp size="35px" />
					</span>
					<span
						onClick={() => {
							setTabName("Tasker");
						}}
						style={{ position: "relative", margin: "auto" }}
					>
						<IoToday size="35px" />
					</span>
					<span
						onClick={() => {
							setTabName("Tasker");
						}}
						style={{ position: "relative", margin: "auto" }}
					>
						<GoCalendar size="35px" />
						<span
							hidden={window.activeToDoCounter === undefined}
							style={{
								position: "absolute",
								left: "-25px",
								top: "-20px",
								width: "35px",
							}}
						>
							<svg
								style={{
									width: "25px",
									position: "absolute",
									height: "25px",
									backgroundColor: String(
										"#" +
											String(Math.round(Math.random() * 9)) +
											String(Math.round(Math.random() * 9)) +
											String(Math.round(Math.random() * 9)) +
											String(Math.round(Math.random() * 9)) +
											"ff"
									),
									borderRadius: "50%",
								}}
							></svg>
							<span
								style={{
									position: "absolute",
									left: window.activeToDoCounter >= 10 ? "20px" : "22px",
									top: "-3px",
									color: "#000000",
									fontSize: window.activeToDoCounter >= 10 ? "20px" : "22px",
									fontWeight: "600",
									userSelect: "none",
								}}
							>
								{window.activeToDoCounter}
							</span>
						</span>
					</span>
				</div>
				<div
					hidden={tabName !== "Home"}
					id="StatisticsInfoId"
					style={{
						boxShadow: "0px  2px 3px 3px #221133",
						fontFamily: "courier",
						fontSize: "22px",
						marginBottom: "15px",
						textAlign: "left",
						position: "absolute",
						width: "100%",
						maxWidth: window.innerWidth,
						display: tabName === "Home" ? "flex" : "none",
						flexWrap: "wrap",
						flexDirection: "row",
						background:
							"linear-gradient(to top,rgb(48, 25, 63) 95%,rgb(23, 14, 48) 100%)",
						zIndex: 1,
					}}
				>
					<div style={{ height: "55px", width: "100%", marginLeft: "15px" }}></div>
					<br />
					<div
						style={{
							height: "55px",
							width: "255px",
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",
							maxWidth: "450px",
							textAlign: "left",
						}}
					>
						<div
							style={{
								margin: "15px",
							}}
						>
							<b>Runs:</b>
							<span
								style={{
									margin: "3px",
									textShadow: " 0 0 5px #FFDDEE",
									color: "#FFDDEE",
								}}
							>
								{String(gotFireGeneratedText[2])}
							</span>
						</div>
					</div>
					<br /> <div style={{ height: "15px", marginLeft: "15px" }}></div>{" "}
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",
							maxWidth: "450px",
							textAlign: "left",
						}}
					>
						<div
							style={{
								margin: "15px",
							}}
						>
							<b>Last Response:</b>
							<span
								style={{
									margin: "3px",
									textShadow: " 0 0 5px #FFDDEE",
									color: "#FFDDEE",
								}}
							>
								{
									//FireStore LastBoot Data
								}
								{String(new Date(String(gotFireGeneratedText[1])))
									.replace(" GMT-1000", "")
									.replace("(Hawaii-Aleutian Standard Time)", "")
									.replace(" 2021", "")}
							</span>
						</div>
					</div>
					<div style={{ height: "15px" }}></div>
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",

							maxWidth: "450px",
							textAlign: "left",
						}}
					>
						<div
							style={{
								margin: "15px",
							}}
						>
							<b>Global Query Countdown:</b>
							<span
								style={{
									margin: "3px",
									textShadow: " 0 0 5px #FFDDEE",
									color: "#FFDDEE",
								}}
							>
								{
									//FireStore NextRun Data
								}
								{secondsCountdown}
							</span>
						</div>
					</div>{" "}
					<div style={{ height: "15px" }}></div>
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",

							maxWidth: "450px",
							textAlign: "left",
							whiteSpace: "pre-line",
						}}
					>
						<div
							style={{
								margin: "15px",
							}}
						>
							<b>Stats:</b>
						</div>
					</div>
					<div style={{ height: "15px" }}></div>
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",

							maxWidth: "450px",
							textAlign: "left",
						}}
					>
						<div
							style={{
								margin: "15px",
							}}
						>
							<b>LeaderBoard:</b>
							<span
								style={{
									margin: "3px",
									textShadow: " 0 0 5px #FFDDEE",
									color: "#FFDDEE",
								}}
							></span>
						</div>{" "}
					</div>
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",

							maxWidth: "450px",
							textAlign: "left",
						}}
					>
						<div
							style={{
								margin: "15px",
							}}
						>
							<div style={{ height: "15px" }}></div>
							<b>Clicks:</b>
							<span
								style={{
									margin: "15px",
									textShadow: " 0 0 5px #FFDDEE",
									color: "#FFDDEE",
								}}
							>
								{" "}
								<FirebaseAppProvider firebaseConfig={firebaseConfig}>
									<pre
										style={{
											whiteSpace: "pre-line",
											margin: "15px",

											textShadow: " 0 0 5px #FFDDEE",
											color: "#FFDDEE",
										}}
									>
										<GetGlobalClickStats />
									</pre>
								</FirebaseAppProvider>
							</span>{" "}
						</div>
					</div>
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",

							maxWidth: "450px",
							textAlign: "left",
						}}
					>
						<div style={{ height: "15px" }}></div>
						<div
							style={{
								margin: "15px",
							}}
						>
							<b>Action:</b>
							<span
								style={{
									margin: "3px",
									textShadow: " 0 0 5px #FFDDEE",
									color: "#FFDDEE",
								}}
							>
								Running
							</span>
						</div>{" "}
					</div>
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",
							maxWidth: "450px",
							textAlign: "left",
						}}
					>
						<div style={{ height: "15px" }}></div>

						<div
							style={{
								margin: "15px",
							}}
						>
							<b>TTS:</b>
							<input
								id="FireReadTTSBoxValue_Copy"
								style={{
									margin: "3px",
									width: "75%",
									textShadow: " 0 0 5px #FFDDEE",
									color: "#FFDDEE",
									backgroundColor: "transparent",
								}}
							></input>
						</div>
					</div>
					<div style={{ height: "15px" }}></div>
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",
							width: "95%",
							height: "225px",
							textAlign: "left",
						}}
					>
						<pre
							id="MagicBox"
							style={{
								backgroundColor: typeGameCorrect ? "transparent" : "#FF0000",
								margin: "3px",
								textShadow: " 0 0 5px #FFDDEE",
								color: "#FFDDEE",
								whiteSpace: "pre-line",
								textAlign: "center",
							}}
						></pre>
						<div
							hidden={isStartTypeGame ? false : true}
							style={{ position: "relative", top: "20px" }}
						>
							{typeGameTimer}
						</div>
					</div>
					<input
						style={{
							width: "90%",
							position: "relative",
							left: "25px",
							top: "-55px",
							height: "25px",
							border: "1px",
							color: "white",
							background:
								"linear-gradient(to top,rgb(48, 25, 63) 90%,rgb(23, 14, 48) 100%)",
						}}
						id="MagicInput"
						onChange={(e) => {
							var magBoxRef = document.getElementById("MagicBox");
							var magInpRef = document.getElementById("MagicInput");

							if (!isStartTypeGame) {
								magBoxRef.innerHTML = e.target.value;
							} else {
								var CurrentCharacterPosition = magInpRef.value.length;
								if (
									String(magBoxRef.innerHTML)[CurrentCharacterPosition - 1] ===
									e.target.value[e.target.value.length - 1]
								) {
									setTypeGameCorrect(true);

									if (e.target.value.length === magBoxRef.innerHTML.length) {
										console.log("Finished!");

										let WPMVar = Math.round(
											((magBoxRef.innerHTML.split(" ").length / typeGameTimer) *
												100 *
												60) /
												100
										);

										let CPMVar =
											(Math.round((magBoxRef.innerHTML.length / typeGameTimer) * 100) /
												100) *
											60;

										var db3 = firebase.firestore();

										db3
											.collection("Users")
											.doc(auth.currentUser.uid)
											.get()
											.then((doc) => {
												if (doc.data().Stats.WPMRecord < WPMVar) {
													console.log("New WPM Record");
													db3
														.collection("Users")
														.doc(auth.currentUser.uid)
														.set(
															{
																Stats: {
																	WPMRecord: WPMVar,
																},
															},
															{ merge: true }
														);
													//
													if (doc.data().Stats.CPMRecord < CPMVar) {
														console.log("New WPM Record");
														db3
															.collection("Users")
															.doc(auth.currentUser.uid)
															.set(
																{
																	Stats: {
																		CPMRecord: CPMVar,
																	},
																},
																{ merge: true }
															);
													}
												}

												db3
													.collection("Users")
													.doc(auth.currentUser.uid)
													.set(
														{
															Stats: {
																WPMAverage:
																	Math.round(
																		((doc.data().Stats.WPMAverage + WPMVar) / 2) * 100
																	) / 100,
																CPMAverage:
																	Math.round(
																		((doc.data().Stats.CPMAverage + CPMVar) / 2) * 100
																	) / 100,
																Accuracy: 100,
															},
														},
														{ merge: true }
													);

												// End User Db Connection
											});

										magBoxRef.innerHTML =
											"Chars:" +
											magBoxRef.innerHTML.length +
											" Words:" +
											magBoxRef.innerHTML.split(" ").length +
											"\r\n " +
											"\r\n CPS: " +
											Math.round((magBoxRef.innerHTML.length / typeGameTimer) * 100) /
												100 +
											" WPS: " +
											Math.round(
												(magBoxRef.innerHTML.split(" ").length / typeGameTimer) * 100
											) /
												100 +
											"\r\n " +
											"\r\n CPM: " +
											Math.round(
												(Math.round((magBoxRef.innerHTML.length / typeGameTimer) * 100) /
													100) *
													60
											) +
											" WPM: " +
											Math.round(
												(magBoxRef.innerHTML.split(" ").length / typeGameTimer) * 100 * 60
											) /
												100;
										setIsStartTypeGame(false);
										magInpRef.value = "";
									}
									//
								} else {
									console.log("Wrong");
									setTypeGameCorrect(false);
								}
							}

							if (magBoxRef.innerHTML === "/websites") {
								magBoxRef.innerHTML = "Loading";
								magInpRef.value = " ";
							}

							if (magBoxRef.innerHTML === "/start") {
								if (!isStartTypeGame) {
									setBoxToQuote();
									setIsStartTypeGame(true);
								}
							}
							if (magBoxRef.innerHTML === "/stop") {
								if (window.magBoxAnimationInterval) {
									clearInterval(window.magBoxAnimationInterval);
								}
							}
							if (magBoxRef.innerHTML === "/animate") {
								//
								startMagicBoxAnimationFunction();
							}

							if (magBoxRef.innerHTML === "/todo") {
								//
								console.log("Running Todo Function");
							}
						}}
					></input>
					<br />
					<br />
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",
							maxWidth: "450px",
							textAlign: "left",
							whiteSpace: "pre-line",
						}}
					>
						<div
							style={{
								margin: "15px",
							}}
						>
							&nbsp;<b>Todays Stats:</b>
							<span
								style={{
									margin: "3px",
									textShadow: " 0 0 5px #FFDDEE",
									color: "#FFDDEE",
								}}
							>
								<span id="LastDailyRunSpan"> </span>
							</span>
						</div>
					</div>
					<br />
					<div
						style={{
							boxShadow: "0px  2px 3px 3px #221133",
							fontFamily: "courier",
							fontSize: "22px",
							marginLeft: "15px",
							marginBottom: "15px",
							maxWidth: "950px",
							textAlign: "left",
							whiteSpace: "pre-line",
						}}
					>
						<div
							style={{
								margin: "15px",
							}}
						>
							&nbsp;<b>Next Daily Countdown:</b>
							<span
								id="DailyRunCountdownSpan"
								style={{
									margin: "3px",
									textShadow: " 0 0 5px #FFDDEE",
									color: "#FFDDEE",
								}}
							></span>
						</div>
					</div>
					<br />
					<br />
					<br />
				</div>
			</span>
		);
	}

	//Run StartAPI Call To Functions
	async function runFunction() {
		console.log("Running");
		require("firebase/functions");

		async function sendRequest(props) {
			//Emulator local url for development:
			let fetchURL = "";
			const urlLocal = `http://localhost:5002/hokubot/us-central1/FireFunctionAPI`;

			// Quickly Toggle Between Emulator & Live Functions (Detects Localhost)

			//Live  url:
			const urlLive =
				"https://us-central1-hokubot.cloudfunctions.net/FireFunctionAPI";

			if (useEmulator && window.location.hostname.includes("localhost")) {
				fetchURL = urlLocal;
			} else {
				fetchURL = urlLive;
			}

			//Send Details
			const rawResponse = await fetch(fetchURL, {
				method: "POST",
				mode: "cors",
				headers: new Headers({
					"Content-Type": "application/json",
					Accept: "application/json",
					HeaderTokens: JSON.stringify({
						refreshToken: auth.currentUser.refreshToken,
						authDomain: auth.currentUser.authDomain,
						uid: auth.currentUser.uid,
						email: auth.currentUser.email,
						hostname: auth.currentUser.hostname,
						hostname2: window.location.hostname,
					}),
				}),
				body: JSON.stringify({
					UUID: auth.currentUser.uuid,
				}),
			});
			const content = await rawResponse.json();
			console.log(content);
		}
		sendRequest();
	}

	//Run EndAPI Call To Functions
	async function runFunctionShutDown() {
		console.log("Running");
		require("firebase/functions");
		async function sendRequest(props) {
			//Emulator local url for development:
			let fetchURL = "";
			const urlLocal = `http://localhost:5002/hokubot/us-central1/FireFunctionShutDown`;

			//Live  url:
			const urlLive =
				"https://us-central1-hokubot.cloudfunctions.net/FireFunctionShutDown";

			if (useEmulator && window.location.hostname.includes("localhost")) {
				fetchURL = urlLocal;
			} else {
				fetchURL = urlLive;
			}

			//Send Details to Functions
			const rawResponse = await fetch(fetchURL, {
				method: "POST",
				mode: "cors",
				headers: new Headers({
					"Content-Type": "application/json",
					Accept: "application/json",
					HeaderTokens: JSON.stringify({
						refreshToken: auth.currentUser.refreshToken,
						authDomain: auth.currentUser.authDomain,
						uid: auth.currentUser.uid,
						email: auth.currentUser.email,
						hostname: auth.currentUser.hostname,
						hostname2: window.location.hostname,
					}),
				}),
				body: JSON.stringify({
					UUID: auth.currentUser.uuid,
				}),
			});
			const content = await rawResponse.json();
			console.log(content);
		}
		sendRequest();
	}
	function GetYouTubeOnlineDoc() {
		const docRef = useFirestore().collection("Secrets").doc("MetaData");
		const { data, status } = useFirestoreDocData(docRef);
		if (data) {
			if (status === "success") {
				if (data.TwitchOn === true) {
					return "Online ";
				} else {
					return "Offline ";
				}
			}
		} else return "...";
	}
	function GetTwitchOnlineDoc() {
		const docRef = useFirestore().collection("Secrets").doc("MetaData");
		const { data, status } = useFirestoreDocData(docRef);
		if (data) {
			if (status === "success") {
				if (data.TwitchOn === true) {
					return "Online ";
				} else {
					return "Offline ";
				}
			}
		} else return "...";
	}
	function GetDiscordOnDoc() {
		const docRef = useFirestore().collection("Secrets").doc("MetaData");
		const { data, status } = useFirestoreDocData(docRef);
		if (data) {
			if (status === "success") {
				if (data.DiscordOn === true) {
					return "Online ";
				} else {
					return "Offline ";
				}
			}
		} else return "...";
	}
	function GetTFirebaseOnlineDoc() {
		const docRef = useFirestore().collection("Secrets").doc("MetaData");
		const { data, status } = useFirestoreDocData(docRef);
		if (data) {
			if (status === "success") {
				if (data.FireConnected === true) {
					return "Online ";
				} else {
					return "Offline ";
				}
			}
		} else return "...";
	}
	function GetGeneratedTTSData() {
		const docRef = useFirestore().collection("Public").doc("GeneratedData");
		const { data, status } = useFirestoreDocData(docRef);
		if (data) {
			if (status === "success") {
				if (String(data.TTSString).length > 1) {
					return (
						String(String(data.TTSString)).replace("!tts", "") ||
						String(data.TTSString)
					);
				} else {
					return "";
				}
			}
		} else return "";
	}

	function GetUserTypingStats() {
		const docRef = useFirestore().collection("Users").doc(auth.currentUser.uid);
		const { data, status, error } = useFirestoreDocData(docRef);
		if (error) {
			return "Err";
		}
		if (data) {
			if (status === "success") {
				if (String(data.Stats).length > 1) {
					return String(
						"WPM:" +
							String(data.Stats.WPMAverage) +
							" WPM Record:" +
							String(data.Stats.WPMRecord) +
							"\r\n  CPM:" +
							String(data.Stats.CPMAverage) +
							" CPM Record:" +
							String(data.Stats.CPMRecord) +
							" \r\n Accuracy:" +
							String(data.Stats.Accuracy)
					);
				} else {
					return "";
				}
			}
		} else return "";
	}

	function GetGlobalClickStats() {
		const docRef = useFirestore().collection("Public").doc("GeneratedData");
		const { data, status, error } = useFirestoreDocData(docRef);
		if (error) {
			return "Err";
		}
		if (data) {
			if (status === "success") {
				if (String(data.Stats).length > 1) {
					return String(
						" AAR:" +
							String(data.GlobalClickData.aARoots) +
							"\r\nPM:" +
							String(data.GlobalClickData.PonoMap) +
							"\r\nMH:" +
							String(data.GlobalClickData.microHawaii)
					);
				} else {
					return "";
				}
			}
		} else return "";
	}

	function GetGeneratedData() {
		const docRef = useFirestore().collection("Public").doc("GeneratedData");
		const { data, status } = useFirestoreDocData(docRef);
		if (data) {
			if (status === "success") {
				if (String(data.RawText).length > 1) {
					return String(String(data.RawText));
				} else {
					return "Offline ";
				}
			}
		} else return "...";
	}
	return (
		<div>
			<span
				style={{
					marginTop: "-20px",
					marginRight: "10px",
					textAlign: "right",
					textShadow: " 0 0 5px #DDCCFF",
					color: "#DDEEFF",
					zIndex: 1012,
					justifyContent: "right",
					display: "right",
					float: "right",
				}}
			>
				<div
					style={{
						borderRadius: "50px",
						zIndex: 1012,
					}}
				>
					<button
						id="Popover1"
						className="zoom"
						style={{
							width: "45px",
							backgroundColor: "transparent",
							height: "45px",
							alignSelf: "right",
							float: "right",
							display: "flex",
							zIndex: 1012,
							position: "absolute",
							textAlign: "center",
							top: "5px",
							right: "10px",
							borderRadius: "50px",
							fontSize: "15px",
						}}
						onClick={(e) => {}}
					>
						<span
							style={{
								color: "whitesmoke",
								fontWeight: "1",
								fontFamily: "courier",
								backgroundColor: "transparent",
								textShadow: "1px 1px 15px #FFFFFF,1px 1px 15px #FFFFFF",
								zIndex: 999,
								borderRadius: "50%",
								position: "absolute",
								top: "7px",
								left: "6px",
							}}
						>
							<ImCogs size="28" />
							<Popover
								style={{
									position: "relative",
									zIndex: 1999,
									borderRadius: "50px",
								}}
								placement="bottom"
								isOpen={popoverOpen}
								target="Popover1"
								toggle={toggle}
							>
								<PopoverBody
									style={{
										backgroundColor: "black",

										zIndex: 1012,
										position: "relative",
										color: "white",
										textAlign: "center",
									}}
								>
									{" "}
									<div style={{ height: "10px" }}></div>
									<button
										onClick={() => {
											setTabName("Tasker");
										}}
										className="zoom"
										style={{
											width: "90px",
											backgroundColor: "#AA3322",
											height: "30px",
											borderRadius: "10px",
											fontSize: "15px",
										}}
									>
										<span
											style={{
												color: "whitesmoke",
												fontWeight: "1",
												fontFamily: "courier",
												textShadow: "1px 1px 15px #FFFFFF,1px 1px 15px #FFFFFF",
												fontSize: "18px",
												position: "relative",
												top: "2px",
											}}
										>
											Tasker
										</span>
									</button>
									<div style={{ height: "10px" }}></div>
									<button
										className="zoom"
										style={{
											width: "90px",
											backgroundColor: "#AA3322",
											height: "30px",
											borderRadius: "10px",
											fontSize: "15px",
										}}
										onClick={() => {
											firebase.auth().signOut() && window.location.reload();
										}}
									>
										<span
											style={{
												color: "whitesmoke",
												fontWeight: "1",
												fontFamily: "courier",
												textShadow: "1px 1px 15px #FFFFFF,1px 1px 15px #FFFFFF",
												fontSize: "18px",
												position: "relative",
												top: "2px",
											}}
										>
											SignOut
										</span>
									</button>
									<div style={{ height: "10px" }}></div>
									<button
										style={{
											height: "35px",
											width: "85px",
											backgroundColor: "darkgreen",
											borderRadius: "10px",
											color: "whitesmoke",
											fontWeight: "1",
											fontFamily: "courier",
											zIndex: 1012,
											position: "relative",
											fontSize: "22px",
										}}
										onClick={() => runFunction()}
									>
										Start
									</button>
									<div style={{ height: "10px" }}></div>
									<button
										style={{
											height: "35px",
											width: "75px",
											backgroundColor: "darkred",
											borderRadius: "10px",
											fontWeight: "1",
											fontFamily: "courier",
											zIndex: 1012,
											right: "15px",
											color: "whitesmoke",
											fontSize: "16px",
										}}
										onClick={() => runFunctionShutDown()}
									>
										Stop
									</button>
									<div style={{ height: "10px" }}></div>
								</PopoverBody>
							</Popover>
						</span>
					</button>
				</div>
				<span
					id="StatusSpan_1"
					onMouseOver={() => {
						if (!mouseOverTimeout)
							mouseOverTimeout = setTimeout(() => {
								document.getElementById("allOnlineStatuses").hidden = false;
							}, 250);
					}}
					onMouseLeave={() => {
						clearTimeout(mouseOverTimeout);
						document.getElementById("allOnlineStatuses").hidden = true;
					}}
					style={{ position: "relative", top: "-62px", right: "65px" }}
				>
					<span
						id="StatusSpan_2"
						style={{
							textAlign: "right",
							position: "relative",
							fontSize: "16px",
							zIndex: 12,
						}}
					>
						<span
							id="StatusSpan_3"
							style={{
								textAlign: "right",
								fontSize: "16px",
								position: "relative",
								zIndex: 12,
							}}
						>
							<span id="StatusSpan_4">Status :&nbsp;</span>
							<span
								id="StatusSpan_5"
								style={{ position: "relative", top: "5px", width: "50%", zIndex: 12 }}
							>
								<svg height="20" width="20">
									<circle
										cx="10"
										cy="10"
										r="10"
										stroke="black"
										strokeWidth="3"
										fill={isFirebaseConnected ? "#33AA33" : "#AA3333"}
									/>
								</svg>
							</span>{" "}
							<FirebaseAppProvider firebaseConfig={firebaseConfig}>
								<span id="isFireOnlineSpan">
									<GetTFirebaseOnlineDoc />
								</span>
							</FirebaseAppProvider>
						</span>{" "}
						<br />
					</span>
					<span
						id="allOnlineStatuses"
						hidden
						style={{
							textAlign: "right",
							position: "relative",
							fontSize: "16px",
							zIndex: 12,
						}}
					>
						<span>Twitch :&nbsp;</span>
						<span style={{ position: "relative", top: "5px", zIndex: 12 }}>
							<svg height="20" width="20">
								<circle
									cx="10"
									cy="10"
									r="10"
									stroke="black"
									strokeWidth="3"
									fill={isTwitchOnline ? "#33AA33" : "#AA3333"}
								/>
							</svg>
						</span>
						<FirebaseAppProvider firebaseConfig={firebaseConfig}>
							<span id="isTwitchOnlineSpan">
								<GetTwitchOnlineDoc />
							</span>
						</FirebaseAppProvider>
						<br />
						<span
							style={{
								textAlign: "right",
								position: "relative",
								fontSize: "16px",
								zIndex: 12,
							}}
						>
							<span>YouTube :&nbsp;</span>
							<span
								style={{
									position: "relative",
									top: "5px",
									width: "50%",
									zIndex: 12,
								}}
							>
								<svg height="20" width="20">
									<circle
										cx="10"
										cy="10"
										r="10"
										stroke="black"
										strokeWidth="3"
										fill={isYouTubeOn ? "#33AA33" : "#AA3333"}
									/>
								</svg>
							</span>
							<FirebaseAppProvider firebaseConfig={firebaseConfig}>
								<span id="isYouTubeOnlineSpan">
									<GetYouTubeOnlineDoc />
								</span>
							</FirebaseAppProvider>
						</span>
						<br />
						<span style={{ textAlign: "right", position: "relative", zIndex: 12 }}>
							<span>Discord :&nbsp;</span>
							<span
								style={{ position: "relative", top: "5px", width: "50%", zIndex: 12 }}
							>
								<svg height="20" width="20">
									<circle
										cx="10"
										cy="10"
										r="10"
										stroke="black"
										strokeWidth="3"
										fill={isDiscordOn ? "#33AA33" : "#AA3333"}
									/>
								</svg>
							</span>
							<FirebaseAppProvider firebaseConfig={firebaseConfig}>
								<span id="isDiscordOnSpan">
									<GetDiscordOnDoc />
								</span>
							</FirebaseAppProvider>
						</span>
					</span>
				</span>
			</span>
			<span
				style={{
					width: "100%",
					height: "350px",
					margin: "auto",
					textAlign: "left",
				}}
			>
				<FirebaseAppProvider firebaseConfig={firebaseConfig}>
					<span hidden={true} id="FireReadBox">
						<GetGeneratedData />
					</span>
					<span hidden={true} id="FireReadTTSBoxValue">
						<GetGeneratedTTSData />
					</span>
				</FirebaseAppProvider>
			</span>
			<span
				style={{
					textAlign: "left",
					float: "left",
					maxWidth: "50%",
					marginLeft: "5px",
				}}
			>
				{decideRenderGeneratedText()}
			</span>
			{decideRenderTabsFunction()}
		</div>
	);
}

export default ModeratorPage;
