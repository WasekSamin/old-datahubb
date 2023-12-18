import React from "react";
import { Link } from "react-router-dom";
import AuthUtils from "../../Pages/Utils/AuthUtils";

const DropdownMenu = () => {
  const { token, logout } = AuthUtils();
  const logoutUser = () => {
    if (token !== undefined) {
      logout();
    }
  };

  return (
    <div className="absolute right-2 top-10 sm:right-6 sm:top-16 border flex flex-col gap-x-5 bg-white min-w-[200px] shadow-md rounded mt-1">
      <ul>
        <div className="relative group">
          <div className="group-hover:bg-purple-200 absolute right-[10px] -translate-y-[5px] z-0 h-3 w-3 bg-white border-l border-t  rotate-45 duration-200 ease-linear"></div>
          <Link to={`/user`}>
            <li className="text-sm sm:text-md border-b p-3 hover:border-l-4 border-l-purple-700 group-hover:bg-purple-200 duration-200 ease-linear">
              Update Profile
            </li>
          </Link>
        </div>
        {/*<a href="#"><li className="border-b p-3 hover:border-l-4 border-l-purple-700 hover:bg-purple-200 duration-200 ease-linear">Edit Profile</li></a>*/}
        <Link to="#">
          <li
            className="text-sm sm:text-md border-b p-3 hover:border-l-4 border-l-purple-700 hover:bg-purple-200 duration-200 ease-linear text-red-500"
            onClick={logoutUser}
          >
            Logout
          </li>
        </Link>
        {/*<a href="#"><li className=" p-3 hover:border-l-4 border-l-purple-700 hover:bg-purple-200 duration-200 ease-linear text-red-600">Logout</li></a>*/}
      </ul>
    </div>
  );
};
export default DropdownMenu;
