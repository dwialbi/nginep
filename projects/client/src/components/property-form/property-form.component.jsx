import { axiosInstance } from "../../api/index"
// import * as Yup from "yup"
import "./property-form.styles.css"
import { useFormik } from "formik"
import { Input, useToast } from "@chakra-ui/react"
import FormInput from "../input/from-input.component"
import Button from "../button/button.component"
import { useState } from "react"

const PropertyForm = () => {
  const toast = useToast()

  const [files, setFiles] = useState("")
  const [filesProgress, setFilesProgress] = useState(0)

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
        // for (let i = 0; i < files.length; i++) {
        newProperty.append("image_url", values.image_url)
        // }
        const response = await axiosInstance.post(
          "/tenant/property",
          newProperty
        )

        toast({
          title: "Property successful added",
          //   description: response.data.message,
          status: "success",
        })
      } catch (err) {
        console.log(err)
        toast({
          title: "Added new property failed",
          // description: err.response.data.message,
          status: "error",
        })
      }
    },
  })
  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formik.setFieldValue(name, value)
  }

  const multipleChange = (e) => {
    setFiles(e.target.files[0])
    setFilesProgress(0)
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
        <FormInput
          label="Description"
          type="text"
          required
          onChange={formChangeHandler}
          name="description"
          value={formik.values.description}
        />
        <FormInput
          label="CategoryId"
          type="text"
          required
          onChange={formChangeHandler}
          name="categoryId"
          value={formik.values.categoryId}
        />
        <FormInput
          label="cityId"
          type="text"
          required
          onChange={formChangeHandler}
          name="cityId"
          value={formik.values.cityId}
        />
        <Input
          label="Image"
          multiple
          name="image_url"
          type="file"
          accept="image/*"
          onChange={(event) => {
            formik.setFieldValue("image_url", event.target.files[0])
          }}

          // onSubmit={(e) => {
          //   formik.setFieldValue("image_url", e.target.multipleChang)
          // }}

          //   onChange={formChangeHandler}
          //   value={formik.values.image_url}
        />

        <Button type="submit">Register</Button>
      </form>
    </div>
  )
}

export default PropertyForm
