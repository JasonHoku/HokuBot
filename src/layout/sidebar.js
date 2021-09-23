import React, { Fragment, useEffect, useState, useRef } from "react";

import { Link } from "react-router-dom";

import { VscAccount } from "react-icons/vsc";

import { makeStyles } from "@material-ui/core/styles";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";

import "./sidebar.css";

const useStyles = makeStyles({
	list: {
		width: 250,
	},
	fullList: {
		width: "auto",
	},
});

export default function AppSidebar(routeProps, props2) {
	console.log("routeProps");
	console.log(routeProps, props2);

	const [navVar, setNavVar] = useState(window.location.pathname);

	const [drawerState, setDrawerState] = useState({
		left: false,
	});

	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			window.toggleSidebar = () => {
				setDrawerState({ left: true });
				toggleDrawer("left", true);
			};

			if (!window.navUpdater) {
				window.navUpdater = document.addEventListener("mousedown", () => {
					setTimeout(() => {
						setNavVar(window.location.pathname);
					}, 250);
				});
			}
		}
	});

	const toggleDrawer = (anchor, open) => (event) => {
		try {
			if (
				event.type === "keydown" &&
				(event.key === "Tab" || event.key === "Shift")
			) {
				return;
			}
		} catch (error) {}
		setDrawerState({ drawerState, [anchor]: open });
	};

	let anchor = "left";
	const list = (anchor) => (
		<Box
			sx={{ width: 250 }}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					zIndex: 99999,
					width: "250px",
				}}
			>
				<Link
					onClick={() => {
						if (caches) {
							caches.keys().then(function (names) {
								for (let name of names) caches.delete(name);
							});
						}
						if (window.location.pathname === "/") {
							window.location.reload();
						} else if (window.location.pathname === "/home") {
							window.location.reload();
						}
					}}
					aria-label="Home Page Link"
					to="/"
				>
					{/* <img
						alt="Logo"
						src="/images/sidebarLogo.webp"
						style={{
							position: "relative",
							width: "100%",
							height: "150px",
							objectFit: "scale-down",
						}}
					/>{" "} */}
					<div
						style={{
							position: "relative",
							width: "100%",
							height: "150px",
							objectFit: "scale-down",
							padding: "auto",
							margin: "auto",
							textAlign: "center",
						}}
					>
						<br />
						<h2>HokuBot Sidebar Not Yet Implemented</h2>
					</div>
				</Link>
				{/* {routeProps.routeProps &&
				Object.values(routeProps.routeProps).map((el) => {
					return (
						<Link
							key={`LinkKey_${el.url}`}
							onClick={() => {
								setState({ state, [anchor]: false });
							}}
							to={"/" + el.url}
						>
							<h4
								key={`h4Key_${el.url}`}
								style={{
									backgroundColor:
										window.location.pathname === "/" + el.url ? "#cfa24f" : "transparent",
								}}
							>
								<button
									key={`BTNKey_${el.url}`}
									className="gradientBtn"
									style={{ width: "100%" }}
								>
									<span
										key={`SPNKey_${el.url}`}
										className="metismenu-item"
										style={{ position: "relative", top: "-3px", left: "-20px" }}
									>
										<img
											key={`LinkICON_${el.url}`}
											alt="Golden Tree Icon"
											style={{ width: "35px", height: "35px" }}
											src="/images/smallTreeIcon.webp"
										/>
										&nbsp;&nbsp;&nbsp;
									</span>
									<span
										key={`SidebarLinkKey_${el.url}`}
										className="sidebarLinks"
										style={{ position: "relative", top: "-3px", left: "-10px" }}
									>
										{el.Title}
									</span>
								</button>
							</h4>
						</Link>
					);
				})} */}
				<h5 style={{ paddingLeft: "25px", color: "darkblue" }}>Sidebar Group 1</h5>
				<Link
					onClick={() => {
						setDrawerState({ left: false });
					}}
					to="/"
				>
					<h4
						style={{
							backgroundColor:
								window.location.pathname === "/" ? "#cfa24f" : "transparent",
						}}
					>
						<button className="gradientBtn" style={{ width: "100%" }}>
							<span
								className="metismenu-item"
								style={{ position: "relative", top: "-3px", left: "-15px" }}
							>
								<VscAccount
									color={window.location.pathname === "/" ? "blue" : "#caac65"}
								/>
								&nbsp;&nbsp;&nbsp;
							</span>
							<span
								className="sidebarLinks"
								style={{ position: "relative", top: "-3px" }}
							>
								Home
							</span>
						</button>
					</h4>
				</Link>{" "}
				<Link
					onClick={() => {
						setDrawerState({ left: false });
					}}
					to="/account"
				>
					<h4
						style={{
							backgroundColor:
								window.location.pathname === "/account" ? "#cfa24f" : "transparent",
						}}
					>
						<button className="gradientBtn" style={{ width: "100%" }}>
							<span
								className="metismenu-item"
								style={{ position: "relative", top: "-3px", left: "-15px" }}
							>
								<VscAccount
									color={window.location.pathname === "/account" ? "blue" : "#caac65"}
								/>
								&nbsp;&nbsp;&nbsp;
							</span>
							<span
								className="sidebarLinks"
								style={{ position: "relative", top: "-3px" }}
							>
								Login
							</span>
						</button>
					</h4>
				</Link>
			</div>
		</Box>
	);
	console.log("Got Sidebar Props");
	return (
		<Fragment>
			<Drawer
				style={{ width: "300px" }}
				anchor={anchor}
				open={drawerState[anchor]}
				onClose={toggleDrawer(anchor, false)}
			>
				{list(anchor)}
			</Drawer>
		</Fragment>
	);
}
