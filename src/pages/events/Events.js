import React, { useContext, useEffect } from "react";
import Admin from "../../layouts/Admin";
import { supabaseClient } from "../../config/supabase-client";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import CardEvents from "../../components/Cards/CardEvents";
import { GoDiffAdded } from "react-icons/go";
import { useState } from "react";
import ModalEvent from "../../components/modal/ModalEvent";
import PlaceHolder from "../../components/PlaceHolder";
import userContext from "../../context/UserContext";

const Events = () => {
  const [showModalEvent, setShowModalEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const user = useContext(userContext);

  useEffect(() => {
    getEvents();
  }, []);
  const getEvents = async () => {
    try {
      let { data: events, error } = await supabaseClient
        .from("events")
        .select("*")
        .eq("user_id", user.user.id);
      if (error) {
        throw error;
      }

      if (events) {
        setEvents(events);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <ModalEvent
        showModalEvent={showModalEvent}
        setShowModalEvent={setShowModalEvent}
        getEvents={getEvents}
      />

      <Sidebar />
      <AdminNavbar />
      <div className="relative md:ml-64">
        <div className="flex flex-wrap mt-10 ">
          <div className="w-full mb-12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ">
              <div className="rounded-t mb-0 px-4 py-3 border-0 md:mt-8">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 className={"font-semibold text-lg "}>Events</h3>
                  </div>
                  <button
                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2   "
                    onClick={() => setShowModalEvent(true)}
                  >
                    <span className="flex  justify-center items-center">
                      <GoDiffAdded className="mr-2" />
                      Add An Event
                    </span>
                  </button>
                </div>
              </div>
              <div className="block w-full overflow-x-auto">
                <div class="flex flex-wrap my-5 mx-7">
                  {/* {events.map(event => (

                    <CardEvents name={event.event_name} time={event.event_date}  key= {event.id} id={event.id} getEvents={getEvents}/>
                  ))} */}
                  {events.length !== 0 ? (
                    events.map((event) => (
                      <CardEvents
                        name={event.event_name}
                        time={event.event_date}
                        key={event.id}
                        id={event.id}
                        getEvents={getEvents}
                      />
                    ))
                  ) : (
                    <PlaceHolder message="No Events Added" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Events;
Events.layout = Admin;
