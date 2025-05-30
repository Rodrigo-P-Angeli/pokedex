import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/stack";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";

type Props = NativeStackScreenProps<RootStackParamList, "Splash">;

export default function Splash({ navigation }: Props) {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      // Navigate to appropriate screen based on auth state
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "PokemonList" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    });

    // Cleanup subscription
    return unsubscribe;
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2ecc71" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
