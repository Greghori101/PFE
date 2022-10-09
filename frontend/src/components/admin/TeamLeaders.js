import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Supervisors from "./SelectSupervisors";
import SelectTeamLeaders from "./SelectTeamLeader";

function TeamLeaders() {
    const [year, setYear] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [domaine, setDomaine] = useState("");
    const [cycle, setCycle] = useState("");
    const [levelForm, setLevelForm] = useState(false);
    const [firstname, setFirstname] = useState(0);
    const [lastname, setLastname] = useState(0);
    const [levels, setLevels] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const urls = "http://127.0.0.1:8000/api";
    const [showForm, setShowForm] = useState(false);
    const addTeacher = () => {
        setRole("teacher");
        setShowForm(!showForm);
    };
    const addStudent = () => {
        setRole("student");
        setShowForm(!showForm);
    };
    const Swal = require("sweetalert2");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [birthday, setBirthday] = useState("");
    const [birthplace, setBirthplace] = useState("");
    const [gender, setGender] = useState("male");
    const [level, setLevel] = useState("male");
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState(0);
    const [firstnameErr, setfirstnameErr] = useState(false);
    const [lastnameErr, setlastnameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [addressErr, setAddressErr] = useState(false);
    const [phoneErr, setPhoneErr] = useState(false);

    async function addUser(event) {
        event.preventDefault();
        const data = {
            email,
            firstname,
            lastname,
            address,
            phone,
            birthday,
            birthplace,
            gender,
            role,
            level,
        };
        console.log(data);
        let url = urls + "/register";
        let options = {
            method: "POST",
            url: url,
            data,

            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        console.log(response);
        if (response) {
            if (response.status === 200) {
                setShowForm(false);
                Swal.fire({
                    title: "User Updated!",
                    text: "User has been updated.",
                    icon: "success",
                    iconColor: "#3dc00c",
                }).then(() => {});
            }
        }
    }
    function firstnameHandler(e) {
        let item = e.target.value;
        if (item.length < 2) {
            setfirstnameErr(true);
        } else {
            setfirstnameErr(false);
            setFirstname(e.target.value);
        }
    }
    function lastnameHandler(e) {
        let item = e.target.value;
        if (item.length < 2) {
            setlastnameErr(true);
        } else {
            setlastnameErr(false);
            setLastname(e.target.value);
        }
    }

    function emailHandler(e) {
        let item = e.target.value;
        let pattern =
            /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z\-]{3,9}[\.][a-z]{2,5}/g;
        if (pattern.test(item)) {
            setEmailErr(false);

            setEmail(e.target.value);
        } else {
            setEmailErr(true);
        }
    }
    function phoneHandler(e) {
        let item = e.target.value;
        let pattern = /^(00213|\+213|0)(5|6|7)[0-9]{8}$/g;
        if (pattern.test(item)) {
            setPhoneErr(false);
            setPhone(e.target.value);
        } else {
            setPhoneErr(true);
        }
    }
    function addressHandler(e) {
        let item = e.target.value;
        //let pattern = /^([^,]+),([^,]+),[^(]*/;
        if (true) {
            setAddressErr(false);
            setAddress(e.target.value);
        } else {
            setAddressErr(true);
        }
    }
    let history = useHistory();

    const addLevel = async (event) => {
        event.preventDefault();
        const data = {
            year,
            speciality,
            domaine,
            cycle,
        };
        let url = urls + "/levels/add";
        let options = {
            method: "POST",
            url: url,
            data,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        if (response.status === 200) {
            Swal.fire({
                title: "User Updated!",
                text: "User has been updated.",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                getLevels();
            });
        }
    };

    const deleteLevel = async (levelId) => {
        let url = urls + "/levels/delete/" + levelId;
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            iconColor: "#FFBB47",
            showCancelButton: true,
            confirmButtonColor: "#16537e",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let options = {
                    method: "DELETE",
                    url: url,
                    headers: {
                        Authorization: "Bearer " + token,
                        Accept: "Application/json",
                    },
                };
                let response = await axios(options);
                if (response && response.status === 200) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success",
                        iconColor: "#3dc00c",
                    }).then(async () => getLevels());
                }
            }
        });
    };

    const editLevel = async (levelId) => {
        const data = {
            year,
            speciality,
            domaine,
            cycle,
        };
        let url = "http://127.0.0.1:8000/api/levels/edit/" + levelId;
        let options = {
            method: "post",
            url: url,
            data: data,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        if (response.status === 200) {
            Swal.fire({
                title: "User Updated!",
                text: "User has been updated.",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                getLevels();
            });
        }
    };

    const getLevels = async () => {
        let url = urls + "/levels";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options).then((res) => {
            let response = res.data;
            setLevels(response);
        });
    };

    useEffect(() => {
        if (token !== null) {
            getLevels();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <>
            {showForm ? (
                <div
                    className="user-form  d-felx align-items-center justify-content-center"
                    style={{ position: "fixed",  top:"0",
                        left:"0",                        
                        height: "100vh",
                        zIndex: "1000000", height: "100vh" }}
                >
                    <div className="row">
                        <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                    <p className="text-primary m-0 fw-bold">
                                        Add user
                                    </p>
                                    <a
                                        onClick={() => {
                                            setShowForm(false);
                                        }}
                                        data-action="close"
                                        className="card-toolbar-btn text-danger"
                                    >
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={addUser}>
                                        <div className="row">
                                            <div className="col">
                                                <div className="row mb-3">
                                                    <div className="col d-flex flex-column">
                                                        <label className="form-label ">
                                                            <strong>
                                                                Role
                                                            </strong>
                                                        </label>
                                                        <label className=" ace-select capital angle-down brc-h-blue-m3 text-secondary-d3">
                                                            {role}
                                                        </label>
                                                    </div>
                                                    {role === "student" ? (
                                                        <div className="col">
                                                            <label className="form-label mr-2">
                                                                <strong>
                                                                    Level
                                                                </strong>
                                                            </label>
                                                            <select
                                                                className="ace-select angle-down brc-h-blue-m3 text-secondary-d3"
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    console.log(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    );
                                                                    setLevel(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    );
                                                                }}
                                                                defaultValue={
                                                                    "none"
                                                                }
                                                            >
                                                                <option
                                                                    value={
                                                                        "none"
                                                                    }
                                                                >
                                                                    select a
                                                                    level
                                                                </option>
                                                                <optgroup label="All levels">
                                                                    {levels.map(
                                                                        (
                                                                            level
                                                                        ) => {
                                                                            return (
                                                                                <option
                                                                                    value={
                                                                                        level.id
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        level.year
                                                                                    }{" "}
                                                                                    {
                                                                                        level.cycle
                                                                                    }{" "}
                                                                                    {
                                                                                        level.speciality
                                                                                    }
                                                                                </option>
                                                                            );
                                                                        }
                                                                    )}
                                                                </optgroup>
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                <strong>
                                                                    First Name
                                                                </strong>
                                                            </label>
                                                            <input
                                                                name="firstName"
                                                                className="form-control form-control-user"
                                                                type="text"
                                                                placeholder="Type first name"
                                                                required
                                                                pattern="^[A-Za-z0-9]{3,16}$"
                                                                //value={firstname}
                                                                onChange={
                                                                    firstnameHandler
                                                                }
                                                            />{" "}
                                                            {firstnameErr ? (
                                                                <div className="error">
                                                                    <span>
                                                                        Invalid
                                                                        name!
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                <strong>
                                                                    Last Name
                                                                </strong>
                                                            </label>
                                                            <input
                                                                name="lastName"
                                                                className="form-control form-control-user"
                                                                type="text"
                                                                placeholder="Type last name"
                                                                required
                                                                // value={lastname}
                                                                onChange={
                                                                    lastnameHandler
                                                                }
                                                            />{" "}
                                                            {lastnameErr ? (
                                                                <div className="error">
                                                                    <span>
                                                                        Invalid
                                                                        name!
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                <strong>
                                                                    Email{" "}
                                                                </strong>
                                                            </label>
                                                            <input
                                                                name="email"
                                                                className="form-control form-control-user"
                                                                type="email"
                                                                placeholder="x.lastname@esi-sba.dz"
                                                                required
                                                                // value={email}
                                                                onChange={
                                                                    emailHandler
                                                                }
                                                            />{" "}
                                                            {emailErr ? (
                                                                <div className="error">
                                                                    <span>
                                                                        It
                                                                        should
                                                                        be a
                                                                        valid
                                                                        email
                                                                        address!
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                <strong>
                                                                    Address
                                                                </strong>
                                                            </label>
                                                            <input
                                                                name="address"
                                                                className="form-control form-control-user"
                                                                type="text"
                                                                placeholder="eg:123 Main Street, Algiers, Algeria"
                                                                // value={address}
                                                                onChange={
                                                                    addressHandler
                                                                }
                                                            />{" "}
                                                            {addressErr ? (
                                                                <div className="error">
                                                                    <span>
                                                                        Invalid
                                                                        address!
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                <strong>
                                                                    Phone
                                                                </strong>
                                                            </label>
                                                            <input
                                                                name="phone"
                                                                className="form-control form-control-user"
                                                                type="text"
                                                                placeholder="Format eg: 0213/+213/0--------"
                                                                //value={phone}
                                                                onChange={
                                                                    phoneHandler
                                                                }
                                                            />{" "}
                                                            {phoneErr ? (
                                                                <div className="error">
                                                                    <span>
                                                                        Invalid
                                                                        phone
                                                                        number,
                                                                        please
                                                                        try
                                                                        again!
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col">
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                <strong>
                                                                    Birthday
                                                                </strong>
                                                            </label>
                                                            <input
                                                                name="birthday"
                                                                className="form-control form-control-user"
                                                                type="date"
                                                                required
                                                                value={birthday}
                                                                onChange={(e) =>
                                                                    setBirthday(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col">
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                <strong>
                                                                    Place of
                                                                    birth
                                                                </strong>
                                                            </label>
                                                            <input
                                                                name="Place of birth "
                                                                className="form-control form-control-user"
                                                                type="text"
                                                                placeholder="Mohammadia, Algiers, Algeria"
                                                                //value={placeOfBirth}
                                                                onChange={(e) =>
                                                                    setBirthplace(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col">
                                                <div className="mb-3">
                                                    <label className="form-label">
                                                        <strong>Gender</strong>
                                                    </label>
                                                    <select
                                                        className="ml-3 ace-select  angle-down brc-h-blue-m3 w-auto pr-45 text-secondary-d3"
                                                        type="text"
                                                        onChange={(e) =>
                                                            setGender(
                                                                e.target.value
                                                            )
                                                        }
                                                        defaultValue={role}
                                                    >
                                                        <optgroup id="role">
                                                            <option>
                                                                Male
                                                            </option>
                                                            <option>
                                                                Female
                                                            </option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row ">
                                            <div className="col d-flex flex-row-reverse">
                                                <button
                                                    className="btn btn-primary "
                                                    type="submit"
                                                    style={{
                                                        width: "80px",
                                                        borderRadius: "50px",
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
            <div className="p-5">
                <h1 className="page-title text-primary-d2 text-150 mb-3">
                    Select Team Leaders
                </h1>
                <div className="mt-3 mt-lg-4 shadow-lg">
                    <div className="card bcard pt-1 pt-lg-2">
                        <div className="card-header brc-primary-l3">
                            <h5 className="card-title pl-1 text-120">
                                All Students
                            </h5>
                            <a
                                onClick={addStudent}
                                style={{ width: "35px", height: "35px" }}
                                className="btn radius-round btn-outline-primary border-2 btn-sm mr-2 d-flex justify-content-center align-items-center"
                            >
                                <i className="fa fa-plus" />
                            </a>
                            <div className="card-toolbar align-self-center">
                                <a
                                    href="#"
                                    data-action="toggle"
                                    className="card-toolbar-btn text-grey text-110"
                                >
                                    <i className="fa fa-chevron-up" />
                                </a>
                            </div>
                        </div>

                        <SelectTeamLeaders />
                    </div>
                </div>
            </div>
        </>
    );
}

export default TeamLeaders;
