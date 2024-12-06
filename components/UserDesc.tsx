import { View, Text } from "react-native";
import React from "react";

const UserDesc = ({
  primeroTexto,
  segundoTexto,
}: {
  primeroTexto: string;
  segundoTexto: string | number | undefined;
}) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {primeroTexto}:
      </Text>
      <Text
        style={{
          fontSize: 16,
          marginLeft: 8,
        }}
      >
        {segundoTexto}
      </Text>
    </View>
  );
};

export default UserDesc;
