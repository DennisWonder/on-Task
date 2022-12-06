import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabaseClient } from "../../config/supabase-client";
import { HiClipboardList } from "react-icons/hi";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CopyToClipboard from "react-copy-to-clipboard";

const ModalCollaborators = ({
  showModalCollaborators,
  setShowModalCollaborators,
  id,
}) => {
  const [collaboratorID, setCollaboratorsID] = React.useState("");
  const generateCollaborators = async () => {
    let { data: work_space, error } = await supabaseClient
      .from("work_space")
      .select("*")
      .eq("id", id);

    if (error) {
      throw error;
    }

    if (work_space) {
      // check whether collaboratorID is empty or not
      if (work_space[0].collaborators_id === null) {  
        // if empty, generate a new collaboratorID
        let collaboratorID = uuidv4() + id;
        let count = work_space[0].collaborators_count++;
        // update the collaboratorID in the database
        const { data, error } = await supabaseClient
          .from("work_space")
          .update({
            collaborators_id: collaboratorID,
            collaborators_count: count,
          })
          .eq("id", id);
        if (error) {
          throw error;
        }
        if (data) {
          setCollaboratorsID(collaboratorID);
        }
      }
      setCollaboratorsID(work_space[0].collaborators_id);
    }
  };
  // get Collab ID from the DB

  useEffect(() => {
    generateCollaborators();
  }, [collaboratorID]);
  return (
    <>
      <ToastContainer />

      {showModalCollaborators ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Add a collaborator to your workspace
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalCollaborators(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="mb-6">
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                      Collaboration ID
                    </p>
                    <div class="mb-6 flex justify-center items-center">
                      <input
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={collaboratorID}
                        readOnly
                      />
                      <div className="relative ">
                        <CopyToClipboard
                          text={collaboratorID}
                          onCopy={() => {
                            toast.success("Copied to clipboard", {
                              position: toast.POSITION.TOP_CENTER,
                            });
                            setShowModalCollaborators(false);

                          }}
                        >
                          <HiClipboardList className="h-24" />
                        </CopyToClipboard>
                      </div>
                    </div>
                    <p className="text-sm text-center">
                      Kindly share the ID to invite Collaborators to your
                      workspace.
                    </p>
                  </div>
                  <button
                    className="text-red-500 text-center background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => setShowModalCollaborators(false)}
                  >
                    Close
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

export default ModalCollaborators;
