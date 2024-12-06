import {
  FlatList,
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import { api } from "../../ctx";
import { useQuery } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import Navbar from "@/components/Navbar";

export default function Index() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["tecnicos"],
    queryFn: async () => {
      const res = await api.get("/tecnicos");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={"#1f64ad"} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Ocorreu um erro ao carregar os técnicos.</Text>
        <Button title="Ir para o login" onPress={() => router.push("/login")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Busque Técnicos disponíveis</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/(app)/user/[id]",
              params: { id: item.id },
            }}
            asChild
          >
            <TouchableOpacity style={styles.item}>
              <Image
                source={{ uri: "http://placebeard.it/200/200" }}
                style={styles.image}
              />
              <Text style={styles.itemText}>{item.nome}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  item: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
