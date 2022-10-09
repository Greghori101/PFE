import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import Moment from "moment";
import * as icon from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

function Planing() {
    const Swal = require("sweetalert2");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [ets, setEvents] = useState([]);
    const role = localStorage.getItem("role");

    let history = useHistory();
    const [id, setId] = useState(0);
    const drop = () => {
        alert("itemdroped");
    };
    const handleDateSelect = (selectInfo) => {
        let title = prompt("Please enter a new title for your event");
        let calendarApi = selectInfo.view.calendar;

        if (title) {
            let i = id;
            setId(i + 1);
            calendarApi.addEvent({
                id: id,
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            });
            let event = {
                id: id,
                title,
            };
            let list = ets;
            list.push(event);
            console.log(list);
            setEvents(list);
        }
        calendarApi.unselect();
    };
    let handleEventClick = (clickInfo) => {
        alert("dlsads");
        clickInfo.event.remove();
    };

    let handleEvents = (events) => {
        // alert("get events")
    };

    useEffect(() => {
        if (token !== null) {

           
            AOS.init();
            AOS.refresh();
        } else{
            history.push("/login");
        }
    }, []);

    return (
        <div className="page-content container container-plus">
            <h1 class="page-title text-primary-d2 text-150">Planning </h1>
           
                <div className="row">
                    <div className="col pl-5 pr-5 mr-5 ml-5">
                        
                <div className="planing p-3 mt-4">
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        listPlugin,
                        timeGridPlugin,
                        interactionPlugin,
                    ]}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,list",
                    }}
                    eventContent={renderEventContent}
                    initialView="dayGridMonth"
                />
                </div>
            </div>
            </div>
        </div>
    );
}

export default Planing;

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}
