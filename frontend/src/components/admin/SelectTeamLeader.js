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

function SelectTeamLeaders() {
    const [students, setStudents] = useState([]);
    const [copy, setCopy] = useState([]);
    const [length, setLength] = useState(10);
    const [page, setPage] = useState([]);
    const [Role, setRole] = useState(0);
    const [email, setEmail] = useState(0);
    const [firstname, setFirstname] = useState(0);
    const [lastname, setLastname] = useState(0);
    let numPage = 0;
    const [num, setNum] = useState(0);
    const [numbers, setNumbers] = useState([]);

    const [token, setToken] = useState(localStorage.getItem("token"));
    const user_id = localStorage.getItem("user_id");
    const urls = "http://127.0.0.1:8000/api";

    let history = useHistory();

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
    const selectChef = async (id) => {
        let data = [email, firstname, lastname, Role];
        let url = urls + "/groups/select_leader/" + id;
        let options = {
            method: "put",
            url: url,
            data,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        console.log(response);

        const Swal = require("sweetalert2");
        if (response && response.status === 200) {
            Swal.fire({
                title: "Seleceted!",
                text: "Team leader selected successfuly",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(async () => getStudents());
        }
    };

    const getStudents = async () => {
        let url = urls + "/students/";
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
        console.log(response.data);
    };

    const deleteChef = async (userId) => {
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
                let url = urls + "/groups/deselect_leader/" + userId;
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
                        title: "Successfuly!",
                        text: "Team leader unselected successfuly",
                        icon: "success",
                        iconColor: "#3dc00c",
                    }).then(async () => getStudents());
                }
            }
        });
    };

    useEffect(() => {
        getStudents();
        AOS.init();
        AOS.refresh();
    }, []);

    return (
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
                                <th className="d-none d-sm-table-cell">Role</th>
                                <th width="170px">Select Team Leader</th>
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
                                            {user.user.firstname}
                                        </td>
                                        <td className="capital pr-0 pos-rel">
                                            {user.user.lastname}{" "}
                                        </td>
                                        <td className="text-blue-d1 text-600 text-95">
                                            {user.user.email}
                                        </td>
                                        <td className="capital">
                                            {user.is_chef
                                                ? "Team Leader"
                                                : user.user.role}
                                        </td>

                                        <td>
                                            {/* action buttons */}
                                            <div className="d-lg-flex">
                                                {!user.is_chef ? (
                                                    <Link
                                                        role="button"
                                                        onClick={() =>
                                                            selectChef(user.id)
                                                        }
                                                        className="mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-success btn-a-lighter-success "
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={
                                                                icon.faPencilAlt
                                                            }
                                                        />{" "}
                                                        Select
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        className="mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-danger btn-a-lighter-danger"
                                                        role="button"
                                                        onClick={() =>
                                                            deleteChef(user.id)
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={
                                                                icon.faUserAltSlash
                                                            }
                                                        />{" "}
                                                        Cancel
                                                    </Link>
                                                )}
                                            </div>
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
                            {num * length + page.length} of {students.length}
                        </p>
                    </div>
                    <div className="col-md-6">
                        <nav className="d-lg-flex justify-content-lg-end dataTables_paginate paging_simple_numbers">
                            <ul className="pagination">
                                <li
                                    className={
                                        "page-item " +
                                        (num === 0 ? "disabled" : "")
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
                                                    selectPage(event)
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
    );
}

export default SelectTeamLeaders;
