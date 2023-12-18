import React from "react";
import { useEffect, useState } from "react"
import Dashboardnav from "../../Components/Dashboard/dashboardnav"
import Sidebar from "../../Components/Dashboard/sidebar"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FiArrowRight } from "react-icons/fi"
import { Triangle, ColorRing } from 'react-loader-spinner'
import { BiSave } from "react-icons/bi"
import AuthUtils from "../Utils/AuthUtils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";




export default function EditSupplier() {
    const { http, logout, token } = AuthUtils()
    const navigate = useNavigate()
    // const campaignId = useParams()
    const supplierId = useParams()

    const [campaignId, setCampaignId] = useState("")

    const [loading, isLoading] = useState(false)
    const [clients, setClient] = useState([])
    const [supplierName, setSupplierName] = useState("")
    const [supplierClient, setSupplierClient] = useState("")
    const [timezone, setTimeZone] = useState("")
    const [publicName, setPublicName] = useState("")
    const [leadVolumeDailyCap, setLeadVolumeDailyCap] = useState("")
    const [leadVolumeWeeklyCap, setLeadVolumeWeeklyCap] = useState("")
    const [leadVolumeMonthlyCap, setLeadVolumeMonthlyCap] = useState("")
    const [budgetDailyCap, setBudgetDailyCap] = useState("")
    const [budgetWeeklyCap, setBudgetWeeklyCap] = useState("")
    const [budgetMonthlyCap, setBudgetMonthlyCap] = useState("")
    const [price, setPrice] = useState("")
    const [source, setSource] = useState("")

    const [supplierDetails, setSupplierDetails] = useState("")

    const [timezones, setTimezones] = useState([])

    // setting up tooltips
    const [pricingToolTip, setPricingToolTip] = useState(false)
    const [leadTooltip, setLeadTooltip] = useState(false)
    const [budgetToolTip, setBudgetToolTip] = useState(false)

    const getsupplierDetails = async () => {
        await http.get(`/api/supplier-details/${supplierId.id}/`)
            .then((response) => {
                setSupplierDetails(response.data.data)
                setSupplierClient(response.data.data.client?.id)
                setCampaignId(response.data.data.campaign)
                setTimeZone(response.data.data.timezone?.id)
                setSource(response.data.data.source)
                setSupplierName(response.data.data.supplier_name)
                setPrice(response.data.data.price)
                return response
            })
            .catch((error) => {
                return error
            })
    }

    const getClients = async () => {
        isLoading(true)
        await http.get("/api/clients/")
            .then((response) => {
                setClient(response.data.data)
                isLoading(false)
                return response
            })
            .catch((error) => {
                return error
            })
    }

    const handleSupplierUpdate = async () => {
        getsupplierDetails()
        await http.put(`/api/update-supplier/${supplierId.id}/`, {
            // client_id: supplierClient ?? "",
            supplier_name: supplierName,
            campaign_id: supplierDetails.campaign,
            public_name: publicName ?? supplierDetails.public_name,
            lead_volume_daily_cap: leadVolumeDailyCap ? supplierDetails.lead_volume_daily_cap : 0,
            lead_volume_weekly_cap: leadVolumeWeeklyCap ? supplierDetails.lead_volume_weekly_cap : 0,
            lead_volume_monthly_cap: leadVolumeMonthlyCap ? supplierDetails.lead_volume_monthly_cap : 0,
            budget_daily_cap: budgetDailyCap ? supplierDetails.budget_daily_cap : 0,
            budget_weekly_cap: budgetWeeklyCap ? supplierDetails.budget_weekly_cap : 0,
            budget_monthly_cap: budgetMonthlyCap ? supplierDetails.budget_monthly_cap : 0,
            price: price,
            source: source,
            timezone: timezone
        })
            .then((response) => {
                if (response.status === 200) {
                    toast.success('Supplier updated successfully!', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    // navigate("/campaigns")
                    return response
                }
                else {
                    toast.success('Something went wrong', {
                        position: 'bottom-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }

            })
            .catch((error) => {
                toast.error(error)
                return error
            })
    }

    const getTimezones = async () => {
        await http.get("/api/timezones/")
            .then((response) => {
                setTimezones(response.data.data)
                return response
            })
            .catch((error) => {
                return error
            })
    }



    useEffect(() => {
        getClients()
        getsupplierDetails()
        getTimezones()

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
            <Dashboardnav />
            <div className="container mx-auto flex flex-row w-full">
                <div className="basis-1/4">
                    <Sidebar />
                </div>
                <div className="flex flex-col items-center justify-between w-full">
                    <div className="bg-violet-500 p-5 rounded shadow-md w-full flex justify-between items-center">
                        <div className="w-full flex justify-start items-center">
                            <a href="/campaigns"
                                className="text-white p-2 hover:bg-white hover:rounded-xl hover:text-slate-900 transition-all">
                                Campaigns
                            </a>
                            <p className="p-2 text-white"><FiArrowRight /></p>
                            <Link to={`/create-campaign/${supplierDetails.campaign}/`}
                                className={`text-dark p-2 rounded-xl text-white`}>
                                Create Campaign
                            </Link>
                            <p className="p-2 text-white"><FiArrowRight /></p>
                            <a href="/create-supplier"
                                className={`text-dark p-2 bg-white rounded-xl text-slate-900 mx-3`}>
                                Edit Supplier
                            </a>
                        </div>

                        <div
                            className="flex items-center text-white
                             border p-1.5 w-[120px] justify-center transition-all
                              rounded cursor-pointer hover:bg-white hover:text-blue-700 font-semibold">
                            <BiSave className="text-xl" /><button onClick={handleSupplierUpdate} className="">Save</button>
                        </div>

                    </div>

                    <div className="flex flex-col items-center justify-between w-full">
                        <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex flex-col md:flex-row items-center justify-between gap-5">
                            <div className="flex items-center w-full justify-between">
                                {/* <select onChange={(e)=>setSupplierClient(e.target.value)} required
                                className="rounded md:ml-7 border outline-violet-700 p-2 w-full md:w-[300px]"
                                placeholder="Enter campaign name"
                                >
                                <option value="" selected>Select Supplier</option>
                                    {
                                        clients.map((c)=>(
                                            
                                            <option value={c.id}>{c.name}</option>
                                        ))
                                    }
                                </select> */}

                                <label htmlFor="Supplier Name">Supplier Name</label>
                                <input
                                    type="text" className="p-2 border rounded w-[60%]" defaultValue={supplierDetails.supplier_name}
                                    placeholder="Enter supplier name"
                                    onChange={(e) => setSupplierName(e.target.value)}
                                />
                            </div>
                            <div className="w-full flex items-center justify-between">
                                <label htmlFor="">Select Source</label>
                                <select onChange={(e) => setSource(e.target.value)}
                                    name="" id="" className="p-2 border rounded w-[60%]">
                                    <option value={supplierDetails.source}>Selected: {supplierDetails.source}</option>
                                    <option value="EXTERNAL">External</option>
                                    <option value="INTERNAL">Internal</option>
                                </select>
                            </div>
                        </div>

                        {/*PRICE SECTION*/}

                        <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="font-bold text-blue-500">PRICING</p>
                            </div>
                            <div className="flex items-center bg-gray gap-4">
                                {
                                    pricingToolTip ?
                                        <p className="p-2 border bg-white rounded shadow-md text-sm">
                                            If it sets to 0 the price will be set to infinite
                                        </p>
                                        : <div></div>
                                }
                                <AiOutlineInfoCircle onMouseOver={() => setPricingToolTip(true)}
                                    onMouseLeave={() => setPricingToolTip(false)}
                                    className="text-xl cursor-pointer" />

                                <span className="border p-2 font-bold">
                                    $ <input defaultValue={supplierDetails.price} type="number" onChange={(e) => setPrice(e.target.value)}
                                        className="outline-none rounded" placeholder="Set default price.." />
                                </span>

                            </div>
                        </div>

                        <div className="w-full bg-white p-7 rounded shadow-md w-full flex items-center justify-between gap-3">
                            <div className="flex items-center">
                                <p className="font-bold">TIMEZONE</p>
                            </div>
                            <div className="flex items-center justify-between bg-gray">
                                <select name="" id="" className="border p-2 w-full rounded"
                                    onChange={(e) => setTimeZone(e.target.value)}>
                                    <option value="">Selected timezone: {supplierDetails.timezone?.timezone_title}</option>
                                    {
                                        timezones?.map((tz) => (
                                            <option value={tz.id} key={tz.id}>{tz.timezone_title}</option>
                                        ))
                                    }
                                </select>

                            </div>
                        </div>

                        {/*LEAD SECTION*/}

                        <div className="w-full bg-white p-7 rounded shadow-md flex flex-col items-start justify-between my-4">
                            <div className="flex items-center gap-4">
                                <p className="font-bold text-left text-2xl text-blue-500">LEADS VOLUME</p>
                                <AiOutlineInfoCircle onMouseOver={() => setLeadTooltip(true)}
                                    onMouseLeave={() => setLeadTooltip(false)}
                                    className="text-xl cursor-pointer" />
                                {
                                    leadTooltip ?
                                        <p className="p-2 bg-white rounded shadow-md text-sm transition-all">
                                            If it sets to 0 this will be set to infinite
                                        </p>
                                        :
                                        <div></div>
                                }
                            </div>

                            <div className="w-full flex md:flex-row flex-col items-center my-5">
                                <div className="flex items-center w-full">
                                    <p className="font-bold">Daily Cap</p>
                                </div>
                                <div className="flex items-center bg-gray md:mx-5 w-full">
                                    <span className="border p-2 font-bold w-full">
                                        <input defaultValue={supplierDetails.lead_volume_daily_cap} type="number" onChange={(e) => setLeadVolumeDailyCap(e.target.value)}
                                            className="w-full outline-none rounded" placeholder="Set daily cap" />
                                    </span>

                                </div>
                                <div className="flex items-center w-full">
                                    <p className="font-bold">Weekly Cap</p>
                                </div>
                                <div className="flex items-center bg-gray md:mx-5 w-full">
                                    <span className="border p-2 font-bold w-full">
                                        <input defaultValue={supplierDetails.lead_volume_weekly_cap} type="number" onChange={(e) => setLeadVolumeWeeklyCap(e.target.value)}
                                            className="w-full outline-none rounded" placeholder="Set weekly cap" />
                                    </span>

                                </div>
                                <div className="flex items-center w-full">
                                    <p className="font-bold">Monthly Cap</p>
                                </div>
                                <div className="flex items-center bg-gray md:mx-5 w-full">
                                    <span className="border p-2 font-bold w-full">
                                        <input defaultValue={supplierDetails.lead_volume_monthly_cap} type="number" onChange={(e) => setLeadVolumeMonthlyCap(e.target.value)}
                                            className="w-full outline-none rounded" placeholder="Set monthly cap" />
                                    </span>

                                </div>
                            </div>

                        </div>


                        {/*BUDGET SECTION*/}

                        <div className="w-full flex flex-col bg-white p-7 items-start justify-between shadow-md rounded">
                            <div className="flex items-center gap-4">
                                <p className="font-bold text-2xl text-blue-500">BUDGET</p>

                                <AiOutlineInfoCircle onMouseOver={() => setBudgetToolTip(true)}
                                    onMouseLeave={() => setBudgetToolTip(false)}
                                    className="text-xl cursor-pointer" />
                                {
                                    budgetToolTip ?
                                        <p className="p-2 bg-white rounded shadow-md text-sm transition-all ease-in-out delay-300">
                                            If it sets to 0 this will be set to infinite
                                        </p>
                                        :
                                        <div></div>
                                }
                            </div>
                            <div className="w-full flex md:flex-row flex-col items-center my-7">
                                <div className="flex items-center w-full">
                                    <p className="font-bold">Daily Cap</p>
                                </div>
                                <div className="flex items-center bg-gray md:mx-5 w-full">
                                    <span className="border p-2 font-bold w-full">
                                        <input defaultValue={supplierDetails.budget_daily_cap} type="number" onChange={(e) => setBudgetDailyCap(e.target.value)}
                                            className="outline-none rounded w-full" placeholder="Set daily cap" />
                                    </span>

                                </div>
                                <div className="flex items-center w-full">
                                    <p className="font-bold">Weekly Cap</p>
                                </div>
                                <div className="flex items-center bg-gray md:mx-5 w-full">
                                    <span className="border p-2 font-bold w-full">
                                        <input defaultValue={supplierDetails.budget_weekly_cap} type="number" onChange={(e) => setBudgetWeeklyCap(e.target.value)}
                                            className="w-full outline-none rounded" placeholder="Set weekly cap" />
                                    </span>

                                </div>
                                <div className="flex items-center w-full gap-3">
                                    <p className="font-bold">Monthly Cap</p>
                                </div>
                                <div className="flex items-center bg-gray md:mx-5 w-full">
                                    <span className="border p-2 font-bold w-full">
                                        <input defaultValue={supplierDetails.budget_monthly_cap} type="number" onChange={(e) => setBudgetMonthlyCap(e.target.value)}
                                            className="w-full outline-none rounded" placeholder="Set monthly cap" />
                                    </span>

                                </div>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        </div>
    )
}