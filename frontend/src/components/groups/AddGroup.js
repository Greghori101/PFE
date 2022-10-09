import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import TeamLeaders from "../admin/SelectTeamLeader";

function AddGroup() {
    const [supervisors, setSupervisors] = useState([]);
    const [teamLeaders, setLeaders] = useState([]);
    const [projects, setPost] = useState([]);

    const Swal = require("sweetalert2");
    const [project_id, setProjectId] = useState(1);
    const [loading, setLoad] = useState(true);
    const [student_id, setTeamLeader] = useState(null);
    const [supervisor_id, setSupervisor] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    var user_id = localStorage.getItem("user_id");
    const urls = "http://127.0.0.1:8000/api";

    let history = useHistory();

    const addGroup = async (event) => {
        event.preventDefault();
        let data = { supervisor_id, student_id, project_id };
        let url = urls + "/groups/create";
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
        if (response.status === 200) {
            Swal.fire({
                title: "Group Added!",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                history.push("/groups");
            });
        }
    };

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
        setSupervisors(response.data);
    };
    const getTeamLeaders = async () => {
        let url = urls + "/leaders/";
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
        setLeaders(response.data);
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
        console.log("options");
        await axios(options).then((res) => {
            let data = res.data;
            setPost(data);

            setLoad(false);
        });
    };
    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token !== null) {
            getSupervisors();
            getProjects();
            getTeamLeaders();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <>
            <h1 className="page-title text-primary-d2 text-15 pt-5 pl-4 pr-4">
                Add new Groups
            </h1>
            <div className="card shadow-lg o-hidden border-0 m-5">
                <div className="card-body p-0">
                    <div className="col project-form">
                        <div className="p-4">
                            <h4 className="text-dark mb-4">
                                Create New Group!
                            </h4>
                            <form className="user" onSubmit={addGroup}>
                                <div className="row mb-3">
                                    <label className="form-label">
                                        Supervisor
                                    </label>
                                    <select
                                        className="form-control form-control-group"
                                        onChange={(event) => {
                                            setSupervisor(event.target.value);
                                        }}
                                        defaultValue={"none"}
                                    >
                                        <option value={"none"}>
                                            select a supervisor
                                        </option>
                                        <optgroup label="All supervisors">
                                            {supervisors.map((supervisor) => {
                                                return (
                                                    <option
                                                        value={supervisor.id}
                                                    >
                                                        {
                                                            supervisor.user
                                                                .firstname
                                                        }{" "}
                                                        {
                                                            supervisor.user
                                                                .lastname
                                                        }
                                                    </option>
                                                );
                                            })}
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="row mb-3">
                                    <label className="form-label">Leader</label>
                                    <select
                                        className="form-control form-control-group"
                                        onChange={(event) => {
                                            setTeamLeader(event.target.value);
                                        }}
                                        defaultValue={"none"}
                                    >
                                        <option value={"none"}>
                                            select a team leader
                                        </option>
                                        <optgroup label="All team leaders">
                                            {teamLeaders.map((leader) => {
                                                return (
                                                    <option value={leader.id}>
                                                        {leader.user.firstname}{" "}
                                                        {leader.user.lastname}
                                                    </option>
                                                );
                                            })}
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="row mb-3">
                                    <label className="form-label">
                                        Project theme
                                    </label>
                                    <select
                                        className="form-control form-control-group"
                                        onChange={(event) => {
                                            setProjectId(event.target.value);
                                        }}
                                        defaultValue={"none"}
                                    >
                                        <option value={"none"}>
                                            select a project
                                        </option>
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
                                </div>
                                <div className="row mb-3">
                                    <button
                                        className="btn btn-primary d-block add-btn"
                                        type="submit"
                                        style={{
                                            textAlign: "center",
                                            fontSize: "larger",
                                            borderRadius: "50px",
                                        }}
                                    >
                                        Create new group
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddGroup;
