import React, { useEffect, useState } from "react";
import { supabaseClient } from "../../../config/supabase-client";

const CollabAvatar = ({ collaborator }) => {
  useEffect(() => {
    getAvatar();
  }, []);
  const [avatar_url, setAvatarUrl] = useState("");

  const getAvatar = async () => {
    try {
      let { data, error, status } = await supabaseClient
        .from("profiles")
        .select("avatar_url")
        .eq("id", collaborator);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        downloadImage(data[0].avatar_url);
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
      setAvatarUrl([url]);
    } catch (error) {
      console.log("Error downloading image: ", error.message);
    }
  }
  return (
    <img
      src={avatar_url}
      alt="..."
      className="w-10 h-10 rounded-full border-2 border-gray-50 shadow"
    />
  );
};

export default CollabAvatar;
