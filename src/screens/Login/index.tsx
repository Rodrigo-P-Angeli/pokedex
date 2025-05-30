import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/stack";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../theme';

type LoginScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

const Login: React.FC<LoginScreenNavigationProp> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      // Navega para a tela principal após login bem-sucedido
      navigation.reset({
        index: 0,
        routes: [{ name: "PokemonList" }],
      });
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido";
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="wallet"
            size={64}
            color={theme.colors.primary}
          />
          <Text style={styles.title}>Pokedex</Text>
          <Text style={styles.subtitle}>Controle seus pokemons com facilidade</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color={theme.colors.dark60}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={theme.colors.dark60}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={24}
              color={theme.colors.dark60}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={theme.colors.dark60}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color={theme.colors.dark60}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signupLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.dark,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.dark60,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  form: {
    marginTop: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.dark10,
  },
  inputIcon: {
    padding: theme.spacing.md,
  },
  input: {
    flex: 1,
    ...theme.typography.body1,
    color: theme.colors.dark,
    paddingVertical: theme.spacing.md,
  },
  passwordToggle: {
    padding: theme.spacing.md,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  loginButtonText: {
    ...theme.typography.body1,
    color: theme.colors.light,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    ...theme.typography.body2,
    color: theme.colors.dark60,
  },
  signupLink: {
    ...theme.typography.body2,
    color: theme.colors.primary,
  },
});

export default Login;
