import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { ImBin, ImPencil2 } from "react-icons/im";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { supabaseClient } from "../../config/supabase-client";
import ModalEditEvent from "../modal/ModalEditEvent";

import Schedule from "react-schedule-job";
import userContext from "../../context/UserContext";

import { reminder } from "./../../util/Reminder";

const CardEvents = ({ name, time, id, getEvents }) => {
  const userEmail = useContext(userContext).user.email;

  const minute = time.slice(14, 16);
  const hour = time.slice(11, 13);
  const day = time.slice(8, 10);
  const month = time.slice(5, 7);

  // send reminder 1 hr before
  const jobs = [
    {
      fn: () => {
        if (
          moment(time).format("MMMM Do YYYY, h:mm:ss a") >
          moment().format("MMMM Do YYYY, h:mm:ss a")
        ) {
          reminder(name, time, "event", userEmail);
        }
      },
      id: "1",
      schedule: `${minute} ${hour - 1} ${day} ${month} *`,
    },
    {
      fn: () => {
        if (
          moment(time).format("MMMM Do YYYY, h:mm:ss a") >
          moment().format("MMMM Do YYYY, h:mm:ss a")
        ) {
          reminder(name, time, "event", userEmail);
        }
      },
      id: "3",
      schedule: `${minute} ${hour} ${day - 1} ${month} *`,
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const deleteEvent = async (id) => {
    try {
      const { data, error } = await supabaseClient
        .from("events")
        .delete()
        .eq("id", id);
      if (error) {
        throw error;
      }
      if (data)
        toast.success("Successfully Deleted Event", {
          position: toast.POSITION.TOP_CENTER,
        });
    } catch (error) {
      console.log(error.message);
    } finally {
      getEvents();
    }
  };
  return (
    <>
      <ModalEditEvent
        showModal={showModal}
        setShowModal={setShowModal}
        id={id}
      />

      <div class="max-w-sm bg-blue-100 rounded-lg border border-gray-400 shadow-md mx-2 my-1 ">
        <div className="border-t-0 px-6 align-middle border-b border-gray-300 text-xs whitespace-nowrap p-4 cursor-pointer flex flex-row-reverse">
          <ImBin onClick={() => deleteEvent(id)} />
          <ImPencil2 onClick={() => setShowModal(true)} className="mr-5" />
        </div>
        <div class="p-6">
          <h2 class="text-gray-900 text-xl font-medium mb-2">{name} </h2>
        </div>
        <div class="py-3 px-6 border-t text-sm border-gray-300 text-gray-600">
          Event Date:{" "}
          <span class="text-xs text-gray-700">
            {moment(time).format("llll")}
          </span>
        </div>
      </div>
      <Schedule
        jobs={jobs}
        timeZone="Africa/Nairobi"
        dashboard={{ hidden: true }}
      />
    </>
  );
};

export default CardEvents;
