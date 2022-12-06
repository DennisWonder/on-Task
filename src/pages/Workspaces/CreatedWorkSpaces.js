import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { ImBin } from "react-icons/im";
import userContext from "../../context/UserContext";
import { supabaseClient } from "../../config/supabase-client";
import { BsFillCircleFill } from "react-icons/bs";
import PlaceHolder from "../../components/PlaceHolder";
import WorkSpaces from "./WorkSpaces";
import { useNavigate } from "react-router-dom";

const CreatedWorkSpaces = () => {
  const user = useContext(userContext);
  const [data, setData] = useState([]);
  const userId = user?.user.id;
  const navigate = useNavigate();

  useEffect(() => {
    getTasks();
  }, []);

  // get Tasks

  const getTasks = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("work_space")
        .select("*")
        .eq("user_id", userId)
        .order("id", { ascending: true });

      if (error) throw error;
      setData(data);
      console.log(data);
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
        toast.success("Task Deleted successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      if (error) throw error;
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      getTasks();
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
                      WorkSpaces You Have Created
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
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) =>
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

                          <td className="border-t-0 px-6 flex align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                            {item.is_complete === true ? (
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
                        <PlaceHolder message="No Tasks" />
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

export default CreatedWorkSpaces;
