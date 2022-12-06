import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabaseClient } from "../../config/supabase-client";
import userContext from "../../context/UserContext";
import PlaceHolder from "../PlaceHolder";
import moment from "moment";
// components
const CardUpcomingEvents = ({ setShowModal, userId }) => {
  const [events, setEvents] = useState();

  useEffect(() => {
    getEvents();
  }, []);
  const getEvents = async () => {
    try {
      let { data: events, error } = await supabaseClient
        .from("events")
        .select("*")
        // .order("due_date", { ascending: true })
        .eq("user_id", userId);

      if (error) {
        throw error;
      }
      if (events.length > 0) {
        // if event is after now

        const filteredEvents = events.filter(
          (event) => moment(event.event_date) > moment(new Date())
        );

        setEvents(filteredEvents);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-gray-700">
                Upcoming Events
              </h3>
            </div>
            <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <Link to="/admin/events/">
                <button
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  See all
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-hidden h-60 overflow-y-auto">
          {/* Projects table */}
          <table className="items-center  w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr className="sticky top-0">
                <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Event
                </th>
                <th className="px-6 bg-gray-50 text-gray-500 align-middle border border-solid border-gray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {events ? (
                events.map((item) => (
                  <tr key={item.id}>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {item.event_name}
                    </th>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <span className="mr-1 ">
                          {moment(item.event_date).format("LLL")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <PlaceHolder message="No Events" />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CardUpcomingEvents;
