import { Link } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import AOS from "aos";
import axios from "axios";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Sidebar() {
	const [role, setRole] = useState(localStorage.getItem("role"));
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [user_id, setId] = useState(localStorage.getItem("user_id"));
	const [user, setUser] = useState([]);
	const getUser = async () => {
		let url = "http://127.0.0.1:8000/api/users/" + user_id;
		let options = {
			method: "get",
			url: url,
			headers: {
				Authorization: "Bearer " + token,
				Accept: "Application/json",
			},
		};
		await axios(options).then((res) => {
			let data = res.data;
			setUser(data);
		});
	};
	useEffect(() => {
		getUser();
		AOS.init();
		AOS.refresh();
	}, []);
	return (
		<div
			id="sidebar"
			className="sidebar sidebar-light sidebar-color sidebar-fixed sidebar-backdrop expandable has-open"
			data-swipe="true"
			data-dismiss="true"
		>
			<div className="sidebar-inner">
				<div className="flex-grow-1 mt-1px ace-scroll" data-ace-scroll="{}">
					{/* all sidebar header is inside scrollable area */}
					{/* .navbar-brand inside sidebar, only shown in desktop view */}
					<div className="d-none d-xl-flex sidebar-section-item fadeable-left fadeable-top">
						<div className="fadeinable">
							{/* shown when sidebar is collapsed */}
							<div className="py-2 mx-1" id="sidebar-header-brand1">
								<a className="navbar-brand text-140">
									<img
										src={
											window.location.origin +
											"/assets/image/logo.png"
										}
										style={{
											borderRadius: "50%",
											backgroundColor: "white",
											margin: "5px",
											padding: "7px 0px 7px 0px",
											height: "50px",
											width: "50px",
										}}
									/>
								</a>
							</div>
						</div>
						<div className="fadeable w-100">
							{/* shown when sidebar is full-width */}
							<div
								className="py-2 text-center mx-3"
								id="sidebar-header-brand2"
							>
								<Link
									className="navbar-brand ml-n2 text-140 text-white d-flex align-items-center"
									to={"/"}
								>
									<img
										src={
											window.location.origin +
											"/assets/image/logo.png"
										}
										style={{
											borderRadius: "50%",
											backgroundColor: "white",
											margin: "5px",
											padding: "7px 0px 7px 0px",
											height: "50px",
											width: "50px",
										}}
									/>
									ESI <span> Projects</span>
								</Link>
							</div>
						</div>
					</div>
					{/* /.sidebar-section-item  */}
					{/* the user avatar and image */}
					<div className="sidebar-section-item pt-2 fadeable-left fadeable-top">
						<div className="fadeinable">
							<img
								src={
									"http://127.0.0.1:8000/files/" + user.profile_picture
								}
								width={50}
								height={50}
								style={{ objectFit: "cover" }}
								className="p-2px border-2 brc-primary-tp2 radius-round"
							/>
						</div>
						<div className="fadeable hideable">
							<div className="py-2 d-flex flex-column align-items-center">
								<img
									src={
										"http://127.0.0.1:8000/files/" +
										user.profile_picture
									}
									className="p-2px border-2 brc-primary-m2 radius-round"
									width={"50px"}
									height={"50px"}
									style={{ objectFit: "cover" }}
								/>
								<div className="text-center mt-1" id="id-user-info">
									<a
										href="#id-user-menu"
										className="d-style pos-rel text-orange-l2 accordion-toggle no-underline bgc-h-white-tp9 radius-1 px-1 py-2px collapsed"
										data-toggle="collapse"
										aria-expanded="false"
									>
										<span className="text-95 font-bolder capital">
											{user.firstname} {user.lastname}{" "}
										</span>
										<i className="fa fa-caret-down text-90 d-collapsed" />
										<i className="fa fa-caret-up text-90 d-n-collapsed" />
									</a>
									<div className="text-white text-85 capital">
										{user.role}
									</div>
								</div>
								{/* /#id-user-info */}
								<div className="collapse" id="id-user-menu">
									<div className="mt-3 d-flex justify-content-around">
										<Link
											to={"/notifications"}
											className="btn bgc-white btn-h-outline-blue py-2 px-1 m-1"
										>
											<i className="fa fa-envelope w-4 text-110 text-blue-m2" />
										</Link>
										<Link
											to={"/search/result"}
											className="btn bgc-white btn-h-outline-purple py-2 px-1 m-1"
										>
											<i className="fa fa-search w-4 text-110 text-purple-m2" />
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
					<nav aria-label="Main">
						<ul className="nav flex-column mt-2 has-active-border active-on-top">
							<li className="nav-item-caption">
								<span className="fadeable pl-3">MAIN</span>
								<span className="fadeinable mt-n2 text-125">…</span>
							</li>
							<li className="nav-item">
								<Link to={"/dashboard"} className="nav-link">
									<i className="fas fa-tachometer-alt nav-icon"></i>
									<span className="nav-text fadeable">Dashboard</span>
								</Link>
							</li>
							<li className="nav-item">
								<Link to={"/profile"} className="nav-link ">
									<i className="fas fa-user nav-icon"></i>
									<span className="nav-text fadeable">Profile</span>
								</Link>
							</li>
							{role === "teacher" || role === "company" ? (
								<li className="nav-item">
									<Link to={"/projects/mine"} className="nav-link">
										<FontAwesomeIcon
											icon={icon.faFolderTree}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">
											My Projects
										</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "teacher" || role === "company" ? (
								<li className="nav-item">
									<Link to={"/projects/add"} className="nav-link ">
										<i className="fas fa-folder-plus nav-icon"></i>
										<span className="nav-text fadeable">
											Propose Project
										</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "admin" ? (
								<li className="nav-item">
									<Link to={"/levels"} className="nav-link ">
										<FontAwesomeIcon
											icon={icon.faLevelUpAlt}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">Levels</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "admin" ? (
								<li className="nav-item">
									<Link to={"/users"} className="nav-link  ">
										<i className="fas fa-users nav-icon"></i>
										<span className="nav-text fadeable">Users</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "admin" ? (
								<li className="nav-item">
									<Link to={"/projects"} className="nav-link">
										<FontAwesomeIcon
											icon={icon.faFolderTree}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">
											View All Projects
										</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "student" ? (
								<li className="nav-item">
									<Link to={"/myproject"} className="nav-link  ">
										<FontAwesomeIcon
											icon={icon.faFileArchive}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">
											My Project
										</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "admin" ? (
								<li className="nav-item">
									<Link to={"/teamleaders"} className="nav-link ">
										<FontAwesomeIcon
											icon={icon.faTable}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">
											Team Leaders
										</span>
									</Link>
								</li>
							) : (
								""
							)}{" "}
							{role === "admin" ? (
								<li className="nav-item">
									<Link to={"/supervisors"} className="nav-link ">
										<FontAwesomeIcon
											icon={icon.faUserLock}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">
											Supervisors
										</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "admin" ? (
								<li className="nav-item">
									<Link to={"/groups"} className="nav-link  ">
										<FontAwesomeIcon
											icon={icon.faPeopleGroup}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">Groups</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "teacher" ? (
								<li className="nav-item">
									<Link to={"/mygroups"} className="nav-link  ">
										<FontAwesomeIcon
											icon={icon.faPeopleGroup}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">
											My Groups
										</span>
									</Link>
								</li>
							) : (
								""
							)}
							<li className="nav-item">
								<Link to={"/planing"} className="nav-link  ">
									<FontAwesomeIcon
										icon={icon.faCalendarDays}
										className="nav-icon"
									/>
									<span className="nav-text fadeable">Planning</span>
								</Link>
							</li>
							{role === "admin" ? (
								<li className="nav-item">
									<Link to={"/planing/add"} className="nav-link  ">
										<FontAwesomeIcon
											icon={icon.faCalendarPlus}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">
											Add Events
										</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "admin" ? (
								<li className="nav-item">
									<Link
										to={"/archive/projects"}
										className="nav-link  "
									>
										<FontAwesomeIcon
											icon={icon.faArchive}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">
											Archived Projects
										</span>
									</Link>
								</li>
							) : (
								""
							)}
							{role === "admin" ? (
								<li className="nav-item">
									<Link to={"/archive/users"} className="nav-link  ">
										<FontAwesomeIcon
											icon={icon.faUserSecret}
											className="nav-icon"
										/>
										<span className="nav-text fadeable">
											Archived Users
										</span>
									</Link>
								</li>
							) : (
								""
							)}
						</ul>
						<br /> <br /> <br /> <br />
					</nav>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
