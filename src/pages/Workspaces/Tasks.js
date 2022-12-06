import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormTasks from "../../components/form/FormTasks";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Admin from "../../layouts/Admin";
import Todo from "../../components/Todo/Todo";
import FilterButton from "../../components/Buttons/FilterButton";
import "./Tasks.css";
import { supabaseClient } from "../../config/supabase-client";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const Tasks = () => {
  const { space } = useParams();
  const [tasks, setTasks] = useState();
  const [userId, setUserId] = useState();
  const [workSpaceId, setWorkSpaceId] = useState();
  let [tasksInSpace, setTasksInSpace] = useState(0);
  const [showAddTasks, SetShowAddTasks] = useState(false);
  const [filter, setFilter] = useState("All");
  const [spaceName, setSpaceName] = useState("");
  useEffect(() => {
    getTasks();
    supabaseClient
      .from("space")
      .select("space_name, user_id, work_space_id, number_of_tasks")
      .eq("id", space)
      .then((res) => {
        setSpaceName(res.data[0].space_name);
        setUserId(res.data[0].user_id);
        setWorkSpaceId(res.data[0].work_space_id);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const toggleAdd = () => {
    SetShowAddTasks(!showAddTasks);
  };
  const getTasks = async () => {
    try {
      let { data: tasks, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("space_id", space);
      if (error) {
        throw error;
      }
      if (tasks) {
        setTasks(tasks);
        setTasksInSpace(tasks.length);
      }
    } catch (error) {
      console.log(error.message);
    }

    // const tasks = localStorage.getItem("tasks");
    // if (tasks) {
    //   setTasks(JSON.parse(tasks));
    // }
  };
  const FILTER_MAP = {
    All: () => true,
    Active: (task) => !task.is_complete,
    // Late: (task) => task.due_date > new Date(),
    Completed: (task) => task.is_complete,
  };

  const FILTER_NAMES = Object.keys(FILTER_MAP);
  async function toggleTaskCompleted(id, completed) {
    // get current time

    let time = new Date();

    try {
      const { data, error } = await supabaseClient
        .from("tasks")
        .update({
          is_complete: !completed,
          completed_at: time,
          modified_at: time,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      if (data) {
        toast.success(`Task Altered at ${time.toDateString()}`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      tasksProgress();
      getTasks();
    }
  }
  const taskList = tasks
    ?.filter(FILTER_MAP[filter])
    ?.map((task) => (
      <Todo
        id={task.id}
        name={task.task_name}
        description={task.task_description}
        due_date={task.due_date}
        completed={task.is_complete}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  async function addTask(name, description, dueDate) {
    let time = new Date();
    if (name !== "" && description !== "" && dueDate !== "") {
      if (dueDate < moment(time).format("YYYY-MM-DDTHH:mm")) {
        return toast.error("Due Date already past", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      try {
        const { data, error } = await supabaseClient.from("tasks").insert([
          {
            user_id: userId,
            task_name: name,
            task_description: description,
            space_id: space,
            due_date: dueDate,
            work_space_id: workSpaceId,
            modified_at: time,
          },
        ]);
        if (error) {
          throw error;
        }
        if (data) {
          toast.success("Added Successfully", {
            position: toast.POSITION.TOP_CENTER,
          });

          try {
            const { data, error } = await supabaseClient.rpc("task_increment", {
              space_id: space,
            });
            if (error) {
              throw error;
            }
            if (data) {
              console.log(data);
            }
          } catch (error) {
            console.log(error.message);
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        tasksProgress();
        getTasks();
      }
    } else {
      toast.error("Fill in all fields to add a task", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }
  async function deleteTask(id) {
    try {
      const { data, error } = await supabaseClient
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error || !data) {
        throw error;
      }

      if (data) {
        toast.success("Task deleted successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        try {
          const { data, error } = await supabaseClient.rpc("tasks_decrement", {
            space_id: space,
          });
          if (error) {
            throw error;
          }
          if (data) {
            console.log(data);
            console.log("space updated");
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      tasksProgress();
      getTasks();
    }
  }
  const tasksProgress = async () => {
    try {
      let { data: tasks, error } = await supabaseClient
        .from("tasks")
        .select("*")
        .eq("work_space_id", workSpaceId);

      if (error) {
        throw error;
      }
      if (tasks) {
        let completedTasks = tasks.filter(
          (task) => task.is_complete === true
        ).length;
        let totalTasks = tasks.length;
        let progress = (completedTasks / totalTasks) * 100;
        try {
          const { data, error } = await supabaseClient
            .from("work_space")
            .update({
              is_complete: Math.round(progress),
            })
            .eq("id", workSpaceId);
          if (error) {
            throw error;
          }
          if (data) {
            console.log("progress updated");
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  async function editTask(id, newName, newDescription, time) {
    try {
      const { data, error } = await supabaseClient
        .from("tasks")
        .update({
          task_name: newName,
          task_description: newDescription,
          modified_at: time,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      if (data) {
        toast.success(`Task Edited at ${time.toDateString()}`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      getTasks();
    }
  }
  const tasksNoun = taskList?.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList?.length} ${tasksNoun} remaining`;

  return (
    <>
      <ToastContainer />

      <Sidebar />
      <AdminNavbar />
      <div className="relative md:ml-64">
        <div className="flex flex-wrap mt-10 ">
          <div className="w-full mb-12 px-4">
            <div className="todoapp  stack-large">
              <h1 class="text-base font-medium">
                Tasks in : <span className="uppercase">{spaceName}</span>{" "}
              </h1>
              <div className="filters btn-group stack-exception flex-wrap md:flex-nowrap lg:flex-nowrap">
                {filterList}

                <button
                  className="btn toggle-btn bg:gray-400"
                  onClick={() => toggleAdd()}
                >
                  {showAddTasks ? "Hide" : "Add Task"}
                </button>
              </div>
              {showAddTasks ? (
                <FormTasks
                  addTask={addTask}
                  deleteTask={deleteTask}
                  editTask={editTask}
                  getTasks={getTasks}
                />
              ) : null}
              <h2 id="list-heading">{headingText}</h2>
              <ul
                className="todo-list stack-large stack-exception"
                aria-labelledby="list-heading"
              >
                {taskList}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tasks;
Tasks.layout = Admin;
