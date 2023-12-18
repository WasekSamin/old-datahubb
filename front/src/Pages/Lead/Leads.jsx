import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from "../../Components/Dashboard/sidebar";
import Dashboardnav from "../../Components/Dashboard/dashboardnav";
import AuthUtils from "../Utils/AuthUtils";
import { MdDeleteOutline } from "react-icons/md";
import { IoPencil } from "react-icons/io5";
import { CSVLink } from "react-csv";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";
import { RiDeleteBin6Line } from "react-icons/ri";


export default function Leads() {
    const { http, token, logout } = AuthUtils()
    const [campaigns, setCampaigns] = useState([])
    const [buyers, setBuyers] = useState([])
    const [suppliers, setSuppliers] = useState([])
    const [leadsByCampaign, setLeadsByCampaign] = useState([])
    const [leadPayload, setLeadPayload] = useState("")
    const [setModal, showModal] = useState(false)

    const [campaignId, setCampaignId] = useState("")
    const [buyerId, setBuyerId] = useState("")
    const [supplierId, setSupplierId] = useState("")
    const [status, setStatus] = useState("")
    const [date, setDate] = useState("")
    const [source, setSource] = useState("")

    // payloads
    // const [ firstName, setFirstName ] = useState("")
    // const [ lastName, setLastName ] = useState("")
    // const [ phone, setPhone ] = useState("")
    // const [ email, setEmail ] = useState("")
    // const [ state, setState ] = useState("")

    const [pay, setPay] = useState("")

    const [loading, setLoading] = useState(false)

    const [csvData, setCsvData] = useState([])

    const headers = [
        { label: "Lead Id", key: "lead_id" },
        { label: "Created at", key: "created_at" },
        { label: "First Name", key: "firstName" },
        { label: "Last Name", key: "lastName" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        { label: "State", key: "state" },
        { label: "Status", key: "status" },
        { label: "Response", key: "response" }
    ]

    const fetchCampaigns = async () => {
        await http.get("/api/campaigns/")
            .then((response) => {
                setCampaigns(response.data.data)
                return response
            })
            .catch((error) => {
                return error
            })
    }

    const fetchBuyers = async () => {
        await http.get(`/api/buyers/${campaignId}/`)
            .then(res => {
                setBuyers(res.data.data);
                return res;
            }).catch(err => {
                return err;
            })
    }

    const fetchSuppliers = async () => {
        await http.get(`/api/suppliers/${campaignId}/`)
            .then(res => {
                setSuppliers(res.data.data);
                return res;
            }).catch(err => {
                return err;
            })
    }

    useEffect(() => {
        if (campaignId) {
            fetchBuyers();
            fetchSuppliers();
        }

        return () => {
            setBuyers([]);
            setSupplierId([]);
        }
    }, [campaignId])

    const filterLeadsByCampaign = async () => {
        setLeadsByCampaign([])
        setLoading(true)
        if (!campaignId) {
            toast.error("Please select campaign")
        }
        else {
            await http.post("/api/leads/", {
                campaign_id: campaignId,
                status: status,
                buyer: buyerId,
                supplier: supplierId,
                lead_date: date,
                source: source,
            })
                .then((response) => {
                    // const dt = response.data.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    // console.log(response.data);
                    setLeadsByCampaign(response.data.data)
                    setTimeout(() => {
                        setLoading(false)
                    }, 2000)
                    return response
                })
                .catch((error) => {
                    console.log(error)
                    return error
                })
        }

    }

    const handleClose = () => {
        showModal(false)
    }

    const getLeadDetails = async (leadId) => {
        setLeadPayload("")
        await http.get(`/api/lead-details/${leadId}/`)
            .then(response => {
                showModal(true)
                setLeadPayload(response.data.data)

                return response
            })
    }


    const convertTOCSV = () => {
        const csvData = leadsByCampaign.map(lead => ({
            lead_id: lead.lead_id,
            created_at: lead.created_at,
            firstName: JSON.parse(lead.payload.replace(/'/g, '"')).firstName,
            lastName: JSON.parse(lead.payload.replace(/'/g, '"')).lastName,
            email: JSON.parse(lead.payload.replace(/'/g, '"')).email,
            phone: JSON.parse(lead.payload.replace(/'/g, '"')).phone,
            state: JSON.parse(lead.payload.replace(/'/g, '"')).state,
            status: lead.status,
            response: JSON.parse(lead.response_log)?.message

        }))

        return csvData
    }

    // deleting leads
    const handleDeleteLeads = async (leadId) => {
        try {
            let response = await http.delete(`/api/delete-lead/${leadId}/`)
            if (response.status === 200) {
                filterLeadsByCampaign()
                toast.success("Lead removed!")
            }
            else {
                toast.error("Something went wrong!")
            }
        } catch (Error) {
            return Error
        }
    }

    useEffect(() => {
        getLeadDetails()
        fetchCampaigns()

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
        <div className="max-w-full">
            <ToastContainer />
            <Dashboardnav />
            <div className="container mx-auto flex flex-row">
                <div className="basis-1/4">
                    <Sidebar />
                </div>
                <div className="flex flex-col items-center w-full bg-white p-3 shadow-md rounded">
                    <div className="flex flex-row items-center justify-between w-full border-b-[1px] p-3">

                        <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-x-5 gap-y-3">
                            <h1 className="text-2xl font-semibold">Leads</h1>
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                                    <select
                                        onChange={(e) => setCampaignId(e.target.value)}
                                        className="flex-1 min-w-[200px] border p-2.5 outline-violet-600 rounded">
                                        <option defaultValue={"Select Campaign"}>Select campaign</option>
                                        {
                                            campaigns.map((campaign) => (
                                                <option key={campaign.id} value={campaign.id}>{campaign.campaign_title}</option>
                                            ))
                                        }
                                    </select>
                                    <select
                                        onChange={(e) => setBuyerId(e.target.value)}
                                        className="flex-1 min-w-[200px] border p-2.5 outline-violet-600 rounded">
                                        <option defaultValue={"Select Buyer"}>Select Buyer</option>
                                        {
                                            buyers.map((buyer) => (
                                                <option key={buyer.id} value={buyer.id}>{buyer.buyer_name}</option>
                                            ))
                                        }
                                    </select>
                                    <select
                                        onChange={(e) => setSupplierId(e.target.value)}
                                        className="flex-1 min-w-[200px] border p-2.5 outline-violet-600 rounded">
                                        <option defaultValue={"Select Supplier"}>Select Supplier</option>
                                        {
                                            suppliers.map((supplier) => (
                                                <option key={supplier.id} value={supplier.id}>{supplier.supplier_name}</option>
                                            ))
                                        }
                                    </select>
                                    <select
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="flex-1 border p-2.5 outline-violet-600 rounded">
                                        <option defaultValue={"Select Campaign"}>Select status</option>
                                        <option value="ACCEPTED">Accepted</option>
                                        <option value="REJECTED">Rejected</option>
                                        <option value="DUPLICATED">Duplicated</option>
                                    </select>
                                    <select onChange={(e) => setSource(e.target.value)}
                                        className="flex-1 min-w-[200px] border p-2.5 outline-violet-600 rounded">
                                        <option defaultValue={"Select Source"}>Select source</option>
                                        <option value="EXTERNAL">External</option>
                                        <option value="INTERNAL">Internal</option>
                                    </select>

                                    <input type="date" onChange={(e) => setDate(e.target.value)}
                                        className="flex-1 min-w-[200px] p-2.5 border outline-violet-600 rounded" />
                                </div>

                                <div>
                                <button onClick={filterLeadsByCampaign}
                                    className="bg-blue-500 p-2 w-[150px] text-white rounded-md shadow-md" type="button" data-modal-toggle="authentication-modal">
                                    Filter
                                </button>
                                </div>
                                {/* {
                                leadsByCampaign.length !== 0 ?
                                <CSVLink className="p-2 rounded border bg-slate-700 text-white"
                             data={convertTOCSV()} headers={headers}>Export</CSVLink>
                             : <div></div>
                            }
                             */}
                            </div>
                        </div>
                    </div>
                    {
                        leadsByCampaign.length !== 0 ?
                            <table className="bg-white w-full my-7 text-left overflow-x-auto">
                                <thead>
                                    <tr className="border-b-2">
                                        <th className="p-3 text-md w-[15%]">Created at</th>
                                        <th className="p-3 text-md">ID</th>

                                        <th className="p-3 text-md">FirstName</th>
                                        <th className="p-3 text-md">LastName</th>
                                        <th className="p-3 text-md">Phone</th>
                                        <th className="p-3 text-md">Email</th>
                                        <th className="p-3 text-md">State</th>
                                        <th className="p-3 text-md">Source</th>
                                        <th className="p-3 text-md">Status</th>
                                        <th className="p-3 text-md">Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        leadsByCampaign.map((lead, index) => {


                                            let payload = lead.payload
                                            payload = payload.replaceAll("\"", "&quot;")
                                            payload = payload.replaceAll("'", "\"");
                                            const validJSon = JSON.parse(payload)

                                            return (
                                                <tr className="border-b-2 cursor-pointer" key={lead.id} >
                                                    <td>
                                                        {lead.created_at}
                                                    </td>
                                                    <td onClick={() => getLeadDetails(lead.id)} className="p-3 text-sm font-semibold">{lead.lead_id}</td>
                                                    <td onClick={() => getLeadDetails(lead.id)} className="p-3 text-sm font-semibold">
                                                        {
                                                            validJSon.firstName ?? validJSon.firstName
                                                        }
                                                        {
                                                            validJSon.first_name ?? validJSon.first_name
                                                        }
                                                        {
                                                            validJSon.Firstname ?? validJSon.Firstname
                                                        }
                                                        {
                                                            validJSon.FirstName ?? validJSon.FirstName
                                                        }
                                                    </td>
                                                    <td onClick={() => getLeadDetails(lead.id)} className="p-3 text-sm font-semibold">
                                                        {
                                                            validJSon.lastName ?? validJSon.lastName
                                                        }
                                                        {
                                                            validJSon.last_name ?? validJSon.last_name
                                                        }
                                                        {
                                                            validJSon.Lastname ?? validJSon.Lastname
                                                        }
                                                        {
                                                            validJSon.LastName ?? validJSon.LastName
                                                        }
                                                    </td>
                                                    <td onClick={() => getLeadDetails(lead.id)} className="p-3 text-sm font-semibold">
                                                        {
                                                            validJSon.Phone ?? validJSon.Phone
                                                        }
                                                        {
                                                            validJSon.phone ?? validJSon.phone
                                                        }
                                                        {
                                                            validJSon.phoneNumber ?? validJSon.phoneNumber
                                                        }
                                                        {
                                                            validJSon.phone_number ?? validJSon.phone_number
                                                        }
                                                    </td>
                                                    <td onClick={() => getLeadDetails(lead.id)} className="p-3 text-sm font-semibold">
                                                        {
                                                            validJSon.email ?? validJSon.email
                                                        }
                                                        {
                                                            validJSon.Email ?? validJSon.Email
                                                        }
                                                    </td>
                                                    <td onClick={() => getLeadDetails(lead.id)} className="p-3 text-sm font-semibold">{validJSon.state}</td>
                                                    <td onClick={() => getLeadDetails(lead.id)} className="p-3 text-sm font-semibold">{lead.supplier_source}</td>
                                                    {
                                                        lead.status === "ACCEPTED" ?
                                                            <td className="text-center bg-green-300 rounded p-2 m-4 flex items-center justify-center text-sm font-semibold">
                                                                ACCEPTED
                                                            </td>
                                                            :
                                                            lead.status === "DUPLICATED" ?
                                                                <td className="text-center bg-amber-300 rounded p-2 m-4 flex items-center justify-center text-sm font-semibold">
                                                                    DUPLICATED
                                                                </td>
                                                                :
                                                                <td className="text-center bg-red-300 rounded p-2 m-4 flex items-center justify-center text-sm font-semibold">
                                                                    REJECTED
                                                                </td>
                                                    }
                                                    <td className="p-3 text-sm font-semibold text-center">
                                                        <button className="" onClick={() => handleDeleteLeads(lead.id)}>
                                                            <RiDeleteBin6Line className="text-2xl text-blue-700 hover:text-rose-500 transition-all delay-50" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )
                                    }


                                </tbody>
                            </table>
                            : <div className="my-7 font-bold text-gray-400 text-2xl">No Results Found</div>
                    }
                    {/* modal */}
                    <div className={`fixed inset-0 ${setModal ? 'bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center' : 'hidden'}`}>
                        <div className="w-full bg-white p-2 rounded w-full md:w-[30%] flex flex-col items-start p-5 gap-3">

                            {/* <form action=""> */}
                            <h2>Payload</h2>
                            <div className="w-full bg-gray-100 rounded border p-3 whitespace-normal">
                                <code>
                                    {
                                        leadPayload &&
                                        JSON.parse(JSON.stringify(leadPayload?.payload.replaceAll("'", "\""), null, 2))
                                    }
                                </code>
                            </div>

                            <h2>Status</h2>
                            <div className="w-full bg-gray-100 rounded border p-3">
                                {
                                    leadPayload.status ? leadPayload.status : <p>REJECTED</p>

                                }
                            </div>

                            <h2>Response</h2>
                            <div className="bg-gray-100 rounded border p-3 w-full whitespace-normal">
                                {/*<textarea name="" id="" cols="30" rows="10"></textarea>*/}

                                {
                                    leadPayload.response_log ?
                                        <textarea className="w-full" disabled name="" id="" cols="20" rows="10">
                                            {leadPayload.response_log}
                                        </textarea>
                                        :
                                        <p>Invalid API Endpoint</p>
                                }

                            </div>

                            <div className="flex gap-5 items-center w-full">
                                <button type="button" onClick={handleClose} className="p-2 rounded bg-red-400 text-white font-bold transition-all hover:bg-red-500 w-full my-3">
                                    Close
                                </button>
                            </div>

                            {/* </form> */}

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}