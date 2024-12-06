import {
  useContext,
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useStorageState } from "./useStorageState";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosResponse } from "axios";
import { LoginType } from "./app/login";

const AuthContext = createContext<{
  signIn: (token: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  login: (data: LoginType) => Promise<AxiosResponse<any, any>>;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  login: () => null as any,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

export const api = axios.create({
  baseURL: "http://192.168.8.8:4000",
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");

  const [initialLoading, setInitialLoading] = useState(true);

  async function getUser(id: number) {
    const res = await api.get("/usuario/" + id);
    SecureStore.setItemAsync("usuario", JSON.stringify(res.data));
    return res.data;
  }

  async function login(data: LoginType) {
    const res = await api.post("/login", {
      email: data.email,
      senha: data.password,
    });
    const token = res.data.token;
    await getUser(res.data.id);
    await SecureStore.setItemAsync("token", token);
    signIn(token);
    return res;
  }

  function signIn(token: string) {
    setSession(token);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync("token");
    setSession(null);
  }

  //isso aqui verifica se o caba tem o token,
  //se sim bota ele pra dento, se não, joga ele pro login
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (isMounted) {
          if (token) {
            setSession(token);
          } else {
            setSession(null);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar token no SecureStore:", error);
        if (isMounted) {
          setSession(null);
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (initialLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        login,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
