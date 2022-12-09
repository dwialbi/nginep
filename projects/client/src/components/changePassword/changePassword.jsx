import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react"
import { getAuth, updatePassword } from "firebase/auth"
import { useRef } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Button from "../button/button.component"
import FormInput from "../input/from-input.component"

const ChangePassword = () => {
  const navigate = useNavigate()
  const authSelector = useSelector((state) => state.auth)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // buat state error
  // ketika password tidak sama, maka state error akan di buat true
  // jika ingin ada message gunakan string

  //   const currentUser = getAuth().authSelector.id
  const toast = useToast()
  const auth = getAuth()
  const user = auth.currentUser

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (password !== confirmPassword) {
        throw new Error(
          toast({
            title: "Password do not match",
            status: "error",
          })
          // <Alert status="error">
          //   <AlertIcon />
          //   <AlertTitle>Password do not match</AlertTitle>
          // </Alert>
          //   "Password do not match"
        )
      }

      await updatePassword(user, password)
      toast({
        title: "Password has been change",
        // description: response.data.message,
        status: "success",
      })
      navigate("/reauth")
    } catch (err) {
      console.log(err)
      toast({
        title: "Change Password Failed!",
        // description: response.data.message,
        status: "error",
      })
    }
  }

  //   const handleSubmit = (e) => {
  //     e.preventDefault()

  //   }
  return (
    <Box mt="150px">
      <form onSubmit={handleSubmit}>
        <Text mb="30px" fontWeight="bold">
          Enter Your New Password
        </Text>
        <Box display="flex" flexDirection="column">
          <Text mb="10px" fontSize="16px">
            New Password
          </Text>
          <Input
            value={password}
            width="34vh"
            onChange={(e) => setPassword(e.target.value)}
            mb="20px"
          />
          <Text mb="10px" fontSize="16px">
            Confirm Password
          </Text>
          <Input
            value={confirmPassword}
            width="34vh"
            onChange={(e) => setConfirmPassword(e.target.value)}
            {...{ setPassword: setConfirmPassword }}
            message="password do not match"
            mb="30px"
            //     onBlur={}
          />

          {/* masukin div / span yang isinya state error
          gunakan kondisi jika input terisis tetapi value tidak sama makan muncul
          message error */}
        </Box>
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  )
}

export default ChangePassword
