import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import supabase from "../config/supabaseClient";

interface IBREED {
  id: number;
  species_id: number;
  name_mx: string;
  name_us: string;
}

interface ISPECIES {
  id: number;
  name_mx: string;
  name_us: string;
}

interface AppContextInterface {
  breeds: Array<IBREED>;
  species: Array<ISPECIES>;
}

export const BreedContext = createContext<AppContextInterface>(
  {} as AppContextInterface
);

interface IBreedProvider {
  children?: ReactNode;
}

export const BreedProvider: FC<IBreedProvider> = ({ children }) => {
  const [breeds, setBreed] = useState<any>([]);
  const [species, setSpecies] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBreedData() {
      setLoading(false);
      let { data: speciesData, error } = await supabase
        .from("species")
        .select("*");
      if (speciesData && speciesData?.length > 0) {
        setSpecies(speciesData);
      }
      setLoading(false);
    }
    getBreedData();
  }, []);

  useEffect(() => {
    async function getBreedData() {
      setLoading(false);
      let { data: breed, error } = await supabase.from("breed").select("*");
      console.log("breed getBreedData", breed);
      if (breed && breed?.length > 0) {
        setBreed(breed);
      }
      setLoading(false);
    }
    getBreedData();
  }, []);

  const value = {
    breeds,
    species,
  };

  return (
    <BreedContext.Provider value={value}>
      {!loading && children}
    </BreedContext.Provider>
  );
};

export const useBreed = () => {
  return useContext(BreedContext);
};
