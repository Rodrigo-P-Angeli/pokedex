import React, { createContext, useContext, useState, useEffect } from 'react';

interface Pokemon {
  id: number;
  name: string;
  url: string;
}

interface PokemonContextData {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
}

const PokemonContext = createContext<PokemonContextData>({} as PokemonContextData);

export const PokemonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();
      
      const formattedPokemons = data.results.map((pokemon: Pokemon, index: number) => ({
        ...pokemon,
        id: index + 1,
      }));

      setPokemons(formattedPokemons);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pokemons:', error);
      setError('Failed to fetch Pokémon data');
      setLoading(false);
    }
  };

  return (
    <PokemonContext.Provider value={{ pokemons, loading, error }}>
      {children}
    </PokemonContext.Provider>
  );
};

export const usePokemon = () => {
  const context = useContext(PokemonContext);
  if (!context) {
    throw new Error('usePokemon must be used within a PokemonProvider');
  }
  return context;
}; 