import { Box, Image, Text } from "@chakra-ui/react"
import { useFormik } from "formik"
import { useState } from "react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { axiosInstance } from "../../api"

const PaymentApproval = () => {
  const [paymentProof, setPaymentProof] = useState("")
  const [price, setPrice] = useState("")
  const [getStartDate, setGetStartDate] = useState("")
  const [getEndDate, setGetEndDate] = useState("")
  const [propertyName, setPropertyName] = useState("")
  const [roomType, setRoomType] = useState("")
  const [userEmail, setUserEmail] = useState("")

  const params = useParams()
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

  // ========================= Patch Status ============================
  const updateStatusTransaction = async () => {
    try {
      const responseStatusTransaction = await axiosInstance.patch(
        `/transaction/update/${params.id}`
      )
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
      <Text>{getStartDate}</Text>
      <Text>{getEndDate}</Text>
      <Text>{propertyName}</Text>
      <Text>{roomType}</Text>
      <Text>{userEmail}</Text>
    </Box>
  )
}

export default PaymentApproval
