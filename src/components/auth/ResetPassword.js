import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { supabaseClient } from "./../../config/supabase-client";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate("");

  const updateUser = async () => {
    console.log("point2");

    try {
      let { data, error } = await supabaseClient.auth.update({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data) {
        console.log(data);
        toast
          .success("Details Updated Successfully", {
            position: toast.POSITION.TOP_CENTER,
          })

          .then(navigate("/"));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const resetPass = async () => {
    email === "" || password === "" || confirmPassword === ""
      ? toast.error("Kindly Fill in all the required fields", {
          position: toast.POSITION.TOP_CENTER,
        })
      : password !== confirmPassword
      ? toast.error("Passwords do not match", {
          position: toast.POSITION.TOP_CENTER,
        })
      : password.length < 5
      ? toast.error("Password should be at least 6 characters", {
          position: toast.POSITION.TOP_CENTER,
        })
      : updateUser();
  };
  return (
    <>
      <ToastContainer />
      <section class="bg-gray-50 dark:bg-gray-100">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md bg-blueGray-200 sm:p-8">
            <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-bluegray-500 md:text-2xl">
              Change Password
            </h2>
            <form class="mt-4 space-y-4 lg:mt-5 md:space-y-5">
              <div>
                <label
                  for="email"
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => {
                    e.preventDefault();
                    setEmail(e.target.value);
                  }}
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="name@company.com"
                  required=""
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => {
                    e.preventDefault();
                    setPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  required=""
                />
              </div>
              <div>
                <label
                  for="confirm-password"
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  onChange={(e) => {
                    e.preventDefault();
                    setConfirmPassword(e.target.value);
                  }}
                  placeholder="••••••••"
                  class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  required=""
                />
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  resetPass();
                }}
                class="bg-blueGray-800 text-black active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
              >
                Reset password
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
