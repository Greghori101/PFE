import React, { useEffect, useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import Details from "./Details";
import axios from "axios";
import AOS from "aos";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ReadOnlyRow = ({ group, handleEditClick, getGroups,isSupervisor }) => {
    const Swal = require("sweetalert2");
    const urls = "http://127.0.0.1:8000/api";
    const [token, setToken] = useState(localStorage.getItem("token"));
    const rejectGroup = async () => {
        let url = urls + "/groups/reject/" + group.id;
        let options = {
            method: "put",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        if (response.status === 200) {
            Swal.fire({
                title: "Group Rejected",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                getGroups();
            });
        }
    };

    const validateGroup = async () => {
        let url = urls + "/groups/approve/" + group.id;
        let options = {
            method: "put",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        if (response.status === 200) {
            Swal.fire({
                title: "Group Validated",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                getGroups();
            });
        }
    };
    const [showDetails, setDetails] = useState(false);

    const showDetailsHand = () => {
        setDetails(!showDetails);
    };

    return (
        <>
            <tr className="bgc-h-blue-l5 d-style">
                <td>{group.id}</td>
                <td>
                    {group.leader
                        ? group.leader.user.firstname +
                          " " +
                          group.leader.user.lastname
                        : "-"}
                </td>
                <td>
                    {group.supervisor
                        ? group.supervisor.teacher.user.firstname +
                          " " +
                          group.supervisor.teacher.user.lastname
                        : "-"}
                </td>
                <td className="text-blue-d1 text-600 text-95">
                    {group.project ? group.project.title : "-"}
                </td>

                <td>
                    {group.state === "approved" ? (
                        <label className="m-1 badge bgc-green-l2 radius-round text-dark-tp4 px-4 text-90">
                            Approved{" "}
                        </label>
                    ) : group.state === "rejected" ? (
                        <label className="m-1 badge bgc-red-l2 radius-round text-dark-tp4 px-4 text-90">
                            Rejected
                        </label>
                    ) : (
                        <label className="m-1 badge bgc-orange-l2 radius-round text-dark-tp4 px-3 text-90">
                            {" "}
                            Pending{" "}
                        </label>
                    )}
                </td>
                <td>
                    <div>
                        <Link
                            onClick={showDetailsHand}
                            className="d-style btn btn-outline-info text-90 text-600 border-0 px-2 collapsed"
                            title="Show Details"
                        >
                            <span className="d-none d-md-inline mr-1">
                                Details
                            </span>
                            <i className="fa fa-angle-down toggle-icon opacity-1 text-90" />
                        </Link>
                    </div>
                </td>
{!isSupervisor? 
                <td>
                    <Link
                        type="button"
                        onClick={() => handleEditClick(group)}
                        className={group.state==="approved"? "mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-primary btn-a-lighter-prinmary  disabled":"mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-primary btn-a-lighter-prinmary  "}
                    >
                        <i className="fa fa-pencil-alt" />
                    </Link>
                    <Link
                        type="button"
                        onClick={validateGroup}
                        className={group.state!="approved" && group.supervisor && group.project && group.leader?"mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-success btn-a-lighter-success ":"mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-success btn-a-lighter-success disabled"}
                    >
                        <FontAwesomeIcon icon={icon.faCheck}></FontAwesomeIcon>
                    </Link>
                   <Link
                        className={group.state!="rejected"?"mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-danger btn-a-lighter-danger":"mx-2px btn radius-1 border-2 btn-xs btn-brc-tp btn-light-secondary btn-h-lighter-danger btn-a-lighter-danger disabled"}
                        role="button"
                        onClick={() => rejectGroup()}
                    >
                        <i className=" fa fa-trash-alt"></i>
                    </Link> 
                </td>: ""}
            </tr>
            {showDetails ? (
                <Details group={group} />
            ) : (
                ""
            )}
        </>
    );
};

export default ReadOnlyRow;
