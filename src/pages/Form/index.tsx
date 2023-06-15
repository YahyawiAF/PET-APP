import { Button, Container, Form } from "react-bootstrap";
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import Breeds from "../../constant/breed.json";
import supabase from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthProvider";
import { useBreed } from "../../context/breedContext";
import CAT from "../../assets/cat.png";
import DOG from "../../assets/dog.png";
import { ToastContainer, toast } from "react-toastify";
import { IoMdArrowRoundBack } from "react-icons/io";

enum SPECIES {
  dog = 1,
  cat = 2,
}

interface PET {
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

type Props = {
  handleBreedSelectChange: (breedId: string) => void;
};
type SelectOptionType = { label: string; value: string };

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  @media only screen and (max-width: 600px) {
    padding: 10px;
  }
`;

const calculateDateOfBirth = (years: number, months: number) => {
  var currentDate = new Date();

  // var years = 2;
  // var months = 2;

  var birthDate = new Date();
  birthDate.setFullYear(currentDate.getFullYear() - years);
  birthDate.setMonth(currentDate.getMonth() - months);

  var maxDay = new Date(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    0
  ).getDate();
  var randomDay = Math.floor(Math.random() * maxDay) + 1;

  birthDate.setDate(randomDay);

  var formattedDateOfBirth = birthDate.toISOString().split("T")[0];

  return formattedDateOfBirth;
};

const Home = () => {
  const { t, i18n } = useTranslation();

  const [fetchError, setFetchError] = useState<string | null>(null);
  const { breeds } = useBreed();
  let { id } = useParams();

  const { user } = useAuth();
  const [petInfo, setPetInfo] = useState<PET>({
    name: "",
    breed: { label: "", value: "" },
    breedName: "",
    owner: true,
    ownerName: "",
    ownerNumber: "",
    dateOfBirth: "",
    yearOfBirth: { label: "", value: "" },
    monthOfBirth: { label: "", value: "" },
    color: "",
    knowsDateOfBirth: true,
    isFirstVaccination: false,
    neutering: false,
    vaccinationReaction: false,
    gender: false,
    sick: false,
    pregnant: false,
    userID: user.id,
    mixedBreed: false,
    VaccineTextarea: "",
    heartwormPrevention: false,
    species: null,

    // Add more fields as needed
  });

  const [speciesConfirmed, setSpeciesConfirmed] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [selectedBreed, setSelectedBreed] = useState<SelectOptionType | null>(
    null
  );

  const [selectedYOB, setSelectedYOB] = useState<SelectOptionType | null>(null);

  const [selectedMOB, setSelectedMOB] = useState<SelectOptionType | null>(null);

  const yobRenderOptions = (): SelectOptionType[] => {
    const yobOptions: SelectOptionType[] = [
      { label: "Less than one year", value: "1" },
      { label: "20 years or above", value: "21" },
    ];
    for (let i = 1; i <= 19; i++) {
      yobOptions.push({
        label: `${i} year${i !== 1 ? "s" : ""}`,
        value: i.toString(),
      });
    }

    return yobOptions;
  };

  console.log("selectedYOB", selectedYOB);
  console.log("selectedMOB", selectedMOB);

  const handleChangeYOB = (option: SelectOptionType | null) => {
    if (option) {
      setSelectedYOB(option);
      setPetInfo((prevState) => ({
        ...prevState,
        yearOfBirth: option,
      }));
    }
  };

  const mobRenderOptions = (): SelectOptionType[] => {
    const mobOptions: SelectOptionType[] = [
      { label: "Less than one month", value: "1" },
    ];
    for (let i = 1; i <= 11; i++) {
      mobOptions.push({
        label: `${i} month${i !== 1 ? "s" : ""}`,
        value: i.toString(),
      });
    }

    return mobOptions;
  };

  const handleChangeMOB = (option: SelectOptionType | null) => {
    if (option) {
      setSelectedMOB(option);
      setPetInfo((prevState) => ({
        ...prevState,
        monthOfBirth: option,
      }));
    }
  };

  useEffect(() => {
    if (id) {
      const fetchPets = async () => {
        let { data: pet, error } = await supabase
          .from("pet")
          .select()
          .eq("id", id);

        if (error) {
          setFetchError("Could not fetch the smoothies");
          toast.error("Could not fetch the smoothies", {
            autoClose: 2000,
          });
        }
        if (pet && pet?.length > 0) {
          if (pet[0]?.monthOfBirth)
            setSelectedMOB(JSON.parse(pet[0].monthOfBirth));
          if (pet[0]?.yearOfBirth)
            setSelectedYOB(JSON.parse(pet[0].yearOfBirth));

          setSpeciesConfirmed(true);
          setPetInfo(pet[0] as unknown as PET);
          setSelectedBreed(pet[0].breed);
        }
      };
      fetchPets();
    }
  }, [id]);

  const handleChangeBreed = (option: SelectOptionType | null) => {
    if (option) {
      setSelectedBreed(option);
      setPetInfo((prevState) => ({
        ...prevState,
        breed: option,
      }));
    }
  };

  const BreedData = useMemo(
    () =>
      breeds
        .filter((breed) =>
          petInfo.species === SPECIES.dog
            ? breed.species_id === 1
            : breed.species_id === 2
        )
        .map((v) => ({
          ...v,
          name: i18n.language === "en" ? v.name_us : v.name_mx,
        })),
    [breeds, i18n.language, petInfo]
  );

  const options = useMemo(() => {
    return BreedData?.map((breed) => {
      if (petInfo.mixedBreed) {
        return {
          value: breed.id.toString(),
          label:
            breed.name !== "Other" && breed.name !== "Unknown"
              ? `${breed.name} mix`
              : breed.name,
        };
      } else {
        return {
          value: breed.id.toString(),
          label: breed.name,
        };
      }
    });
  }, [BreedData, petInfo.mixedBreed]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPetInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onchangeChecked = (groupName: string, value: string | boolean) => {
    setPetInfo((prevState) => ({
      ...prevState,
      [groupName]: value,
    }));
  };

  const handleSubmitSpecies = async (e: any) => {
    e.preventDefault();

    console.log("SPECIES: ", petInfo.species);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let DataPet = petInfo;
    if (!DataPet.knowsDateOfBirth) {
      let year = Number(selectedYOB?.value);
      let month = Number(selectedMOB?.value);
      if (year && month) {
        DataPet.dateOfBirth = calculateDateOfBirth(year, month);
      }
    }
    if (id) {
      const { data, error } = await supabase
        .from("pet")
        .update(DataPet)
        .eq("id", id);
      if (error) {
        setFormError("Please fill in all the fields correctly.");
        toast.error("Please fill in all the fields correctly.", {
          autoClose: 2000,
        });
      } else {
        setFormError(null);
        navigate("/");
      }
    } else {
      const { data, error } = await supabase.from("pet").insert([DataPet]);
      console.log("data", data, error);
      if (error) {
        console.log("data", data, error);
        setFormError("Please fill in all the fields correctly.");
        toast("Please fill in all the fields correctly.", {
          autoClose: 2000,
        });
      } else {
        setFormError(null);
        navigate("/");
      }
    }
  };

  const handleBackToSpecies = () => {
    setSpeciesConfirmed(false);
    setPetInfo((prevState) => ({
      ...prevState,
      species: null,
    }));
  };

  return (
    <Wrapper>
      <ToastContainer />
      <FormStyled onSubmit={handleSubmitSpecies}>
        <Form.Group className="mb-3" controlId="species">
          {!speciesConfirmed && <Form.Label>{t("species")}</Form.Label>}
          <SpeciesContainer>
            {petInfo.species === SPECIES.cat && speciesConfirmed ? null : (
              <ImgContainer
                className={petInfo.species === SPECIES.dog ? "active" : ""}
                title="Dog"
              >
                <StyledImg
                  src={DOG}
                  alt="Dog"
                  onClick={() => {
                    setPetInfo((prevState) => ({
                      ...prevState,
                      species: SPECIES.dog,
                    }));
                  }}
                />
              </ImgContainer>
            )}

            {petInfo.species === SPECIES.dog && speciesConfirmed ? null : (
              <ImgContainer
                className={petInfo.species === SPECIES.cat ? "active" : ""}
                title="Cat"
              >
                <StyledImg
                  src={CAT}
                  alt="Cat"
                  onClick={() => {
                    setPetInfo((prevState) => ({
                      ...prevState,
                      species: SPECIES.cat,
                    }));
                  }}
                />
              </ImgContainer>
            )}
          </SpeciesContainer>
        </Form.Group>

        {speciesConfirmed || petInfo.species === null ? null : (
          <div className="d-flex justify-content-end">
            <ButtonS
              variant="primary"
              type="submit"
              onClick={() => setSpeciesConfirmed(true)}
            >
              {t("confirm")}
            </ButtonS>
          </div>
        )}
        {speciesConfirmed && !id && (
          <ButtonS
            variant="primary"
            type="submit"
            style={{
              position: "absolute",
              top: "140px",
              left: "104px",
              padding: "0.3rem 1.2rem",
              borderRadius: "30px 10px 10px 30px",
            }}
            onClick={handleBackToSpecies}
          >
            <IoMdArrowRoundBack
              style={{ position: "relative", bottom: "2px", right: "9px" }}
            />
            Back
          </ButtonS>
        )}
      </FormStyled>

      {speciesConfirmed && (
        <FormStyled onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Label>{t("petNameLabel")}</Label>
            <Control
              type="text"
              name="name"
              value={petInfo.name}
              onChange={handleChange}
              placeholder={t("formPlaceholders.petName")}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3 d-flex flex-column" controlId="owner">
            <Label className="me-4">{t("notMyPet")}</Label>
            <Form.Check
              inline
              label={t("yes")}
              name="owner"
              id="owner-yes"
              checked={petInfo.owner === true}
              onChange={() =>
                setPetInfo((prevState) => ({ ...prevState, owner: true }))
              }
              type="radio"
            />
            <Form.Check
              inline
              label="No"
              name="owner"
              id="owner-no"
              checked={petInfo.owner === false}
              onChange={() =>
                setPetInfo((prevState) => ({ ...prevState, owner: false }))
              }
              type="radio"
            />
          </Form.Group>

          {!petInfo.owner && (
            <ContainerS className="d-flex gap-4 justify-content-between p-0">
              <Form.Group className="mb-3 w-100" controlId="ownerName">
                <Label>{t("ownerName")}</Label>
                <Control
                  type="text"
                  name="ownerName"
                  value={petInfo.ownerName}
                  onChange={handleChange}
                  placeholder={t("formPlaceholders.ownerName")}
                />
              </Form.Group>

              <Form.Group className="mb-3 w-100" controlId="ownerNumber">
                <Label>{t("ownerNumber")}</Label>
                <Control
                  type="text"
                  name="ownerNumber"
                  value={petInfo.ownerNumber}
                  onChange={handleChange}
                  placeholder={t("formPlaceholders.ownerNumber")}
                />
              </Form.Group>
            </ContainerS>
          )}

          <Form.Group
            className="mb-3 d-flex flex-column"
            controlId="mixedBreed"
          >
            <Label className="me-4">{t("mixedBreed")}</Label>
            <Form.Check
              inline
              label={t("yes")}
              name="mixedBreed"
              id="mixedBreed-yes"
              checked={petInfo.mixedBreed === true}
              onChange={() =>
                setPetInfo((prevState) => ({
                  ...prevState,
                  mixedBreed: true,
                }))
              }
              type="radio"
            />
            <Form.Check
              inline
              label="No"
              name="mixedBreed"
              id="mixedBreed-no"
              checked={petInfo.mixedBreed === false}
              onChange={() =>
                setPetInfo((prevState) => ({
                  ...prevState,
                  mixedBreed: false,
                }))
              }
              type="radio"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="breed">
            <Label>{t("breedLabel")}</Label>
            <Select
              value={selectedBreed}
              onChange={handleChangeBreed}
              placeholder={<div>{t("selectBreed")}</div>}
              options={options}
              required
            />
          </Form.Group>

          {selectedBreed?.label === "Other" && (
            <Form.Group className="mb-3" controlId="breedName">
              <Label>{t("breedName")}</Label>
              <Control
                type="text"
                name="breedName"
                value={petInfo.breedName}
                onChange={handleChange}
                placeholder={t("formPlaceholders.breedName")}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3 d-flex flex-column" controlId="gender">
            <Label className="me-4">{t("genderQuestion")}</Label>
            <Form.Check
              inline
              label={t("male")}
              name="gender"
              id="gender-male"
              checked={petInfo.gender === true}
              onChange={() =>
                setPetInfo((prevState) => ({ ...prevState, gender: true }))
              }
              type="radio"
            />
            <Form.Check
              inline
              label={t("female")}
              name="gender"
              id="gender-female"
              checked={petInfo.gender === false}
              onChange={() =>
                setPetInfo((prevState) => ({ ...prevState, gender: false }))
              }
              type="radio"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="color">
            <Label>{t("colorLabel")}</Label>
            <Control
              type="text"
              name="color"
              value={petInfo.color}
              onChange={handleChange}
              placeholder={t("formPlaceholders.petColor")}
              required
            />
          </Form.Group>

          <Form.Group
            className="mb-3 d-flex flex-column"
            controlId="knowsDateOfBirth"
          >
            <Label className="me-4">{t("dateOfBirthQuestion")}</Label>
            <Form.Check
              inline
              label={t("yes")}
              name="knowsDateOfBirth"
              id="knowsDateOfBirth-yes"
              checked={petInfo.knowsDateOfBirth === true}
              onChange={() => onchangeChecked("knowsDateOfBirth", true)}
              type="radio"
            />
            <Form.Check
              inline
              label="No"
              name="knowsDateOfBirth"
              id="knowsDateOfBirth-no"
              checked={petInfo.knowsDateOfBirth === false}
              onChange={() => onchangeChecked("knowsDateOfBirth", false)}
              type="radio"
            />
          </Form.Group>

          {petInfo.knowsDateOfBirth ? (
            <Form.Group className="mb-3" controlId="dateOfBirth">
              <Label>{t("dateOfBirth")}</Label>
              <Control
                type="date"
                name="dateOfBirth"
                value={petInfo.dateOfBirth}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                required={petInfo.knowsDateOfBirth}
              />
            </Form.Group>
          ) : (
            <ContainerS className="d-flex gap-4 justify-content-between p-0">
              <Form.Group className="mb-3 w-100" controlId="yearOfBirth">
                <Label>{t("yearOfBirth")}</Label>
                <Select
                  value={selectedYOB}
                  onChange={handleChangeYOB}
                  placeholder={<div>{t("formPlaceholders.yearOfBirth")}</div>}
                  options={yobRenderOptions()}
                  required={!petInfo.knowsDateOfBirth}
                />
              </Form.Group>

              <Form.Group className="mb-3 w-100" controlId="monthOfBirth">
                <Label>{t("monthOfBirth")}</Label>
                <Select
                  value={selectedMOB}
                  onChange={handleChangeMOB}
                  placeholder={<div>{t("formPlaceholders.monthOfBirth")}</div>}
                  options={mobRenderOptions()}
                  required={!petInfo.knowsDateOfBirth}
                />
              </Form.Group>
            </ContainerS>
          )}

          <Form.Group
            className="mb-3 d-flex flex-column"
            controlId="isFirstVaccination"
          >
            <Label className="me-4">{t("firstVaccinationQuestion")}</Label>
            <Form.Check
              inline
              label={t("yes")}
              name="isFirstVaccination"
              id="isFirstVaccination-yes"
              checked={petInfo.isFirstVaccination === true}
              onChange={() => onchangeChecked("isFirstVaccination", true)}
              type="radio"
            />
            <Form.Check
              inline
              label="No"
              name="isFirstVaccination"
              id="isFirstVaccination-no"
              checked={petInfo.isFirstVaccination === false}
              onChange={() => onchangeChecked("isFirstVaccination", false)}
              type="radio"
            />
          </Form.Group>

          {!petInfo.isFirstVaccination && (
            <Form.Group className="mb-3" controlId="VaccineTextarea">
              <Label>{t("VaccineTextarea")}</Label>
              <Control
                type="textarea"
                name="VaccineTextarea"
                value={petInfo.VaccineTextarea}
                onChange={handleChange}
                placeholder={t("formPlaceholders.VaccineTextarea")}
                required
              />
            </Form.Group>
          )}

          {!petInfo.isFirstVaccination && (
            <Form.Group
              className="mb-3 d-flex flex-column"
              controlId="vaccinationReaction"
            >
              <Label className="me-4">{t("vaccineReactionsQuestion")}</Label>
              <Form.Check
                inline
                label={t("yes")}
                name="vaccinationReaction"
                id="vaccinationReaction-yes"
                checked={petInfo.vaccinationReaction === true}
                onChange={() => onchangeChecked("vaccinationReaction", true)}
                type="radio"
              />
              <Form.Check
                inline
                label="No"
                name="vaccinationReaction"
                id="vaccinationReaction-no"
                checked={petInfo.vaccinationReaction === false}
                onChange={() => onchangeChecked("vaccinationReaction", false)}
                type="radio"
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3 d-flex flex-column" controlId="neutering">
            <Label className="me-4">{t("neuteredQuestion")}</Label>
            <Form.Check
              inline
              label={t("yes")}
              name="neutering"
              id="neutering-yes"
              checked={petInfo.neutering === true}
              onChange={() => onchangeChecked("neutering", true)}
              type="radio"
            />
            <Form.Check
              inline
              label="No"
              name="neutering"
              id="neutering-no"
              checked={petInfo.neutering === false}
              onChange={() => onchangeChecked("neutering", false)}
              type="radio"
            />
          </Form.Group>

          {!petInfo.gender && !petInfo.neutering && (
            <Form.Group
              className="mb-3 d-flex flex-column"
              controlId="pregnant"
            >
              <Label className="me-4">{t("pregnantQuestion")}</Label>
              <Form.Check
                inline
                label={t("yes")}
                name="pregnant"
                id="pregnant-yes"
                checked={petInfo.pregnant === true}
                onChange={() => onchangeChecked("pregnant", true)}
                type="radio"
              />
              <Form.Check
                inline
                label="No"
                name="pregnant"
                id="pregnant-no"
                checked={petInfo.pregnant === false}
                onChange={() => onchangeChecked("pregnant", false)}
                type="radio"
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3 d-flex flex-column" controlId="sick">
            <Label className="me-4">{t("sickQuestion")}</Label>
            <Form.Check
              inline
              label={t("yes")}
              name="sick"
              id="sick-yes"
              checked={petInfo.sick === true}
              onChange={() => onchangeChecked("sick", true)}
              type="radio"
            />
            <Form.Check
              inline
              label="No"
              name="sick"
              id="sick-no"
              checked={petInfo.sick === false}
              onChange={() => onchangeChecked("sick", false)}
              type="radio"
            />
          </Form.Group>

          <Form.Group
            className="mb-3 d-flex flex-column"
            controlId="heartwormPrevention"
          >
            <Label className="me-4">{t("heartwormPrevention")}</Label>
            <Form.Check
              inline
              label={t("yes")}
              name="heartwormPrevention"
              id="heartwormPrevention-yes"
              checked={petInfo.heartwormPrevention === true}
              onChange={() =>
                setPetInfo((prevState) => ({
                  ...prevState,
                  heartwormPrevention: true,
                }))
              }
              type="radio"
            />
            <Form.Check
              inline
              label="No"
              name="heartwormPrevention"
              id="heartwormPrevention-no"
              checked={petInfo.heartwormPrevention === false}
              onChange={() =>
                setPetInfo((prevState) => ({
                  ...prevState,
                  heartwormPrevention: false,
                }))
              }
              type="radio"
            />
          </Form.Group>

          {/* Add more Form.Group components for additional fields */}
          <div className="d-flex justify-content-end">
            <ButtonS variant="primary" type="submit">
              {!id ? t("addPet") : t("Edit Pet")}
            </ButtonS>
          </div>
          {formError && <p className="error">{formError}</p>}
        </FormStyled>
      )}
    </Wrapper>
  );
};

const FormStyled = styled(Form)`
  max-width: 600px;
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 6px;
`;

const Label = styled(Form.Label)`
  font-size: 16px;
`;

const Control = styled(Form.Control)`
  padding: 14px 10px;
`;

const ButtonS = styled(Button)`
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

const ContainerS = styled(Container)`
  max-width: unset;
  @media only screen and (max-width: 600px) {
    flex-direction: column;
    gap: 0 !important;
  }
`;

const StyledImg = styled("img")`
  width: 80%;
  height: 80%;
  object-fit: contain;
`;

const SpeciesContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
`;

const ImgContainer = styled("div")`
  width: 130px;
  height: 130px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 2px solid #cbcbcb;

  cursor: pointer;
  transition: all 0.2s linear;
  &:hover {
    border-width: 5px;
  }
  &.active {
    border-width: 10px;
  }
`;

export default Home;
