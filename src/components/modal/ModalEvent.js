import moment from "moment/moment";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { supabaseClient } from "../../config/supabase-client";


const ModalEvent = ({ showModalEvent, setShowModalEvent, getEvents }) => {
  const [eventName, setEventName] = React.useState("");
  const [eventDate, setEventDate] = React.useState("");
  const user = supabaseClient.auth.user();
  const addEvent = async () => {
    if (eventName === "" || eventDate === "") {
     return  toast.error("Add all the event details", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    if (eventDate < moment(new Date()).format("YYYY-MM-DDTHH:mm")) {
     return toast.error("Event Date already past", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    try {
      const { data, error } = await supabaseClient
        .from("events")
        .insert([
          { event_name: eventName, event_date: eventDate, user_id: user.id },
        ]);

      if (error) {
        throw error;
      }
      if (data) {
        toast.success("Event Added", {
          position: toast.POSITION.TOP_CENTER,
        });
        setShowModalEvent(false);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setEventName("");
      setEventDate("");

      getEvents();
    }
  };
  return (
    <>
      <ToastContainer />

      {showModalEvent ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Create Event</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModalEvent(false)}
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
                        Event Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Event Name"
                          required
                          onChange={(e) => {
                            setEventName(e.target.value);
                            e.preventDefault();
                          }}
                        />
                      </div>

                      <div className="relative">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-900">
                          Event Date
                        </label>
                        <input
                          type="datetime-local"
                          onChange={(e) => {
                            e.preventDefault();
                            setEventDate(e.target.value);
                          }}
                          required
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                      setShowModalEvent(false);
                    }}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={addEvent}
                  >
                    Add
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

export default ModalEvent;
