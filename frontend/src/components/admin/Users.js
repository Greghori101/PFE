import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { Swal } from "sweetalert2";
import axios from "axios";
import AOS from "aos";
import * as XLSX from "xlsx";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast";
import UploadUsers from "./UploadUsers";

function range(start, end) {
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}
const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

function Users() {
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [birthday, setBirthday] = useState("");
    const [birthplace, setBirthplace] = useState("");
    const [gender, setGender] = useState("male");
    const [level, setLevel] = useState("male");
    const [levels, setLevels] = useState([]);
    const [firstnameErr, setfirstnameErr] = useState(false);
    const [lastnameErr, setlastnameErr] = useState(false);
    const [emailErr, setEmailErr] = useState(false);
    const [addressErr, setAddressErr] = useState(false);
    const [phoneErr, setPhoneErr] = useState(false);
    const [users, setUsers] = useState([]);
    const [copy_users, setCopy] = useState([]);
    const [length, setLength] = useState(10);
    const [page, setPage] = useState([]);
    const [role, setRole] = useState("student");
    const [id, setId] = useState(null);
    const [email, setEmail] = useState(0);
    const [firstname, setFirstname] = useState(0);
    const [lastname, setLastname] = useState(0);
    let numPage = 0;
    const [num, setNum] = useState(0);
    const [r, setR] = useState("all");
    const [showForm, setShowForm] = useState(false);

    const [uploadForm, setUploadForm] = useState(false);

    const Swal = require("sweetalert2");
    const [showEditForm, setShowEditForm] = useState(false);
    const [numbers, setNumbers] = useState([]);

    const [token, setToken] = useState(localStorage.getItem("token"));
    const urls = "http://127.0.0.1:8000/api";

    let history = useHistory();

    const exportFile = () => {
        let ws = XLSX.utils.json_to_sheet(users);
        let wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
        XLSX.writeFile(wb, "sheetjs.xlsx");
    };

    const show = (event) => {
        setLength(event.target.value);
        if (event.target.value > users.length) {
            setNum(0);
            numPage = 0;
            setPage(users);
        } else {
            setPage(users.slice(0, event.target.value));
            setNumbers(range(1, Math.ceil(users.length / event.target.value)));
            setNum(0);
            numPage = 0;
        }
    };

    const minus = () => {
        setPage(users.slice((num - 1) * length, num * length));
        setNum(num - 1);
    };
    const plus = () => {
        setPage(users.slice((num + 1) * length, (num + 2) * length));
        setNum(num + 1);
    };

    const selectPage = (event) => {
        numPage = parseInt(event.target.value) - 1;
        setNum(numPage);
        setPage(users.slice(numPage * length, (numPage + 1) * length));
    };
    const filter = (input) => {
        if (input.length > 0) {
            let result = [];
            for (var i = 0, len = copy_users.length; i < len; i++) {
                var user = copy_users[i];
                if (r === "all") {
                    if (
                        user.email.includes(input) ||
                        user.firstname.includes(input) ||
                        user.lastname.includes(input)
                    ) {
                        result.push(user);
                    }
                } else {
                    if (
                        (user.email.includes(input) ||
                            user.firstname.includes(input) ||
                            user.lastname.includes(input)) &&
                        user.role === r
                    ) {
                        result.push(user);
                    }
                }
            }
            numPage = 0;
            setUsers(result);
            setNum(0);
            setPage(result.slice(numPage * length, (numPage + 1) * length));
            setNumbers(range(1, Math.ceil(result.length / length)));
        } else {
            if (r !== "all") {
                let result = [];
                for (var i = 0, len = copy_users.length; i < len; i++) {
                    var user = copy_users[i];
                    if (user.role === r) {
                        result.push(user);
                    }
                }
                numPage = 0;
                setUsers(result);
                setNum(0);
                setPage(result.slice(numPage * length, (numPage + 1) * length));
                setNumbers(range(1, Math.ceil(result.length / length)));
            } else {
                setUsers(copy_users);
                setNum(0);
                setPage(
                    copy_users.slice(numPage * length, (numPage + 1) * length)
                );
                setNumbers(range(1, Math.ceil(copy_users.length / length)));
            }
        }
    };
    const editUser = async (event, id) => {
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
        let url = urls + "/users/edit/" + id;
        let options = {
            method: "post",
            url: url,
            data,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        if (response) {
            if (response.status === 200) {
                const Swal = require("sweetalert2");
                Swal.fire({
                    title: "User Updated!",
                    text: "User has been updated.",
                    icon: "success",
                    iconColor: "#3dc00c",
                }).then(() => {
                    getUsers();
                    setId("");
                    setEmail("");
                    setFirstname("");
                    setLastname("");
                    setAddress("");
                    setPhone("");
                    setBirthday("");
                    setBirthplace("");
                    setGender("");
                    setRole("all");
                    setShowEditForm(false);
                });
            }
        }
    };
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
                        toast.success(
                            "User added " + user.firstname + " " + user.lastname
                        );
                    await sleep(2000);
                    }
                }
            });
            setUploadForm(false);
            getUsers();
        };
        reader.readAsBinaryString(file);
    };
    const filter_role = async (input) => {
        setR(input);
        if (input === "student") {
            let url = urls + "/allstudents";
            let options = {
                method: "get",
                url: url,
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "Application/json",
                },
            };
            let response = await axios(options);
            let data = [];
            for (var i in response.data) data.push(response.data[i]);
            setUsers(data);
            setCopy(data);
            if (10 > data.length) {
                setPage(data);
            } else {
                setPage(data.slice(0, 10));
                setNumbers(range(1, Math.ceil(data.length / 10)));
            }
        } else if (input === "teacher") {
            let url = urls + "/teachers/";
            let options = {
                method: "get",
                url: url,
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "Application/json",
                },
            };
            let response = await axios(options);
            let data = [];
            for (var i in response.data) data.push(response.data[i]);
            setUsers(data);
            setCopy(data);
            if (10 > data.length) {
                setPage(data);
            } else {
                setPage(data.slice(0, 10));
                setNumbers(range(1, Math.ceil(data.length / 10)));
            }
        } else if (input === "company") {
            let url = urls + "/companies";
            let options = {
                method: "get",
                url: url,
                headers: {
                    Authorization: "Bearer " + token,
                    Accept: "Application/json",
                },
            };
            let response = await axios(options);
            let data = [];
            for (var i in response.data) data.push(response.data[i]);
            setUsers(data);
            setCopy(data);
            if (10 > data.length) {
                setPage(data);
            } else {
                setPage(data.slice(0, 10));
                setNumbers(range(1, Math.ceil(data.length / 10)));
            }
        } else {
            getUsers();
        }
    };
    const getUsers = async () => {
        let url = urls + "/users/";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        let data = [];
        for (var i in response.data) data.push(response.data[i]);
        setUsers(data);
        setCopy(data);
        if (10 > data.length) {
            setPage(data);
        } else {
            setPage(data.slice(0, 10));
            setNumbers(range(1, Math.ceil(data.length / 10)));
        }
    };
    const archiveUser = async (userId) => {
        const Swal = require("sweetalert2");
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
                let url = urls + "/users/archive/" + userId;
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
                        title: "Archived!",
                        icon: "success",
                        iconColor: "#3dc00c",
                    }).then(async () => getUsers());
                }
            }
        });
    };

    const deleteUser = async (userId) => {
        const Swal = require("sweetalert2");
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
                let url = urls + "/users/delete/" + userId;
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
                        icon: "success",
                        iconColor: "#3dc00c",
                    }).then(async () => getUsers());
                }
            }
        });
    };
    const showing = () => {
        setShowForm(!showForm);
    };

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
                showing();
                getUsers();
                Swal.fire({
                    title: "User Added!",
                    icon: "success",
                    iconColor: "#3dc00c",
                }).then(async () => getUsers());
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
            getUsers();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            {uploadForm ? (
                <div
                    className="user-form d-felx align-items-center justify-content-center"
                    style={{ position: "fixed", top:"0",
                        left:"0",                        
                        height: "100vh",
                        zIndex: "1000000", 
                        height: "100vh" }}
                >
                    <div className="row">
                        <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py ">
                                    <p className="text-primary m-0 fw-bold">
                                        Upload Excel File
                                    </p>
                                    <a
                                        onClick={() => {
                                            setUploadForm(false);
                                        }}
                                        data-action="close"
                                        className="card-toolbar-btn text-danger"
                                    >
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                                <div className="m-5 ">
                                    <input
                                        type="file"
                                        onChange={(event) => {
                                            onChangeXsl(event);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}

            {showForm ? (
                <div
                    className="user-form d-felx align-items-center justify-content-center"
                    style={{ position: "fixed", top:"0",
                        left:"0",                        
                        height: "100vh",
                        zIndex: "1000000",height: "100vh" }}
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
                                                        <label className="form-label">
                                                            <strong>
                                                                Role
                                                            </strong>
                                                        </label>
                                                        <select
                                                            className=" ace-select  angle-down brc-h-blue-m3 text-secondary-d3"
                                                            onChange={(e) =>
                                                                setRole(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            defaultValue={role}
                                                        >
                                                            <optgroup
                                                                id="role"
                                                                label="Add a new :"
                                                            >
                                                                <option
                                                                    value={
                                                                        "student"
                                                                    }
                                                                >
                                                                    Student
                                                                </option>
                                                                <option
                                                                    value={
                                                                        "company"
                                                                    }
                                                                >
                                                                    Company
                                                                </option>
                                                                <option
                                                                    value={
                                                                        "teacher"
                                                                    }
                                                                >
                                                                    Teacher
                                                                </option>
                                                            </optgroup>
                                                        </select>
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
            {showEditForm ? (
                <div
                    className="user-form d-felx align-items-center justify-content-center"
                    style={{ position: "fixed", top:"0",
                        left:"0",                        
                        height: "100vh",
                        zIndex: "1000000", height: "100vh" }}
                >
                    <div className="row">
                        <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                    <p className="text-primary m-0 fw-bold">
                                        Edit user
                                    </p>
                                    <a
                                        onClick={() => {
                                            setShowEditForm(false);
                                        }}
                                        className="card-toolbar-btn text-danger"
                                    >
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                                <div className="card-body">
                                    <form
                                        onSubmit={(event) =>
                                            editUser(event, id)
                                        }
                                    >
                                        <div className="row">
                                            <div className="col">
                                                <div className="row mb-3">
                                                    <div className="col d-flex flex-column">
                                                        <label className="form-label">
                                                            <strong>
                                                                Role
                                                            </strong>
                                                        </label>
                                                        <select
                                                            className=" ace-select  angle-down brc-h-blue-m3 text-secondary-d3"
                                                            onChange={(e) =>
                                                                setRole(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            defaultValue={role}
                                                        >
                                                            <optgroup
                                                                id="role"
                                                                label="Add a new :"
                                                            >
                                                                <option
                                                                    value={
                                                                        "student"
                                                                    }
                                                                >
                                                                    Student
                                                                </option>
                                                                <option
                                                                    value={
                                                                        "company"
                                                                    }
                                                                >
                                                                    Company
                                                                </option>
                                                                <option
                                                                    value={
                                                                        "teacher"
                                                                    }
                                                                >
                                                                    Teacher
                                                                </option>
                                                            </optgroup>
                                                        </select>
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
                                                                defaultValue={
                                                                    firstname
                                                                }
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
                                                                defaultValue={
                                                                    lastname
                                                                }
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
                                                                defaultValue={
                                                                    email
                                                                }
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
                                                                defaultValue={
                                                                    address
                                                                }
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
                                                                defaultValue={
                                                                    phone
                                                                }
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
                                                                defaultValue={
                                                                    birthday
                                                                }
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
                                                                defaultValue={
                                                                    birthplace
                                                                }
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
                                                        defaultValue={gender}
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
            <div className="page-content container container-plus">
                <div className="row mt-4">
                    <div className="col" style={{ width: "50%" }}>
                        <h1 class="page-title text-primary-d2 text-150">
                            Users Management
                        </h1>
                    </div>
                </div>

                <div className="card shadow mt-4">
                    <div className="card-header  d-flex flex-row justify-content-between align-items-center">
                        <h5 className="card-title  text-120 d-flex align-items-center m-0">
                            User Info
                        </h5>

                        <div className="dataTables_filter d-flex flex-row  align-items-center">
                            <label className="d-flex flex-row  align-items-center m-0 mr-2">
                                <i className="fa fa-search pos-abs text-blue-m2 m-2" />

                                <input
                                    type="search"
                                    className="form-control pl-45 radius-round"
                                    placeholder=" Search..."
                                    aria-controls="datatable"
                                    onChange={(event) => {
                                        filter(event.target.value);
                                    }}
                                />
                            </label>
                            <select
                                className="form-control radius-round mr-2"
                                style={{ width: "100px" }}
                                onChange={(event) =>
                                    filter_role(event.target.value)
                                }
                            >
                                <option value="all">All</option>
                                <option value="teacher">Teacher</option>
                                <option value="student">Student</option>
                                <option value="company">Company</option>
                            </select>
                            <a
                                onClick={showing}
                                style={{ width: "35px", height: "35px" }}
                                className="btn radius-round btn-outline-primary border-2 btn-sm mr-2 d-flex justify-content-center align-items-center "
                            >
                                <i className="fa fa-plus" />
                            </a>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col" style={{ width: "50%" }}>
                                {users.length > 10 ? (
                                    <>
                                        <div className="text-nowrap d-flex align-items-center m-0">
                                            <span className="d-inline-block text-grey-d2">
                                                Show
                                            </span>
                                            <select
                                                className="ml-3 ace-select  angle-down brc-h-blue-m3 w-auto pr-45 text-secondary-d3"
                                                onChange={(event) =>
                                                    show(event)
                                                }
                                            >
                                                <option value="10">10</option>
                                                <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    " "
                                )}
                            </div>{" "}
                            <div className="col d-flex flex-row-reverse">
                                <a
                                    className="d-style btn btn-white btn-h-lighter-green btn-a-green shadow-sm radius-round text-600 letter-spacing px-4 mb-1"
                                    onClick={exportFile}
                                >
                                    <FontAwesomeIcon
                                        icon={icon.faDownload}
                                        className="  mr-2 f-n-hover"
                                    />
                                    Export
                                </a>
                                <a
                                    className="d-style btn btn-white btn-h-lighter-blue btn-a-blue shadow-sm radius-round text-600 letter-spacing px-4 mb-1 mr-2"
                                    onClick={() => {
                                        setUploadForm(true);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={icon.faUpload}
                                        className="  mr-2 f-n-hover"
                                    />
                                    Upload
                                </a>
                            </div>
                        </div>
                        <div
                            className="table-responsive table mt-2"
                            id="dataTable"
                            role="grid"
                            aria-describedby="dataTable_info"
                        >
                            <table
                                id="users-table"
                                className="mb-0 table table-borderless table-bordered-x brc-secondary-l3 text-dark-m2 radius-1 overflow-hidden"
                            >
                                <thead className="text-dark-tp3 bgc-grey-l4 text-90 border-b-1 brc-transparent">
                                    <tr>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th className="d-none d-sm-table-cell">
                                            Email
                                        </th>
                                        <th className="d-none d-sm-table-cell">
                                            Role
                                        </th>
                                        <th width={100} />
                                    </tr>
                                </thead>
                                <tbody className="mt-1">
                                    {page.map((user, id) => {
                                        return (
                                            <tr
                                                key={id}
                                                className="bgc-h-yellow-l4 d-style"
                                            >
                                                <td className="capital pr-0 pos-rel">
                                                    {user.firstname}
                                                </td>
                                                <td className="capital pr-0 pos-rel">
                                                    {user.lastname}{" "}
                                                </td>
                                                <td className="text-blue-d1 text-600 text-95">
                                                    {user.email}
                                                </td>
                                                <td className="capital">
                                                    {user.role}
                                                </td>

                                                <td>
                                                    <div className="d-none d-lg-flex">
                                                        <Link
                                                            role="button"
                                                            onClick={() => {
                                                                setId(user.id);
                                                                setEmail(
                                                                    user.email
                                                                );
                                                                setFirstname(
                                                                    user.firstname
                                                                );
                                                                setLastname(
                                                                    user.lastname
                                                                );
                                                                setAddress(
                                                                    user.address
                                                                );
                                                                setPhone(
                                                                    user.phone
                                                                );
                                                                setBirthday(
                                                                    user.birthday
                                                                );
                                                                setBirthplace(
                                                                    user.birthplace
                                                                );
                                                                setGender(
                                                                    user.gender
                                                                );
                                                                setRole(
                                                                    user.role
                                                                );
                                                                setShowEditForm(
                                                                    true
                                                                );
                                                            }}
                                                            className="mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-success btn-a-lighter-success"
                                                        >
                                                            <i className="fa fa-pencil-alt" />
                                                        </Link>
                                                        <Link
                                                            className="mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-danger btn-a-lighter-danger"
                                                            role="button"
                                                            onClick={() =>
                                                                deleteUser(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fa fa-trash-alt"></i>
                                                        </Link>
                                                        <Link
                                                            className="mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-warning btn-a-lighter-warning"
                                                            role="button"
                                                            onClick={() =>
                                                                archiveUser(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    icon.faBoxesPacking
                                                                }
                                                            />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {page.length < users.length ? (
                            <div className="row">
                                <div className="col-md-6 align-self-center">
                                    <p
                                        id="dataTable_info"
                                        className="dataTables_info"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        Showing {num * length + 1} to{" "}
                                        {num * length + page.length} of{" "}
                                        {users.length}
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <nav className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                                        <ul className="pagination">
                                            <li
                                                className={
                                                    "page-item " +
                                                    (num === 0
                                                        ? "disabled"
                                                        : "")
                                                }
                                            >
                                                <button
                                                    className={"page-link "}
                                                    onClick={minus}
                                                >
                                                    <span>«</span>
                                                </button>
                                            </li>

                                            {numbers.map((number, id) => {
                                                return (
                                                    <li
                                                        key={number}
                                                        className={
                                                            "page-item " +
                                                            (number === num + 1
                                                                ? "active"
                                                                : "")
                                                        }
                                                    >
                                                        <button
                                                            value={number}
                                                            className="page-link"
                                                            onClick={(event) =>
                                                                selectPage(
                                                                    event
                                                                )
                                                            }
                                                        >
                                                            {number}
                                                        </button>
                                                    </li>
                                                );
                                            })}

                                            <li
                                                className={
                                                    "page-item " +
                                                    (num === numbers.length - 1
                                                        ? "disabled"
                                                        : "")
                                                }
                                            >
                                                <button
                                                    className={"page-link "}
                                                    onClick={plus}
                                                >
                                                    <span>»</span>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Users;
