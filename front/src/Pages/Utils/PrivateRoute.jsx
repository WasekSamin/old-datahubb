import { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
// import AuthUtils from "./AuthUtils";
import AuthContext from "./AuthProvider"

const PrivateRoute = ({ children, ...rest }) => {
    // const { getToken } = AuthUtils()
    const authUser = useContext(AuthContext)
    return (
        <Route { ...rest }>
            { !authUser ? <Navigate to="/signin" /> : children }
        </Route>
    )
}

export default PrivateRoute