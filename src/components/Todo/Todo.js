import React, { useContext, useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import userContext from "../../context/UserContext";
import Schedule from "react-schedule-job";
import { reminder } from "../../util/Reminder";

function Todo({
  name,
  description,
  completed,
  id,
  toggleTaskCompleted,
  deleteTask,
  editTask,
  due_date,
  ...rest
}) {
  const [isEditing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setDescription] = useState("");

  const userEmail = useContext(userContext).user.email;

  const minute = due_date.slice(14, 16);
  const hour = due_date.slice(11, 13);
  const day = due_date.slice(8, 10);
  const month = due_date.slice(5, 7);
  
    // send reminder 1 hr before
    const jobs = [
      {
        fn: () => {
          if (
            moment(due_date).format("MMMM Do YYYY, h:mm:ss a") >
            moment().format("MMMM Do YYYY, h:mm:ss a")
          ) {
            reminder(name, due_date, "task", userEmail);
          }
        },
        id: "2",
        schedule: `${minute} ${hour - 1} ${day} ${month} *`,
      },
      // one day before
      {
        fn: () => {
          if (
            moment(due_date).format("MMMM Do YYYY, h:mm:ss a") >
            moment().format("MMMM Do YYYY, h:mm:ss a")
          ) {
            reminder(name, due_date, "task", userEmail);
          }
        },
        id: "4",
        schedule: `${minute} ${hour} ${day - 1} ${month} *`,
      },
    ];

  function handleSubmit(e) {
    e.preventDefault();
    const time = new Date();
    editTask(id, newName, newDescription, time);
    setNewName("");
    setEditing(false);
  }

  const editingTemplate = (
    <form className="stack-small" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="todo-label" htmlFor={id}>
          New name for: <span className="underline"> {name}</span>
        </label>
        <input
          id={id}
          className="todo-text"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <label className="todo-label" htmlFor={id}>
          Change description:<span className="underline"> {name}</span>
        </label>
        <input
          id={id}
          className="todo-text"
          type="text"
          value={newDescription}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="btn-group">
        <button
          type="button"
          className="btn todo-cancel"
          onClick={() => setEditing(false)}
        >
          Cancel
          <span className="visually-hidden">renaming {name}</span>
        </button>
        <button type="submit" className="btn btn__primary todo-edit">
          Save
          <span className="visually-hidden">new name for {name}</span>
        </button>
      </div>
    </form>
  );
  const viewTemplate = (
    <div className="stack-small ">
      <div className=" flex items-center justify-between w-full ">
        <div className="c-cb">
          <input
            id={id}
            type="checkbox"
            defaultChecked={completed}
            onChange={() => toggleTaskCompleted(id, completed)}
          />
          <label className="todo-label text-sm" htmlFor={id}>
            {name}
            <br />
            <span className="text-xs mt-2">{description}</span>
          </label>
        </div>
        <div className="text-sm">
          <p>
            Due date :
            <br />
            <span className="text-xs">{moment(due_date).format("llll")}</span>
          </p>
        </div>
      </div>
      <div className="btn-group">
        <button type="button" className="btn" onClick={() => setEditing(true)}>
          Edit <span className="visually-hidden">{name}</span>
        </button>
        <button
          type="button"
          className="btn btn__danger"
          onClick={() => deleteTask(id)}
        >
          Delete <span className="visually-hidden">{name}</span>
        </button>
      </div>
      <Schedule
        jobs={jobs}
        timeZone="Africa/Nairobi"
        dashboard={{ hidden: true }}
      />
    </div>
  );

  return (
    
      <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>
     
 
  );
}

export default Todo;
