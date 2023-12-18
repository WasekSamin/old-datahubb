import React, { useRef } from "react";
import { useEffect, useState } from "react";
import Dashboardnav from "../../Components/Dashboard/dashboardnav";
import Sidebar from "../../Components/Dashboard/sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDeleteOutline } from "react-icons/md";
import { IoPencil } from "react-icons/io5";
import { Triangle, ColorRing } from "react-loader-spinner";
import { FiArrowRight } from "react-icons/fi";
import { BiSave } from "react-icons/bi";
import AuthUtils from "../Utils/AuthUtils";
import { TailSpin } from "react-loader-spinner";
import { Link, useParams } from "react-router-dom";
import API_ENDPOINTS from "../../config";
import { ThreeDots } from "react-loader-spinner";
import Select from "react-select";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";

export default function CreateCampaign() {
  const { http, token, logout } = AuthUtils();
  // loader
  const [loading, setLoading] = useState(false);

  const campaignId = useParams();
  const [campaign, setCampaign] = useState("");


  const [setModal, showModal] = useState(false);
  const [setModal2, showModal2] = useState(false);
  const [setModal3, showModal3] = useState(false);

  const [campaignName, setCampaignName] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  // field varialble and functions
  const [fields, setFields] = useState([])
  const [fieldDetails, setFieldDetails] = useState("")
  const [fieldName, setFieldName] = useState("")
  const [fieldType, setFieldType] = useState("")
  const [postStatus, setPostStatus] = useState("required")
  const [listValues, setListValues] = useState([]);

  // buyers
  const [buyers, setBuyers] = useState([]);
  // filters
  const [filters, setFilters] = useState([]);
  const [filterType, setFilterType] = useState("GLOBAL");
  const [key, setKey] = useState("");
  const [conditions, setConditions] = useState("EQUAL TO");
  const [value, setValue] = useState("");
  const [toggle, setToggle] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [toggleMove, setToggleMove] = useState(false);
  const [pingPostToggleMove, setPingPostToggleMove] = useState(false);
  const [reactSelectValue, setReactSelectValue] = useState([]);
  const [result, setResult] = useState("")
  const [formError, setFormError] = useState({
    errorId: -1, errorMsg: ""
  });

  const marginPercentageRef = useRef();
  const pingFieldRef = useRef();

  // error message state
  const [error, setError] = useState("")
  const [fieldTypeError, setFieldTypeError] = useState("")

  // filter activation
  const [activeFilter, setActiveFilter] = useState(false);

  const [campaignTitle, setCampaignTitle] = useState("");

  // updating campaign
  const handleCampaignUpdate = async () => {
    setFormError({
      errorId: -1, errorMsg: ""
    })

    let marginPercentage = "";

    if (pingPostToggleMove) {
      marginPercentage = marginPercentageRef.current?.value?.trim();

      if (marginPercentage === "") {
        showFormError({
          errorId: 1, errorMsg: "Margin Percentage is required!"
        });
        return;
      }
      if (reactSelectValue.length === 0) {
        showFormError({
          errorId: 2, errorMsg: "Please select a ping field!"
        });
        return;
      }
    }

    try {
      const response = await http.put(`/api/edit-campaign/${campaignId.id}/`, {
        campaign_title: campaignTitle,
        is_active: true,
        is_active_ping: pingPostToggleMove,
        margin_percentage: marginPercentage,
        ping_fields: reactSelectValue
      })

      if (response.status === 200) {
        toast.success("Campaign Updated!")
      }
      else {
        toast.error("Something went wrong")
      }
    } catch (error) {
      return error
    }
  }

  //   handling toggle loading
  const handleToogle = () => {
    setInterval(() => {
      setToggle(true);
    }, 700);
    setToggleLoading(true);
    setInterval(() => {
      setToggleLoading(false);
    }, 2000);
  };

  const getFields = async () => {
    http
      .get(`/api/fields/${campaignId.id}/`)
      .then((response) => {
        setFields(response.data.data);
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  const clearPostField = async () => {
    setFieldName("");
    setFieldType("");
    setPostStatus("required");
  }

  const showFormError = ({ errorId, errorMsg }) => {
    setFormError({
      errorId: errorId,
      errorMsg: errorMsg
    });

    if (errorId === 1) {
      marginPercentageRef.current?.focus();
    } else if (errorId === 2) {
      pingFieldRef.current?.focus();
    }
  }

  const handlePostFields = async () => {
    if (fieldName.length !== 0 &&
      fieldType &&
      postStatus.length !== 0) {
      await http
        .post(`/api/create-field/${campaignId.id}/`, {
          field_name: fieldName,
          field_type: fieldType,
          post_status: postStatus,
          field_visiblity: true,
          campaign: campaignId.id
        })
        .then((response) => {
          // setFields(response.data.data)
          toast.success('Field Added!', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          showModal(false);
          clearPostField();
          getFields();
          return response;
        })
        .catch((error) => {
          return error;
        });
    } else {
      setError("Field is required")
      setFieldTypeError("Field type is required")
    }
  };

  const handleFieldDelete = async (fieldId) => {
    await http.delete(`/api/delete-field/${fieldId}/`).then((response) => {
      getFields();
      toast.success("Removed");
      return response;
    });
  };

  const getSuppliers = async () => {
    setTimeout(async () => {
      await http
        .get(`/api/suppliers/${campaignId.id}/`)
        .then((response) => {
          setSuppliers(response.data.data);
        })
        .catch((error) => {
          return error;
        });
    }, 500);
  };

  const fetchCampaignDetails = async () => {
    await http
      .get(`/api/campaign-details/${campaignId.id}/`)
      .then((response) => {
        setCampaign(response.data.data);

        const { campaign_title, is_active_ping, ping_fields } = response.data.data;
        setCampaignTitle(campaign_title);
        setPingPostToggleMove(is_active_ping);
        ping_fields.map(async (pingFieldId) => {
          await http.get(`/api/fetch-field/${pingFieldId}/`)
            .then(res => {
              const { id, field_name } = res.data.data;
              setReactSelectValue(prevFields => [...prevFields, {
                value: id,
                label: field_name
              }])
            }).catch(err => {
              // console.log(err);
              return err;
            })
        })

        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  const handleFetchField = async (fieldId) => {
    await http
      .get(`/api/fetch-field/${fieldId}`)
      .then((response) => {
        showModal2(true);
        setFieldDetails(response.data.data);
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  const handleFieldPutRequest = async (fieldId) => {
    handleFetchField(fieldId);
    // console.log(fieldId);
    await http
      .put(`/api/edit-field/${fieldId}/`, {
        field_name: fieldName && fieldDetails.field_name,
        field_type: fieldType && fieldDetails.field_type,
        post_status: postStatus && fieldDetails.post_status,
        field_visiblity: true,
      })
      .then((response) => {
        getFields();
        showModal2(false);
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  const handleClose = () => {
    showModal(false);
  };

  const handeClose2 = () => {
    showModal2(false);
  };

  const handeClose3 = () => {
    showModal3(false);
  };

  // get all buyers by campaigns
  const getBuyers = async () => {
    await http
      .get(`/api/buyers/${campaignId.id}/`)
      .then((response) => {
        setBuyers(response.data.data);
        // toast.success("Data loaded")
        return response;
      })
      .catch((error) => {
        // toast.error("Server error")
        return error;
      });
  };

  const deleteSupplier = async (supplierId) => {
    await http
      .delete(`/api/delete-supplier/${supplierId}/`)
      .then((response) => {
        toast.success("Supplier removed");
        getSuppliers();
      })
      .catch((error) => {
        return error;
      });
  };

  const deleteBuyer = async (buyerId) => {
    await http
      .delete(`/api/delete-buyer/${buyerId}/`)
      .then((response) => {
        toast.success("Buyer removed");
        getBuyers();
      })
      .catch((error) => {
        return error;
      });
  };

  const getFilters = async () => {
    setLoading(true);
    await http
      .get(`/api/filters/${campaignId.id}/`)
      .then((response) => {
        setFilters(response.data.data);
        setInterval(() => {
          setLoading(false);
        }, 2000);

        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  const postFilter = async () => {
    if (!filterType) {
      toast.error("Please select Filter Type")
    }
    else if (!key) {
      toast.error("Please select key, It can't be empty!")
    }
    else if (!value) {
      toast.error("Value is required!")
    }
    else {
      const response = await http.post("/api/add-filter/", {
        campaign: campaignId.id,
        filter_type: filterType,
        key: key,
        conditions: conditions,
        value: value,
      });

      if (response.status === 200) {
        toast.success("Filter added");
        getFilters();

        setFilterType("");
        setKey("");
        setConditions("");
        setValue("");
      } else {
        toast.error("Something went wrong");
      }
    }

  };

  const deleteFilter = async (filterId) => {
    await http
      .delete(`/api/delete-filter/${filterId}/`)
      .then((response) => {
        toast.success("Filter removed");
        getFilters();
        return response;
      })
      .catch((error) => {
        toast.error("Something went wrong");
        return error;
      });
  };

  useEffect(() => {
    getSuppliers();
    getFields();
    fetchCampaignDetails();
    getBuyers();
    getFilters();

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

  const colors = [
    // { value: "red", label: "Red" },
    // { value: "blue", label: "Blue" },
    // { value: "yellow", label: "Yellow" },
    // { value: "green", label: "Green" },
    // { value: "orange", label: "Orange" },
    // { value: "violate", label: "Violate" },
  ];

  const colors2 = fields.map((field) => ({
    value: field.id,
    label: field.field_name,
  }));

  // console.log(colors2);

  return (
    <div>
      <ToastContainer />
      <Dashboardnav />
      <div className="container mx-auto flex flex-row">
        <div className="w-full basis-1/4">
          <Sidebar />
        </div>
        <div className="flex flex-col items-center w-full">
          <div className="bg-violet-500 p-5 rounded shadow-md w-full flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex flex-col md:flex-row">
              <Link
                to="/campaigns"
                className="text-white p-2 hover:bg-white hover:rounded hover:text-slate-900 transition-all"
              >
                Campaigns
              </Link>
              <p className="p-2 text-white flex items-center">
                <FiArrowRight />
              </p>
              <Link
                to={`/create-campaign/${campaignId.id}/`}
                className={`text-dark p-2 bg-white rounded text-slate-900`}
              >
                Create Campaign
              </Link>
            </div>

            <div className="flex md:flex-row flex-col gap-3 md:my-0 items-center justify-center">
              <Link
                to={`/supplier-api-docs/${campaignId.id}/`} target="_blank"
                className="text-center w-[170px] border rounded p-2 text-white hover:bg-blue-700 hover:border-0 font-bold transition-all"
              >
                Supplier API Docs
              </Link>
              <button onClick={handleCampaignUpdate} className="flex items-center justify-center mx-5 w-[170px] border rounded p-2 text-white hover:bg-blue-700 hover:border-0 font-bold transition-all">
                <BiSave className="text-xl" />
                Save
              </button>
            </div>
          </div>
          {/* campaign form start */}
          <div className="flex flex-col items-center justify-between w-full">
            <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
              <div className="flex items-center w-full gap-5">
                <label htmlFor="Campaign Name" className="w-full md:w-[200px]">
                  Campaign Name
                </label>

                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="rounded md:ml-7 border outline-violet-700 p-2 w-full md:w-[300px]"
                  placeholder="Enter campaign name"
                />
              </div>
              <div className="flex items-center w-full gap-5">
                {/*<label htmlFor="Campaign Name" className="w-full md:w-[200px]">*/}
                {/*  Public Name*/}
                {/*</label>*/}
                {/*<input*/}
                {/*  type="text"*/}
                {/*  defaultValue={campaign.public_name}*/}
                {/*  className="rounded md:ml-7 border outline-violet-700 p-2 w-full md:w-[300px]"*/}
                {/*  placeholder="Enter public name"*/}
                {/*/>*/}
              </div>
            </div>
            {/* supplier section */}
            <div className="w-full flex flex-col items-center justify-between bg-white shadow-md rounded">
              <div className="w-full p-4 flex flex-col md:flex-row md:items-center justify-between border-b-[3px]">
                <div className="flex items-center">
                  <p className="font-bold text-lg text-blue-600">SUPPLIERS</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center">
                  <input
                    type="text"
                    className="border p-2 mx-3 rounded outline-violet-700"
                    placeholder="Enter to search"
                  />
                  <Link
                    className="w-full bg-blue-400 p-2 rounded font-normal text-white"
                    to={`/create-supplier/${campaignId.id}/`}
                  >
                    Add Supplier
                  </Link>
                </div>
              </div>

              <div className="w-full flex items-center justify-between">
                {suppliers?.length !== 0 ? (
                  <div className="w-full">
                    <table className="min-w-full">
                      <thead className="border-b-2">
                        <tr>
                          <th className="text-sm p-4"></th>
                          <th className="text-sm p-4">ID</th>
                          <th className="text-sm p-4">SUPPLIER</th>
                          <th className="text-sm p-4">BUY PRICE</th>
                          <th className="text-sm p-4">LEADS CAP</th>
                          <th className="text-sm p-4">BUDGET CAP</th>
                          <th className="text-sm p-4">POSTED</th>
                          <th className="text-sm p-4">SOURCE</th>

                          {/*<th className="text-sm p-4">PROFIT</th>*/}
                          <th className="text-sm p-4">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers?.map((supplier) => (
                          <tr
                            className="bg-gray-100 border-b-[1px] text-center"
                            key={supplier.id}
                          >
                            <td className="p-3 text-sm font-semibold">
                              <input type="checkbox" />
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {supplier.id}
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {supplier.supplier_name}
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {
                                supplier.price === 0 ?
                                  <p>∞</p>
                                  : <p>$ {supplier.price}</p>
                              }

                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {
                                supplier.lead_volume_daily_cap === 0 &&
                                  supplier.lead_volume_weekly_cap === 0 &&
                                  supplier.lead_volume_monthly_cap === 0 ? (
                                  <p>∞</p>
                                ) : (
                                  <p>
                                    {supplier.lead_volume_daily_cap} | {supplier.lead_volume_weekly_cap} | {supplier.lead_volume_monthly_cap}
                                  </p>
                                )
                              }
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {
                                supplier.budget_daily_cap === 0 &&
                                  supplier.budget_weekly_cap === 0 &&
                                  supplier.budget_monthly_cap === 0 ? (
                                  <p>∞</p>
                                ) : (
                                  <p>
                                    {supplier.budget_daily_cap} | {supplier.budget_weekly_cap} | {supplier.budget_monthly_cap}
                                  </p>
                                )
                              }
                            </td>

                            <td className="p-3 text-sm font-semibold">
                              {supplier.total_request_sent}
                            </td>

                            <td className="p-3 text-sm font-semibold">
                              {
                                supplier.source === "INTERNAL" ? (
                                  <p className="bg-green-400 text-dark p-1 rounded-xl"> {supplier.source}</p>
                                ) : (
                                  <p className="bg-amber-400 text-dark p-1 rounded-xl"> {supplier.source}</p>
                                )
                              }

                            </td>
                            {/*<td className="p-3 text-sm font-semibold"></td>*/}
                            <td className="p-3 flex items-center justify-center text-sm font-semibold">
                              <button type="button">
                                <MdDeleteOutline
                                  onClick={() => deleteSupplier(supplier?.id)}
                                  className="text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50"
                                />
                              </button>
                              <Link
                                to={`/edit-supplier/${supplier.id}/`}
                                data-modal-toggle="authentication-modal"
                              >
                                <IoPencil className="mx-3 text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-5 flex items-center justify-center text-center font-bold text-gray-500 text-xl">
                    No Records Found
                  </div>
                )}
              </div>
            </div>

            {/* supplier section */}

            {/* Buyer section */}
            <div className="w-full p-7 bg-white rounded w-full mt-12 border-b-[3px] flex items-center justify-between">
              <div className="flex items-center">
                <p className="font-bold text-lg text-blue-700">BUYERS</p>
              </div>
              <div className="flex items-center">
                <Link
                  className="bg-blue-400 p-2 rounded font-normal text-white"
                  to={`/create-buyer/${campaignId.id}/`}
                >
                  Add Buyer
                </Link>
              </div>
            </div>

            {buyers.length === 0 ? (
              <div className="w-full bg-white text-left p-7 text-xl text-gray-600 font-bold shadow-md">
                No records found
              </div>
            ) : (
              <div className="w-full">
                <div className="w-full bg-white  rounded w-full flex items-center justify-between">
                  <div className="w-full">
                    <table className="w-full ">
                      <thead className="border-b-2">
                        <th className="text-sm p-4">ID</th>
                        <th className="text-sm p-4">BUYER NAME</th>
                        <th className="text-sm p-4">SELLING PRICE</th>
                        <th className="text-sm p-4">LEADS CAP</th>
                        <th className="text-sm p-4">BUDGET CAP</th>
                        {/*<th className="text-sm p-4">INGEST</th>*/}
                        <th className="text-sm p-4">TOTAL SELL</th>
                        <th className="text-sm p-4">ACTIONS</th>
                      </thead>
                      <tbody>
                        {buyers.map((buyer) => (
                          <tr
                            key={buyer.id}
                            className="border-b-[1px] border-l-[1px] border-r-[1px] cursor-pointer bg-gray-100 text-center shadow-md"
                          >
                            <td className="p-3 text-sm font-semibold">
                              {buyer.id}
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {buyer.buyer_name}
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              $ {buyer.price}
                            </td>
                            {buyer.lead_volume_daily_cap === 0 &&
                              buyer.lead_volume_weekly_cap === 0 &&
                              buyer.lead_volume_monthly_cap === 0 ? (
                              <td className="p-3 text-sm font-semibold">∞</td>
                            ) : (
                              <td className="p-3 text-sm font-semibold">
                                {buyer.lead_volume_daily_cap} |{" "}
                                {buyer.lead_volume_weekly_cap} |{" "}
                                {buyer.lead_volume_monthly_cap}
                              </td>
                            )}
                            {(buyer.budget_daily_cap === 0) &
                              (buyer.budget_monthly_cap === 0) &
                              (buyer.budget_monthly_cap === 0) ? (
                              <td className="p-3 text-sm font-semibold">∞</td>
                            ) : (
                              <td className="p-3 text-sm font-semibold">
                                {buyer.budget_daily_cap} |{" "}
                                {buyer.budget_weekly_cap} |{" "}
                                {buyer.budget_monthly_cap}
                              </td>
                            )}
                            <td className="p-3 text-sm font-semibold">
                              {buyer.total_sell}
                            </td>


                            <td className="p-3 flex items-center text-sm  justify-center font-semibold">
                              <button
                                onClick={() => deleteBuyer(buyer?.id)}
                                type="button"
                              >
                                <MdDeleteOutline className="text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50" />
                              </button>
                              <Link
                                to={`/edit-buyer/${buyer.id}/`}
                                data-modal-toggle="authentication-modal"
                              >
                                <IoPencil className="mx-3 text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* buyer section ends */}

            {/*  ping post section */}
            <div className="w-full p-7 bg-white border-b-4 rounded flex justify-between mt-12">
              <p className="font-semibold text-md text-blue-600">
                Ping Post Exchange Status
              </p>
              {/* toggle button */}
              <div className="flex">
                <label class="inline-flex relative items-center mr-5 cursor-pointer ">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={pingPostToggleMove}
                    readOnly
                  />
                  <div
                    onClick={() => setPingPostToggleMove(!pingPostToggleMove)}
                    className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                  ></div>
                </label>
                <span
                  className={`${pingPostToggleMove ? "text-green-500" : "text-slate-900"
                    }`}
                >
                  {pingPostToggleMove ? "On" : "Off"}
                </span>
              </div>
              {/* end toggle button */}
            </div>
            {/* End  ping post section */}

            {/* extended section if ping post is on */}
            {pingPostToggleMove && (
              <div className="w-full px-7 bg-white shadow-md rounded justify-between">
                {/* <div className="grid grid-cols-3 gap-8 py-10 border-b">
                  <div className="text-slate-700">
                    <p className="font-bold">
                      Ping Post Type{" "}
                      <span className="text-red-600 text-lg">*</span>
                    </p>
                    <p className="text-slate-500 font-semibold text-sm">
                      Please select the ping post exchange type
                    </p>
                  </div>

                  <div className="flex flex-col justify-baseline">
                    <div class="flex items-center ">
                      <input
                        id="pp-radio-1"
                        type="radio"
                        value=""
                        name="default-radio"
                        class="w-5 h-5"
                      />
                      <label
                        for="pp-radio-1"
                        class="ml-3 text-lg font-normal text-slate-700"
                      >
                        Exclusive
                      </label>
                    </div>

                    <p className="font-normal text-sm text-slate-500">
                      Lead will be sold exclusively to the heighest bidder
                    </p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div class="flex items-center ">
                      <input
                        id="pp-radio-2"
                        type="radio"
                        value=""
                        name="default-radio"
                        class="w-5 h-5"
                      />
                      <label
                        for="pp-radio-2"
                        class="ml-3 text-lg font-normal text-slate-700"
                      >
                        Shared
                      </label>
                    </div>

                    <p className="font-normal text-sm text-slate-500">
                      Leads can be sold to all specific buyers chosen by the
                      supplier
                    </p>
                  </div>
                </div> */}

                <div className="grid grid-cols-3 gap-8 py-10 border-b">
                  <div className="">
                    <div className="text-slate-700">
                      <p className="font-bold">
                        Default Margin{"  "}
                        <span className="text-red-600 text-lg">*</span>
                      </p>
                      <p className="text-slate-500 font-semibold text-sm">
                        Please select the ping post exchange type
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center">
                      <input
                        ref={marginPercentageRef}
                        type="text"
                        className="border-2 border-r-0 rounded rounded-r-none w-full p-2 focus:outline-none"
                        placeholder="Margin Percentage"
                      />
                      <p className="py-[0.6rem] px-4 bg-indigo-300 rounded-r">
                        %
                      </p>
                    </div>
                    {
                      formError.errorId === 1 && <p className="text-rose-600">{formError.errorMsg}</p>
                    }
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 py-10 border-b">
                  <div className="">
                    <div className="text-slate-700">
                      <p className="font-bold">
                        Required Fields{"  "}
                        <span className="text-red-600 text-lg">*</span>
                      </p>
                      <p className="text-slate-500 font-semibold text-sm">
                        Configure the PING fields
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <Select
                      ref={pingFieldRef}
                      options={colors2}
                      value={reactSelectValue}
                      placeholder="Select..."
                      onChange={setReactSelectValue}
                      isMulti
                      isSearchable
                      noOptionsMessage={() => "No match found."}
                      styles={{
                        multiValueRemove: (css) => ({
                          ...css,
                          ":hover": { background: "transparent" },
                        }),
                      }}
                    />
                    {
                      formError.errorId === 2 && <p className="text-rose-600">{formError.errorMsg}</p>
                    }
                  </div>
                </div>
              </div>
            )}
            {/* End extended section if ping post is on */}

            {/* campaign fields section */}
            <div className="w-full bg-white p-7 rounded shadow-md w-full mt-12 flex border-b-2 items-center justify-between">
              <div className="flex items-center">
                <p className="font-bold text-lg text-blue-600">
                  CAMPAIGN FIELDS
                </p>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => showModal(true)}
                  className="bg-blue-400 p-2 rounded font-normal text-white cursor-pointer"
                >
                  ADD FIELDS
                </button>
              </div>
            </div>
            <div className="w-full bg-white overflow-x-hidden rounded shadow-md w-full  flex items-center justify-between">
              <div className=" w-full">
                <table className="w-full ">
                  <thead className="border-b-2">
                    <th className="text-sm p-4">Field Name</th>
                    <th className="text-sm p-4">Field Type</th>
                    <th className="text-sm p-4">Status</th>
                    <th className="text-sm p-4">Field Visibility</th>
                    <th className="text-sm p-4">ACTIONS</th>
                  </thead>
                  <tbody>
                    {fields.map((field) => (
                      <tr
                        className="border-b-2 cursor-pointer bg-gray-100 text-center"
                        key={field.id}
                      >
                        <td className="p-3 text-sm font-semibold">
                          {field.field_name}
                        </td>
                        <td className="p-3 text-sm font-semibold">
                          {field.field_type}
                        </td>
                        <td className="p-3 text-sm font-semibold">
                          {field.post_status}
                        </td>
                        <td className="p-3 text-sm font-semibold">True</td>

                        <td className="p-3 flex items-center justify-center text-sm font-semibold">
                          <button onClick={() => handleFieldDelete(field.id)}>
                            <MdDeleteOutline className="text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50" />
                          </button>

                          {/* <button onClick={()=>handleFetchField(field.id)} data-modal-toggle="authentication-modal">
                                                <IoPencil className="mx-3 text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50" />
                                            </button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* campaign section ends */}

            {/* <ColorRing
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
                /> */}

            {/*  Filter section */}
            <div className="w-full bg-white p-7 rounded shadow-md w-full my-4 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between">
                <p className="font-bold text-blue-600 mx-4">FILTERS</p>
                <div className="flex items-center justify-between">
                  {toggle === false && filters.length === 0 ? (
                    <div onClick={handleToogle}>
                      {/* toggle button */}
                      <div className="flex">
                        <label class="inline-flex relative items-center mr-5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={toggleMove}
                            readOnly
                          />
                          <div
                            onClick={() => setToggleMove(!toggleMove)}
                            className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                          ></div>
                        </label>
                      </div>
                    </div>
                  ) : toggleLoading === true ? (
                    <ThreeDots
                      visible={true}
                      height="60"
                      width="60"
                      ariaLabel="blocks-loading"
                      wrapperStyle={{}}
                      wrapperClass="blocks-wrapper"
                      color="#111111"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => showModal3(true)}
                      className={`bg-blue-400 p-2 rounded font-normal text-white cursor-pointer`}
                    >
                      ADD FILTERS
                    </button>
                  )}

                  <div
                    className={`relative flex flex-col items-center justify-center  overflow-hidden ${toggle === true ? "hidden" : "block"
                      }`}
                  >

                  </div>
                </div>
              </div>

              {loading === false ? (
                <div className="w-full w-full flex items-center justify-between">
                  <div className="overflow-x-scroll md:overflow-auto w-full">
                    <table className="w-full m-3">
                      <thead className="border-b-2">
                        <th className="text-sm p-4">Created At</th>
                        <th className="text-sm p-4">Filter TYPE</th>
                        <th className="text-sm p-4">Key</th>
                        <th className="text-sm p-4">Condition</th>
                        <th className="text-sm p-4">Value</th>
                        <th className="text-sm p-4">Actions</th>
                      </thead>
                      <tbody>
                        {filters.map((filter) => (
                          <tr className="border-b-2 cursor-pointer bg-gray-100 text-center">
                            <td className="p-3 text-sm font-semibold">
                              {filter.created_at}
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {filter.filter_type}
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {filter.key}
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {filter.conditions}
                            </td>
                            <td className="p-3 text-sm font-semibold">
                              {filter.value}
                            </td>
                            {/*<td className="p-3 text-sm font-semibold"></td>*/}
                            <td className="+p-3 flex items-center justify-center text-sm font-semibold">
                              <button
                                type="button"
                                onClick={() => deleteFilter(filter?.id)}
                              >
                                <MdDeleteOutline className="text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50" />
                              </button>
                              <Link
                                to=""
                                data-modal-toggle="authentication-modal"
                              >
                                <IoPencil className="mx-3 text-3xl border p-1.5 bg-white rounded shadow-sm hover:bg-slate-50" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {filters.length === 0 ? (
                    <div className="p-5 text-xl text-gray-700 w-full">
                      No Filters Found
                    </div>
                  ) : (
                    <ThreeDots
                      height="80"
                      width="80"
                      radius="9"
                      color="#111111"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClassName=""
                      visible={true}
                    />
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* modal */}
      <div
        className={`fixed inset-0 ${setModal
          ? "bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
          : "hidden"
          }`}
      >
        <div className="bg-white p-2 rounded w-full md:w-[30%] flex flex-col items-start p-5">
          {/* <form action=""> */}
          <label htmlFor="FieldName">Field Name</label>
          <input
            type="text"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="Enter field name"
            className="w-full p-2 rounded border outline-blue-300 my-2"
          />
          {
            error ?
              <p className="text-rose-500">*{error}</p>
              : <p></p>
          }
          <label htmlFor="FieldName">Field Type</label>
          <select
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className="w-full p-2 border rounded outline-blue-300 my-2"
          >
            <option value="" selected>
              Select Type
            </option>
            <option value="text">Text</option>
            {/* <option value="list">List</option> */}
            <option value="date">Date & Time</option>
            <option value="integer">Integer</option>
            <option value="email">Email</option>
            <option value="postal code">Postal Code</option>
            <option value="zip code">Zip Code</option>
          </select>
          {
            fieldTypeError ?
              <p className="text-rose-500">*{fieldTypeError}</p>
              : <p></p>
          }

          <label htmlFor="FieldName">Status</label>
          <select
            value={postStatus}
            onChange={(e) => setPostStatus(e.target.value)}
            className="w-full p-2 rounded border outline-blue-300 my-2"
          >
            <option value="required">Required</option>
            <option value="optional">Optional</option>
          </select>

          <label htmlFor="FieldName">Field Visibility</label>
          <select
            name="field_name"
            className="w-full p-2 rounded border outline-blue-300 my-2"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          {fieldType === "list" ? (
            <div className="text-left w-full">
              <label htmlFor="FieldName">Values *</label>
              <input
                type="text"
                placeholder="Enter field name"
                className="w-full p-2 rounded border outline-blue-700 my-2"
              />
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex items-center w-full">
            <button
              onClick={handlePostFields}
              className="p-2 rounded bg-green-500 hover:bg-green-600 transition-all text-white font-bold w-full my-3"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded bg-red-400 text-white font-bold transition-all hover:bg-red-500 w-full my-3 mx-1"
            >
              Cancel
            </button>
          </div>

          {/* </form> */}
        </div>
      </div>
      {/* modal 2 */}
      <div
        className={`fixed inset-0 ${setModal2
          ? "bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
          : "hidden"
          }`}
      >
        <div className="bg-white p-2 rounded w-[30%] flex flex-col items-start p-5">
          {/* <form action=""> */}
          <label htmlFor="FieldName">Field Name</label>
          <input
            defaultValue={fieldDetails.field_name}
            type="text"
            onChange={(e) => setFieldName(e.target.value)}
            placeholder="Enter field name"
            className="w-full p-2 rounded border outline-blue-300 my-2"
          />

          <label htmlFor="FieldName">Field Type</label>
          <select
            onChange={(e) => setFieldType(e.target.value)}
            className="w-full p-2 border rounded outline-blue-300 my-2"
          >
            <option value="" selected>
              {fieldDetails.field_type}
            </option>
            <option value="text">Text</option>
            {/* <option value="list">List</option> */}
            <option value="date">Date & Time</option>
            <option value="integer">Integer</option>
            <option value="email">Email</option>
            <option value="postal code">Postal Code</option>
            <option value="zip code">Zip Code</option>
          </select>

          <label htmlFor="FieldName">Status</label>
          <select
            onChange={(e) => setPostStatus(e.target.value)}
            className="w-full p-2 rounded border outline-blue-300 my-2"
          >
            <option value={fieldDetails.post_status}>
              {fieldDetails.post_status}
            </option>
            <option value="required">Required</option>
            <option value="optional">Optional</option>
          </select>

          <label htmlFor="FieldName">Field Visibility</label>
          <select
            name="field_name"
            className="w-full p-2 rounded border outline-blue-300 my-2"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          {fieldType === "list" ? (
            <div className="text-left w-full">
              <label htmlFor="FieldName">Values *</label>
              <input
                type="text"
                placeholder="Enter field name"
                className="w-full p-2 rounded border outline-blue-700 my-2"
              />
            </div>
          ) : (
            <div></div>
          )}

          <div className="flex items-center w-full">
            <button
              onClick={postFilter}
              className="p-2 rounded bg-green-500 hover:bg-green-600 transition-all text-white font-bold w-full my-3"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handeClose2}
              className="p-2 rounded bg-red-400 text-white font-bold transition-all hover:bg-red-500 w-full my-3 mx-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* </form> */}
      {/* modal ends */}

      {/*modal 3*/}
      <div
        className={`fixed inset-0 ${setModal3
          ? "bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
          : "hidden"
          }`}
      >
        <div className="bg-white p-2 rounded w-[30%] flex flex-col items-start p-5">
          {/* <form action=""> */}
          <label htmlFor="FieldName">Filter Type</label>
          <select
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full p-2 rounded border outline-blue-300 my-2"
          >
            <option value="GLOBAL" selected>
              Global
            </option>
            <option value="SUPPLIER LEVEL">Supplier Level</option>
            <option value="BUYER LEVEL">Buyer Level</option>
          </select>

          <label htmlFor="FieldName">Key</label>
          <select
            onChange={(e) => setKey(e.target.value)}
            className="w-full p-2 border rounded outline-blue-300 my-2"
          >
            <option value="" selected>
              Select Key
            </option>
            <option value="campaign_id">Campaign Id</option>
            <option value="supplier_id">Supplier Id</option>
            {fields?.map((field) => (
              <option value={field.field_name}>{field.field_name}</option>
            ))}
          </select>

          <label htmlFor="FieldName">Condition</label>
          <select
            onChange={(e) => setConditions(e.target.value)}
            className="w-full p-2 rounded border outline-blue-300 my-2"
          >
            <option value="EQUAL TO" selected>
              Equal to
            </option>
            <option value="NOT EQUAL TO">Not Equal To</option>
            <option value="CONTAINS">Contains</option>
            <option value="HAS REGEX">Has Regex</option>
          </select>

          <label htmlFor="FieldName">Value</label>
          <input
            type="text"
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value"
            className="w-full p-2 rounded border outline-blue-300 my-2"
          />
          {/*{*/}
          {/*    fieldType === "list" ? (*/}
          {/*            <div className="text-left w-full">*/}
          {/*                <label htmlFor="FieldName">Values *</label>*/}
          {/*                <input type="text"*/}
          {/*                       placeholder="Enter field name" className="w-full p-2 rounded border outline-blue-700 my-2" />*/}
          {/*            </div>*/}


          <label htmlFor="FieldName">Output</label>
          <select onChange={(e) => setResult(e.target.value)} className="w-full p-2 rounded border outline-blue-300 my-2">
            <option value="ACCEPT LEADS" selected>Accept leads</option>
            <option value="REJECT LEADS">Reject leads</option>
          </select>
          {/*{*/}
          {/*    fieldType === "list" ? (*/}
          {/*            <div className="text-left w-full">*/}
          {/*                <label htmlFor="FieldName">Values *</label>*/}
          {/*                <input type="text"*/}
          {/*                       placeholder="Enter field name" className="w-full p-2 rounded border outline-blue-700 my-2" />*/}
          {/*            </div>*/}

          {/*        )*/}
          {/*        : (*/}
          {/*            <div></div>*/}
          {/*        )*/}
          {/*}*/}

          <div className="flex items-center w-full">
            <button
              onClick={postFilter}
              className="p-2 rounded bg-green-500 hover:bg-green-600 transition-all text-white font-bold w-full my-3"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handeClose3}
              className="p-2 rounded bg-red-400 text-white font-bold transition-all hover:bg-red-500 w-full my-3 mx-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
