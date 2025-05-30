import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function Home({ navigation }: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}></ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.dark,
    marginTop: theme.spacing.lg,
    textAlign: "center",
  },
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.dark60,
    marginTop: theme.spacing.xs,
    textAlign: "center",
  },
  form: {
    marginTop: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  infoText: {
    ...theme.typography.body2,
    color: theme.colors.dark60,
    marginLeft: theme.spacing.xs,
  },
  simulateButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.round,
    alignItems: "center",
  },
  simulateButtonDisabled: {
    backgroundColor: theme.colors.dark30,
  },
  simulateButtonText: {
    ...theme.typography.body1,
    color: theme.colors.light,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    position: "relative",
    paddingVertical: theme.spacing.md,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.dark,
  },
  closeButton: {
    position: "absolute",
    right: -theme.spacing.md,
    top: -theme.spacing.md,
    padding: theme.spacing.md,
  },
  installmentGrid: {
    paddingHorizontal: theme.spacing.xs,
  },
  installmentItem: {
    flex: 1,
    aspectRatio: 1.5,
    margin: 4,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.dark10,
    minWidth: 70,
    maxWidth: 100,
  },
  installmentItemSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  installmentText: {
    ...theme.typography.body1,
    fontSize: 18,
    color: theme.colors.dark,
    fontWeight: "600",
  },
  installmentTextSelected: {
    color: theme.colors.light,
  },
  transactionsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginTop: theme.spacing.md,
  },
  transactionsButtonText: {
    ...theme.typography.body2,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
    fontWeight: "600",
  },
});
