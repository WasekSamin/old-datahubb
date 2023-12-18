import { createContext, useState, useEffect } from "react";
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const AuthContext = createContext()
export default AuthContext

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')):null)
    let [authUser, setAuthUser] = useState(()=>localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')):null)
    const navigate = useNavigate()
    const devUrl = "http://127.0.0.1:8000/"
    const productionUrl = "https://api.datahubb.io/"

    const getToken = () => {
        // const tokenString = sessionStorage.getItem("token")
        const tokenString = localStorage.getItem("token")
        const userToken = JSON.parse(tokenString);
        return userToken;
    }

    const getUser = ()=> {
        // const userString = sessionStorage.getItem("user")
        const userString = localStorage.getItem("user")
        const user_detail = JSON.parse(userString)
        return user_detail
    }

    const [ token, setToken ] = useState(getToken())
    const [ user, setUser ] = useState(getUser())

    const saveToken = (user, token) => {
        localStorage.setItem("token", JSON.stringify(token))
        localStorage.setItem("user", JSON.stringify(user))
        setToken(token)
        setUser(user)

        setAuthTokens(token)
        setAuthUser(user)

        setTimeout(() => {
            navigate("/");
        }, 2000);
        // navigate("/")
    }

    const logout = ()=> {
        localStorage.clear()
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("token")
        navigate("/signin")
    }

    const http = axios.create({
        baseURL: devUrl,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })

    const contextData = {
        setToken:saveToken,
        token,
        user,
        getToken,
        http,
        logout,
        authUser:authUser
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}