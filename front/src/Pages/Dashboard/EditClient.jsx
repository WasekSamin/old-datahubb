import React from "react";
import { ToastContainer, toast } from "react-toastify";
import DashboardNav from "../../Components/Dashboard/dashboardnav";
import Sidebar from "../../Components/Dashboard/sidebar";
import { TfiArrowLeft } from "react-icons/tfi";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthUtils from "../Utils/AuthUtils";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";

export default function EditClient() {
    const { http, token, logout } = AuthUtils();
    const clientId = useParams()
    const [client, setClient] = useState("")
    const apiUrl = `http://127.0.0.1:8000/api/`
    const navigate = useNavigate()

    const getClientDetails = async () => {
        await http.get(`/api/client-details/${clientId.clientId}/`)
            .then((response) => {
                setClient(response.data.data)
                return response
            })
            .catch((error) => {
                return error
            })
    }

    const handleInputChange = (event) => {
        const { name, email, phone_number, company_name, value } = event.target;
        setClient((prevClient) => ({
            ...prevClient,
            [name]: value,
            [email]: value,
            [phone_number]: value,
            [company_name]: value
        }));
    };

    const updateClientDetails = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("name", e.target.name.value)
        formData.append("phone_number", e.target.phone_number.value)
        formData.append("email", e.target.email.value)
        formData.append("company_name", e.target.company_name.value)

        try {
            let response = await http.put(`/api/update-client/${clientId.clientId}/`, formData)
            if (response.status === 201) {
                navigate("/clients")
            } else {
                toast.error("Validation Error!")
            }

        } catch (error) {
            return error
        }
    }

    useEffect(() => {
        getClientDetails();

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
    }, [])

    return (
        <div>
            <ToastContainer />
            <DashboardNav />
            <div className="container mx-auto flex flex-row">
                <div className="basis-1/4">
                    <Sidebar />
                </div>

                <div className="bg-white p-5 rounded shadow-md basis-[100%]">
                    <div className="flex flex-row items-center justify-between">
                        <a href="/clients" className="font-normal
                         border rounded-full p-3 transition ease-in-out delay-75 hover:bg-slate-800 text-dark hover:text-white">
                            <TfiArrowLeft />
                        </a>
                        {/* <div className="flex flex-row items-center justify-between">
                            <button className="bg-white border hover:bg-slate-800 delay-100 transition hover:transition-all ease-in-out
                            hover:text-white p-2 w-[150px] text-dark rounded-md" type="button" data-modal-toggle="authentication-modal">
                                Add client
                            </button>
                            
                        </div> */}
                    </div>
                    <form onSubmit={updateClientDetails} className="flex flex-col items-start container mx-auto my-7">
                        <label htmlFor="">Name</label>
                        <input onChange={handleInputChange}
                            name="name" value={client.name}
                            className="outline-none w-full p-2 my-2 border" type="text" placeholder="Enter name..." />
                        <label htmlFor="Email">Email</label>
                        <input onChange={handleInputChange}
                            name="email" value={client.email}
                            className="outline-none w-full p-2 my-2 border" type="text" placeholder="Enter email..." />
                        <label htmlFor="Phone">Phone</label>
                        <input onChange={handleInputChange}
                            name="phone_number" value={client.phone_number}
                            className="outline-none w-full p-2 my-2 border" type="text" placeholder="Enter phone..." />
                        <label htmlFor="Phone">Company Name</label>
                        <input onChange={handleInputChange}
                            name="company_name" value={client.company_name}
                            className="w-full p-2 my-2 border" type="text" placeholder="Enter company name..." />

                        {/* button */}
                        <div className="flex items-center justify-center w-full">
                            <button className="border p-2 w-[30%] my-2 rounded delay-75 transition ease-in-out
                            hover:bg-slate-800 hover:text-white" type="submit">
                                Update
                            </button>
                        </div>

                    </form>
                </div>
            </div>

        </div>
    )
}