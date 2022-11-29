import { axiosInstance } from "../../api/index"
// import * as Yup from "yup"
import "./property-form.styles.css"
import { useFormik } from "formik"
import {
  Flex,
  HStack,
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

const PropertyForm = () => {
  const toast = useToast()
  // ==================================================================================================
  const inputFileRef = useRef()
  const [selectedImages, setSelectedImages] = useState([])

  // ==================================================================================================
  const formik = useFormik({
    initialValues: {
      name: "",
      address: "",
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
        console.log(response)

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

  return (
    <div className="property-form-container">
      <h1>PropertyForm</h1>
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
        <Text>Description</Text>
        <br />
        <Textarea
          width="87vh"
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
                // label="CategoryId"
                variant="flushed"
                type="text"
                required
                onChange={formChangeHandler}
                name="categoryId"
                value={formik.values.categoryId}
              >
                <option value={0}>-- Select Category --</option>
                <option value="1">hehehe</option>
                <option value={2}>Hehe</option>
                <option>Hehe</option>
                <option>Hehe</option>
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
                <option value={0}>-- Select City --</option>
                <option value="1">hahaha</option>
                <option value={2}>Hihi</option>
                <option>Hehe</option>
                <option>Hehe</option>
              </Select>
            </HStack>
          </Stack>
        </HStack>
        <div className="card-container">
          <h4>Upload Your Image</h4>
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
          <Flex
            width="max-content"
            gap="2"
            alignItems="center"
            justifyContent="center"
            margin="auto"
          >
            <Button type="submit">Register</Button>
            <label
              className="label-btn"
              onClick={() => inputFileRef.current.click()}
            >
              <BsUpload />
              Choose a Image
            </label>
          </Flex>
          <br />
          {/* ===================================================================================== */}

          <div className="images">
            {selectedImages &&
              selectedImages.map((image, index) => {
                return (
                  <div key={image} className="image-container">
                    <img src={image} alt="upload" />
                    <span
                      className="delete-btn"
                      onClick={() => deleteHandler(image)}
                    >
                      &times;
                    </span>
                    {/* <button onClick={() => deleteHandler(image)}>
                      delete image
                    </button> */}
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
