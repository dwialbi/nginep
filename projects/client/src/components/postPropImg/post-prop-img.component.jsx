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
  const deleteRef = useRef()
  const params = useParams()
  const navigate = useNavigate()
  const [propertyImage, setPropertyImage] = useState([])
  const [openId, setOpenId] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  // =============================== Get Prop Image ========================================
  const getProperty = async () => {
    try {
      const responseProp = await axiosInstance.get(`/property/${params.id}`)
      console.log(responseProp.data)
      setPropertyImage(responseProp.data.data.PropertyImages)
    } catch (err) {
      console.log(err)
    }
  }

  // =============================== Delete Image =========================================
  const DeleteImg = async (id) => {
    try {
      await axiosInstance.delete(`/property/delete/image/${openId.id}`)
      getProperty()
      setOpenId(null)
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
        `/property/image/${params.id}`,
        newImgProp
      )
      window.location.reload(false)
      // console.log(responseImg)
      toast({
        title: "Image succesfull added",
        description: responseImg.data.message,
        status: "success",
      })
    } catch (err) {
      console.log(err)
      toast({
        title: "Failed to added new image",
        // description: responseImg.data.message,
        status: "error",
      })
    }
  }
  // ===================================================================================

  useEffect(() => {
    getProperty()
  }, [openId])
  return (
    <Box
      mt="100px"
      ml="7px"
      w={{ base: "54vh", md: "99vw" }}
      p="10px"
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
      <Center display="grid">
        <Box
          // mt="50px"
          // mb="20px"
          margin={{ base: "50px 10px 50px", md: "30px auto 70px" }}
          width="35%"

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

        {/* <SimpleGrid columns={2} spacingY="20px"> */}
        <Box
          position="relative"
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          justifyContent="space-evenly"
          textAlign="center"
          gridGap={{ base: "10px", sm: "50px" }}
        >
          {propertyImage.map((val) => (
            <Box
              maxW={{ base: "sm", md: "xl" }}
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
                position="absolute"
                ml={{ base: "140px", md: "40.5vh" }}
                mt={{ base: "2px", sm: "8px" }}
                border="none"
                color="white"
                colors
                onClick={() => {
                  setOpenId(val)
                  onOpen()
                }}
                size={{ base: "sm", sm: "sm" }}
                cursor="pointer"
              />
              <Button
                onClick={() => {
                  DeleteImg(val.id)
                }}
                ref={deleteRef}
                display="none"
              />

              <Image
                borderRadius="8px"
                width="100%"
                h="100%"
                objectFit="cover"
                // src={val.image_url}
                src={`http://localhost:8000/public/propImg/${val.image_url}`}
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
                          // deleteRef.current.click()
                          DeleteImg(val.id)

                          onClose()
                        }}
                        _hover={{
                          bgColor: "red.600",
                          borderRadius: "8px",
                        }}
                        mb="20px"
                      >
                        Delete
                      </Button>
                    </Center>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
          ))}
        </Box>
      </Center>
      {/* </SimpleGrid> */}
    </Box>
  )
}

export default PostPropImg
