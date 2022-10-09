import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";

function AddEvents() {
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
        if (token !== null && role==="admin") {

            let draggableEl = document.getElementById("external-events");
            new Draggable(draggableEl, {
                itemSelector: ".fc-event",
                eventData: function (eventEl) {
                    let title = eventEl.getAttribute("title");
                    let id = eventEl.getAttribute("data");
                    return {
                        title: title,
                        id: id,
                    };
                },
            });
            AOS.init();
            AOS.refresh();
        } else if(token !== null){

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
                    <div className="col-12 col-md-9">
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
                                drop={drop}
                                droppable={true}
                                editable={true}
                                eventContent={renderEventContent}
                                initialView="dayGridMonth"
                                selectable={true}
                                select={handleDateSelect}
                                eventClick={handleEventClick}
                                eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                                // you can update a remote database when these fire:
                                eventAdd={function () {
                                    alert("event added");
                                }}
                                eventChange={function () {
                                    alert("event modified");
                                }}
                                eventRemove={function () {
                                    alert("event removed");
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-3 mt-4">
                        <div className="bgc-secondary-l4 border-1 brc-secondary-l2 shadow-sm p-35 radius-1">
                            <p className="text-120 text-primary-d2">
                                Draggable Events
                            </p>
                            <p
                                id="alert-2"
                                className="alert bgc-white border-none border-l-4 brc-purple-m1"
                            >
                                Drag and drop the following events or click on a
                                date slot to add a new event
                            </p>
                            <div
                                id="external-events"
                                className="d-flex flex-column"
                            >
                                {ets.map((event, id) => {
                                    return (
                                        <div
                                            className="fc-event badge bgc-blue-d1 text-white border-0 py-2 text-90 mb-1 radius-2px"
                                            style={{ width: "120px" }}
                                            data-class="bgc-blue-d1 text-white text-95"
                                            title={event.title}
                                            data={event.id}
                                            key={id}
                                        >
                                            {event.title}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            
        </div>
    );
}

export default AddEvents;

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}
