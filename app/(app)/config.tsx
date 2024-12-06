import { View, Text, Button } from "react-native";
import React from "react";
import Navbar from "@/components/Navbar";
import { useSession } from "@/ctx";
import { MoveLeft } from "lucide-react-native";
import { router } from "expo-router";

const Config = () => {
  const { signOut } = useSession();
  return (
    <View>
      <Navbar />
      <MoveLeft
        style={{
          marginHorizontal: 24,
          marginVertical: 16,
        }}
        color={"black"}
        size={24}
        onPress={() => router.replace("/")}
      />
      <Button title="Sair da conta" onPress={signOut} />
    </View>
  );
};

export default Config;
