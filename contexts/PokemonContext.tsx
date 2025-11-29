import { useRouter } from "expo-router";
import { createContext, useContext, useState, ReactNode } from "react";

export type Pokemon = {
  id: string;
  name: string;
  pokedex_number: number;
  type1: string | null;
  in_team: number;
  obtained_at: string;
  mote: string | null;
  player_id: string;
};

type PokemonContextType = {
  myPokemon: Pokemon[];
  setMyPokemon: React.Dispatch<React.SetStateAction<Pokemon[]>>;
  addPokemon: (pokemon: Pokemon) => void;
  deletePokemon: (pokemonName: string) => void;
  changeMote: (pokedexNumber: number, newMote: string) => void;
};

const PokemonContext = createContext<PokemonContextType>({
  myPokemon: [],
  setMyPokemon: () => {},
  addPokemon: () => {},
  deletePokemon: () => {},
  changeMote: () => {},
});

export function PokemonProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [myPokemon, setMyPokemon] = useState<Pokemon[]>([]);

  const addPokemon = (pokemon: Pokemon) => {
    setMyPokemon((prev) => {
      const updated = [pokemon, ...prev];

      return updated.sort(
        (a, b) =>
          new Date(b.obtained_at).getTime() - new Date(a.obtained_at).getTime()
      );
    });
  };

  const deletePokemon = (pokemonName: string) => {
    setMyPokemon((prev) =>
      prev.filter((pokemon) => pokemon.name !== pokemonName)
    );
    router.replace("/");
  };

  const changeMote = (pokedexNumber: number, newMote: string) => {
    setMyPokemon((prev) =>
      prev.map((p) =>
        p.pokedex_number === pokedexNumber ? { ...p, mote: newMote } : p
      )
    );
  };

  return (
    <PokemonContext.Provider
      value={{ myPokemon, setMyPokemon, addPokemon, deletePokemon, changeMote }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  return useContext(PokemonContext);
}
