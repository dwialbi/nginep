import {
  Box,
  Button,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
} from "firebase/auth"
import { useState } from "react"
import { useRef } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import CgsPass from "../changePassword/changePassword.component"
const ReAuth = ({ isOpen, onOpen, onClose }) => {
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const toast = useToast()
  const authSelector = useSelector((state) => state.auth)
  const passwordRef = useRef()
  const focusRef = useRef()
  const auth = getAuth()
  const user = auth.currentUser
  const [reAuth, setReAuth] = useState("")
  const [compareAuth, setCompareAuth] = useState("")
  const [openModal, setOpenModal] = useState(false)
  const [closeModal, setCloseModal] = useState(true)
  const [modalClose, setModalClose] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const credential = EmailAuthProvider.credential(
      authSelector?.email,
      passwordRef.current.value
      //   setPassword.current.value
    )

    try {
      const reAtuhResponse = await reauthenticateWithCredential(
        user,
        credential
      )
      onClose(closeModal)
      console.log(reAtuhResponse)
      setReAuth(reAtuhResponse.user)
      if (reAtuhResponse) {
        // console.log("test")
        toast({
          title: "Success re enter your password",
          description: "Please enter your new password",
          status: "success",
        })
        // return
        // setCloseModal(false)
        setOpenModal(true)
        setModalClose(false)
      } else {
        throw e
      }

      // console.log(reAuth)
      // navigate("/changepassword")
    } catch (err) {
      console.log(err)
      toast({
        title: "Wrong password",
        description: "Please re-check your password",
        status: "error",
      })
    }
  }
  console.log(reAuth)

  return (
    <>
      <Modal
        initialFocusRef={focusRef}
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent height="300px" borderRadius="10px">
          <ModalHeader borderRadius="10px">
            <Text>Re Enter Your Password</Text>
          </ModalHeader>

          <ModalCloseButton border="none" />
          <ModalBody mt="80px">
            <form onSubmit={handleSubmit}>
              <FormLabel>Email</FormLabel>
              <FormLabel>{authSelector.email}</FormLabel>
              <FormLabel>Enter your password</FormLabel>
              <Input ref={passwordRef} {...{ passwordRef }} />
              <Button
                mt="20px"
                type="submit"
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.400" }}
                width="130px"
              >
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
      <CgsPass
        openModal={openModal}
        setOpenModal={setOpenModal}
        closeModal={closeModal}
        // onClose={onClose}
      />
    </>
  )
}

export default ReAuth
