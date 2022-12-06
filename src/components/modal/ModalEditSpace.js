import React, { useEffect } from "react";
import { CgWorkAlt } from "react-icons/cg";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { supabaseClient } from "../../config/supabase-client";

const ModalEditSpace = ({
  spaceId,
  showModalEditSpace,
  setShowModalEditSpace,
  getDetails,
}) => {
  const [name, setName] = React.useState("");

  const [space, setSpace] = React.useState([]);
  const [completed, setCompleted] = React.useState();
  useEffect(() => {
    getSpecificSpace();
  }, [spaceId]);
  const getSpecificSpace = async () => {
    try {
      let { data: space, error } = await supabaseClient
        .from("space")
        .select("*")
        .eq("id", spaceId);
      if (error) {
        throw error;
      }
      if (space) setSpace(space[0].space_name);
    } catch (error) {
      console.log(error.message);
    }
  };
  const editSpecificSpace = async function () {
    try {
      const { data, error } = await supabaseClient
        .from("space")
        .update({ space_name: name, is_complete: completed })
        .eq("id", spaceId);
      if (error) {
        throw error;
      }
      if (data) {
        toast.success("Space updated successfully", {
          position: toast.POSITION.TOP_CENTER,
        });
        setShowModalEditSpace(false);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      getDetails();
    }
  };
  return (
    <>
      <ToastContainer />

      {showModalEditSpace ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Edit a Space</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalEditSpace(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form>
                    <div className="mb-6">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                        Space Name
                      </label>
                      <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <CgWorkAlt />
                        </div>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder={space}
                          required
                          onChange={(e) => {
                            setName(e.target.value);
                            e.preventDefault();
                          }}
                        />
                      </div>

                      <div class="flex items-center pl-4 rounded border border-gray-200 dark:border-gray-700">
                        <input
                          id="bordered-checkbox-1"
                          type="checkbox"
                          value={completed}
                          onClick={() => setCompleted(!completed)}
                          name="bordered-checkbox"
                          class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          for="bordered-checkbox-1"
                          class="py-4 ml-2 w-full text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Is complete
                        </label>
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
                      setShowModalEditSpace(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="submit"
                    onClick={editSpecificSpace}
                  >
                    Edit
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

export default ModalEditSpace;
