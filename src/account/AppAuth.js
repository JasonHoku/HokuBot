import React, { useCallback, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";

import { Card, CardBody } from "reactstrap";

import ModeratorPage from "./ModeratorPage";

const UserContext = React.createContext({});
const UserProvider = UserContext.Provider;

const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE,
	authDomain: "hokubot.firebaseapp.com",
	projectId: "hokubot",
	storageBucket: "hokubot.appspot.com",
	messagingSenderId: "666507686643",
	appId: "1:666507686643:web:f3b631cd8a072b30753d86",
	measurementId: "G-FW16P1YXTP",
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

function onAuthStateChange(callback) {
	return firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			callback({ loggedIn: true, email: user.email, uid: user.uid });
		} else {
			callback({ loggedIn: false });
		}
	});
}
function logout() {
	firebase.auth().signOut() && window.location.reload();
}
function LogoutView() {
	return <div></div>;
}

var uiConfig = {
	callbacks: {
		signInSuccessWithAuthResult: function (authResult) {
			firebase
				.firestore()
				.collection("Users")
				.doc(authResult.user.uid)
				.set(
					{
						username: String(authResult.user.displayName),
						uuid: String(authResult.user.uid),
						email: String(authResult.user.email),
					},
					{ merge: true }
				);

			localStorage.setItem("username", authResult.user.displayName);
			localStorage.setItem("email", authResult.user.email);

			return false;
		},
	},
	// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
	signInFlow: "popup",
	signInOptions: [
		// Leave the lines as is for the providers you want to offer your users.
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		firebase.auth.EmailAuthProvider.PROVIDER_ID,
	],
	tosUrl: "/termsofservice",
	privacyPolicyUrl: "/privacy",
};
function AppAuth() {
	const [user, setUser] = useState({ loggedIn: false });

	function decideUserLoad() {
		if (user.loggedIn) {
			if (
				user.uid === "YQiArFggPrWYQeTWEIZ06oe5wHr2" ||
				user.uid === "YQiArFggPrWYQeTWEIZ06oe5wHr2"
			) {
				return (
					<span>
						<div>
							<ModeratorPage />
						</div>
					</span>
				);
			} else if (user.loggedIn) {
				return <span></span>;
			}
		}
	}

	useEffect(() => {
		var firebaseui = require("firebaseui");
		if (firebaseui.auth.AuthUI.getInstance()) {
			const ui = firebaseui.auth.AuthUI.getInstance();
			ui.start("#firebaseui-auth-container", uiConfig);
		} else {
			const ui = new firebaseui.auth.AuthUI(firebase.auth());
			ui.start("#firebaseui-auth-container", uiConfig);
		}
		const unsubscribe = onAuthStateChange(setUser);
		return () => {
			unsubscribe();
		};
	}, []);
	const requestLogout = useCallback(() => {
		logout();
	}, []);

	if (!user.loggedIn) {
		return (
			<Card
				style={{
					backgroundColor: "#CCCCCCC",
					boxShadow: "0px 0px 0px 5px rgba(50,50,50, .9)",
					borderRadius: "10px",
					opacity: 100,
					justifyContent: "center",
					marginLeft: "-5px",
					marginRight: "-5px",
					width: "90%",
					justifySelf: "center",
					alightSelf: "center",
					margin: "auto",
					color: "black",
					background:
						"linear-gradient(0.25turn, #103066FF, #222222DD,#222222DD,#222222DD,#222222DD,#222222DD,#222222DD,#222222DD,#222222DD,#222222DD, #103066FF)",
				}}
			>
				<CardBody
					style={{
						backgroundColor: "#303030",
						borderRadius: "10px",
						color: "black",
						background: "transparent",
						minHeight: "70vh",
					}}
				>
					<div
						style={{
							paddingLeft: "15px",
							paddingRight: "25px",
						}}
					>
						<h2
							style={{
								color: "white",
								textAlign: "center",
								paddingLeft: "25px",
								paddingRight: "25px",
							}}
						>
							<b> Authorization Required</b>
						</h2>
						<div
							style={{
								color: "black",
								maxWidth: "850px",
								position: "relative",
							}}
						>
							<h4
								style={{
									color: "white",
									textAlign: "left",
									maxWidth: "850px",
									position: "relative",
									margin: "50px",
								}}
							>
								<li>Perform administrative actions.</li>
								<br />
							</h4>
						</div>
						<div style={{ width: "100%", textAlign: "center" }}></div>
						<div id="firebaseui-auth-container">{decideUserLoad()}</div>
					</div>
				</CardBody>
			</Card>
		);
	} else {
		return (
			<UserProvider value={user}>
				<div id="firebaseui-auth-container">
					<LogoutView onClick={requestLogout} />
					{decideUserLoad()}
				</div>
			</UserProvider>
		);
	}
}
export default AppAuth;
