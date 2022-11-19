import { async } from "@firebase/util"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import { axiosInstance } from "./api"
import SignUpFrom from "./components/sign-up-form/sign-up.component"
// import { AuthContext } from "./context/AuthContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import { login } from "./redux/features/authSlice"

function App() {
  const [authCheck, setAuthCheck] = useState(false)
  const dispatch = useDispatch()
  const keepUserLoggedIn = async () => {
    try {
      const auth_token = localStorage.getItem("auth_token")

      if (!auth_token) {
        setAuthCheck(true)
        return
      }

      const response = await axiosInstance.get("/auth/refresh-token", {
        headers: {
          authorization: `Bearer ${auth_token}`,
        },
      })
      console.log(response)

      dispatch(login(response.data.data))
      localStorage.setItem("auth_token", response.data.token)
    } catch (err) {
      console.log(err)
      setAuthCheck(true)
    }
  }
  useEffect(() => {
    keepUserLoggedIn()
  }, [])
  //===================context==================

  // const {currentUser} = useContext(AuthContext)

  // const RequireAuth = ({ children }) => {
  //   return currentUser ? children : <Navigate to="/login" />
  // }

  //===================context==================

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<SignUpFrom />} />
      <Route path="/signup" element={<Register />} />
    </Routes>
  )
}

export default App
