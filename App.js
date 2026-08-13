import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [token, setToken] = useState("");
  const [erro, setErro] = useState("");
  const [status, setStatus] = useState("Iniciando...");
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tokenDestino, setTokenDestino] = useState("");

  useEffect(() => {
    obterToken();
  }, []);

  async function enviarNotificacao() {
    if (!tokenDestino.trim()) {
      Alert.alert('Atenção', 'Digite o token de destino.');
      return;
    }

    if (!mensagem.trim()) {
      Alert.alert('Atenção', 'Digite uma mensagem.');
      return;
    }

    try {
      const resposta = await fetch(
        'https://exp.host/--/api/v2/push/send',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: tokenDestino,
            sound: 'default',
            title: titulo || 'Nova notificação',
            body: mensagem,
            data: {
              origem: 'painel',
            },
          }),
        }
      );

      const resultado = await resposta.json();

      console.log(resultado);

      Alert.alert('Sucesso', 'Notificação enviada!');

      setTitulo('');
      setMensagem('');
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível enviar a notificação.'
      );
    }
  }

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
        setErro(
          "ProjectId não encontrado. Verifique o app.json."
        );
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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTexto}>Enviar Notificação</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Seu token</Text>
        <Text style={styles.tokenTexto}>{token || status}</Text>
        {!!erro && <Text style={styles.erro}>{erro}</Text>}

        <Text style={styles.label}>Token de destino</Text>

        <TextInput
          style={styles.input}
          placeholder="ExponentPushToken[...]"
          placeholderTextColor="#9CA3AF"
          value={tokenDestino}
          onChangeText={setTokenDestino}
        />
        <Text style={styles.descricao}>
          Cole o Expo Push Token do dispositivo que irá receber a notificação.
        </Text>

        <Text style={styles.label}>Título</Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Promoção Especial"
          placeholderTextColor="#9CA3AF"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.descricao}>
          Título que aparecerá na notificação.
        </Text>

        <Text style={styles.label}>Mensagem</Text>

        <TextInput
          style={[styles.input, styles.inputMensagem]}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#9CA3AF"
          value={mensagem}
          onChangeText={setMensagem}
          multiline
        />

        <Text style={styles.descricao}>
          Mensagem que será enviada na notificação.
        </Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={enviarNotificacao}
        >
          <Text style={styles.textoBotao}>
            ✈  Enviar Notificação
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1E4FCF",
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTexto: {
    color: "#fff",
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
  tokenTexto: {
    fontSize: 12,
    color: "#374151",
    marginTop: 6,
  },
  descricao: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
  },
  erro: {
    color: "red",
    marginTop: 6,
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
    height: 200,
    paddingTop: 14,
    textAlignVertical: "top",
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
});
