import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";


export default function AuthUtils(){
    // const [environment, setEnvironment] = useState('development');
    const apiUrl = "http://127.0.0.1:8001/"
    const productionUrl = "https://api.datahubb.io/"
    const navigate = useNavigate()

    const getToken = () => {
        // const tokenString = sessionStorage.getItem("token")
        const tokenString = localStorage.getItem("token")
        const userToken = JSON.parse(tokenString);
        return userToken;
    }

    const getUser = () => {
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
        
        setTimeout(() => {
            navigate("/");
        }, 2000);
    }

    const logout = ()=> {
        localStorage.clear()
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/signin");
    }

    const http = axios.create({
        baseURL: "http://127.0.0.1:8000/",
        headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`
        }
    })

    const updateToken = async() => {
        await http.post("/api/token/refresh/", {
            refresh: token.refresh
        })
            .then((response) => {
                setToken(response.data.access)
            })
    }

    const handleSession = () => {
        let jwt_token = localStorage.getItem("token")
        if ( !jwt_token ) {
            navigate("/signin")
        }
    }

    useEffect(() => {
        handleSession()
    }, [])


    return {
        setToken:saveToken,
        token,
        user,
        getToken,
        http,
        logout,
        getUser
    }
}