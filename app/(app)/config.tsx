import React from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import Navbar from "@/components/Navbar";
import { useSession } from "@/ctx";
import { MoveLeft } from "lucide-react-native";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Usuario } from "../_layout";

const Config = () => {
  const { signOut } = useSession();

  const user = SecureStore.getItem("usuario");
  const usuario = (JSON.parse(user as string) as Usuario) || null;

  return (
    <ScrollView style={styles.container}>
      <Navbar />
      <MoveLeft
        style={styles.backButton}
        color={"black"}
        size={24}
        onPress={() => router.replace("/")}
      />

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: usuario?.avatar || "http://placebeard.it/200/200",
          }}
          style={styles.avatar}
        />

        <Text style={styles.name}>{usuario?.nome}</Text>

        {/* Exibe a bio do usuário ou um texto padrão se estiver vazia */}
        <Text style={styles.bio}>
          {usuario?.bio || "Nenhuma bio adicionada."}
        </Text>

        {/* Botão para editar a bio */}
        <View style={styles.editBioButtonContainer}>
          <Link
            href={{
              pathname: "/(app)/alterarBio",
              params: { user: JSON.stringify(usuario) },
            }}
            asChild
          >
            <Button title="Editar Bio" />
          </Link>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Idade:</Text>
          <Text style={styles.infoValue}>{usuario?.idade}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{usuario?.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Relacionamento:</Text>
          <Text style={styles.infoValue}>{usuario?.relacionamento}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>WhatsApp:</Text>
          <Text style={styles.infoValue}>{usuario?.zap}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Técnico:</Text>
          <Text style={styles.infoValue}>
            {usuario?.tecnico ? "Sim" : "Não"}
          </Text>
        </View>
      </View>

      <Button title="Sair da conta" onPress={signOut} color="#FF5C5C" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  backButton: {
    marginHorizontal: 24,
    marginTop: 16,
  },
  profileContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  bio: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  editBioButtonContainer: {
    marginBottom: 16, // Espaçamento entre o botão e as informações
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  infoValue: {
    fontSize: 16,
    color: "#777",
  },
});

export default Config;
