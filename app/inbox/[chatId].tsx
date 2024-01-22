import { useQuery, useMutation } from "@apollo/client";
import { CHAT_QUERY, SEND_MESSAGE_MUTATION } from "@config/gql/chat";
import { Avatar, Input } from "@rneui/themed";
import { useLocalSearchParams, Stack, router } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { StyleSheet } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = () => {
  const messageContainerRef = useRef();
  const { chatId, userId, userName } = useLocalSearchParams();
  const { data } = useQuery(CHAT_QUERY, {
    variables: { chatId },
  });
  const [messageText, setMessageText] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);
  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    if (data?.allChats[0]?.messages) {
      setMessages(data?.allChats[0].messages);
      setMyId(data?.me?.id);
    }
  }, [data]);

  const onPressAvatar = (user: { id: string }) => {
    router.navigate(`/user/${user.id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
      <Stack.Screen
        options={{
          title: userName,
          animation: "slide_from_right",
          headerBackTitleVisible: false,
        }}
      />
      <GiftedChat
        messageContainerRef={messageContainerRef}
        messagesContainerStyle={{
          backgroundColor: "#f5f5f5",
        }}
        messages={messages}
        inverted={false}
        renderUsernameOnMessage={false}
        infiniteScroll
        onInputTextChanged={(text) => {
          setMessageText(text);
        }}
        renderInputToolbar={() => {
          return (
            <Input
              placeholder=""
              inputContainerStyle={{
                backgroundColor: "white",
                borderBottomWidth: 0,
                borderRadius: 30,
                height: 45,
                paddingHorizontal: 10,
                marginTop: 5,
              }}
              textAlignVertical="top"
              numberOfLines={3}
              maxLength={140}
              value={messageText}
              onChangeText={(text) => setMessageText(text)}
              rightIcon={{
                name: messageText ? "send" : "add",
                type: "material",
                onPress: () => {
                  if (!messageText) {
                    return;
                  }
                  setMessageText("");
                  sendMessage({
                    variables: {
                      receiverId: userId,
                      text: messageText,
                    },
                  });
                  if (messageContainerRef.current) {
                    messageContainerRef.current.scrollToEnd();
                  }
                },
              }}
            />
          );
        }}
        showAvatarForEveryMessage
        user={{
          _id: myId,
        }}
        showUserAvatar
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: "white",
                  marginBottom: 6,
                },
                right: {
                  marginBottom: 6,
                },
              }}
            />
          );
        }}
        renderAvatar={(props) => {
          if (props.currentMessage.user.avatar) {
            return (
              <Avatar
                size={44}
                rounded
                onPress={() => onPressAvatar(props.currentMessage.user)}
                containerStyle={styles.avatar}
                source={{ uri: props.currentMessage.user.avatar }}
              />
            );
          } else {
            return (
              <Avatar
                size={44}
                rounded
                onPress={() => onPressAvatar(props.currentMessage.user)}
                containerStyle={styles.avatar}
                title={props.currentMessage.user.userName?.slice(0, 2) ?? ""}
              />
            );
          }
        }}
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  avatar: {
    borderWidth: 0.5,
    bottom: 6,
    borderColor: "gray",
    borderStyle: "dashed",
    backgroundColor: "#F3EED9",
  },
});
