import AOS from "aos";
import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Swal } from "sweetalert2";

function Profile() {
    const Swal = require("sweetalert2");
    const history = useHistory();
    const [passwordErr, setPasswordErr] = useState(false);
    const [user, setUser] = useState([]);
    const [phone,setPhone] = useState('');
    const [address,setAddress] = useState('');
    const [user_id, setId] = useState(localStorage.getItem("user_id"));
    const [token, setToken] = useState(localStorage.getItem("token"));

    const updatePicture = async (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("file", event.target.files[0]);
        let url = "http://127.0.0.1:8000/api/users/profile_picture/edit/";
        let options = {
            method: "post",
            url: url,
            data: data,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        await axios(options).then((res) => {
            let data = res.data;
            setUser(data);
            const Swal = require("sweetalert2");
            Swal.fire({
                title: "Action required",
                text: "Please reload the page to refresh all your data, to do so click 'Confirm'",
                icon: "warning",
                iconColor: "#FFBB47",
                showCancelButton: true,
                confirmButtonColor: "#16537e",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirm",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    window.location.reload(false);
                }
            });
        });
    };

    const getUser = async () => {
        let url = "http://127.0.0.1:8000/api/users/" + user_id;
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
            console.log(data);
            setUser(data);
        });
    };

    useEffect(() => {
        if (token !== null) {
            getUser();
            AOS.init();
            AOS.refresh();
        } else {
            history.push("/login");
        }
    }, []);

    var loadFile = function (event) {
        var image = document.getElementById("output");
        image.src = URL.createObjectURL(event.target.files[0]);
    };

    const handlePhone = (event) => {
        setPhone(event.target.value );
    };
    const handleAdr = (event) => {
        setAddress(event.target.value );
    };

    function handlePassword(event) {
        let item = event.target.value;
        if (item.length > 8) {
            setPasswordErr(false);

            setUser({ ...user, ["password"]: event.target.value });
        } else {
            setPasswordErr(true);
        }
    }

    const update = async (event) => {
        event.preventDefault();
        setUser({ ...user, ["phone"]: phone});
        setUser({ ...user, ["address"]: address });
        let url = "http://127.0.0.1:8000/api/edit/profile";
        let options = {
            method: "put",
            url: url,
            data: user,
            headers: {
                Authorization: "Bearer " + token,
                Accept: "Application/json",
            },
        };
        console.log(options);
        try {
            let response = await axios(options);
            if (response && response.status === 200) {
                Swal.fire({
                    title: "Profile Updated",
                    icon: "success",
                    iconColor: "#3dc00c",
                }).then(async () => {
                    history.push("/profile");
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Oops somthing hapened!",
                text: "Please verify your input and try again",
                icon: "error",
            });
        }
    };

    return (
        <div className="page-content container container-plus">
            <h1 class="page-title text-primary-d2 text-150">My Profile</h1>

            <div className="row  p-5 d-flex flex-column ustify-content-center align-items-center">
                {/* the left side profile picture and other info */}
                <div className="row  justify-content-center align-items-center">
                    <div className="d-flex flex-column py-3 px-lg-3 justify-content-center align-items-center">
                        <div className="profile-pic">
                            <label className="-label" htmlFor="file">
                                <i class="fas fa-camera"></i>
                                <span>Change Image</span>
                            </label>
                            <input
                                id="file"
                                type="file"
                                onChange={(event) => {
                                    updatePicture(event);
                                }}
                            />
                            <img
                                src={
                                    "http://127.0.0.1:8000/files/" +
                                    user.profile_picture
                                }
                                id="output"
                                width={200}
                            />
                        </div>
                        <label
                            className="capital form-label m-1"
                            style={{ fontSize: "25px" }}
                        >
                            {user.firstname} {user.lastname}
                        </label>
                    </div>
                </div>
                {/* .col */}
                {/* the right side profile tabs */}

                <div className="card dcard h-100">
                    <div className="card-body p-0">
                        <div className="position-tr w-100 border-t-4 brc-blue-m2 radius-2 d-md-none" />
                        <ul
                            id="profile-tabs"
                            className="nav nav-tabs-scroll is-scrollable nav-tabs nav-tabs-simple p-1px pl-25 bgc-secondary-l4 border-b-1 brc-dark-l3 radius-t-1"
                            role="tablist"
                        >
                            <li className="nav-item mr-2 mr-lg-3">
                                <a
                                    className="d-style nav-link active px-2 py-35 brc-primary-tp1"
                                    data-toggle="tab"
                                    href="#profile-tab-overview"
                                    role="tab"
                                    aria-controls="profile-tab-overview"
                                    aria-selected="true"
                                >
                                    <span className="d-n-active text-dark-l1">
                                        1. Overview
                                    </span>
                                    <span className="d-active text-dark-m3">
                                        1. Overview
                                    </span>
                                </a>
                            </li>
                            <li className="nav-item mr-2 mr-lg-3">
                                <a
                                    className="d-style nav-link px-2 py-35 brc-primary-tp1"
                                    data-toggle="tab"
                                    href="#profile-tab-edit"
                                    role="tab"
                                    aria-controls="profile-tab-edit"
                                    aria-selected="false"
                                >
                                    <span className="d-n-active text-dark-l1">
                                        2. Edit Info
                                    </span>
                                    <span className="d-active text-dark-m3">
                                        2. Edit Info
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* /.sticky-nav-md */}
                    <div className="tab-content px-0 tab-sliding flex-grow-1 border-0">
                        {/* overview tab */}
                        <div
                            className="tab-pane active show px-1 px-md-2 px-lg-4"
                            id="profile-tab-overview"
                        >
                            <div className="row mt-1">
                                <div className="col-12 px-4">
                                    {/* infobox */}
                                    <div className="d-flex justify-content-center my-3 flex-wrap flex-equal">
                                        {" "}
                                        <div className="col-12 col-md-4">
                                            <div className="card acard">
                                                <div className="card-body">
                                                    <span className="d-none position-tl mt-2 pt-3px">
                                                        <span className="text-white bgc-blue-d1 ml-2 radius-b-1 py-2 px-2">
                                                            <i className="fa fa-star" />
                                                        </span>
                                                    </span>

                                                    {/* /.d-flex */}
                                                </div>
                                                {/* /.card-body */}
                                            </div>
                                            {/* /.card */}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 px-4 mt-3">
                                    <h4 className="mt-2 text-dark-m3 text-130">
                                        <i className="fa fa-pen-alt text-85 text-purple-d1 w-3" />
                                        About Me
                                    </h4>
                                    <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start mt-3 mb-2 text-95 pl-3">
                                        <div className="mt-2 mt-sm-0 flex-grow-1 text-dark-m2">
                                            <p className="mb-1">
                                                Hello, may name is Youcef. I'm a
                                                professional designer based in
                                                Dublin.
                                            </p>
                                            <p className="mb-1">
                                                My job is mostly lorem ipsuming
                                                and dolor sit ameting for
                                                clients!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-12 px-4 mb-3">
                                    <h4 className="text-dark-m3 text-140">
                                        <i className="fa fa-info text-blue mr-1 w-2" />
                                        Settings
                                    </h4>
                                    <hr className="w-100 mx-auto mb-0 brc-default-l2" />
                                    <div className="bgc-white radius-1">
                                        <table className="table table table-striped-default table-borderless">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <i className="far fa-user text-success" />
                                                    </td>
                                                    <td className="text-95 text-600 text-secondary-d2">
                                                        Username
                                                    </td>
                                                    <td className="text-dark-m3 capital">
                                                        {user.firstname}{" "}
                                                        {user.lastname}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <i
                                                            class="fa fa-graduation-cap"
                                                            aria-hidden="true"
                                                        />
                                                    </td>
                                                    <td className="text-95 text-600 text-secondary-d2">
                                                        Role
                                                    </td>
                                                    <td className="text-dark-m3">
                                                        {user.role}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <i className="far fa-envelope text-blue" />
                                                    </td>
                                                    <td className="text-95 text-600 text-secondary-d2">
                                                        Email
                                                    </td>
                                                    <td className="text-blue-d1 text-wrap">
                                                        {user.email}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <i className="fa fa-phone text-purple" />
                                                    </td>
                                                    <td className="text-95 text-600 text-secondary-d2">
                                                        Phone
                                                    </td>
                                                    <td className="text-dark-m3">
                                                        {user.phone}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <i className="fa fa-map-marker text-orange-d1" />
                                                    </td>
                                                    <td className="text-95 text-600 text-secondary-d2">
                                                        Location
                                                    </td>
                                                    <td className="text-dark-m3">
                                                        {user.address != null
                                                            ? user.address
                                                            : "You have not entered your adress yet."}
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <i
                                                            className="fa fa-calendar text-success"
                                                            aria-hidden="true"
                                                        />
                                                    </td>
                                                    <td
                                                        className="text-95 text-600 text-secondary-d2"
                                                        type="date"
                                                    >
                                                        Birthday
                                                    </td>
                                                    <td>{user.birthday}</td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <i
                                                            class="fa fa-venus-mars text-purple"
                                                            aria-hidden="true"
                                                        />
                                                    </td>
                                                    <td className="text-95 text-600 text-secondary-d2">
                                                        Gender
                                                    </td>
                                                    <td className="text-dark-m3">
                                                        {user.gender}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.tab-pane */}
                        {/* activity tab */}
                        {/* profile edit tab */}
                        <div
                            className="tab-pane px-1 px-md-2 px-lg-4 active"
                            id="profile-tab-edit"
                        >
                            <div className="row">
                                <div className="col-12 col-lg-10 offset-lg-1 mt-3">
                                    <form
                                        className="text-grey-d1 text-95"
                                        autoComplete="off"
                                        onSubmit={(event) => update(event)}
                                    >
                                        <div className="form-group row mx-0">
                                            <label
                                                htmlFor="id-field2"
                                                className="col-sm-4 col-xl-3 col-form-label text-sm-right"
                                            >
                                                Password
                                            </label>
                                            <div className="col-sm-8 col-lg-6">
                                                <input
                                                    type="password"
                                                    className="form-control brc-on-focus brc-success-m2"
                                                    placeholder="Enter your password here"
                                                    required="required"
                                                    onChange={(event) =>
                                                        handlePassword(event)
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {passwordErr ? (
                                            <div className="form-group row mx-0">
                                                <label
                                                    htmlFor="id-field2"
                                                    className="col-sm-4 col-xl-3 col-form-label text-sm-right"
                                                ></label>
                                                <div className="col-sm-8 col-lg-6 error">
                                                    your password should be
                                                    higher than 8 characters!
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                        <div className="form-group row mx-0">
                                            <label
                                                htmlFor="id-field3"
                                                className="col-sm-4 col-xl-3 col-form-label text-sm-right"
                                            >
                                                Phone Number
                                            </label>
                                            <div className="col-sm-8 col-lg-6">
                                                <input
                                                    type="text"
                                                    className="form-control brc-on-focus brc-success-m2"
                                                    placeholder="e.g. (+213) 70000000"
                                                    name="phone"
                                                    onChange={(event) =>
                                                        handlePhone(event)
                                                    }
                                                    defaultValue={user.phone}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row mx-0">
                                            <label
                                                htmlFor="id-field4"
                                                className="col-sm-4 col-xl-3 col-form-label text-sm-right"
                                            >
                                                Location
                                            </label>
                                            <div className="col-sm-8 col-lg-6">
                                                <input
                                                    type="text"
                                                    name="adresse"
                                                    className="form-control brc-on-focus brc-success-m2"
                                                    placeholder="Enter your adresse here"
                                                    required="required"
                                                    onChange={(event) =>
                                                        handleAdr(event)
                                                    }
                                                    defaultValue={user.address}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <hr className="border-double brc-dark-l3" />
                                            <div className="form-group text-center mt-4 mb-3">
                                                <input
                                                    type="reset"
                                                    className="btn btn-outline-secondary radius-1 px-3 mx-1"
                                                    value={"Cancel"}
                                                />
                                                <button
                                                    type="submit"
                                                    className="btn btn-outline-green radius-1 px-4 mx-1"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* /.tab-pane */}
                    </div>
                    {/* /.tab-content */}
                </div>
                {/* /.card */}
            </div>
        </div>
    );
}
export default Profile;
