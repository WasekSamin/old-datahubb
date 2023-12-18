import React from "react";
import { FaBlackberry } from "react-icons/fa";
import { BiUser, BiAnchor, BiBarChartSquare, BiCategoryAlt, BiGlassesAlt, BiBarChartAlt2, BiBook, BiBody } from "react-icons/bi";
import { BsPower } from "react-icons/bs";
import AuthUtils from "../../Pages/Utils/AuthUtils";
import { Link } from "react-router-dom";
import { MdOutlineSegment } from "react-icons/md";




function Sidebar(){
    const { token, logout } = AuthUtils()
    const logoutUser = () => {
        if ( token !== undefined ){
            logout()
        }
    }
    return (
        <div className="hidden md:block md:mx-7 flex flex-col items-start gap-7">
            <a href="/" className="flex items-center hover:text-indigo-600 font-bold p-2 md:p-2 transition-all">
                <FaBlackberry className="text-md mr-2" />Dashboard
            </a>
            {/* <a href="/clients" className="flex items-center hover:text-indigo-600 font-bold p-0 md:p-2 transition-all">
                <BiUser className="text-md mr-2" />Client
            </a> */}
            <a href="/campaigns" className="flex items-center hover:text-indigo-600 font-bold p-0 md:p-2 transition-all">
                <BiAnchor className="text-md mr-2" />Campaigns
            </a>
            {/* <a href="" className="flex items-center hover:text-indigo-600 font-bold p-0 md:p-2">
                <BiBarChartSquare className="text-md mr-2" />Analytics
            </a> */}
            <a href="/leads" className="flex items-center hover:text-indigo-600 font-bold p-0 md:p-2 transition-all">
                <BiCategoryAlt className="text-md mr-2" />Leads
            </a>
            <Link to="/segmentation" className="flex items-center hover:text-indigo-600 font-bold p-0 md:p-2 transition-all">
                <MdOutlineSegment className="text-md mr-2" /> Segmentation
            </Link>
            <Link to="/analytics" className="flex items-center hover:text-indigo-600 font-bold p-0 md:p-2 transition-all">
                <BiBarChartAlt2 className="text-md mr-2" />Analytics
            </Link>
            
            <a href="" onClick={logoutUser} className="flex items-center hover:text-red-600 font-bold text-red-500 p-0 md:p-2" >
                <BsPower className="text-md mr-2" />Logout
            </a>
        </div>
    )
}

export default Sidebar;