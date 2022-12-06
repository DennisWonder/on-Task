import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BsFillCircleFill } from "react-icons/bs";
import { GoDiffAdded } from "react-icons/go";

import { ImBin } from "react-icons/im";
import userContext from "../../context/UserContext";
import { supabaseClient } from "../../config/supabase-client";
import Sidebar from "../../components/Sidebar/Sidebar";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import { useNavigate } from "react-router-dom";
import CollabAvatar from "../../components/Cards/Avatar/CollabAvatar";
import PlaceHolder from "../../components/PlaceHolder";


const CollaboratedTasks = ({color}) => {
  const user = useContext(userContext);
  const [showModal, setShowModal] = useState(false);
  const [showModalJoinColab, setShowModalJoinColab] = useState(false);
  
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [collabID, setCollabID] = useState("");
  const userId = user?.user.id;

  useEffect(() => {
    getCollaboratedWorkSpaces();
  }, [showModal, setShowModal, showModalJoinColab, setShowModalJoinColab]);


    const getCollaboratedWorkSpaces = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("work_space")
          .select("*");
        if (error) {
          console.log(error);
        }

        // console.log(data);

        const filteredData = data.filter((data) => data.collaborators !== null);

        const yourData = filteredData.filter((data) => data.user_id === userId);
        const collabData = filteredData.filter((data) =>
          data.collaborators.includes(userId)
        );
        const collaboratedWorkSpaces = yourData.concat(collabData);

   

        setData(collaboratedWorkSpaces);
      } catch (error) {
        console.log(error.message);
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
     getCollaboratedWorkSpaces();
    }
  };
  return (
    <>
      <ToastContainer />
      <Sidebar />
      <AdminNavbar />

      <div className="relative md:ml-64">
        <div className="flex flex-wrap mt-10 ">
          <div className="w-full mb-12 px-4">
            <div
              className={
                "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded "
              }
            >
              <div className="rounded-t mb-0 px-4 py-3 border-0 md:mt-8">
                <div className="flex flex-wrap items-center">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 className={"font-semibold text-lg "}>
                      WorkSpaces Collaborated
                    </h3>
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
                          "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                        }
                      >
                        Project
                      </th>

                      <th
                        className={
                          "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                        }
                      >
                        Status
                      </th>
                      <th
                        className={
                          "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                        }
                      >
                        Collaborators
                      </th>
                      <th
                        className={
                          "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                        }
                      >
                        Progress
                      </th>
                      <th
                        className={
                          "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left "
                        }
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data
                      .filter((data) => data.collaborators !== null)
                      .map((item) =>
                        item ? (
                          <tr
                            key={item.id}
                            className="border-b border-gray-200 cursor-pointer"
                          >
                            <td
                              className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4 font-bold"
                              onClick={() =>
                                navigate(`/admin/work-spaces/${item.id}`)
                              }
                            >
                              {item.work_space}
                            </td>

                            <td className="border-t-0 flex px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              {item.is_complete === 100 ? (
                                <>
                                  <BsFillCircleFill
                                    className={"mr-2 text-green-500"}
                                  />
                                  Complete
                                </>
                              ) : (
                                <>
                                  <BsFillCircleFill
                                    className={"mr-2 text-orange-500"}
                                  />
                                  pending
                                </>
                              )}
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              <div className="flex">
                                {item.collaborators ? (
                                  item.collaborators.map(
                                    (collaborator, index) => (
                                      <CollabAvatar
                                        collaborator={collaborator}
                                        key={index}
                                      />
                                    )
                                  )
                                ) : (
                                  <p>No Collaborators</p>
                                )}
                              </div>
                            </td>
                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                              <div className="flex items-center">
                                <span className="mr-2">
                                  {item.is_complete}%
                                </span>
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
                        ) : (
                          <PlaceHolder message="No Collaborated Work Spaces" />
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollaboratedTasks;
CollaboratedTasks.defaultProps = {
    color: "light",
};

