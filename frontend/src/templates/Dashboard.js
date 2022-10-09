import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";
import Moment from "moment";
import toast, { Toaster } from "react-hot-toast";

//import AnimatedNumbers from 'react-animated-numbers';

function Dashboard() {
    const [posts, setPost] = useState([]);
    const [user, setUser] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [welcome, setItem] = useState(localStorage.getItem("welcome"));
    const [loading, setLoad] = useState(true);
    const [user_id, setUserId] = useState(localStorage.getItem("user_id"));
    const [ls, setLs] = useState(0);
    const [lp, setLp] = useState(0);
    const [lt, setLt] = useState(0);
    const [lc, setLc] = useState(0);
    const urls = "http://127.0.0.1:8000/api";
    const [timer, setTimer] = useState(null);
    const notify = () =>
        toast("Hello World", {
            duration: 4000,
            // Styling
            style: {},
            className: "",
            // Custom Icon
            icon: "👏",
            // Change colors of success/error/loading icon
            iconTheme: {
                primary: "#000",
                secondary: "#fff",
            },
            // Aria
            ariaProps: {
                role: "status",
                "aria-live": "polite",
            },
        });

    const close = () => {
        localStorage.setItem("welcome", "displayed");
        setItem("displayed");
        clearTimeout(timer);
    };
    let history = useHistory();
    const goTo = async (id) => {
        history.push("/projects/" + id);
    };
    
    const getUser = async () => {
        let url = urls + "/users/" + user_id;
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options)
            .then((res) => {
                let data = res.data;
                setUser(data);
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
    const getProjects = async () => {
        let url = urls + "/projects/";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        console.log("options");
        await axios(options)
            .then((res) => {
                let data = res.data;
                setPost(data);

                setLoad(false);
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
    const setStatistics = async () => {
        let url = urls + "/statistics/";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options)
            .then((res) => {
                let data = res.data;
                setLt(data.lt);
                setLp(data.lp);
                setLs(data.ls);
                setLc(data.lc);
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
    useEffect(() => {
        if (token !== null) {
            getUser();
            setStatistics();
            if (welcome !== "displayed") {
                setTimer(
                    setTimeout(() => {
                        localStorage.setItem("welcome", "displayed");
                        setItem("displayed");
                    }, 10000)
                );
            }
                getProjects();
            
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <div className="page-content container container-plus">
            {welcome !== "displayed" ? (
                <div className="ace-toaster-container position-tc ">
                    <div className="toast-wrapper">
                        <div
                            className="toast ace-toaster-item fade-in-image text-white shadow overflow-hidden border-0 p-1 radius-3px fade show"
                            id="ace-toaster-item-1"
                            aria-atomic="true"
                            role="alert"
                            aria-live="assertive"
                            style={{ width: "420px" }}
                        >
                            <div className="d-flex">
                                <div className="toast-main">
                                    <div className="toast-header d-none" />
                                    <div className="toast-body border-0 text-white text-120 p-0 radius-1">
                                        {" "}
                                        <div className="position-tl w-100 h-100 bgc-black-tp6" />{" "}
                                        <div className="position-tl w-100 h-100 bgc-primary-tp4 opacity-4" />{" "}
                                        <div className="p-25 d-flex pos-rel">
                                            {" "}
                                            <span className="d-inline-block text-center mb-3 py-3 px-1">
                                                {" "}
                                                <i className="fa fa-leaf fa-2x w-6 text-white ml-0 mr-25" />{" "}
                                            </span>{" "}
                                            <div>
                                                {" "}
                                                <h3 className="text-125">
                                                    Welcome to ESI!
                                                </h3>{" "}
                                                In this layout,{" "}
                                                <span className="text-600">
                                                    sidebar
                                                </span>{" "}
                                                starts from{" "}
                                                <span className="bgc-yellow-l2 text-dark-m3 px-2px pb-2px radius-1">
                                                    top
                                                </span>{" "}
                                                of the page and <i>navbar</i> is
                                                inside content area.{" "}
                                            </div>{" "}
                                        </div>{" "}
                                        <div>
                                            {" "}
                                            <button
                                                onClick={close}
                                                className="btn btn-sm btn-outline-white btn-tp border-0 radius-round position-tr mt-15 mr-1"
                                            >
                                                {" "}
                                                <i className="fa fa-times px-1px" />{" "}
                                            </button>{" "}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}

            <h1 className="page-title text-primary-d2 text-150">Dashboard</h1>
            <div className="row px-2 mt-3 mb-4">
                <div className="col ">
                    <div className="ccard h-100 d-flex align-items-center p-3 shadow-lg overflow-hidden">
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-green-l3 opacity-3"
                            style={{ width: "5.25rem", height: "5.25rem" }}
                        />
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-green-l2 opacity-5"
                            style={{ width: "4.75rem", height: "4.75rem" }}
                        />
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-green-l1 "
                            style={{ width: "4.25rem", height: "4.25rem" }}
                        />

                        <div>
                            <span className="d-inline-block bgc-green-d1 p-3 radius-round text-center border-4 brc-green-l2">
                                <FontAwesomeIcon
                                    icon={icon.faFileCircleCheck}
                                    className="text-white text-170 w-4 h-4"
                                />
                            </span>
                        </div>
                        <div className="ml-3 flex-grow-1">
                            <div className="pos-rel">
                                <span className="text-dark-tp3 text-180">
                                    {/* <AnimatedNumbers
                                        value={lp}
                                        duration={1000}
                                        formatValue={(n) => n.toFixed(0)}
                                    /> */}
                                    {lp}
                                </span>
                            </div>
                            <div className="text-dark-tp4 text-110">
                                Approved Projects
                            </div>
                        </div>
                        {/* use a dropdown with tooltips for first info box */}
                    </div>
                    {/* /.bcard */}
                </div>
                {/* /.col */}
                <div className="col">
                    <div className="ccard h-100 d-flex align-items-center p-3 shadow-lg overflow-hidden">
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-orange-l3 opacity-3"
                            style={{ width: "5.25rem", height: "5.25rem" }}
                        />
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-orange-l2 opacity-5"
                            style={{ width: "4.75rem", height: "4.75rem" }}
                        />
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-orange-l1 "
                            style={{ width: "4.25rem", height: "4.25rem" }}
                        />
                        <div>
                            <span className="d-inline-block bgc-warning-d1 p-3 radius-round text-center border-4 brc-warning-l2">
                                <i className="fas fa-chalkboard-teacher text-white text-170 w-4 h-4"></i>
                            </span>
                        </div>
                        <div className="ml-3 flex-grow-1">
                            <div className="pos-rel">
                                <span className="text-dark-tp3 text-180">
                                    {lt}
                                </span>
                            </div>
                            <div className="text-dark-tp4 text-110">
                                Teachers
                            </div>
                        </div>
                    </div>
                    {/* /.bcard */}
                </div>
                {/* /.col */}
                <div className="col">
                    <div className="ccard h-100 d-flex align-items-center p-3 shadow-lg overflow-hidden">
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-purple-l3 opacity-3"
                            style={{ width: "5.25rem", height: "5.25rem" }}
                        />
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-purple-l2 opacity-5"
                            style={{ width: "4.75rem", height: "4.75rem" }}
                        />
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-purple-l1 "
                            style={{ width: "4.25rem", height: "4.25rem" }}
                        />
                        <div>
                            <span
                                className="d-inline-block  p-3 radius-round text-center border-4 brc-green-l2"
                                style={{ backgroundColor: "#5e6784" }}
                            >
                                <FontAwesomeIcon
                                    icon={icon.faUserTie}
                                    className="text-white text-170 w-4 h-4"
                                />
                            </span>
                        </div>
                        <div className="ml-3 flex-grow-1">
                            <div className="pos-rel">
                                <span className="text-dark-tp3 text-180">
                                    {lc}
                                </span>
                            </div>
                            <div className="text-dark-tp4 text-110">
                                Companies
                            </div>
                        </div>
                        {/* use a dropdown with tooltips for first info box */}
                    </div>
                    {/* /.bcard */}
                </div>
                {/* /.col */}
                <div className="col">
                    <div className="ccard h-100 d-flex align-items-center p-3 shadow-lg overflow-hidden">
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-blue-l3 opacity-3"
                            style={{ width: "5.25rem", height: "5.25rem" }}
                        />
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-blue-l2 opacity-5"
                            style={{ width: "4.75rem", height: "4.75rem" }}
                        />
                        <div
                            className="position-br	mb-n5 mr-n5 radius-round bgc-blue-l1 "
                            style={{ width: "4.25rem", height: "4.25rem" }}
                        />
                        <div>
                            <span className="d-inline-block bgc-primary p-3 radius-round text-center border-4 brc-primary-l2">
                                <FontAwesomeIcon
                                    icon={icon.faUsersLine}
                                    className="text-white text-170 w-4 h-4"
                                />
                            </span>
                        </div>
                        <div className="ml-3 flex-grow-1">
                            <div className="pos-rel">
                                <span className="text-dark-tp3 text-180">
                                    {ls}
                                </span>
                            </div>
                            <div className="text-dark-tp4 text-110">
                                Students
                            </div>
                        </div>
                    </div>
                    {/* /.bcard */}
                </div>
                {/* /.col */}
            </div>

            <h1 className="page-title text-primary-d2 text-150">
                All Proposed Projects
            </h1>
            {loading ? (
                <div className="row m-5 p-5">
                    <div className="col d-flex justify-content-center">
                        <Loading />
                    </div>
                </div>
            ) : posts.length === 0 ? (
                <div className="row justify-content-center pos-rel">
                    <div className="pos-rel col-12 col-sm-7 mt-1 mt-sm-3">
                        <div className="py-3 px-1 py-lg-4 px-lg-5">
                            <div className="text-center">
                                <i
                                    className="fas fa-box-open"
                                    style={{ fontSize: "80px" }}
                                ></i>
                            </div>
                            <div className="text-center">
                                <span className="text-150 text-primary-d2">
                                    Oops! There is no projects to display.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                posts.map((post, id) => {
                    return (
                        <div key={id} className="row">
                            <div className="col">
                                <div className="project shadow-lg">
                                    <label className="form-label project-title">
                                        {post.title}
                                    </label>
                                    

                                    <div className="row">
                                        <div className="col">
                                            <label className="form-label title">
                                                Summary
                                            </label>
                                            <p>
                                                {post.summary}
                                                <br />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col d-flex justify-content-between">
                                            <lable>
                                                Created by{" "}
                                                {post.author.firstname}{" "}
                                                {post.author.lastname} on{" "}
                                                {Moment(post.created_at).format(
                                                    "MMMM Do, YYYY"
                                                )}
                                            </lable>
                                            <button
                                                className="btn btn-primary more-details-btn"
                                                type="button"
                                                onClick={() => {
                                                    goTo(post.id);
                                                }}
                                            >
                                                More details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default Dashboard;
