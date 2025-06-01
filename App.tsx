import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootStack } from "./src/navigation/stack";
import { PokemonProvider } from "./src/contexts/PokemonContext";

export default function App() {
  return (
    <NavigationContainer>
      <PokemonProvider>
        <RootStack />
      </PokemonProvider>
    </NavigationContainer>
  );
}
