import React from 'react'
import { useEffect, useState, useRef } from "react"
import Dashboardnav from "../../Components/Dashboard/dashboardnav"
import Sidebar from "../../Components/Dashboard/sidebar"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MdDeleteOutline } from "react-icons/md"
import { IoPencil } from "react-icons/io5"
import { Triangle, ColorRing } from 'react-loader-spinner'
import AuthUtils from "../Utils/AuthUtils";
import { Link, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { CSVLink } from "react-csv"
import { LOGOUT_TIMEOUT } from '../Utils/baseConfig'



export default function Campaign() {
    const [loading, setLoading] = useState([false]);
    const [setModal, showModal] = useState(false)
    const [campaigns, setCampaigns] = useState([])
    const [campaignName, setCampaignName] = useState("");
    const campaignNameRef = useRef();
    const [formError, setFormError] = useState({
        errorId: -1, errorMsg: ""
    });
    const apiUrl = "http://127.0.0.1:8000/api/"

    const { http, token, logout } = AuthUtils()

    const navigate = useNavigate()

    const getCampaigns = async () => {
        setLoading(true)
        await http.get("/api/campaigns/")
            .then((response) => {
                setLoading(false)
                setCampaigns(response.data.data)

                return response
            })
            .catch((error) => {
                return error
            })
    }

    const showFormError = ({ errorId, errorMsg }) => {
        setFormError({
            errorId: errorId,
            errorMsg: errorMsg
        });

        if (errorId === 1) {
            campaignNameRef.current?.focus();
        }
    }

    const handleCampaignPost = async (e) => {
        e.preventDefault();

        setFormError({
            errorId: -1, errorMsg: ""
        })

        if (campaignName === "") {
            showFormError({ errorId: 1, errorMsg: "Campaign name is required!" });
            return;
        }

        await http.post("/api/create-campaign/", {
            campaign_title: campaignName
        })
            .then((response) => {
                const campaignId = response.data.data.id
                console.log(campaignId)
                navigate(`/create-campaign/${campaignId}/`)
                return response
            })
            .catch((error) => {
                return error
            })
    }

    const handleCampaignDelete = async (campaign__id) => {
        await http.delete(`/api/delete-campaign/${campaign__id}/`)
            .then((response) => {
                toast.success("Campaign removed")
                getCampaigns()
                return response
            })
            .catch((error) => {
                return error
            })
    }

    useEffect(() => {
        getCampaigns()

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

    const toggleModal = (modalStatus) => {
        showFormError({
            errorId: -1,
            errorMsg: ""
        })
        showModal(modalStatus);
        if (modalStatus) {
            setTimeout(() => {
                campaignNameRef.current?.focus();
            }, 50);
        }
    }

    return (
        <div>
            <ToastContainer />
            <Dashboardnav />
            <div className="container mx-auto flex flex-row">

                <div className="basis-1/4">
                    <Sidebar />
                </div>

                <div className="bg-white p-5 rounded shadow-md basis-[100%]">
                    <div className="flex flex-row items-center justify-between w-full border-b-2">
                        <p className="font-semibold">CAMPAIGNS</p>

                        <div className="flex flex-row items-center justify-between p-2">
                            <input type="text"
                                className="border p-1 outline-none mr-3 rounded"
                                placeholder="Enter to search..." />

                            <button type="button"
                                onClick={() => toggleModal(true)}
                                className="bg-blue-400 p-2 rounded font-normal text-white cursor-pointer">
                                Add New Campaign
                            </button>
                            {/* modal */}
                            <div className={`fixed inset-0 ${setModal ? 'bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center' : 'hidden'}`}>
                                <form onSubmit={handleCampaignPost} className="bg-white p-2 rounded w-[30%] flex flex-col items-start p-5">

                                    {/* <form action=""> */}
                                    <div className='w-full flex flex-col gap-y-1'>
                                        <div className='flex flex-1 flex-col gap-y-2'>
                                            <label htmlFor="FieldName">Campaign Name</label>
                                            <input ref={campaignNameRef} type="text" onChange={(e) => setCampaignName(e.target.value)} placeholder="Enter campaign name" className="w-full p-1 border outline-blue-300" />
                                        </div>
                                        {
                                            formError.errorId === 1 && <p className="text-rose-600">{formError.errorMsg}</p>
                                        }
                                    </div>

                                    <div className="flex items-center w-full">
                                        <button type="submit" className="p-2 rounded bg-green-400 w-full my-3">
                                            Save
                                        </button>
                                        <button type="button" onClick={() => toggleModal(false)} className="p-2 rounded bg-red-400 w-full my-3 mx-1">
                                            Cancel
                                        </button>
                                    </div>

                                    {/* </form> */}
                                </form>


                            </div>
                            {/* modal ends */}
                        </div>
                    </div>
                    {
                        campaigns.length !== 0 ? (
                            <div className="w-full">
                                <table className="bg-white w-full my-7 text-left">
                                    <thead>
                                        <tr className="border-b-2">
                                            <th className="p-3 text-sm">ID</th>
                                            <th className="p-3 text-sm">NAME</th>
                                            <th className="p-3 text-sm">Total Posted</th>
                                            <th className="p-3 text-sm">Total Accepted</th>
                                            <th className="p-3 text-sm">Total Rejected</th>
                                            <th className="p-3 text-sm">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            campaigns.map((campaign) => (
                                                <tr className="border-b-2 cursor-pointer" key={campaign.id}>
                                                    <td className="p-3 text-sm font-semibold">{campaign?.id}</td>
                                                    <td className="p-3 text-sm font-semibold">{campaign?.campaign_title}</td>
                                                    <td className="p-3 text-sm font-semibold">{
                                                        campaign?.total_posted === 0 ? (
                                                            <p>0</p>
                                                        ) : (
                                                            <p>{campaign?.total_posted}</p>
                                                        )
                                                    }</td>
                                                    <td className="p-3 text-sm font-semibold">{
                                                        campaign?.total_accepted === 0 ?
                                                            (<p>0</p>) : (<p>{campaign?.total_accepted}</p>)
                                                    }</td>
                                                    <td className="p-3 text-sm font-semibold">{
                                                        campaign?.total_rejected === 0 ? (
                                                            <p>0</p>
                                                        ) : (<p>{campaign?.total_rejected}</p>)
                                                    }</td>
                                                    <td className="p-3 flex items-center text-sm font-semibold">
                                                        <button type="button" onClick={() => handleCampaignDelete(campaign.id)}>
                                                            <MdDeleteOutline
                                                                className="text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50"
                                                            />
                                                        </button>
                                                        <Link to={`/create-campaign/${campaign.id}/`} data-modal-toggle="authentication-modal">
                                                            <IoPencil className="mx-3 text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        }


                                    </tbody>
                                </table>
                            </div>
                        ) :

                            campaigns.length === 0 ?
                                <div className="w-full text-center text-lg font-bold my-5">
                                    No records found
                                </div>

                                : (
                                    <div className="flex items-center justify-center">
                                        <TailSpin
                                            height="100"
                                            width="80"
                                            color="#8451CA"
                                            ariaLabel="tail-spin-loading"
                                            radius="2"
                                            wrapperStyle={{}}
                                            wrapperClass=""
                                            visible={true}
                                        />
                                    </div>
                                )
                    }

                </div>
            </div>
        </div>
    )
}
