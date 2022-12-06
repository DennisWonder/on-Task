import React, { useContext, useEffect, useState } from "react";

// components

import CardLineChart from "../../components/Cards/CardLineChart";
import CardPriorities from "../../components/Cards/CardPriorities.js";

// context

import FooterAdmin from "../../components/footer/FooterAdmin";
import Sidebar from "../../components/Sidebar/Sidebar";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import HeaderStats from "../../components/Headers/HeaderStats";
import ModalWorkspace from "../../components/modal/ModalWorkspace";
import { supabaseClient } from "../../config/supabase-client";
import CardWorkSpaces from "../../components/Cards/CardWorkSpaces.js";
import CardUpcomingEvents from "../../components/Cards/CardUpcomingEvents.js";

import userContext from "../../context/UserContext";
import moment from "moment";

import Schedule from "react-schedule-job";
import emailjs from "@emailjs/browser";

export default function Dashboard({ session }) {
  console.log(session);
  // Workspaces
  const [showModal, setShowModal] = useState(false);
  const user = useContext(userContext);
  const userId = session?.user.id;
  useEffect(() => {
    supabaseClient.auth.session()?.user.last_sign_in_at === undefined &&
      setShowModal(true);

    sendReminders();
  }, []);

  const sendReminders = async () => {
    try {
      let { data: tasks, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .eq("is_complete", false);
      if (error) {
        throw error;
      }
      if (tasks) {
        tasks.map(({ due_date, task_name, task_description }) => {
          scheduler(due_date, task_name, task_description);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const scheduler = (time, name, description) => {
    const sendEmail = () => {
      emailjs
        .send(
          process.env.REACT_APP_SERVICE_ID,
          process.env.REACT_APP_TEMPLATE_ID,
          templateParams,
          process.env.REACT_APP_PUBKEY_EMAILJS
        )
        .then(function (response) {
          console.log("SUCCESS!", response.status, response.text);
        })
        .error((error) => console.log(error.message));
    };
    const templateParams = {
      to_email: user.user.email,
      time: moment(time).format("MMMM Do YYYY, h:mm:ss a"),
      task_name: `TASK : ${name}, DESCRPTION : ${description}`,
    };
    const minute = time.slice(14, 16);
    const hour = time.slice(11, 13);
    const day = time.slice(8, 10);
    const month = time.slice(5, 7);
    const jobs = [
      {
        fn: sendEmail,
        id: "2",
        schedule: `${minute} ${hour - 1} ${day} ${month} *`,
      },
    ];

    return (
      <Schedule
        jobs={jobs}
        timeZone="Africa/Nairobi"
        dashboard={{ hidden: true }}
      />
    );
  };
  return (
    <>
      <ModalWorkspace showModal={showModal} setShowModal={setShowModal} />
      <Sidebar />
      <div className="relative md:ml-64 ">
        <AdminNavbar />

        {/* Header */}

        <HeaderStats userId={userId} />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap mt-4">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <CardPriorities userId={userId} />
            </div>

            <div className="w-full xl:w-4/12 px-4">
              <CardWorkSpaces setShowModal={setShowModal} userId={userId} />
            </div>
          </div>{" "}
          <div className="flex flex-wrap">
            <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
              <CardLineChart userId={userId} />
            </div>
            <div className="w-full xl:w-4/12 px-4">
              <CardUpcomingEvents setShowModal={setShowModal} userId={userId} />
            </div>
          </div>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}

