import { FC, useEffect, useMemo, useState } from "react";
//import { useCatAPI } from "../contexts";
// import BreedSelector from "../../components/BreedSelector";
import { CardList } from "../../components/CardList";
import Loader from "../../components/Loader";
import styled from "styled-components";
import supabase  from "../../config/supabaseClient";

const LIMIT_PER_PAGE = 10;
type Breed = {
  id: string;
  name: string;
};

const HomePage: FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pets, setPets] = useState<Array<any> | null>();
  useEffect(() => {
    const fetchSmoothies = async () => {
      let { data: pet, error } = await supabase.from("pet").select("*");

      if (error) {
        setFetchError("Could not fetch the smoothies");
        setPets(null);
      }
      if (pet) {
        setPets(pet);
        setFetchError(null);
      }
    };

    fetchSmoothies();
  }, []);
  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const canLoadMore = useMemo(() => {
    if (pets) return pets.length % LIMIT_PER_PAGE === 0;
    else return false;
  }, [pets]);

  return (
    <Wrapper>
      {pets && pets?.length > 0 ? (
        <CardList
          pets={pets}
          onLoadMore={handleLoadMore}
          canLoadMore={canLoadMore}
        />
      ) : loading ? (
        <Loader />
      ) : null}
    </Wrapper>
  );
};

const Text = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  @media only screen and (max-width: 600px) {
    padding: 10px;
  }
`;

export default HomePage;
