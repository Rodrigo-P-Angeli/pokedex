import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/stack";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "@react-native-firebase/firestore";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../theme';

type SignUpScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "SignUp"
>;

const SignUp: React.FC<SignUpScreenNavigationProp> = ({ navigation }) => {
  const [fullName, setFullName] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Nome completo é obrigatório";
    if (!cpf.trim()) newErrors.cpf = "CPF é obrigatório";
    else if (cpf.replace(/\D/g, "").length !== 11)
      newErrors.cpf = "CPF inválido";
    if (!email.trim()) newErrors.email = "Email é obrigatório";
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email inválido";
    if (!password) newErrors.password = "Senha é obrigatória";
    else if (password.length < 6)
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "As senhas não coincidem";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCpf = (text: string): string => {
    const numericText = text.replace(/\D/g, "");
    let formattedText = numericText;

    if (numericText.length > 3) {
      formattedText = `${numericText.slice(0, 3)}.${numericText.slice(3)}`;
    }
    if (numericText.length > 6) {
      formattedText = `${formattedText.slice(0, 7)}.${formattedText.slice(7)}`;
    }
    if (numericText.length > 9) {
      formattedText = `${formattedText.slice(0, 11)}-${formattedText.slice(
        11
      )}`;
    }

    return formattedText.slice(0, 14);
  };

  const handleSignUp = async () => {
    if (!fullName || !cpf || !email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      );

      await setDoc(
        doc(collection(getFirestore(), "users"), userCredential.user.uid),
        {
          fullName,
          cpf: cpf.replace(/\D/g, ""),
          email,
          createdAt: serverTimestamp(),
        }
      );
    } catch (error: any) {
      let errorMessage = "Erro ao cadastrar";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Senha muito fraca";
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.dark}
            />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Comece a controlar suas finanças hoje mesmo
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color={theme.colors.dark60}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Nome completo"
                placeholderTextColor={theme.colors.dark60}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* CPF */}
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={24}
                color={theme.colors.dark60}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.cpf && styles.inputError]}
                placeholder="CPF"
                placeholderTextColor={theme.colors.dark60}
                value={cpf}
                onChangeText={(text) => setCpf(formatCpf(text))}
                keyboardType="numeric"
                maxLength={14}
              />
            </View>
            {errors.cpf && <Text style={styles.errorText}>{errors.cpf}</Text>}

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="email-outline"
                size={24}
                color={theme.colors.dark60}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
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
                style={[styles.input, errors.password && styles.inputError]}
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

            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={24}
                color={theme.colors.dark60}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                placeholder="Confirmar senha"
                placeholderTextColor={theme.colors.dark60}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.passwordToggle}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={theme.colors.dark60}
                />
              </TouchableOpacity>
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Criar conta</Text>
              )}
            </TouchableOpacity>

            {/* Link para Login */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta? </Text>
              <TouchableOpacity
                onPress={() => navigation.pop()}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Faça login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  backButton: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.dark,
  },
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.dark60,
    marginTop: theme.spacing.xs,
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
  button: {
    height: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  buttonText: {
    color: theme.colors.light,
    fontSize: 18,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    ...theme.typography.body2,
    color: theme.colors.dark60,
  },
  loginLink: {
    ...theme.typography.body2,
    color: theme.colors.primary,
  },
  inputError: {
    borderColor: "#d32f2f",
  },
  errorText: {
    color: "#d32f2f",
    marginTop: theme.spacing.xs,
  },
});

export default SignUp;
