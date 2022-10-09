import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Moment from "moment";
import { post } from "jquery";

function EditProject() {
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [file, setFile] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [level, setLevel] = useState("");
    const [supervisors, setSuper] = useState([]);
    const [levels, setLevels] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [project, setProject] = useState([]);
    const Swal = require("sweetalert2");

    const urls = "http://127.0.0.1:8000/api";

    const { id } = useParams();
    const addKeyword = async () => {
        let list = keywords;
        list.push(keyword);
        setKeywords(list);
        setKeyword("");
    };
    const deleteKeyword = async (keywordId) => {
        const data = keywords.filter((i) => i.id !== keywordId);
        setKeywords(data);
    };

    let history = useHistory();

    const editProject = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("file", file);
        data.append("title", title);
        data.append("supercisors", supervisors);
        data.append("description", description);
        keywords.forEach((keyword) => data.append("keywords[]", keyword));
        data.append("summary", summary);
        data.append("level", level);
        console.log(data);
        let url = urls + "/projects/edit/" + project.id;
        let options = {
            method: "post",
            url: url,
            data,

            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: "Bearer " + token,
                Accept: "application/json",
            },
        };
        let response = await axios(options);
        if (response.status === 200) {
            Swal.fire({
                title: "Project Updated!",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(async () => {
                let author = response.data;
                url = urls + "/notifications/send";
                let data = {
                    title: "New project proposed",
                    type: "info",
                    content:
                        "the project" +
                        project.title +
                        " has been modified by " +
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
                history.replace("/projects/mine");
            });
        }
    };

    const getProject = async () => {
        let url = urls + "/projects/" + id;
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
            setTitle(data.title);
            setSummary(data.summary);
            setDescription(data.description);
            setKeywords(data.keywords);
            setProject(data);
            console.log(data);
        });
    };

    const getLevels = async () => {
        let url = "http://127.0.0.1:8000/api/levels/";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options).then((res) => {
            let response = res.data;
            setLevels(response);
            console.log(response);
        });
    };

    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token !== null) {
            getProject();
            getLevels();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <div className="page-content container container-plus">
        <h1 class="page-title text-primary-d2 text-150 mt-3">Edit Project</h1>

        <div
            className="card shadow-lg o-hidden border-0 my-5 "
            style={{ margin: "50px" }}
        >
            <div className="card-body p-0">
                <div className="col project-form">
                    <div className="p-5">
                        <form
                            className="user"
                            onSubmit={(event) => editProject(event)}
                        >
                            <div className="row mb-3">
                                <label className="form-label">Title</label>
                                <input
                                    id="exampleFirstName-1"
                                    className="form-control form-control-user "
                                    type="text"
                                    placeholder="Enter the title of the project..."
                                    name="title"
                                    defaultValue={project.title}
                                    onChange={(event) => {
                                        setTitle(event.target.value);
                                    }}
                                />
                            </div>
                            <div className="row mb-3 flex-column">
                                <label className="form-label">Level</label>
                                <select
                                    className="form-control form-control-user"
                                    onChange={(event) => {
                                        setLevel(event.target.value);
                                    }}
                                     
                                    defaultValue={project.level?project.level.id: "none"}
                                >
                                    <option value={"none"}>
                                        select a level
                                    </option>
                                    <optgroup label="All levels">
                                        {levels.map((level) => {
                                            return (
                                                <option value={level.id}>
                                                    {level.year} {level.cycle}{" "}
                                                    {level.speciality}
                                                </option>
                                            );
                                        })}
                                    </optgroup>
                                </select>
                            </div>

                            <div className="row mb-3">
                                <label className="form-label">
                                    Add new keyword{" "}
                                </label>
                                <input
                                    className="form-control form-control-user"
                                    type="text"
                                    placeholder="Add a tag or keyword related to this theme project"
                                    name="keyword"
                                    onChange={(event) => {
                                        setKeyword(event.target.value);
                                    }}
                                />
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    style={{
                                        width: "100px",
                                        borderRadius: "50px",
                                        marginTop: "10px",
                                    }}
                                    onClick={addKeyword}
                                >
                                    Add
                                </button>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label ">
                                        keywords
                                    </label>
                                    {keywords.length === 0 ? (
                                        <span
                                            style={{
                                                fontSize: ".8rem",
                                                color: "black",
                                            }}
                                        >
                                            There is no keyword added yet
                                        </span>
                                    ) : (
                                        <ul className=" keywords">
                                            {keywords.map(
                                                (keyword, keywordId) => {
                                                    return (
                                                        <li
                                                            key={keywordId}
                                                            className="keyword"
                                                        >
                                                            <span>
                                                                {keyword}
                                                            </span>
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="form-label">summary</label>
                                <textarea
                                    className="form-control  text-area"
                                    placeholder="Write here a short review..."
                                    name="summary"
                                    defaultValue={project.summary}
                                    onChange={(event) => {
                                        setSummary(event.target.value);
                                    }}
                                ></textarea>
                            </div>
                            <div className="row mb-3">
                                <label className="form-label">
                                    Description
                                </label>
                                <textarea
                                    className="form-control text-area"
                                    placeholder="Write what is the project about..."
                                    name="description"
                                    defaultValue={project.description}
                                    onChange={(event) => {
                                        setDescription(event.target.value);
                                    }}
                                ></textarea>
                            </div>
                            <div className="row mb-3 ">
                                <input
                                    type="file"
                                    onChange={(event) => {
                                        setFile(event.target.files[0]);
                                    }}
                                />
                            </div>
                            <div className="row mb-3 d-flex flex-row-reverse">
                                <button
                                    className="btn btn-primary"
                                    type="submit"
                                    style={{
                                        textAlign: "center",
                                        borderRadius: "50px",
                                    }}
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default EditProject;
