import { async } from "@firebase/util"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import { axiosInstance } from "./api"
import EditProperty from "./components/editProperty/edit-property.component"
import Navbar from "./components/navbar/navbar.component"
import PostPropImg from "./components/postPropImg/post-prop-img.component"
import PropertyForm from "./components/property-form/property-form.component"
import ListingDetails from "./components/PropertyList/property-list.compoenet"
import SignInTenant from "./components/sign-in-form-Tenant/sign-in.component"
import SignIn from "./components/sign-in-form/sign-in.component"
import SignUpFrom from "./components/sign-up-form/sign-up.component"
// import { AuthContext } from "./context/AuthContext"
import Home from "./pages/Home"
// import Login from "./pages/Login"
import Profile from "./pages/Profile"
import Register from "./pages/Register"
import Tenant from "./pages/tenant"
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
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Login" element={<SignIn />} />
        <Route path="/Register" element={<SignUpFrom />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/tenant" element={<Tenant />} />
        <Route path="/loginTenant" element={<SignInTenant />} />
        <Route path="/property-form" element={<PropertyForm />} />
        <Route path="/property/:id" element={<ListingDetails />} />
        <Route path="/property/edit/:id" element={<EditProperty />} />
        <Route path="/property/image/:id" element={<PostPropImg />} />
      </Routes>
    </div>
  )
}

export default App
