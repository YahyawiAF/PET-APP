import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import styled from "styled-components";

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

const Profile = () => {
  const [ownerInfo, setOwnerInfo] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    address: "",
    phoneNumber: "",
    email: "",

    // Add more fields as needed
  });

  const [selectedGender, setSelectedGender] = useState<SelectOptionType | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const genderOptions: SelectOptionType[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const handleChangeGender = (option: SelectOptionType | null) => {
    if (option) {
      setSelectedGender(option);
      setOwnerInfo((prevState) => ({
        ...prevState,
        gender: option.label,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(ownerInfo);
  };

  return (
    <Wrapper>
      <FormStyled onSubmit={handleSubmit}>
        <ContainerS className="d-flex gap-4 justify-content-between p-0" >
          <Form.Group className="fied-name mb-3" controlId="firstName">
            <Label>First name</Label>
            <Control
              type="text"
              name="firstName"
              value={ownerInfo.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
            />
          </Form.Group>

          <Form.Group className="fied-name mb-3" controlId="lastName">
            <Label>Last name</Label>
            <Control
              type="text"
              name="lastName"
              value={ownerInfo.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
            />
          </Form.Group>
        </ContainerS>

        <Form.Group className="mb-3" controlId="breed">
          <Label>Gender</Label>
          <Select
            value={selectedGender}
            onChange={handleChangeGender}
            placeholder={<div>Please select your gender</div>}
            options={genderOptions}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="dateOfBirth">
          <Label>Date of birth</Label>
          <Control
            type="date"
            name="dateOfBirth"
            value={ownerInfo.dateOfBirth || ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Label>Address</Label>
          <Control
            type="text"
            name="address"
            value={ownerInfo.address}
            onChange={handleChange}
            placeholder="Address..."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phoneNumber">
          <Label>Phone number</Label>
          <Control
            type="tel"
            name="phoneNumber"
            value={ownerInfo.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Label>Email</Label>
          <Control
            type="email"
            name="email"
            value={ownerInfo.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </Form.Group>

        {/* Add more Form.Group components for additional fields */}

        <div className="d-flex justify-content-end">
          <ButtonS variant="primary" type="submit">
            Add Owner
          </ButtonS>
        </div>
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

const ContainerS = styled(Container)`
 @media only screen and (max-width: 750px) {
    flex-direction: column; 
    gap: 0;
 }
`;

export default Profile;