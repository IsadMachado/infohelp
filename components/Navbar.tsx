import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Cog } from "lucide-react-native";
import { router } from "expo-router";

const Navbar = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        backgroundColor: "#fff",
      }}
    >
      <Image
        source={require("../assets/info.png")}
        style={{ width: 100, height: 100 }}
      />
      <TouchableOpacity onPress={() => router.replace("/config")}>
        <Cog color={"black"} size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
