import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { GoDiffAdded } from "react-icons/go";
import { BsFillCircleFill } from "react-icons/bs";
import { ImBin } from "react-icons/im";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// components

import ModalWorkspace from "../modal/ModalWorkspace";
import { supabaseClient } from "../../config/supabase-client";
import { useNavigate } from "react-router-dom";
import ModalJoinColab from "../modal/ModalJoinColab";
import CollabAvatar from "./Avatar/CollabAvatar";
import userContext from "../../context/UserContext";

export default function   CardWorkSpaceTable({ color }) {
  const user = useContext(userContext);
  const [showModal, setShowModal] = useState(false);
  const [showModalJoinColab, setShowModalJoinColab] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [collabID, setCollabID] = useState("");
  const userId = user?.user.id;

  // const checkCollabID = () => {

  //   if (gottenId) {
  //     setCollabID(gottenId);
  //   }

  //   data.map((item) => {
  //     let arrayCollabs = user.user.user_metadata.collab.join(
  //       item.collaborators
  //     );

  //     item.collaborators.map((collab) => {
  //       collab.ever((id) => {
  //         user.user.user_metadata.collab.includes((id) => {
  //           setCollabID(id);
  //         });
  //       });
  //     });
  //   });
  // };
  // TODO:Give collab more that one value
  useEffect(() => {
    getWorkSpace();
  }, [showModal, setShowModal, showModalJoinColab, setShowModalJoinColab]);

  const getWorkSpace = async () => {
    try {
      let collabArray = user?.user.user_metadata.collabor;
      collabArray
        ? getWorkSpaceWithCollab(collabArray)
        : getWorkSpaceWithoutCollab();

    
    } catch (error) {
      console.log(error.message);
    }
  };

  const getWorkSpaceWithCollab = async (collabArray) => {
    try {
      let { data: work_space, error } = await supabaseClient.rpc("collab_g", {
        collab_id: collabArray,
        user__id: userId,
      });
      if (error) {
        throw error;
      }
      if (work_space) {
        console.log(work_space);
        setData(work_space, ...data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getWorkSpaceWithoutCollab = async () => {
    try {
      let { data: work_space, error } = await supabaseClient
        .from("work_space")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        throw error;
      }
      if (work_space) {
        setData(work_space);
      }
    } catch (error) {
      console.log(error);
    }
  };


  
  const deleteRow = async (id) => {
    try {
      const { data, error } = await supabaseClient
        .from("work_space")
        .delete()
        .eq("id", id);

      if (data) {
        console.log(data);
        toast.success("Workspace Deleted successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      if (error) throw error;
    } catch (error) {
       toast.error(error.message, {
         position: toast.POSITION.TOP_CENTER,
       });
    } finally {
      getWorkSpace();
    }
  };
  return (
    <>
      <ToastContainer />

      <ModalWorkspace
        showModal={showModal}
        setShowModal={setShowModal}
        getWorkSpace={getWorkSpace}
      />
      <ModalJoinColab
        showModalJoinColab={showModalJoinColab}
        setShowModalJoinColab={setShowModalJoinColab}
      />

      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-gray-700 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0 md:mt-8">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-gray-700" : "text-white")
                }
              >
                Work Space
              </h3>
            </div>
            <div className="flex">
              <button
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={() => setShowModal(true)}
              >
                <span className="flex  justify-center items-center">
                  <GoDiffAdded className="mr-2" />
                  Add Work Space
                </span>
              </button>
              <button
                type="button"
                class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                onClick={() => setShowModalJoinColab(true)}
              >
                Join Work Space
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-50 text-gray-500 border-gray-100"
                      : "bg-gray-600 text-gray-200 border-gray-500")
                  }
                >
                  Project
                </th>

                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-50 text-gray-500 border-gray-100"
                      : "bg-gray-600 text-gray-200 border-gray-500")
                  }
                >
                  Status
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-50 text-gray-500 border-gray-100"
                      : "bg-gray-600 text-gray-200 border-gray-500")
                  }
                >
                  Collaborators
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-50 text-gray-500 border-gray-100"
                      : "bg-gray-600 text-gray-200 border-gray-500")
                  }
                >
                  Completion
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-gray-50 text-gray-500 border-gray-100"
                      : "bg-gray-600 text-gray-200 border-gray-500")
                  }
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 cursor-pointer"
                >
                  <td
                    className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 font-bold"
                    onClick={() => navigate(`/admin/work-spaces/${item.id}`)}
                  >
                    {item.work_space}
                  </td>

                  <td className="border-t-0 flex px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {item.is_complete === 100 ? (
                      <>
                        <BsFillCircleFill className={"mr-2 text-green-500"} />
                        Complete
                      </>
                    ) : (
                      <>
                        <BsFillCircleFill className={"mr-2 text-orange-500"} />
                        pending
                      </>
                    )}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="flex">
                      {item.collaborators ? (
                        item.collaborators.map((collaborator, index) => (
                          <CollabAvatar
                            collaborator={collaborator}
                            key={index}
                          />
                        ))
                      ) : (
                        <p>No Collaborators</p>
                      )}
                    </div>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="flex items-center">
                      <span className="mr-2">{item.is_complete}%</span>
                      <div className="relative w-full">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                          <div
                            style={{ width: item.is_complete + "%" }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 cursor-pointer">
                    <ImBin
                      onClick={(e) => {
                        e.preventDefault();
                        deleteRow(item.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardWorkSpaceTable.defaultProps = {
  color: "light",
};

CardWorkSpaceTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
