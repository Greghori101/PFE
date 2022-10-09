import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { Swal } from "sweetalert2";
import axios from "axios";
import AOS from "aos";
import toast, { Toaster } from "react-hot-toast";

import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function range(start, end) {
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}

function Notifications() {
    const [page, setPage] = useState([]);
    const [copy, setCopy] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [user_id, setId] = useState(localStorage.getItem("user_id"));
    const [loading, setLoad] = useState(true);
    const [length, setLength] = useState(10);

    let numPage = 0;
    const [num, setNum] = useState(0);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [numbers, setNumbers] = useState([]);

    const urls = "http://127.0.0.1:8000/api";

    let history = useHistory();

    const show = (event) => {
        setLength(event.target.value);
        if (event.target.value > notifications.length) {
            setNum(0);
            numPage = 0;
            setPage(notifications);
        } else {
            setPage(notifications.slice(0, event.target.value));
            setNumbers(
                range(1, Math.ceil(notifications.length / event.target.value))
            );
            setNum(0);
            numPage = 0;
        }
    };

    const minus = () => {
        setPage(notifications.slice((num - 1) * length, num * length));
        setNum(num - 1);
    };
    const plus = () => {
        setPage(notifications.slice((num + 1) * length, (num + 2) * length));
        setNum(num + 1);
    };

    const selectPage = (event) => {
        numPage = parseInt(event.target.value) - 1;
        setNum(numPage);
        setPage(notifications.slice(numPage * length, (numPage + 1) * length));
    };
    const filter = (input) => {
        if (input.length > 0) {
            let result = [];
            for (var i = 0, len = copy.length; i < len; i++) {
                var note = copy[i];
                if (
                    note.type.includes(input) ||
                    note.title.includes(input) ||
                    note.content.includes(input)
                ) {
                    result.push(note);
                }
            }
            numPage = 0;
            setNotifications(result);
            setNum(0);
            setPage(result.slice(numPage * length, (numPage + 1) * length));
            setNumbers(range(1, Math.ceil(result.length / length)));
        } else {
            setNotifications(copy);
            setNum(0);
            setPage(copy.slice(numPage * length, (numPage + 1) * length));
            setNumbers(range(1, Math.ceil(copy.length / length)));
        }
    };

    const getNotifications = async () => {
        let url = "http://127.0.0.1:8000/api/all/notifications";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options)
            .then((res) => {
                let data = res.data;
                console.log(data);
                setNotifications(data);
                setCopy(data);
                if (10 > data.length) {
                    setPage(data);
                } else {
                    setPage(data.slice(0, 10));
                    setNumbers(range(1, Math.ceil(data.length / 10)));
                }
                setNotifications(data);
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
    const close = async (id) => {
        let url = "http://127.0.0.1:8000/api/notifications/delete/" + id;
        let options = {
            method: "delete",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options)
            .then((res) => {
                
                toast.success('Notification deleted');
                getNotifications();
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
    const clear = async (id) => {
        let url = "http://127.0.0.1:8000/api/notifications/delete/";
        let options = {
            method: "delete",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options)
            .then((res) => {
                
                toast.success('All notifications deleted');
                getNotifications();
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
    const markAsRead = async (id) => {
        let url = "http://127.0.0.1:8000/api/notifications/seen/" + id;
        let options = {
            method: "put",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options)
            .then((res) => {
                
                toast.success('Notification marked as read');
                getNotifications();
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
    const markAll = async () => {
        let url = "http://127.0.0.1:8000/api/notifications/seen";
        let options = {
            method: "put",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options)
            .then((res) => {
                toast.success('All notifications marked as read');
                getNotifications();
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };

    useEffect(() => {
        getNotifications();
        AOS.init();
        AOS.refresh();
        setLoad(false);
    }, []);

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />

            <div className="page-content container container-plus">
                <div className="row mt-4">
                    <div className="col" style={{ width: "50%" }}>
                        <h1 class="page-title text-primary-d2 text-150">
                            My Notifications
                        </h1>
                    </div>
                </div>

                <div className="card shadow mt-4">
                    <div className="card-header  d-flex flex-row justify-content-between align-items-center">
                        <h5 className="card-title  text-120 d-flex align-items-center m-0">
                            Notification Info
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
                        <div>
                            <Link
                                className="mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-danger btn-a-lighter-danger"
                                role="button"
                                onClick={clear}
                            >
                                <FontAwesomeIcon
                                    icon={icon.faFileCircleXmark}
                                    className="nav-icon"
                                />
                            </Link>
                        </div>
                        <div>
                            <Link
                                className="mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-success btn-a-lighter-success"
                                role="button"
                                onClick={markAll}
                            >
                                <FontAwesomeIcon
                                    icon={icon.faListCheck}
                                    className="nav-icon"
                                />
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col" style={{ width: "50%" }}>
                                {notifications.length > 10 ? (
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
                                        <th>From</th>
                                        <th>title</th>
                                        <th className="d-none d-sm-table-cell">
                                            content
                                        </th>
                                        <th className="d-none d-sm-table-cell">
                                            type
                                        </th>
                                        <th width={100} />
                                    </tr>
                                </thead>
                                <tbody className="mt-1">
                                    {page.map((note, id) => {
                                        return (
                                            <tr
                                                key={id}
                                                className={
                                                    note.displayed === 0
                                                        ? "bgc-h-yellow-l4 d-style bgc-white "
                                                        : "bgc-h-yellow-l4 d-style  bgc-grey-l5"
                                                }
                                            >
                                                <td className="capital pr-0 pos-rel">
                                                    {note.from.firstname}{" "}
                                                    {note.from.lastname}
                                                </td>
                                                <td className="capital pr-0 pos-rel">
                                                    {note.title}{" "}
                                                </td>
                                                <td>{note.content}</td>
                                                <td>
                                                    {note.type === "danger" ? (
                                                        <label className="m-1 badge bgc-red-l2 radius-round text-dark-tp4 px-4 text-90">
                                                            Danger{" "}
                                                        </label>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {note.type === "info" ? (
                                                        <label className="m-1 badge bgc-blue-l2 radius-round text-dark-tp4 px-4 text-90">
                                                            Information{" "}
                                                        </label>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {note.type ===
                                                    "invitation" ? (
                                                        <label className="m-1 badge bgc-blue-l2 radius-round text-dark-tp4 px-4 text-90">
                                                            Invitation{" "}
                                                        </label>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {note.type === "success" ? (
                                                        <label className="m-1 badge bgc-green-l2 radius-round text-dark-tp4 px-4 text-90">
                                                            Success{" "}
                                                        </label>
                                                    ) : (
                                                        ""
                                                    )}
                                                    {note.type === "warning" ? (
                                                        <label className="m-1 badge bgc-warning-l2 radius-round text-dark-tp4 px-4 text-90">
                                                            Warning{" "}
                                                        </label>
                                                    ) : (
                                                        ""
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="d-none d-lg-flex">
                                                        <Link
                                                            role="button"
                                                            onClick={() => {
                                                                markAsRead(
                                                                    note.id
                                                                );
                                                            }}
                                                            className="mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-success btn-a-lighter-success"
                                                        >
                                                            <i className="fa fa-pencil-alt" />
                                                        </Link>
                                                        <Link
                                                            className="mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-danger btn-a-lighter-danger"
                                                            role="button"
                                                            onClick={() => {
                                                                close(id);
                                                            }}
                                                        >
                                                            <i className="fa fa-trash-alt"></i>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {page.length < notifications.length ? (
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
                                        {notifications.length}
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
export default Notifications;
