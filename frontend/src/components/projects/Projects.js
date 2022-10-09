import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import Loading from "../../templates/Loading";
import Moment from "moment";
import toast, { Toaster } from "react-hot-toast";

//import AnimatedNumbers from 'react-animated-numbers';

function Projects() {
    const [posts, setPost] = useState([]);
    const [user, setUser] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [loading, setLoad] = useState(true);
    const urls = "http://127.0.0.1:8000/api";
  
    let history = useHistory();
    const goTo = async (id) => {
        history.push("/projects/" + id);
    };
  
    const getProjects = async () => {
        let url = urls + "/all/";
        let options = {
            method: "get",
            url: url,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        console.log("options");
        await axios(options)
            .then((res) => {
                let data = res.data;
                setPost(data);

                setLoad(false);
            })
            .catch(function (error) {
                console.log(error.toJSON());
            });
    };
 
    useEffect(() => {
        if (token !== null) {
            
                getProjects();
            
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
       
<div className="page-content container container-plus">
            
            <h1 className="page-title text-primary-d2 text-150">
                All Projects
            </h1>
            {loading ? (
                <div className="row m-5 p-5">
                    <div className="col d-flex justify-content-center">
                        <Loading />
                    </div>
                </div>
            ) : posts.length === 0 ? (
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
                posts.map((post, id) => {
                    return (
                                       
                        <div key={id} className="row">
                            <div className="col">
                                <div className="project shadow-lg">
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
                                                <a
                                                    className="rejected"
                                                    href="#"
                                                >
                                                    ?
                                                </a>
                                            </label>
                                        ) : (
                                            <label className="form-label pendding-approval">
                                                Pendidng Approval
                                            </label>
                                        )}
                                    <div className="row">
                                        <div className="col">
                                            <label className="form-label title">
                                                Summary
                                            </label>
                                            <p>
                                                {post.summary}
                                                <br />
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col d-flex justify-content-between">
                                            <lable>
                                                Created by{" "}
                                                {post.author.firstname}{" "}
                                                {post.author.lastname} on{" "}
                                                {Moment(post.created_at).format(
                                                    "MMMM Do, YYYY"
                                                )}
                                            </lable>
                                            <button
                                                className="btn btn-primary more-details-btn"
                                                type="button"
                                                onClick={() => {
                                                    goTo(post.id);
                                                }}
                                            >
                                                More details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default Projects;
