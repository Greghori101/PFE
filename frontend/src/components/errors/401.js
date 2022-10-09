import { Component } from "react";
import { Link } from "react-router-dom";
export default class Error401 extends Component {
    render() {
        return (
            <div className="page-content container container-plus">
                <div className="row justify-content-center pos-rel">
                    <div className="pos-rel col-12 col-sm-7 mt-1 mt-sm-3">
                        <div className="py-3 px-1 py-lg-4 px-lg-5">
                            <div className="text-center fa-4x text-orange-d2 letter-spacing-4">
                                401
                            </div>
                            <div className="text-center">
                                <span className="text-150 text-primary-d2">
                                    You are unauthorised to complete this
                                    action...
                                </span>
                            </div>
                            <div className="mt-4 text-105 bgc-secondary-l4 py-2 px-3 radius-1">
                                <span className="text-600 text-dark-m3">
                                    Try one of the following:
                                </span>
                                <ul className="list-unstyled mt-3 mx-sm-3 mb-0 text-dark-m2 ">
                                    <li className="my-2">
                                        <i className="fa fa-circle text-xs text-blue-d1 align-middle mr-1" />
                                        Re-check the url
                                    </li>
                                    <li className="my-2">
                                        <i className="fa fa-circle text-xs text-blue-d1 align-middle mr-1" />
                                        Contact Admin
                                    </li>
                                    <li className="my-2">
                                        <i className="fa fa-circle text-xs text-blue-d1 align-middle mr-1" />
                                        Tell us about it
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center mt-4">
                                <Link
                                    to={"/profile"}
                                    type="button"
                                    className="btn btn-bgc-white btn-outline-default px-35 btn-text-slide-x"
                                >
                                    <i className="btn-text-2 fa fa-arrow-left text-110 align-text-bottom mr-2" />
                                    Go To My Profile
                                </Link>
                                <Link
                                    to={"/dashboard"}
                                    type="button"
                                    className="btn btn-bgc-white btn-outline-primary px-35"
                                >
                                    <i className="fa fa-home" />
                                    Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
