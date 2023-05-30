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
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  email: string;
  id?: string;
}

type SelectOptionType = { label: string; value: string };

const Profile = () => {
  const { t } = useTranslation();

  const { user } = useAuth();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<PROFILE>({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
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
        if (profile) {
          setOwnerInfo(profile[0] as unknown as PROFILE);
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
    if (ownerInfo?.id) {
      const { error } = await supabase
        .from("profiles")
        .update(ownerInfo)
        .eq("id", ownerInfo.id);
      if (error) {
        setFetchError("Please fill in all the fields correctly.");
      }
    } else {
      const { error } = await supabase
        .from("profiles")
        .insert({ ...ownerInfo, userID: user.id });
      if (error) {
        setFetchError("Please fill in all the fields correctly.");
      }
    }
  };

  return (
    <Wrapper>
      <FormStyled onSubmit={handleSubmit}>
        <ContainerS className="d-flex gap-4 justify-content-between p-0">
          <Form.Group className="field-name mb-3" controlId="firstName">
            <Label>{t("firstName")}</Label>
            <Control
              type="text"
              name="firstName"
              value={ownerInfo?.firstName ?? ""}
              onChange={handleChange}
              placeholder={t("ProfilePlaceholder.firstName")}
              required
            />
          </Form.Group>

          <Form.Group className="field-name mb-3" controlId="lastName">
            <Label>{t("lastName")}</Label>
            <Control
              type="text"
              name="lastName"
              value={ownerInfo?.lastName ?? ""}
              onChange={handleChange}
              placeholder={t("ProfilePlaceholder.lastName")}
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
            value={ownerInfo?.dateOfBirth ?? ""}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="address">
          <Label>{t("address")}</Label>
          <Control
            type="text"
            name="address"
            value={ownerInfo?.address ?? ""}
            onChange={handleChange}
            placeholder={t("ProfilePlaceholder.address")}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phoneNumber">
          <Label>{t("phoneNumber")}</Label>
          <Control
            type="tel"
            name="phoneNumber"
            value={ownerInfo?.phoneNumber ?? ""}
            onChange={handleChange}
            placeholder={t("ProfilePlaceholder.phoneNumber")}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Label>{t("email")}</Label>
          <Control
            type="email"
            name="email"
            value={ownerInfo?.email ?? ""}
            onChange={handleChange}
            placeholder={t("ProfilePlaceholder.email")}
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  @media only screen and (max-width: 600px) {
    padding: 10px;
  }
`;

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
  transition: 0.4s all;
  &:hover {
    border: 2px solid var(--dark);
    background: white;
    color: black;
  }
`;

const ContainerS = styled(Container)`
  @media only screen and (max-width: 750px) {
    flex-direction: column;
    gap: 0;
  }
`;

export default Profile;
