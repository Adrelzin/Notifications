import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function Cadastro() {
  const navigation = useNavigation();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(true);

  const [token, setToken] = useState("");
  const [erro, setErro] = useState("");
  const [status, setStatus] = useState("Iniciando...");

  useEffect(() => {
    obterToken();
  }, []);

  async function obterToken() {
    try {
      setStatus("Verificando dispositivo...");

      if (!Device.isDevice) {
        setErro("Use um dispositivo físico.");
        return;
      }

      setStatus("Solicitando permissões...");

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } =
          await Notifications.requestPermissionsAsync();

        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        setErro("Permissão de notificação negada.");
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ||
        Constants?.easConfig?.projectId;

      if (!projectId) {
        setErro("ProjectId não encontrado. Verifique o app.json.");
        return;
      }

      setStatus("Obtendo token...");

      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      setToken(pushToken.data);
      setStatus("Token obtido com sucesso!");

      console.log("EXPO PUSH TOKEN:");
      console.log(pushToken.data);
    } catch (e) {
      console.log(e);
      setErro(JSON.stringify(e, null, 2));
    }
  }

  function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha nome, e-mail e senha.');
      return;
    }

    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');

    setNome('');
    setEmail('');
    setSenha('');

    navigation.navigate('Login');
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTexto}>Cadastro</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.label}>Nome</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          placeholderTextColor="#9CA3AF"
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>

        <View style={styles.senhaContainer}>
          <TextInput
            style={[styles.input, styles.inputSenha]}
            placeholder="Digite sua senha"
            placeholderTextColor="#9CA3AF"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={mostrarSenha}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          >
            <Feather
              name={mostrarSenha ? 'eye' : 'eye-off'}
              size={20}
              color="#7c7c7c"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Token do aparelho</Text>

        <TextInput
          style={[styles.input, styles.inputMensagem]}
          placeholder="Obtendo token do dispositivo..."
          placeholderTextColor="#9CA3AF"
          value={token || status}
          multiline
          editable={false}
        />

        {!!erro && <Text style={styles.erro}>{erro}</Text>}

        <TouchableOpacity
          style={styles.botao}
          onPress={handleCadastro}
        >
          <Text style={styles.textoBotao}>
            Cadastrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Já tem uma conta? Entrar</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(true);

  function handleLogin() {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    Alert.alert('Login', 'Login realizado com sucesso!');

    navigation.navigate('Home');
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTexto}>Login</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.label}>E-mail</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>

        <View style={styles.senhaContainer}>
          <TextInput
            style={[styles.input, styles.inputSenha]}
            placeholder="Digite sua senha"
            placeholderTextColor="#9CA3AF"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={mostrarSenha}
          />
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          >
            <Feather
              name={mostrarSenha ? 'eye' : 'eye-off'}
              size={20}
              color="#7c7c7c"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={handleLogin}
        >
          <Text style={styles.textoBotao}>
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.link}>Não tem uma conta? Criar conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function EnviarNot(){
  
}

function Home() {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeTexto}>Bem-vindo!</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTexto: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  erro: {
    color: "red",
    marginTop: 6,
  },
  link: {
    marginTop: 15,
    color: "#007AFF",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 7,
    paddingHorizontal: 14,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  inputMensagem: {
    height: 50,
    paddingTop: 14,
    textAlignVertical: "top",
  },
  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputSenha: {
    flex: 1,
  },
  icon: {
    marginLeft: -36,
    padding: 6,
  },
  botao: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  homeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  homeTexto: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
