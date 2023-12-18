import React, { useState, useEffect } from "react";
import DashboardNav from "../../Components/Dashboard/dashboardnav";
import Sidebar from "../../Components/Dashboard/sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsFillPersonFill } from "react-icons/bs";
import { BsFillClockFill } from "react-icons/bs";
import AuthUtils from "../Utils/AuthUtils";
import "react-toastify/dist/ReactToastify.css";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";

const EditProfile = () => {
  const { http, token, logout } = AuthUtils();

  const [user, setUser] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");

  // fetching users
  const getUserDetails = async () => {
    await http
      .post("/api/user/", {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        // setting the value after fetching

        setFirstName(response.data.data.first_name);
        setLastName(response.data.data.last_name);
        setEmail(response.data.data.email);
        setPhone(response.data.data.phone_number);
        setCompanyName(response.data.data.company_name);
        setUser(response.data.data);
      })
      .catch((error) => {
        return error;
      });
  };

  // updating user details
  // updating user's initial state
  const updateProfile = async () => {
    await http
      .put("/api/update-user/", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        company_name: companyName,
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then((response) => {
        toast.success("Profile updated");
      })
      .catch((error) => {
        return error;
      });
  };

  useEffect(() => {
    getUserDetails();

    // Auto logout user
    const logoutTimeout = setTimeout(() => {
      if (token) {
        localStorage.clear();
        logout();
      }
    }, LOGOUT_TIMEOUT)

    return () => {
      clearTimeout(logoutTimeout);
    }
  }, []);

  return (
    <div className="">
      <ToastContainer />
      <DashboardNav />
      <div className="container mx-auto flex flex-row">
        <div className="w-full basis-1/4 hidden lg:block">
          <Sidebar />
        </div>

        {/* form section starts here*/}
        <div className="form-container w-full lg:max-w-5xl">
          {/* save button */}
          <div className="flex justify-end mt-2 mb-4">
            <button
              onClick={updateProfile}
              className="bg-indigo-800 text-white px-6 py-2 shadow-md hover:opacity-80 duration-200"
            >
              Save
            </button>
          </div>

          {/* profile info */}
          <div className="profile-info border w-full bg-white shadow-md">
            <div className="info-header flex items-center p-3 border-b-2">
              <BsFillPersonFill className="text-2xl text-indigo-800 mr-2" />
              <p className="uppercase text-indigo-800">profile info</p>
            </div>

            <div className="info-forms p-3">
              <p className="text-sm mb-2 mt-8">First Name</p>
              <input
                onChange={(e) => setFirstName(e.target.value)}
                defaultValue={user.first_name}
                className="border w-full p-2 placeholder:italic placeholder:font-normal"
                type="text"
                placeholder="John"
              />

              <p className="text-sm mb-2 mt-8">Last Name</p>

              <input
                onChange={(e) => setLastName(e.target.value)}
                defaultValue={user.last_name}
                className="border w-full p-2 placeholder:italic placeholder:font-normal"
                type="text"
                placeholder="John"
              />

              <p className="text-sm mb-2 mt-8">Email</p>
              <input disabled onChange={(e) => setEmail(e.target.value)}
                defaultValue={user.email}
                className="border w-full p-2 placeholder:italic placeholder:font-normal" type="email" placeholder="123@gmail.com" />

              <p className="text-sm mb-2 mt-8">Phone Number </p>
              <input
                onChange={(e) => setPhone(e.target.value)}
                defaultValue={user.phone_number}
                className="border w-full p-2 placeholder:italic placeholder:font-normal"
                type="text"
                placeholder="123@gmail.com"
              />

              <p className="text-sm mb-2 mt-8">Company Name </p>
              <input
                onChange={(e) => setCompanyName(e.target.value)}
                defaultValue={user.company_name}
                className="border w-full p-2 placeholder:italic placeholder:font-normal mb-6"
                type="text"
                placeholder="xyz co."
              />
            </div>
          </div>
          {/* profile info ends here */}
        </div>
        {/* form section ends here */}
      </div>
    </div>
  );
};
export default EditProfile;
