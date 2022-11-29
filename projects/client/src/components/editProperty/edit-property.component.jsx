import {
  Box,
  Button,
  Container,
  Image,
  Img,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect } from "react"
import { useState } from "react"
import { Editor } from "react-draft-wysiwyg"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../../api"

const EditProperty = () => {
  const [prop, setProp] = useState([])
  const [listing, setListing] = useState([])
  const [propertyImage, setPropertyImage] = useState([])

  const toast = useToast()

  const params = useParams()

  // ==========================================================================

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
  // ==========================================================================

  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      description: "",
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

        <Textarea
          width="87vh"
          height="20vh"
          label="Description"
          defaultValue={listing.description}
          type="text"
          required
          onChange={formChangeHandler}
          name="description"
        />

        <Image src={"../../../../server/public" || propertyImage.image_url} />
        <Button type="submit">POST</Button>
      </form>
    </Box>
  )
}

export default EditProperty
