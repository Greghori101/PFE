import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Moment from "moment";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Project() {
    const Swal = require("sweetalert2");
    const [post, setPost] = useState([]);
    const [author, setAuthor] = useState({});
    const [level, setLevel] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token"));
    const role = localStorage.getItem("role");
    const urls = "http://127.0.0.1:8000/api";

    let history = useHistory();
    const { id } = useParams();

    const getMyProject = async () => {
        let url = urls + "/projects/" + id;
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
            },
        };
        try {
            let response = await axios(options);
            let data = response.data;
            setPost(data);
            setAuthor(data.author);
            setLevel(data.level);
            console.log(data);
        } catch (error) {
            history.push("/404");
        }
    };

    const deleteProject = async () => {
        let url = urls + "/projects/delete/" + id;
        let options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
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
                        text: "Your file has been deleted.",
                        icon: "success",
                        iconColor: "#3dc00c",
                    }).then(async () => {
                        url = urls + "/notifications/send";
                        let data = {
                            title: "Project deleted",
                            type: "warning",
                            content:
                                "The project " +
                                post.title +
                                " have been deleted by " +
                                author.firstname +
                                " " +
                                author.lastname,
                            to: 1,
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
                        history.push("/dashboard");
                    });
                }
            }
        });
    };
    const rejectProject = async () => {
        let url = urls + "/projects/reject/" + id;
        let options = {
            method: "put",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
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
                        text: "Your file has been deleted.",
                        icon: "success",
                        iconColor: "#3dc00c",
                    }).then(async () => {
                        url = urls + "/notifications/send";
                        let data = {
                            title: "Project Rejected",
                            type: "danger",
                            content:
                                "The project " +
                                post.title +
                                " have been rejected by adminstration",
                            to: author.id,
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
                        history.push("/dashboard");
                    });
                }
            }
        });
    };

    const archiveProject = async () => {
        let url = urls + "/projects/archive/" + id;
        let options = {
            method: "DELETE",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
            },
        };
        let response = await axios(options);
        if (response && response.status === 200) {
            Swal.fire({
                title: "User Updated!",
                text: "User has been updated.",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                history.push("/dashboard");
            });
        }
    };

    const approveProject = async () => {
        let url = urls + "/projects/approve/" + id;
        let options = {
            method: "PUT",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
            },
        };
        try {
            let response = await axios(options);
            if (response && response.status === 200) {
                Swal.fire({
                    title: "your project is validated",
                    icon: "success",

                    iconColor: "#3dc00c",
                }).then(async () => {
                    url = urls + "/notifications/send";
                    let data = {
                        title: "Project accepted",
                        type: "success",
                        content:
                            "The project you have been proposed is validated by adminstration",
                        to: author.id,
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
                    history.push("/dashboard");
                });
            }
        } catch (error) {}
    };

    useEffect(() => {
        if (token !== null) {
            getMyProject();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <div className="page-content container container-plus">
            <div className="d-flex justify-content-between">
                <div>

            <h1 class="page-title text-primary-d2 text-150">Project View </h1>
                </div><div className="d-flex flex-row-reverse"><Link
                    to={"/projects"}
                    className="d-flex flex-row  align-items-center"
                >
                    <FontAwesomeIcon icon={icon.faArrowLeft}></FontAwesomeIcon>
                    <h6 className="pl-2 page-title text-primary-d2 text-120">
                        Go back to all projects
                    </h6>
                </Link>
    </div>
                
            </div>
            <div className="project shadow-lg">
                <div className="row">
                    <div className="col">
                        <label className="form-label project-title">
                            {post.title}
                        </label>
                        {post.state === "approved" ? (
                            <label className="form-label approved">
                                Approved
                            </label>
                        ) : post.state === "rejected" ? (
                            <label className="form-label rejected">
                                Rejected
                                <a className="rejected" href="#">
                                    ?
                                </a>
                            </label>
                        ) : (
                            <label className="form-label pendding-approval">
                                Pendidng Approval
                            </label>
                        )}
                    </div>
                    <div className="col d-flex flex-row-reverse align-items-center">
                        {role === "admin" ? (
                            <Link
                                className="btn btn-danger btn-circle m-1"
                                role="button"
                                onClick={rejectProject}
                            >
                                <FontAwesomeIcon
                                    icon={icon.faExclamationTriangle}
                                ></FontAwesomeIcon>
                            </Link>
                        ) : (
                            ""
                        )}
                        {role === "teacher" ? (
                            <Link
                                className="btn btn-danger btn-circle m-1"
                                role="button"
                                onClick={deleteProject}
                            >
                                <i className="fas fa-trash text-white"></i>
                            </Link>
                        ) : (
                            ""
                        )}
                        {role === "teacher" ? (
                            <Link
                                className="btn btn-info btn-circle m-1"
                                role="button"
                                to={"/projects/edit/" +id}
                            >
                                <i className="fas fa-edit text-white"></i>
                            </Link>
                        ) : (
                            ""
                        )}
                        {role === "admin" ? (
                            <a
                                className="btn btn-warning btn-circle m-1"
                                role="button"
                                onClick={archiveProject}
                            >
                                <i className="fas fa-archive text-white"></i>
                            </a>
                        ) : (
                            ""
                        )}
                        {role === "admin" && post.state !== "approved" ? (
                            <a
                                className="btn btn-success btn-circle m-1"
                                role="button"
                                onClick={approveProject}
                            >
                                <i className="fas fa-check text-white"></i>
                            </a>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label className="col-form-label">
                            Created by {author.firstname} {author.lastname} on{" "}
                            {Moment(post.created_at).format("MMMM Do, YYYY")}
                        </label>
                    </div>
                </div>
                {level? <div className="row">
                    <div className="col">
                        <label className="col-form-label">
                            Level {level.year} {level.cycle} {level.speciality}
                        </label>
                    </div>
                </div>: ""}
                
                <div className="row">
                    <div className="col">
                        <label className="form-label title">Summary</label>
                        <p>
                            {post.summary}
                            <br />
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label className="form-label title">Description</label>
                        <p>
                            {post.description}
                            <br />
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <label className="form-label title">Keywords</label>
                        <ul className="list-group keywords">
                            {post.keywords?.map((keyword) => {
                                return (
                                    <div>
                                        <li className="list-group-item keyword d-flex justify-content-between">
                                            <span> {keyword}</span>
                                        </li>
                                    </div>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div className="row ">
                    <div className="col">
                        <label className="form-label title">Attachment</label>

                        <div className="row">
                            <div className="col d-flex justify-content-between align-items-center">
                                <label className="form-label">
                                    Here you can find the project presentation
                                    sheet
                                </label>
                                <div>
                                    <img
                                        className="pdf-style"
                                        src={
                                            window.location.origin +
                                            "/assets/image/pdf-24.svg"
                                        }
                                    />
                                    <a
                                        href={
                                            "http://127.0.0.1:8000/files/" +
                                            post.file
                                        }
                                        target="_blank"
                                        download
                                    >
                                        Download the file here
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Project;
