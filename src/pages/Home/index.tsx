import { FC, useCallback, useEffect, useMemo, useState } from "react";
//import { useCatAPI } from "../contexts";
// import BreedSelector from "../../components/BreedSelector";
import { CardList } from "../../components/CardList";
import Loader from "../../components/Loader";
import styled from "styled-components";
import supabase from "../../config/supabaseClient";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdOutlineAddCircle } from "react-icons/md";
import { useAuth } from "../../context/AuthProvider";
import LanguageModal from "../../components/languageModal/LanguageModal";
import { t } from "i18next";

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
  const { user } = useAuth();

  const fetchSmoothies = useCallback(async () => {
    let { data: pet, error } = await supabase
      .from("pet")
      .select()
      .eq("userID", user?.id);
    if (error) {
      setFetchError("Could not fetch the smoothies");
      setPets(null);
    }
    if (pet) {
      setPets(pet);
      setFetchError(null);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (user?.id) {
      fetchSmoothies();
    }
  }, [user, fetchSmoothies]);

  // const handleDelete = async (id: string) => {
  //   const { data, error } = await supabase.from("pet").delete().eq("id", id);
  //   fetchSmoothies();
  // };

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
        <ButtonAdd onClick={() => navigate(`/form`)}>
          <span>
            <MdOutlineAddCircle />
          </span>{" "}
          <span>{t("addPet")}</span>{" "}
        </ButtonAdd>
      </WrapperOption>
      {pets && pets?.length > 0 ? (
        <CardList
          pets={pets}
          onLoadMore={handleLoadMore}
          // handleDelete={handleDelete}
          canLoadMore={canLoadMore}
        />
      ) : loading ? (
        <Loader />
      ) : null}
    </Wrapper>
  );
};

const ButtonAdd = styled(Button)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: transparent;
  border: 2px solid #000;
  color: #000;
  font-size: 21px;
  line-height: 48px;
  padding: 0px 15px;
  font-weight: bold;

  &:hover {
    background: var(--dark);
    border: 2px solid #000;
    color: white;
  }

  & > span:first-of-type {
    font-size: 40px;
    position: relative;
    top: -3px;
  }

  @media only screen and (max-width: 600px) {
    position: fixed;
    top: 120px;
    right: 10px;
    border: none;
    z-index: 9;
    border-radius: 50%;
    padding: 0;
    &:hover {
      background: none;
      border: none;
    }
    & > span:first-of-type {
      font-size: 55px;
      position: relative;
      top: -3px;
      padding: 0;

      & > svg {
        background-color: white;
        border-radius: 50%;
        box-shadow: 0px 0px 7px gray;
        transition: 0.25s all linear;
        &:hover {
          background-color: black;
        }
      }
    }

    & > span:nth-of-type(2) {
      display: none;
    }
  }
`;

const WrapperOption = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
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
