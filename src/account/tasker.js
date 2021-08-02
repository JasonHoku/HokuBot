import Draggable from "react-draggable"; // The default
import firebase from "firebase/app";

import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import React, { useState, useEffect, useRef, useCallback } from "react";

import { toast } from "react-toastify";

export function TaskerComponent(props) {
	const [toDoColWidth, setToDoColWidth] = useState("InAction");

	var colorToInt = parseInt("#106020".substr(1), 16),
		nstep = parseInt(-256 * 5);

	var incrementColor = function () {
		if (!isNaN(colorToInt) && !isNaN(nstep)) {
			colorToInt += nstep;
			var ncolor = colorToInt.toString(16); // Convert back integer to HEX
			ncolor = "#" + new Array(7 - ncolor.length).join(0) + ncolor; // Left pad "0" to make HEX look like a color
			if (/^#[0-9a-f]{6}$/i.test(ncolor)) {
				return ncolor;
			}
		}
		return "#000000";
	};

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
					display: "flex",
					margin: "auto",
					wordWrap: "break-word",
					boxShadow: "0px  2px 3px 3px #221133",
					background:
						"linear-gradient(to top,rgb(48, 25, 63) 99%,rgb(23, 14, 48) 100%)",
					alignItems: "",
				}}
			>
				<span
					style={{
						width:
							window.innerWidth > 800
								? "33vw"
								: toDoColWidth === "ToDo"
								? "50vw"
								: "24vw",
						boxShadow: "0px  2px 3px 3px #221133",
						textAlign: "center",
					}}
				>
					<span
						onClick={() => {
							setToDoColWidth("ToDo");
						}}
						style={{
							width:
								window.innerWidth > 800
									? "33vw"
									: toDoColWidth === "ToDo"
									? "50vw"
									: "24vw",
							textAlign: "center",
							float: "top",
							boxShadow: "0px  2px 3px 3px #221133",
						}}
					>
						To Do ({window.todoList.split("|$%$|").length - 1})
					</span>
					<br />
					<br />{" "}
					<span style={{ fontSize: "19px" }}>
						{props.gotToDoCollection.map((el, index) => {
							if (el.status === 0) {
								if (window.todoListCount === undefined) {
									window.todoListCount = 1;
								}
								window.todoListCount++;
								return (
									<button
										onClick={() => {
											async function runSetToDoActive() {
												var db = firebase.firestore();
												db
													.collection("ToDoCollection")
													.doc(el.title)
													.set(
														{
															status: 1,
															priority: 10,
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
																	Object.values(dbData).forEach((el) => {
																		if (el.timeStamp === null) {
																			console.log(" ");
																			console.log(el.title);
																			console.log(el.title);
																			console.log(el.title);
																			console.log(" ");
																			el.timeStamp =
																				firebase.firestore.FieldValue.serverTimestamp();
																		}
																	});

																	var sorted = Object.values(dbData).sort(function (a, b) {
																		if (b.timeStamp && a.timeStamp)
																			return (
																				new Date(b.timeStamp.toDate()) -
																				new Date(a.timeStamp.toDate())
																			);
																	});

																	props.setGotToDoCollection(sorted);
																});
														}, 250)
													);
											}
											runSetToDoActive();
										}}
										style={{
											maxWidth: "100%",
											wordWrap: "break-word",
											minHeight: "50px",
											fontSize: "22px",
											borderRadius: "25px",
											font: "'Montserrat', sans-serif",
											color: "whiteSmoke",
											backgroundColor:
												index < 49
													? String(String("#" + 56) + String(10) + String(50 + index))
													: "#6610AA",
										}}
										key={`TodoButton_${el.title}`}
									>
										<div
											style={{
												width: "20px",
												height: "20px",
												fontSize: "16px",
												borderRadius: "50%",
												top: "-5px",
												left: "-5px",
												position: "relative",
											}}
										></div>
										<span
											style={{
												padding: "10px",
												top: "-10px",
												position: "relative",
											}}
										>
											{" "}
											{el.title}{" "}
										</span>
									</button>
								);
							} else {
								return null;
							}
						})}
					</span>
				</span>
				<span
					onClick={() => {
						setToDoColWidth("InAction");
					}}
					style={{
						width:
							window.innerWidth > 800
								? "33vw"
								: toDoColWidth === "InAction"
								? "50vw"
								: "24vw",
						textAlign: "center",
						justifyContent: "flex-start",
						boxShadow: "0px  2px 3px 3px #221133",
					}}
				>
					<span
						style={{
							width:
								window.innerWidth > 800
									? "33vw"
									: toDoColWidth === "InAction"
									? "50vw"
									: "24vw",
							textAlign: "center",
							justifyContent: "flex-start",
							boxShadow: "0px  2px 3px 3px #221133",
						}}
					>
						In Action ({window.todoListAction.split("|$%$|").length - 1})
					</span>
					<br />
					{props.gotToDoCollection.map((el, index) => {
						if (el.status === 1 || el.status === 3) {
							return (
								<div
									style={{
										width: "100%",
										wordWrap: "break-word",
										minHeight: "50px",
										fontSize: "22px",
										borderRadius: "25px",
										marginBottom: "25px",
										marginTop: "25px",
										font: "'Montserrat', sans-serif",
										color: "whiteSmoke",
										backgroundColor: incrementColor(),
									}}
									key={`TodoButton_${el.title}`}
								>
									<div
										style={{
											width: "20px",
											height: "20px",
											fontSize: "16px",
											borderRadius: "50%",
											top: "-5px",
											left: "-5px",
											position: "relative",
										}}
									></div>
									<TextareaAutosize
										id={"InActionToDoTitleInput_" + el.title}
										onChange={(e) => {
											console.log(" ");
											console.log("Change To " + e.target.value);
											console.log("At " + el.title);
											console.log(" ");
											console.log(window.toDoData[el.title]);
											document.getElementById("InActionToDoTitleInput_" + el.title).value =
												e.target.value;
											async function runUpdateToDoTitle() {
												var db = firebase.firestore();
												await db
													.collection("ToDoCollection")
													.doc(el.title)
													.delete()
													.then(
														await db
															.collection("ToDoCollection")
															.doc(e.target.value)
															.set(
																{
																	title: e.target.value,
																	status: 1,
																	note: el.note,
																	priority: 10,
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

																			var sorted;
																			//
																			async function sortArray() {
																				sorted = Object.values(dbData).sort(function (a, b) {
																					return (
																						new Date(b.timeStamp.toDate()) -
																						new Date(a.timeStamp.toDate())
																					);
																				});
																			}
																			sortArray().then(props.setGotToDoCollection(sorted));
																		});
																}, 550)
															)
													);
											}
											runUpdateToDoTitle();
										}}
										type="textarea"
										defaultValue={el.title}
										style={{
											padding: "10px",
											marginBottom: "-25px",
											top: "-15px",
											fontSize: "20px",
											position: "relative",
											borderRadius: "25%",
											maxWidth: "88%",
											minWidth: "88%",
											textShadow: " 0 0 5px #DDDDDD",
											backgroundColor: "transparent",
											borderColor: String(
												"#" +
													String(Math.round(Math.random() * 3)) +
													String(Math.round(Math.random() * 3)) +
													String(Math.round(Math.random() * 3)) +
													String(Math.round(Math.random() * 3)) +
													"99"
											),
											color: "#DDDDDD",

											boxShadow:
												"0px " +
												String(Math.round(Math.random() * 1)) +
												"px " +
												String(Math.round(Math.random() * 1)) +
												"px 1px " +
												String(
													"#" +
														String(Math.round(Math.random() * 3)) +
														String(Math.round(Math.random() * 3)) +
														String(Math.round(Math.random() * 3)) +
														String(Math.round(Math.random() * 3)) +
														"99"
												),
										}}
									></TextareaAutosize>
									<div>
										{" "}
										<button
											onClick={() => {
												toast(
													<div>
														<div>
															<h1>Saving...</h1>
														</div>
													</div>,
													{ autoClose: 255 }
												);

												async function runUpdateToDoNote() {
													var db = firebase.firestore();
													await db
														.collection("ToDoCollection")
														.doc(el.title)
														.set(
															{
																title: el.title,
																note: document.getElementById(`ActionTaskInput_${el.title}`)
																	.value,
																status: 1,
																priority: 10,
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
																		//
																		toast(
																			<div>
																				<div>
																					<h1>Saved!</h1>
																				</div>
																				<br />
																				<br />
																				<div>
																					<h1>The Note: </h1>
																					{dbData[el.title].note}
																				</div>
																				<div>
																					<h1>Saved In: </h1> {dbData[el.title].title}
																				</div>
																			</div>
																		);
																		//
																		var sorted = Object.values(dbData).sort(function (a, b) {
																			return (
																				new Date(b.timeStamp.toDate()) -
																				new Date(a.timeStamp.toDate())
																			);
																		});
																		props.setGotToDoCollection(sorted);
																	});
															}, 250)
														);
												}
												runUpdateToDoNote();
											}}
											style={{
												textShadow: " 0 0 5px #DDDDDD",
												color: "#DDDDDD",
												top: "-10px",
												position: "relative",
												borderRadius: "50%",
												fontSize: "20px",
												backgroundColor: "transparent",
											}}
										>
											○
										</button>
										<TextareaAutosize
											type="textarea"
											defaultValue={el.note ? el.note : null}
											onChange={(e) => {
												console.log(" ");
												console.log("Change To " + e.target.value);
												console.log("At " + el.title);
												console.log(" ");
												console.log(window.toDoData[el.title]);
												document.getElementById(`ActionTaskInput_${el.title}`).value =
													e.target.value;
											}}
											rowsMin={2}
											id={`ActionTaskInput_${el.title}`}
											style={{
												margin: "3px",
												width: "70%",
												textShadow: " 0 0 5px #DDDDDD",
												position: "relative",
												backgroundColor: "transparent",
												color: "#DDDDDD",
												borderRadius: "20%",
											}}
										></TextareaAutosize>
									</div>

									<div style={{ top: "-15px", position: "relative" }}>
										<button
											onClick={() => {
												async function runTodoStash() {
													var db = firebase.firestore();
													db
														.collection("ToDoCollection")
														.doc(el.title)
														.set(
															{
																status: 0,
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

																		console.log(Object.values(dbData));

																		//
																		Object.values(dbData).forEach((el) => {
																			if (el.timeStamp === null) {
																				console.log(" ");
																				console.log(el.title);
																				console.log(el.title);
																				console.log(el.title);
																				console.log(" ");
																				el.timeStamp =
																					firebase.firestore.FieldValue.serverTimestamp();
																			}
																		});

																		var sorted = Object.values(dbData).sort(function (a, b) {
																			if (b.timeStamp && a.timeStamp)
																				return (
																					new Date(b.timeStamp.toDate()) -
																					new Date(a.timeStamp.toDate())
																				);
																		});

																		props.setGotToDoCollection(sorted);
																	});
															}, 250)
														);
												}
												runTodoStash();
											}}
											style={{
												textShadow: " 0 0 5px #9999DD",
												color: "#9999DD",
												borderRadius: "50%",
												backgroundColor: "transparent",
											}}
										>
											Stash
										</button>{" "}
										&nbsp;
										<button
											onClick={() => {
												var db = firebase.firestore();
												db
													.collection("ToDoCollection")
													.doc(el.title)
													.delete()
													.then(
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
																Object.values(dbData).forEach((el) => {
																	if (el.timeStamp === null) {
																		console.log(" ");
																		console.log(el.title);
																		console.log(el.title);
																		console.log(el.title);
																		console.log(" ");
																		el.timeStamp = {};
																		el.timeStamp =
																			firebase.firestore.FieldValue.serverTimestamp();
																	}
																});
																//

																var sorted = Object.values(dbData).sort(function (a, b) {
																	if (b.timeStamp && a.timeStamp)
																		return (
																			new Date(b.timeStamp.toDate()) -
																			new Date(a.timeStamp.toDate())
																		);
																});

																sorted.forEach((el) => {
																	if (el.status === 1) {
																		tempVar += String(el.title + " |$%$|");
																	}
																	if (el.status === 0) {
																		tempVar2 += String(el.title + " |$%$|");
																	}

																	if (el.status === 2) {
																		tempVar3 += String(el.title + " |$%$|");
																	}
																});

																props.setGotToDoCollection(sorted);
																window.todoListAction = tempVar;
																window.todoList = tempVar2;
																window.todoListFin = tempVar3;
																window.toDoData = dbData;
															})
													);
											}}
											style={{
												textShadow: " 0 0 5px #DD9999",
												color: "#DD9999",
												borderRadius: "50%",
												backgroundColor: "transparent",
											}}
										>
											{" "}
											Purge
										</button>{" "}
										&nbsp;
										<button
											onClick={() => {
												async function runFinToDo() {
													var db = firebase.firestore();
													await db
														.collection("ToDoCollection")
														.doc(el.title)
														.set(
															{
																status: el.status === 1 ? 2 : el.status === 3 ? 4 : "error",
																priority: 10,
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
																		window.activeToDoCounter--;

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
																			if (b.timeStamp && a.timeStamp)
																				return (
																					new Date(b.timeStamp.toDate()) -
																					new Date(a.timeStamp.toDate())
																				);
																		});
																		props.setGotToDoCollection(sorted);
																		window.toDoData = dbData;
																	});
															}, 250)
														);
												}
												runFinToDo();
											}}
											style={{
												textShadow: " 0 0 5px #DDcc99",
												color: "#DDcc99",
												borderRadius: "50%",
												backgroundColor: "transparent",
											}}
										>
											Fin
										</button>{" "}
										&nbsp; &nbsp;
										<button
											onClick={() => {
												async function toggleRepeatable() {
													var db = firebase.firestore();
													await db
														.collection("ToDoCollection")
														.doc(el.title)
														.set(
															{
																status: el.status === 1 ? 3 : el.status === 3 ? 1 : "error",
																priority: 10,
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
																		window.activeToDoCounter--;

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
																			if (b.timeStamp && a.timeStamp)
																				return (
																					new Date(b.timeStamp.toDate()) -
																					new Date(a.timeStamp.toDate())
																				);
																		});
																		props.setGotToDoCollection(sorted);
																		window.toDoData = dbData;
																	});
															}, 250)
														);
												}
												toggleRepeatable();
											}}
											style={{
												textShadow: " 0 0 5px #lightgreen",
												color: el.status === 3 ? "lightgreen" : "#DD9999",
												borderRadius: "50%",
												backgroundColor: "transparent",
											}}
										>
											Repeats
										</button>{" "}
										&nbsp;
									</div>
								</div>
							);
						} else {
							return null;
						}
					})}
				</span>
				<span
					onClick={() => {
						setToDoColWidth("Complete");
					}}
					style={{
						width:
							window.innerWidth > 800
								? "33vw"
								: toDoColWidth === "Complete"
								? "50vw"
								: "24vw",
						textAlign: "center",
						boxShadow: "0px  2px 3px 3px #221133",
					}}
				>
					<span
						style={{
							width:
								window.innerWidth > 800
									? "33vw"
									: toDoColWidth === "Complete"
									? "50vw"
									: "24vw",
							textAlign: "center",
							boxShadow: "0px  2px 3px 3px #221133",
						}}
					>
						Complete! ({window.todoListFin.split("|$%$|").length - 2})
					</span>
					<br />
					<br />
					{props.gotToDoCollection.map((el, index) => {
						if (el.status === 2 || el.status === 4) {
							return (
								<button
									onClick={() => {
										async function ressurectFin() {
											var db = firebase.firestore();
											await db
												.collection("ToDoCollection")
												.doc(el.title)
												.set(
													{
														status: el.status === 4 ? 3 : el.status === 2 ? 1 : "error",
														priority: 10,
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
																window.activeToDoCounter--;

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
																	if (b.timeStamp && a.timeStamp)
																		return (
																			new Date(b.timeStamp.toDate()) -
																			new Date(a.timeStamp.toDate())
																		);
																});
																props.setGotToDoCollection(sorted);
																window.toDoData = dbData;
															});
													}, 250)
												);
										}
										ressurectFin();
									}}
									style={{
										maxWidth: "100%",
										wordWrap: "break-word",
										minHeight: "50px",
										fontSize: "22px",
										borderRadius: "25px",
										font: "'Montserrat', sans-serif",
										color: "whiteSmoke",
										backgroundColor:
											index < 49
												? String(String("#" + 56) + String(10) + String(50 + index))
												: "#6610AA",
									}}
									key={`TodoFinButton_${el.title}`}
								>
									<div
										style={{
											width: "20px",
											height: "20px",
											fontSize: "16px",
											top: "-5px",
											left: "-5px",
											position: "relative",
											borderRadius: "50%",
										}}
									>
										{el.count}
									</div>

									<span style={{ padding: "10px", top: "-10px", position: "relative" }}>
										{" "}
										{el.title}
									</span>
								</button>
							);
						}
					})}
				</span>
			</span>
		</div>
	);
}
