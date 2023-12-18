import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Dashboardnav from "../../Components/Dashboard/dashboardnav";
import Sidebar from "../../Components/Dashboard/sidebar";
import { FiArrowRight } from "react-icons/fi";
import { BiSave } from "react-icons/bi";
import AuthUtils from "../Utils/AuthUtils";
import { Link, useNavigate, useParams } from "react-router-dom";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools"
import { AiOutlinePlusCircle } from "react-icons/ai"
import { BsTrash } from "react-icons/bs"
import { BiPlusMedical } from "react-icons/bi"
import { GrTest } from "react-icons/gr"
import { SiTestcafe } from "react-icons/si"
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";


export default function EditBuyer() {

    const { http, token, logout } = AuthUtils()
    const navigate = useNavigate()
    // const campaignId = useParams()
    const buyerId = useParams()

    const [loading, isLoading] = useState(false)
    const [clients, setClient] = useState([])
    const [buyerName, setBuyerName] = useState("")
    const [buyer, setBuyer] = useState("")
    const [clnt, setClnt] = useState("")
    const [campaign, setCampaign] = useState("")
    const [leadVolumeDailyCap, setLeadVolumeDailyCap] = useState("")
    const [leadVolumeWeeklyCap, setLeadVolumeWeeklyCap] = useState("")
    const [leadVolumeMonthlyCap, setLeadVolumeMonthlyCap] = useState("")
    const [fields, setFields] = useState([]);
    const [budgetDailyCap, setBudgetDailyCap] = useState("")
    const [budgetWeeklyCap, setBudgetWeeklyCap] = useState("")
    const [budgetMonthlyCap, setBudgetMonthlyCap] = useState("")
    const [deliveryMethod, setDeliveryMethod] = useState("")
    const [postUrl, setPostUrl] = useState("")
    const [pingUrl, setPingUrl] = useState("")
    const [requestMethod, setRequestMethod] = useState("")
    const [payloadType, setPayloadType] = useState("")
    const [body, setBody] = useState("");
    const [pingBody, setPingBody] = useState("");
    const [headers, setHeaders] = useState([])
    const [responseType, setResponseType] = useState("")
    const [price, setPrice] = useState("")
    const [acceptedCondition, setAcceptedCondition] = useState("")
    const [acceptedConditionKey, setAcceptedConditionKey] = useState("")
    const [acceptedConditionValue, setAcceptedConditionValue] = useState("")
    const [duplicateCondition, setDuplicateCondition] = useState("")
    const [duplicateKey, setDuplicateKey] = useState("")
    const [duplicateValue, setDuplicateValue] = useState("")
    const [timezone, setTimezone] = useState("")

    const [timezones, setTimezones] = useState([])

    // headers section
    const [sections, setSections] = useState([])

    const addSection = () => {
        setSections([...sections, { key: '', value: '' }]);
    };


    const removeSection = (index) => {
        const updatedSections = [...sections];
        updatedSections.splice(index, 1);
        setSections(updatedSections);
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const updatedSections = [...sections];
        updatedSections[index][name] = value;
        setSections(updatedSections);
    };


    const ONCHANGE = (newValue) => {
        setBody(newValue.target.value)
        console.log("change", newValue);
    }

    const fetchBuyerDetails = async () => {
        await http.get(`/api/fetch-buyer/${buyerId.id}/`)
            .then((response) => {
                console.log(response.data);
                setBuyer(response.data.data)
                setClnt(response.data.data.client?.id)
                setCampaign(response.data.data.campaign?.id)
                // setting buyername
                setBuyerName(response.data.data.buyer_name)
                setFields(response.data.data.campaign?.fields);
                // setting initial value for lead volume daily cap
                setLeadVolumeDailyCap(response.data.data.lead_volume_daily_cap)
                setLeadVolumeWeeklyCap(response.data.data.lead_volume_weekly_cap)
                setLeadVolumeMonthlyCap(response.data.data.lead_volume_monthly_cap)
                // setting initial value for budget cap
                setBudgetDailyCap(response.data.data.budget_daily_cap)
                setBudgetWeeklyCap(response.data.data.budget_weekly_cap)
                setBudgetMonthlyCap(response.data.data.budget_monthly_cap)
                // setting initial delivery method
                setDeliveryMethod(response.data.data.delivery_method)
                // setting post url
                setPostUrl(response.data.data.post_url)
                // setting piong url
                setPingUrl(response.data.data.ping_url)
                // setting initial request method value
                setRequestMethod(response.data.data.request_method)
                // setting initial payload value
                setPayloadType(response.data.data.payload_type)
                // setting initial body value
                setBody(response.data.data.body)
                setPingBody(response.data.data.body)
                // setHeaders([])
                // setting initial response type value
                setResponseType(response.data.data.response_type)
                // setting initial price value
                setPrice(response.data.data.price)
                // setting initial accepted condition
                setAcceptedCondition(response.data.data.accepted_condition)
                setAcceptedConditionKey(response.data.data.accepted_condition_key)
                setAcceptedConditionValue(response.data.data.accepted_condition_value)

                // duplicate initial value
                setDuplicateCondition(response.data.data.duplicate_condition)
                setDuplicateKey(response.data.data.duplicate_condition_key)
                setDuplicateValue(response.data.data.duplicate_condition_value)
                // setting default timezone
                setTimezone(response.data.data.timezone?.id)
                return response
            })
            .catch((error) => {
                return error
            })
    }

    const handleBuyerPut = async () => {
        const data = {
            // client_id: clnt,
            buyer_name: buyerName,
            campaign_id: campaign.id,
            lead_volume_daily_cap: leadVolumeDailyCap,
            lead_volume_weekly_cap: leadVolumeWeeklyCap,
            lead_volume_monthly_cap: leadVolumeMonthlyCap,
            budget_daily_cap: budgetDailyCap,
            budget_weekly_cap: budgetWeeklyCap,
            budget_monthly_cap: budgetMonthlyCap,
            delivery_method: deliveryMethod,
            post_url: postUrl,
            ping_url: pingUrl,
            request_method: requestMethod,
            payload_type: payloadType,
            body: body,
            headers: headers,
            response_type: responseType,
            price: price,
            accepted_condition: acceptedCondition,
            accepted_condition_key: acceptedConditionKey,
            accepted_condition_value: acceptedConditionValue,
            duplicate_condition: duplicateCondition,
            duplicate_condition_key: duplicateKey,
            duplicate_condition_value: duplicateValue,
            timezone: timezone
        }

        http.put(`/api/edit-buyer/${buyerId.id}/`, data)
            .then((response) => {
                toast.success("Buyer updated!")
                return response
            })
            .catch((error) => {
                toast.error(error)
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
                toast.error("Error loading clients" + error)
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
        fetchBuyerDetails()
        getClients()
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

    // Editor on change event
    const bodyOnChange = async (newValue) => {
        setBody(newValue);
    }
    const pingBodyOnChange = async(newValue) => {
        setPingBody(newValue);
    }

    // Copy field name to clipboard
    const copyFieldToClipBoard = async (fieldName) => {
        navigator.clipboard.writeText(`{{${fieldName}}}`);
        toast.success("Field name has been copied.");
    }

    return (
        <div>
            <ToastContainer />
            <Dashboardnav />
            <div className="container mx-auto flex flex-row">
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
                            {/*<input type="text" value={buyer.campaign.id}/>*/}
                            <Link to={`/create-campaign/${buyer.campaign?.id}/`}
                                className={`text-dark p-2 rounded-xl text-white`}>
                                Create Campaign
                            </Link>
                            <p className="p-2 text-white"><FiArrowRight /></p>
                            <a href=""
                                className={`text-dark p-2 bg-white rounded-xl text-slate-900 mx-3`}>
                                Edit Buyer
                            </a>
                        </div>

                        <input type="hidden" onChange={(e) => setCampaign(e.target.value)} value={buyer.campaign?.id} />
                        <div
                            className="flex items-center text-white
                             border p-1.5 w-[180px] mr-5 justify-center transition-all
                              rounded cursor-pointer hover:bg-white hover:text-blue-700 font-semibold">
                            <SiTestcafe className="text-xl mx-1" /><Link to={`/test-lead/${buyerId.id}/`} className="">Test Buyer</Link>
                        </div>
                        <div onClick={handleBuyerPut}
                            className="flex items-center text-white
                             border p-1.5 w-[120px] justify-center transition-all
                              rounded cursor-pointer hover:bg-white hover:text-blue-700 font-semibold">
                            <BiSave className="text-xl" /><button className="">Save</button>
                        </div>

                    </div>

                    <div className="flex flex-col items-center justify-between w-full">
                        <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <label htmlFor="Campaign Name" className="w-[]">Buyer Name</label>
                                <input type="text"
                                    defaultValue={buyer?.buyer_name}
                                    onChange={(e) => setBuyerName(e.target.value)}
                                    className="p-2 border mx-2"
                                    placeholder="Enter Buyer Name"
                                />
                            </div>

                            <div className="flex items-center">
                                <label htmlFor="Timezone" className="w-[]">Select Timezone</label>
                                <input type="hidden" className="p-2 border mx-2" defaultValue={buyer.timezone?.id} />
                                <select defaultValue={buyer.timezone?.id} required
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="rounded ml-7 border outline-blue-200 p-2 w-[300px]">
                                    <option selected value={buyer.timezone?.id}>{buyer.timezone?.timezone_title}</option>
                                    {
                                        timezones?.map((tz) => (
                                            <option value={tz.id} key={tz.id}>{tz.timezone_title}</option>
                                        ))
                                    }
                                </select>

                            </div>

                        </div>

                        <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="font-bold">PRICING</p>
                            </div>
                            <div className="flex items-center bg-gray">
                                <span className="border p-2 font-bold">
                                    $ <input type="number" defaultValue={buyer.price}
                                        onChange={(e) => setPrice(console.log(e.target.value) || "")}
                                        className="outline-none rounded" placeholder="Set default price.." />
                                </span>

                            </div>
                        </div>

                        <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="font-bold">LEADS VOLUME</p>
                            </div>

                        </div>
                        <div className="w-full bg-white p-7 rounded shadow-md w-full flex items-center">
                            <div className="flex items-center">
                                <p className="font-bold">Daily Cap</p>
                            </div>
                            <div className="flex items-center bg-gray mx-5">
                                <span className="border p-2 font-bold">
                                    <input defaultValue={buyer.lead_volume_daily_cap} type="number" onChange={(e) => { setLeadVolumeDailyCap(e.target.value) }}
                                        className="outline-none rounded" placeholder="Set daily cap" />
                                </span>

                            </div>
                            <div className="flex items-center">
                                <p className="font-bold">Weekly Cap</p>
                            </div>
                            <div className="flex items-center bg-gray mx-5">
                                <span className="border p-2 font-bold">
                                    <input defaultValue={buyer.lead_volume_weekly_cap}
                                        type="number" onChange={(e) => setLeadVolumeWeeklyCap(e.target.value)}
                                        className="outline-none rounded" placeholder="Set weekly cap" />
                                </span>

                            </div>
                            <div className="flex items-center">
                                <p className="font-bold">Monthly Cap</p>
                            </div>
                            <div className="flex items-center bg-gray mx-5">
                                <span className="border p-2 font-bold">
                                    <input defaultValue={buyer.lead_volume_monthly_cap}
                                        type="number" onChange={(e) => setLeadVolumeMonthlyCap(e.target.value)}
                                        className="outline-none rounded" placeholder="Set monthly cap" />
                                </span>

                            </div>
                        </div>


                        <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <p className="font-bold">BUDGET</p>
                            </div>
                        </div>


                        <div className="w-full bg-white p-7 rounded shadow-md w-full flex items-center">
                            <div className="flex items-center">
                                <p className="font-bold">Daily Cap</p>
                            </div>
                            <div className="flex items-center bg-gray mx-5">
                                <span className="border p-2 font-bold">
                                    <input defaultValue={buyer.budget_daily_cap}
                                        type="number" onChange={(e) => setBudgetDailyCap(e.target.value)}
                                        className="outline-none rounded" placeholder="Set daily budget" />
                                </span>

                            </div>
                            <div className="flex items-center">
                                <p className="font-bold">Weekly Cap</p>
                            </div>
                            <div className="flex items-center bg-gray mx-5">
                                <span className="border p-2 font-bold">
                                    <input defaultValue={buyer.budget_weekly_cap}
                                        type="number" onChange={(e) => setBudgetWeeklyCap(e.target.value)}
                                        className="outline-none rounded" placeholder="Set weekly budget" />
                                </span>

                            </div>
                            <div className="flex items-center">
                                <p className="font-bold">Monthly Cap</p>
                            </div>
                            <div className="flex items-center bg-gray mx-5">
                                <span className="border p-2 font-bold">
                                    <input defaultValue={buyer.budget_monthly_cap}
                                        type="number" onChange={(e) => setBudgetMonthlyCap(e.target.value)}
                                        className="outline-none rounded" placeholder="Set monthly budget" />
                                </span>

                            </div>
                        </div>

                        <div className="my-5 w-full bg-white rounded shadow-md flex flex-col items-start p-7">
                            <div className="border-b-[1px] w-full">
                                <h2 className="text-xl text-left my-2"> DELIVERY METHOD</h2>
                            </div>

                            <div className="w-full flex items-center justify-center bg-gray-50 gap-5 p-3">
                                <select onChange={(e) => setDeliveryMethod(e.target.value)}
                                    className="w-full border p-2.5 rounded border-gray-600">
                                    <option value={buyer.delivery_method} className="text-red-400">Select Delivery Method: {buyer.delivery_method}</option>
                                    <option value="DIRECT POST">Direct Post</option>
                                    <option value="PING POST">Ping/Post</option>
                                    {/* <option value="EMAIL">Email</option> */}
                                    <option value="STORE LEADS">Store Leads</option>
                                </select>
                            </div>

                            <div className="w-full border border-blue-500 p-5 my-7 flex flex-col gap-y-3">
                                {
                                    deliveryMethod === "PING POST" && (
                                        <>
                                            <input defaultValue={buyer.ping_url}
                                                onChange={(e) => setPingUrl(e.target.value)}
                                                type="text" className="border border-gray-400 w-[100%] rounded p-2" placeholder="PING URL *" />
                                            <div className="w-full mb-3">
                                                <h2 className="text-left">
                                                    Body: choose from your campaign fields or our system fields.  If you would like to transform your data, you can apply these transformers
                                                </h2>
                                                {
                                                    fields.length > 0 &&
                                                    <div className="flex gap-x-2 gap-y-2 flex-wrap my-3">
                                                        {
                                                            fields.map(field => (
                                                                <button onClick={() => copyFieldToClipBoard(field.field_name)} key={field.id} type="button" className="font-normal px-2 py-1 border border-stone-300 rounded-md hover:bg-stone-100 hover:border-stone-500 hover:shadow-sm transition-all duration-200 ease-linear">
                                                                    <span className="">&#10100;&#10100; {field.field_name} &#10101;&#10101;</span>
                                                                </button>
                                                            ))
                                                        }
                                                    </div>
                                                }
                                                <div className="relative w-full p-1">
                                                    <AceEditor
                                                        mode="json"
                                                        theme="textmate"
                                                        name="body__editor"
                                                        onChange={pingBodyOnChange}
                                                        value={pingBody}
                                                        editorProps={{ $blockScrolling: true }}
                                                        setOptions={{
                                                            enableBasicAutocompletion: true,
                                                            enableLiveAutocompletion: true,
                                                            enableSnippets: true
                                                        }}
                                                        fontSize={16}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )
                                }


                                <div className="flex gap-3">

                                    <input defaultValue={buyer.post_url}
                                        onChange={(e) => setPostUrl(e.target.value)}
                                        type="text" className="border border-gray-400 w-[60%] rounded p-2" placeholder="POST URL *" />

                                    <select defaultValue={buyer.request_method} required onChange={(e) => setRequestMethod(e.target.value)}
                                        className="border border-gray-400 w-[20%] p-2 rounded">
                                        <option value={buyer.request_method}>Select Type*: {buyer.request_method}</option>
                                        <option value="POST">POST</option>
                                        <option value="GET">GET</option>
                                        {/* <option value="post">PUT</option> */}
                                    </select>
                                    <select defaultValue={buyer.payload_type} onChange={(e) => setPayloadType(e.target.value)}
                                        className="border border-gray-400 w-[20%] p-2 rounded">
                                        <option value={buyer.payload_type}>Select Payload Type*: {buyer.payload_type}</option>
                                        <option value="FORM">FORM</option>
                                        <option value="JSON">JSON</option>
                                        <option value="XML">XML</option>
                                    </select>
                                </div>
                                <div className="w-full">
                                    <h2 className="text-left">
                                        Body: choose from your campaign fields or our system fields.If you would like to transform your data, you can apply these transformers
                                    </h2>
                                    {
                                        fields.length > 0 &&
                                        <div className="flex gap-x-2 gap-y-2 flex-wrap my-3">
                                            {
                                                fields.map(field => (
                                                    <button onClick={() => copyFieldToClipBoard(field.field_name)} key={field.id} type="button" className="font-normal px-2 py-1 border border-stone-300 rounded-md hover:bg-stone-100 hover:border-stone-500 hover:shadow-sm transition-all duration-200 ease-linear">
                                                        <span className="">&#10100;&#10100; {field.field_name} &#10101;&#10101;</span>
                                                    </button>
                                                ))
                                            }
                                        </div>
                                    }
                                    <div className="relative w-full p-1">
                                        <AceEditor
                                            mode="json"
                                            theme="textmate"
                                            name="body__editor"
                                            onChange={bodyOnChange}
                                            value={body}
                                            editorProps={{ $blockScrolling: true }}
                                            setOptions={{
                                                enableBasicAutocompletion: true,
                                                enableLiveAutocompletion: true,
                                                enableSnippets: true
                                            }}
                                            fontSize={16}
                                        />
                                    </div>
                                </div>
                                {/* <div className="w-full my-7 flex items-center justify-between">
                                    <h2 className="text-md font-semibold my-[-2rem]">Custom Headers</h2>
                                    <div className="flex flex-col items-center  justify-center gap-5">
                                        <div className="flex items-cente justify-between gap-5 w-full">
                                            <input type="text" defaultValue={"Content-Type"} className="w-full border p-2 rounded outline-blue-700"/>
                                            <input type="text" defaultValue={"application/json"} className="w-full border p-2 rounded outline-blue-700"/>
                                            <button><BsTrash className="text-2xl text-red-300 hover:text-red-500 transition-all"/></button>
                                            <button onClick={addSection}>
                                                <BiPlusMedical className="text-2xl text-gray-500" />
                                            </button>
                                        </div>

                                        <div className="my-5">
                                            {sections.map((section, index) => (
                                                <div className="flex items-center justify-between gap-5 w-full my-5" key={index}>
                                                    <input
                                                        onChange={(e) => handleInputChange(index, e)}
                                                        type="text"
                                                        name="key"
                                                        placeholder="Enter key"
                                                        defaultValue={section.key}
                                                        className="w-full border p-2 rounded outline-blue-700"
                                                    />
                                                    <input
                                                        onChange={(e) => handleInputChange(index, e)}
                                                        type="text"
                                                        name="value"
                                                        placeholder="Enter value"
                                                        defaultValue={section.value}
                                                        className="w-full border p-2 rounded outline-blue-700"
                                                    />

                                                    <button onClick={() => removeSection(index)}>
                                                        <BsTrash className="text-2xl text-red-300 hover:text-red-500 transition-all" />
                                                    </button>

                                                    {index === sections.length - 1 && (
                                                        <button onClick={addSection}>
                                                            <BiPlusMedical className="text-2xl text-gray-500 font-bold" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div> */}

                                <div className="w-full my-7 flex flex-col items-center justify-center">
                                    <h2 className="text-center bg-blue-700 p-2 text-white font-normal rounded-full">DIRECT POST — Response mapping</h2>
                                    <div className="flex items-center justify-between gap-5 w-full my-5">
                                        <h2 className="font-semibold text-green-400">ACCEPTED</h2>
                                        <select onChange={(e) => setAcceptedCondition(e.target.value)}
                                            className="w-full border p-2.5 rounded outline-blue-700">
                                            <option value={buyer.accepted_condition}>Selected Condition: {buyer.accepted_condition}</option>
                                            <option value="KEY EQUALS WITH">Key equal with</option>
                                            <option value="STATUS CODE">Key contains</option>
                                            <option value="KEY CONTAINS">Status code</option>
                                        </select>
                                        <input defaultValue={buyer.accepted_condition_key}
                                            onChange={(e) => setAcceptedConditionKey(e.target.value)}
                                            type="text" placeholder="Enter Key" className="w-full border p-2 rounded outline-blue-700" />
                                        <input defaultValue={buyer.accepted_condition_value}
                                            onChange={(e) => setAcceptedConditionValue(e.target.value)}
                                            type="text" placeholder="Enter Value" className="w-full border p-2 rounded outline-blue-700" />
                                    </div>
                                    <div className="flex items-center justify-between gap-5 w-full my-5">
                                        <h2 className="font-semibold text-amber-400">DUPLICATE</h2>
                                        <select onChange={(e) => setDuplicateCondition(e.target.value)}
                                            className="w-full border p-2.5 rounded outline-blue-700">
                                            <option value={buyer.duplicate_condition}>Selected Condition: {buyer.duplicate_condition}</option>
                                            <option value="KEY EQUALS WITH">Key equal with</option>
                                            <option value="STATUS CODE">Key contains</option>
                                            <option value="KEY CONTAINS">Status code</option>
                                        </select>
                                        <input defaultValue={buyer.duplicate_condition_key}
                                            onChange={(e) => setDuplicateKey(e.target.value)}
                                            type="text" placeholder="Enter Key" className="w-full border p-2 rounded outline-blue-700" />
                                        <input defaultValue={buyer.duplicate_condition_value}
                                            onChange={(e) => setDuplicateValue(e.target.value)}
                                            type="text" placeholder="Enter Value" className="w-full border p-2 rounded outline-blue-700" />
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )

}