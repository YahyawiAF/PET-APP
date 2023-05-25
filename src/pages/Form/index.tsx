import { Button, Container, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import Breeds from "../../constant/breed.json";
import supabase from "../../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

interface PET {
  name: string;
  breed: string;
  owner: string;
  contactInfo: string;
  dateOfBirth: null;
  yearOfBirth: string;
  monthOfBirth: string;
  color: string;
  isFirstVaccination: boolean;
  neutering: boolean;
  vaccinationReaction: boolean;
  gender: string;
  sick: boolean;
  pregnant: boolean;
  knowsDateOfBirth: boolean;
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
  const [fetchError, setFetchError] = useState<string | null>(null);
  let { id } = useParams();
  const [petInfo, setPetInfo] = useState<PET>({
    name: "",
    breed: "",
    owner: "",
    contactInfo: "",
    dateOfBirth: null,
    yearOfBirth: "",
    monthOfBirth: "",
    color: "",
    knowsDateOfBirth: false,
    isFirstVaccination: false,
    neutering: false,
    vaccinationReaction: false,
    gender: "",
    sick: false,
    pregnant: false,

    // Add more fields as needed
  });
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [selectedBreed, setSelectedBreed] = useState<SelectOptionType | null>(
    null
  );

  useEffect(() => {
    if (id) {
      const fetchSmoothies = async () => {
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
        }
      };
      fetchSmoothies();
    }
  }, [id]);

  const [knowsDateOfBirth, setKnowsDateOfBirth] = useState(true);

  const handleChangeBreed = (option: SelectOptionType | null) => {
    if (option) {
      setSelectedBreed(option);
      setPetInfo((prevState) => ({
        ...prevState,
        breed: option.label,
      }));
    }
  };

  const BreedData = useMemo(() => Breeds, [Breeds]);

  const options = useMemo(() => {
    return Breeds?.map((breed) => ({
      value: breed.id.toString(),
      label: breed.name,
    }));
  }, [BreedData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPetInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onchangeChecked = (e: any) => {
    const { name, value } = e.target;
    console.log("vale", value, "name", name);
    setPetInfo((prevState) => ({
      ...prevState,
      [name]: value === "yes" ? true : false,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    if (id) {
      const { error } = await supabase.from("pet").update(petInfo).eq("id", id);
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

  return (
    <Wrapper>
      <FormStyled onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Label>Name</Label>
          <Control
            type="text"
            name="name"
            value={petInfo.name}
            onChange={handleChange}
            placeholder="Enter pet name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column" controlId="owner">
          <Label className="me-4">Not my Pet</Label>
          <Form.Check
            inline
            label="Yes"
            name="owner"
            checked={Boolean(petInfo.owner)}
            onChange={onchangeChecked}
            value="yes"
            type="radio"
          />
          <Form.Check
            checked={!Boolean(petInfo.owner)}
            inline
            label="No"
            name="owner"
            value="no"
            type="radio"
          />
        </Form.Group>

        {petInfo.owner === "no" && (
          <Form.Group className="mb-3" controlId="contactInfo">
            <Label>
              If you are not the pet's owner please provide owner contact info
            </Label>
            <Control
              type="text"
              name="contactInfo"
              value={petInfo.contactInfo}
              onChange={handleChange}
              placeholder="Enter phone number or email address"
            />
          </Form.Group>
        )}

        {/* <Form.Group className="mb-3 d-flex flex-column" controlId="hasAccount">
          <Label className="me-4">Pet already has an account</Label>
          <Form.Check
            inline
            label="Yes"
            name="hasAccount"
            value="yes"
            type="radio"
          />
          <Form.Check
            inline
            label="No"
            name="hasAccount"
            value="no"
            type="radio"
            onChange={handleChange}
          />
        </Form.Group> */}

        <Form.Group
          className="mb-3 d-flex flex-column"
          controlId="knowsDateOfBirth"
        >
          <Label className="me-4">do you know the pet's date of birth</Label>
          <Form.Check
            inline
            checked={Boolean(petInfo.knowsDateOfBirth)}
            label="Yes"
            onChange={onchangeChecked}
            name="knowsDateOfBirth"
            value="yes"
            type="radio"
          />
          <Form.Check
            inline
            label="No"
            name="knowsDateOfBirth"
            checked={!Boolean(petInfo.knowsDateOfBirth)}
            value="no"
            type="radio"
            onChange={onchangeChecked}
          />
        </Form.Group>

        {petInfo.knowsDateOfBirth ? (
          <Form.Group className="mb-3" controlId="dateOfBirth">
            <Label>pet date of birth</Label>
            <Control
              type="date"
              name="dateOfBirth"
              value={petInfo.dateOfBirth}
              max={new Date().toISOString().split("T")[0]}
              onChange={handleChange}
              placeholder="Enter phone number or email address"
            />
          </Form.Group>
        ) : (
          <Container className="d-flex gap-4 justify-content-between p-0">
            <Form.Group className="mb-3" controlId="yearOfBirth">
              <Label>Year of birth</Label>
              <Control
                type="number"
                name="yearOfBirth"
                value={petInfo.yearOfBirth}
                onChange={handleChange}
                placeholder="Enter year of birth"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="monthOfBirth">
              <Label>Month of birth</Label>
              <Control
                type="number"
                name="monthOfBirth"
                value={petInfo.monthOfBirth}
                onChange={handleChange}
                placeholder="Enter month of birth"
                required
              />
            </Form.Group>
          </Container>
        )}

        <Form.Group className="mb-3" controlId="breed">
          <Label>Breed</Label>
          <Select
            value={selectedBreed}
            onChange={handleChangeBreed}
            placeholder={<div>Please Select a Breed</div>}
            options={options}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="color">
          <Label>Color</Label>
          <Control
            type="text"
            name="color"
            value={petInfo.color}
            onChange={handleChange}
            placeholder="pet's color"
            required
          />
        </Form.Group>

        <Form.Group
          className="mb-3 d-flex flex-column"
          controlId="isFirstVaccination"
        >
          <Label className="me-4">Is this pet first vaccination</Label>
          <Form.Check
            inline
            label="Yes"
            value="yes"
            checked={Boolean(petInfo.isFirstVaccination)}
            name="isFirstVaccination"
            type="radio"
            onChange={onchangeChecked}
          />
          <Form.Check
            inline
            label="No"
            value="no"
            name="isFirstVaccination"
            checked={!Boolean(petInfo.isFirstVaccination)}
            type="radio"
            onChange={onchangeChecked}
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column" controlId="neutering">
          <Label className="me-4">Is this pet neutered/spayed </Label>
          <Form.Check
            inline
            checked={Boolean(petInfo.neutering)}
            onChange={onchangeChecked}
            label="Yes"
            value="yes"
            name="neutering"
            type="radio"
          />
          <Form.Check
            inline
            checked={!Boolean(petInfo.neutering)}
            onChange={onchangeChecked}
            label="No"
            value="no"
            name="neutering"
            type="radio"
          />
        </Form.Group>

        <Form.Group
          className="mb-3 d-flex flex-column"
          controlId="vaccinationReaction"
        >
          <Label className="me-4">
            Has pet had reactions to a vaccine in the past
          </Label>
          <Form.Check
            onChange={onchangeChecked}
            inline
            label="Yes"
            value="yes"
            checked={Boolean(petInfo.vaccinationReaction)}
            name="vaccinationReaction"
            type="radio"
          />
          <Form.Check
            onChange={onchangeChecked}
            inline
            label="No"
            value="no"
            checked={!Boolean(petInfo.vaccinationReaction)}
            name="vaccinationReaction"
            type="radio"
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column" controlId="gender">
          <Label className="me-4">Is your pet male or female</Label>
          <Form.Check
            onChange={onchangeChecked}
            inline
            label="Male"
            name="gender"
            value="Male"
            checked={petInfo.gender === "Male"}
            type="radio"
          />
          <Form.Check
            onChange={onchangeChecked}
            inline
            label="Female"
            name="gender"
            value="Female"
            checked={petInfo.gender === "Female"}
            type="radio"
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column" controlId="sick">
          <Label className="me-4">Is your pet sick</Label>
          <Form.Check
            checked={Boolean(petInfo.sick)}
            onChange={onchangeChecked}
            inline
            label="yes"
            value="yes"
            name="sick"
            type="radio"
          />
          <Form.Check
            checked={!Boolean(petInfo.sick)}
            onChange={onchangeChecked}
            inline
            label="No"
            value="no"
            name="sick"
            type="radio"
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex flex-column" controlId="pregnant">
          <Label className="me-4">Is your pet pregnant</Label>
          <Form.Check
            checked={Boolean(petInfo.pregnant)}
            onChange={onchangeChecked}
            inline
            label="yes"
            value="yes"
            name="pregnant"
            type="radio"
          />
          <Form.Check
            checked={!Boolean(petInfo.pregnant)}
            onChange={onchangeChecked}
            inline
            label="No"
            value="no"
            name="pregnant"
            type="radio"
          />
        </Form.Group>

        {/* Add more Form.Group components for additional fields */}
        <div className="d-flex justify-content-end">
          <ButtonS variant="primary" type="submit">
            {!id ? "Add Pet" : "Edit Pet"}
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
  padding: 8px 40px;
`;

export default Home;
