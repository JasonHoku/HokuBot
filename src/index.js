import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorker from "./serviceWorker";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

ReactDOM.render(
	<React.StrictMode>
		<App /> <ToastContainer />
	</React.StrictMode>,
	document.getElementById("root")
);

if ("serviceWorker" in navigator) {
	serviceWorker.register();
	navigator.serviceWorker
		.register("/service-worker2.js")
		.then(function (registration) {
			console.log("Registration successful, scope is:", registration.scope);
		})
		.catch(function (error) {
			console.log("Service worker registration failed, error:", error);
		});
}
reportWebVitals();
