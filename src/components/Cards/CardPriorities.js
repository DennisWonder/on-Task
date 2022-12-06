import React, { useEffect, useState } from "react";
import { supabaseClient } from "../../config/supabase-client";
import CardTasksTable from "./CardTasksTable";

// components

export default function CardPriorities({ userId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);
  const getTasks = async () => {
    try {
      let { data: tasks, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .order("due_date", { ascending: true })
        .eq("user_id", userId);

      if (error) {
        throw error;
      }
      if (tasks) {
        console.log(tasks);

        const incompleteTasks = tasks.filter(
          (task) => task.is_complete === false
        );

        setTasks(incompleteTasks);
        // TODO: To create a reminder module
        // {
        //   tasks.map((task) =>
        //     emailReminder.at(
        //       " 23:27 :00",
        //       "laukeymwaura@gmail.com",
        //       user.user.email,
        //       `This is a reminder for ${task.task_name} due on ${task.due_date}`
        //     )
        //   );
        // }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Priorities
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Task
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Due Date
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                return (
                  <CardTasksTable
                    key={task.id}
                    taskName={task.task_name}
                    taskDueDate={task.due_date}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
