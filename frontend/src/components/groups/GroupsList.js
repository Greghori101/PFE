import React, { useState, Fragment, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import { Link, useHistory, useParams } from "react-router-dom";
import { Swal } from "sweetalert2";
import axios from "axios";
import AOS from "aos";
import ReadOnlyRow from "./ReadOnlyRow";
import EditableRow from "./EditableRow";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function range(start, end) {
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}

const GroupsList = () => {
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
        let url = urls + "/groups";
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

    const [editFormData, setEditFormData] = useState({
        teamleader_lastname: "",
        supervisor_lastname: "",
        project_title: "",
        status: "",
        numberOfMembers: "",
        teamleader_level: "",

        member_lastname: "",
        member_firstname: "",
        member_email: "",
    });

    const [editGroupId, setEditGroupId] = useState(null);

    const handleEditFormChange = (event) => {
        event.preventDefault();

        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editFormData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);
    };

    const handleEditFormSubmit = (event) => {
        event.preventDefault();

        const editedGroup = {
            id: editGroupId,
            teamleader_lastname: editFormData.teamleader_lastname,
            supervisor_lastname: editFormData.supervisor_lastname,
            project_title: editFormData.project_title,
            status: editFormData.status,
            numberOfMembers: editFormData.numberOfMembers,
            teamleader_level: editFormData.teamleader_level,
            member_lastname: editFormData.member_lastname,
            member_firstname: editFormData.member_firstname,
            member_email: editFormData.member_email,
        };

        const newGroups = [...groups];

        const index = groups.findIndex((group) => group.id === editGroupId);

        newGroups[index] = editedGroup;

        setGroups(newGroups);
        setEditGroupId(null);
    };

    const handleEditClick = (group) => {
        setEditGroupId(group.id);
        setEditFormData(group);
    };

    const handleCancelClick = () => {
        setEditGroupId(null);
    };
    const addGroup = () => {
        history.push("/groups/add");
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
            AOS.init();
            AOS.refresh();
            getGroups();
        } else {
            history.push("/login");
        }
    }, []);
    return (
        <>
            <div className="page-content container container-plus">
                <h1 className="page-title text-primary-d2 text-150">
                    All Groups
                </h1>
                <div className="card shadow mt-3">
                    <div className="card-header py-3 d-flex flex-row justify-content-between align-items-center">
                        <p className="text-primary m-0 fw-bold">Group Info</p>
                        <div className="text-nowrap d-flex flex-row align-items-center justify-content-center">
                            <a
                                onClick={addGroup}
                                style={{ width: "35px", height: "35px" }}
                                className=" btn radius-round btn-outline-primary border-2 btn-sm mr-2 d-flex justify-content-center align-items-center"
                            >
                                <i className="fa fa-plus" />
                            </a>
                        </div>
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
                            <form onSubmit={handleEditFormSubmit}>
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
                                            <th style={{ width: "140px" }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="mt-1">
                                        {page.map((group) => (
                                            <Fragment>
                                                {editGroupId === group.id ? (
                                                    <EditableRow
                                                        group={group}
                                                        getGroups={getGroups}
                                                        handleCancelClick={
                                                            handleCancelClick
                                                        }
                                                    />
                                                ) : (
                                                    <ReadOnlyRow
                                                        group={group}
                                                        handleEditClick={
                                                            handleEditClick
                                                        }
                                                        getGroups={getGroups}
                                                        
                                                        isSupervisor={false}
                                                    />
                                                )}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </form>
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
                <Link
                    to={"/students/rest"}
                    className="d-flex flex-row  mt-4 align-items-center"
                >
                    <FontAwesomeIcon icon={icon.faArrowRight}></FontAwesomeIcon>
                    <h6 className="pl-2 page-title text-primary-d2 text-120">
                        Students who does not have a group
                    </h6>
                </Link>
            </div>
        </>
    );
};

export default GroupsList;
