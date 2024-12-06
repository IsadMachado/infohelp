// app/alterarBio.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { router, useGlobalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Navbar from "@/components/Navbar";
import { MoveLeft } from "lucide-react-native";
import { Usuario } from "../_layout";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/ctx";

const AlterarBio = () => {
  const params = useGlobalSearchParams();

  let usuario: Usuario | null = null;
  if (typeof params.user === "string") {
    try {
      usuario = JSON.parse(params.user) as Usuario;
    } catch (error) {
      console.error("Não foi possível parsear o usuário:", error);
      usuario = null;
    }
  }

  const [bio, setBio] = useState(usuario?.bio ?? "");

  const mutation = useMutation({
    mutationFn: async (data: string) => {
      if (!usuario?.id) return;
      const res = await api.put("/bio/" + usuario.id, { bio: data });

      const updatedUser = { ...usuario, bio: data };
      await SecureStore.setItemAsync("usuario", JSON.stringify(updatedUser));

      router.replace("/config");

      return res.data;
    },
  });

  return (
    <View style={styles.container}>
      <Navbar />
      <MoveLeft
        style={styles.backButton}
        color={"black"}
        size={24}
        onPress={() => router.replace("/config")}
      />
      <Text style={styles.title}>Editar Bio</Text>
      <TextInput
        style={styles.textInput}
        value={bio}
        onChangeText={setBio}
        placeholder="Digite sua nova bio..."
        multiline
      />
      <Button
        title={mutation.isPending ? "Salvando..." : "Salvar"}
        onPress={() => mutation.mutate(bio)}
      />
    </View>
  );
};

export default AlterarBio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  backButton: {
    marginVertical: 16,
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
    color: "#333",
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
});
