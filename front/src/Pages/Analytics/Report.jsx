import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../Components/Dashboard/sidebar";
import React from "react";
import DashboardNav from "../../Components/Dashboard/dashboardnav";
import { FaDownload } from "react-icons/fa";
import AuthUtils from "../Utils/AuthUtils";
import { ThreeDots } from "react-loader-spinner";
import { CSVDownload, CSVLink } from "react-csv";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";

function Report() {

  const { http, token, logout } = AuthUtils()
  const [loading, setLoading] = useState(false)
  const [campaigns, setCampaigns] = useState([])
  // taking empty states for filtering
  const [campaignId, setCampaignId] = useState("")
  const [toDate, setToDate] = useState("")
  const [fromDate, setFromDate] = useState("")

  // taking empty records state for all data
  const [data, setData] = useState([])
  const [supplier, setSupplier] = useState("")
  const [camp, setCamp] = useState("")
  const [buyer, setBuyer] = useState("")
  const [record, setRecord] = useState("")

  // fetching all campaigns
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

  // filtering report
  const handleRecord = async () => {
    setRecord("")
    setLoading(true)
    if (!campaignId) {
      toast.error("Please select campaign")
    }
    else if (!toDate) {
      toast.error("Please selct date to range")
    }
    else if (!fromDate) {
      toast.error("Please select date from range")
    }
    else {
      const response = await http.post("/api/report/", {
        campaign_id: campaignId,
        to_date: toDate,
        from_date: fromDate
      })
      if (response.status === 200) {
        setData(response.data.data)
        setCamp(response.data.campaign)
        setRecord(response.data)
        setSupplier(response.data.supplier)
        setBuyer(response.data.buyer)

        setTimeout(() => {
          setLoading(false)
        }, 1500)

        return response
      } else {
        toast.error("something went wrong!")
      }
    }
  }


  useEffect(() => {
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
          {/* section 1 */}
          <div className="w-full bg-white shadow-xl flex  justify-between p-2 md:p-5">
            <div className="font-normal text-sm  flex items-center md:w-[30%] md:text-md md:font-semibold lg:text-lg">
              <select name="campaigns" id="" className="border p-2 w-full"
                onChange={(e) => setCampaignId(e.target.value)}
              >
                <option value="" selected>Select Campaign</option>
                {
                  campaigns?.map((campaign) => (
                    <option value={campaign.id}>{campaign.campaign_title}</option>
                  ))
                }

                {/* <option value="">Campaign 3</option> */}
              </select>
            </div>

            <div className=" flex flex-col md:w-[30%]">
              <div className="text-sm  font-normal mb-3 flex flex-col md:text-md md:flex-row md:items-center md:gap-2 md:font-semibold lg:text-lg">
                <label htmlFor="from" className="md:w-[20%]">
                  From:
                </label>
                <input onChange={(e) => setFromDate(e.target.value)} type="date" name="from" className="border p-2 w-full" />
              </div>

              <div className="text-sm font-normal flex flex-col md:text-md md:flex-row md:items-center md:gap-2 md:font-semibold lg:text-lg">
                <label htmlFor="from" className="md:w-[20%]">
                  To:
                </label>
                <input onChange={(e) => setToDate(e.target.value)} type="date" name="from" className="border p-2 w-full" />
              </div>
            </div>

            <div className="text-sm flex flex-col items-center justify-center gap-3 md:w-[30%] md:flex-row lg:text-lg ">
              <button onClick={handleRecord} className="p-3 bg-purple-600 rounded text-white">
                Generate
              </button>
              {
                data.length !== 0 ?
                  <button className="px-2 py-3 bg-slate-700 rounded text-white">
                    <CSVLink data={data} target="_blank">
                      <FaDownload className="inline-block text-[10px] " /> Export all
                    </CSVLink>



                  </button>
                  : <div></div>
              }

            </div>
          </div>
          {/* End section 1 */}

          {
            loading == true ?
              <div>
                {
                  supplier === "" ? <div></div> : <div>
                    <ThreeDots
                      color="#111111"
                    />
                  </div>
                }

              </div>
              :
              data.length !== 0 ?
                <div className="w-full">
                  <div className="w-full flex justify-between">
                    <div className="flex flex-col w-full gap-8 md:flex-row md:items-center md:justify-between">

                      {/* <div className="flex items-center justify-between md:w-[100%]">
                  <div>
                    <p className="text-center">{totalPosted}</p>
                    <p className="text-blue-500">Posted</p>
                  </div>
                  <div>
                    <p className="text-center">{totalAccepted}</p>
                    <p className="text-green-500">Accepted</p>
                  </div>
                  <div>
                    <p className="text-center">{totalRejected}</p>
                    <p className="text-red-500">Total Rejected</p>
                  </div>
                  <div>
                    <p className="text-center">{totalDuplicated}</p>
                    <p className="text-amber-500">Duplicated</p>
                  </div>
                </div> */}
                    </div>
                  </div>

                  <div className="w-full bg-white shadow-xl justify-between p-2 md:p-5 my-5">
                    {/* top */}
                    <div className="border-b w-full pb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] bg-cyan-600 px-1 rounded text-white mt-1">
                            ID: {camp?.id}
                          </p>
                          <p className="text-xl text-slate-700">{camp.campaign_title}</p>
                        </div>

                        <div className="flex gap-16">
                          {/* <div>
                  <p>${profit}</p>
                  <p className="text-sm">Profit</p>
                </div> */}
                          <div>
                            <p>{camp.total_posted}</p>
                            <p className="text-sm text-blue-600">Total Posted</p>
                          </div>
                          <div>
                            <p>{camp.total_accepted}</p>
                            <p className="text-sm text-green-600">Accepted</p>
                          </div>
                          <div>
                            <p>{camp.total_duplicated}</p>
                            <p className="text-sm text-amber-600">Duplicated</p>
                          </div>
                          <div>
                            <p>{camp.total_rejected}</p>
                            <p className="text-sm text-red-600">Errors</p>
                          </div>
                        </div>

                        {/* <div className="flex gap-3">
                <button className="border-2 rounded px-4 py-1">Edit</button>
                <button className="border-2 rounded px-4 py-1">Export</button>
              </div> */}
                      </div>
                    </div>
                    {/* end top */}

                    {/* middle */}
                    <div className="border-b w-full py-6">
                      <div>
                        <p className="text-gray-600 text-lg mb-4">Suppliers</p>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Name</p>
                            <p className="ml-5">{supplier.supplier_name}</p>
                          </div>

                          <div className="flex gap-8 text-gray-500">
                            <div>
                              <p>Requests</p>
                              <p className="text-blue-500">{supplier.total_request_sent}</p>
                            </div>
                            {/* <div>
                    <p>Accepted</p>
                    <p className="text-green-500">{totalAccepted}</p>
                  </div>
                  <div>
                    <p>Duplicated</p>
                    <p className="text-amber-500">{totalDuplicated}</p>
                  </div>
                  <div>
                    <p>Errors</p>
                    <p className="text-red-500">{totalRejected}</p>
                  </div> */}
                            {/* <div>
                    <p>Profit</p>
                    <p className="text-slate-800">$0.00</p>
                  </div> */}
                            <div>
                              <p>Turn Over</p>
                              <p className="text-slate-800">${record.turn_over}</p>
                            </div>
                            {/* <div>
                    <p>Total sell</p>
                    <p className="text-slate-800">$0.00</p>
                  </div> */}
                            <div>
                              <p>Profit</p>
                              <p className="text-slate-800">${record.profit}</p>
                            </div>
                            <div>
                              <p>Margin</p>
                              <p className="text-slate-800">{record.margin}%</p>
                            </div>
                            <div>
                              <p>Avg buy</p>
                              <p className="text-slate-800">${record.supplier_avg_sell}</p>
                            </div>
                            <div>
                              <p>Avg sell</p>
                              <p className="text-slate-800">${record.supplier_avg_sell}</p>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end middle */}

                    {/* bottom */}
                    <div className=" w-full py-6">
                      <div>
                        <p className="text-gray-600 text-lg mb-4">Buyers</p>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500 mb-2">Name</p>
                            <p className="ml-5">{buyer.buyer_name}</p>
                          </div>

                          <div className="flex gap-16 text-gray-500">
                            {/* <div>
                    <p>Eligible Requests</p>
                    <p className="text-slate-800">{buyer.total_sell}</p>
                  </div> */}
                            <div>
                              <p>Received</p>
                              <p className="text-blue-500">{buyer.total_sell}</p>
                            </div>
                            <div>
                              <p>Accepted</p>
                              <p className="text-green-500">{buyer.total_accepted}</p>
                            </div>
                            <div>
                              <p>Duplicated</p>
                              <p className="text-amber-500">{buyer.total_duplicated}</p>
                            </div>
                            <div>
                              <p>Errors</p>
                              <p className="text-red-500">{buyer.total_rejected}</p>
                            </div>
                            <div>
                              <p>Total Sell</p>
                              <p className="text-slate-800">${record.buyer_total_sell}</p>
                            </div>
                            <div>
                              <p>Avg Sell</p>
                              <p className="text-slate-800">${buyer.price}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End bottom */}
                  </div>
                </div> : <div></div>
          }




        </div>
        {/* End body */}
      </div>
    </div>
  );
}

export default Report;
