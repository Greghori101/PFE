import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icon from "@fortawesome/free-solid-svg-icons";
import Loading from "../../templates/Loading";
import Moment from "moment";
import toast, { Toaster } from "react-hot-toast";

//import AnimatedNumbers from 'react-animated-numbers';



function SearchResult() {
const { searchfield} =  useParams();
    const [posts, setPost] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [search_input, setSearchInput] = useState(searchfield);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(localStorage.getItem("role"));
    const [loading, setLoad] = useState(false);
    const urls = "http://127.0.0.1:8000/api";

    let history = useHistory();
    const goTo = async (id) => {
        history.push("/projects/" + id);
    };

    const getKeywords = async()=>{
        let url = urls + "/keywords";
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
    }
    const getProjects = async (event) => {
        setLoad(true);
        let data = { search_input, keyword };
        let url = urls + "/search";
        let options = {
            method: "post",
            url: url,
            data,
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
            //getKeywords();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return (
        <div className="page-content container container-plus">
            <h1 className="page-title text-primary-d2 text-150">
                Search Result
            </h1>
            <form
                onSubmit={(event) => {
                            
        event.preventDefault();
                    getProjects(event);
                }}
            >
                <div className="dataTables_filter d-flex flex-row  align-items-center m-2">
                    <label className="d-flex flex-row  align-items-center mr-2 justify-content-between" style={{width:"100%"}}>
                        <i className="fa fa-search pos-abs text-blue-m2 m-2" />

                        <input
                            type="search"
                            className="form-control pl-45 radius-round mr-5"
                            placeholder=" Search..."
                            aria-controls="datatable"
                            onChange={(event) => {
                                setSearchInput(event.target.value);
                            }}
                            defaultValue={search_input}
                        />
                        
                        <button
                            className="btn btn-primary ml-2"
                            type="submit"
                            style={{
                                textAlign: "center",
                                borderRadius: "50px",
                            }}
                        >
                            Search
                        </button>
                    </label>
                </div>
            </form>
            {loading ? (
                <div className="row m-5 p-5">
                    <div className="col d-flex justify-content-center">
                        <Loading />
                    </div>
                </div>
            ) : posts.length === 0 ? (
                <div className="row justify-content-center pos-rel mt=5">
                    <div className="pos-rel col-12 col-sm-7 mt-5">
                        <div className="py-3 px-1 py-lg-4 px-lg-5 mt-5">
                            <div className="text-center">
                                <i
                                    className="fas fa-box-open"
                                    style={{ fontSize: "80px" }}
                                ></i>
                            </div>
                            <div className="text-center">
                                <span className="text-150 text-primary-d2">
                                    Oops! There is no projects found.
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

export default SearchResult;
