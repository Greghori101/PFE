import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Supervisors from "./SelectSupervisors";
import TeamLeaders from "./SelectTeamLeader";

function Levels() {
    const [year, setYear] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [domaine, setDomaine] = useState("");
    const [cycle, setCycle] = useState("");
    const [levelForm, setLevelForm] = useState(false);
    const [editForm, setEditForm] = useState(false);
    const [levels, setLevels] = useState([]);
    const [levelId, setLevelId] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const urls = "http://127.0.0.1:8000/api";
    let history = useHistory();
    const Swal = require("sweetalert2");

    const addLevel = async (event) => {
        event.preventDefault();
        const data = {
            year,
            speciality,
            domaine,
            cycle,
        };
        let url = urls + "/levels/add";
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
                title: "Level Added!",
                text: "Level has been added.",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                setEditForm(false);
                setLevelForm(false);
                getLevels();
            });
        }
    };

    const deleteLevel = async (levelId) => {
        let url = urls + "/levels/delete/" + levelId;
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
                let options = {
                    method: "DELETE",
                    url: url,
                    headers: {
                        Authorization: "Bearer " + token,
                        Accept: "Application/json",
                    },
                };
                let response = await axios(options);
                if (response && response.status === 200) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The level has been deleted",
                        icon: "success",
                        iconColor: "#3dc00c",
                    }).then(async () => {
                        setEditForm(false);
                        setLevelForm(false);
                        getLevels()
                    });
                }
            }
        });
    };

    const editLevel = async (event) => {

        event.preventDefault();
        const data = {
            year,
            speciality,
            domaine,
            cycle,
        };
        let url = "http://127.0.0.1:8000/api/levels/edit/" + levelId;
        let options = {
            method: "put",
            url: url,
            data: data,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        let response = await axios(options);
        if (response.status === 200) {
            Swal.fire({
                title: "Level Updated!",
                text: "Level has been updated.",
                icon: "success",
                iconColor: "#3dc00c",
            }).then(() => {
                setEditForm(false);
                setLevelForm(false);
                getLevels();
            });
        }
    };

    const getLevels = async () => {
        let url = urls + "/levels";
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
        });
    };

    useEffect(() => {
        if (token !== null) {
            getLevels();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    return ( <> {
            levelForm ? (<
                div className="user-form"
                style={
                    {
                        backgroundColor: "rgba(0,0,0,.5)",
                        position: "fixed",
                        top: "0",
                        left: "0",
                        height: "100vh",
                        zIndex: "100000000",
                    }
                } >
                <div className="row" style={{ width: "800px" }}>
                        <div className="col">
                            <div className="card shadow mb-3">
                                <div className="card-header py-3">
                                    <p className="text-primary m-0 fw-bold">
                                        {editForm ? "Edit Level" : "Add Level"}
                                    </p>
                                    <a
                                        onClick={() => {
                                            setLevelForm(false);
                                            setEditForm(false);
                                        }}
                                        data-action="close"
                                        className="card-toolbar-btn text-danger"
                                    >
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                                <div className="card-body">
                                    <form
                                        className="user pl-5 pr-5"
                                        
                                        onSubmit={editForm
                                            ? (event)=>editLevel(event)
                                            : (event)=>addLevel(event)}
                                    >
                                        <div className="row mb-3">
                                            <label className="form-label">
                                                Year
                                            </label>
                                            <input
                                                id="exampleFirstName-1"
                                                className="form-control form-control-user "
                                                type="text"
                                                placeholder="Enter the year..."
                                                defaultValue={year}
                                                name="year"
                                                onChange={(event) => {
                                                    setYear(event.target.value);
                                                }}
                                            />
                                        </div>
                                        <div className="row mb-3">
                                            <label className="form-label">
                                                Speciality
                                            </label>
                                            <input
                                                id="exampleFirstName-1"
                                                className="form-control form-control-user "
                                                type="text"
                                                placeholder="Enter the specialty..."
                                                name="specialty"
                                                defaultValue={speciality}
                                                onChange={(event) => {
                                                    setSpeciality(
                                                        event.target.value
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="row mb-3">
                                            <label className="form-label">
                                                Domaine
                                            </label>
                                            <input
                                                id="exampleFirstName-1"
                                                className="form-control form-control-user "
                                                type="text"
                                                defaultValue={domaine}
                                                placeholder="Enter the domaine..."
                                                name="domaine"
                                                onChange={(event) => {
                                                    setDomaine(
                                                        event.target.value
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="row mb-3">
                                            <label className="form-label">
                                                Cycle
                                            </label>
                                            <input
                                                defaultValue={cycle}
                                                id="exampleFirstName-1"
                                                className="form-control form-control-user "
                                                type="text"
                                                placeholder="Enter the cycle..."
                                                name="type"
                                                onChange={(event) => {
                                                    setCycle(
                                                        event.target.value
                                                    );
                                                }}
                                            />
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
                                                {editForm
                                                    ? "Edit level"
                                                    : "Create new level"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                ""
            )}
            <div className="p-5">
                <h1 className="page-title text-primary-d2 text-150 mb-3">
                    All Levels
                </h1>
                <div className="mt-3 mt-lg-4 shadow-lg">
                    <div className="card bcard pt-1 pt-lg-2">
                        <div className="card-header brc-primary-l3">
                            <h5 className="card-title pl-1 text-120">
                                All Levels
                            </h5>
                            <a
                                onClick={() => {
                                    setCycle(""
                                    );
                                    setDomaine(""
                                    );
                                    setYear(""
                                    );
                                    setSpeciality(""
                                    );
                                    setLevelForm(true);
                                }}
                                style={{ width: "35px", height: "35px" }}
                                className="btn radius-round btn-outline-primary border-2 btn-sm mr-2 d-flex justify-content-center align-items-center"
                            >
                                <i className="fa fa-plus" />
                            </a>
                            <div className="card-toolbar align-self-center">
                                <a
                                    href="#"
                                    data-action="toggle"
                                    className="card-toolbar-btn text-grey text-110"
                                >
                                    <i className="fa fa-chevron-up" />
                                </a>
                            </div>
                        </div>
                        <div className="card-body p-4 border-0">
                            <div
                                className="table-responsive table mt-2"
                                id="dataTable"
                                role="grid"
                                aria-describedby="dataTable_info"
                            >
                                <table
                                    id="users-table"
                                    className="mb-0 table table-borderless table-bordered-x brc-secondary-l3 text-dark-m2 radius-1 overflow-hidden"
                                >
                                    <thead className="text-dark-tp3 bgc-grey-l4 text-90 border-b-1 brc-transparent">
                                        <tr>
                                            <th>Year</th>
                                            <th>Speciality</th>
                                            <th>Cycle</th>
                                            <th>Domaine</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {levels.map((level, id) => {
                                            return (
                                                <tr key={id}>
                                                    <td>{level.year}</td>
                                                    <td>{level.speciality}</td>
                                                    <td>{level.cycle}</td>
                                                    <td>{level.domaine}</td>
                                                    <td
                                                        style={{
                                                            width: "50px",
                                                        }}
                                                    >
                                                        <div className="d-flex flex-row">
                                                            <a
                                                                className="btn btn-danger btn-circle m-1"
                                                                role="button"
                                                                onClick={() =>
                                                                    deleteLevel(
                                                                        level.id
                                                                    )
                                                                }
                                                            >
                                                                <i className="fas fa-trash text-white"></i>
                                                            </a>
                                                            <a
                                                                className="btn btn-info btn-circle m-1"
                                                                role="button"
                                                                onClick={() => {
                                                                    setCycle(
                                                                        level.cycle
                                                                    );
                                                                    setDomaine(
                                                                        level.domaine
                                                                    );
                                                                    setYear(
                                                                        level.year
                                                                    );
                                                                    setSpeciality(
                                                                        level.speciality
                                                                    );
                                                                    setLevelId(level.id);
                                                                    setEditForm(
                                                                        true
                                                                    );

                                                                    setLevelForm(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        icon.faPencilAlt
                                                                    }
                                                                ></FontAwesomeIcon>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Levels;
