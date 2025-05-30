import React, { useState, useEffect } from "react";
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

interface Pokemon {
  id: number;
  name: string;
  url: string;
}

type Props = NativeStackScreenProps<RootStackParamList, "PokemonList">;

export const PokemonList = ({ navigation }: Props) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();
      setPokemons([...pokemons, ...data.results]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pokemons:", error);
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setOffset(offset + limit);
    fetchPokemons();
  };

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPokemonCard = ({ item }: { item: Pokemon }) => {
    const pokemonId = item.url.split("/")[6];

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("PokemonDetails", {
            pokemonId: parseInt(pokemonId),
            pokemonName: item.name,
          })
        }
      >
        <Image
          source={{
            uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
          }}
          style={styles.pokemonImage}
          resizeMode="contain"
        />
        <Text style={styles.pokemonName}>{item.name}</Text>
        <Text style={styles.pokemonNumber}>#{pokemonId}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokédex</Text>
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

      <FlatList
        data={filteredPokemons}
        renderItem={renderPokemonCard}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : null
        }
      />
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
  title: {
    ...typography.h1,
    color: colors.dark,
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
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
});
