import React from "react";
import Navbar from "../Components/navbar";
import dashboardImg from "../assets/dashboard.jpg";
import dash2 from "../assets/dash2.jpg";

function Home(){
    return (
        <div className={"h-full w-full"}>
            <Navbar/>

            <div className={"container mx-auto flex-col my-24 items-center justify-center text-center w-[700px]"}>
                <p className={"text-5xl font-bold text-slate-700"}>Powerful Lead Distribution Software</p>
                <br/>
                <small className={"text-2xl p-5 text-slate-500"}>Analyze, validate, filter, route and manage your leads.</small>
                <div className="flex items-center justify-center mr-5 my-6 ">
                    <a className={"cursor-pointer bg-indigo-600 p-2 rounded text-white mx-4 w-[200px] font-bold text-lg"}>Talk To An Expert</a>
                    <a className={"cursor-pointer border border-indigo-600 p-2 rounded text-slate-700 font-bold mx-4 w-[200px] text-lg hover:bg-indigo-600 hover:text-white"}>Start Your Free Trial</a>
                </div>




                {/*Features section starts here*/}



                {/*Features section ends here*/}
            </div>
            {/*dashboard image section starts here*/}

            <div className={"flex items-center justify-center"}>
                <img className={"h-full shadow-lg"} src={dashboardImg} alt=""/>
            </div>

            {/*dashboard image section ends here*/}

            {/*Features section starts here*/}

            <div className={"container mx-auto my-32 text-center w-[1300px]"}>
                <h1 className={"text-3xl font-bold"}>KEY FEATURES</h1>
                <div className={"flex items-center justify-center my-32"}>
                    <div className={"flex flex-col items-center justify-between p-2"}>
                        <h1 className={"title text-4xl font-bold"}>Filtering/Routing</h1>
                        <p className={"text-2xl my-5 text-slate-400"}>
                            Easily create filters on your suppliers and buyers so your leads get routed to their correct destination.
                        </p>
                    </div>
                    <img src={dash2} alt="" className={"w-[900px] shadow-lg p-2"}/>
                </div>
            </div>


            <div className={"container mx-auto my-32 text-center w-[1300px]"}>
                <div className={"flex flex-row items-center justify-center my-32"}>
                    <img src={dash2} alt="" className={"w-[900px] shadow-lg p-2"}/>
                    <div className={"flex flex-col items-center justify-start p-2"}>
                        <h1 className={"title text-4xl font-bold"}>Multi Buyer</h1>
                        <p className={"text-2xl my-5 text-slate-400"}>
                            Easily create filters on your suppliers and buyers so your leads get routed to their correct destination.
                        </p>
                    </div>
                </div>
            </div>

            <div className={"container mx-auto my-32 text-center w-[1300px]"}>
                <div className={"flex items-center justify-center my-32"}>
                    <div className={"flex flex-col items-center justify-between p-2"}>
                        <h1 className={"title text-4xl font-bold"}>Ping/Post Exchange</h1>
                        <p className={"text-2xl my-5 text-slate-400"}>
                            Easily create filters on your suppliers and buyers so your leads get routed to their correct destination.
                        </p>
                    </div>
                    <img src={dash2} alt="" className={"w-[900px] shadow-lg p-2"}/>
                </div>
            </div>

            {/*Features section ends here*/}


        </div>
    )
}

export default Home