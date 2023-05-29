import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import styled from "styled-components";
import { useAuth } from "../../context/AuthProvider";
import supabase from "../../config/supabaseClient";
import { useTranslation } from "react-i18next";



interface PROFILE {
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: null;
  address: string;
  phoneNumber: string;
  email: string;
  id?: string
}

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
  const { t } = useTranslation();

  const {user} = useAuth()
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<PROFILE>({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    address: "",
    phoneNumber: "",
    email: "",
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

  useEffect(() => {
    if (user?.id) {
      const fetchProfile = async () => {
        let { data: profile, error } = await supabase
          .from("profiles")
          .select()
          .eq("userID", user?.id);
        if (error) {
          setFetchError("Could not fetch the smoothies");
          // setPets(null);
        }
        if (profile && profile?.length > 0) {
          
          setOwnerInfo(profile[0] as unknown as PROFILE );
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleChangeGender = (option: SelectOptionType | null) => {
    if (option) {
      setSelectedGender(option);
      setOwnerInfo((prevState) => ({
        ...prevState,
        gender: option.label,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    if(ownerInfo?.id) {
      const { error } = await supabase.from("profiles").update(ownerInfo).eq("id", ownerInfo.id);
      if (error) {
        setFetchError("Please fill in all the fields correctly.");
      }
    } else {
      const { error } = await supabase.from("profiles").insert({...ownerInfo, userID: user.id});
      if (error) {
        setFetchError("Please fill in all the fields correctly.");
      }
    }

  };

  return (
    <Wrapper>
      <FormStyled onSubmit={handleSubmit}>
        <ContainerS className="d-flex gap-4 justify-content-between p-0" >
          <Form.Group className="fied-name mb-3" controlId="firstName">
            <Label>{t("firstName")}</Label>
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
            <Label>{t("lastName")}</Label>
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

        <Form.Group className="mb-3" controlId="gender">
          <Label>{t("genderLabel")}</Label>
          <Select
            value={selectedGender}
            onChange={handleChangeGender}
            placeholder={<div>{t("selectGender")}</div>}
            options={genderOptions}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="dateOfBirth">
          <Label>{t("dateOfBirth")}</Label>
          <Control
            type="date"
            name="dateOfBirth"
            value={ownerInfo.dateOfBirth}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Label>{t("address")}</Label>
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
          <Label>{t("phoneNumber")}</Label>
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
          <Label>{t("email")}</Label>
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
          {t("addOwner")}
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
