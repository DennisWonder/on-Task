import { useContext, useEffect, useState } from "react";
import { supabaseClient } from "../../../config/supabase-client";
import PersonalAvatar from "./PersonalAvatar";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Navbar from "../../../components/navbar/AdminNavbar";
import Footer from "../../../components/footer/Footer";
import Sidebar from "../../../components/Sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

const Profile = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [phone, setPhone] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      const user = supabaseClient.auth.user();
      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select(`username, avatar_url, phone`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, avatar_url }) {
    try {
      setLoading(true);
      const user = supabaseClient.auth.user();

      const updates = {
        id: user?.id,
        username,
        avatar_url,
        phone: phone,
        updated_at: new Date(),
      };

      let { error } = await supabaseClient.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
      toast.success("Profile Updated", {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      <Sidebar />
      <div className=" text-center md:ml-64 block h-500-px">
        <div className="mt-4 md:mt-20">
          <h6 className="text-blueGray-500 text-xl font-bold">
            Update Profile
          </h6>
          <form>
            <PersonalAvatar
              url={avatar_url}
              onUpload={(url) => {
                setAvatarUrl(url);
                updateProfile({ username, avatar_url: url });
              }}
            />
            <div class="mb-6">
              <div className="text-center mb-3">
                <p className="text-sm font-semibold text-gray-700">
                  {session?.user.email}
                </p>
                <div className="flex items-center justify-center">
                  <form className="w-3/4  space-y-2">
                    <label
                      className="block uppercase   font-bold mb-2"
                      htmlFor="Username"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300  bg-gray-200 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={username || "username"}
                    />
                    <label
                      className="block uppercase   font-bold mb-2"
                      htmlFor="phone_number"
                    >
                      Phone Number
                    </label>
                    <PhoneInput
                      className=" px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-noneg w-full ease-linear transition-all duration-150 "
                      placeholder={phone || "Enter phone number"}
                      value={phone}
                      onChange={setPhone}
                    />
                  </form>
                </div>
                <div className="my-8 flex justify-center">
                  <button
                    type="button"
                    class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    onClick={() => {
                      supabaseClient.auth.signOut();
                      navigate("/");
                    }}
                  >
                    Log Out
                  </button>

                  <button
                    class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={(e) => {
                      e.preventDefault();
                      updateProfile({ username, avatar_url, phone });
                    }}
                  >
                    {loading ? "Updating" : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Profile;
