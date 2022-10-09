import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { Swal } from "sweetalert2";
import axios from "axios";
import AOS from "aos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";

function range(start, end) {
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}

function NotSelectedStudents() {
    const Swal = require("sweetalert2");
    const [students, setStudents] = useState([]);
    const [copy, setCopy] = useState([]);
    const [length, setLength] = useState(10);
    const [page, setPage] = useState([]);
    const [groups, setGroups] = useState([]);

    let numPage = 0;
    const [num, setNum] = useState(0);
    const [numbers, setNumbers] = useState([]);
    const [group_id, setGroupId] = useState(null);
    const [member_id, setMemberId] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const user_id = localStorage.getItem("user_id");
    const urls = "http://127.0.0.1:8000/api";

    let history = useHistory();
    const addMember = async (event) => {
        event.preventDefault();
        const data = {
            group_id,
            member_id,
        };
        let url = urls + "/groups/members/add/";
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
            if (response.status === 200) {
                Swal.fire({
                    title: "Member Added",
                    icon: "success",
                    iconColor: "#3dc00c",
                }).then(() => {
                    getNoneCompletedGroups();
                });
            }
        }
    };
    const show = (event) => {
        setLength(event.target.value);
        if (event.target.value > students.length) {
            setNum(0);
            numPage = 0;
            setPage(students);
        } else {
            setPage(students.slice(0, event.target.value));
            setNumbers(
                range(1, Math.ceil(students.length / event.target.value))
            );
            setNum(0);
            numPage = 0;
        }
    };

    const minus = () => {
        setPage(students.slice((num - 1) * length, num * length));
        setNum(num - 1);
    };
    const plus = () => {
        setPage(students.slice((num + 1) * length, (num + 2) * length));
        setNum(num + 1);
    };

    const selectPage = (event) => {
        numPage = parseInt(event.target.value) - 1;
        setNum(numPage);
        setPage(students.slice(numPage * length, (numPage + 1) * length));
    };
    const filter = (input) => {
        if (input.length > 0) {
            let result = [];
            for (var i = 0, len = copy.length; i < len; i++) {
                var student = copy[i];
                if (
                    student.user.email.includes(input) ||
                    student.user.firstname.includes(input) ||
                    student.user.lastname.includes(input)
                ) {
                    result.push(student);
                }
            }
            numPage = 0;
            setStudents(result);
            setNum(0);
            setPage(result.slice(numPage * length, (numPage + 1) * length));
            setNumbers(range(1, Math.ceil(result.length / length)));
        } else {
            let result = copy;
            numPage = 0;
            setStudents(result);
            setNum(0);
            setPage(result.slice(numPage * length, (numPage + 1) * length));
            setNumbers(range(1, Math.ceil(result.length / length)));
        }
    };

    const addGroup = () => {
        history.push("/groups/add");
    };

    const getNoneCompletedGroups = async () => {
        let url = urls + "/nonecompleted";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        let data = response.data;
        setGroups(data);if (10 > data.length) {
            setPage(data);
        } else {
            setPage(data.slice(0, 10));
            setNumbers(range(1, Math.ceil(data.length / 10)));
        }
    };
    const getStudents = async () => {
        let url = urls + "/rest_students/";
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
        setStudents(data);
        setCopy(data);
        if (10 > data.length) {
            setPage(data);
        } else {
            setPage(data.slice(0, 10));
            setNumbers(range(1, Math.ceil(data.length / 10)));
        }
    };

    useEffect(() => {
        if (token !== null) {
            getNoneCompletedGroups();
            getStudents();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <div className="p-5">
            <div  className="row d-flex justify-content-between">
                <div className="col ">
                    <h1 className="page-title text-primary-d2 text-150 mb-3">
                All students aren't in a group yet
            </h1>
                </div>
                {groups.length<1? <div className="col d-flex flex-row-reverse"><h5  className=" pl-1 text-warning text-120">
                            There is no approved groups, please create new!
                        </h5></div>: ""} 
                
            </div>
            
            <div className="mt-3 mt-lg-4 shadow-lg">
                <div className="card bcard pt-1 pt-lg-2">
                    <div className="card-header brc-primary-l3">
                        <h5 className="card-title pl-1 text-120">
                            Rest Students
                        </h5>
                        <div className="d-flex flex-row">
                        <a
                            onClick={addGroup}
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
                        </div></div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                {students.length > 10 ? (
                                    <>
                                        <label className="form-label">
                                            Show&nbsp;&nbsp;
                                        </label>
                                        <select
                                            className="ml-3 ace-select  angle-down brc-h-blue-m3 w-auto pr-45 text-secondary-d3"
                                            onChange={(event) => show(event)}
                                        >
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="col d-flex flex-row-reverse">
                                <div className="dataTables_filter">
                                    <label className="m-0">
                                        <i className="fa fa-search pos-abs  pt-3px m-2 text-blue-m2" />

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
                        </div>
                        <div
                            className="table-responsive table mt-4"
                            id="dataTable"
                            role="grid"
                            aria-describedby="dataTable_info"
                        >
                            <form>
                                <table
                                    id="simple-table"
                                    className="mb-0 table table-borderless table-bordered-x brc-secondary-l3 text-dark-m2 radius-1 overflow-hidden"
                                >
                                    <thead className="text-dark-tp3 bgc-grey-l4 text-90 border-b-1 brc-transparent">
                                        <tr>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th className="d-none d-sm-table-cell">
                                                Email
                                            </th>
                                            <th />
                                        </tr>
                                    </thead>
                                    <tbody className="mt-1">
                                        {page.map((user, id) => {
                                            return (
                                                <tr
                                                    key={id}
                                                    className="bgc-h-blue-l4 d-style"
                                                >
                                                    <td className="capital pr-0 pos-rel">
                                                    {user.user? user.user.firstname: "-"}
                                                        {}
                                                    </td>
                                                    <td className="capital pr-0 pos-rel">
                                                    {user.user? user.user.lastname: "-"}
                                                        {}{" "}
                                                    </td>
                                                    <td className="text-blue-d1 text-600 text-95">
                                                    {user.user? user.user.email: "-"}
                                                        {}
                                                    </td>
                                                    <td>
                                                        <select
                                                            className="ace-select angle-down brc-h-blue-m3 text-secondary-d3"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                setMemberId(user.id);
                                                                setGroupId(
                                                                    event.target
                                                                        .value
                                                                );
                                                                        addMember();
                                                            }}
                                                            defaultValue={
                                                                "none"
                                                            }
                                                        >
                                                            <option
                                                                value={"none"}
                                                            >
                                                                select a group
                                                            </option>
                                                            <optgroup label="All Groups">
                                                                {groups.map(
                                                                    (group) => {
                                                                        return (
                                                                            <option
                                                                                value={
                                                                                    group.id
                                                                                }
                                                                            >
                                                                                Group:{" "}
                                                                                {
                                                                                    group.id
                                                                                }{" "}
                                                                                Leader:{" "}
                                                                                {
                                                                                    group
                                                                                        .leader.user
                                                                                        .firstname
                                                                                }{" "}
                                                                                {
                                                                                    group
                                                                                        .leader.user
                                                                                        .lastname
                                                                                }
                                                                            </option>
                                                                        );
                                                                    }
                                                                )}
                                                            </optgroup>
                                                        </select>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        {page.length < students.length ? (
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
                                        {students.length}
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
        </div>
    );
}

export default NotSelectedStudents;
