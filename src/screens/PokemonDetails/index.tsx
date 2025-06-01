import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { colors, typography, spacing, borderRadius } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/stack";

type Props = NativeStackScreenProps<RootStackParamList, "PokemonDetails">;

interface PokemonData {
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }>;
  species: {
    url: string;
  };
}

interface EvolutionChain {
  species: {
    name: string;
    url: string;
  };
  evolves_to: Array<{
    species: {
      name: string;
      url: string;
    };
    evolves_to: Array<{
      species: {
        name: string;
        url: string;
      };
    }>;
  }>;
}

const typeColors: { [key: string]: string } = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export const PokemonDetails: React.FC<Props> = ({ navigation, route }) => {
  const { pokemonId, pokemonName } = route.params;
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const fetchPokemonData = async () => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );
      const data = await response.json();
      setPokemonData(data);
      await fetchEvolutionChain(data.species.url);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pokemon data:", error);
      setLoading(false);
    }
  };

  const fetchEvolutionChain = async (speciesUrl: string) => {
    try {
      const speciesResponse = await fetch(speciesUrl);
      const speciesData = await speciesResponse.json();
      const evolutionResponse = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionResponse.json();
      setEvolutionChain(evolutionData.chain);
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
    }
  };

  const formatStatName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatAbilityName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderEvolutionChain = () => {
    if (!evolutionChain) return null;

    const evolutionNames = [evolutionChain.species.name];
    if (evolutionChain.evolves_to.length > 0) {
      evolutionNames.push(evolutionChain.evolves_to[0].species.name);
      if (evolutionChain.evolves_to[0].evolves_to.length > 0) {
        evolutionNames.push(evolutionChain.evolves_to[0].evolves_to[0].species.name);
      }
    }

    return (
      <View style={styles.evolutionContainer}>
        <Text style={styles.sectionTitle}>Evolution Chain</Text>
        <View style={styles.evolutionList}>
          {evolutionNames.map((name, index) => (
            <View key={index} style={styles.evolutionItem}>
              <Text style={styles.evolutionName}>{name}</Text>
              {index < evolutionNames.length - 1 && (
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color={colors.dark60}
                  style={styles.evolutionArrow}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
            }}
            style={styles.pokemonImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.typeContainer}>
            <Text style={styles.sectionTitle}>Types</Text>
            <View style={styles.typesList}>
              {pokemonData?.types.map((type, index) => (
                <View
                  key={index}
                  style={[
                    styles.typeBadge,
                    { backgroundColor: typeColors[type.type.name] },
                  ]}
                >
                  <Text style={styles.typeText}>
                    {type.type.name.toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Base Stats</Text>
            {pokemonData?.stats.map((stat, index) => (
              <View key={index} style={styles.statRow}>
                <Text style={styles.statName}>
                  {formatStatName(stat.stat.name)}
                </Text>
                <View style={styles.statBarContainer}>
                  <View
                    style={[
                      styles.statBar,
                      {
                        width: `${(stat.base_stat / 255) * 100}%`,
                        backgroundColor:
                          stat.base_stat > 100
                            ? colors.success
                            : stat.base_stat > 50
                            ? colors.primary
                            : colors.warning,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.statValue}>{stat.base_stat}</Text>
              </View>
            ))}
          </View>

          <View style={styles.abilitiesContainer}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            <View style={styles.abilitiesList}>
              {pokemonData?.abilities.map((ability, index) => (
                <View key={index} style={styles.abilityItem}>
                  <Text style={styles.abilityName}>
                    {formatAbilityName(ability.ability.name)}
                  </Text>
                  {ability.is_hidden && (
                    <View style={styles.hiddenBadge}>
                      <Text style={styles.hiddenText}>Hidden</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {renderEvolutionChain()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.light,
  },
  pokemonImage: {
    width: 200,
    height: 200,
  },
  infoContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  typeContainer: {
    marginBottom: spacing.lg,
  },
  typesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginRight: spacing.sm,
  },
  typeText: {
    ...typography.body2,
    color: colors.light,
    fontWeight: "600",
  },
  statsContainer: {
    marginBottom: spacing.lg,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statName: {
    ...typography.body2,
    color: colors.dark,
    width: 100,
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.dark10,
    borderRadius: borderRadius.round,
    marginHorizontal: spacing.sm,
    overflow: "hidden",
  },
  statBar: {
    height: "100%",
    borderRadius: borderRadius.round,
  },
  statValue: {
    ...typography.body2,
    color: colors.dark,
    width: 40,
    textAlign: "right",
  },
  abilitiesContainer: {
    marginBottom: spacing.lg,
  },
  abilitiesList: {
    gap: spacing.sm,
  },
  abilityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  abilityName: {
    ...typography.body1,
    color: colors.dark,
    flex: 1,
  },
  hiddenBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
  },
  hiddenText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: "600",
  },
  evolutionContainer: {
    marginBottom: spacing.lg,
  },
  evolutionList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  evolutionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  evolutionName: {
    ...typography.body1,
    color: colors.dark,
    textTransform: "capitalize",
  },
  evolutionArrow: {
    marginHorizontal: spacing.sm,
  },
});
