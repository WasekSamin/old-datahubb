import React, { useState } from "react";
import { TiUserOutline } from "react-icons/ti";
import AuthUtils from "../../Pages/Utils/AuthUtils";
// import DropdownMenu from "./DropdownMenu";
import DropdownMenu from "./DropdownMenu.jsx";
import { AiFillCaretDown } from "react-icons/ai";
import LogoImage from "../../assets/Logo-White-1.png";

function DashboardNav() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = AuthUtils();

  return (
    <div className="w-full bg-purple-700 mb-6 shadow-md shadow-slate-300">
      <div className="flex items-center justify-between p-2 max-w-[1580px] mx-auto relative">
        <div className="w-[25%] md:w-[15%] xl:ml-12 py-2">
          <img className="w-full" src={LogoImage} alt="datahub logo" />
        </div>
        <div
          className="flex items-center sm:mr-5 cursor-pointer select-none text-[#dcdcdc]"
          onClick={() => setShowDropdown((prev) => !prev)}
        >
          <div className="bg-white mr-1.5 p-1 rounded-full">
            <TiUserOutline className="sm:text-xl text-purple-700" />
          </div>
          <p className="text-sm sm:text-lg">Welcome {user.first_name}</p>
          {showDropdown === false ? (
            <AiFillCaretDown className="text-sm sm:text-md duration-300 ml-2" />
          ) : (
            <AiFillCaretDown className="-rotate-180 text-sm sm:text-md duration-300 ml-2" />
          )}
        </div>
        {showDropdown && <DropdownMenu />}
      </div>
    </div>
  );
}

export default DashboardNav;
