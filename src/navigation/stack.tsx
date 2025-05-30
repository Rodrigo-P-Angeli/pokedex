import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, signOut } from "@react-native-firebase/auth";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import { PokemonList } from "../screens/PokemonList";
import { PokemonDetails } from "../screens/PokemonDetails";
import Splash from "../screens/Splash";
import theme from "../theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  SignUp: undefined;
  PokemonList: undefined;
  PokemonDetails: {
    pokemonId: number;
    pokemonName: string;
  };
};

export function RootStack() {
  const handleLogout = async () => {
    try {
      await signOut(getAuth());
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Stack.Navigator
      initialRouteName="Splash"
    >
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PokemonList"
        component={PokemonList}
        options={{
          headerShown: true,
          title: 'Pokédex',
          headerRight: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleLogout}
            >
              <MaterialCommunityIcons
                name="logout"
                size={24}
                color={theme.colors.danger}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="PokemonDetails"
        component={PokemonDetails}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
});
