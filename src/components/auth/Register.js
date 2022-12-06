import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { supabaseClient } from "../../config/supabase-client";
import Auth from "../../layouts/Auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // const [users, setUsers] = useState([]);

  // const getUsers = async function () {
  //   let { data: Users, error } = await supabaseClient
  //     .from("Users")
  //     .select("email");
  //   if (error) {
  //     console.log(error);
  //   }
  //   setUsers(Users);
  // };
  // useEffect(() => {
  //   setUsers([]);
  //   getUsers();
  // }, []);

  const Register = async (e) => {
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
      : await supabaseClient.auth
          .signUp({
            email: email,
            password: password,
          })
          .then(() => {
            toast.success(
              "Registered Succesfully, Kindly confirm your in your email",
              {
                position: toast.POSITION.TOP_CENTER,
              }
            );
          })
          .catch((error) => {
            console.log(error.message);
          });
  };
  return (
    <>
      <ToastContainer />

      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4 m-5 py-5 bg-gray-100 ">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign up
                  </h6>
                </div>
                {/* <div className="btn-wrapper text-center">
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <FaGithub className="h-30 mr-3" /> Github
                  </button>
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <FaGoogle className="h-30 mr-3" /> Google
                  </button>
                </div> */}
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                {/* <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <small>Or sign up with credentials</small>
                </div> */}
                <form onSubmit={Register}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="john@doe.com"
                      required
                      autoComplete="true"
                      onChange={(e) => {
                        e.preventDefault();
                        setEmail(e.target.value);
                      }}
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      required
                      onChange={(e) => {
                        e.preventDefault();
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      required
                      onChange={(e) => {
                        e.preventDefault();
                        setConfirmPassword(e.target.value);
                      }}
                    />
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-blueGray-800 text-black active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      onClick={(e) => {
                        e.preventDefault();
                        Register();
                      }}
                    >
                      Create Account
                    </button>
                  </div>
                  <div className=" ">
                    <Link to="/auth/login">
                      Already have an account?
                      <a href="#pablo" className="text-blue-800 ml-2">
                        <small>LOGIN</small>
                      </a>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Register.layout = Auth;
