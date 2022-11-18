import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Register from "./pages/Register"

function App() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      )
      setMessage(data?.message || "")
    })()
  }, [])

  //===================context==================

  // const {currentUser} = useContext(AuthContext)

  // const RequireAuth = ({ children }) => {
  //   return currentUser ? children : <Navigate to="/login" />
  // }

  //===================context==================

  return (
    <Routes>
      <Route path="/profile" element={<Profile />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App
