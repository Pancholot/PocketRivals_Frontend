import { createContext, useContext, useState, useEffect } from "react";
import { Asset } from "expo-asset";

const PreloadContext = createContext<any>(null);

export const PreloadProvider = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      const images = [
        require("@/assets/backgrounds/auth.png"),
        require("@/assets/icons/Logo.png"),
        require("@/assets/icons/pokeball.png"),
        require("@/assets/icons/amigos.png"),
        require("@/assets/icons/pokemon.png"),
        require("@/assets/icons/settings.png"),
      ];

      const cacheImages = images.map((img) =>
        Asset.fromModule(img).downloadAsync()
      );

      await Promise.all(cacheImages);
      setReady(true);
    };

    loadAssets();
  }, []);

  return (
    <PreloadContext.Provider value={{ ready }}>
      {children}
    </PreloadContext.Provider>
  );
};

export const usePreload = () => useContext(PreloadContext);
