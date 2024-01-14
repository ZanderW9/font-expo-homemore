import { useQuery, useMutation } from "@apollo/client";
import { View, Text } from "@components/Themed";
import { CHAT_QUERY, SEND_MESSAGE_MUTATION } from "@config/gql/chat";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { GiftedChat, Bubble, Message } from "react-native-gifted-chat";

const ChatScreen = () => {
  const messageContainerRef = useRef();
  const { chatId } = useLocalSearchParams();
  const { data } = useQuery(CHAT_QUERY, {
    variables: { chatId },
  });
  const [messageText, setMessageText] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);
  useEffect(() => {
    if (data?.me?.chats[0].chat?.messages) {
      setMessages(data?.me?.chats[0].chat?.messages);
      setMyId(data?.me?.id);
    }
  }, [data]);

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: `chat` }} />
      <GiftedChat
        messageContainerRef={messageContainerRef}
        messagesContainerStyle={{ backgroundColor: "#f5f5f5" }}
        messages={messages}
        inverted={false}
        scrollToBottom
        onInputTextChanged={(text) => {
          setMessageText(text);
        }}
        onSend={() => {
          sendMessage({
            variables: {
              chatId,
              text: messageText,
            },
          });
          if (messageContainerRef.current) {
            messageContainerRef.current.scrollToEnd();
          }
        }}
        showAvatarForEveryMessage
        user={{
          _id: myId,
        }}
        showUserAvatar
        renderBubble={(props) => {
          const alignSelf =
            props.currentMessage.user._id === myId ? "flex-end" : "flex-start";
          return (
            <View style={{ backgroundColor: "transparent" }}>
              <Text style={{ color: "grey", padding: 2, alignSelf }}>
                {props.currentMessage.user.userName}
              </Text>
              <Bubble
                {...props}
                wrapperStyle={{
                  left: {
                    backgroundColor: "white",
                  },
                }}
              />
            </View>
          );
        }}
        renderAvatar={(props) => {
          return (
            <Image
              source={{ uri: props.currentMessage.user.avatar }}
              style={{
                width: 45,
                height: 45,
                borderRadius: 25,
                top: 8,
              }}
            />
          );
        }}
        renderMessage={(props) => {
          return (
            <Message
              {...props}
              containerStyle={{
                left: {
                  alignItems: "flex-start",
                  marginVertical: 3,
                },
                right: {
                  alignItems: "flex-start",
                  marginVertical: 3,
                },
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default ChatScreen;
