import { gql } from "@apollo/client";

// there will be a same query in inbox screen, write merge function in cache policy
export const CHAT_QUERY = gql`
  query ChatQuery($chatId: String) {
    me {
      id
      chats(chatId: $chatId) {
        chat {
          id
          messages {
            _id: id
            text
            image
            video
            audio
            quotedContent
            createdAt
            user {
              _id: id
              userName
              avatar
            }
            chat {
              id
            }
          }
        }
      }
    }
  }
`;

export const CHAT_SUBSCRIPTION = gql`
  subscription SubMessage($chatId: String) {
    newMessage(chatId: $chatId) {
      id
      text
      image
      video
      audio
      quotedContent
      createdAt
      user {
        id
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
  mutation CreateMessage($chatId: String!, $text: String!) {
    sendMessage(chatId: $chatId, text: $text) {
      id
      sent
      quotedContent
      image
      text
      video
      createdAt
      user {
        id
      }
      chat {
        id
      }
    }
  }
`;
