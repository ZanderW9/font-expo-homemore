import { gql, useQuery } from "@apollo/client";
import { View } from "@components/Themed";
import InboxList from "@components/inbox/InboxList";
import React from "react";

const inboxViewQuery = gql`
  query inboxViewQuery {
    me {
      chats {
        chat {
          id
          users {
            user {
              avatar
              id
              userName
              email
            }
          }
          messages {
            text
          }
        }
      }
    }
  }
`;

export default function InboxView() {
  const { loading, data, refetch } = useQuery(inboxViewQuery);
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      {data && <InboxList data={data} refetch={refetch} loading={loading} />}
    </View>
  );
}
