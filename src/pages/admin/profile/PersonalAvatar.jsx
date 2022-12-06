import { useEffect, useState } from "react";
import { supabaseClient } from "../../../config/supabase-client";
import { BsFillPersonFill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";

const PersonalAvatar = ({ url, onUpload }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

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

  async function uploadAvatar(event) {
    event.preventDefault();
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabaseClient.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    // <div className="my-5 mx-7 flex flex-col items-center box-content h-70 w-96 justify-center">
    <div className="w-full my-3 flex flex-col items-center  justify-center">
      {avatarUrl ? (
        <div>
          <img
            class="object-scale-down h-48 w-96 justify-center"
            src={avatarUrl}
            alt="Avatar"
            className="mb-4 rounded-sm h-25 w-25  border-black border-2 border-solid  p-4 "
          />
          <label
            htmlFor="single"
            className="absolute -mt-7 w-fit p-1 border-2 bg-white  border-black flex rounded-full"
          >
            <GrEdit className="text-white cursor-pointer" />
          </label>
        </div>
      ) : (
        // <Avatar
        //   size={'2xl'}
        //   src={avatarUrl}
        //   alt="Avatar"
        //   mb={4}
        //   pos={'relative'}
        //   _after={{
        //     content: '""',
        //     w: 4,
        //     h: 4,
        //     bg: 'green.300',
        //     border: '2px solid white',
        //     rounded: 'full',
        //     pos: 'absolute',
        //     bottom: 0,
        //     right: 3
        //   }}
        // />
        <BsFillPersonFill className="mb-4 relative rounded-sm w-30 h-30  border-black border-2 border-solid  p-4 " />
      )}
      <div>
        <p className="text-sm flex-1 mb-4 border-2 px- py-3 rounded-sm bg-gray-500 focus:bg-gray-200">
          <label className="button primary block" htmlFor="single">
            {uploading ? "Uploading ..." : "Upload"}
          </label>
        </p>
        <input
          style={{
            visibility: "hidden",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default PersonalAvatar;
