import React, { useEffect, useState } from "react";
import { CgWorkAlt } from "react-icons/cg";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { supabaseClient } from "../../config/supabase-client";

const ModalWorkspace = ({ showModal, setShowModal, getWorkSpace }) => {
  const [name, setName] = useState("");
  const [user, setUser] = useState("");
  useEffect(() => {
    setUser(supabaseClient.auth.user());
  }, []);

  const addWorkSpace = async (e) => {
    e.preventDefault();
    if (name === "" || user === "") {
      return toast.error("Please enter a valid workspace name", {
        position: "top-center",
      });
    }

    try {
      let { data: work_space, error } = await supabaseClient
        .from("work_space")
        .select("work_space, user_id");
      if (error) {
        throw error;
      }
      if (work_space.length > 0) {
        if (
          work_space.find(
            (item) => item.work_space === name && item.user_id === user.id
          )
        ) {
          toast.error("Work Space already exists", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      }

      try {
        const { data, error } = await supabaseClient
          .from("work_space")
          .insert([{ work_space: name, user_id: user.id }]);
        if (error) {
          throw error;
        }
        toast.success("Successfully Added Work Space", {
          position: toast.POSITION.TOP_CENTER,
        });
      } catch (error) {
        console.log(error.message);
      } finally {
        setShowModal(false);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      getWorkSpace();
    }
  };
  return (
    <>
      <ToastContainer />

      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Add A Work Space</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={addWorkSpace}>
                    <div className="mb-6">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                        Work Space Name
                      </label>
                      <div className="relative">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                          <CgWorkAlt />
                        </div>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="School Work"
                          onChange={(e) => {
                            e.preventDefault();
                            setName(e.target.value);
                          }}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                      <button
                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowModal(false);
                        }}
                      >
                        Close
                      </button>
                      <button
                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        type="submit"
                        onClick={addWorkSpace}
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>
                {/*footer*/}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default ModalWorkspace;
