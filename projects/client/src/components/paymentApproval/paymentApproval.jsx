import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Image,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { useState } from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../../api"
import Moment from "react-moment"

const PaymentApproval = () => {
  const [paymentProof, setPaymentProof] = useState("")
  const [price, setPrice] = useState("")
  const [getStartDate, setGetStartDate] = useState("")
  const [getEndDate, setGetEndDate] = useState("")
  const [propertyName, setPropertyName] = useState("")
  const [roomType, setRoomType] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const toast = useToast()
  const params = useParams()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const modalApprove = useDisclosure()
  const modalReject = useDisclosure()
  // ========================= Get Data Transaction ============================
  const getDataTransaction = async () => {
    try {
      const responseDataTransaction = await axiosInstance.get(
        `/transaction/user-data/${params.id}`
      )
      setPaymentProof(responseDataTransaction.data.data.payment_proof)
      setPrice(responseDataTransaction.data.data.price)
      setGetStartDate(responseDataTransaction.data.data.start_date)
      setGetEndDate(responseDataTransaction.data.data.end_date)
      setPropertyName(responseDataTransaction.data.data.Property.name)
      setRoomType(responseDataTransaction.data.data.PropertyItem.item_name)
      setUserEmail(responseDataTransaction.data.data.User.email)
      console.log(responseDataTransaction)
    } catch (err) {
      console.log(err)
    }
  }

  // ========================= Approve Payment ============================
  const acceptPayment = async () => {
    try {
      await axiosInstance.patch(`/transaction/approve/${params.id}`)
      toast({
        status: "success",
        title: "accept payment",
      })
      onClose(modalApprove.onClose)
    } catch (err) {
      console.log(err)
    }
  }

  // ========================= Approve Payment ============================
  const rejectPayment = async () => {
    try {
      await axiosInstance.patch(`/transaction/reject/${params.id}`)
      toast({
        status: "success",
        title: "reject payment",
      })
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getDataTransaction()
  }, [])
  return (
    <Box mt="150px">
      <Text color="black">Payment Approval</Text>
      <Image src={`http://localhost:8000/public/${paymentProof}`} />
      <Text>{price}</Text>
      <Moment format="YYYY-MM-DD, HH:mm:ss" add={{ hours: -7 }}>
        {getStartDate}
      </Moment>
      <br />
      <Moment format="YYYY-MM-DD, HH:mm:ss" add={{ hours: -7 }}>
        {getEndDate}
      </Moment>
      <Text>{propertyName}</Text>
      <Text>{roomType}</Text>
      <Text>{userEmail}</Text>
      <Button
        onClick={modalApprove.onOpen}
        backgroundColor="blue.600"
        color="white"
        _hover={{ backgroundColor: "blue.500" }}
        mr="10px"
        w="120px"
        border="none"
      >
        Accept
      </Button>
      <Button
        onClick={modalReject.onOpen}
        backgroundColor="red.600"
        color="white"
        _hover={{ backgroundColor: "red.500" }}
        mr="20px"
        w="120px"
        border="none"
      >
        Reject
      </Button>

      <AlertDialog
        motionPreset="slideInBottom"
        // leastDestructiveRef={cancelRef}
        onClose={modalApprove.onClose}
        isOpen={modalApprove.isOpen}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent h="200px">
            <AlertDialogHeader fontSize="30px" fontWeight="bold">
              Accept Payment
            </AlertDialogHeader>
            <AlertDialogCloseButton border="none" />
            <AlertDialogBody mt="85px" fontSize="18px">
              Are you sure you want to accept this payment?
            </AlertDialogBody>
            <AlertDialogFooter gap="10px">
              <Button
                onClick={acceptPayment}
                width="80px"
                backgroundColor="green.600"
                _hover={{ backgroundColor: "green.500" }}
                textColor="white"
                border="none"
              >
                Yes
              </Button>
              <Button
                onClick={modalApprove.onClose}
                width="80px"
                backgroundColor="red.600"
                textColor="white"
                _hover={{ backgroundColor: "red.500" }}
                border="none"
              >
                No
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        motionPreset="slideInBottom"
        // leastDestructiveRef={cancelRef}
        onClose={modalReject.onClose}
        isOpen={modalReject.isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent h="200px">
          <AlertDialogHeader fontSize="30px" fontWeight="bold">
            Reject Payment
          </AlertDialogHeader>
          <AlertDialogCloseButton border="none" />
          <AlertDialogBody mt="85px" fontSize="18px">
            Are you sure you want to reject this payment?
          </AlertDialogBody>
          <AlertDialogFooter gap="10px">
            <Button
              backgroundColor="green.600"
              _hover={{ backgroundColor: "green.500" }}
              textColor="white"
              onClick={rejectPayment}
              width="80px"
              border="none"
            >
              Yes
            </Button>
            <Button
              onClick={modalReject.onClose}
              width="80px"
              backgroundColor="red.600"
              textColor="white"
              _hover={{ backgroundColor: "red.500" }}
              border="none"
            >
              No
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  )
}

export default PaymentApproval
