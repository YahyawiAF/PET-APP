import { Button, Form, Row } from "react-bootstrap";
import styled from "styled-components";
import { useMemo, useState } from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import Breeds from "../../constant/breed.json";

type Props = {
  handleBreedSelectChange: (breedId: string) => void;
};
type SelectOptionType = { label: string; value: string };

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Home = () => {
  const [petInfo, setPetInfo] = useState({
    name: "",
    breed: "",
    age: "",
    owner: false,
    // Add more fields as needed
  });
  const [selectedBreed, setSelectedBreed] = useState<SelectOptionType | null>(
    null
  );
  const [selected, setSelected] = useState<Date>();

  const handleChangeBreed = (option: SelectOptionType | null) => {
    if (option) {
      setSelectedBreed(option);
      setPetInfo((prevState) => ({
        ...prevState,
        breed: option.value,
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

  console.log("options", options);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPetInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(petInfo);
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

        <Form.Group className="mb-3 d-flex" controlId="name">
          <Label className="me-4">Not my Pet</Label>
          <Form.Check inline label="Yes" name="owner" type={"radio"} />
          <Form.Check inline label="No" name="owner" type={"radio"} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="breed">
          <Label>Breed</Label>
          <Select
            value={selectedBreed}
            onChange={handleChangeBreed}
            placeholder={<div>Please Select Bread</div>}
            options={options}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="age">
          <Label>Age</Label>
          <Control
            type="number"
            name="age"
            value={petInfo.age}
            onChange={handleChange}
            placeholder="Enter pet age"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3 d-flex" controlId="name">
          <Label className="me-4">Pet Already had an account</Label>
          <Form.Check inline label="Yes" name="owner" type={"radio"} />
          <Form.Check inline label="No" name="owner" type={"radio"} />
        </Form.Group>

        <Form.Group className="mb-3 d-flex" controlId="name">
          <Label className="me-4">Is this pet first vaccination</Label>
          <Form.Check inline label="Yes" name="owner" type={"radio"} />
          <Form.Check inline label="No" name="owner" type={"radio"} />
        </Form.Group>

        {/* Add more Form.Group components for additional fields */}
        <div className="d-flex justify-content-end">
          <ButtonS variant="primary" type="submit">
            Add Pet
          </ButtonS>
        </div>
      </FormStyled>
    </Wrapper>
  );
};

const FormStyled = styled(Form)`
  max-width: 600px;
  width: 100%;
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
