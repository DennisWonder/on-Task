import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CardSpecificWorkSpace from "../../components/Cards/CardSpecificWorkSpace";

import AdminNavbar from "../../components/navbar/AdminNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { supabaseClient } from "../../config/supabase-client";
import Admin from "../../layouts/Admin";
import { BiEditAlt } from "react-icons/bi";
import { MdDeleteSweep } from "react-icons/md";
import ModalSpace from "../../components/modal/ModalSpace";
import moment from "moment";
import PlaceHolder from "../../components/PlaceHolder";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ModalEditSpace from "../../components/modal/ModalEditSpace";
import ModalCollaborators from "../../components/modal/ModalCollaborators";

const SpecificWorkSpace = () => {
  const { id } = useParams();
  const [workSpace, setWorkSpace] = React.useState();
  const [insertedAt, setInsertedAt] = React.useState();
  const [progress, setProgress] = React.useState();
  const [space, setSpace] = React.useState([]);
  const [spaceId, setSpaceId] = React.useState("");
  const [showModalSpace, setShowModalSpace] = React.useState(false);
  const [showModalEditSpace, setShowModalEditSpace] = React.useState(false);
  const [showModalCollaborators, setShowModalCollaborators] =
    React.useState(false);
  const [collabCount, setCollabCount] = React.useState(0);
  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = () => {
    getSpecificWorkSpace();
    getSpaceName();
  };

  const getSpecificWorkSpace = async () => {
    try {
      let { data: work_space, error } = await supabaseClient
        .from("work_space")
        .select("work_space, inserted_at, is_complete, collaborators")
        .eq("id", id);
      if (error) {
        throw error;
      }
      if (work_space) {
        setWorkSpace(work_space[0].work_space);
        setInsertedAt(work_space[0].inserted_at);
        setProgress(work_space[0].is_complete);
        setCollabCount(work_space[0]?.collaborators?.length || 0);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getSpaceName = async function () {
    try {
      let { data: space, error } = await supabaseClient
        .from("space")
        .select("*")
        .eq("work_space_id", id);

      if (error) {
        throw error;
      }
      if (space) {
        setSpace(space);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const deleteSpecificSpace = async function (specificId) {
    try {
      const { data, error } = await supabaseClient
        .from("space")
        .delete()
        .eq("id", specificId);
      if (error) {
        throw error;
      }
      if (data) {
        toast.success("Space deleted successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      getDetails();
    }
  };
  return (
    <>
      <ToastContainer />

      <Sidebar />
      <AdminNavbar />
      <ModalSpace
        showModalSpace={showModalSpace}
        setShowModalSpace={setShowModalSpace}
        getDetails={getDetails}
        id={id}
      />
      <ModalEditSpace
        showModalEditSpace={showModalEditSpace}
        setShowModalEditSpace={setShowModalEditSpace}
        spaceId={spaceId}
        getDetails={getDetails}
      />
      <ModalCollaborators
        showModalCollaborators={showModalCollaborators}
        setShowModalCollaborators={setShowModalCollaborators}
        id={id}
      />
      <div className="relative md:ml-64">
        <div className="flex flex-wrap mt-10 ">
          <div className="w-full mb-7 px-4">
            <CardSpecificWorkSpace
              workSpace={workSpace}
              insertedAt={insertedAt}
              progress={progress}
            />
            <div className="flex items-center justify-between md:items-center md:justify-between">
              <h3 className="font-semibold text-base text-gray-700">Spaces </h3>
              <div>
                <button
                  className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => {
                    setShowModalSpace(true);
                  }}
                >
                  Add a Space
                </button>
                <button
                  class="bg-gray-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  onClick={() => {
                    setShowModalCollaborators(true);
                  }}
                >
                  Add Collaborators
                  <span class="inline-flex justify-center items-center ml-2 w-4 h-4 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                    {collabCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="container my-2 mx-auto px-4 md:px-12">
          <div className="flex flex-wrap -mx-1 lg:-mx-4">
            {space.length !== 0 ? (
              space.map((item) => (
                <div
                  key={item.id}
                  className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3"
                >
                  <article
                    className={`overflow-hidden rounded-lg shadow-lg bg-green-500 `}
                  >
                    <Link to={`/admin/work-spaces/tasks/${item.id}`}>
                      <img
                        alt="Placeholder"
                        className="block h-auto w-full"
                        src="https://picsum.photos/600/400/?school"
                      />

                      <header className="flex items-center justify-between leading-tight p-2 md:p-4">
                        <h1 className="text-lg">
                          <a
                            className="no-underline uppercase hover:underline text-black text-sm"
                            href="#"
                          >
                            {item.space_name}
                          </a>
                        </h1>
                        <p className="text-grey-darker text-xm">
                          {moment(item.inserted_at).format("MMMM Do YYYY")}
                        </p>
                      </header>
                    </Link>
                    <p className=" text-center text-xl">
                      {item.number_of_tasks} tasks
                    </p>

                    <footer className="no-underline text-xl flex items-center justify-between space-x-4 hover:cursor-pointer leading-none p-2 md:p-4">
                      <BiEditAlt
                        onClick={() => {
                          setShowModalEditSpace(true);
                          setSpaceId(item.id);
                        }}
                      />
                      <MdDeleteSweep
                        onClick={() => deleteSpecificSpace(item.id)}
                      />
                    </footer>
                  </article>
                </div>
              ))
            ) : (
              <PlaceHolder message="No Spaces Added" />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecificWorkSpace;
SpecificWorkSpace.layout = Admin;
