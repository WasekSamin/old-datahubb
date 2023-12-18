import React from "react";
import Dashboardnav from "../../Components/Dashboard/dashboardnav";
import Sidebar from "../../Components/Dashboard/sidebar";
import { FaRegSun } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Triangle, ColorRing } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { IoPencil } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthUtils from "../Utils/AuthUtils";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";

function Clients() {
  const { http, token, logout } = AuthUtils();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  let navigate = useNavigate();
  let [loading, setLoading] = useState([false]);
  let [clients, setClients] = useState([]);
  const [modal, setModal] = useState(false);

  const handleModalClose = () => {
    setModal(false);
    console.log("clicked");
  };
    

  const handleDelete = async (clientId) => {
    // e.preventDefault()
    try {
      await http
        .delete(`/api/delete-client/${clientId}`, {
          method: "DELETE",
        })
        .then((response) => {
          setLoading(true);
          toast.success("Data Deleted");
          getClients();
          return response;
        });
      // getting data after successful delete
    } catch (error) {
      return error;
    }
  };

  const getClients = async () => {
    await http
      .get("/api/clients/")
      .then((response) => {
        setClients(response.data.data);
        setLoading(false);
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  useEffect(() => {
    getClients();

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

  //   useEffect(() => {
  //     window.location.reload();
  //   },[]);

  window.onpageshow = function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  };

  const addClient = async () => {
    try {
      await http
        .post("/api/add-client/", {
          name: name,
          email: email,
          phone_number: phone,
          company_name: companyName,
        })
        .then((response) => {
          toast.success("Client added successfully!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          getClients();
          // navigate("/clients")
          return response;
        });
    } catch (error) {
      return toast.error("Unique constrain failed email must be unique", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <Dashboardnav />
      <div className="container mx-auto flex flex-row">
        <div className="basis-1/4">
          <Sidebar />
        </div>

        <div className="bg-white p-5 rounded shadow-md basis-[100%]">
          <div className="flex flex-row items-center justify-between ml-5">
            <h1 className="text-2xl font-semibold">Clients</h1>
            <div className="flex flex-row items-center justify-between">
              <button
                className="bg-blue-500 p-1 w-[150px] text-white rounded-md shadow-md"
                type="button"
                onClick={() => setModal(true)}
              >
                ADD CLIENT
              </button>
            </div>
          </div>
          {/*MODAL*/}
          {/* <div
            id="authentication-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full"
          >
            <div className="relative w-full h-full max-w-md md:h-auto">
              {/*Modal content */}
          {/* <div className="relative bg-white rounded-lg shadow">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-gray-800 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                  data-modal-toggle="authentication-modal"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="px-6 py-6 lg:px-8">
                  <h3 className="mb-4 text-xl font-medium text-gray-900">
                    Add New Client
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="campaign_title"
                        className="block mb-2 text-sm font-medium text-gray-900 text-left"
                      >
                        *Name
                      </label>
                      <input
                        required
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        name="name"
                        id=""
                        className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 outline-none"
                        placeholder="example company"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="campaign_title"
                        className="block mb-2 text-sm font-medium text-gray-900 text-left"
                      >
                        *Email
                      </label>
                      <input
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        required
                        type="email"
                        name="email"
                        id=""
                        className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 outline-none"
                        placeholder="example company"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="campaign_title"
                        className="block mb-2 text-sm font-medium text-gray-900 text-left"
                      >
                        *Phone name
                      </label>
                      <input
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        type="number"
                        name="phone_number"
                        id=""
                        className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 outline-none"
                        placeholder="example company"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="campaign_title"
                        className="block mb-2 text-sm font-medium text-gray-900 text-left"
                      >
                        *Company name
                      </label>
                      <input
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        type="text"
                        name="company_name"
                        id=""
                        className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 outline-none"
                        placeholder="example company"
                      />
                    </div>
                    <button
                      onClick={addClient}
                      type="button"
                      className="w-full text-black bg-emerald-500 rounded p-2 text-white text-lg"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div> */}
          {/*</div>
          </div> */}

          <div
            className={`fixed inset-0 ${
              modal
                ? "bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
                : "hidden"
            }`}
          >
            {/* modal content */}
            <div className="relative bg-white rounded-lg shadow w-[600px]">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-800 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                data-modal-toggle="authentication-modal"
                onClick={handleModalClose}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="px-6 py-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900">
                  Add New Client
                </h3>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="campaign_title"
                      className="block mb-2 text-sm font-medium text-gray-900 text-left"
                    >
                      *Name
                    </label>
                    <input
                      required
                      onChange={(e) => setName(e.target.value)}
                      type="text"
                      name="name"
                      id=""
                      className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 outline-none"
                      placeholder="example company"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="campaign_title"
                      className="block mb-2 text-sm font-medium text-gray-900 text-left"
                    >
                      *Email
                    </label>
                    <input
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      required
                      type="email"
                      name="email"
                      id=""
                      className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 outline-none"
                      placeholder="example company"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="campaign_title"
                      className="block mb-2 text-sm font-medium text-gray-900 text-left"
                    >
                      *Phone name
                    </label>
                    <input
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      type="number"
                      name="phone_number"
                      id=""
                      className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 outline-none"
                      placeholder="example company"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="campaign_title"
                      className="block mb-2 text-sm font-medium text-gray-900 text-left"
                    >
                      *Company name
                    </label>
                    <input
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      type="text"
                      name="company_name"
                      id=""
                      className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2.5 outline-none"
                      placeholder="example company"
                    />
                  </div>
                  <button
                    onClick={addClient}
                    type="button"
                    className="w-full text-black bg-emerald-500 rounded p-2 text-white text-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* modal ends */}

          <div className="">
            {loading ? (
              <div className="flex items-center justify-center my-7">
                <ColorRing
                  visible={true}
                  height="90"
                  width="90"
                  ariaLabel="blocks-loading"
                  wrapperStyle={{}}
                  wrapperClass="blocks-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </div>
            ) : (
              <table className="bg-white w-full my-7 text-left">
                <thead>
                  <tr className="border-b-2">
                    {/*<th className="p-3">ID</th>*/}
                    <th className="p-3">Company</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Name</th>
                                    <th className="p-3">Phone</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clients?.map((c) => (
                    <tr className="border-b-2 cursor-pointer" key={c.id}>
                      {/*<td className="p-3 text-sm font-semibold">{c.id}</td>*/}
                      <td className="p-3 text-sm font-semibold">
                        {c.company_name? c?.company_name : "--"}
                      </td>
                      <td className="p-3 text-sm font-semibold">
                        {c.email.length !== 0 ? c?.email : "--"}
                      </td>
                      <td className="p-3 text-sm font-semibold">{c.name}</td>
                                        <td className="p-3 text-sm font-semibold">{c.phone_number}</td>
                      <td className="p-3 flex items-center text-sm font-semibold">
                        <button type="button">
                          <MdDeleteOutline
                            onClick={() => handleDelete(c.id)}
                            className="text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50"
                          />
                        </button>
                        <a
                          href={`edit-client/${c.id}/`}
                          data-modal-toggle="authentication-modal"
                        >
                          <IoPencil className="mx-3 text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clients;
