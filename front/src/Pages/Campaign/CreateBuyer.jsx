import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Dashboardnav from "../../Components/Dashboard/dashboardnav";
import Sidebar from "../../Components/Dashboard/sidebar";
import { FiArrowRight } from "react-icons/fi";
import { BiSave } from "react-icons/bi";
import AuthUtils from "../Utils/AuthUtils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { BiPlusMedical } from "react-icons/bi";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import "../../assets/css/CreateBuyer.css";


export default function CreateBuyer() {
  const { http, token, logout } = AuthUtils();
  const navigate = useNavigate();
  const campaignId = useParams();

  const [loading, isLoading] = useState(false);
  const [clients, setClient] = useState([]);
  const [buyerName, setBuyerName] = useState("");

  const [clnt, setClnt] = useState("");
  const [campaign, setCampaign] = useState("");
  const [leadVolumeDailyCap, setLeadVolumeDailyCap] = useState(0);
  const [leadVolumeWeeklyCap, setLeadVolumeWeeklyCap] = useState(0);
  const [leadVolumeMonthlyCap, setLeadVolumeMonthlyCap] = useState(0);
  const [budgetDailyCap, setBudgetDailyCap] = useState(0);
  const [budgetWeeklyCap, setBudgetWeeklyCap] = useState(0);
  const [budgetMonthlyCap, setBudgetMonthlyCap] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [pingUrl, setPingUrl] = useState("")
  const [requestMethod, setRequestMethod] = useState("");
  const [payloadType, setPayloadType] = useState("");
  const [body, setBody] = useState("");
  const [pingBody, setPingBody] = useState("");
  const [headers, setHeaders] = useState([]);
  const [responseType, setResponseType] = useState("");
  const [price, setPrice] = useState("");
  const [acceptedCondition, setAcceptedCondition] = useState("");
  const [acceptedConditionKey, setAcceptedConditionKey] = useState("");
  const [acceptedConditionValue, setAcceptedConditionValue] = useState("");
  const [duplicateCondition, setDuplicateCondition] = useState("");
  const [duplicateKey, setDuplicateKey] = useState("");
  const [duplicateValue, setDuplicateValue] = useState("");
  const [timezone, setTimezone] = useState("");

  const [timezones, setTimezones] = useState([]);



  // headers section
  const [sections, setSections] = useState([]);

  const addSection = () => {
    setSections([...sections, { key: "", value: "" }]);
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

  function ONCHANGE(e) {
    setBody(e.target.value);
  }

  const handleBuyerPost = async (e) => {
    if (!buyerName) {
      toast.error("Buyer name is required!")
    }
    else if (!timezone) {
      toast.error("Timezone is required!")
    }
    else if (!campaignId.id) {
      toast.error("Campaign id is empty!")
    }
    else if (!postUrl) {
      toast.error("Post url is required!")
    }
    else if (!requestMethod) {
      toast.error("Request method is required!")
    }
    else if (!deliveryMethod) {
      toast.error("Delivery method is required!")
    }
    else if (!payloadType) {
      toast.error("Payload type is required!")
    }
    else if (!price) {
      toast.error("Price is required!")
    }
    // else if( !responseType ) {
    //   toast.error("Response type is required!")
    // }
    // else if( !acceptedCondition ) {
    //   toast.error("Accepted condition is required!")
    // }
    else if (!acceptedConditionKey && acceptedConditionValue) {
      toast.error("Accepted condition key and value is required!!")
    }
    else if (duplicateCondition && duplicateKey && duplicateValue) {
      toast.error("Duplicate condition key and values are required!")
    }
    http
      .post("/api/create-buyer/", {
        // client_id: clnt,
        buyer_name: buyerName,
        campaign_id: campaignId.id,
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
        timezone: timezone,
      })
      .then((response) => {
        toast.success("Buyer saved!");
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  const getClients = async () => {
    isLoading(true);
    await http
      .get("/api/clients/")
      .then((response) => {
        setClient(response.data.data);
        isLoading(false);
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  const getTimezones = async () => {
    await http
      .get("/api/timezones/")
      .then((response) => {
        setTimezones(response.data.data);
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  useEffect(() => {
    getClients();
    getTimezones();

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


  const bodyOnChange = async (newValue) => {
    setBody(newValue);
  }

  const pingBodyOnChange = async (newValue) => {
    setPingBody(newValue);
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
              <a
                href="/campaigns"
                className="text-white p-2 hover:bg-white hover:rounded-xl hover:text-slate-900 transition-all"
              >
                Campaigns
              </a>
              <p className="p-2 text-white">
                <FiArrowRight />
              </p>
              <Link
                to={`/create-campaign/${campaignId.id}/`}
                className={`text-dark p-2 rounded-xl text-white`}
              >
                Create Campaign
              </Link>
              <p className="p-2 text-white">
                <FiArrowRight />
              </p>
              <a
                href="/create-supplier"
                className={`text-dark p-2 bg-white rounded-xl text-slate-900 mx-3`}
              >
                Add Buyer
              </a>
            </div>

            <div
              onClick={handleBuyerPost}
              className="flex items-center text-white
                             border p-1.5 w-[120px] justify-center transition-all
                              rounded cursor-pointer hover:bg-white hover:text-blue-700 font-semibold"
            >
              <BiSave className="text-xl" />
              <button className="">Save</button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between w-full">
            <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex items-center justify-between">
              <div className="flex items-center">
                <label htmlFor="Campaign Name" className="w-[]">
                  Enter Buyer Name
                </label>
                <input
                  placeholder="Enter buyer name"
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="rounded ml-7 border outline-blue-200 p-2 w-[300px]"
                />

              </div>

              <div className="flex items-center">
                <label htmlFor="Campaign Name" className="w-[]">
                  Select Timezone
                </label>
                <select
                  required
                  onChange={(e) => setTimezone(e.target.value)}
                  className="rounded ml-7 border outline-blue-200 p-2 w-[300px]"
                >
                  <option value="" selected>
                    Select Timezone
                  </option>
                  {timezones?.map((tz) => (
                    <option value={tz.id}>{tz.timezone_title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex items-center justify-between">
              <div className="flex items-center">
                <p className="font-bold">PRICING</p>
              </div>
              <div className="flex items-center bg-gray">
                <span className="border p-2 font-bold">
                  ${" "}
                  <input
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                    className="outline-none rounded"
                    placeholder="Set default price.."
                  />
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
                  <input
                    type="number"
                    onChange={(e) => {
                      setLeadVolumeDailyCap(e.target.value);
                    }}
                    className="outline-none rounded"
                    placeholder="Set daily cap"
                  />
                </span>
              </div>
              <div className="flex items-center">
                <p className="font-bold">Weekly Cap</p>
              </div>
              <div className="flex items-center bg-gray mx-5">
                <span className="border p-2 font-bold">
                  <input
                    type="number"
                    onChange={(e) => setLeadVolumeWeeklyCap(e.target.value)}
                    className="outline-none rounded"
                    placeholder="Set weekly cap"
                  />
                </span>
              </div>
              <div className="flex items-center">
                <p className="font-bold">Monthly Cap</p>
              </div>
              <div className="flex items-center bg-gray mx-5">
                <span className="border p-2 font-bold">
                  <input
                    type="number"
                    onChange={(e) => setLeadVolumeMonthlyCap(e.target.value)}
                    className="outline-none rounded"
                    placeholder="Set monthly cap"
                  />
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
                  <input
                    type="number"
                    onChange={(e) => setBudgetDailyCap(e.target.value)}
                    className="outline-none rounded"
                    placeholder="Set daily budget"
                  />
                </span>
              </div>
              <div className="flex items-center">
                <p className="font-bold">Weekly Cap</p>
              </div>
              <div className="flex items-center bg-gray mx-5">
                <span className="border p-2 font-bold">
                  <input
                    type="number"
                    onChange={(e) => setBudgetWeeklyCap(e.target.value)}
                    className="outline-none rounded"
                    placeholder="Set weekly budget"
                  />
                </span>
              </div>
              <div className="flex items-center">
                <p className="font-bold">Monthly Cap</p>
              </div>
              <div className="flex items-center bg-gray mx-5">
                <span className="border p-2 font-bold">
                  <input
                    type="number"
                    onChange={(e) => setBudgetMonthlyCap(e.target.value)}
                    className="outline-none rounded"
                    placeholder="Set monthly budget"
                  />
                </span>
              </div>
            </div>

            <div className="my-5 w-full bg-white rounded shadow-md flex flex-col items-start p-7">
              <div className="border-b-[1px] w-full">
                <h2 className="text-xl text-left my-2"> DELIVERY METHOD</h2>
              </div>

              <div className="w-full flex items-center justify-center bg-gray-50 gap-5 p-3">
                <select
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  className="w-full border p-2.5 rounded border-gray-600"
                >
                  <option value="">Select Delivery Method</option>
                  <option value="DIRECT POST">Direct Post</option>
                  <option value="PING POST">Ping/Post</option>
                  {/* <option value="EMAIL LEADS">Email Leads</option> */}
                  <option value="STORE LEADS">Store Leads</option>
                </select>
              </div>

              <div className="w-full border border-blue-500 p-5 my-7 flex flex-col gap-y-2">
                {
                  deliveryMethod === "PING POST" && (
                    <>
                      <input
                        onChange={(e) => setPingUrl(e.target.value)}
                        type="text" className="border border-gray-400 w-[100%] rounded p-2" placeholder="PING URL *" />
                      <div className="w-full my-3">
                        <h2 className="text-left">
                          Body: choose from your campaign fields or our system fields.
                          If you would like to transform your data, you can apply
                          these transformers
                        </h2>
                        <div className="relative w-full p-1">
                          {/* <textarea
                      onChange={(e) =>
                        JSON.stringify(setBody(e.target.value), undefined, 2)
                      }
                      className="w-full border rounded
                                outline-none border-blue-300 my-3
                                p-3 font-bold leading-relaxed text-md transition-all"
                      name="" id="" cols="30" rows="10"
                    ></textarea> */}
                          <AceEditor
                            mode="json"
                            theme="github"
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
                  <input
                    onChange={(e) => setPostUrl(e.target.value)}
                    type="text"
                    className="border border-gray-400 w-[60%] rounded p-2"
                    placeholder="POST URL *"
                  />
                  <select
                    onChange={(e) => setRequestMethod(e.target.value)}
                    className="border border-gray-400 w-[20%] p-2 rounded"
                  >
                    <option value="" selected>
                      Select Type*
                    </option>
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                  </select>
                  <select
                    onChange={(e) => setPayloadType(e.target.value)}
                    className="border border-gray-400 w-[20%] p-2 rounded"
                  >
                    <option value="" selected>
                      Select Payload Type*
                    </option>
                    <option value="FORM">FORM</option>
                    <option value="JSON">JSON</option>
                    <option value="XML">XML</option>
                  </select>
                </div>
                <div className="w-full my-3">
                  <h2 className="text-left">
                    Body: choose from your campaign fields or our system fields.
                    If you would like to transform your data, you can apply
                    these transformers
                  </h2>
                  <div className="relative w-full p-1">
                    {/* <textarea
                      onChange={(e) =>
                        JSON.stringify(setBody(e.target.value), undefined, 2)
                      }
                      className="w-full border rounded
                                outline-none border-blue-300 my-3
                                p-3 font-bold leading-relaxed text-md transition-all"
                      name="" id="" cols="30" rows="10"
                    ></textarea> */}
                    <AceEditor
                      mode="json"
                      theme="github"
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
                  <h2 className="text-md font-semibold">Custom Headers</h2>
                  <div className="flex flex-col items-center gap-5">
                    <div className="flex items-cente justify-between gap-5 w-full">
                      <input
                        type="text"
                        value={"Content-Type"}
                        className="w-full border p-2 rounded outline-blue-700"
                      />
                      <input
                        type="text"
                        value={"application/json"}
                        className="w-full border p-2 rounded outline-blue-700"
                      />
                      <button>
                        <BsTrash className="text-2xl text-red-300 hover:text-red-500 transition-all" />
                      </button>
                      <button onClick={addSection}>
                        <BiPlusMedical className="text-2xl text-gray-500" />
                      </button>
                    </div>

                    <div className="my-5">
                      {sections.map((section, index) => (
                        <div
                          className="flex items-center justify-between gap-5 w-full my-5"
                          key={index}
                        >
                          <input
                            onChange={(e) => handleInputChange(index, e)}
                            type="text"
                            name="key"
                            placeholder="Enter key"
                            value={section.key}
                            className="w-full border p-2 rounded outline-blue-700"
                          />
                          <input
                            onChange={(e) => handleInputChange(index, e)}
                            type="text"
                            name="value"
                            placeholder="Enter value"
                            value={section.value}
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
                  <h2 className="text-center bg-blue-700 p-2 text-white font-normal rounded-full">
                    DIRECT POST — Response mapping
                  </h2>
                  <div className="flex items-center justify-between gap-5 w-full my-5">
                    <h2 className="font-semibold text-green-400">ACCEPTED</h2>
                    <select
                      onSelect={(e) => setAcceptedCondition(e.target.value)}
                      className="w-full border p-2.5 rounded outline-blue-700"
                    >
                      <option value="" selected>
                        Select Condition
                      </option>
                      <option value="KEY EQUALS WITH">Key equal with</option>
                      <option value="KEY CONTAINS">Key contains</option>
                      <option value="STATUS CODE">Status code</option>
                    </select>
                    <input
                      onChange={(e) => setAcceptedConditionKey(e.target.value)}
                      type="text"
                      placeholder="Enter Key"
                      className="w-full border p-2 rounded outline-blue-700"
                    />
                    <input
                      onChange={(e) =>
                        setAcceptedConditionValue(e.target.value)
                      }
                      type="text"
                      placeholder="Enter Value"
                      className="w-full border p-2 rounded outline-blue-700"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-5 w-full my-5">
                    <h2 className="font-semibold text-amber-400">DUPLICATE</h2>
                    <select
                      onSelect={(e) => setDuplicateCondition(e.target.value)}
                      className="w-full border p-2.5 rounded outline-blue-700"
                    >
                      <option value="" selected>
                        Select Condition
                      </option>
                      <option value="KEY EQUALS WITH">Key equal with</option>
                      <option value="KEY CONTAINS">Key contains</option>
                      <option value="STATUS CODE">Status code</option>
                    </select>
                    <input
                      onChange={(e) => setDuplicateKey(e.target.value)}
                      type="text"
                      placeholder="Enter Key"
                      className="w-full border p-2 rounded outline-blue-700"
                    />
                    <input
                      onChange={(e) => setDuplicateValue(e.target.value)}
                      type="text"
                      placeholder="Enter Value"
                      className="w-full border p-2 rounded outline-blue-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
