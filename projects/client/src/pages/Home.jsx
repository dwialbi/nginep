import { Box, Button, Text } from "@chakra-ui/react"
import React from "react"
import { Link } from "react-router-dom"
import { signOutUser } from "../config/firebase"

const Home = () => {
  return (
    <Box mt="100px">
      <Text>Home</Text>
      <Text>Hello</Text>
      <Link to="/login">Login USER</Link>
      <br />
      <Link to="/loginTenant">Login Tenant</Link>
      <br />
      <Link to="/register">Register</Link>
      <br />
      <Link to="/registers">RegisterS</Link>
    </Box>
  )
}

export default Home
