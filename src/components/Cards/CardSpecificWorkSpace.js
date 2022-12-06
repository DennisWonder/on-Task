import moment from "moment";
import React from "react";

const CardSpecificWorkSpace = ({ workSpace, insertedAt, progress }) => {
  const time = moment(insertedAt).format("MMMM Do YYYY, h:mm:ss a");
  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 border-0">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full px-4 max-w-full flex-grow flex-1">
            <h3 className="font-semibold text-base text-gray-700">
              <span className="uppercase">{workSpace}</span>
            </h3>
            <p
              className="text-gray-500 mt-2
            "
            >
              {time}
            </p>
            <div class="flex w-1/4 justify-between items-center mb-1 mt-4 space-x-2">
              <span class="text-base font-medium">Progress</span>
              <span class="text-sm font-medium ">{progress}%</span>
            </div>{" "}
            <div class="w-1/4 dark:bg-gray-300 rounded-full h-2.5 mb-4 bg-gray-200">
              <div
                class="dark:bg-green-700 h-2.5 rounded-full bg-green-600"
                style={{ width: progress + `%` }}
              ></div>
              {/* dark:bg-gray-300 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSpecificWorkSpace;
