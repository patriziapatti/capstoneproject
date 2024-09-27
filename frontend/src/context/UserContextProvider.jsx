import { useState, createContext, useEffect } from "react"
import { me } from "../data/fetch.js"

export const UserContext = createContext()

export default function UserContextProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [userInfo, setUserInfo] = useState()
    const getMe = async () =>{
        try {
            const meInfo = await me();
            setUserInfo(meInfo)
        } catch (error) {
           if(error.message === '401'){
            localStorage.removeItem('token')
            setToken(null)
           } 
        }
      
    }
    useEffect(()=>{
        if (token) getMe() //la me vuole come auth il token, quindi senza il token si rompe il backend
    },[token])
    const value = {token, setToken, userInfo, setUserInfo}
    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    )
}