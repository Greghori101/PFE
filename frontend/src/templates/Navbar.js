import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadNotification from "./LoadNotification";
import "./close.css";
import Notification from "./Notification";
import * as icon from "@fortawesome/free-solid-svg-icons";

function Navbar() {
    const [user, setUser] = useState([]);
    const [searchfield, setField] = useState("");
    const [user_id, setId] = useState(localStorage.getItem("user_id"));
    const [loading, setLoad] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token"));
    let selected = false;
    let data = {
        searchfield,
    };

    let history = useHistory();
    const logout = async () => {
        let url = "http://127.0.0.1:8000/api/logout";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };

        let response = await axios(options);
        if (response.status === 200) {
            localStorage.clear();
            history.push("/login");
        }
    };

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
        await axios(options)
            .then((res) => {
                let data = res.data;
                setUser(data);
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
    const search = async () => {
        history.push("/search/result/"+searchfield);
    window.location.reload(false);
    };

    useEffect(() => {
        getUser();
        AOS.init();
        AOS.refresh();
        setLoad(false);
    }, []);

    return (
        <nav className="navbar navbar-sm navbar-expand-lg navbar-fixed navbar-white">
            <div className="navbar-inner shadow-md">
                <button
                    type="button"
                    className="btn btn-burger align-self-center ml-25 mr-2 d-xl-flex btn-h-lighter-blue"
                    data-toggle="sidebar"
                    data-toggle-mobile="sidebar"
                    data-target="#sidebar"
                    aria-controls="sidebar"
                    aria-expanded="true"
                    aria-label="Toggle sidebar"
                >
                    <span className="bars text-default" />
                </button>

                <div
                    className="ml-auto mr-xl-3 navbar-menu collapse navbar-collapse navbar-backdrop "
                    id="navbarMenu"
                >
                    <ul className="nav align-items-center">
                        {/* search box for DESKTOP view only */}
                        <li className="d-lg-inline nav-item dd-backdrop dropdown dropdown-mega ">
                            {/* search box for desktop view */}
                            {/* it's a .dropdown-menu with custom position and width, etc */}
                            <a
                                className="nav-link dropdown-toggle px-35"
                                data-toggle="dropdown"
                                href="#"
                                role="button"
                            >
                                <i className="fa fa-search text-110 text-primary-m2" />
                            </a>
                            <div className="dropdown-menu dropdown-animated position-tl w-auto mw-none h-auto overflow-hidden border-0 p-0 bgc-white radius-0 shadow-none">
                                <div className="dropdown-clickable">
                                    {/* .dropdown-clickable, so dropdown won't be hidden when you click on it */}
                                    {/* by putting the search input inside a "FORM[data-submit=dismiss]" element, when we submit the form, dropdown will be hidden */}
                                    <form
                                        className="pos-rel d-flex align-items-center w-50 mx-auto pl-4 pl-lg-0"
                                        data-submit="dismiss"
                                        onSubmit={search}
                                    >
                                        <i className="fa fa-search text-primary-m2 mr-1" />
                                        {/* .autofocus input */}
                                        <input
                                        required
                                            type="text"
                                            className="form-control autofocus text-110 shadow-none mx-0 w-100 border-0 my-25 py-2"
                                            placeholder=" Start searching ..."
                                            aria-label="Search"
                                            onChange={(event)=>{setField(event.target.value)}}
                                        />
                                        {/* the close button */}
                                        <a
                                            data-dismiss="dropdown"
                                            className="position-rc py-0 mr-n5 btn btn-outline-lightgrey btn-h-outline-red btn-a-outline-red border-0 radius-1"
                                        >
                                            <span className="text-180">×</span>
                                        </a>
                                    </form>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div
                    className="navbar-menu navbar-collapse navbar-backdrop collapse "
                    id="navbarMenu"
                >
                    <div className="navbar-nav">
                        <ul className="nav">
                            <Notification />
                            <li className="nav-item dropdown order-first order-lg-last">
                                <a
                                    className="nav-link dropdown-toggle"
                                    data-toggle="dropdown"
                                    href="#"
                                    role="button"
                                    aria-haspopup="true"
                                    aria-expanded="true"
                                >
                                    <img
                                        id="id-navbar-user-image"
                                        className="d-none d-lg-inline-block radius-round border-2 brc-white-tp1 mr-2 w-6"
                                        src={
                                            "http://127.0.0.1:8000/files/" +
                                            user.profile_picture
                                        }
                                        alt="Jason's Photo"
                                        height={50}
                                        style={{ objectFit: "cover" }}
                                    />
                                    <span className="d-inline-block d-lg-none d-xl-inline-block">
                                        <span
                                            className="text-90"
                                            id="id-user-welcome"
                                        >
                                            Welcome,
                                        </span>
                                        <span className="nav-user-name capital">
                                            {user.firstname}
                                        </span>
                                    </span>
                                </a>
                                <div className="dropdown-menu dropdown-caret dropdown-menu-right dropdown-animated brc-primary-m3 py-1">
                                    <div className="d-none d-lg-block d-xl-none">
                                        <div className="dropdown-header capital">
                                            Welcome, {user.firstname}
                                        </div>
                                        <div className="dropdown-divider" />
                                    </div>
                                    <Link
                                        className="mt-1 dropdown-item btn btn-outline-grey bgc-h-primary-l3 btn-h-light-primary btn-a-light-primary"
                                        to={"profile"}
                                    >
                                        <i className="fa fa-user text-primary-m1 text-105 mr-1" />
                                        Profile
                                    </Link>
                                    <div className="dropdown-divider brc-primary-l2" />
                                    <a
                                        className="dropdown-item btn btn-outline-grey bgc-h-secondary-l3 btn-h-light-secondary btn-a-light-secondary"
                                        onClick={logout}
                                    >
                                        <i className="fa fa-power-off text-warning-d1 text-105 mr-1" />
                                        Logout
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
