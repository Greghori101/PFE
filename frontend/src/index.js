import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Users from "./components/admin/Users";
import AddProject from "./components/projects/AddProject";
import Sidebar from "./templates/Sidebar";
import Footer from "./templates/Footer";
import Navbar from "./templates/Navbar";
import Dashboard from "./templates/Dashboard";
import Login from "./components/users/Login";
import MyProjects from "./components/projects/MyProjects";
import MyProject from "./components/projects/MyProject";
import Profile from "./components/users/Profile";
import Project from "./components/projects/Project";
import Error404 from "./components/errors/404";
import Error401 from "./components/errors/401";

import Redirect404 from "./components/errors/Redirect404";
import EditProject from "./components/projects/EditProject";
import Home from "./templates/Home";
import GroupsList from "./components/groups/GroupsList";
import Loading from "./templates/Loading";
import NotSelectedStudents from "./components/groups/NotSelectedStudents";
import AddGroup from "./components/groups/AddGroup";
import Archive from "./components/projects/Archives";
import Planing from "./templates/Planing";
import Notifications from "./components/users/Notifications";
import TeamLeaders from "./components/admin/TeamLeaders";
import Supervisors from "./components/admin/Supervisors";
import Levels from "./components/admin/Levels";
import SearchResult from "./components/projects/SearchResult";
import Projects from "./components/projects/Projects";
import ArchivedUsers from "./components/admin/ArchivedUsers";
import AddEvents from "./templates/AddEvents";
import MyGroups from "./components/groups/MyGroups";
import Archives from "./components/projects/Archives";

ReactDOM.render(
    <div id="wrapper">
        <BrowserRouter>
            <Switch>
                <Route exact path="/dashboard">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Dashboard />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/archive/users">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <ArchivedUsers />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/levels">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Levels />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/teamleaders">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <TeamLeaders />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/supervisors">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Supervisors />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/myproject">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />

                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <div className="">
                                    <MyProject />
                                </div>
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/login">
                    <Login />
                </Route>

                <Route exact path="/users">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Users />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/profile">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Profile />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/projects/add">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <AddProject />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/projects/mine">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <MyProjects />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/planing">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Planing />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                
                <Route exact path="/planing/add">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <AddEvents />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/mygroups">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <MyGroups />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/projects/:id">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Project />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/students/rest">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <NotSelectedStudents />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/search/result">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <SearchResult/>
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/search/result/:searchfield">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <SearchResult/>
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>

                <Route exact path="/projects">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Projects />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/groups/add">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <AddGroup />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route path="/projects/edit/:id">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <EditProject />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route path="/archive/projects">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Archives />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route><Route exact path="/archive/projects/:id">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Archive />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route path="/groups">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <GroupsList />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>

                <Route exact path={"/"}>
                    <Home />
                </Route>
                <Route exact path="/error/404">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Error404 />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/error/401">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Error401 />
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route exact path="/notifications">
                    <div className="body-container">
                        <div className="main-container bgc-white">
                            <Sidebar />
                            <div className="main-content" role={"main"}>
                                <Navbar />
                                <Notifications/>
                                <Footer />
                            </div>
                        </div>
                    </div>
                </Route>
                <Route path="/*">
                    <Redirect404 />
                </Route>
            </Switch>
        </BrowserRouter>
    </div>,
    document.getElementById("root")
);
