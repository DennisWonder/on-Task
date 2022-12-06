import React, { useEffect, useState } from "react";
import { createPopper } from "@popperjs/core";
import { supabaseClient } from "../../config/supabase-client";
import { Link, useNavigate } from "react-router-dom";

import { CgProfile } from "react-icons/cg";

const UserDropdown = () => {
  const navigate = useNavigate();
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-end",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getAvatar();
    // if (avatar_url) downloadImage(avatar_url);
  }, [
    // TODO: Check the console for errors
    avatar_url,
  ]);

  const getAvatar = async () => {
    try {
      const user = supabaseClient.auth.user();
      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`avatar_url`)
        .eq("id", user?.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        downloadImage(data.avatar_url);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  async function downloadImage(path) {
    try {
      const { data, error } = await supabaseClient.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }
  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="/"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-black bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            {avatar_url ? (
              <img
                alt="User Avatar"
                className="border-gray-500 border-2 rounded-full  aspect-square align-middle shadow-lg h-10 w-10"
                src={avatar_url}
              />
            ) : (
              <CgProfile className="w-full rounded-full align-middle border-none shadow-lg" />
            )}
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white p-4 text-base z-50 float-left py-4 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <Link to="/admin/profile">
          <p
            className={
              "text-sm py-2 px-4 cursor-pointer hover:bg-gray-300 font-normal block whitespace-nowrap bg-transparent text-blueGray-700 w-full"
            }
          >
            Profile
          </p>
        </Link>
        <div className="h-0 my-2 border border-solid border-blueGray-100" />
        <button
          className={
            "text-sm py-2 px-4 cursor-pointer hover:bg-gray-300 font-normal block whitespace-nowrap bg-transparent text-blueGray-700 w-full"
          }
          onClick={() => {
            supabaseClient.auth.signOut();
            navigate("/");
            window.location.reload();
          }}
        >
          Log Out
        </button>
      </div>
    </>
  );
};

export default UserDropdown;
