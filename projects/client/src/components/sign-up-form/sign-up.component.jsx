import { useFormik } from "formik"

import * as Yup from "yup"
import { axiosInstance } from "../../api"
import "./sign-up.styles.css"

//===================firebase=====================
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../config/firebase"
import { useNavigate } from "react-router-dom"
import FormInput from "../input/from-input.component"
import { FormControl, FormErrorMessage, useToast } from "@chakra-ui/react"
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component"

//===================firebase=====================

const SignUpFrom = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      //   confirmPassword: "",
      //   phone_number: "",
    },
    onSubmit: async ({ email, password, phone_number }) => {
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
              //   phone_number,
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
      //   phone_number: Yup.string().required(),
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
    <div className="sign-up-container">
      <h1>REGISTER</h1>
      <h2>Don't have any account?</h2>
      <span>Sign up with your email, phone number and password</span>
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
        {/* <FormControl isInvalid={formik.errors.phone_number}>
          <FormInput
            label="Phone Number"
            type="text"
            required
            onChange={formChangeHandler}
            name="phone_number"
            value={formik.values.phone_number}
          />
          <FormErrorMessage>{formik.errors.phone_number}</FormErrorMessage>
        </FormControl> */}
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

        <Button buttonType={BUTTON_TYPE_CLASSES.base} type="submit">
          Sign Up
        </Button>
      </form>
    </div>
  )
}
export default SignUpFrom
