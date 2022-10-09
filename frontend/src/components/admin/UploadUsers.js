import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { Swal } from "sweetalert2";
import axios from "axios";
import AOS from "aos";
import * as XLSX from "xlsx";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";

function UploadUsers({getUsers,levels}) {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const Swal = require("sweetalert2");
    const [showEditForm, setShowEditForm] = useState(false);
    const [numbers, setNumbers] = useState([]);

    const [token, setToken] = useState(localStorage.getItem("token"));
    const user_id = localStorage.getItem("user_id");
    const urls = "http://127.0.0.1:8000/api";

    let history = useHistory();

    const onChangeXsl = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            const json = XLSX.utils.sheet_to_json(ws);
            json.map(async (user) => {
                event.preventDefault();
                console.log(user);
                let data = user;
                let url = urls + "/register";
                let options = {
                    method: "POST",
                    url: url,
                    data,

                    headers: {
                        Authorization: "Bearer " + token,
                        Accept: "application/json",
                    },
                };
                let response = await axios(options);
                if (response) {
                    if (response.status === 200) {
                        toast("Hello World", {
                            duration: 4000,
                            // Styling
                            type: "success",
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
                    }
                }
            });

            getUsers();
        };
        reader.readAsBinaryString(file);
    };

   

    const showing = () => {
        setShowForm(!showForm);
    };

    useEffect(() => {
        if (token !== null) {
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <div className="card">
                <div className="card-body">
                    <div id="smartwizard-1" className="d-none mx-n3 mx-sm-auto">
                        <ul className="mx-auto">
                            <li className="wizard-progressbar" />
                            {/* the progress line connecting wizard steps */}
                            <li>
                                <a href="#step-1">
                                    <span className="step-title">1</span>
                                    <span className="step-title-done">
                                        <i className="fa fa-check text-success" />
                                    </span>
                                </a>
                                <span className="step-description">
                                    Validation States
                                </span>
                            </li>
                            <li>
                                <a href="#step-2">
                                    <span className="step-title">2</span>
                                    <span className="step-title-done">
                                        <i className="fa fa-check text-success" />
                                    </span>
                                </a>
                                <span className="step-description">Alerts</span>
                            </li>
                            <li>
                                <a href="#step-3">
                                    <span className="step-title">3</span>
                                    <span className="step-title-done">
                                        <i className="fa fa-check text-success" />
                                    </span>
                                </a>
                                <span className="step-description">
                                    Payment Info
                                </span>
                            </li>
                            <li>
                                <a href="#step-4">
                                    <span className="step-title">4</span>
                                    <span className="step-title-done">
                                        <i className="fa fa-check text-success" />
                                    </span>
                                </a>
                                <span className="step-description">
                                    Other Info
                                </span>
                            </li>
                        </ul>
                        <div className="px-2 py-2 mb-4">
                            <div id="step-1">
                                <form>
                                    <h3 className="font-light text-primary my-4">
                                        Select Role{" "}
                                    </h3>
                                </form>
                                {/* if "Input Validation" is selected, we should validate this form before going to next step */}
                            </div>
                            <div id="step-2">
                                <div className="row">
                                    <div className="col-12 col-xl-10 offset-xl-1">
                                        <h3 className="font-light text-primary my-4">
                                            Upload excel file
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div id="step-3" className="text-center">
                                <h3 className="font-light text-primary my-4">
                                    Add uploaded users
                                </h3>
                                <form
                                    autoComplete="off"
                                    className="col-sm-9 col-lg-6 col-xl-5 mx-auto d-block btn-group btn-group-toggle"
                                >
                                    //////////
                                </form>
                            </div>
                            <div id="step-4" className="text-center">
                                <h3 className="text-400 text-success mt-4">
                                    {" "}
                                    Progress!{" "}
                                </h3>
                                Your product is ready to ship! Click finish to
                                continue!
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                        </div>
                    </div>
                    {/* /#smartwizard-1 */}
                </div>
                {/* /.card-body */}
            </div>
        </>
    );
}

export default UploadUsers;
