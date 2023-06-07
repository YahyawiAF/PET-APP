import { Button, Container, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import Breeds from "../../constant/breed.json";
import supabase from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthProvider";

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

const Home = () => {
  const { t } = useTranslation();

  const [fetchError, setFetchError] = useState<string | null>(null);
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
    gender: true,
    sick: false,
    pregnant: false,
    userID: user.id,
    mixedBreed: false,
    VaccineTextarea: "",
    heartwormPrevention: false,

    // Add more fields as needed
  });
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [selectedBreed, setSelectedBreed] = useState<SelectOptionType | null>(
    null
  );

  const [selectedYOB, setSelectedYOB] = useState<SelectOptionType | null>(null);

  const [selectedMOB, setSelectedMOB] = useState<SelectOptionType | null>(null);

  const yobRenderOptions = (): SelectOptionType[] => {
    const yobOptions: SelectOptionType[] = [
      { label: "Less than one year", value: "lessThanOneYear" },
      { label: "20 years or above", value: "twentyYearsOrAbove" },
    ];
    for (let i = 1; i <= 19; i++) {
      yobOptions.push({
        label: `${i} year${i !== 1 ? "s" : ""}`,
        value: i.toString(),
      });
    }

    return yobOptions;
  };

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
      { label: "Less than one month", value: "lessThanOneMonth" },
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
          // setPets(null);
        }
        if (pet) {
          setPetInfo(pet[0] as unknown as PET);
          setSelectedBreed(pet[0].breed);
        }
      };
      fetchPets();
    }
  }, [id]);

  const [knowsDateOfBirth, setKnowsDateOfBirth] = useState(true);

  const handleChangeBreed = (option: SelectOptionType | null) => {
    if (option) {
      setSelectedBreed(option);
      setPetInfo((prevState) => ({
        ...prevState,
        breed: option,
      }));
    }
  };

  const BreedData = useMemo(() => Breeds, [Breeds]);

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    if (id) {
      const { data, error } = await supabase
        .from("pet")
        .update(petInfo)
        .eq("id", id);
      if (error) {
        setFormError("Please fill in all the fields correctly.");
      }
    } else {
      const { data, error } = await supabase.from("pet").insert([petInfo]);
      if (error) {
        setFormError("Please fill in all the fields correctly.");
      }
    }

    setFormError(null);
    navigate("/");
  };

  // console.log("VaccineTextarea", petInfo.VaccineTextarea);

  return (
    <Wrapper>
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
          <Container className="d-flex gap-4 justify-content-between p-0">
            <Form.Group className="mb-3" controlId="ownerName">
              <Label>{t("ownerName")}</Label>
              <Control
                type="text"
                name="ownerName"
                value={petInfo.ownerName}
                onChange={handleChange}
                placeholder={t("formPlaceholders.ownerName")}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="ownerNumber">
              <Label>{t("ownerNumber")}</Label>
              <Control
                type="text"
                name="ownerNumber"
                value={petInfo.ownerNumber}
                onChange={handleChange}
                placeholder={t("formPlaceholders.ownerNumber")}
              />
            </Form.Group>
          </Container>
        )}

        <Form.Group className="mb-3 d-flex flex-column" controlId="mixedBreed">
          <Label className="me-4">{t("mixedBreed")}</Label>
          <Form.Check
            inline
            label={t("yes")}
            name="mixedBreed"
            id="mixedBreed-yes"
            checked={petInfo.mixedBreed === true}
            onChange={() =>
              setPetInfo((prevState) => ({ ...prevState, mixedBreed: true }))
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
              setPetInfo((prevState) => ({ ...prevState, mixedBreed: false }))
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
            />
          </Form.Group>
        ) : (
          <Container className="d-flex gap-4 justify-content-between p-0">
            <Form.Group className="mb-3 w-100" controlId="yearOfBirth">
              <Label>{t("yearOfBirth")}</Label>
              <Select
                value={selectedYOB}
                onChange={handleChangeYOB}
                placeholder={<div>{t("formPlaceholders.yearOfBirth")}</div>}
                options={yobRenderOptions()}
              />
            </Form.Group>

            <Form.Group className="mb-3 w-100" controlId="monthOfBirth">
              <Label>{t("monthOfBirth")}</Label>
              <Select
                value={selectedMOB}
                onChange={handleChangeMOB}
                placeholder={<div>{t("formPlaceholders.monthOfBirth")}</div>}
                options={mobRenderOptions()}
              />
            </Form.Group>
          </Container>
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
          <Form.Group className="mb-3 d-flex flex-column" controlId="pregnant">
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

export default Home;
