import { View } from "@components/Themed";
import InboxList from "@components/inbox/InboxList";
import { CHAT_QUERY } from "@config/gql/chat";
import useCachedQuery from "@config/useCachedQuery";
import { usePathname } from "expo-router";
import React from "react";

export default function InboxView() {
  const { data, refetch } = useCachedQuery(CHAT_QUERY, usePathname());

  return (
    <View style={{ flex: 1 }}>
      {data && <InboxList data={data} refetch={refetch} />}
    </View>
  );
}
