import React from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FiFacebook, FiGithub, FiLogIn, FiTwitter } from "react-icons/fi";
import IndexDropdown from "../DropDowns/IndexDropdown";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link to="/">
              <p className="text-blueGray-700 text-lg font-bold leading-relaxed inline-block mr-4 py-1 whitespace-nowrap uppercase">
                ON TASK
              </p>
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <FaBars />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-col text-black lg:flex-row list-none lg:ml-auto">
              {/* <li className="flex items-center">
                <IndexDropdown />
              </li> */}
              <li className="flex items-center text-black">
                <p className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">
                  <FiFacebook />
                  <span className=" inline-block ml-2">Share</span>
                </p>
              </li>

              <li className="flex items-center">
                <p className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">
                  <FiTwitter />
                  <span className=" inline-block ml-2">Tweet</span>
                </p>
              </li>

              <li className="flex items-center">
                <p className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">
                  <FiGithub /> <span className=" inline-block ml-2">Star</span>
                </p>
              </li>

              <li className="flex items-center">
                <Link to="/auth/login">

                <button className="bg-gray-100 text-black active:bg-blueGray-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150 flex">
                  <FiLogIn />
                  <p className="ml-3" >Sign In</p>
                </button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
