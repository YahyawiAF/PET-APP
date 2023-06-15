import { Button, Form } from "react-bootstrap";
import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthProvider";
import { MdOutlineAddCircle } from "react-icons/md";
import { AiFillMinusCircle } from "react-icons/ai";
import supabase from "../../config/supabaseClient";

enum SPECIES {
  dog = 1,
  cat = 2,
}

interface PET {
  id: number;
  name: string;
  breed: { label: string; value: string };
  breedName: string;
  owner: boolean;
  ownerName: string;
  ownerNumber: string;
  dateOfBirth: string;
  yearOfBirth: { label: string; value: string };
  monthOfBirth: { label: string; value: string };
  color: string;
  isFirstVaccination: boolean;
  neutering: boolean;
  vaccinationReaction: boolean;
  gender: boolean;
  sick: boolean;
  pregnant: boolean;
  knowsDateOfBirth: boolean;
  userID: string;
  mixedBreed: boolean;
  VaccineTextarea: string;
  heartwormPrevention: boolean;
  species: SPECIES | null;
}

interface IPetCheckItemProps {
  petCheckIn: Array<number>;
  pet: PET;
  handleChangeCheckbox: (id: number) => void;
}

const PetCheckItem: FC<IPetCheckItemProps> = ({
  handleChangeCheckbox,
  pet,
  petCheckIn,
}) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <FormGroupS className="mb-4 d-flex flex-column " controlId="checkIn">
        <FormCheckS
          inline
          label={pet.name}
          name="checkIn"
          checked={petCheckIn.filter((v: any) => v === pet.id).length > 0}
          onChange={() => handleChangeCheckbox(pet.id)}
          type="checkbox"
        />
        <ButtonS
          variant="primary"
          onClick={() => {
            setMoreInfo((prevState) => !prevState);
          }}
        >
          {moreInfo ? <AiFillMinusCircle /> : <MdOutlineAddCircle />}
        </ButtonS>
        <StyledDiv className={`${moreInfo ? "d-block" : "d-none"} `}>
          <div>
            <span>{t("species2")}: </span>
            <span>{pet.species === 1 ? "DOG" : "CAT"}</span>
          </div>
          <div>
            <span>{t("breedLabel")}: </span>
            <span>{pet.breed.label}</span>
          </div>
          <div>
            <span>{t("genderLabel")}: </span>
            <span>{pet.gender}</span>
          </div>
          <div>
            <span>{t("dateOfBirth")}: </span>
            <span>{pet.dateOfBirth}</span>
          </div>
        </StyledDiv>
      </FormGroupS>
    </>
  );
};

const CheckIn = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [petCheckIn, setPetCheckIn] = useState<Array<number>>([]);
  const [ID, setID] = useState<string>("");
  const [moreInfo, setMoreInfo] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [petsList, setPets] = useState<Array<PET>>([]);

  const handleChangeCheckbox = (id: number) => {
    if (petCheckIn?.filter((v) => v === id).length > 0) {
      let newList = petCheckIn?.filter((v) => v !== id);
      setPetCheckIn(newList);
    } else {
      setPetCheckIn((prevState) => [...prevState, id]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      const fetchSmoothies = async () => {
        let { data: checkinlist, error: errorList } = await supabase
          .from("checkInList")
          .select()
          .eq("userID", user?.id);

        if (checkinlist && checkinlist.length > 0) {
          setPetCheckIn(checkinlist[0]?.list);
          setID(checkinlist[0]?.id);
        }

        console.log("checkinlist", checkinlist);

        let { data: pet, error } = await supabase
          .from("pet")
          .select()
          .eq("userID", user?.id);
        if (error) {
          setFetchError("Could not fetch the smoothies");
        }
        if (pet) {
          setPets(pet as unknown as Array<PET>);
          setFetchError(null);
        }
      };

      fetchSmoothies();
    }
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    if (ID) {
      const { error } = await supabase
        .from("checkInList")
        .update({ list: petCheckIn, userID: user.id })
        .eq("id", ID);
    } else {
      const { error } = await supabase
        .from("checkInList")
        .insert({ list: petCheckIn, userID: user.id });
    }
  };

  return (
    <Wrapper>
      <WrapperForm>
        {petsList?.map((pet) => (
          <PetCheckItem
            pet={pet}
            handleChangeCheckbox={handleChangeCheckbox}
            petCheckIn={petCheckIn}
          />
        ))}

        <div className="d-flex justify-content-end">
          <SubmitButton onClick={handleSubmit} variant="primary" type="submit">
            {t("checkInButton")}
          </SubmitButton>
        </div>
        {formError && <p className="error">{formError}</p>}
      </WrapperForm>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  @media only screen and (max-width: 600px) {
    padding: 10px;
  }
`;

const WrapperForm = styled.div`
  max-width: 600px;
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 6px;
`;

const FormGroupS = styled(Form.Group)`
  background: #f2f2f2;
  padding: 0.5rem 0.8rem;
  border-radius: 5px;
  box-shadow: 0 0 0px 3px #a1a0a0;
  position: relative;
`;

const FormCheckS = styled(Form.Check)`
  position: relative;
  font-weight: 500;
  color: #6c6c6c;
  padding-left: 3rem;
  .form-check-input[type="checkbox"] {
    position: absolute;
    bottom: -2px;
    left: 35px;
    border-radius: 5px;
    font-size: 26px;
    box-shadow: 0 0 0px 2px #a1a0a0;
  }
`;

const ButtonS = styled(Button)`
  width: 25px;
  height: 26px;
  position: absolute;
  right: 8px;
  top: 8px;
  border-radius: 50%;
  background: #a1a0a0;
  border: 0;
  transition: 0.4s all;
  &:hover {
    background: #727070;
  }

  svg {
    position: absolute;
    top: 1px;
    right: 0px;
    width: 25px;
    height: 24px;
  }
`;

const StyledDiv = styled("div")`
  color: #6c6c6c;
  background: #f2f2f2;
  // box-shadow: 0 0 0 3px #a1a0a0;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  font-weight: 500;
`;

const SubmitButton = styled(Button)`
  color: white;
  background: var(--dark);
  border: 2px solid white;
  padding: 0.5rem 2.5rem;
  margin-top: 2rem;
  transition: all.4s all;
  &:hover {
    border: 2px solid var(--dark);
    background: white;
    color: black;
  }
`;

export default CheckIn;
