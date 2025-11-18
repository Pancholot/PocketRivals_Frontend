import { useEffect, useState } from "react";
import { Asset } from "expo-asset";

export const useScreenAssets = (assets: number[] | string[]) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        await Promise.all(
          assets.map((asset: any) => {
            if (typeof asset === "string") {
              return Asset.fromURI(asset).downloadAsync();
            } else {
              return Asset.fromModule(asset).downloadAsync();
            }
          })
        );
      } catch (error) {
        console.warn("Asset load failed", error);
      }

      setLoaded(true);
    };

    load();
  }, []);

  return loaded;
};
