import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Image,
  Img,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect } from "react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../../api"

const EditProperty = () => {
  const [listing, setListing] = useState([])
  const toast = useToast()
  const params = useParams()

  // ============================= GET Prop ID========================================

  const getProperty = async () => {
    try {
      const responseProp = await axiosInstance.get(
        `tenant/property/${params.id}`
      )
      setListing(responseProp.data.data)
      // setPropertyImage(responseProp.data.data.PropertyImages)
      console.log(responseProp.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  // console.log(propertyImage)

  // =============================== Edit Prop =========================================

  const formik = useFormik({
    initialValues: {
      name: listing.name,
      address: listing.address,
      description: listing.description,
    },
    onSubmit: async ({ name, address, description, rules }) => {
      try {
        const response = await axiosInstance.patch(
          `/tenant/property/${params.id}`,
          {
            name,
            address,
            rules,
            description,
          }
        )

        toast({
          title: "Success Edit Property",
          // description:,
          status: "success",
        })
      } catch (err) {
        console.log(err)
        toast({
          title: "Failed Edit Property",
          //  description: err.response.message,
          status: "error",
        })
      }
    },
  })

  // console.log(prop.data)

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  useEffect(() => {
    getProperty()
  }, [])
  return (
    <Box
      mt="150px"
      // ml="5px"
      // right="50%"
      left={{ base: "0", sm: "10%" }}
      maxW="71vh"
      minW="20vh"
      w={{ base: "55vh", sm: "71vh" }}
      position="absolute"
      ml="5px"
      // mr="10px"
      // margin="auto"
      // textAlign="center"
      // alignContent="center"
      // alignSelf="center"
      // justifyContent="center"
    >
      <Text as="b" fontSize="xx-large" mb="50px">
        {" "}
        Edit Property Form
      </Text>
      <Box
        // borderRadius="8px"
        alignContent="center"
        justifyContent="center"
        // border="1px solid black"
        mt="20px"
        mr="-10px"
        height={{ base: "80vh", sm: "58vh" }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box mb="20px" mt="22px" maxW="70vh" minW="20vh" ml="10px">
            <Text as="b" fontSize="16px">
              Property Name
            </Text>
            <Input
              label="Property Name"
              type="text"
              defaultValue={listing.name}
              required
              onChange={formChangeHandler}
              name="name"
            />
          </Box>
          <Box mb="20px" w="70vh" ml="10px" marginRight="20px">
            <Text as="b" fontSize="16px">
              Address
            </Text>
            <Input
              label="Address"
              type="text"
              required
              defaultValue={listing.address}
              onChange={formChangeHandler}
              name="address"
            />
          </Box>
          <Box w="70vh" mb="20px" ml="10px" mr="5px">
            <Text as="b" fontSize="16px">
              Rules
            </Text>
            <Textarea
              h="15vh"
              label="rules"
              defaultValue={listing.rules}
              type="text"
              required
              onChange={formChangeHandler}
              name="rules"
            />
          </Box>
          <Box w="70vh" mb="20px" ml="10px" mr="5px">
            <Text as="b" fontSize="16px">
              Description
            </Text>
            <Textarea
              h="15vh"
              label="Description"
              defaultValue={listing.description}
              type="text"
              required
              onChange={formChangeHandler}
              name="description"
            />
          </Box>

          <Button ml="10px" type="submit">
            POST
          </Button>

          <Grid
            templateColumns="repeat(2,1fr)"
            display="flex"
            flexWrap="wrap"
            gap="10px"
            spacing="10"
          ></Grid>
        </form>
      </Box>
    </Box>
  )
}

export default EditProperty
