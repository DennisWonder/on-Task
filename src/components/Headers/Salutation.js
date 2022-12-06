import React, { useEffect, useState } from "react";
import moment from "moment";
import { supabaseClient } from "../../config/supabase-client";

const Salutation = () => {
  const [username, setUsername ]= useState()
 useEffect(() => {
   getProfile();
 }, []);

 async function getProfile() {
   try {
     const user = supabaseClient.auth.user();
     let { data, error, status } = await supabaseClient
       .from("profiles")
       .select(`username`)
       .eq("id", user?.id)
       .single();

     if (error && status !== 406) {
       throw error;
     }

     if (data) {
       setUsername(data.username);
     }
   } catch (error) {
     alert(error.message);
   } 
 }
  const date = moment().format("Do, MMMM YYYY")
   // August 18th 2022,
  return (
    <div className="text-2xl text-bold text-center">
      <h1>{date}</h1>
      <h1 className="text-3xl mb-3 ">Hello, {username}</h1>
    </div>
  );
};

export default Salutation;
