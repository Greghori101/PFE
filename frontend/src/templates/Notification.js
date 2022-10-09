import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AOS from "aos";
import Pusher from "pusher-js";
import LoadNotification from "./LoadNotification";
import "./close.css";
import axios from "axios";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [user_id, setId] = useState(localStorage.getItem("user_id"));
    const [loading, setLoad] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const options = {};

    const getNotifications = async () => {
        let url = "http://127.0.0.1:8000/api/notifications";
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
                setNotifications(data);
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
    const close = async (id) => {
        let url = "http://127.0.0.1:8000/api/notifications/seen/" + id;
        let options = {
            method: "put",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options)
            .then((res) => {
                getNotifications();
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };

    useEffect(() => {
        getNotifications();
        AOS.init();
        AOS.refresh();
        setLoad(false);
    }, []);

    return (
        <li className="nav-item dropdown dropdown-mega">
            <a
                className="nav-link dropdown-toggle pl-lg-3 pr-lg-4 d-flex align-items-center justify-content-center"
                data-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
            >
                <i className="fa fa-bell text-110 icon-animated-bell" />
                <span className="d-inline-block d-lg-none ml-2">
                    Notifications
                </span>
                {notifications.length > 0 ? (
                    <span
                        id="id-navbar-badge1"
                        className="badge badge-sm bgc-danger-d2 text-white radius-round text-85 border-1 brc-white-tp5"
                    >
                        {notifications.length}
                    </span>
                ) : (
                    ""
                )}
                <div className="dropdown-caret brc-white" />
            </a>
            <div className="dropdown-menu dropdown-sm dropdown-animated p-0 bgc-white brc-primary-m3 border-b-2 shadow">
                <ul
                    className="nav nav-tabs nav-tabs-simple w-100 nav-justified dropdown-clickable border-b-1 brc-secondary-l2"
                    role="tablist"
                >
                    <li className="nav-item">
                        <a
                            className="d-style px-0 mx-0 py-3 nav-link active text-600 brc-blue-m1 text-dark-tp5 bgc-h-blue-l4"
                            data-toggle="tab"
                            href="#navbar-notif-tab-1"
                            role="tab"
                        >
                            <span className="d-active text-blue-d1 text-105">
                                Notifications
                            </span>
                        </a>
                    </li>
                </ul>
                <div className="tab-content tab-sliding p-0">
                    <div
                        className="tab-pane mh-none show active px-md-1 pt-1"
                        id="navbar-notif-tab-1"
                        role="tabpanel"
                    >
                        {notifications.length > 0 ? (
                            <>
                                {notifications.slice(0, 6).map((note) => {
                                    return (
                                        <div key={note.id}>
                                            {note.type === "danger" ? (
                                                <div className="mb-0 border-0 list-group-item list-group-item-action btn-h-lighter-secondary d-flex justify-content-between align-items-center">
                                                    <div className=" d-flex justify-content-between align-items-center">
                                                        <FontAwesomeIcon
                                                            icon={
                                                                icon.faExclamationTriangle
                                                            }
                                                            class=" bgc-red-tp1 text-white  radius-2 mr-2 p-2"
                                                            style={{
                                                                overflow:
                                                                    "hidden",
                                                                width: "40px",
                                                                height: "40px",
                                                            }}
                                                        ></FontAwesomeIcon>
                                                        <span className="text-muted">
                                                            {note.title}
                                                        </span>
                                                    </div>
                                                    <a
                                                        onClick={() =>
                                                            close(note.id)
                                                        }
                                                        className="card-toolbar-btn text-danger"
                                                    >
                                                        <i class="fa fa-times"></i>
                                                    </a>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            {note.type === "info" ? (
                                                <div className="mb-0 border-0 list-group-item list-group-item-action btn-h-lighter-secondary d-flex justify-content-between align-items-center">
                                                    <div className=" d-flex justify-content-between align-items-center">
                                                        <FontAwesomeIcon
                                                            icon={
                                                                icon.faCircleInfo
                                                            }
                                                            class=" bgc-blue-tp1 text-white mr-2 p-2 radius-round"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                            }}
                                                        ></FontAwesomeIcon>
                                                        <span className="text-muted">
                                                            {note.title}
                                                        </span>
                                                    </div>
                                                    <a
                                                        onClick={() =>
                                                            close(note.id)
                                                        }
                                                        className="card-toolbar-btn text-danger"
                                                    >
                                                        <i class="fa fa-times"></i>
                                                    </a>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            {note.type === "invitation" ? (
                                                <div className="mb-0 border-0 list-group-item list-group-item-action btn-h-lighter-secondary d-flex justify-content-between align-items-center">
                                                    <div className=" d-flex justify-content-between align-items-center">
                                                        <FontAwesomeIcon
                                                            icon={
                                                                icon.faUserPlus
                                                            }
                                                            class=" bgc-blue-tp1 text-white mr-2 p-2 radius-round"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                            }}
                                                        ></FontAwesomeIcon>
                                                        <span className="text-muted">
                                                            {note.title}
                                                        </span>
                                                    </div>
                                                    <a
                                                        onClick={() =>
                                                            close(note.id)
                                                        }
                                                        className=" text-danger"
                                                    >
                                                        <i class="fa fa-times"></i>
                                                    </a>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            {note.type === "success" ? (
                                                <div className="mb-0 border-0 list-group-item list-group-item-action btn-h-lighter-secondary d-flex justify-content-between align-items-center">
                                                    <div className=" d-flex justify-content-between align-items-center">
                                                        <FontAwesomeIcon
                                                            icon={
                                                                icon.faCircleCheck
                                                            }
                                                            class="bgc-green-tp1 text-white mr-2 p-2 radius-round"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                            }}
                                                        ></FontAwesomeIcon>
                                                        <span className="text-muted">
                                                            {note.title}
                                                        </span>
                                                    </div>
                                                    <a
                                                        onClick={() =>
                                                            close(note.id)
                                                        }
                                                        className="card-toolbar-btn text-danger"
                                                    >
                                                        <i class="fa fa-times"></i>
                                                    </a>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            {note.type === "warning" ? (
                                                <div className="mb-0 border-0 list-group-item list-group-item-action btn-h-lighter-secondary d-flex justify-content-between align-items-center">
                                                    <div className=" d-flex justify-content-between align-items-center">
                                                        <FontAwesomeIcon
                                                            icon={
                                                                icon.faCircleExclamation
                                                            }
                                                            class=" bgc-orange-tp1 text-white mr-2 p-2 radius-round"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                            }}
                                                        ></FontAwesomeIcon>
                                                        <span className="text-muted">
                                                            {note.title}
                                                        </span>
                                                    </div>
                                                    <a
                                                        onClick={() =>
                                                            close(note.id)
                                                        }
                                                        className="card-toolbar-btn text-danger"
                                                    >
                                                        <i class="fa fa-times"></i>
                                                    </a>
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    );
                                })}
                                <hr className="mt-1 mb-1px brc-secondary-l2" />
                                <Link
                                    to={"/notifications"}
                                    className="mb-0 py-3 border-0 list-group-item text-blue text-uppercase text-center text-85 font-bolder"
                                >
                                    See All Notifications
                                    <i className="ml-2 fa fa-arrow-right text-muted" />
                                </Link>
                            </>
                        ) : loading ? (
                            <div className="d-flex justify-content-center m-4">
                                <LoadNotification />
                            </div>
                        ) : (
                            <div className="d-flex flex-column align-items-center justify-around p-3">
                                <i
                                    className="far fa-bell-slash mb-3 "
                                    style={{
                                        fontSize: "50px",
                                        color: "rgb(67 66 66)",
                                    }}
                                ></i>
                                <span>No notifications</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
}
export default Notification;
