import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MoveLeft } from "lucide-react-native";
import { router } from "expo-router";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons"; // Para ícone do olho
import { api } from "@/ctx"; // Assegure-se de que 'api' está configurado corretamente

// Definição do schema de validação com Zod
const registerSchema = z.object({
  nome: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.string().email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  idade: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Idade deve ser um número válido",
  }),
  zap: z
    .string()
    .min(1, { message: "Telefone é obrigatório" })
    .regex(/^\d+$/, { message: "Telefone deve conter apenas números" }),
  tecnico: z.boolean().optional(),
  relacionamento: z.enum(["SOLTEIRO", "CASADO"], {
    required_error: "Relacionamento é obrigatório",
  }),
});

type RegisterType = z.infer<typeof registerSchema>;

export default function Register() {
  const { control, handleSubmit, formState, setError } = useForm<RegisterType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      idade: "",
      zap: "",
      tecnico: false,
      relacionamento: "SOLTEIRO",
    },
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  async function onSubmit(data: RegisterType) {
    const normalizedData = {
      ...data,
      email: data.email.trim().toLowerCase(),
      idade: Number(data.idade),
    };

    try {
      await api.post("/usuario", normalizedData);
      router.replace("/");
    } catch (error: any) {
      console.log("Erro ao criar usuário:", error);
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert("Erro", error.response.data.error);
        setError("root", {
          message: error.response.data.error,
        });
      } else {
        Alert.alert("Erro", "Ocorreu um erro ao cadastrar o usuário.");
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <MoveLeft
          style={styles.backButton}
          color={"black"}
          size={24}
          onPress={() => router.replace("/")}
        />

        <Text style={styles.title}>Crie sua Conta</Text>

        <Controller
          name="nome"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  formState.errors.nome && styles.errorBorder,
                ]}
                placeholder="Nome"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {formState.errors.nome && (
                <Text style={styles.errorText}>
                  {formState.errors.nome.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  formState.errors.email && styles.errorBorder,
                ]}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {formState.errors.email && (
                <Text style={styles.errorText}>
                  {formState.errors.email.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          name="senha"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { flex: 1 },
                    formState.errors.senha && styles.errorBorder,
                  ]}
                  placeholder="Senha"
                  secureTextEntry={!passwordVisible}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                  style={styles.iconContainer}
                >
                  <Ionicons
                    name={passwordVisible ? "eye" : "eye-off"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              {formState.errors.senha && (
                <Text style={styles.errorText}>
                  {formState.errors.senha.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          name="idade"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  formState.errors.idade && styles.errorBorder,
                ]}
                placeholder="Idade"
                keyboardType="number-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {formState.errors.idade && (
                <Text style={styles.errorText}>
                  {formState.errors.idade.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          name="zap"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  formState.errors.zap && styles.errorBorder,
                ]}
                placeholder="Telefone (WhatsApp)"
                keyboardType="phone-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {formState.errors.zap && (
                <Text style={styles.errorText}>
                  {formState.errors.zap.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          name="tecnico"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Sou Técnico</Text>
              <Switch
                value={value}
                onValueChange={onChange}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={value ? "#1f64ad" : "#f4f3f4"}
              />
            </View>
          )}
        />

        <Controller
          name="relacionamento"
          control={control}
          render={({ field: { onChange, value } }) => (
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Estado Civil</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => {
                  const novoEstado =
                    value === "SOLTEIRO" ? "CASADO" : "SOLTEIRO";
                  onChange(novoEstado);
                }}
              >
                <Text style={styles.pickerText}>{value}</Text>
              </TouchableOpacity>
              {formState.errors.relacionamento && (
                <Text style={styles.errorText}>
                  {formState.errors.relacionamento.message}
                </Text>
              )}
            </View>
          )}
        />

        {formState.errors.root && (
          <Text style={styles.globalErrorText}>
            {formState.errors.root.message}
          </Text>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit(onSubmit)}
          disabled={formState.isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {formState.isSubmitting ? (
              <ActivityIndicator color={"white"} />
            ) : (
              "Registrar"
            )}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#1f64ad",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f0f4f7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4f7",
    borderRadius: 8,
    paddingRight: 16,
  },
  iconContainer: {
    position: "absolute",
    right: 16,
  },
  errorText: {
    color: "red",
    marginTop: 4,
    marginLeft: 4,
    fontSize: 14,
  },
  globalErrorText: {
    color: "red",
    fontSize: 18,
    marginBottom: 16,
  },
  errorBorder: {
    borderColor: "red",
    borderWidth: 1,
  },
  switchContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  pickerButton: {
    backgroundColor: "#f0f4f7",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#1f64ad",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
