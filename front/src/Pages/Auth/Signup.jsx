import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import sampleImage1 from "../../assets/269.jpg"
import API_ENDPOINTS from "../../config"
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";
import AuthUtils from "../Utils/AuthUtils";


export default function Signup() {
    const { http, setToken } = AuthUtils()

    const [ firstName, setFirstName ] = useState("")
    const [ lastName, setLastName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ phone, setPhone ] = useState("")
    const [ companyName, setCompanyName ] = useState("")
    const [ password, setPassword ] = useState("")

    const [environment, setEnvironment] = useState('development');
    const navigate = useNavigate()
    
    const apiUrl = API_ENDPOINTS [environment]


    const handleSignup = async() => {
        try{
            const response = await http.post("/api/registration", {
                first_name: firstName,
                last_name: lastName,
                email: email,
                phone_number: phone,
                company_name: companyName,
                password: password
            })
            setToken(response.data.access)
            navigate("/dashboard")
            toast.success("Success")
        } catch(error){
            return error
        }
    }


  return (
    <div className="bg-slate-100">
      <div className="container mx-auto h-full w-[80%] border bg-white rounded my-[80px] flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col items-center w-full">
            <div className="flex items-start justify-between w-full p-5">
                <h1 className="text-3xl font-bold">
                    LOGO
                </h1>
                <Link to="/signin"
                 className="flex items-center justify-center border text-blue-500 rounded hover:bg-blue-500 hover:text-white transition-all p-2 w-[140px] font-semibold">
                    Signin
                </Link>
            </div>
            <div className="w-full">
            <h2 className="text-left mx-7 text-2xl font-semibold">Start your free 14 days trial</h2>
                <div className="flex items-center justify-between w-full gap-3 p-5">
                    <input type="text" onChange={(e) => setFirstName(e.target.value)} placeholder="First Name"
                     className="w-full p-4 border rounded outline-blue-200" />
                    <input type="text" onChange={(e) => setLastName(e.target.value)} placeholder="Last Name"
                     className="w-full p-4 border rounded outline-blue-200" />
                </div>
                <div className="text-left w-full p-5">
                    <small className="text-gray-400">Required</small>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email"
                     className="w-full p-4 border rounded outline-blue-200" />
                </div>
                <div className="text-left w-full p-5">
                <small className="text-gray-400">Required</small>
                    <input type="phone" onChange={(e) => setPhone(e.target.value)} placeholder="Phone"
                     className="w-full p-4 border rounded outline-blue-200" />
                </div>
                <div className="text-left w-full p-5">
                    <small className="text-gray-400">Required</small>
                    <input type="text" onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name"
                     className="w-full p-4 border rounded outline-blue-200" />
                </div>
                <div className="text-left w-full p-5">
                    <small className="text-gray-400">Required</small>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password"
                     className="w-full p-4 border rounded outline-blue-200" />
                </div>
                {/* <div className="text-left w-full p-5">
                    <small className="text-gray-400">Required</small>
                    <input type="password" placeholder="Confirm Password" className="w-full p-4 border rounded" />
                </div> */}
                <div className="text-left w-full p-5">
                    <button onClick={handleSignup} className="w-full bg-blue-500 p-3 text-white font-semibold rounded hover:bg-blue-600 transition-all">
                        SIGNUP
                    </button>
                </div>
            </div>
        </div>
        <div id="imageSection" className="w-[100%] h-full">
                <img src={sampleImage1} className="h-full" alt="" />
            </div>   
      </div>
    </div>
  )
}
