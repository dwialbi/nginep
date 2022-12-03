import { axiosInstance } from "../../api/index"
// import * as Yup from "yup"
import "./property-form.styles.css"
import { useFormik } from "formik"
import {
  Alert,
  Box,
  CloseButton,
  Flex,
  HStack,
  Image,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import FormInput from "../input/from-input.component"
import Button from "../button/button.component"
import { useState } from "react"
import { useRef } from "react"
import { BsUpload } from "react-icons/bs"
import { useEffect } from "react"

const PropertyForm = () => {
  const toast = useToast()
  // ==================================================================================================
  const inputFileRef = useRef()
  const [selectedImages, setSelectedImages] = useState([])
  const [category, setCategory] = useState([])
  const [cities, setCities] = useState([])

  // ========================================= Get Category =============================================

  const getCategory = async () => {
    try {
      const responseCategory = await axiosInstance.get("/tenant/category")
      setCategory(responseCategory.data.data)
      console.log(responseCategory.data)
    } catch (err) {
      console.log(err)
    }
  }

  // ========================================= Get Cities =============================================
  const getCities = async () => {
    try {
      const responseCities = await axiosInstance.get("/tenant/cities")
      setCities(responseCities.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  // ==================================================================================================
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
      rules: "",
      description: "",
      cityId: "",
      categoryId: "",
      image_url: "",
    },
    onSubmit: async (values) => {
      try {
        let newProperty = new FormData()
        newProperty.append("name", values.name)
        newProperty.append("address", values.address)
        newProperty.append("rules", values.rules)
        newProperty.append("description", values.description)
        newProperty.append("cityId", values.cityId)
        newProperty.append("categoryId", values.categoryId)
        for (let i = 0; i < values.image_url.length; i++) {
          newProperty.append("image_url", values.image_url[i])
        }
        const response = await axiosInstance.post(
          "/tenant/property",
          newProperty
        )

        toast({
          title: "Property successful added",
          description: response.message,
          status: "success",
        })
      } catch (err) {
        console.log(err)

        toast({
          title: "Added new property failed",
          description: err.response.message,
          status: "error",
        })
      }
    },
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files
    const selectedFilesArray = Array.from(selectedFiles)

    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file)
    })

    setSelectedImages((previousImages) => previousImages.concat(imagesArray))

    // FOR BUG IN CHROME
    // event.target.value = ""
  }

  function deleteHandler(image) {
    setSelectedImages(selectedImages.filter((e) => e !== image))
    URL.revokeObjectURL(image)
  }

  useEffect(() => {
    getCategory()
    getCities()
  }, [])

  return (
    <div className="property-form-container">
      <h1>Register Your Property Here</h1>
      <br />
      <form onSubmit={formik.handleSubmit}>
        <FormInput
          label="Property Name"
          type="text"
          required
          onChange={formChangeHandler}
          name="name"
          value={formik.values.name}
        />
        <FormInput
          label="Address"
          type="text"
          required
          onChange={formChangeHandler}
          name="address"
          value={formik.values.address}
        />
        <Text>Rules</Text>
        <br />
        <Textarea
          // width={{ base: "45vh", sm: "85vh" }}
          display="block"
          width="90%"
          height="20vh"
          label="rules"
          type="text"
          required
          onChange={formChangeHandler}
          name="rules"
          value={formik.values.rules}
        />

        <Text>Description</Text>
        <br />
        <Textarea
          display="block"
          // width={{ base: "45vh", sm: "85vh" }}
          width="90%"
          height="20vh"
          label="Description"
          type="text"
          required
          onChange={formChangeHandler}
          name="description"
          value={formik.values.description}
        />

        <HStack mt="5">
          {/* ================================ Category =================================== */}

          <Stack width="45.5%">
            <Text>Category</Text>
            <HStack width="100%">
              <Select
                type="text"
                required
                onChange={formChangeHandler}
                name="categoryId"
                value={formik.values.categoryId}
              >
                <option>-- Select Category --</option>
                {category.map((val) => (
                  <option value={val.id}>{val.category_name}</option>
                ))}
              </Select>
            </HStack>
          </Stack>
          {/* ================================ CITY =================================== */}

          <Stack width="45.5%">
            <Text>City</Text>
            <HStack width="100%">
              <Select
                label="cityId"
                type="text"
                required
                onChange={formChangeHandler}
                name="cityId"
                value={formik.values.cityId}
              >
                <option value={0}> -- Select City --</option>
                {cities.map((val) => (
                  <option value={val.id}>{val.cities_name}</option>
                ))}
              </Select>
            </HStack>
          </Stack>
        </HStack>
        <div className="card-container">
          <Input
            label="Image"
            multiple={true}
            name="image_url"
            type="file"
            accept="image/*"
            onChange={(event) => {
              formik.setFieldValue("image_url", event.target.files)
              onSelectFile(event)
            }}
            display="none"
            ref={inputFileRef}
          />
          <Box
            width="max-content"
            gap="2"
            alignItems="center"
            justifyContent="center"
            margin="auto"
            ml={{ base: "-10px", md: "30vh" }}
          >
            <h4>Upload Your Image</h4>
            <label
              className="label-btn"
              onClick={() => inputFileRef.current.click()}
            >
              <BsUpload />
              Choose a Image
            </label>
            <Button type="submit">Register</Button>
          </Box>
          <br />
          {/* ===================================================================================== */}

          <div className="images">
            {selectedImages &&
              selectedImages.map((image, index) => {
                return (
                  <div className="image-container">
                    <CloseButton
                      ml={{ base: "129px", sm: "41vh" }}
                      mt="8px"
                      pos="absolute"
                      border="none"
                      color="white"
                      className="delete-btn"
                      cursor="pointer"
                      onClick={() => deleteHandler(image)}
                    />
                    <Image
                      // boxSize="20px
                      borderRadius="10px"
                      width="fit-content"
                      boxSize="100%"
                      // height="100%"
                      objectFit="cover"
                      src={image}
                      alt="upload"
                    />
                  </div>
                )
              })}
          </div>
        </div>

        {/* ================================================================================================ */}
      </form>
    </div>
  )
}

export default PropertyForm
