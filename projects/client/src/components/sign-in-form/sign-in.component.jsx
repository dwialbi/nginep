import React from "react"
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { axiosInstance } from "../../api"
import { useDispatch, useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { login } from "../../redux/features/authSlice"

import { logout } from "../../redux/features/authSlice"

//===================firebase=====================

import {
  signInAuthUserWithEmailAndPassword,
  signInWithGooglePopup,
} from "../config/firebase"
//import { useContext } from "react"
//import { AuthContext } from "../context/AuthContext"
//===================firebase=====================

const Login = () => {
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const toast = useToast()
  const selector = useSelector((state) => state.auth)

  // LOGOUT
  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_token")
    dispatch(logout())

    Navigate("/")
  }

  //const {dispatch} = useContext(AuthContext)

  const signInWithGoogle = async () => {
    const result = await signInWithGooglePopup()
    const idToken = await result.user.getIdToken()

    const response = await axiosInstance.post("/auth/login/google", {
      googleToken: idToken,
    })
    console.log(response)
    localStorage.setItem("auth_token", response.data.token)
    dispatch(
      login({
        id: response.data.data.id,
        email: response.data.data.email,
        // first_name: response.data.data.first_name,
        // last_name: response.data.data.last_name,
      })
    )
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ password, emailOrPhoneNumber }) => {
      try {
        const signInResult = await signInAuthUserWithEmailAndPassword(
          emailOrPhoneNumber,
          password
        )

        const idToken = await signInResult.user.getIdToken()

        const response = await axiosInstance.post("/auth/login/google", {
          googleToken: idToken,
        })

        localStorage.setItem("auth_token", response.data.token)
        dispatch(
          login({
            id: response.data.data.id,
            email: response.data.data.email,
            phone_numberL: response.data.data.phone_number,
            // first_name: response.data.data.first_name,
            // last_name: response.data.data.last_name,
          })
        )
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

  return (
    <Box h="100vh" display={"flex"} alignItems="center">
      <Container>
        <Box p="8">
          <Text fontWeight="bold" fontSize="4xl" mb="8">
            Login {selector.id}
          </Text>

          <form onSubmit={formik.handleSubmit}>
            <Stack>
              <FormControl isInvalid={formik.errors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={formik.values.email}
                  name="email"
                  onChange={formChangeHandler}
                  type="email"
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={formik.errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  value={formik.values.password}
                  name="password"
                  onChange={formChangeHandler}
                  type="password"
                  marginBottom="20px"
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="purple">
                Login
              </Button>
              <Button
                type="button"
                colorScheme="green"
                onClick={signInWithGoogle}
              >
                Login with google
              </Button>
              <Button onClick={logoutBtnHandler}>Logout</Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

export default Login
