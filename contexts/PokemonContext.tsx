import { useRouter } from "expo-router";
import { createContext, useContext, useState, ReactNode } from "react";

export type Pokemon = {
  id: string; // ID único del registro
  name: string; // nombre del Pokémon
  pokedex_number: number; // número de Pokédex
  type1: string | null; // tipo principal
  in_team: number;
  obtained_at: string;
  mote: string | null;
  player_id: string;
};

type PokemonContextType = {
  myPokemon: Pokemon[];
  addPokemon: (pokemon: Pokemon) => void;
  deletePokemon: (pokemonName: string) => void;
  changeMote: (pokedexNumber: number, newMote: string) => void;
};

const PokemonContext = createContext<PokemonContextType>({
  myPokemon: [],
  addPokemon: () => {},
  deletePokemon: () => {},
  changeMote: () => {},
});

export function PokemonProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [myPokemon, setMyPokemon] = useState<Pokemon[]>([
    {
      id: "starter-1",
      in_team: 0,
      mote: null,
      name: "Garchomp",
      obtained_at: "Fri, 14 Nov 2025 00:00:00 GMT",
      player_id: "CV0FK1BJScNyvRIhf8QqxEzgd5zzI1RQ",
      pokedex_number: 392,
      type1: "fire",
      type2: "fighting",
    },
    {
      id: "starter-2",
      in_team: 0,
      mote: null,
      name: "Garchomp",
      obtained_at: "Fri, 14 Nov 2025 00:00:00 GMT",
      player_id: "CV0FK1BJScNyvRIhf8QqxEzgd5zzI1RQ",
      pokedex_number: 445,
      type1: "dragon",
      type2: "ground",
    },
  ]);

  const addPokemon = (pokemon: Pokemon) => {
    setMyPokemon((prev) => [...prev, pokemon]);
  };

  const deletePokemon = (pokemonName: string) => {
    setMyPokemon((prev) =>
      prev.filter((pokemon) => pokemon.name != pokemonName)
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
      value={{ myPokemon, deletePokemon, addPokemon, changeMote }}
    >
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  return useContext(PokemonContext);
}
