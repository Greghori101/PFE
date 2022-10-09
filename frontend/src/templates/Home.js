import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import $ from "jquery";
import jQuery from "jquery";
jQuery(function ($) {
    // enable Animation on scroll plugin
    try {
        AOS.init({
            once: true,
            duration: 550,
        });
    } catch (e) {
        // if AOS is not supported, remove the stylesheets so page elements become visible again
        $('link[href*="aos.css"],link[href*="aos.min.css"]').remove();
    }

    //////////////////////////////////////////////////////////////////
    /// now let's make navbar fixed after we scrolld down a little bit

    // instead of listening to window `scroll` event, we use `IntersectionObserver`
    // to observe 2 elements and determine when they become visible/invisible during scrolling

    // 1. when we scroll down, navbar becomes fixed
    // 2. when we scroll back up, it is still fixed until we reach document top
    // we observe 2 hidden elements (#scroll-down & #scroll-up) to determine when to do the above 1 & 2
    if (window.IntersectionObserver) {
        var observer = new window.IntersectionObserver(
            function (entries) {
                var entry = entries[0];
                if (entry.target.id == "scroll-down") {
                    // `#scroll-down`'s CSS position is `top: 60vh` and you can change it in CSS accordingly
                    // so when `intersectionRatio < 1` and `boundingClientRect.y < 0` , it means we have scrolled down to `top: 60vh`
                    // so let's make navbar fixed and compact
                    var isOut =
                        entry.intersectionRatio < 1 &&
                        entry.boundingClientRect.y < 0;
                    if (isOut) {
                        $(".navbar").addClass("navbar-fixed navbar-compact");
                    } else {
                        // otherwise we are scrolling up but still scrollTop > 0
                        $(".navbar").removeClass("navbar-compact");
                    }
                } else if (entry.target.id == "scroll-up") {
                    // `#scroll-up`'s CSS position is `top: 0`
                    // so when `intersectionRatio == 1` and `boundingClientRect.y >= 0` it means we have scrolled all the way up to `top: 0`
                    var isVisible =
                        entry.intersectionRatio == 1 &&
                        entry.boundingClientRect.y >= 0;
                    if (isVisible) {
                        $(".navbar").removeClass("navbar-fixed");
                    }
                }
            },
            {
                threshold: [1.0],
                delay: 100,
            }
        );

        observer.observe(document.getElementById("scroll-down"));
        observer.observe(document.getElementById("scroll-up"));
    }

    // also let's change #scroll-down's `top` value to (page-intro + navbar) height
    var topx =
        parseInt($("#page-intro-dark").height() + $(".navbar").height()) + 50;
    $("#scroll-down").css("top", topx + "px");

    // also on page reload (when scrolled down) there may be a weired gap
    // here's a temporary fix
    var scrollTop =
        document.scrollTop ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
    if (scrollTop >= topx) {
        setTimeout(function () {
            document.body.style.display = "none";
            setTimeout(function () {
                document.body.style.display = "";
            });
        });
    }

    //////////////////////////
});
function Home() {
    let history = useHistory();

    useEffect(() => {
        AOS.init();
        AOS.refresh();
    }, []);

    return (
        <div className="body-container">
            <div
                className="pos-abs"
                id="scroll-down"
                style={{ top: "422px" }}
            />
            <div className="pos-abs" id="scroll-up" />
            <nav className="navbar navbar-expand-lg navbar-darkblue">
                <div className="navbar-inner">
                    <div className="container">
                        <div className="navbar-intro justify-content-xl-between bgc-transparent">
                            <a
                                className="navbar-brand text-white text-180"
                                href="#"
                            >
                                <img
                                    src={
                                        window.location.origin +
                                        "/assets/image/logo.png"
                                    }
                                    style={{ height: "50px" }}
                                ></img>
                                <span>ESI</span>
                                <span className="text-70">Projects</span>
                            </a>
                        </div>
                        <div className="navbar-menu">
                            <div className="navbar-nav">
                                <ul className="nav nav-compact">
                                    <li className="nav-item px-lg-2 d-lg-flex flex-column justify-content-center">
                                        <Link
                                            to="/login"
                                            className=" d-lg-block h-auto btn btn-outline-white btn-bold radius-round border-2 border-light text-light px-2 px-xl-3"
                                        >
                                            Login
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="main-container bgc-white">
                <div role="main" className="main-content">
                    <div className="page-content p-0">
                        {/* the page intro for dark theme */}
                        <div className="page-intro pos-rel navbar-darkblue py-2 pt-xl-4 py-xl-5 text-white">
                            {/* some random circles */}
                            <div className="d-lg-block">
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.16",
                                        width: "4px",
                                        height: "4px",
                                        top: "30%",
                                        left: "85%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.2",
                                        width: "6px",
                                        height: "6px",
                                        top: "91%",
                                        left: "15%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.3",
                                        width: "8px",
                                        height: "8px",
                                        top: "1%",
                                        left: "87%",
                                    }}
                                ></div>
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.24",
                                        width: "6px",
                                        height: "6px",
                                        top: "0%",
                                        left: "70%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.17",
                                        width: "16px",
                                        height: "16px",
                                        top: "79%",
                                        left: "20%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.35",
                                        width: "6px",
                                        height: "6px",
                                        top: "10%",
                                        left: "0%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.17",
                                        width: "14px",
                                        height: "14px",
                                        top: "16%",
                                        left: "87%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.15",
                                        width: "17px",
                                        height: "17px",
                                        top: "82%",
                                        left: "71%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.2",
                                        width: "12px",
                                        height: "12px",
                                        top: "17%",
                                        left: "92%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.19",
                                        width: "12px",
                                        height: "12px",
                                        top: "44%",
                                        left: "64%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.27",
                                        width: "11px",
                                        height: "11px",
                                        top: "43%",
                                        left: "89%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.18",
                                        width: "9px",
                                        height: "9px",
                                        top: "55%",
                                        left: "25%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.38",
                                        width: "10px",
                                        height: "10px",
                                        top: "5%",
                                        left: "71%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.11",
                                        width: "9px",
                                        height: "9px",
                                        top: "62%",
                                        left: "22%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.39",
                                        width: "18px",
                                        height: "18px",
                                        top: "47%",
                                        left: "3%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.18",
                                        width: "6px",
                                        height: "6px",
                                        top: "12%",
                                        left: "20%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.34",
                                        width: "10px",
                                        height: "10px",
                                        top: "97%",
                                        left: "95%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.33",
                                        width: "7px",
                                        height: "7px",
                                        top: "74%",
                                        left: "87%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.17",
                                        width: "7px",
                                        height: "7px",
                                        top: "84%",
                                        left: "72%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.14",
                                        width: "9px",
                                        height: "9px",
                                        top: "7%",
                                        left: "23%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.39",
                                        width: "15px",
                                        height: "15px",
                                        top: "94%",
                                        left: "91%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.28",
                                        width: "14px",
                                        height: "14px",
                                        top: "60%",
                                        left: "83%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.3",
                                        width: "15px",
                                        height: "15px",
                                        top: "65%",
                                        left: "66%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.1",
                                        width: "7px",
                                        height: "7px",
                                        top: "3%",
                                        left: "95%",
                                    }}
                                ></div>
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.39",
                                        width: "10px",
                                        height: "10px",
                                        top: "20%",
                                        left: "53%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.14",
                                        width: "13px",
                                        height: "13px",
                                        top: "13%",
                                        left: "77%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.38",
                                        width: "13px",
                                        height: "13px",
                                        top: "76%",
                                        left: "13%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.19",
                                        width: "16px",
                                        height: "16px",
                                        top: "9%",
                                        left: "42%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.21",
                                        width: "16px",
                                        height: "16px",
                                        top: "37%",
                                        left: "69%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.11",
                                        width: "4px",
                                        height: "4px",
                                        top: "21%",
                                        left: "95%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.16",
                                        width: "10px",
                                        height: "10px",
                                        top: "76%",
                                        left: "74%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.16",
                                        width: "17px",
                                        height: "17px",
                                        top: "9%",
                                        left: "88%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.21",
                                        width: "15px",
                                        height: "15px",
                                        top: "79%",
                                        left: "131%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.37",
                                        width: "14px",
                                        height: "14px",
                                        top: "94%",
                                        left: "8%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.2",
                                        width: "9px",
                                        height: "9px",
                                        top: "65%",
                                        left: "87%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.1",
                                        width: "16px",
                                        height: "16px",
                                        top: "4%",
                                        left: "93%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.32",
                                        width: "18px",
                                        height: "18px",
                                        top: "36%",
                                        left: "81%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.35",
                                        width: "7px",
                                        height: "7px",
                                        top: "0%",
                                        left: "21%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.22",
                                        width: "11px",
                                        height: "11px",
                                        top: "69%",
                                        left: "82%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-white radius-round"
                                    style={{
                                        opacity: "0.32",
                                        width: "6px",
                                        height: "6px",
                                        top: "68%",
                                        left: "79%",
                                    }}
                                />
                            </div>
                            <div className="row container container-plus mx-auto mt-3 mb-5">
                                <div
                                    className="col-12 col-md-7 d-flex flex-column justify-content-center text-center aos-init aos-animate"
                                    data-aos="fade-right"
                                    data-aos-delay={100}
                                >
                                    <h1 className="align-self-center">
                                        <span className="text-110 text-yellow-l3">
                                            ESI Projects
                                        </span>
                                        <span className="text-90">
                                            
                                        </span>
                                    </h1>
                                    <h4 className="my-3 text-white text-120">
                                    A platform  with a new personality and user experience that improves online projects management for educators, learners and administrators.
                                    </h4>
                                    
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /#page-intro-dark */}
                        {/* the page intro for light theme */}
                        <div
                            id="page-intro-light"
                            className="d-none page-intro pos-rel bgc-primary-l4 py-2 pt-xl-4 py-xl-5 overflow-hidden"
                        >
                            {/* some random shapes */}
                            <div className="d-none d-lg-block">
                                <div
                                    className="pos-abs bgc-primary radius-round"
                                    style={{
                                        opacity: "0.25",
                                        width: "17px",
                                        height: "17px",
                                        top: "89%",
                                        left: "90%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-primary radius-round"
                                    style={{
                                        opacity: "0.36",
                                        width: "15px",
                                        height: "15px",
                                        top: "20%",
                                        left: "61%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-green radius-round"
                                    style={{
                                        opacity: "0.38",
                                        width: "10px",
                                        height: "10px",
                                        top: "78%",
                                        left: "93%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-primary radius-round"
                                    style={{
                                        opacity: "0.2",
                                        width: "12px",
                                        height: "12px",
                                        top: "13%",
                                        left: "64%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-primary radius-round"
                                    style={{
                                        opacity: "0.37",
                                        width: "18px",
                                        height: "18px",
                                        top: "27%",
                                        left: "88%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-green radius-round"
                                    style={{
                                        opacity: "0.31",
                                        width: "15px",
                                        height: "15px",
                                        top: "32%",
                                        left: "56%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-primary radius-round"
                                    style={{
                                        opacity: "0.34",
                                        width: "16px",
                                        height: "16px",
                                        top: "35%",
                                        left: "90%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-green radius-round"
                                    style={{
                                        opacity: "0.36",
                                        width: "17px",
                                        height: "17px",
                                        top: "76%",
                                        left: "32%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-green radius-round"
                                    style={{
                                        opacity: "0.3",
                                        width: "14px",
                                        height: "14px",
                                        top: "16%",
                                        left: "91%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-green radius-2px"
                                    style={{
                                        opacity: "0.25",
                                        width: "17px",
                                        height: "17px",
                                        top: "67%",
                                        left: "96%",
                                        transform: "rotate(355deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-primary radius-2px"
                                    style={{
                                        opacity: "0.39",
                                        width: "19px",
                                        height: "19px",
                                        top: "63%",
                                        left: "58%",
                                        transform: "rotate(325deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-orange radius-2px"
                                    style={{
                                        opacity: "0.26",
                                        width: "23px",
                                        height: "23px",
                                        top: "49%",
                                        left: "58%",
                                        transform: "rotate(280deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-primary radius-2px"
                                    style={{
                                        opacity: "0.27",
                                        width: "12px",
                                        height: "12px",
                                        top: "57%",
                                        left: "92%",
                                        transform: "rotate(354deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs brc-primary shape-triangle radius-1"
                                    style={{
                                        opacity: "0.39",
                                        borderWidth: "0 17px 27px 17px",
                                        top: "14%",
                                        left: "63%",
                                        transform: "rotate(130deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs brc-green shape-triangle radius-1"
                                    style={{
                                        opacity: "0.22",
                                        borderWidth: "0 12px 19px 12px",
                                        top: "15%",
                                        left: "97%",
                                        transform: "rotate(346deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs brc-orange shape-triangle radius-1"
                                    style={{
                                        opacity: "0.35",
                                        borderWidth: "0 19px 30px 19px",
                                        top: "69%",
                                        left: "82%",
                                        transform: "rotate(319deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs brc-green shape-triangle radius-1"
                                    style={{
                                        opacity: "0.31",
                                        borderWidth: "0 19px 30px 19px",
                                        top: "6%",
                                        left: "29%",
                                        transform: "rotate(59deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs brc-orange shape-triangle radius-1"
                                    style={{
                                        opacity: "0.21",
                                        borderWidth: "0 14px 22px 14px",
                                        top: "57%",
                                        left: "95%",
                                        transform: "rotate(333deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs brc-primary shape-triangle radius-1"
                                    style={{
                                        opacity: "0.24",
                                        borderWidth: "0 16px 25px 16px",
                                        top: "46%",
                                        left: "50%",
                                        transform: "rotate(33deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-primary radius-round"
                                    style={{
                                        opacity: "0.29",
                                        width: "18px",
                                        height: "18px",
                                        top: "11%",
                                        left: "78%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-green radius-round"
                                    style={{
                                        opacity: "0.34",
                                        width: "11px",
                                        height: "11px",
                                        top: "10%",
                                        left: "73%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-orange radius-round"
                                    style={{
                                        opacity: "0.31",
                                        width: "17px",
                                        height: "17px",
                                        top: "39%",
                                        left: "92%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-orange radius-2px"
                                    style={{
                                        opacity: "0.38",
                                        width: "19px",
                                        height: "19px",
                                        top: "79%",
                                        left: "14%",
                                        transform: "rotate(339deg)",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-primary radius-round"
                                    style={{
                                        opacity: "0.21",
                                        width: "14px",
                                        height: "14px",
                                        top: "85%",
                                        left: "14%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-green radius-round"
                                    style={{
                                        opacity: "0.27",
                                        width: "11px",
                                        height: "11px",
                                        top: "44%",
                                        left: "15%",
                                    }}
                                />
                                <div
                                    className="pos-abs bgc-primary radius-2px"
                                    style={{
                                        opacity: "0.25",
                                        width: "13px",
                                        height: "13px",
                                        top: "32%",
                                        left: "13%",
                                        transform: "rotate(331deg)",
                                    }}
                                />
                            </div>
                            <div className="row container container-plus mx-auto mt-4 mb-5">
                                <div
                                    className="col-12 col-md-7 d-flex flex-column justify-content-center text-center aos-init aos-animate"
                                    data-aos="fade-right"
                                    data-aos-delay={100}
                                >
                                    <h1 className="text-dark-m2 pb-2 align-self-center">
                                        <span className="text-blue-d3">
                                            Our tech
                                        </span>
                                        <span className="text-90">
                                            makes your life easier...
                                        </span>
                                    </h1>
                                    <h4 className="my-3 text-dark-tp2">
                                        Start using this amazing app and see
                                        instant results!
                                    </h4>
                                    <h6 className="my-3 bgc-blue-d2 text-120 text-white align-self-center p-2 radius-3px">
                                        Or put a slideshow here ...
                                    </h6>
                                    <div className="mt-1 mb-3">
                                        <div className="text-uppercase text-600 text-95 text-dark-m3 mb-1">
                                            Get it from
                                        </div>
                                        <a href="#" className="no-underline">
                                            <img
                                                alt="Google Play Button"
                                                src="assets/image/landing/google-play-badge.png"
                                                width={180}
                                            />
                                        </a>
                                        <a href="#" className="no-underline">
                                            <img
                                                alt="Apple Store Button"
                                                src="assets/image/landing/app-store-badge.svg"
                                                width={145}
                                            />
                                        </a>
                                    </div>
                                    <div className="mt-0 form-group">
                                        <select
                                            autoComplete="off"
                                            className="theme-select col-12 col-sm-6 col-lg-5 col-xl-4 mx-auto form-control ace-select border-1 bgc-white brc-info-m1 text-dark-m3 h-auto py-1"
                                        >
                                            <option value className="text-600">
                                                Change Theme/Color
                                            </option>
                                            <option
                                                value
                                                className="text-secondary-l3"
                                            >
                                                _______________________
                                            </option>
                                            <option
                                                value="darkblue"
                                                className="text-primary-d1 text-600"
                                            >
                                                Blue
                                            </option>
                                            <option
                                                value="teal"
                                                className="text-green-d1 text-600"
                                            >
                                                Green
                                            </option>
                                            <option
                                                value="purple"
                                                className="text-purple-d1 text-600"
                                            >
                                                Purple
                                            </option>
                                            <option
                                                value
                                                className="text-secondary-l3"
                                            >
                                                _______________________
                                            </option>
                                            <option
                                                value="light"
                                                className="bgc-primary-l3"
                                            >
                                                Light
                                            </option>
                                            <option value="white">White</option>
                                        </select>
                                    </div>
                                </div>
                                {/* /.col */}
                                <div
                                    className="col-12 col-md-5 order-first order-md-last mb-4 mb-md-0 aos-init aos-animate"
                                    data-aos="fade-left"
                                >
                                    <img
                                        alt="Product Image"
                                        src="assets/image/landing/preview.png"
                                        className="w-90 1mx-auto"
                                    />
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /#page-intro-light */}
                        <div className="bgc-white">
                            {/* or use a different color */}
                            <div className="container container-plus pos-rel mt-n5 text-center py-2">
                                <div className="row mt-n4">
                                    <div className="col-12 col-lg-10 col-xl-8 mx-auto">
                                        <div className="row my-4 aos-animate">
                                            {/* features */}
                                            <div
                                                className="col-12 col-md-4 mb-4 mb-md-0 aos-init aos-animate"
                                                data-aos="fade-up"
                                                data-aos-delay={300}
                                            >
                                                <div className="feature-item radius-2 bgc-white shadow-1 p-4 h-100">
                                                    <div className="d-inline-block pos-rel text-center py-2 px-3 text-150">
                                                        {/* the lines beneath icon */}
                                                        <div className="rotate-n45 brc-purple-m4 border-t-2 w-75 position-tl mt-35 mr-1" />
                                                        <div className="rotate-n45 brc-purple-m4 border-t-3 w-90 position-br mr-1 mb-425" />
                                                        <div className="rotate-n45 brc-purple-m4 border-t-2 w-90 position-bl mb-4 ml-35" />
                                                        <i className="fa fa-rocket fa-2x text-purple-d1 pos-rel" />
                                                    </div>
                                                    <h3 className="text-secondary-d3 text-160 my-3">
                                                        Speed
                                                    </h3>
                                                    <p className="text-dark-m3">
                                                    Increase your productivity
                                                    with our app.
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className="col-12 col-md-4 mb-4 mb-md-0 aos-init aos-animate"
                                                data-aos="fade-up"
                                                data-aos-delay={450}
                                            >
                                                <div className="feature-item radius-2 bgc-white shadow-1 p-4 h-100">
                                                    <div className="d-inline-block pos-rel text-center p-2 text-150">
                                                        {/* the lines beneath icon */}
                                                        <div className="brc-blue-m4 border-t-2 w-75 position-tl mt-3 ml-n2" />
                                                        <div className="brc-blue-m4 border-t-3 w-90 position-lc ml-n1 mt-n2" />
                                                        <div className="brc-blue-m4 border-t-2 w-90 position-bl mb-4 ml-n3" />
                                                        <i className="fa fa-running fa-2x text-blue-d1 pos-rel" />
                                                    </div>
                                                    <h3 className="text-secondary-d3 text-160 my-3">
                                                        Flexibility
                                                    </h3>
                                                    <p className="text-dark-m3">
                                                    Designed with flexibility in
                                                    mind.
                                                    </p>
                                                </div>
                                            </div>
                                            <div
                                                className="col-12 col-md-4 mb-4 mb-md-0 aos-init aos-animate"
                                                data-aos="fade-up"
                                                data-aos-delay={600}
                                            >
                                                <div className="feature-item radius-2 bgc-white shadow-1 p-4 h-100">
                                                    <div className="d-inline-block text-center p-2 text-150 pos-rel">
                                                        {/* the circles beneath icon */}
                                                        <div className="brc-orange-m4 border-2 w-3 h-3 radius-round position-tl mt-2 ml-n1" />
                                                        <div className="brc-orange-m4 border-2 w-2 h-2 radius-round position-tr mt-n1 ml-n1" />
                                                        <div className="brc-orange-m4 border-2 w-4 h-4 radius-round position-br mb-2" />
                                                        <i className="fa fa-key fa-2x text-orange pos-rel" />
                                                    </div>
                                                    <h3 className="text-secondary-d3 text-160 my-3">
                                                        Security
                                                    </h3>
                                                    <p className="text-dark-m3">
                                                    Best practices and no configuration issues or known vulnerabilities.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /.row */}
                                    </div>
                                    {/* /.col */}
                                </div>
                                {/* /.row */}
                            </div>
                            {/* /.container */}
                        </div>
                        <div className="bgc-white">
                            {/* or use a different color */}
                            <div className="container container-plus py-3 pos-rel">
                                {/* the large circle on right the green square on left */}
                                <div
                                    data-aos="zoom-in"
                                    className="d-none d-lg-block position-br bgc-purple-l3 mb-5 mr-5 opacity-1 radius-100 aos-init"
                                    style={{
                                        width: "180px",
                                        maxWidth: "80vw",
                                        height: "180px",
                                        maxHeight: "80vw",
                                    }}
                                />
                                <div
                                    data-aos="zoom-in"
                                    className="d-none d-lg-block position-lc bgc-success-l3 opacity-1 ml-5 mt-5 radius-1 aos-init"
                                    style={{ width: "100px", height: "100px" }}
                                />
                                <div className="row pt-45 mt-1 mt-lg-5">
                                    <div className="col-12 col-lg-10 col-xl-8 mx-auto">
                                        <div className="d-flex flex-column align-items-center flex-md-row align-items-md-start">
                                            <div
                                                className="radius-2 mt-1 mr-md-5 pos-rel aos-init"
                                                data-aos="fade"
                                            >
                                                {/* the small squares */}
                                                <div
                                                    className="position-tl bgc-grey-l3 mt-n45 ml-n45 radius-1"
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                    }}
                                                ></div>
                                                <div
                                                    className="position-br bgc-brown-l3 mb-n45 mr-n45 radius-1"
                                                    style={{
                                                        width: "110px",
                                                        height: "110px",
                                                    }}
                                                ></div>
                                                <div className="overflow-hidden radius-1 pos-rel border-1 p-2px brc-secondary-l2 bgc-white">
                                                    <img
                                                        alt="Do More"
                                                        src="assets/image/landing/do-more.jpeg"
                                                        width={220}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1 text-dark-tp3 mt-4 mt-md-0 ml-md-2">
                                                
                                            <h3
                                                    className="text-primary-d2 my-4 text-center text-md-left aos-init"
                                                    data-aos="fade-up"
                                                >
                                                    Students
                                                </h3>
                                                <div
                                                    data-aos="fade-up"
                                                    className="aos-init"
                                                >
                                                    <p>
                                                   It allow students who have projects
                                                    from the 2nd year until their graduation to find easier solutions in order to manage
                                                    their projects 
                                                    </p>
                                                    <p>
                                                    Simple way to choose groups, the choice of theme, the distribution of
                                                    projects, the progress of the defenses, as well as the results obtained.
                                                    </p>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /.col */}
                                </div>
                                {/* /.row */}
                            </div>
                            {/* /.container */}
                        </div>
                        <div className="bgc-white mt-4 mt-lg-5">
                            <div className="container container-plus py-2 py-lg-4">
                                <div className="row">
                                    <div className="col-12 col-lg-10 col-xl-8 mx-auto">
                                        <div className="d-flex flex-column align-items-center flex-md-row align-items-md-start">
                                            <div className="flex-grow-1 text-dark-tp3 mt-4 mt-md-0">
                                               
                                            <h3
                                                    data-aos="fade-up"
                                                    className="text-primary-d2 my-4 text-center text-md-left aos-init"
                                                >
                                                   Teachers & Administrators
                                                </h3>
                                                <div
                                                    data-aos="fade-up"
                                                    className="aos-init"
                                                >
                                                    <p>
                                                    The administrator will also interact with the website. 
                                                    </p>
                                                    <p>
                                                    It manages the entire system
so that there is no misinformation.
                                                    </p>
                                                    <p>
                                                    Admin can manage the information for
each function and each session throughout the period of the projects.
                                                    </p>
                                                    <p>
                                                    Teachers will also use the web application totheir own
themes in order to guide the students during their realization of the project.
</p>
                                                
                                                </div>
                                              
                                            </div>
                                            <div
                                                className="radius-2 mt-1 ml-md-5 pos-rel order-first order-md-last aos-init"
                                                data-aos="fade-left"
                                            >
                                                {/* the small circles */}
                                                <div
                                                    className="position-tr bgc-primary-l3 mt-n45 mr-n45 radius-100"
                                                    style={{
                                                        width: "80px",
                                                        maxWidth: "80vw",
                                                        height: "80px",
                                                        maxHeight: "80vw",
                                                    }}
                                                />
                                                <div
                                                    className="position-bl bgc-orange-l3 mb-n5 ml-n45 radius-100"
                                                    style={{
                                                        width: "100px",
                                                        maxWidth: "80vw",
                                                        height: "100px",
                                                        maxHeight: "80vw",
                                                    }}
                                                />
                                                <div className="overflow-hidden radius-1 pos-rel border-1 p-2px brc-secondary-l2 bgc-white">
                                                    <img
                                                        alt="Be Flexible"
                                                        src="assets/image/landing/be-flexible.jpeg"
                                                        width={220}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* /.col */}
                                </div>
                                {/* /.row */}
                            </div>
                            {/* /.container */}
                        </div>
                        {/* the 3 tabs ... So why is everybody choosing us? */}
                        <div className="bgc-white">
                            
                            
                            <div className="bgc-primary-l3">
                                <div className="container container-plus py-45">
                                    <div className="row">
                                        <div className="col-12 col-lg-9 mx-auto">
                                            <h3
                                                className="text-center text-dark-m3 mb-4 mb-md-5 aos-init"
                                                data-aos="fade-up"
                                            >
                                                Meet Our Team
                                            </h3>
                                            <div className="row justify-content-center mb-4 mb-md-5">
                                                <div
                                                    className="col-12 col-md-4 mb-2 mb-md-0 minh-100 aos-init aos-animate"
                                                    data-aos="fade-up"
                                                    data-aos-delay={50}
                                                >
                                                    <div className="text-center bgc-white p-45 radius-1 shadow-md minh-100 d-flex flex-column">
                                                        
                                                        <h4 className="mb-15">
                                                        Amir seif elislam Berkani
                                                        </h4>
                                                        <div>
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-grey-l3" />
                                                        </div>
                                                        <p className="mt-2 text-dark-tp3 text-95">
                                                          1SC Student
                                                        </p>
                                                        <p className="text-600 mb-0 mt-auto">
                                                          Back-End Developer 
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-12 col-md-4 mb-2 mb-md-0 minh-100 aos-init aos-animate"
                                                    data-aos="fade-up"
                                                    data-aos-delay={150}
                                                >
                                                    <div className="text-center bgc-white p-45 radius-1 shadow-md minh-100 d-flex flex-column">
                                                       
                                                        <h4 className="mb-15">
                                                             Ilyas Menaa
                                                        </h4>
                                                        <div>
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-grey-l3" />
                                                        </div>
                                                        <p className="mt-2 text-dark-tp3 text-95">
                                                        1SC Student
                                                        </p>
                                                        <p className="text-600 mb-0 mt-auto">
                                                            Back-End Developer 
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="col-12 col-md-4 mb-2 mb-md-0 minh-100 aos-init aos-animate"
                                                    data-aos="fade-up"
                                                    data-aos-delay={250}
                                                >
                                                    <div className="text-center bgc-white p-45 radius-1 shadow-md minh-100 d-flex flex-column">
                                                        
                                                        <h4 className="mb-15">
                                                            Mouatez Ghanemi
                                                        </h4>
                                                        <div>
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-grey-l3" />
                                                        </div>
                                                        <p className="mt-2 text-dark-tp3 text-95">
                                                        1SC Student
                                                        </p>
                                                        <p className="text-600 mb-0 mt-auto">
                                                            Back-End Developer 
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row justify-content-center ">
                                                <div
                                                    className="col-12 col-md-4 mb-2 mb-md-0 minh-100 aos-init"
                                                    data-aos="fade-up"
                                                    data-aos-delay={50}
                                                >
                                                    <div className="text-center bgc-white p-45 radius-1 shadow-md minh-100 d-flex flex-column">
                                                       
                                                        <h4 className="mb-15">
                                                            Hadil Nahoui
                                                        </h4>
                                                        <div>
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-grey-l3" />
                                                        </div>
                                                        <p className="mt-2 text-dark-tp3 text-95">
                                                        1SC Student
                                                        </p>
                                                        <p className="text-600 mb-0 mt-auto">
                                                            Front-End Developer 
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* /.col */}
                                                <div
                                                    className="col-12 col-md-4 mb-2 mb-md-0 minh-100 aos-init"
                                                    data-aos="fade-up"
                                                    data-aos-delay={150}
                                                >
                                                    <div className="text-center bgc-white p-45 radius-1 shadow-md minh-100 d-flex flex-column">
                                                        
                                                        <h4 className="mb-15">
                                                            Elhoussine Souala
                                                        </h4>
                                                        <div>
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                        </div>
                                                        <p className="mt-2 text-dark-tp3 text-95">
                                                        1SC Student
                                                        </p>
                                                        <p className="text-600 mb-0 mt-auto">
                                                          Front-End Developer 
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* /.col */}
                                                <div
                                                    className="col-12 col-md-4 mb-2 mb-md-0 minh-100 aos-init"
                                                    data-aos="fade-up"
                                                    data-aos-delay={250}
                                                >
                                                    <div className="text-center bgc-white p-45 radius-1 shadow-md minh-100 d-flex flex-column">
                                                       
                                                        <h4 className="mb-15">
                                                           Hanifa Tatoult
                                                        </h4>
                                                        <div>
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-orange" />
                                                            <i className="fa fa-star text-grey-l3" />
                                                        </div>
                                                        <p className="mt-2 text-dark-tp3 text-95">
                                                            1SC Student
                                                        </p>
                                                        <p className="text-600 mb-0 mt-auto">
                                                            Front-End Developer
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* /.col */}
                                            </div>
                                            {/* /.row */}
                                        </div>
                                        {/* /.col */}
                                    </div>
                                    {/* /.row */}
                                </div>
                                {/* /.container */}
                            </div>
                            <div className="footer h-auto">
                                <div className="footer-inner py-45">
                                    <div
                                        className="container container-plus aos-init"
                                        data-aos="fade"
                                    >
                                        <div className="row">
                                            <div className="col-12 col-lg-5">
                                            <img
                                                        alt="logo"
                                                        src="assets/image/logo.png"
                                                        width={220}
                                                    />
                                                <h2 className="text-dark-m3">
                                                  
                                                    ESI
                                                    <span className="text-75 text-dark-l2">
                                                        Projects
                                                    </span>
                                                </h2>
                                                <p className="text-90">
                                                    Projects Management Platform  
                                                </p>
                                                <div className="text-150 mt-2">
                                                    <i className="bgc-blue-m1 p-25 w-6 radius-round fab fa-twitter text-white mx-1" />
                                                    <i className="bgc-primary-d2 p-25 w-6 radius-round fab fa-facebook-square text-white mx-1" />
                                                    <i className="bgc-purple p-25 w-6 radius-round fab fa-instagram text-white mx-1" />
                                                </div>
                                            </div>
                                            <div className="col-12 col-lg-7 mt-5 mt-lg-0">
                                                <div className="row text-center text-lg-left">
                                                    <div className="col-8">
                                                        <h6 className="text-dark-tp3 text-95 text-600 mb-3">
                                                            CONTACT
                                                        </h6>
                                                        <div>
                                                            <a
                                                                href="#"
                                                                className="text-dark-tp4"
                                                            >
                                                                Email : contact@team-dev.com
                                                            </a>
                                                            <br />
                                                            <a
                                                                href="#"
                                                                className="text-dark-tp4"
                                                            >
                                                                Phone : 05 61 48 95 35 / 07 02 54 87 02
                                                            </a>
                                                            <br />
                                                            <a
                                                                href="#"
                                                                className="text-dark-tp4"
                                                            >
                                                                Address: 6958+WP4, Sidi Bel Abbès 22000
 
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /.row */}
                                    </div>
                                    {/* /.container */}
                                </div>
                                {/* /.footer-inner */}
                            </div>
                            {/* /.footer */}
                            <div className="text-center py-4 bgc-primary-l4 border-t-1 brc-primary-l3">
                                <span className="text-dark-m3 text-105">
                                    Copyright © 2022 Esi Projects
                                </span>
                            </div>
                            <div className="footer-tools">
                                <a
                                    href="#"
                                    className="btn-scroll-up btn btn-dark px-25 py-2 text-95 border-2 radius-round mb-2 mr-2"
                                >
                                    <i className="fa fa-arrow-up w-2 h-2" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* include common vendor scripts used in demo pages */}
            {/* include vendor scripts used in "Landing Page 1" page. see "/views//pages/partials/landing-page-1/@vendor-scripts.hbs" */}
            {/* include ace.js */}
            {/* demo.js is only for Ace's demo and you shouldn't use it */}
            {/* "Landing Page 1" page script to enable its demo functionality */}
        </div>
    );
}

export default Home;
