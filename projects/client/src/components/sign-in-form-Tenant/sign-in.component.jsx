import React from "react"
import { FormControl, FormErrorMessage, useToast } from "@chakra-ui/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { axiosInstance } from "../../api"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../redux/features/authSlice"

import { logout } from "../../redux/features/authSlice"

//===================firebase=====================
import { signInAuthUserWithEmailAndPassword } from "../../config/firebase"

import FormInput from "../input/from-input.component"
import Button from "../button/button.component"

//===================firebase=====================

const SignInTenant = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const authSelector = useSelector((state) => state.auth)
  const toast = useToast()
  const selector = useSelector((state) => state.auth)

  // LOGOUT
  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_token")
    dispatch(logout())
    navigate("/")
  }

  //const {dispatch} = useContext(AuthContext)

  // LOGIN GOOGLE
  // const signInWithGoogle = async () => {
  //   const result = await signInWithGooglePopup()
  //   const idToken = await result.user.getIdToken()
  //   const response = await axiosInstance.post("/auth/login/google", {
  //     googleToken: idToken,
  //     // is_verified: true,
  //   })

  //   console.log(response)
  //   localStorage.setItem("auth_token", response.data.token)
  //   dispatch(
  //     login({
  //       id: response.data.data.id,
  //       email: response.data.data.email,
  //       role: response.data.data.role,
  //       is_verified: response.data.data.is_verified,
  //       // first_name: response.data.data.first_name,
  //       // last_name: response.data.data.last_name,
  //     })
  //   )
  //   toast({
  //     title: "Login success",
  //     description: response.data.message,
  //     status: "success",
  //   })
  // }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "tenant",
    },
    onSubmit: async ({ email, password }) => {
      try {
        const signInResult = await signInAuthUserWithEmailAndPassword(
          email,
          password
        )

        const idToken = await signInResult.user.getIdToken()

        const response = await axiosInstance.post("/auth/login/google", {
          googleToken: idToken,
          // role: "tenant",
        })
        localStorage.setItem("auth_token", response.data.token)
        dispatch(
          login({
            id: response.data.data.id,
            email: response.data.data.email,
            role: response.data.data.role,
            is_verified: response.data.data.is_verified,
            // first_name: response.data.data.first_name,
            // last_name: response.data.data.last_name,
          })
        )
        console.log(response)

        toast({
          title: "Login success",
          description: response.data.message,
          status: "success",
        })
      } catch (err) {
        console.log(err)
        toast({
          title: "Login Failed",
          description: err.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
    }),
    validateOnChange: false,
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  if (authSelector.role === "user") {
    navigate("/")
  } else if (authSelector.role === "tenant") {
    navigate("/tenant")
  }

  return (
    <div
      style={{ alignSelf: "center", alignItems: "center" }}
      className="sign-in-container"
    >
      <h1>Login Tenant </h1>
      <h2>Already have an account?</h2>
      <span>Sign in with your email and password</span>
      <form onSubmit={formik.handleSubmit}>
        <FormControl isInvalid={formik.errors.email}>
          <FormInput
            label="Email"
            type="email"
            required
            onChange={formChangeHandler}
            name="email"
            value={formik.values.email}
          />
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={formik.errors.password}>
          <FormInput
            label="Password"
            type="password"
            required
            onChange={formChangeHandler}
            name="password"
            value={formik.values.password}
          />
          <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
        </FormControl>
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <div>
            <br />
            <h3>
              Not a Tenant? <Link to="/register">Sign Up</Link>
            </h3>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignInTenant
