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
import { axiosInstance } from "../api"

//===================firebase=====================
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../config/firebase"
import { useNavigate } from "react-router-dom"
//===================firebase=====================

const Register = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      phone_number: "",
    },
    onSubmit: async ({ email, password }) => {
      try {
        //===================firebase=====================

        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user
            console.log(user)

            const response = await axiosInstance.post("/auth/register", {
              email,
              password,
              //role: "tenant"
            })

            navigate("/login")

            toast({
              title: "Registration successful",
              description: response.data.message,
              status: "success",
            })
          })
          .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            // ..
          })

        //===================firebase=====================
      } catch (err) {
        toast({
          title: "Registration failed",
          description: err.response.data.message,
          status: "error",
        })
        console.log(err)
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().required().email(),
      phone_number: Yup.boolean().required(),
      password: Yup.string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        ),
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
            Register
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
                Register
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Box>
  )
}

export default Register
