import firebase from "firebase/app";

import React, { useState, useEffect, useRef, useCallback } from "react";

export function DisplayTrendData() {
	const isInitialMount = useRef(true);
	const [trendArray, setTrendArray] = useState([]);

	useEffect(() => {
		console.log("State Refresh");
		if (isInitialMount.current) {
			isInitialMount.current = false;

			var db = firebase.firestore();

			const query = db.collection("TrendData");

			const observer = query.onSnapshot(
				(querySnapshot) => {
					var tempVar = [];
					querySnapshot.docs.forEach((el) => {
						tempVar.push({ doc: el.data(), id: el.id });
					});
					setTrendArray(tempVar);
					// return querySnapshot.docs();
					console.log(querySnapshot.docs[0].data());
					// ...
				},
				(err) => {
					console.log(`Encountered error: ${err}`);
				}
			);
			console.log(observer);
		}
	});

	return (
		<div
			style={{
				color: "whiteSmoke",
				textShadow: " 0 0 5px #DDDDDD",
				boxShadow: "0px  2px 3px 3px #221133",
			}}
		>
			<div style={{ height: "75px", boxShadow: "0px  2px 3px 3px #221133" }}></div>
			{/*  */}
			<span
				style={{
					margin: "auto",
					wordWrap: "break-word",
					boxShadow: "0px  2px 3px 3px #221133",
					background:
						"linear-gradient(to top,rgb(48, 25, 63) 99%,rgb(23, 14, 48) 100%)",
					alignItems: "",
				}}
			>
				{trendArray &&
					trendArray.map((mapEl, index) => {
						return (
							<div style={{ paddingLeft: "25px" }}>
								<span style={{ paddingLeft: "25px" }}>
									{String(new Date(parseInt(mapEl.id)).toDateString())}
									<span style={{ margin: "25px" }}>
										{mapEl.doc.arrayDailyTrends.map((eachTrendEl, index) => {
											return (
												<div>
													{index === 0 ? (
														<div style={{ padding: "25px" }}>{eachTrendEl.Source}</div>
													) : (
														""
													)}
													<span
														style={{
															margin: "auto",
															wordWrap: "break-word",
															boxShadow: "0px  2px 3px 3px #221133",
															background:
																"linear-gradient(to top,rgb(48, 25, 63) 99%,rgb(23, 14, 48) 100%)",
															alignItems: "",
														}}
													>
														<span
															id="Row1Col1"
															style={{
																boxShadow: "0px  2px 3px 3px #221133",
																textAlign: "center",
																float: "left",
															}}
														>
															{eachTrendEl.Title}
														</span>
														<span
															id="Row1Col1"
															style={{
																boxShadow: "0px  2px 3px 3px #221133",
																float: "right",
																textAlign: "right",
															}}
														>
															{eachTrendEl.Traffic}
														</span>
														<br />
													</span>
												</div>
											);
										})}{" "}
									</span>
								</span>
							</div>
						);
					})}
			</span>
		</div>
	);
}
