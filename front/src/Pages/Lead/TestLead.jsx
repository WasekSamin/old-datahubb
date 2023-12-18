import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Dashboardnav from "../../Components/Dashboard/dashboardnav";
import 'react-toastify/dist/ReactToastify.css'
import Sidebar from "../../Components/Dashboard/sidebar";
import AuthUtils from "../Utils/AuthUtils"
import { Link, useNavigate, useParams } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { FiArrowRight } from "react-icons/fi";
import { BiSave } from "react-icons/bi";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";

export default function LeadTest() {

    const { http, token, logout } = AuthUtils()
    const buyerId = useParams()
    const [buyer, setBuyer] = useState("")
    const [buyerFields, setBuyerFields] = useState([])
    const [name, setName] = useState("")
    const [payload, setPayload] = useState({})
    const [data, setData] = useState("")
    const [response, setResponse] = useState("")
    const [showResponse, setShowResponse] = useState(false)
    const [campaignId, setCampaignId] = useState("")

    const [loading, setLoading] = useState(false)

    // test code



    const [formData2, setFormData2] = useState({});
    const [dataObject, setDataObject] = useState(null); // State to hold parsed JSON
    const [buyerBody, setBuyerBody] = useState("")

    const fetchBuyerDetails = async () => {
        await http.get(`/api/fetch-buyer/${buyerId.id}/`)
            .then((response) => {
                setBuyer(response.data.data)
                setBuyerFields(response.data.data.campaign.fields)
                setBuyerBody(response.data.data.body)
                // console.log("body", buyerBody)
                // const validJSON = buyerBody.replace(/'/g, '"');
                // console.log('Parsed JSON:', validJSON);
                // const parsedJSON = JSON.parse(validJSON);
                // setDataObject(JSON.parse(buyerBody.replace(/'/g, '"')));
                // console.log('Updated dataObject:', dataObjectx);
                return response
            })
            .catch((error) => {
                return error
            })
    }

    const initialFormData = {};
    buyerFields?.map((fieldName) => {
        initialFormData[fieldName.field_name] = "";
    })

    const [formData, setFormData] = useState(initialFormData);

    const handleInputChange2 = (e) => {
        setPayload({ ...formData2, [e.target.name]: e.target.value });
    };


    useEffect(() => {
        const fetchData = async () => {
            // console.log("Buyer ID => ", buyerId.id)
            try {
            const response = await http.get(`/api/fetch-buyer/${buyerId.id}/`);
            // console.log('Response:', response); // Log the entire response to check its structure
                setBuyer(response.data.data)

            if (response && response.data && response.data.data) {
                const validJSON = response.data.data.body.replace(/'/g, '"');
                try {
                const parsedJSON = JSON.parse(validJSON);
                setDataObject(parsedJSON);
                // Update buyerBody here if needed:
                setBuyerBody(validJSON);
                } catch (error) {
                console.error('Error parsing JSON:', error);
                }
            } else {
                console.error('Invalid response format');
            }
            } catch (error) {
            console.error('Error fetching buyer details:', error);
            }
        };

    fetchData();
    }, []);

    const sendTestLead = async () => {
        setLoading(true)
        await http.post("/api/test-ingest/", {
            campaign_id: buyer?.campaign?.id,
            is_test: true,
            payload: payload
        })
            .then(resp => {
                if ( resp.status === 200 ){
                    setResponse(resp.data.response)
                    setData(resp.data.data)
                    setShowResponse(true)
                    setLoading(false)
                }
                else if (resp.status === 500) {
                    setResponse(JSON.parse(resp.data.message))
                    setShowResponse(true)
                    setLoading(false)
                }
                // console.log(response)
            })
            .catch((error) => {
                setResponse({ message: "An error occured while making the request please check the endpoint url and try again!" })
                setData({})
                setShowResponse(true)
            })
            .finally(() => {
                setLoading(false)
            })
    }


        const handleInputChange = (e, key) => {
        const { value } = e.target;
        setPayload((prevFormData) => ({
            ...prevFormData,
            [key]: value
        }));
        };

    const handleInputChange3 = (fieldName, value) => {
        setPayload((prevPayload) => ({
            ...prevPayload,
            [fieldName]: value,
        }));
    };


    return (
        <div>
            <ToastContainer />
            <Dashboardnav />
            <div className="container mx-auto flex flex-row">
                <div className="basis-1/4">
                    <Sidebar />
                </div>
                <div className="flex flex-col items-center w-full gap-5">
                    <div className="bg-violet-500 p-5 rounded shadow-md w-full flex flex-col md:flex-row justify-between items-center gap-2">
                        <div className="flex flex-col md:flex-row">
                            <Link to="/campaigns"
                                className="text-white p-2 hover:bg-white hover:rounded hover:text-slate-900 transition-all">
                                Campaigns
                            </Link>
                            <p className="p-2 text-white flex items-center"><FiArrowRight /></p>
                            <Link to={`/create-campaign/${buyer.campaign?.id}/`}
                                className="text-white p-2 hover:bg-white hover:rounded hover:text-slate-900 transition-all">
                                Campaign
                            </Link>

                            <p className="p-2 text-white flex items-center"><FiArrowRight /></p>
                            <Link to={`/edit-buyer/${buyerId?.id}/`}
                                className="text-white p-2 hover:bg-white hover:rounded hover:text-slate-900 transition-all">
                                Edit Buyer
                            </Link>
                            <p className="p-2 text-white flex items-center"><FiArrowRight /></p>
                            <Link to=""
                                className="text-slate-900 p-2 bg-white rounded hover:rounded hover:text-slate-900 transition-all">
                                Testing Buyer: {buyer.client?.name}
                            </Link>
                        </div>

                        <div
                            className="flex md:flex-row flex-col gap-3 md:my-0 items-center justify-center">

                            <button className="flex items-center justify-center mx-5 w-[170px] border rounded p-2 text-white hover:bg-blue-700 hover:border-0 font-bold transition-all"><BiSave className="text-xl" />Save</button>
                        </div>
                    </div>
                    {/*<textarea name="payload" id="" cols="30" rows="10" className="w-full rounded border p-5">*/}
                    <div className="w-full p-5 bg-white rounded">

                        {/*{renderFormFields()}*/}
                        {
                            dataObject &&
                            dataObject.payload &&
                            Object.entries(dataObject.payload).map(([key, value]) => (
                                <div key={key} className="w-full">
                                    <label htmlFor={key}>{key}</label>
                                    <input
                                        className="w-full border p-2 rounded outline-gray-500"
                                        type="text"
                                        // value={payload[key] || value}
                                        onChange={(e) => handleInputChange3(key, e.target.value)}
                                    />
                                </div>
                            ))}

                    

                    <button onClick={sendTestLead} className="w-full bg-green-500 p-3 my-7 text-white font-semibold rounded hover:bg-green-600 transition-all">

                        {
                            loading ?
                                <div className="flex items-center justify-center">
                                    <ThreeDots
                                        height="20"
                                        width="20"
                                        radius="5"
                                        color="#ffffff"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{}}
                                        wrapperClassName=""
                                        visible={true}
                                    />
                                </div>
                                : <div>Send</div>
                        }
                    </button>
                        {
                            showResponse === true ?
                                <div className="flex flex-col border border-blue-300 p-5 bg-gray-100 w-full rounded">
                                    {
                                        data?.status === "ACCEPTED" ?
                                            <div className="p-2 bg-green-600 w-[10%] rounded text-center text-white font-bold">ACCEPTED</div>
                                            : data?.status === "DUPLICATED" ?
                                                <div className="p-2 bg-amber-300 w-[10%] rounded text-center text-white-500 font-bold">DUPLICATED</div>
                                                : <div className="p-2 bg-red-500 w-[10%] rounded text-center text-white">REJECTED</div>
                                    }

                                    <div className="w-full text-md my-3">
                                        <pre className="bg-gray-200 p-2 border border-blue-300 rounded">Response: {response?.message}</pre>
                                        {
                                            data.response_log &&
                                            <pre className="bg-gray-200 border border-blue-300 p-2 rounded my-3">
                                                log: {JSON.stringify(JSON.parse(data?.response_log), null, 2)}</pre>
                                        }


                                    </div>
                                    {
                                        data.lead_id && (
                                            <div className="flex flex-col w-full text-md my-3">
                                                <p>Created at: {data.created_at}</p>
                                                <p>Updated at: {data.updated_at}</p>
                                                <p>Lead ID: {data.lead_id}</p>
                                            </div>
                                        )
                                    }

                                </div>
                                :
                                <div></div>

                        }
                    </div>
                </div>
            </div>
        </div>
    )
}