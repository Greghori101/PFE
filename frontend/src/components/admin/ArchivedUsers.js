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

function ArchivedUsers() {
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
                
                    if (
                        (user.email.includes(input) ||
                            user.firstname.includes(input) ||
                            user.lastname.includes(input)) 
                    ) {
                        result.push(user);
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
    
    
    const getUsers = async () => {
        let url = urls + "/archivedusers/";
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
   
    const showing = () => {
        setShowForm(!showForm);
    };

    useEffect(() => {
        if (token !== null) {
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
                            </div>{" "}<div className="col d-flex flex-row-reverse">
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

export default ArchivedUsers;
