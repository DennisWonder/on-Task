import React, { useContext } from "react";
import { CgAdd } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabaseClient } from "../../config/supabase-client";
import userContext from "../../context/UserContext";

const ModalJoinColab = ({ showModalJoinColab, setShowModalJoinColab }) => {
  const user = useContext(userContext);
  const [collaboratorArray, setCollaboratorArray] = React.useState([]);
  const [collaboratorID, setCollaboratorsID] = React.useState("");
  const collab = user?.user.user_metadata.collabor || "";
  const navigate = useNavigate();
  const joinCollab = async (e) => {
    e.preventDefault();
    // get the collaboratorID from the DB
    if (collaboratorID === "") {
      return toast.error("Please enter a valid collaborator ID", {
        position: "top-center",
      });
    }
    try {
      let { data: work_space, error } = await supabaseClient
        .from("work_space")
        .select("*")
        .eq("collaborators_id", collaboratorID);

      if (error) {
        throw error;
      }
      if (work_space.length === 0) {
        toast.error("Invalid Collaborator ID", {
          position: "top-center",
        });
      } else {
        const { user, error } = await supabaseClient.auth.update({
          data: { collabor: [collaboratorID, ...collab] },
        });
        if (error) {
          throw error;
        }
        if (user) {
          toast
            .success("Successfully joined the workspace", {
              position: "top-center",
            })
          setShowModalJoinColab(false);
          navigate("/admin/work-spaces");
          try {
            let { data: work_space, error } = await supabaseClient
              .from("work_space")
              .select("collaborators")
              .eq("collaborators_id", collaboratorID);
            if (error) {
              throw error;
            }
            if (work_space) {
              setCollaboratorArray(work_space[0].collaborators);
              try {
                const { data, error } = await supabaseClient
                  .from("work_space")
                  .update({ collaborators: [user.id, ...collaboratorArray] })
                  .eq("collaborators_id", collaboratorID);
                if (error) {
                  throw error;
                }
              } catch (error) {
                console.log(error);
              }
            }
          } catch (error) {
            console.log(error.message);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
    // if the collaboratorID is not in the DB, then show an error message
  };
  return (
    <>
      <ToastContainer />

      {showModalJoinColab ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Accept Invite to a Work Space
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalJoinColab(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={joinCollab}>
                    <div className="mb-6">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                        Collaboration ID
                      </label>
                      <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <CgAdd />
                        </div>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                          onChange={(e) => {
                            setCollaboratorsID(e.target.value);
                            e.preventDefault();
                          }}
                        />
                      </div>
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowModalJoinColab(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                    onClick={joinCollab}
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default ModalJoinColab;
