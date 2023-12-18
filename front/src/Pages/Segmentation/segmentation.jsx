import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../Components/Dashboard/sidebar";
import DashboardNav from "../../Components/Dashboard/dashboardnav";
import Select from 'react-select'
import AuthUtils from '../Utils/AuthUtils';
import { MdDeleteOutline } from "react-icons/md";
import { IoDownloadOutline } from "react-icons/io5";
import { LOGOUT_TIMEOUT } from '../Utils/baseConfig';




export default function Segmentation() {
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const handleModalClose = () => {
        setModal(false);
        console.log("clicked");
    };

    const handleModalClose2 = () => {
        setModal2(false);
        // console.log("clicked");
    };

    const [key, setKey] = useState("")
    const [operator, setOperator] = useState("EXACT EQUALS")
    const [valueType, setValueType] = useState("")
    const [logicValue, setLogicValue] = useState("")

    const { http, token, logout } = AuthUtils()

    const options = [
        { value: 'AL', label: 'Alabama' },
        { value: 'AK', label: 'Alaska' },
        { value: 'AZ', label: 'Arizona' },
        { value: 'AR', label: 'Arkansas' },
        { value: 'FL', label: 'Florida' },
        { value: 'CO', label: 'Colorado' },
        { value: 'CT', label: 'Connecticut' },
        { value: 'DE', label: 'Delaware' },
        { value: 'CA', label: 'California' },
        { value: 'GA', label: 'Georgia' },
        { value: 'HI', label: 'Hawaii' },
        { value: 'ID', label: 'Idaho' },
        { value: 'IL', label: 'Illinois' },
        { value: 'IN', label: 'Indiana' },
        { value: 'IA', label: 'Iowa' },
        { value: 'KS', label: 'Kansas' },
        { value: 'KY', label: 'Kentucky' },
        { value: 'LA', label: 'Louisiana' },
        { value: 'ME', label: 'Maine' },
        { value: 'MD', label: 'Maryland' },
        { value: 'MA', label: 'Massachusetts' },
        { value: 'MI', label: 'Michigan' },
        { value: 'MN', label: 'Minnesota' },
        { value: 'MS', label: 'Mississippi' },
        { value: 'MO', label: 'Missouri' },
        { value: 'MT', label: 'Montana' },
        { value: 'NE', label: 'Nebraska' },
        { value: 'NV', label: 'Nevada' },
        { value: 'NH', label: 'New Hampshire' },
        { value: 'NJ', label: 'New Jersey' },
        { value: 'NM', label: 'New Mexico' },
        { value: 'NY', label: 'New York' },
        { value: 'NC', label: 'North Carolina' },
        { value: 'ND', label: 'North Dakota' },
        { value: 'OH', label: 'Ohio' },
        { value: 'OK', label: 'Oklahoma' },
        { value: 'OR', label: 'Oregon' },
        { value: 'PA', label: 'Pennsylvania' },
        { value: 'RI', label: 'Rhode Island' },
        { value: 'SC', label: 'South Carolina' },
        { value: 'SD', label: 'South Dakota' },
        { value: 'TN', label: 'Tennessee' },
        { value: 'TX', label: 'Texas' },
        { value: 'UT', label: 'Utah' },
        { value: 'VT', label: 'Vermont' },
        { value: 'VA', label: 'Virginia' },
        { value: 'WA', label: 'Washington' },
        { value: 'WV', label: 'West Virginia' },
        { value: 'WI', label: 'Wisconsin' },
        { value: 'WY', label: 'Wyoming' }
    ];

    const handleLogicPost = async () => {
        const response = await http.post("/api/post-logic/", {
            logic_key: key,
            operator: operator,
            logic_value: logicValue
        })

        if (response.status === 201) {
            toast.success("Logic added")
            return response
        }
        else {
            toast.error("Something went wrong!")
        }
    }

    const [campaigns, setCampaigns] = useState([])

    const getCampaigns = async () => {
        await http.get("/api/campaigns")
            .then((response) => {
                setCampaigns(response.data.data)
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

    return (
        <div>
            <ToastContainer />
            <DashboardNav />
            <div className="container mx-auto flex flex-row ">
                {/* sidebar */}
                <div className="basis-1/4 hidden lg:block">
                    <Sidebar />
                </div>
                {/* body */}
                <div className="w-full flex flex-col items-center justify-start gap-5 p-1">
                    {/* generate and adding logic section */}
                    <div className="w-full flex items-center justify-end gap-4 text-white">
                        <button onClick={() => setModal2(true)} className="p-2 rounded bg-emerald-500 transition-all hover:bg-emerald-600">
                            Generate Segments
                        </button>
                        <button onClick={() => setModal(true)} className="p-2 rounded bg-violet-500 transition-all hover:bg-violet-600">
                            Create Logics
                        </button>
                    </div>

                    <div className="w-full bg-white rounded shadow-md my-7 p-5">
                        <table className="w-full p-2 rounded">
                            <thead>
                                <tr className="text-center border p-5">
                                    <th className="border p-2">CREATED AT</th>
                                    <th className="border p-2">SEGMENTATION ID</th>
                                    <th className="border p-2">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-center">
                                    <td className="border p-2">.</td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2 flex items-center gap-2" colSpan={1}>
                                        <button className="p-2 bg-blue-600 text-white rounded
                                        transition-all delay-100 hover:bg-blue-500">
                                            <IoDownloadOutline className="font-bold text-xl" />
                                        </button>
                                        <button
                                            className="p-2 bg-rose-600 transition-all delay-100
                                      hover:bg-rose-500 text-white rounded">
                                            <MdDeleteOutline className="font-bold text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* modal 1 */}
                    <div
                        className={`fixed inset-0 ${modal
                            ? "bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
                            : "hidden"
                            }`}
                    >
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
                                    Add Logics
                                </h3>
                                <div className="space-y-6">
                                    <select onChange={(e) => setKey(e.target.value)}

                                        className="w-full p-3 border rounded " id="">
                                        <option value="">Select Key</option>
                                        <option value="first_name">First Name</option>
                                        <option value="last_name">Last Name</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="city">City</option>
                                        <option value="state">State</option>
                                        <option value="campaign_id">Campaign Id</option>
                                        <option value="status">Status</option>
                                        <option value="custom">Custom Field</option>
                                    </select>
                                    {
                                        key === "custom" &&
                                        (
                                            <input
                                                type="text"
                                                className="w-full p-3 rounded"
                                                placeholder="Enter custom field name"

                                            />
                                        )
                                    }

                                    <select className="p-3 rounded w-full border"
                                        onChange={(e) => setOperator(e.target.value)}>
                                        <option value="EXACT EQUALS">Exact Equals</option>
                                        <option value="NOT EQUALS">Not Equals</option>
                                        <option value="CONTAINS">Contains</option>
                                        <option value="DOES NOT CONTAINS">Doesn't Contains</option>
                                        <option value="STARTS WITH">Starts With</option>
                                        <option value="ENDS WITH"> Ends With</option>
                                    </select>

                                    <select onChange={(e) => setValueType(e.target.value)} className="p-3 rounded w-full border">
                                        <option value="">Select Value Type</option>
                                        <option value="Text">Text</option>
                                        <option value="Number">Number</option>
                                        <option value="State">State</option>
                                    </select>

                                    {
                                        valueType === "Text" && (
                                            <input
                                                onChange={(e) => setLogicValue(e.target.value)}
                                                type="text"
                                                className="p-3 rounded w-full border"
                                                placeholder="Enter value"
                                            />
                                        )
                                    }

                                    {
                                        valueType === "Number" && (
                                            <input
                                                onChange={(e) => setLogicValue(e.target.value)}
                                                type="number"
                                                className="p-3 rounded w-full border"
                                                placeholder="Enter value"
                                            />
                                        )
                                    }

                                    {
                                        valueType === "State" && (
                                            <Select
                                                onChange={(e) => setLogicValue(e.target.value)}
                                                isMulti
                                                options={options}
                                            />
                                        )
                                    }

                                    {/* <button onClick={handleLogicPost}>Save Logic</button> */}



                                    <div>
                                    </div>
                                    <button
                                        onClick={handleLogicPost}
                                        type="button"
                                        className="w-full text-black bg-emerald-500 rounded p-2 text-white text-lg"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* modal 1 ends */}
                {/* modal 2 */}
                <div
                    className={`fixed inset-0 ${modal2
                        ? "bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
                        : "hidden"
                        }`}
                >
                    <div className="relative bg-white rounded-lg shadow w-[1200px]">
                        <button
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-800 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            data-modal-toggle="authentication-modal"
                            onClick={handleModalClose2}
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
                                Add Logics
                            </h3>
                            {/* contents goes here */}
                            <div className="space-y-6">
                                <div className="w-full flex flex-col items-center gap-5 overflow-y-auto">
                                    {
                                        campaigns.length !== 0 ?
                                            (
                                                <div className="w-full flex flex-col items-start gap-2">
                                                    <p className="text-xl font-bold">Campaign</p>
                                                    <div className="w-full flex items-center gap-2">
                                                        {
                                                            campaigns?.map((camp) => (
                                                                <div className="w-full flex items-center gap-2">
                                                                    <input type="checkbox" defaultValue={camp.id} className="p-2" />
                                                                    <p>{camp.campaign_title}</p>
                                                                </div>
                                                            ))
                                                        }

                                                    </div>

                                                </div>
                                            ) : (
                                                <div></div>
                                            )
                                    }


                                    <div className="w-full flex flex-col items-start gap-2">
                                        <p className="text-xl font-bold">Timeline</p>
                                        <div className="w-full flex items-center gap-2">
                                            <input type="checkbox" className="p-2" />
                                            <p>Last week</p>

                                            <input type="checkbox" className="p-2" />
                                            <p>Last month</p>

                                            <input type="checkbox" className="p-2" />
                                            <p>Last 2 month</p>
                                        </div>

                                    </div>
                                    <div className="w-full flex flex-col items-start gap-2">
                                        <p className="text-xl font-bold">Status</p>
                                        <div className="w-full flex items-center gap-2">
                                            <input type="checkbox" className="p-2" />
                                            <p>Accepted</p>

                                            <input type="checkbox" className="p-2" />
                                            <p>Duplicated</p>

                                            <input type="checkbox" className="p-2" />
                                            <p>Rejected</p>
                                        </div>
                                    </div>

                                    <div className="w-full flex flex-col items-start gap-2">
                                        <p className="text-xl font-bold">State</p>
                                        <div className="w-full flex flex-wrap items-center gap-2">
                                            <input type="checkbox" defaultValue="AL" className="p-2" />
                                            <p>Alabama</p>

                                            <input type="checkbox" defaultValue="AK" className="p-2" />
                                            <p>Alaska</p>

                                            <input type="checkbox" defaultValue="AZ" className="p-2" />
                                            <p>Arizona</p>

                                            <input type="checkbox" defaultValue="AR" className="p-2" />
                                            <p>Arkansas</p>

                                            <input type="checkbox" defaultValue="CA" className="p-2" />
                                            <p>California</p>

                                            <input type="checkbox" defaultValue="CO" className="p-2" />
                                            <p>Colorado</p>

                                            <input type="checkbox" defaultValue="CT" className="p-2" />
                                            <p>Connecticut</p>

                                            <input type="checkbox" defaultValue="DE" className="p-2" />
                                            <p>Delaware</p>

                                            <input type="checkbox" defaultValue="FL" className="p-2" />
                                            <p>Florida</p>

                                            <input type="checkbox" defaultValue="GA" className="p-2" />
                                            <p>Georgia</p>

                                            <input type="checkbox" defaultValue="HI" className="p-2" />
                                            <p>Hawaii</p>

                                            <input type="checkbox" defaultValue="ID" className="p-2" />
                                            <p>Idaho</p>

                                            <input type="checkbox" defaultValue="IL" className="p-2" />
                                            <p>Illinois</p>

                                            <input type="checkbox" defaultValue="IN" className="p-2" />
                                            <p>Indiana</p>

                                            <input type="checkbox" defaultValue="IA" className="p-2" />
                                            <p>Iowa</p>

                                            <input type="checkbox" defaultValue="KS" className="p-2" />
                                            <p>Kansas</p>

                                            <input type="checkbox" defaultValue="KY" className="p-2" />
                                            <p>Kentucky</p>

                                            <input type="checkbox" defaultValue="LA" className="p-2" />
                                            <p>Louisiana</p>

                                            <input type="checkbox" defaultValue="ME" className="p-2" />
                                            <p>Maine</p>

                                            <input type="checkbox" defaultValue="MD" className="p-2" />
                                            <p>Maryland</p>

                                            <input type="checkbox" defaultValue="MA" className="p-2" />
                                            <p>Massachusetts</p>

                                            <input type="checkbox" defaultValue="MI" className="p-2" />
                                            <p>Michigan</p>

                                            <input type="checkbox" defaultValue="MN" className="p-2" />
                                            <p>Minnesota</p>

                                            <input type="checkbox" defaultValue="MS" className="p-2" />
                                            <p>Mississippi</p>

                                            <input type="checkbox" defaultValue="MO" className="p-2" />
                                            <p>Missouri</p>

                                            <input type="checkbox" defaultValue="MT" className="p-2" />
                                            <p>Montana</p>

                                            <input type="checkbox" defaultValue="NE" className="p-2" />
                                            <p>Nebraska</p>

                                            <input type="checkbox" defaultValue="NV" className="p-2" />
                                            <p>Nevada</p>

                                            <input type="checkbox" defaultValue="NH" className="p-2" />
                                            <p>New Hampshire</p>

                                            <input type="checkbox" defaultValue="NJ" className="p-2" />
                                            <p>New Jersey</p>

                                            <input type="checkbox" defaultValue="NM" className="p-2" />
                                            <p>New Mexico</p>

                                            <input type="checkbox" defaultValue="NY" className="p-2" />
                                            <p>New York</p>

                                            <input type="checkbox" defaultValue="NC" className="p-2" />
                                            <p>North Carolina</p>

                                            <input type="checkbox" defaultValue="ND" className="p-2" />
                                            <p>North Dakota</p>

                                            <input type="checkbox" defaultValue="OH" className="p-2" />
                                            <p>Ohio</p>

                                            <input type="checkbox" defaultValue="OK" className="p-2" />
                                            <p>Oklahoma</p>

                                            <input type="checkbox" defaultValue="OR" className="p-2" />
                                            <p>Oregon</p>

                                            <input type="checkbox" defaultValue="PA" className="p-2" />
                                            <p>Pennsylvania</p>

                                            <input type="checkbox" defaultValue="RI" className="p-2" />
                                            <p>Rhode Island</p>

                                            <input type="checkbox" defaultValue="SC" className="p-2" />
                                            <p>South Carolina</p>

                                            <input type="checkbox" defaultValue="SD" className="p-2" />
                                            <p>South Dakota</p>

                                            <input type="checkbox" defaultValue="TN" className="p-2" />
                                            <p>Tennessee</p>

                                            <input type="checkbox" defaultValue="TX" className="p-2" />
                                            <p>Texas</p>

                                            <input type="checkbox" defaultValue="UT" className="p-2" />
                                            <p>Utah</p>

                                            <input type="checkbox" defaultValue="VT" className="p-2" />
                                            <p>Vermont</p>

                                            <input type="checkbox" defaultValue="VA" className="p-2" />
                                            <p>Virginia</p>

                                            <input type="checkbox" defaultValue="WA" className="p-2" />
                                            <p>Washington</p>

                                            <input type="checkbox" defaultValue="WV" className="p-2" />
                                            <p>West Virginia</p>

                                            <input type="checkbox" defaultValue="WI" className="p-2" />
                                            <p>Wisconsin</p>

                                            <input type="checkbox" defaultValue="WY" className="p-2" />
                                            <p>Wyoming</p>
                                        </div>

                                        {/* <div className="w-full flex flex-col items-start gap-2">
                                        <p className="text-xl font-bold">Status</p>
                                            <div className="w-full flex items-center gap-2">
                                                <input type="checkbox" className="p-2" />
                                                <p>Accepted</p>

                                                <input type="checkbox" className="p-2" />
                                                <p>Duplicated</p>

                                                <input type="checkbox" className="p-2" />
                                                <p>Rejected</p>
                                            </div>
                                    </div> */}
                                    </div>
                                </div>
                                <div>
                                </div>
                                <button
                                    onClick={handleLogicPost}
                                    type="button"
                                    className="w-full text-black bg-emerald-500 rounded p-2 text-white text-lg"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* modal 2 ends */}
                </div>

                {/* generate and adding logic section ends here */}
            </div>




        </div>

    )
}
