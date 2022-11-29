import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { axiosInstance } from "../api"
import * as Yup from "yup"

const AdminCategory = () => {
  const [openedEdit, setOpenedEdit] = useState(null)
  const {
    isOpen: isOpenAddNewCategory,
    onOpen: onOpenAddNewCategory,
    onClose: onCloseAddNewCategory,
  } = useDisclosure()

  const toast = useToast()

  const [category, setCategory] = useState([])

  const fetchCategory = async () => {
    try {
      const response = await axiosInstance.get(`/admin/book-categories?`, {})

      setCategory(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const renderCategory = () => {
    return category.map((val) => {
      console.log(val)
      return (
        <Tr height={"100px"}>
          <Td>{val.category_name}</Td>

          <Td>
            <Box>
              <Button
                width={"100px"}
                colorScheme={"green"}
                color="white"
                mr="2"
                onClick={() => setOpenedEdit(val)}
              >
                Edit
              </Button>

              <Button
                width={"100px"}
                bgColor={"red"}
                color="white"
                onClick={() => deleteCategoryHandler(val.id)}
              >
                Delete
              </Button>
            </Box>
          </Td>
        </Tr>
      )
    })
  }

  const genreFormik = useFormik({
    initialValues: {
      category_name: "",
    },
    onSubmit: async ({ category_name }) => {
      try {
        const response = await axiosInstance.post("/admin/book-categories", {
          category_name,
        })

        toast({
          title: "Genre added",
          status: "success",
          description: response.data.message,
        })
        genreFormik.setFieldValue("category_name", "")
      } catch (error) {
        console.log(error)
        toast({
          title: "Failed add genre",
          description: error.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      category_name: Yup.string().required(),
    }),
    validateOnChange: false,
  })

  const genreFormChangeHandler = ({ target }) => {
    const { name, value } = target
    genreFormik.setFieldValue(name, value)
  }

  const deleteCategoryHandler = async (id) => {
    try {
      await axiosInstance.delete(`/admin/book-categories/${id}`)

      fetchCategory()

      toast({
        title: "Book Deleted",
        status: "info",
      })
    } catch (error) {
      console.log(error)
    }
  }

  const editFormik = useFormik({
    initialValues: {
      category_name: "",
    },
    onSubmit: async ({ category_name }) => {
      try {
        const response = await axiosInstance.patch(
          `/admin/book-categories/${openedEdit.id}`,
          {
            category_name,
          }
        )

        toast({
          title: "Category Edited",
          description: response.data.message,
          status: "success",
        })
        editFormik.setFieldValue("category_name", "")
        setOpenedEdit(null)
      } catch (err) {
        console.log(err)
        toast({
          title: "Failed Edit Book",
          description: err.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      category_name: Yup.string().required(),
    }),
    validateOnChange: false,
  })

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target
    editFormik.setFieldValue(name, value)
  }

  useEffect(() => {
    fetchCategory()
  }, [category])

  return (
    <Box bg={"lightgrey"} p={"40px"} pt={"65px"}>
      <Grid textAlign={"center"} templateColumns="1fr .7fr 1fr" p="6">
        <GridItem></GridItem>
        <GridItem>
          <Text fontSize={"4xl"} fontWeight="bold">
            Admin Dashboard
          </Text>
        </GridItem>
        <GridItem textAlign={"end"} my="auto">
          <Button
            bgColor={"telegram.500"}
            color="white"
            onClick={onOpenAddNewCategory}
          >
            Add New Category
          </Button>
        </GridItem>
      </Grid>
      <Box>
        <TableContainer borderRadius={"15px"} w="fit-content" marginX={"auto"}>
          <Table
            variant="unstyled"
            colorScheme="#43615f"
            bgColor={"white"}
            justifyItems="center"
          >
            <Thead>
              <Tr>
                <Th>Genre</Th>
                <Th>Option</Th>
              </Tr>
              {renderCategory()}
            </Thead>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal Add New Genre */}
      <Modal
        isOpen={isOpenAddNewCategory}
        onClose={onCloseAddNewCategory}
        motionPreset="slideInBottom"
        size={"lg"}
      >
        <form onSubmit={genreFormik.handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Genre</ModalHeader>

            <ModalBody>
              <FormControl isInvalid={genreFormik.errors.category_name}>
                <FormLabel>Genre</FormLabel>
                <Input
                  name="category_name"
                  type={"text"}
                  onChange={genreFormChangeHandler}
                  value={genreFormik.values.category_name}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onCloseAddNewCategory}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                mr={3}
                onClick={onCloseAddNewCategory}
                type="submit"
              >
                Add New
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>

      {/* modal untuk edit */}
      <Modal isOpen={openedEdit} onClose={() => setOpenedEdit(null)}>
        <ModalContent>
          <ModalHeader>Edit Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={editFormik.errors.category_name}>
              <FormLabel>Genre </FormLabel>
              <Input
                name="category_name"
                type={"text"}
                onChange={editFormChangeHandler}
                value={editFormik.values.category_name}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => setOpenedEdit(null)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              mr={3}
              onClick={() => editFormik.handleSubmit()}
              type="submit"
            >
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AdminCategory
