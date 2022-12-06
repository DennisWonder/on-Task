import moment from "moment";
import React, { useContext } from "react";
import { reminder } from "./../../util/Reminder";
import userContext from "./../../context/UserContext";

const CardTasksTable = ({ taskName, taskDueDate }) => {
  const user = useContext(userContext);

  return (
    <tr>
      <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
        {taskName}
      </th>
      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
        {moment(taskDueDate).format("MMMM Do YYYY, h:mm:ss a")}
        {/* if date is later than current date show a warning*/}
        {moment(taskDueDate).isBefore(moment()) ? (
          <span className=" ml-2 border-3 p-2 bg-red-500 border-r-4 text-xs">
            task overdue
          </span>
        ) : null}
      </td>
    </tr>
  );
};

export default CardTasksTable;
