import {
  AvatarBadge,
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import "./post-prop-img.styles.css"
import { useEffect, useRef, useState } from "react"
import { BsUpload } from "react-icons/bs"
import { useNavigate, useParams } from "react-router-dom"
import { axiosInstance } from "../../api"

const PostPropImg = () => {
  const toast = useToast()
  const inputFileRef = useRef()
  const submitRef = useRef()
  const params = useParams()
  const navigate = useNavigate()
  const [propertyImage, setPropertyImage] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()

  // =============================== Get Prop Image ========================================
  const getProperty = async () => {
    try {
      const responseProp = await axiosInstance.get(
        `tenant/property/${params.id}`
      )
      setPropertyImage(responseProp.data.data.PropertyImages)
    } catch (error) {
      console.log(error)
    }
  }
  // =============================== Delete Image =========================================
  const DeleteImg = async (id) => {
    try {
      await axiosInstance.delete(`/tenant/property/image/${id}`)
      getProperty()
      // window.location.reload(false)
      // navigate(0)
      toast({ title: "Image deleted", status: "info" })
    } catch (err) {
      console.log(err)
    }
  }

  // ============================== Post Img =============================================
  const handleSubmit = async (event) => {
    try {
      let newImgProp = new FormData()
      newImgProp.append("image_url", event)
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
  }
  // ===================================================================================

  useEffect(() => {
    getProperty()
  }, [])
  return (
    <Box
      mt="100px"
      ml="10px"
      w={{ base: "54vh", md: "76vh" }}
      // textAlign={{ base: "center", md: "center" }}
      // border="1px solid black"
    >
      <ArrowBackIcon
        mr="70vh"
        mt="15px"
        fontSize="25px"
        onClick={() => {
          navigate(-1)
        }}
      />
      <Box
        // mt="50px"
        // mb="20px"
        margin={{ base: "50px 10px 50px ", md: "30px auto 30px" }}
        width="50%"
        // justifyContent="center"
        // alignItems="center"
      >
        <Text as="b" fontSize="xx-large" position="absolute" ml="20px">
          Update Your Images
        </Text>
        <br />
        <br />
        <br />

        <Input
          label="Image"
          name="image_url"
          type="file"
          accept="image/*"
          onChange={(event) => {
            handleSubmit(event.target.files[0])
          }}
          display="none"
          ref={inputFileRef}
        />
        <button
          className="btn-img-update"
          onClick={() => {
            inputFileRef.current.click()
            submitRef.current.click()
          }}
        >
          <Flex gap="10px">
            <Center>
              <BsUpload />
            </Center>
            <Text>Choose Images</Text>
          </Flex>
        </button>
      </Box>
      {/* <Flex p={50} w="full" alignItems="center" justifyContent="center"> */}

      <SimpleGrid columns={2} spacingY="20px">
        {propertyImage.map((val) => (
          <Box
            maxW="sm"
            borderWidth="1px"
            rounded="lg"
            shadow="370px"
            display="flex"
            p="4px"
            mb="24px"
            boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 20px"}
            borderRadius="8px"
            // border="1px solid red"
          >
            <CloseButton
              ml={{ base: "135px", md: "335px" }}
              mt="5px"
              position="absolute"
              border="none"
              color="white"
              colors
              onClick={onOpen}
            />
            <Image
              borderRadius="8px"
              width="100%"
              h="100%"
              objectFit="cover"
              src={val.image_url}
            />
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent mb="250px">
                <ModalCloseButton border="none" />
                <ModalBody>
                  <Text
                    mt="30px"
                    textAlign="center"
                    mb="50px"
                    fontSize="20px"
                    fontWeight="bold"
                  >
                    Are you sure want to delete this image?
                  </Text>
                  <Center>
                    <Button
                      width="200px"
                      color="white"
                      bgColor="red.500"
                      borderRadius="8px"
                      onClick={() => {
                        DeleteImg(val.id)
                        onClose()
                      }}
                      _hover={{
                        bgColor: "red.600",
                        borderRadius: "8px",
                      }}
                    >
                      Delete
                    </Button>
                  </Center>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default PostPropImg
