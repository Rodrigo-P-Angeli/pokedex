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
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [fullName, cpf, email, password, confirmPassword]);

  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, "");
    
    if (cleanCPF.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let rest = 11 - (sum % 11);
    let digit1 = rest > 9 ? 0 : rest;
    
    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    rest = 11 - (sum % 11);
    let digit2 = rest > 9 ? 0 : rest;
    
    return digit1 === parseInt(cleanCPF.charAt(9)) && 
           digit2 === parseInt(cleanCPF.charAt(10));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validação do nome
    if (!fullName.trim()) {
      newErrors.fullName = "Nome completo é obrigatório";
      isValid = false;
    } else if (fullName.trim().split(" ").length < 2) {
      newErrors.fullName = "Digite seu nome completo";
      isValid = false;
    }

    // Validação do CPF
    if (!cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório";
      isValid = false;
    } else if (!validateCPF(cpf)) {
      newErrors.cpf = "CPF inválido";
      isValid = false;
    }

    // Validação do email
    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
      isValid = false;
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
      isValid = false;
    }

    // Validação da senha
    if (!password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
      isValid = false;
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = "Senha deve conter pelo menos uma letra maiúscula";
      isValid = false;
    } else if (!/(?=.*[0-9])/.test(password)) {
      newErrors.password = "Senha deve conter pelo menos um número";
      isValid = false;
    }

    // Validação da confirmação de senha
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    setErrors(newErrors);
    setIsFormValid(isValid);
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
      formattedText = `${formattedText.slice(0, 11)}-${formattedText.slice(11)}`;
    }

    return formattedText.slice(0, 14);
  };

  const handleSignUp = async () => {
    if (!isFormValid) {
      Alert.alert("Erro", "Por favor, corrija os erros no formulário");
      return;
    }

    setLoading(true);

    try {
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

      Alert.alert("Sucesso", "Conta criada com sucesso!");
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
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

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
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

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
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color={theme.colors.dark60}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

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
                style={styles.eyeIcon}
              >
                <MaterialCommunityIcons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color={theme.colors.dark60}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.signUpButton,
                (!isFormValid || loading) && styles.signUpButtonDisabled,
              ]}
              onPress={handleSignUp}
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.light} />
              ) : (
                <Text style={styles.signUpButtonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>
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
    padding: theme.spacing.lg,
  },
  backButton: {
    marginBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.dark,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body2,
    color: theme.colors.dark60,
  },
  form: {
    gap: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.dark10,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    ...theme.typography.body1,
    color: theme.colors.dark,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  errorText: {
    ...theme.typography.small,
    color: theme.colors.danger,
    marginTop: -theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  eyeIcon: {
    padding: theme.spacing.xs,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  signUpButtonDisabled: {
    backgroundColor: theme.colors.dark30,
  },
  signUpButtonText: {
    ...theme.typography.body1,
    color: theme.colors.light,
    fontWeight: "600",
  },
});

export default SignUp;
