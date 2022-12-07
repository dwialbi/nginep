import { Box, Input, Text, useToast } from "@chakra-ui/react"
import { getAuth, updatePassword } from "firebase/auth"
import { useRef } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import Button from "../button/button.component"
import FormInput from "../input/from-input.component"

const ChangePassword = () => {
  const authSelector = useSelector((state) => state.auth)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  //   const currentUser = getAuth().authSelector.id
  const toast = useToast()
  const auth = getAuth()
  const user = auth.currentUser

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      //   if (password.current.value !== confirmPassword.current.value) {
      //     toast({
      //       title: "Password do not mathc",
      //       status: "error",
      //     })
      //   }

      await updatePassword(user, password)
      toast({
        title: "Password has been change",
        // description: response.data.message,
        status: "success",
      })
    } catch (err) {
      console.log(err)
      toast({
        title: "CEK O CONSOLEMU!",
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
        <Text mb="20px">Enter Your New Password</Text>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          mb="20px"
        />
        {/* <Input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        /> */}
        <Button type="submit">DOR</Button>
      </form>
    </Box>
  )
}

export default ChangePassword
