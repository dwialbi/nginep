import {
  Box,
  chakra,
  Container,
  Stack,
  Text,
  Image,
  Flex,
  VStack,
  Button,
  Heading,
  SimpleGrid,
  StackDivider,
  useColorModeValue,
  List,
  ListItem,
  Divider,
  HStack,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { axiosInstance } from "../../api"
import { Link, useParams } from "react-router-dom"
// import RoomCard from "../components/RoomCard"
import { GrLinkPrevious } from "react-icons/gr"
import { BiEditAlt } from "react-icons/bi"

const ListingDetails = () => {
  const [listing, setListing] = useState([])
  const [room, setRoom] = useState([])
  const [propertyImage, setPropertyImage] = useState([])
  const params = useParams()

  const fetchListingDetails = async () => {
    try {
      const response = await axiosInstance.get(`tenant/property/${params.id}`)
      console.log(response)

      setListing(response.data.data)
      setRoom(response.data.data.PropertyItems)
      setPropertyImage(response.data.data.PropertyImages)
    } catch (err) {
      console.log(err)
    }
  }

  //   const renderRoomCard = () => {
  //     return room.map((val) => {
  //       return (
  //         <RoomCard
  //           id={val.id}
  //           item_name={val.item_name}
  //           capacity={val.capacity}
  //           price={val.price}
  //           description={val.description}
  //         />
  //       )
  //     })
  //   }

  useEffect(() => {
    fetchListingDetails()
  }, [])

  return (
    <Container maxW={"7xl"} mt="190px">
      <HStack p="3" pl="1" pr="1" justifyContent={"space-between"}>
        <Link to="/listing">
          <GrLinkPrevious size={"25px"} />
        </Link>
        <Link to="/edit">
          <BiEditAlt size={"25px"} />
        </Link>
      </HStack>
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 8, md: 10 }}
        pt={{ base: 18, md: 17 }}
      >
        <Flex>
          {propertyImage.length > 0 ? (
            <Image
              rounded={"md"}
              src={propertyImage[0].image_url}
              fit={"cover"}
              align={"center"}
              w={"100%"}
              h={{ base: "100%", sm: "400px", lg: "500px" }}
            />
          ) : (
            <Image
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNK7-n-r_w_qCEIjsnu8VXMBamUkSmLUr9Eg&usqp=CAU"
              }
            />
          )}
        </Flex>
        <Stack spacing={{ base: 6, md: 5 }}>
          <Box as={"header"}>
            <Heading
              lineHeight={2}
              fontWeight={600}
              fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
            >
              {listing.name}
            </Heading>

            <Text
              color={useColorModeValue("gray.500", "gray.400")}
              fontSize={"md"}
              fontWeight={"300"}
            >
              {listing.address}
            </Text>
          </Box>

          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={"column"}
            divider={
              <StackDivider
                borderColor={useColorModeValue("gray.200", "gray.600")}
              />
            }
          >
            <Text fontSize={"md"}>{listing.description}</Text>

            <Box>
              <Text
                fontSize={{ base: "16px", lg: "18px" }}
                color={useColorModeValue("yellow.500", "yellow.300")}
                fontWeight={"500"}
                textTransform={"uppercase"}
                mb={"4"}
              >
                Facilities
              </Text>

              <SimpleGrid columns={{ base: 3, md: 3 }} spacing={2}>
                <List spacing={2}>
                  <ListItem>Swimming Pool</ListItem>
                  <ListItem>Billiard Table</ListItem>
                  <ListItem>WiFi</ListItem>
                </List>
                <List spacing={2}>
                  <ListItem>Jacuzzi</ListItem>
                  <ListItem>Laundry</ListItem>
                  <ListItem>Bathtub</ListItem>
                </List>
                <List spacing={2}>
                  <ListItem>Restaurant</ListItem>
                  <ListItem>Gym</ListItem>
                  <ListItem>Parking Lot</ListItem>
                </List>
              </SimpleGrid>
            </Box>
          </Stack>
        </Stack>
      </SimpleGrid>
      <Box py={{ base: 18, md: 7 }}>
        <Divider borderColor={useColorModeValue("gray.200", "gray.600")} />
        <Text
          fontSize={{ base: "16px", lg: "18px" }}
          color={useColorModeValue("yellow.500", "yellow.300")}
          fontWeight={"500"}
          textTransform={"uppercase"}
          my={"4"}
        >
          Rooms
        </Text>

        <SimpleGrid columns={[1, 2, 3]} spacing={5}>
          {/* {renderRoomCard()} */}
        </SimpleGrid>
      </Box>
    </Container>
  )
}

export default ListingDetails
