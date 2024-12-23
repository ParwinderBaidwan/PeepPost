import { Box, Flex, Text, useColorModeValue, Input, Button, SkeletonCircle, Skeleton } from '@chakra-ui/react';
import {BsSearch} from 'react-icons/bs';
import React, { useEffect, useState } from 'react';
import Conversation from '../components/Conversation';
import {GiConversation} from 'react-icons/gi';
import MessageContainer from '../components/MessageContainer';
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';
 

const ChatPage = () => {
  const [searchingUser, setSearchingUser ] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const {socket, onlineUsers} = useSocket()
 
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if(data.error){
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally{
        setLoadingConversations(false);
      }
    };

    getConversations();
  },[showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if(searchedUser.error){
        showToast("Error", searchedUser.error, "error");
        return;
      }

      // if user is trying to message themselves
      if(searchedUser._id === currentUser._id ){
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      // if user is already in a conversation with the searched user
      if(conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)){
        setSelectedConversation({
          _id : conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)._id,
          userId : searchedUser._id,
          username : searchedUser.username,
          userProfilePic : searchedUser.profilePic
        });
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);

    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  }

  return (
    <Box
      position={"absolute"}
      left={"50%"}
      // left={"25%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      p={4}
      transform={"translateX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxWidth={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        {/* conversations on the left */}
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search for a user" onChange={(e) => setSearchText(e.target.value)} />
              <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser} >
                <BsSearch />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                isOnline={onlineUsers.includes(conversation.participants[0]._id)}
                conversation={conversation}
              />
            ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}> Select a conversation to start messaging</Text>
          </Flex>
        )}

        {/* messageContainer on the right */}
        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
}

export default ChatPage