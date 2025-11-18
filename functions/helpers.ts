// Genera un número aleatorio entre 252 y 494
export function numeroAleatorio() {
  const min = 252;
  const max = 494;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Capitaliza nombres como "rayquaza" → "Rayquaza"
// Y maneja guiones: "mr-mime" → "Mr Mime", "ho-oh" → "Ho Oh"
export function PokemonName(name: string) {
  if (!name) return "";

  return name
    .split("-")                // separa por guiones
    .map((part) =>
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join(" ");                // junta con espacio
}

// Array de clases Tailwind para posiciones top
export const topValues = [
  "top-0",
  "top-0.5",
  "top-1",
  "top-1.5",
  "top-2",
  "top-2.5",
  "top-3",
  "top-3.5",
  "top-4",
  "top-5",
  "top-6",
  "top-7",
  "top-8",
  "top-9",
  "top-10",
  "top-11",
  "top-12",
  "top-14",
  "top-16",
  "top-20",
  "top-24",
  "top-28",
  "top-32",
  "top-36",
  "top-40",
  "top-44",
  "top-48",
  "top-52",
  "top-56",
  "top-60",
  "top-64",
  "top-72",
  "top-80",
  "top-96",
];

export const selectRandomTop = (number: number) => {
  return topValues[number % topValues.length];
};

// URL oficial del sprite
export const pokemonSprite = (id: number | string) => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};
