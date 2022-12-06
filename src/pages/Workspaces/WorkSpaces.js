import React from "react";
import CardWorkSpaceTable from "../../components/Cards/CardWorkSpaceTable";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Admin from "../../layouts/Admin";

const WorkSpaces = () => {
  return (
    <>
      <Sidebar />
      <AdminNavbar />
      <div className="relative md:ml-64">
        <div className="flex flex-wrap mt-10 ">
          <div className="w-full mb-12 px-4">
            <CardWorkSpaceTable color="light" />
            
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkSpaces;
WorkSpaces.layout = Admin;
