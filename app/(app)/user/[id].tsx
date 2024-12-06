import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import React from "react";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/ctx";
import { Usuario } from "@/app/_layout";
import UserDesc from "@/components/UserDesc";
import Navbar from "@/components/Navbar";
import { MessageSquareMore, MoveLeft } from "lucide-react-native";

const Perfil = () => {
  const params = useGlobalSearchParams();

  const router = useRouter();

  const { data } = useQuery({
    queryKey: ["tecnicosId", params.id],
    queryFn: async () => {
      const res = await api.get<Usuario>(`/tecnicos/${params.id}`);
      return res.data;
    },
  });

  return (
    <ScrollView style={{ flex: 1 }}>
      <Navbar />
      <MoveLeft
        style={{
          marginHorizontal: 24,
          marginTop: 16,
        }}
        color={"black"}
        size={24}
        onPress={() => router.back()}
      />
      <View
        style={{
          marginTop: 16,
          marginHorizontal: 16,
          backgroundColor: "#fff",
          padding: 16,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
        }}
      >
        <Image
          source={{ uri: "http://placebeard.it/200/200" }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 150,
            borderColor: "#1f64ad",
            borderWidth: 5,
          }}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 16 }}>
          {data?.nome}
        </Text>
        <Text style={{ fontSize: 16, marginTop: 16 }}>
          {data?.bio ?? "Nenhuma bio"}
        </Text>
        <Text style={{ fontSize: 14, marginTop: 16 }}>Técnico verificado</Text>
      </View>
      <TouchableOpacity
        style={{
          marginTop: 16,
          backgroundColor: "#fff",
          padding: 16,
          marginHorizontal: 16,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          borderRadius: 8,
        }}
        onPress={() => {
          Linking.openURL("https://wa.me/" + data?.zap);
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            marginRight: 8,
          }}
        >
          Iniciar um chamado
        </Text>
        <MessageSquareMore color={"black"} size={24} />
      </TouchableOpacity>
      <View
        style={{
          marginHorizontal: 16,
          marginTop: 16,
          backgroundColor: "#fff",
          padding: 16,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            textAlign: "left",
          }}
        >
          Boa tarde, {data?.nome}
        </Text>
        <View>
          <UserDesc
            primeroTexto="Relacionamento"
            segundoTexto={data?.relacionamento}
          />
          <UserDesc primeroTexto="Idade" segundoTexto={data?.idade} />
          <UserDesc primeroTexto="País" segundoTexto={"Brasil"} />
          <UserDesc primeroTexto="Cidade" segundoTexto={"Pelotas - RS"} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Perfil;
