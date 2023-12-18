import React, { useEffect, useState } from "react";
import Navbar from "../../Components/navbar";
import Dashboardnav from "../../Components/Dashboard/dashboardnav";
import Sidebar from "../../Components/Dashboard/sidebar";
import AuthUtils from "../Utils/AuthUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";

function Dashboard() {
  const { logout, token } = AuthUtils()

  const [leads, setLeads] = useState([]);
  const { http } = AuthUtils();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [record, setRecord] = useState("");

  const getRecentLeads = async () => {
    setLoading(true);
    await http
      .get("/api/all-leads/")
      .then((response) => {
        setLeads(response.data.results);
        setInterval(() => {
          setLoading(false);
        }, 1500);
        return response;
      })
      .catch((error) => {
        return toast.error(error);
      });
  };

  const getRecord = async () => {
    setLoading(true);
    await http.get("/api/record").then((response) => {
      setRecord(response.data.data);
      setInterval(() => {
        setLoading(false);
      }, 1500);

      return response;
    });
  };

  useEffect(() => {
    getRecentLeads();
    getRecord();

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

  return (
    <div>
      <Dashboardnav />

      <div className="container mx-auto flex flex-row ">
        <div className="basis-1/4 hidden lg:block">
          <Sidebar />
        </div>
        <div className="flex flex-col basis-[100%] gap-7">
          {loading === false ? (
            <div className="boxes flex items-center justify-between bg-slate-200 p-5 shadow-lg rounded">
              <div className="flex flex-col items-center bg-white border w-[30%] mr-2 px-4 py-5 rounded shadow-md">
                <p className="text-lg font-semibold text-slate-700">
                  ${record.profit === 0 ? "0.00" : record.profit}
                </p>
                <h1 className="text-lg font-thin text-slate-500">PROFIT</h1>
              </div>
              <div className="flex flex-col items-center bg-white border w-[30%] mr-2 px-4 py-5 rounded shadow-md">
                <p className="text-lg font-semibold text-blue-700">
                  {record.total_ingested}
                </p>
                <h1 className="text-lg font-thin text-slate-500">POSTED</h1>
              </div>
              <div className="flex flex-col items-center bg-white border w-[30%] mr-2 px-4 py-5 rounded shadow-md">
                <p className="text-lg font-semibold text-green-700">
                  {record.total_accepted}
                </p>
                <h1 className="text-lg font-thin text-slate-500">ACCEPTED</h1>
              </div>
              <div className="flex flex-col items-center bg-white border w-[30%] mr-2 px-4 py-5 rounded shadow-md">
                <p className="text-lg font-semibold text-red-600">
                  {record.total_rejected}
                </p>
                <h1 className="text-lg font-thin text-slate-500">REJECTED</h1>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
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
            </div>
          )}

          {/*<div className="flex items-center justify-between">*/}
          {/*  <div className="my-5 text-2xl font-bold">RECENT LEADS</div>*/}
          {/*  <Link to="/leads" className="text-md font-bold text-blue-700">*/}
          {/*    Go To Leads*/}
          {/*  </Link>*/}
          {/*</div>*/}

          {/*<div className="table-content flex flex-row items-start justify-start my-2">*/}
          {/*  {leads.length !== 0 ? (*/}
          {/*    <table className="bg-white w-full shadow-md mr-5">*/}
          {/*      <thead>*/}
          {/*        <tr className="border-b-2">*/}
          {/*          <th className="p-3">Lead Id</th>*/}
          {/*          <th className="p-3">PAYLOAD</th>*/}
          {/*        </tr>*/}
          {/*      </thead>*/}
          {/*      <tbody>*/}
          {/*        {leads?.map((lead) => (*/}
          {/*          <tr*/}
          {/*            className="border-b-2 bg-slate-50 cursor-pointer"*/}
          {/*            key={lead.id}*/}
          {/*          >*/}
          {/*            <td className="p-3">{lead.lead_id}</td>*/}
          {/*            <td className="p-3">{lead.payload}</td>*/}
          {/*          </tr>*/}
          {/*        ))}*/}
          {/*      </tbody>*/}
          {/*    </table>*/}
          {/*  ) : leads === true ? (*/}
          {/*    <div className="flex items-center justify-center">*/}
          {/*      <ThreeDots*/}
          {/*        height="80"*/}
          {/*        width="80"*/}
          {/*        radius="9"*/}
          {/*        color="#111111"*/}
          {/*        ariaLabel="three-dots-loading"*/}
          {/*        wrapperStyle={{}}*/}
          {/*        wrapperClassName=""*/}
          {/*        visible={true}*/}
          {/*      />*/}
          {/*    </div>*/}
          {/*  ) : (*/}
          {/*    <div className="flex items-center justify-center">*/}
          {/*      No Records found*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
