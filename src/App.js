import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import "firebaseui/dist/firebaseui.css";
import AppAuth from "./account/AppAuth";
try {
	if (!firebase.apps.length) {
		firebase.initializeApp();
	}
} catch (error) {
	console.log(error);
}
function App() {
	return (
		<div className="App">
			<header className="App-header">
				<svg
					style={{ position: "absolute", top: "-85px", left: "-5px" }}
					height="150"
					width={String(window.innerWidth / 2)}
				>
					<ellipse cx="75" cy="75" rx="150" ry="75" fill="#000000" />
				</svg>
				{
					//  Header
				}
				<svg
					style={{ position: "absolute", top: "-95px", left: "155px" }}
					height="150"
					width={String(window.innerWidth / 2)}
				>
					<ellipse cx="75" cy="75" rx="150" ry="75" fill="#000000" />
				</svg>
				<svg
					style={{ position: "absolute", top: "-95px", right: "0px" }}
					height="150"
					width={String(window.innerWidth)}
				>
					<ellipse
						cx={String(window.innerWidth)}
						cy="75"
						rx={String(window.innerWidth)}
						ry="75"
						fill="#000000"
					/>
				</svg>
				<h2
					style={{
						fontFamily: "courier",
						fontWeight: "600",
						fontSize: "28px",
						marginLeft: "15px",
						color: "#DDCCFF",
						textShadow: "1px 1px 15px #DDCCFF,1px 1px 15px #DDCCFF",
						position: "relative",
						top: "-15px",
					}}
				>
					<a style={{ textDecoration: "none", color: "#DDCCFF" }} href="/">
						HokuBot
					</a>
				</h2>
				<AppAuth />
			</header>
		</div>
	);
}

export default App;
