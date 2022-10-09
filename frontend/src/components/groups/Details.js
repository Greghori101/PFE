import React, { useEffect, useState, useCallback } from "react";

import { useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";

function Details({ group,}) {

    const [projects, setProjects] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const urls = "http://127.0.0.1:8000/api";


    const getForm = async () => {
        let url = urls + "/form/"+group.id;
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
            setProjects(response);
        });
    };


    useEffect(() => {
            getForm();
            AOS.init();
            AOS.refresh();
    }, []);
    return (
        <tr className="d-style">
            <td colSpan={7}>
                <div className="row d-flex flex-column alert bgc-secondary-l4 text-dark-m2 border-none border-l-4 brc-primary-m1 radius-0 m-4 ">
                    <div className="row ">
                        <h4 className="page-title text-primary-d2 text-150">
                            More Details :
                        </h4>
                    </div>
                    <div className="row d-flex flex-row m-3">
                        <div className="col ">
                            <div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item  bgc-light-l1 ">
                                        <span className=" pr-0 pos-rel text-110 font-weight-bold">
                                            Project Title :{"  "}
                                        </span>
                                        {group.project
                                            ? group.project.title
                                            : "-"}
                                    </li>
                                    <li className="list-group-item  bgc-light-l1 ">
                                        <span className=" pr-0 pos-rel text-110 font-weight-bold">
                                            Author :{"  "}
                                        </span>
                                        <span>Mr/Mme </span>
                                        {group.project
                                            ? group.author.lastname
                                            : "-"}
                                    </li>
                                    <li className="list-group-item  bgc-light-l1 ">
                                        <span className=" pr-0 pos-rel text-110 font-weight-bold">
                                            Supervisor:{"  "}
                                        </span>
                                        {group.supervisor
                                            ? group.supervisor.teacher.user
                                                  .firstname +
                                              " " +
                                              group.supervisor.teacher.user
                                                  .lastname
                                            : "-"}
                                    </li>
                                    <li className="list-group-item  bgc-light-l1 ">
                                        <span className=" pr-0 pos-rel text-110 font-weight-bold">
                                            Level:{"  "}
                                        </span>
                                        {group.project
                                            ? group.level.year +
                                              " " +
                                              group.level.cycle +
                                              " " +
                                              group.level.speciality
                                            : "-"}
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className=" col cards-container">
                            <div className="card border-0 shadow-sm radius-0">
                                <div className="card-header ">
                                    <h5 className="card-title text-dark">
                                        <i className="far fa-user text-dark  mr-0.7px p-1"></i>
                                        Members
                                    </h5>
                                </div>

                                <div className="card-body bgc-transparent p-0 border-1 brc-primary-m3 border-t-0">
                                    <table className="table table-hover mb-0 text-danger">
                                        <thead className="text-dark-l2 text-95">
                                            <tr>
                                                <th>Firstname</th>
                                                <th>Lastname</th>
                                                <th>
                                                    <i className="fa fa-at text-orange-d1 mr-1px"></i>
                                                    Email
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {group.members.map((member) => (
                                                <tr>
                                                    <td className="text-dark-m2">
                                                        {member.user.firstname}
                                                    </td>
                                                    <td className="text-dark-m2">
                                                        {member.user.lastname}
                                                    </td>
                                                    <td>
                                                        <a
                                                            href="#"
                                                            className="text-primary-d2"
                                                        >
                                                            {member.user.email}
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {projects.length>0 && group.state!="approved"?<><div className="row ">
                        <h4 className="page-title text-primary-d2 text-100">
                            Wanted Projects :
                        </h4>
                    </div>
                    {projects.map((project)=>{
                        return(<>
                            <label className="text-dark text-90">
                           {project.p_id}#: { project.title+": "+project.summary}.</label>
                           </>
                        )
                    })}
                    </> : ""}
                    
                </div>
            </td>
        </tr>
    );
}
export default Details;
