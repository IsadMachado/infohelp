import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "../ctx";
import { Eye, EyeOff } from "lucide-react-native";
import { router } from "expo-router";
import { resolveValue } from "@backpackapp-io/react-native-toast";
import { toast } from "@backpackapp-io/react-native-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string({ message: "Senha inválida" })
    .min(1, { message: "Digite a senha" }),
});

export type LoginType = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useSession();

  const { handleSubmit, control, formState, setError } = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  async function handleLogin(data: LoginType) {
    try {
      await login(data);
      toast.success("Logado com sucesso!");
      router.replace("/");
    } catch (e: any) {
      setError("root", {
        message: e.response.data.erro,
      });
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Image
        source={require("../assets/info.png")}
        style={{ width: 150, height: 150 }}
      />
      <View>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{ required: "Email é obrigatório" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[
                styles.input,
                formState.errors.email && styles.errorBorder,
              ]}
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {formState.errors.email && (
          <Text style={styles.errorText}>{formState.errors.email.message}</Text>
        )}

        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: "A senha é obrigatória" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  [styles.input, { minWidth: "40%" }],
                  { flex: 1 },
                  formState.errors.password && styles.errorBorder,
                ]}
                placeholder="Senha"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry={!passwordVisible}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={{ marginRight: 16 }}
              >
                {passwordVisible ? (
                  <EyeOff color={"black"} size={24} />
                ) : (
                  <Eye color={"black"} size={24} />
                )}
              </TouchableOpacity>
            </View>
          )}
        />
        {formState.errors.password && (
          <Text style={styles.errorText}>
            {formState.errors.password.message}
          </Text>
        )}
      </View>
      {formState.errors.root && (
        <Text style={styles.errorText}>{formState.errors.root.message}</Text>
      )}

      <TouchableOpacity
        style={{
          backgroundColor: "#1f64ad",
          padding: 16,
          borderRadius: 8,
          marginTop: 16,
          minWidth: "90%",
        }}
        onPress={handleSubmit(handleLogin)}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {formState.isSubmitting ? (
            <ActivityIndicator color={"#fff"} />
          ) : (
            "Entrar"
          )}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "#1f64ad",
          padding: 16,
          borderRadius: 8,
          marginTop: 16,
          minWidth: "90%",
        }}
        onPress={() => router.replace("/register")}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#1f64ad",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Criar conta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#eff3f8",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: "90%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eff3f8",
    borderRadius: 8,
    marginTop: 16,
  },
  iconContainer: {
    padding: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  errorBorder: { borderColor: "red", borderWidth: 1 },
});
