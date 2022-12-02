import {
  AvatarBadge,
  Box,
  Button,
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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../../api"

const PostPropImg = () => {
  const toast = useToast()
  const inputFileRef = useRef()
  const submitRef = useRef()
  const params = useParams()

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
    console.log(event)
  }
  // ===================================================================================

  useEffect(() => {
    getProperty()
  }, [])
  return (
    <Box mt="150px" ml="5px">
      <Text as="b" fontSize="xx-large">
        Update Your Images
      </Text>
      <Box mt="50px" mb="20px">
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
        <Button
          onClick={() => {
            inputFileRef.current.click()
            submitRef.current.click()
          }}
        >
          Choose Images
        </Button>
      </Box>
      <Grid
        templateColumns="repeat(2,1fr)"
        display="flex"
        flexWrap="wrap"
        gap="10px"
        spacing="10"
      >
        <GridItem w="100%" h="10">
          {/* <Flex p={50} w="full" alignItems="center" justifyContent="center"> */}
          {propertyImage.map((val) => (
            <Box
              maxW="sm"
              borderWidth="1px"
              rounded="lg"
              shadow="370px"
              position="relative"
            >
              <CloseButton
                ml="310px"
                pos="absolute"
                border="none"
                color="white"
                colors
                onClick={onOpen}
              />
              <Image rounded="lg" w="350px" src={val.image_url} />
              <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text textAlign="center" mb="50px">
                      APUS OPO ORA
                    </Text>
                    <Button
                      alignSelf="center"
                      justifyContent="center"
                      onClick={() => DeleteImg(val.id)}
                    >
                      APUS COK!
                    </Button>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
          ))}
          {/* </Flex> */}
        </GridItem>
      </Grid>
    </Box>
  )
}

export default PostPropImg
