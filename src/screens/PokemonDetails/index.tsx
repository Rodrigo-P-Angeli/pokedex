import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { colors, typography, spacing } from "../../theme";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/stack";

type Props = NativeStackScreenProps<RootStackParamList, "PokemonDetails">;

export const PokemonDetails: React.FC<Props> = ({ navigation, route }) => {
  const { pokemonId, pokemonName } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </TouchableOpacity>
        <Text style={styles.title}>{pokemonName}</Text>
      </View>

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
            {/* Types will be added here */}
          </View>

          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Base Stats</Text>
            {/* Stats will be added here */}
          </View>

          <View style={styles.abilitiesContainer}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            {/* Abilities will be added here */}
          </View>

          <View style={styles.evolutionContainer}>
            <Text style={styles.sectionTitle}>Evolution Chain</Text>
            {/* Evolution chain will be added here */}
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark10,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h2,
    marginLeft: spacing.md,
    color: colors.dark,
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
  statsContainer: {
    marginBottom: spacing.lg,
  },
  abilitiesContainer: {
    marginBottom: spacing.lg,
  },
  evolutionContainer: {
    marginBottom: spacing.lg,
  },
});
