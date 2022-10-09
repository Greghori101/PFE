import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Moment from "moment";
import CloseButton from "react-bootstrap/CloseButton";
import GroupsList from "./GroupsList";

const EditableRow = ({ group, getGroups, handleCancelClick }) => {
    const [supervisors, setSupervisors] = useState([]);

    const Swal = require("sweetalert2");
    const [teamLeaderId, setTeamLeader] = useState(group.leader?group.leader.id:null);
    const [supervisor_id, setSupervisor] = useState(group.supervisor?group.supervisor.id:null);
    const [projects, setPost] = useState([]);
    const [project_id, setProjectId] = useState(group.project?group.project.id:null);
    const [loading, setLoad] = useState(true);
    const token = useState(localStorage.getItem("token"));
    const urls = "http://127.0.0.1:8000/api";
    let history = useHistory();

    const getSupervisors = async () => {
        let url = urls + "/supervisors/";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        console.log(response.data);
        setSupervisors(response.data);
    };

    const editGroup = async () => {
        let data = {
            supervisor_id,
            project_id,
            teamLeaderId,
        };
        let url = urls + "/groups/edit/" + group.id;
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
        if (response.status === 200) {
            Swal.fire({
                title: "Group Updated!",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                getGroups();
            });
        }

        getGroups();
    };
    const getProjects = async () => {
        let url = urls + "/projects/";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options).then((res) => {
            let data = res.data;
            setPost(data);

            setLoad(false);
        });
    };
    useEffect(() => {
        if (token !== null) {
            getSupervisors();
            getProjects();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);
    return (
        <tr className="bgc-h-yellow-l5 d-style">
            <td>{group.id}</td>
            <td className="text-center pr-0 pos-rel">
                <select
                    className="form-control form-control-group"
                    onChange={(event) => {
                        setTeamLeader(event.target.value);
                    }}
                    defaultValue={"none"}
                >
                    <option value={"none"}>select a team leader</option>
                    <optgroup label="All members">
                        {group.members.map((member) => {
                            return (
                                <option value={member.id}>
                                    {member.user.firstname}{" "}
                                    {member.user.lastname}
                                </option>
                            );
                        })}
                    </optgroup>
                </select>
            </td>
            <td className="text-center pr-0 pos-rel">
                <select
                    className="form-control form-control-group"
                    onChange={(event) => {
                        setSupervisor(event.target.value);
                    }}
                    defaultValue={"none"}
                >
                    <option value={"none"}>select a supervisor</option>
                    <optgroup label="All supervisors">
                        {supervisors.map((supervisor) => {
                            return (
                                <option value={supervisor.id}>
                                    {supervisor.user.firstname}{" "}
                                    {supervisor.user.lastname}
                                </option>
                            );
                        })}
                    </optgroup>
                </select>
            </td>
            <td className="text-blue-d1 text-600 text-95">
                <select
                    className="form-control form-control-group"
                    onChange={(event) => {
                        setProjectId(event.target.value);
                    }}
                    defaultValue={"none"}
                >
                    <option value={"none"}>select a project</option>
                    <optgroup label="All projects">
                        {projects.map((project) => {
                            return (
                                <option value={project.id}>
                                    {project.title}
                                </option>
                            );
                        })}
                    </optgroup>
                </select>
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
            <td></td>
            <td>
                <div className="d-none d-lg-flex">
                    <button
                        onClick={editGroup}
                        type="submit"
                        className="mx-3px btn btn-outline btn-h-outline-green btn-a-outline-green border-b-2 px-2  d-flex flex-row"
                    >
                        <i className="fa fa-check  text-110 text-success-m1 mr-1"></i>
                    </button>
                    <button
                        type="button"
                        onClick={handleCancelClick}
                        className="mx-2px btn btn-outline btn-h-outline-red btn-a-outline-red border-b-2 px-2 d-flex flex-row"
                    >
                        <i className="fa fa-times text-110 text-danger-m1 mr-1"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default EditableRow;
