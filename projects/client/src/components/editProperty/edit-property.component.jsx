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
import PostPropImg from "../postPropImg/post-prop-img.component"

const EditProperty = () => {
  const [prop, setProp] = useState([])
  const [listing, setListing] = useState([])
  const [propertyImage, setPropertyImage] = useState([])

  const toast = useToast()

  const params = useParams()

  // ============================= GET Prop ID========================================

  const getProperty = async () => {
    try {
      const responseProp = await axiosInstance.get(
        `tenant/property/${params.id}`
      )
      setListing(responseProp.data.data)
      setPropertyImage(responseProp.data.data.PropertyImages)
      console.log(responseProp.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  console.log(propertyImage)
  // =============================== Delete IMG =======================================

  const DeleteImg = async (id) => {
    try {
      await axiosInstance.delete(`/tenant/property/image/${id}`)
      getProperty()
      toast({ title: "Image deleted", status: "info" })
    } catch (err) {
      console.log(err)
    }
  }

  // =============================== Edit Prop =========================================

  const formik = useFormik({
    initialValues: {
      name: listing.name,
      address: listing.address,
      description: listing.description,
    },
    onSubmit: async ({ name, address, description }) => {
      try {
        const response = await axiosInstance.patch(
          `/tenant/property/${params.id}`,
          {
            name,
            address,
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
    // <Container>
    <Box mt="150px">
      <form onSubmit={formik.handleSubmit}>
        <Input
          label="Property Name"
          type="text"
          defaultValue={listing.name}
          required
          onChange={formChangeHandler}
          name="name"
        />
        <Input
          label="Address"
          type="text"
          required
          defaultValue={listing.address}
          onChange={formChangeHandler}
          name="address"
        />

        <Text>Description</Text>
        <Textarea
          width="98vh"
          height="20vh"
          label="Description"
          defaultValue={listing.description}
          type="text"
          required
          onChange={formChangeHandler}
          name="description"
        />

        <Button type="submit">POST</Button>
        {/* <Image src={"../../../../server/public" || propertyImage.image_url} /> */}

        <Grid
          templateColumns="repeat(2,1fr)"
          display="flex"
          flexWrap="wrap"
          gap="10px"
          spacing="10"
        >
          {/* <GridItem w="100%" h="10">
            {propertyImage.map((val) => (
              <Box>
                <Image w="350px" src={val.image_url} />

                <Button onClick={() => DeleteImg(val.id)}>delete</Button>
              </Box>
            ))}
          </GridItem> */}
          {/* <PostPropImg /> */}
        </Grid>
      </form>
    </Box>
  )
}

export default EditProperty
