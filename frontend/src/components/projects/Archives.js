import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Loading from "../../templates/Loading";
import Moment from "moment";

function Archives() {
    const [posts, setPost] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const urls = "http://127.0.0.1:8000/api";

    const [loading, setLoad] = useState(true);

    let history = useHistory();
    const goTo = async (id) => {
        history.push("/archive/projects/" + id);
    };
    const { year } = useParams();

    const getArchive = async () => {
        let data = {
            year,
        };
        let url = urls + "/archives/";
        let options = {
            method: "get",
            url: url,
            data,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        console.log("options");
        await axios(options).then((res) => {
            let data = res.data;
            console.log(data);
            setPost(data);
            setLoad(false);
        });
    };
    useEffect(() => {
        getArchive();
        AOS.init();
        AOS.refresh();
    }, []);

    return (
        <>
            <div className="page-content container container-plus">
                <h1 class="page-title text-primary-d2 text-150">
                    Archive {year}
                </h1>

                <div className="col">
                    {loading ? (
                        <div className="row m-5 p-5">
                            <div className="col d-flex justify-content-center">
                                <Loading />
                            </div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="row justify-content-center pos-rel mt-5">
                            <div className="pos-rel col  mt-5">
                                <div className="py-3 px-1 py-lg-4 px-lg-5">
                                    <div className="text-center">
                                        <i
                                            className="fas fa-box-open"
                                            style={{ fontSize: "80px" }}
                                        ></i>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-150 text-primary-d2">
                                            Oops! There is no projects to
                                            display.
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
                                                <div className="col ">
                                                    <div className="row">
                                                        <div className="col d-flex justify-content-between align-items-center">
                                                            <lable>
                                                                Created by{" "}
                                                                {
                                                                    post.author
                                                                        .firstname
                                                                }{" "}
                                                                {
                                                                    post.author
                                                                        .lastname
                                                                }{" "}
                                                                on{" "}
                                                                {Moment(
                                                                    post.created_at
                                                                ).format(
                                                                    "MMMM Do, YYYY"
                                                                )}
                                                            </lable>
                                                            <button
                                                                className="btn btn-primary more-details-btn"
                                                                type="button"
                                                                onClick={() => {
                                                                    goTo(
                                                                        post.id
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
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}

export default Archives;
