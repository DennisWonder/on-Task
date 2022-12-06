import { data } from "autoprefixer";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { supabaseClient } from "../../config/supabase-client";
import CardStats from "../Cards/CardStats";
import Salutation from "./Salutation";
import { Link } from "react-router-dom";

// components

export default function HeaderStats({ userId }) {
  const [workSpacesCreated, setWorkSpacesCreated] = useState(0);
  const [dateCreated, setDateCreated] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [tasksCollaborated, setTasksCollaborated] = useState(0);
  const [eventsCreated, setEventsCreated] = useState(0);
  const [eventDate, setEventDate] = useState("");

  useEffect(() => {
    getWorkSpaceCount();
    getTasksCompleted();
    getEvents();
    getCollaboratedWorkSpaces();
  }, []);

  const getWorkSpaceCount = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.log(error);
      }
      setDateCreated(data[0]?.inserted_at);
    } catch (error) {
      console.log(error.message);
    }
  };

  // get WorkSpaces with collaborators
  const getCollaboratedWorkSpaces = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("work_space")
        .select("*");
      if (error) {
        console.log(error);
      }

      setWorkSpacesCreated(
        data.filter((data) => data.user_id === userId).length
      );
      // console.log(data);

      const filteredData = data.filter((data) => data.collaborators !== null);

      const yourData = filteredData.filter((data) => data.user_id === userId);
      const collabData = filteredData.filter((data) =>
        data.collaborators.includes(userId)
      );
      const total = yourData.length + collabData.length;
      setTasksCollaborated(total);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTasksCompleted = async () => {
    try {
      let { data: tasks, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        throw error;
      }
      if (tasks) {
        let completedTasks = tasks.filter((task) => task.is_complete === true);
        // let collaboratedTasks = tasks.filter(
        //   (task) => task.collaborators_count > 0
        // );
        setTasksCompleted(completedTasks.length);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getEvents = async () => {
    try {
      let { data: events, error } = await supabaseClient
        .from("events")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        throw error;
      }
      if (events) {
        setEventsCreated(events.length);
        setEventDate(events[0]?.event_date);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          {/* Salutation */}
          <Salutation />
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Work Spaces Created"
                  statTitle={workSpacesCreated}
                  link="admin/tasks-created"
                  statDescripiron={
                    dateCreated
                      ? `Since: ${moment(dateCreated).format("MMM Do YY")}`
                      : "No tasks Created"
                  }
                  statIconColor="bg-green-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Tasks Completed"
                  statTitle={tasksCompleted}
                  link="admin/tasks-completed"
                  statDescripiron={
                    dateCreated
                      ? `Since: ${moment(dateCreated).format("MMM Do YY")}`
                      : "No tasks Collaborated"
                  }
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Work Spaces Collaborated"
                  statTitle={tasksCollaborated}
                  link="admin/tasks-collaborated"
                  statDescripiron={
                    dateCreated
                      ? `Since: ${moment(dateCreated).format("MMM Do YY")}`
                      : "No tasks Collaborated"
                  }
                  statIconColor="bg-pink-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Events Created"
                  link="admin/events"
                  statTitle={eventsCreated}
                  statDescripiron={
                    eventDate
                      ? `Since: ${moment(eventDate).format("MMM Do YY")}`
                      : "Events not yet created"
                  }
                  statIconColor="bg-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
