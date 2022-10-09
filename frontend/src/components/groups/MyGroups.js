import React, { useState, Fragment, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import { Link, useHistory, useParams } from "react-router-dom";
import { Swal } from "sweetalert2";
import axios from "axios";
import AOS from "aos";
import ReadOnlyRow from "./ReadOnlyRow";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function range(start, end) {
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}

const MyGroups = () => {
    const [length, setLength] = useState(10);
    const [page, setPage] = useState([]);
    let numPage = 0;
    const [num, setNum] = useState(0);
    const [numbers, setNumbers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const urls = "http://127.0.0.1:8000/api";
    let history = useHistory();
    const minus = () => {
        setPage(groups.slice((num - 1) * length, num * length));
        setNum(num - 1);
    };
    const plus = () => {
        setPage(groups.slice((num + 1) * length, (num + 2) * length));
        setNum(num + 1);
    };

    const selectPage = (event) => {
        numPage = parseInt(event.target.value) - 1;
        setNum(numPage);
        setPage(groups.slice(numPage * length, (numPage + 1) * length));
        console.log(groups.slice(numPage * length, (numPage + 1) * length));
    };

    const getGroups = async () => {
        let url = urls + "/groups/mine/"+ localStorage.getItem("user_id");
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
        setGroups(data);
        console.log(data);
        if (10 > data.length) {
            setPage(data);
        } else {
            setPage(data.slice(0, 10));
            setNumbers(range(1, Math.ceil(data.length / 10)));
        }
    };


   


    const show = (event) => {
        setLength(event.target.value);
        if (event.target.value > groups.length) {
            setNum(0);
            numPage = 0;
            setPage(groups);
        } else {
            setPage(groups.slice(0, event.target.value));
            setNumbers(range(1, Math.ceil(groups.length / event.target.value)));
            setNum(0);
            numPage = 0;
        }
    };
    useEffect(() => {
        if (token !== null) {
            getGroups();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);
    return (
        <>
            <div className="page-content container container-plus">
                <h1 className="page-title text-primary-d2 text-150">
                    My Groups
                </h1>
                <div className="card shadow mt-3">
                    <div className="card-header py-3 d-flex flex-row justify-content-between align-items-center">
                        <p className="text-primary m-0 fw-bold">Group Info</p>
                      
                    </div>
                    <div className="card-body">
                        {groups.length > 10 ? (
                            <div className="text-nowrap d-flex flex-row align-items-center ">
                                <span className="d-inline-block text-grey-d2">
                                    Show
                                </span>
                                <select
                                    className="ml-3 ace-select no-border angle-down brc-h-blue-m3 w-auto pr-45 text-secondary-d3"
                                    onChange={(event) => show(event)}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        ) : (
                            ""
                        )}
                        <div
                            className="table-responsive table mt-2"
                            id="dataTable"
                            role="grid"
                            aria-describedby="dataTable_info"
                        >
                                <table
                                    id="simple-table"
                                    className="mb-0 table table-borderless table-bordered-x brc-secondary-l3 text-dark-m2 radius-1 overflow-hidden"
                                >
                                    <thead className="text-dark-tp3 bgc-grey-l4 text-90 border-b-1 brc-transparent ">
                                        <tr>
                                            <th>id</th>
                                            <th
                                                className="d-none d-sm-table-cell"
                                                style={{ minWidth: "160px" }}
                                            >
                                                Team Leader
                                            </th>
                                            <th className="d-none d-sm-table-cell">
                                                Supervisor
                                            </th>
                                            <th className="d-none d-sm-table-cell">
                                                Theme
                                            </th>
                                            <th className="d-none d-sm-table-cell">
                                                State
                                            </th>
                                            <th style={{ width: "120px" }}></th>
                                        </tr>
                                    </thead>
                                    <tbody className="mt-1">
                                        {page.map((group) => (
                                            <Fragment>
                                              
                                                    <ReadOnlyRow
                                                        group={group}
                                                        getGroups={getGroups}
                                                        isSupervisor={true}
                                                    />
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                        </div>
                        {page.length < groups.length ? (
                            <div className="row d-flex  justify-content-between">
                                <div className="col align-self-center">
                                    <p
                                        id="dataTable_info"
                                        className="dataTables_info"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        Showing {num * length + 1} to{" "}
                                        {num * length + page.length} of{" "}
                                        {groups.length}
                                    </p>
                                </div>
                                <div className="col">
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
};

export default MyGroups;
