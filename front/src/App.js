import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/dashboard";
import Clients from "./Pages/Dashboard/clients";
import EditClient from "./Pages/Dashboard/EditClient";
import Campaign from './Pages/Campaign/campaigns';
import CreateCampaign from './Pages/Campaign/create_campaign';
import CreateSupplier from './Pages/Campaign/create_supplier';
import Signup from './Pages/Auth/Signup';
import Signin from './Pages/Auth/Signin';
import 'react-toastify/dist/ReactToastify.css';
import AuthUtils from "./Pages/Utils/AuthUtils";
import CreateBuyer from "./Pages/Campaign/CreateBuyer";
import EditBuyer from "./Pages/Campaign/EditBuyer";
import LeadTest from "./Pages/Lead/TestLead";
import Leads from "./Pages/Lead/Leads";
import SupplierDocs from "./Pages/Campaign/SupplierDocs";
import EditSupplier from "./Pages/Campaign/EditSupplier";
import EditProfile from "./Pages/Auth/EditProfile";
import Report from './Pages/Analytics/Report';
import Segmentation from './Pages/Segmentation/segmentation';
import DemoSignin from './Pages/Auth/DemoSignin';
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";



function App() {
    const { getToken } = AuthUtils()
    const isLoggedIn = !!getToken();

    return (
        <div className="App font-sans font-semibold">
            <Routes>
                <Route exact path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />} />
                <Route exact path="/clients" element={isLoggedIn ? <Clients /> : <Navigate to="/signin" />} />
                <Route exact path="/edit-client/:clientId/" element={isLoggedIn ? <EditClient /> : <Navigate to="/signin" />} />

                { /** Auth urls */}
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/signin" element={<Signin />} />
                <Route exact path="/demo-signin" element={<DemoSignin />} />
                <Route exact path="/user" element={isLoggedIn ? <EditProfile /> : <Navigate to="/signin" />} />

                {/* campaign urls */}
                <Route exact path="/campaigns" element={isLoggedIn ? <Campaign /> : <Navigate to="/signin" />} />
                <Route exact path="/create-campaign/:id/" element={isLoggedIn ? <CreateCampaign /> : <Navigate to="/signin" />} />
                <Route exact path="create-buyer/:id/" element={isLoggedIn ? <CreateBuyer /> : <Navigate to="/signin" />} />
                <Route exact path="edit-buyer/:id/" element={isLoggedIn ? <EditBuyer /> : <Navigate to="/signin" />} />
                {/*/!*<Route exact path="/create-campaign" element={ <CreateCampaign /> } />*!/*/}

                {/*/!*supplier urls*!/*/}
                <Route exact path="/create-supplier/:id/" element={isLoggedIn ? <CreateSupplier /> : <Navigate to="/signin" />} />
                <Route exact path="/supplier-api-docs/:id/" element={<SupplierDocs />} />
                <Route exact path="/edit-supplier/:id/" element={isLoggedIn ? <EditSupplier /> : <Navigate to="/signin" />} />
                {/*/!*lead urls*!/*/}
                <Route exact path="/test-lead/:id/" element={isLoggedIn ? <LeadTest /> : <Navigate to="/signin" />} />
                <Route exact path="/leads" element={isLoggedIn ? <Leads /> : <Navigate to="/signin" />} />

                {/* Analytics */}
                <Route exact path="/analytics" element={isLoggedIn ? <Report /> : <Navigate to="/signin" />} />

                {/* segmentation */}
                <Route exact path="/segmentation" element={isLoggedIn ? <Segmentation /> : <Navigate to="/signin" />} />
            </Routes>
        </div>
    );
}

export default App;
