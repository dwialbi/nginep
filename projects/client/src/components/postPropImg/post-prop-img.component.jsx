import {
  Box,
  Button,
  Grid,
  GridItem,
  Image,
  Input,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../../api"

const PostPropImg = () => {
  const toast = useToast()
  const inputFileRef = useRef()
  const params = useParams()

  const [propertyImage, setPropertyImage] = useState([])

  // =============================== Get Prop Image ========================================
  const getProperty = async () => {
    try {
      const responseProp = await axiosInstance.get(
        `tenant/property/${params.id}`
      )
      setPropertyImage(responseProp.data.data.PropertyImages)
      console.log(responseProp.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  // =============================== Delete Image ========================================
  const DeleteImg = async (id) => {
    try {
      await axiosInstance.delete(`/tenant/property/image/${id}`)
      getProperty()
      toast({ title: "Image deleted", status: "info" })
    } catch (err) {
      console.log(err)
    }
  }
  // =============================== Post Image ===========================================

  const formik = useFormik({
    initialValues: {
      image_url: "",
    },
    onSubmit: async (values, id) => {
      try {
        let newImgProp = new FormData()
        newImgProp.append("image_url", values.image_url[0])

        // console.log(values.image_url[0].name)
        const responseImg = await axiosInstance.post(
          `/tenant/property/image/${params.id}`,
          newImgProp
        )
        window.location.reload(false)
        // console.log(responseImg)
        toast({
          title: "Image succesfull added",
          status: "success",
        })
      } catch (err) {
        console.log(err)
      }
    },
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  useEffect(() => {
    getProperty()
  }, [])
  return (
    <Box mt="150px">
      <form onSubmit={formik.handleSubmit}>
        <Input
          label="Image"
          name="image_url"
          type="file"
          accept="image/*"
          onChange={(event) => {
            formik.setFieldValue("image_url", event.target.files)
          }}
          display="none"
          ref={inputFileRef}
        />
        <Button
          // type="submit"
          onClick={() => inputFileRef.current.click()}
        >
          Choose Images
        </Button>
        <Button type="submit">Submit</Button>
        <Grid
          templateColumns="repeat(2,1fr)"
          display="flex"
          flexWrap="wrap"
          gap="10px"
          spacing="10"
        >
          <GridItem w="100%" h="10">
            {propertyImage.map((val) => (
              <Box>
                <Image w="350px" src={val.image_url} />

                <Button onClick={() => DeleteImg(val.id)}>delete</Button>
              </Box>
            ))}
          </GridItem>
        </Grid>
      </form>
    </Box>
  )
}

export default PostPropImg
