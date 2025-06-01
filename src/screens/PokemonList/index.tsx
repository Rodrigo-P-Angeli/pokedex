import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/stack";
import { usePokemon } from "../../contexts/PokemonContext";

type Props = NativeStackScreenProps<RootStackParamList, "PokemonList">;

export const PokemonList = ({ navigation }: Props) => {
  const { pokemons, loading } = usePokemon();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPokemonCard = ({ item }: { item: typeof pokemons[0] }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("PokemonDetails", {
            pokemonId: item.id,
            pokemonName: item.name,
          })
        }
      >
        <Image
          source={{
            uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`,
          }}
          style={styles.pokemonImage}
          resizeMode="contain"
        />
        <Text style={styles.pokemonName}>{item.name}</Text>
        <Text style={styles.pokemonNumber}>#{item.id}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.dark60} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Pokémon..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.dark60}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredPokemons}
          renderItem={renderPokemonCard}
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.xs,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.body1,
    color: colors.dark,
  },
  listContainer: {
    padding: spacing.sm,
  },
  card: {
    flex: 1,
    margin: spacing.sm,
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: "center",
    shadowColor: colors.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginBottom: spacing.sm,
  },
  pokemonName: {
    ...typography.body1,
    color: colors.dark,
    textTransform: "capitalize",
  },
  pokemonNumber: {
    ...typography.small,
    color: colors.dark60,
    marginTop: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
