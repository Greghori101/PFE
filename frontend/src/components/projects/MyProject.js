import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Moment from "moment";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function MyProject() {
    const [project, setProject] = useState("none");
    const [posts, setPosts] = useState([]);

    const Swal = require("sweetalert2");
    const [p1, setP1] = useState(" ");
    const [p2, setP2] = useState(" ");
    const [p3, setP3] = useState(" ");
    const [p4, setP4] = useState(" ");
    const [p5, setP5] = useState(" ");

    const [group, setGroup] = useState("none");
    const [showFillForm, setShowFillForm] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [showForm, setShowForm] = useState(false);
    const urls = "http://127.0.0.1:8000/api";
    const [member_id, setMember] = useState(null);
    const [group_id, setGroupId] = useState(null);
    const [projects, setProjects] = useState([]);
    const [students, setStudents] = useState([]);

    let history = useHistory();
    const goTo = async (id) => {
        history.push("/projects/" + id);
    };

    const getMyProject = async () => {
        let url = urls + "/projects/mine/" + localStorage.getItem("user_id");
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
            console.log(data);
            setProject(data);
        });
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

            let l = [
                { id: p1 },
                { id: p2 },
                { id: p3 },
                { id: p4 },
                { id: p5 },
            ];
            console.log(l);
            data.map((project) => {
                project["selected"] = false;
                l.map((p) => {
                    if (project.id == p.id) {
                        project["selected"] = true;
                    }
                });
            });
            setPosts(data);
        });
    };
    const addMember = async (event) => {
        event.preventDefault();
        const data = {
            member_id:member_id,
            group_id: parseInt(group.id),
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
            Swal.fire({
                title: "User Updated!",
                text: "User has been updated.",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(async () => {
                url = urls + "/notifications/send";
                let data = {
                    title: "Invitation",
                    type: "invitation",
                    content:
                        group.leader.user.firstname +
                        " " +
                        group.leader.user.lastname +
                        " has been ivited to be in his group",
                    to: parseInt(member_id),
                };
                options = {
                    method: "post",
                    url: url,
                    data,
                    headers: {
                        Authorization: "Bearer " + token,
                        Accept: "application/json",
                    },
                };
                response = await axios(options);
                getMyGroup();
                getNotSelectedStudents();
            });
        }
    };
    const getMyGroup = async () => {
        let url = urls + "/groups/mine/" + localStorage.getItem("user_id");
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
            setGroup(data);
        });
    };
    const deleteMember = async (member) => {
        let url = urls + "/groups/members/delete/" + member.id;
        let options = {
            method: "delete",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
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
                let response = await axios(options);
                if (response && response.status === 200) {
                    Swal.fire({
                        title: "Deleted!",
                        icon: "success",
                        iconColor: "#3dc00c",
                    }).then(async () => {
                        url = urls + "/notifications/send";
                        let data = {
                            title: "Group Cancel Invitation",
                            type: "warning",
                            content:
                                "you are not in group anymore",
                            to: parseInt(member.user.id),
                        };
                        options = {
                            method: "post",
                            url: url,
                            data,
                            headers: {
                                Authorization: "Bearer " + token,
                                Accept: "application/json",
                            },
                        };
                        response = await axios(options).then((res) => {
                            getMyGroup();
                            getNotSelectedStudents();
                        });
                    });
                }
            }
        });
    };
    const fillForm = async (event) => {
        event.preventDefault();
        let projects  = []
        projects.push(p1);
        projects.push(p2);
        projects.push(p3);
        projects.push(p4);
        projects.push(p5);
        let data = {
            projects: projects,
            group_id: group.id,
        };console.log(data);
        let url = urls + "/fill/form";
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
        if (response.status === 200) {
            Swal.fire({
                title: "User Updated!",
                text: "User has been updated.",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                setShowFillForm(false);
                getMyGroup();
            });
        }
    };
    const getNotSelectedStudents = async () => {
        let url = urls + "/rest_students/";
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
            setStudents(data);
        });
    };

    const showing = () => {
        setShowForm(!showForm);
    };

    useEffect(() => {
        if (token !== null) {
            getMyProject();
            getMyGroup();
            getNotSelectedStudents();
            getProjects();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, [p1, p2, p3, p4, p5]);

    return (
        <>
            {showFillForm ? (
                <div
                    className="user-form "
                    style={{ width: "85%", height: "100vh", position: "fixed" }}
                >
                    <div className="row mb-3 " style={{ width: "800px" }}>
                        <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                    <p className="text-primary m-0 fw-bold">
                                        Projects from
                                    </p>
                                    <a
                                        onClick={() => {
                                            setShowFillForm(false);
                                        }}
                                        data-action="close"
                                        className="card-toolbar-btn text-danger"
                                    >
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                                <div className="card-body p-2 pl-5 pr-5">
                                    <div className="col project-form">
                                        <form
                                            className="user"
                                            onSubmit={(event)=>fillForm(event)}
                                        >
                                            <div className="row mb-3">
                                                <label className="form-label">
                                                    Project theme #1
                                                </label>
                                                <select
                                                    className="form-control form-control-group"
                                                    onChange={(event) => {
                                                        event.preventDefault();
                                                        let data = posts;

                                                        data.map((project) => {
                                                            project.selected = false;
                                                        });

                                                        if (
                                                            event.target
                                                                .value != "none"
                                                        ) {
                                                            data[
                                                                event.target.value[2]
                                                            ].selected = true;
                                                            setP1(
                                                                event.target
                                                                    .value[0]
                                                            );
                                                        } else {
                                                            setP1("");
                                                        }

                                                        setPosts(data);
                                                    }}
                                                    defaultValue={"none"}
                                                >
                                                    <option value={"none"}>
                                                        select a project
                                                    </option>
                                                    <optgroup label="All projects">
                                                        {posts.map(
                                                            (project, id) => {
                                                                return project.selected ===
                                                                    true ? (
                                                                    <option
                                                                        value={[
                                                                            project.id,
                                                                            id,
                                                                        ]}
                                                                        disabled={
                                                                            true
                                                                        }
                                                                    >
                                                                        {
                                                                            project.title
                                                                        }
                                                                    </option>
                                                                ) : (
                                                                    <option
                                                                        value={[
                                                                            project.id,
                                                                            id,
                                                                        ]}
                                                                        disabled={
                                                                            false
                                                                        }
                                                                    >
                                                                        {
                                                                            project.title
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </optgroup>
                                                </select>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="form-label">
                                                    Project theme #2
                                                </label>
                                                <select
                                                    className="form-control form-control-group"
                                                    onChange={(event) => {
                                                        event.preventDefault();
                                                        let data = posts;
                                                        data.map((project) => {
                                                            project.selected = false;
                                                        });
                                                        setPosts(data);
                                                        if (
                                                            event.target
                                                                .value ===
                                                            "none"
                                                        ) {
                                                            setP2("");
                                                        } else {
                                                            data[
                                                                event.target.value[2]
                                                            ].selected = true;
                                                            setP2(
                                                                event.target
                                                                    .value[0]
                                                            );
                                                        }
                                                        setPosts(data);
                                                    }}
                                                    defaultValue={"none"}
                                                >
                                                    <option value={"none"}>
                                                        select a project
                                                    </option>
                                                    <optgroup label="All projects">
                                                        {posts.map(
                                                            (project, id) => {
                                                                return project.selected !=
                                                                    true ? (
                                                                    <option
                                                                        value={[
                                                                            project.id,
                                                                            id,
                                                                        ]}
                                                                        disabled={
                                                                            false
                                                                        }
                                                                    >
                                                                        {
                                                                            project.title
                                                                        }
                                                                    </option>
                                                                ) : (
                                                                    <option
                                                                        value={[
                                                                            project.id,
                                                                            id,
                                                                        ]}
                                                                        disabled={
                                                                            true
                                                                        }
                                                                    >
                                                                        {
                                                                            project.title
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </optgroup>
                                                </select>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="form-label">
                                                    Project theme #3
                                                </label>
                                                <select
                                                    className="form-control form-control-group"
                                                    onChange={(event) => {
                                                        let data = posts;
                                                        data.map((project) => {
                                                            project.selected = false;
                                                        });

                                                        if (
                                                            event.target
                                                                .value != "none"
                                                        ) {
                                                            data[
                                                                event.target.value[2]
                                                            ].selected = true;
                                                            setP3(
                                                                event.target
                                                                    .value[0]
                                                            );
                                                        } else {
                                                            setP3("");
                                                        }
                                                        setPosts(data);
                                                    }}
                                                    defaultValue={"none"}
                                                >
                                                    <option value={"none"}>
                                                        select a project
                                                    </option>
                                                    <optgroup label="All projects">
                                                        {posts.map(
                                                            (project, id) => {
                                                                return project.selected ===
                                                                    true ? (
                                                                    <option
                                                                        value={[
                                                                            project.id,
                                                                            id,
                                                                        ]}
                                                                        disabled={
                                                                            true
                                                                        }
                                                                    >
                                                                        {
                                                                            project.title
                                                                        }
                                                                    </option>
                                                                ) : (
                                                                    <option
                                                                        value={[
                                                                            project.id,
                                                                            id,
                                                                        ]}
                                                                        disabled={
                                                                            false
                                                                        }
                                                                    >
                                                                        {
                                                                            project.title
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </optgroup>
                                                </select>
                                            </div>
                                            <div className="row mb-3">
                                                <label className="form-label">
                                                    Project theme #4
                                                </label>
                                                <select
                                                    className="form-control form-control-group"
                                                    onChange={(event) => {
                                                        let data = posts;
                                                        data.map((project) => {
                                                            project.selected = false;
                                                        });

                                                        if (
                                                            event.target
                                                                .value != "none"
                                                        ) {
                                                            data[
                                                                event.target.value[2]
                                                            ].selected = true;
                                                            setP4(
                                                                event.target
                                                                    .value[0]
                                                            );
                                                        } else {
                                                            setP4("");
                                                        }
                                                        setPosts(data);
                                                    }}
                                                    defaultValue={"none"}
                                                >
                                                    <option value={"none"}>
                                                        select a project
                                                    </option>
                                                    <optgroup label="All projects">
                                                        {posts.map(
                                                            (project, id) => {
                                                                return project.selected ===
                                                                    true ? (
                                                                    <option
                                                                        value={[
                                                                            project.id,
                                                                            id,
                                                                        ]}
                                                                        disabled={
                                                                            true
                                                                        }
                                                                    >
                                                                        {
                                                                            project.title
                                                                        }
                                                                    </option>
                                                                ) : (
                                                                    <option
                                                                        value={[
                                                                            project.id,
                                                                            id,
                                                                        ]}
                                                                        disabled={
                                                                            false
                                                                        }
                                                                    >
                                                                        {
                                                                            project.title
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
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
                                                    Submit Form
                                                </button>
                                            </div>
                                        </form>
                                    </div>
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
                    className="user-form"
                    style={{ width: "85%", height: "100vh", position: "fixed" }}
                >
                    <div className="row mb-3" style={{ width: "600px" }}>
                        <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                    <p className="text-primary m-0 fw-bold">
                                        Invite a student to join your group!
                                    </p>
                                    <a
                                        onClick={showing}
                                        data-action="close"
                                        className="card-toolbar-btn text-danger"
                                    >
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                                <div className="card-body p-0">
                                    <div className="col project-form">
                                        <div className="row mb-3 mt-4">
                                            <div className="col">
                                                <select
                                                    className="form-control form-control-user"
                                                    onChange={(event) => {
                                                        console.log(
                                                            event.target.value
                                                        );
                                                        setMember(
                                                            event.target.value
                                                        );
                                                    }}
                                                    defaultValue={
                                                        "Not selected yet"
                                                    }
                                                >
                                                    <option
                                                        value={
                                                            "Not selected yet"
                                                        }
                                                    >
                                                        Not selected yet
                                                    </option>
                                                    <optgroup>
                                                        {students.map(
                                                            (student) => {
                                                                return (
                                                                    <option
                                                                        value={
                                                                            student.user.id
                                                                        }
                                                                    >
                                                                        {
                                                                            student
                                                                                .user
                                                                                .firstname
                                                                        }{" "}
                                                                        {
                                                                            student
                                                                                .user
                                                                                .lastname
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                    </optgroup>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col">
                                                <button
                                                    className="btn btn-primary add-btn"
                                                    onClick={(event) =>
                                                        addMember(event)
                                                    }
                                                    style={{
                                                        textAlign: "center",
                                                        width: "140px",
                                                        borderRadius: "50px",
                                                    }}
                                                >
                                                    Add member
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}

            <div className="container-fluid">
                <div className="row">
                    <div className="col m-5">
                        {group === "none" ? (
                            <div className="row justify-content-center pos-rel">
                                <div className="pos-rel col-12 col-sm-7 mt-1 mt-sm-3">
                                    <div className="py-3 px-1 py-lg-4 px-lg-5">
                                        <div className="text-center">
                                            <i
                                                className="fas fa-box-open"
                                                style={{ fontSize: "80px" }}
                                            ></i>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-150 text-primary-d2">
                                                Oops! There is no projects to display.
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {project === "none" ? (
                                    <>
                                        <h1 className="page-title text-primary-d2 text-150">
                                            Your group had not select a project
                                            yet
                                        </h1>
                                        <Link
                                            onClick={() =>
                                                setShowFillForm(true)
                                            }
                                            role="button"
                                            className="d-flex flex-row mt-4 mb-3 align-items-center pl-5"
                                        >
                                            <FontAwesomeIcon
                                                icon={icon.faArrowRight}
                                            ></FontAwesomeIcon>
                                            <h1 className="page-title text-dark-d2 text-120 pl-2">
                                                Choose the projects you want!
                                            </h1>
                                        </Link>
                                    </>
                                ) : (
                                    <div key={project.id} className="row mb-4">
                                        <div className="col">
                                            <h1 className="page-title text-primary-d2 text-150">
                                                My Project
                                            </h1>
                                            <div className="project shadow-lg">
                                                <label className="form-label project-title">
                                                    {project.title}
                                                </label>

                                                <div className="row">
                                                    <div className="col">
                                                        <label className="form-label title">
                                                            Summary
                                                        </label>
                                                        <p>
                                                            {project.summary}
                                                            <br />
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col ">
                                                        <div className="row">
                                                            <div className="col d-flex justify-content-between align-items-center">
                                                                <lable>
                                                                    Created by{" "}
                                                                    {
                                                                        project
                                                                            .author
                                                                            .firstname
                                                                    }{" "}
                                                                    {
                                                                        project
                                                                            .author
                                                                            .lastname
                                                                    }{" "}
                                                                    on{" "}
                                                                    {Moment(
                                                                        project.created_at
                                                                    ).format(
                                                                        "MMMM Do, YYYY"
                                                                    )}
                                                                </lable>
                                                                <button
                                                                    className="btn btn-primary more-details-btn"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        goTo(
                                                                            project.id
                                                                        );
                                                                    }}
                                                                >
                                                                    More details
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div key={group.id} className="row">
                                    <div className="col">
                                        <div className="project shadow-lg p-0">
                                            <div className="card m-0 ">
                                                <div className="card-header py-3 d-flex flex-row justify-content-between align-items-center">
                                                    <h5 className="card-title pl-1 text-120 d-flex align-items-center">
                                                        My group
                                                    </h5>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="row m-3">
                                                    <div className="col">
                                                        <div className="brc-dark-l2 border-1">
                                                            <div className="card-header">
                                                                <h5 className="card-title text-dark">
                                                                    Supervisor
                                                                </h5>
                                                            </div>
                                                            <label className="form-label  pl-2 m-3">
                                                                {group.supervisor
                                                                    ? group
                                                                          .supervisor
                                                                          .teacher
                                                                          .user
                                                                          .firstname +
                                                                      " " +
                                                                      group
                                                                          .supervisor
                                                                          .teacher
                                                                          .user
                                                                          .lastname
                                                                    : "-"}
                                                                <br />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row m-3">
                                                    <div className="col">
                                                        <div className="brc-dark-l2 border-1">
                                                            <div className="card-header">
                                                                <h5 className="card-title text-dark">
                                                                    Team Leader
                                                                </h5>
                                                            </div>
                                                            <label className="form-label  pl-2 m-3">
                                                                {
                                                                    group.leader
                                                                        .user
                                                                        .firstname
                                                                }{" "}
                                                                {
                                                                    group.leader
                                                                        .user
                                                                        .lastname
                                                                }
                                                                <br />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row m-3">
                                                    <div className="col">
                                                        <div className=" brc-dark-l2 border-1">
                                                            <div className="card-header">
                                                                <h5 className="card-title text-dark">
                                                                    <i className="far fa-user text-dark p-1"></i>
                                                                    Members
                                                                </h5>
                                                                {group.leader
                                                                        .user.id== localStorage.getItem("user_id")? <button
                                                                    onClick={
                                                                        showing
                                                                    }
                                                                    style={{
                                                                        width: "35px",
                                                                        height: "35px",
                                                                    }}
                                                                    className="btn radius-round btn-outline-primary border-2 btn-sm  d-flex align-items-center justify-content-center"
                                                                >
                                                                    <i className="fa fa-plus" />
                                                                </button>:""}
                                                                
                                                            </div>
                                                            <div className="card-body  p-0 border-1  border-t-1">
                                                                <table className="table table-hover mb-0 text-danger">
                                                                    <tbody>
                                                                        {group.members.map(
                                                                            (
                                                                                member
                                                                            ) => (
                                                                                <tr>
                                                                                    <td
                                                                                        width={
                                                                                            60
                                                                                        }
                                                                                    >
                                                                                        <img
                                                                                            src={
                                                                                                "http://127.0.0.1:8000/files/" +
                                                                                                member
                                                                                                    .user
                                                                                                    .profile_picture
                                                                                            }
                                                                                            width={
                                                                                                40
                                                                                            }
                                                                                            height={
                                                                                                40
                                                                                            }
                                                                                            style={{
                                                                                                objectFit:
                                                                                                    "cover",
                                                                                                padding:
                                                                                                    "0px",
                                                                                            }}
                                                                                            className="radius-round"
                                                                                        />
                                                                                    </td>
                                                                                    <td className="text-dark-m2">
                                                                                        {
                                                                                            member
                                                                                                .user
                                                                                                .firstname
                                                                                        }{" "}
                                                                                        {
                                                                                            member
                                                                                                .user
                                                                                                .lastname
                                                                                        }
                                                                                    </td>
                                                                                    <td>
                                                                                        <a
                                                                                            href="#"
                                                                                            className="text-primary-d2"
                                                                                        >
                                                                                            {
                                                                                                member
                                                                                                    .user
                                                                                                    .email
                                                                                            }
                                                                                        </a>
                                                                                    </td>
                                                                                    <td width={60}>
                                                                                        {member.is_chef!=true && group.leader
                                                                        .user.id== localStorage.getItem("user_id") ? <a
                                        onClick={() => {
                                            deleteMember(member);
                                        }}
                                        data-action="close"
                                        className="card-toolbar-btn text-danger"
                                    >
                                        <i class="fa fa-times"></i>
                                    </a> : ""}</td>
                                                                                       
                                                                                </tr>
                                                                            )
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyProject;
