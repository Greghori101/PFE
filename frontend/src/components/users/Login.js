import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import AOS from "aos";
import axios from "axios";
import "./login.css";
import { Link } from "react-router-dom";
import jQuery from "jquery";
import $ from "jquery";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    //handlers
    const [emailErr, setEmailErr] = useState(false);
    const [passwordErr, setPasswordErr] = useState(false);
    let history = useHistory();

    const login = async (event) => {
        event.preventDefault();
        const data = {
            email,
            password,
            remember,
        };
        let url = "http://127.0.0.1:8000/api/login";
        let options = {
            method: "POST",
            data,
            url: url,
            headers: {
                Accept: "Application/json",
            },
        };
        try {
            let response = await axios(options);
            if (response && response.status === 200) {
                Swal.fire({
                    title: "Go to dashboard",
                    text: "You are successfuly logged in .",
                    icon: "success",

                    iconColor: "#3dc00c",
                }).then(async () => {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user_id", response.data.user.id);
                    localStorage.setItem("role", response.data.user.role);
                    history.push("/dashboard");
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Bad credentials!",
                text: "Verify your email or password.",
                icon: "error",
            });
        }
    };

    const forgotPassword = async (event) => {
        event.preventDefault();
        const data = {
            email,
        };
        let url = "http://127.0.0.1:8000/api/forgotpassword";
        let options = {
            method: "POST",
            data,
            url: url,
            headers: {
                Accept: "Application/json",
            },
        };
        try {
            let response = await axios(options);
            if (response && response.status === 200) {
                Swal.fire({
                    title: "Go to Login",
                    text: "Password reseted successfuly.",
                    icon: "success",

                    iconColor: "#3dc00c",
                }).then(async () => {
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", response.data.user.id);
                    localStorage.setItem("role", response.data.user.roles);

                    history.push("/dashboard");
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Bad credentials!",
                text: "Email does not exist",
                icon: "error",
            });
        }
    };

    const Swal = require("sweetalert2");

    function emailHandler(item) {
        let pattern =
            /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z\-]{3,9}[\.][a-z]{2,5}/g;
        if (pattern.test(item)) {
            setEmailErr(false);

            setEmail(item);
        } else {
            setEmailErr(true);
        }
    }
    function passwordHandler(item) {
        if (item.length > 8) {
            setPasswordErr(false);
            setPassword(item);
        } else {
            setPasswordErr(true);
        }
    }
    jQuery(function ($) {
        // because "Login Here" and "Signup now" links are not inside a "UL" or ".nav", they preserve "active" class
        // and we should remove that, to be able to move between tab panes
        $('a[data-toggle="tab"]').on("click", function () {
            $('a[data-toggle="tab"]').removeClass("active");
        });

        // start/show carousel to change backgrounds
        $("#id-start-carousel").on("click", function (e) {
            e.preventDefault();
            $(".carousel-indicators").removeClass("d-none");
            $("#loginBgCarousel").carousel(1);
        });

        var isFullsize = false;

        // remove the background/carousel section
        // if you want a compact login page (without the carousel area), you should do so in your HTML
        // but in this demo, we modify HTML using JS
        $("#id-remove-carousel").on("click", function (e) {
            e.preventDefault();

            $("#id-col-intro").remove(); // remove the .col that contains carousel/intro
            $("#id-col-main").removeClass("col-lg-7"); // remove the col-* class name for the login area

            $("#row-1")
                .addClass("justify-content-center") // so .col is centered

                .find("> .col-12") // change .col-12.col-xl-10, etc to .col-12.col-lg-6.col-xl-5 (so our login area is 50% of document width in `lg` mode , etc)
                .removeClass("col-12 col-xl-10 offset-xl-1")
                .addClass(!isFullsize ? "col-12 col-lg-6 col-xl-5" : "");

            $(".col-md-8.offset-md-2.col-lg-6.offset-lg-3") // the input elements that are inside "col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3" columns
                // ... remove '.col-lg-6 offset-lg-3' (will become .col-md-8)
                .removeClass("col-lg-6 offset-lg-3");

            // remove "Welcome Back" etc titles that were meant for desktop, and show the other titles that were meant for mobile (lg-) view
            // because this compact login page is similar to mobile view
            $("h4").each(function () {
                var mobileTitle = $(this).parent().next();
                if (mobileTitle.hasClass("d-lg-none"))
                    mobileTitle.removeClass("d-lg-none").prev().remove();
            });
        });

        // make the login area fullscreen
        // if you want a fullscreen login page you should do so in your HTML
        // but in this demo, we modify HTML using JS
        $("#id-fullscreen").on("click", function (e) {
            e.preventDefault();
            if (window.navigator.msPointerEnabled)
                $(".body-container").addClass("h-100"); // for IE only

            isFullsize = true;

            $(".main-container").removeClass("container");

            $(".main-content")
                .removeClass("justify-content-center minh-100")
                .addClass("px-4 px-lg-0")
                .children()
                .attr(
                    "class",
                    "d-flex flex-column flex-lg-row flex-grow-1 my-3 m-lg-0"
                ); // removes padding classes and add d-flex, etc

            $("#row-1")
                .addClass("flex-grow-1")
                .find("> .col-12")
                .removeClass("shadow radius-1 col-xl-10 offset-xl-1")
                .addClass("d-lg-flex"); //remove shadow, etc from, the child .col and add d-lg-flex

            $("#row-2").addClass("flex-grow-1");

            $("#id-col-intro").removeClass("col-lg-5").addClass("col-lg-4");
            $("#id-col-main")
                .removeClass("col-lg-7 offset-2")
                .addClass(
                    "col-lg-6 mx-auto d-flex align-items-center justify-content-center"
                );
        });
    });

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token !== null && token !== "undefined") {
            //alert("");
            history.push("/dashboard");
        }

        AOS.init();
        AOS.refresh();
    }, []);
    return (
        <div className="body-container" style={{ overflow: "hidden" }}>
            <div className="main-container container bgc-transparent">
                <div className="main-content minh-100 justify-content-center align-items-center">
                    <div className="p-2 p-4">
                        <div className="row" id="row-1">
                            <div className="col overflow-hidden">
                                <div className="row d-flex justify-content-center align-items-center" id="row-2">
                                    <div
                                        id="id-col-intro"
                                        className="col-lg-5 d-none d-lg-flex  border-r-1 brc-default-l3 px-0"
                                        style={{height:"500px"}}
                                    >
                                        {/* the left side section is carousel in this demo, to show some example variations */}
                                        <div
                                            id="loginBgCarousel"
                                            className="carousel slide minw-100 h-100"
                                        >
                                            <ol className="d-none carousel-indicators">
                                                <li
                                                    data-target="#loginBgCarousel"
                                                    data-slide-to={0}
                                                    className="active"
                                                />
                                                <li
                                                    data-target="#loginBgCarousel"
                                                    data-slide-to={1}
                                                />
                                                <li
                                                    data-target="#loginBgCarousel"
                                                    data-slide-to={2}
                                                />
                                                <li
                                                    data-target="#loginBgCarousel"
                                                    data-slide-to={3}
                                                />
                                            </ol>
                                            <div className="carousel-inner minw-100 h-100">
                                                <div className="carousel-item active minw-100 h-100">
                                                    {/* default carousel section that you see when you open login page */}
                                                    <div
                                                        style={{
                                                            backgroundImage:
                                                                "url(assets/image/login-bg-1.svg)",
                                                        }}
                                                        className="px-3 bgc-blue-l4 d-flex flex-column align-items-center justify-content-center"
                                                    >
                                                        <img
                                                            className="mt-3 mb-2 "
                                                            src={
                                                                window.location
                                                                    .origin +
                                                                "/assets/image/logo.png"
                                                            }
                                                            style={{
                                                                height: "60px",
                                                            }}
                                                        />
                                                        <h2 className="text-d1 text-dark-l1">
                                                            ESI{" "}
                                                            <span className="text-80 text-dark-l1">
                                                                Projects
                                                            </span>
                                                        </h2>

                                                        <div className=" mx-5 text-dark-tp3">
                                                            <hr className="mb-3 mx-4  brc-black-tp10" />
                                                            <span className="text-120">
                                                                Application Full
                                                                Web de gestion
                                                                des projets à
                                                                l'École
                                                                Supérieure en
                                                                Informatique de
                                                                Sidi Bel-Abbés
                                                            </span>
                                                        </div>
                                                        <div className="mt-auto mb-4 text-dark-tp2">
                                                            TeamDev Company ©
                                                            2022
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        id="id-col-main"
                                        className="col-lg-5 py-lg-5 bgc-white px-0"
                                        
                                        style={{height:"500px"}}
                                    >
                                        {/* you can also use these tab links */}
                                        <ul
                                            className="d-none mt-n4 mb-4 nav nav-tabs nav-tabs-simple justify-content-end bgc-black-tp11"
                                            role="tablist"
                                        >
                                            <li className="nav-item mx-2">
                                                <Link
                                                    className="nav-link active px-2"
                                                    data-toggle="tab"
                                                    to="#id-tab-login"
                                                    role="tab"
                                                    aria-controls="id-tab-login"
                                                    aria-selected="true"
                                                >
                                                    Login
                                                </Link>
                                            </li>
                                        </ul>
                                        <div
                                            className="tab-content tab-sliding border-0 p-0"
                                            data-swipe="right"
                                        >
                                            <div
                                                className="tab-pane active mh-100 px-3 px-lg-0 pb-3"
                                                id="id-tab-login"
                                                data-swipe-prev="#id-tab-forgot"
                                            >
                                                {/* show this in desktop */}
                                                <div className="d-none d-lg-block col-md-6 offset-md-3 mt-lg-4 px-0">
                                                    <h4 className="text-dark-tp4 border-b-1 brc-secondary-l2 pb-1 text-130">
                                                        {/*<FontAwesomeIcon icon="fa-solid fa-hand-wave" /> */}
                                                        <i className="fa fa-computer text-grey-m2 ml-n4" />
                                                        Welcome Back!
                                                    </h4>
                                                </div>
                                                {/* show this in mobile device */}
                                                <div className="d-lg-none text-secondary-m1 my-4 text-center">
                                                    <img
                                                        className="mt-auto mb-3 "
                                                        height={120}
                                                        src={
                                                            window.location
                                                                .origin +
                                                            "/assets/image/logo.png"
                                                        }
                                                    />
                                                    <h1 className="text-170">
                                                        {" "}
                                                        Projects
                                                    </h1>
                                                    Welcome back !
                                                </div>
                                                <form
                                                    className="form-row mt-4"
                                                    onSubmit={login}
                                                >
                                                    <div className="form-group col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                                                        <div className="d-flex align-items-center input-floating-label text-blue brc-blue-m2">
                                                            <input
                                                                placeholder="Email"
                                                                type="email"
                                                                className="form-control form-control-lg pr-4 shadow-none"
                                                                id="id-login-email"
                                                                name="email"
                                                                required
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    emailHandler(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <i className="fa fa-user text-grey-m2 ml-n4" />
                                                            <label
                                                                className="floating-label text-grey-l1 ml-n3"
                                                                htmlFor="id-login-Email"
                                                            >
                                                                Email
                                                            </label>
                                                        </div>{" "}
                                                        {emailErr ? (
                                                            <div className="msgerror">
                                                                <span>
                                                                    It should be
                                                                    a valid
                                                                    email
                                                                    address!
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                    <div className="form-group col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-2 mt-md-1">
                                                        <div className="d-flex align-items-center input-floating-label text-blue brc-blue-m2">
                                                            <input
                                                                placeholder="Password"
                                                                type="password"
                                                                className="form-control form-control-lg pr-4 shadow-none"
                                                                id="id-login-password"
                                                                name="password"
                                                                required
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    passwordHandler(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <i className="fa fa-key text-grey-m2 ml-n4" />
                                                            <label
                                                                className="floating-label text-grey-l1 ml-n3"
                                                                htmlFor="id-login-password"
                                                            >
                                                                Password
                                                            </label>
                                                        </div>{" "}
                                                        {passwordErr ? (
                                                            <div className="msgerror">
                                                                <span>
                                                                    Invalid
                                                                    password!
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                    <div className="col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 text-right text-md-right mt-n2 mb-2">
                                                        <a
                                                            href="#"
                                                            className="text-primary-m1 text-95"
                                                            data-target="#id-tab-forgot"
                                                            data-toggle="tab"
                                                        >
                                                            Forgot Password?
                                                        </a>
                                                    </div>
                                                    <div className="form-group col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                                                        <label className="d-inline-block mt-3 mb-0 text-dark-l1">
                                                            <input
                                                                type="checkbox"
                                                                className="mr-1"
                                                                id="id-remember-me"
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    setRemember(
                                                                        event
                                                                            .target
                                                                            .checked
                                                                    );
                                                                }}
                                                            />
                                                            Remember me
                                                        </label>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary btn-block px-4 btn-bold mt-2 mb-4"
                                                        >
                                                            Sign In
                                                        </button>
                                                    </div>
                                                </form>
                                                
                                            </div>
                                            <div
                                                className="tab-pane mh-100 px-3 px-lg-0 pb-3"
                                                id="id-tab-forgot"
                                                data-swipe-prev="#id-tab-login"
                                            >
                                                <div className="position-tl ml-3 mt-2">
                                                    <Link
                                                        to="#"
                                                        className="btn btn-light-default btn-h-light-default btn-Link-light-default btn-bgc-tp"
                                                        data-toggle="tab"
                                                        data-target="#id-tab-login"
                                                    >
                                                        <i className="fa fa-arrow-left" />
                                                    </Link>
                                                </div>
                                                <div className="col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-5 px-0">
                                                    <h4 className="pt-4 pt-md-0 text-dark-tp4 border-b-1 brc-grey-l2 pb-1 text-130">
                                                        <i className="fa fa-key text-brown-m1 mr-1" />
                                                        Recover Password
                                                    </h4>
                                                </div>
                                                <form
                                                    className="form-row mt-4"
                                                    onSubmit={forgotPassword}
                                                >
                                                    <div className="form-group col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                                                        <label className="text-secondary-d3 mb-3">
                                                            Enter your email
                                                            address and we'll
                                                            send you the
                                                            instructions:
                                                        </label>
                                                        <div className="d-flex align-items-center">
                                                            <input
                                                                placeholder="Email"
                                                                type="email"
                                                                className="form-control form-control-lg pr-4 shadow-none"
                                                                id="id-login-email"
                                                                name="email"
                                                                required
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    emailHandler(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <i className="fa fa-envelope text-grey-m2 ml-n4" />
                                                        </div>{" "}
                                                        {emailErr ? (
                                                            <div className="msgerror">
                                                                <span>
                                                                    It should be
                                                                    a valid
                                                                    email
                                                                    address!
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                    <div className="form-group col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 mt-1">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-orange btn-block px-4 btn-bold mt-2 mb-4"
                                                        >
                                                            Continue
                                                        </button>
                                                    </div>
                                                </form>
                                                <div className="form-row w-100">
                                                    <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 d-flex flex-column align-items-center justify-content-center">
                                                        <hr className="brc-default-l2 mt-0 mb-2 w-100" />
                                                        <div className="p-0 px-md-2 text-dark-tp4 my-3">
                                                            <Link
                                                                className="text-blue-d1 text-600 btn-text-slide-x"
                                                                data-toggle="tab"
                                                                data-target="#id-tab-login"
                                                                to="#"
                                                            >
                                                                <i className="btn-text-2 fa fa-arrow-left text-110 align-text-bottom mr-2" />
                                                                Back to Login
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* .tab-content */}
                                    </div>
                                </div>
                                {/* /.row */}
                            </div>
                            {/* /.col */}
                        </div>
                        {/* /.row */}
                        <div className="d-lg-none my-3 text-white-tp1 text-center">
                            <i className="text-success-l3 mr-1 text-110" />{" "}
                            TeamDev Company © 2022
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Login;
