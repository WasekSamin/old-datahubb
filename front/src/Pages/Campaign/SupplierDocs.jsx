import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import Dashboardnav from "../../Components/Dashboard/dashboardnav";
import { useParams } from "react-router-dom";
import AuthUtils from "../Utils/AuthUtils";
import axios from "axios";
import { LOGOUT_TIMEOUT } from "../Utils/baseConfig";

export default function SupplierDocs() {
  const {campaignId} = useParams();
  const [campaign, setCampaign] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [fields, setFields] = useState([]);
  const { http, token, logout } = AuthUtils();

  const fetchCampaign = async () => {
    await http
      .get(`/api/campaign-details/${campaignId.id}/`)
      .then((response) => {
        setCampaign(response.data.data);
        setSuppliers(response.data.data.suppliers);
        setBuyers(response.data.data.buyers);
        setFields(response.data.data.fields);
        return response;
      })
      .catch((error) => {
        return error;
      });
  };

  const jsonExm = {
    campaign_id: "Campaign Id",
    payload: {
      firstName: "legal",
      lastName: "claim",
      email: "legalclaim1@gmail.com",
      phone: "23444322345",
      state: "CA",
    },
  };

  const successStatus = {
    test: true,
    success: true,
    payload: {
      firstName: "John",
      lastName: "Doe",
      email: "sd5d32@gmail.com",
      phone: "23453s6a34xc7845823234756",
      debt_amount: "233",
      state: "CA",
    },
    response: true,
    data: {
      id: 59,
      created_at: "2023-11-05",
      updated_at: "2023-11-05",
      lead_id: "6bebf830-6796-477f-bb04-f7eef2ccf2d9",
      payload:
        "{'firstName': 'John', 'lastName': 'Doe', 'email': 'sd5d32@gmail.com', 'phone': '23453s6a34xc7845823234756', 'debt_amount': '233', 'state': 'CA'}",
      is_test: true,
      status: "ACCEPTED",
      ping_status: null,
      response_log:
        '{"success":true,"data":{"id":32,"created_at":"2023-11-05","updated_at":"2023-11-05","debt_amount":"233","firstName":"miaw","lastName":"miaw 24","email":"sd5d32@gmail.com","phone":"23453s6a34xc7845823234756","state":"CA"}}',
      ping_response_log: null,
      campaign: 1,
    },
  };

  const duplicatedStatus = {
    test: true,
    success: true,
    payload: {
      firstName: "John",
      lastName: "Doe",
      email: "sd5d32@gmail.com",
      phone: "23453s6a34xc7845823234756",
      debt_amount: "233",
      state: "CA",
    },
    response: false,
    data: {
      id: 60,
      created_at: "2023-11-05",
      updated_at: "2023-11-05",
      lead_id: "9b4cd44a-cd3a-4af3-9f1c-88fb2220531b",
      payload:
        "{'firstName': 'John', 'lastName': 'Doe', 'email': 'sd5d32@gmail.com', 'phone': '23453s6a34xc7845823234756', 'debt_amount': '233', 'state': 'CA'}",
      is_test: true,
      status: "DUPLICATED",
      ping_status: null,
      response_log:
        '{"success":false,"message":"UNIQUE constraint failed: app_debtrelief.phone"}',
      ping_response_log: null,
      campaign: 1,
    },
  };

  const rejectedStatus = {
    test: true,
    success: true,
    payload: {
      firstName: "John",
      lastName: "Doe",
      email: "sd5d32@gmail.com",
      phone: "23453s6a34xc7845823234756",
      debt_amount: "233",
    },
    response: false,
    data: {
      id: 61,
      created_at: "2023-11-05",
      updated_at: "2023-11-05",
      lead_id: "5e356a0f-360a-4d93-a3d9-fab95ce5e4f4",
      payload:
        "{'firstName': 'John', 'lastName': 'Doe', 'email': 'sd5d32@gmail.com', 'phone': '23453s6a34xc7845823234756', 'debt_amount': '233'}",
      is_test: true,
      status: "REJECTED",
      ping_status: null,
      response_log:
        '{"success":false,"message":"NOT NULL constraint failed: app_debtrelief.state"}',
      ping_response_log: null,
      campaign: 1,
    },
  };

  //   const jsonExample = JSON.stringify(jsonExm, null, 2);

  useEffect(() => {
    fetchCampaign();

    // // Auto logout user
    // const logoutTimeout = setTimeout(() => {
    //   if (token) {
    //     localStorage.clear();
    //     logout();
    //   }
    // }, LOGOUT_TIMEOUT)

    // return () => {
    //   clearTimeout(logoutTimeout);
    // }
  }, []);
  return (
    <div>
      <ToastContainer />
      {/* <Dashboardnav /> */}
      <div className="flex flex-col py-12">
        <div className="w-full bg-white p-5 container max-w-[1450px] mx-auto rounded shadow-md">
          <div className="w-full flex flex-col items-start justify-between">
            <h1 className="text-4xl font-semibold text-slate-700 mb-3">
              Supplier Api Docs
            </h1>
            {/* <h2 className="font-bold text-3xl my-[2rem]">{campaign.campaign_title}</h2> */}
          </div>
          <div className="w-full font-normal text-gray-600 my-[0.1rem]">
            <p>
              These instructions describe how to post leads to AffiMedia's
              campaign and understand what to expect in response.
            </p>
          </div>

          <div className="mt-[72px]">
            <p className="text-3xl font-normal text-slate-700 mb-6">
              Direct Post
            </p>
            <table className="w-full text-slate-700">
              <tr className="border">
                <td className="border p-2 ">Post URL</td>
                <td className="p-2 font-normal">
                  https://api.datahubb.io/api/ingest/
                </td>
              </tr>

              <tr className="border">
                <td className="border p-2">Request Method</td>
                <td className="border p-2 font-normal">
                  {" "}
                  POST or GET are supported. We strongly recommend using POST.
                </td>
              </tr>
            </table>
          </div>

          <div className="w-full my-[72px]">
            <p className="text-3xl font-normal text-slate-700 mb-6">
              Posting Fields
            </p>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr className="border ">
                  <td className="p-4 text-gray-600 border">Field Name</td>
                  <td className="p-4 text-gray-600 border">Field Type</td>
                  <td className="p-4 text-gray-600 border">Post Status</td>
                </tr>
              </thead>
              <tbody>
                {fields?.map((field) => (
                  <tr className="border ">
                    <td className="p-4 border text-slate-500 font-normal text-sm">
                      {field.field_name}
                    </td>
                    <td className="p-4 border text-slate-500 font-normal text-sm">
                      {field.field_type}
                    </td>
                    <td className="p-4 border text-slate-500 font-normal text-sm">
                      {field.post_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-col items-center gap-5 w-full bg-gray-100 border mt-[72px] p-5">
              <div className="w-full">
                <h2>API ENDPOINT:</h2>{" "}
                <span className="font-bold text-blue-800">
                  https://api.datahubb.io/api/ingest/
                </span>
              </div>
              <div className="w-full">
                <h2 className="text-lg">Json Example</h2>
                {/* <p className="text-lg w-[100%]">{jsonExample}</p> */}
                <pre>{JSON.stringify(jsonExm, null, 2)}</pre>
              </div>
            </div>

            {/* response */}
            <div className="mt-[72px]">
              <p className="text-3xl font-normal text-slate-700 mb-2">
                Post Responses
              </p>
              <p className="w-full font-normal text-gray-600">
                When a lead is posted, you will get a real-time response in JSON
                format.
              </p>

              <table className="w-full border">
                <tr className="w-full border">
                  <td className="w-[10%] p-2  flex">Success</td>
                  <td className="p-2">
                    <div className="font-mono text-sm  w-[250px] sm:w-[450px] md:w-[550px] lg:w-[750px] xl:w-[1000px] overflow-x-auto bg-gray-100 p-2 border text-normal">
                      <pre>{JSON.stringify(successStatus, null, 2)}</pre>
                    </div>
                  </td>
                </tr>

                <tr className="w-full border">
                  <td className="w-[10%] p-2  flex">Duplicated</td>
                  <td className="p-2">
                    <div className="font-mono text-sm  w-[250px] sm:w-[450px] md:w-[550px] lg:w-[750px] xl:w-[1000px] overflow-x-auto bg-gray-100 p-2 border text-normal">
                      <pre>{JSON.stringify(duplicatedStatus, null, 2)}</pre>
                    </div>
                  </td>
                </tr>

                <tr className="w-full border">
                  <td className="w-[10%] p-2  flex">Rejected</td>
                  <td className="p-2">
                    <div className="font-mono text-sm  w-[250px] sm:w-[450px] md:w-[550px] lg:w-[750px] xl:w-[1000px] overflow-x-auto bg-gray-100 p-2 border text-normal">
                      <pre>{JSON.stringify(rejectedStatus, null, 2)}</pre>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
