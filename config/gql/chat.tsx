import { gql } from "@apollo/client";

// there will be a same query in inbox screen, write merge function in cache policy
export const CHAT_QUERY = gql`
  query ChatQuery($chatId: String) {
    me {
      id
      userName
      avatar
    }
    allChats(chatId: $chatId) {
      id
      type
      chatMeta # with id, userName, avatar
      users {
        user {
          id
          avatar
          userName
        }
      }
      messages {
        id
        _id: id
        text
        image
        audio
        video
        createdAt
        quotedContent
        sent
        user {
          id
          _id: id
          avatar
          userName
        }
        chat {
          id
        }
      }
    }
  }
`;

export const CHAT_SUBSCRIPTION = gql`
  subscription SubMessage {
    newMessage {
      id
      _id: id
      text
      image
      video
      audio
      quotedContent
      createdAt
      sent
      user {
        id
        _id: id
        userName
        avatar
      }
      chat {
        id
      }
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation CreateMessage($chatId: String, $receiverId: String, $text: String!) {
    sendMessage(chatId: $chatId, receiverId: $receiverId, text: $text) {
      id
      _id: id
      text
      image
      audio
      video
      createdAt
      sent
      quotedContent
      user {
        id
        _id: id
        userName
        avatar
      }
      chat {
        id
      }
    }
  }
`;

export const updateChatsWithNewMessage = (
  existingData: any,
  newMessage: any,
) => {
  const newData = existingData.allChats.map((chat) => {
    if (chat.id === newMessage.chat.id) {
      // Check if the newMessage.id is not already in the chat.messages
      const isMessageExists = chat.messages.some(
        (message) => message.id === newMessage.id,
      );
      if (!isMessageExists) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
    }
    return chat;
  });
  return newData;
};
