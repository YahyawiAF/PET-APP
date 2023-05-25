import { FC, useEffect, useMemo, useState } from "react";
//import { useCatAPI } from "../contexts";
// import BreedSelector from "../../components/BreedSelector";
import { CardList } from "../../components/CardList";
import Loader from "../../components/Loader";
import styled from "styled-components";
import supabase from "../../config/supabaseClient";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  return (
    <Wrapper className="container">
      <WrapperOption>
        <ButtonAdd onClick={() => navigate(`/form`)}>Add Pet</ButtonAdd>
      </WrapperOption>
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

const ButtonAdd = styled(Button)`
  background: transparent;
  border: 2px solid #000;
  color: #000;
  font-size: 24px;
  padding: 8px 20px;
  font-weight: bold;
  position: fixed;
  &:hover {
    background: var(--dark);
    border: 2px solid #000;
    color: white;
  }
  @media only screen and (max-width : 600px) {
    font-size: 20px;
  padding: 8px 20px;
  }
`;

const WrapperOption = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  height: 50px;
  z-index: 10;
`;

const Text = styled.p`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  // margin-top: 4.5rem;

  @media only screen and (max-width: 600px) {
    padding: 10px;
    overflow: hidden;

  }
`;

export default HomePage;
