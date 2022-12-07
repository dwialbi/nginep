import { Box, Button, Input, Text, useToast } from "@chakra-ui/react"
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth"
import { useRef } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

const ReAuth = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const authSelector = useSelector((state) => state.auth)
  const passwordRef = useRef()
  const auth = getAuth()
  const user = auth.currentUser

  const handleSubmit = async (e) => {
    e.preventDefault()
    const credential = EmailAuthProvider.credential(
      authSelector?.email,
      passwordRef.current.value
    )

    try {
      await reauthenticateWithCredential(user, credential)
      navigate("/changepassword")
      toast({
        title: "success re enter your password",
        status: "success",
      })
    } catch (err) {
      console.log(err)
      toast({
        title: "CEK CONSOLE",
        status: "error",
      })
    }
  }
  console.log(reauthenticateWithCredential)

  return (
    <Box mt="100px">
      <Text>Email</Text>
      <Text fontSize="20px" fontWeight="bold" mb="15px">
        {authSelector.email}
      </Text>
      <form onSubmit={handleSubmit}>
        <Text>Enter your password</Text>
        <Input ref={passwordRef} {...{ passwordRef }} />
        <Button type="submit">Submit</Button>
      </form>
    </Box>
  )
}

export default ReAuth
