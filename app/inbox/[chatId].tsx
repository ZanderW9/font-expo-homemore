import { useQuery, useMutation } from "@apollo/client";
import { ChatContext } from "@app/_layout";
import { CHAT_QUERY, SEND_MESSAGE_MUTATION } from "@config/gql/chat";
import { useThemedColors } from "@constants/theme";
import { Avatar, Input } from "@rneui/themed";
import { useLocalSearchParams, Stack, router } from "expo-router";
import React, { useState, useRef, useEffect, useContext } from "react";
import { StyleSheet } from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

const ChatScreen = () => {
  const colors = useThemedColors();
  const { refetchChatId, setRefetchChatId } = useContext(ChatContext);
  const messageContainerRef = useRef();

  const { chatId, userId, userName } = useLocalSearchParams();
  const { data, refetch } = useQuery(CHAT_QUERY, {
    fetchPolicy: "cache-and-network",
    variables: { chatId },
  });

  useEffect(() => {
    if (refetchChatId === chatId) {
      refetch({ chatId });
      setRefetchChatId(null);
    }
  }, [refetchChatId]);

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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.back1 }}
      edges={["bottom"]}
    >
      <Stack.Screen
        options={{
          title: userName,
          animation: "slide_from_right",
          headerBackTitleVisible: false,
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: colors.back1,
          },
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      />
      <GiftedChat
        messageContainerRef={messageContainerRef}
        messagesContainerStyle={{
          backgroundColor: colors.back2,
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
                backgroundColor: colors.back2,
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
                  backgroundColor: colors.back1,
                  marginBottom: 6,
                },
                right: {
                  marginBottom: 6,
                },
              }}
              textStyle={{
                left: {
                  color: colors.text,
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
                titleStyle={{
                  justifyContent: "center",
                  alignSelf: "center",
                  fontSize: 30,
                  bottom: 3,
                }}
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
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#F3EED9",
  },
});
