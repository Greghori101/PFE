import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Moment from "moment";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Archive() {
    const Swal = require("sweetalert2");
    const [post, setPost] = useState([]);
    const [author, setAuthor] = useState({});
    const [level, setLevel] = useState({});
    const [token, setToken] = useState(localStorage.getItem("token"));
    const role = localStorage.getItem("role");
    const urls = "http://127.0.0.1:8000/api";

    let history = useHistory();
    const { id } = useParams();

    const getArchivedeProject = async () => {
        let url = urls + "/archives/" + id;
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

   
    useEffect(() => {
        if (token !== null) {
            getArchivedeProject();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <div className="page-content container container-plus">
            <h1 class="page-title text-primary-d2 text-150">Project View </h1>
            <div className="project shadow-lg">
                <div className="row">
                    <div className="col">
                        <label className="form-label project-title">
                            {post.title}
                        </label>
                        
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
                <div className="row">
                    <div className="col">
                        <label className="col-form-label">
                            Level {level.year} {level.cycle} {level.speciality}
                        </label>
                    </div>
                </div>
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

export default Archive;
