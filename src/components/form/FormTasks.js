import React, { useState } from "react";

function FormTasks(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    props.addTask(name, description, dueDate)
    setName("");
    setDescription("");
    setDueDate("");
    props.getTasks();
  }
  function handleChange(e) {
    setName(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label
          htmlFor="new-todo-input"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700"
        >
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="bg-gray-30 border border-gray-300 mb-4 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        name="text"
        placeholder="Task Name?"
        autoComplete="off"
        value={name}
        required
        onChange={handleChange}
      />
      <label
        for="description"
        class="block mb-2 text-center text-sm font-medium text-gray-900 dark:text-gray-700"
      >
        Description
      </label>

      <textarea
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3"
        id="description"
        name="text"
        autoComplete="off"
        placeholder="More about the task"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <label
        for="date"
        class="block mb-2 text-center text-sm font-medium text-gray-900 dark:text-gray-700"
      >
        Due Date
      </label>

      <input
        type="datetime-local"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-3"
        id="due-date"
        value={dueDate}
        onChange={(e) => {
          setDueDate(e.target.value);
        }}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default FormTasks;
