import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styled from "styled-components";
import { useAuth } from "../../context/AuthProvider";
import supabase from "../../config/supabaseClient";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface PROFILE {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  id?: string;
  communicationConsent: boolean;
  city: string;
  state: string;
  zipCode: string;
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
  const navigate = useNavigate();

  const { user } = useAuth();
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<PROFILE>({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    email: user.email,
    communicationConsent: false,
    city: "",
    state: "",
    zipCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setOwnerInfo((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  useEffect(() => {
    if (user?.id) {
      const fetchProfile = async () => {
        let { data: profile, error } = await supabase
          .from("profiles")
          .select()
          .eq("userID", user?.id);
        if (error) {
          setFetchError("Could not fetch the profile");

          toast.error("Could not fetch the profile", {
            autoClose: 2000,
          });
        }

        if (profile && profile?.length > 0) {
          setOwnerInfo(profile[0] as unknown as PROFILE);
        }
      };
      fetchProfile();
    }
  }, [user]);

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
        toast.error("Please fill in all the fields correctly.", {
          autoClose: 2000,
        });
      }
    } else {
      const { error } = await supabase
        .from("profiles")
        .insert({ ...ownerInfo, userID: user.id });
      navigate("/form");
      if (error) {
        setFetchError("Please fill in all the fields correctly.");
        toast.error("Please fill in all the fields correctly.", {
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <Wrapper>
      <FormStyled onSubmit={handleSubmit}>
        <ContainerS className="d-flex gap-4 justify-content-between p-0">
          <Form.Group className="fied-name mb-3 w-100" controlId="firstName">
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

          <Form.Group className="fied-name mb-3 w-100" controlId="lastName">
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
        <ContainerS className="d-flex gap-4 justify-content-between p-0">
          <Form.Group className="mb-3" controlId="city">
            <Label>{t("city")}</Label>
            <Control
              type="text"
              name="city"
              value={ownerInfo?.city ?? ""}
              onChange={handleChange}
              placeholder={t("ProfilePlaceholder.city")}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="state">
            <Label>{t("state")}</Label>
            <Control
              type="text"
              name="state"
              value={ownerInfo?.state ?? "TX"}
              onChange={handleChange}
              placeholder={t("ProfilePlaceholder.state")}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="zipCode">
            <Label>{t("zipCode")}</Label>
            <Control
              type="text"
              name="zipCode"
              value={ownerInfo?.zipCode ?? ""}
              onChange={handleChange}
              placeholder={t("ProfilePlaceholder.zipCode")}
              required
            />
          </Form.Group>
        </ContainerS>

        <ContainerS className="d-flex gap-4 justify-content-between p-0">
          <Form.Group className="mb-3 w-100" controlId="phoneNumber">
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

          <Form.Group className="mb-3 w-100" controlId="email">
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
        </ContainerS>

        <Form.Group
          className="mb-3 d-flex flex-column"
          controlId="communicationConsent"
        >
          {/* <Label className="me-4">{t("consent")}</Label> */}
          <Form.Check
            inline
            label={t("consent")}
            name="communicationConsent"
            checked={ownerInfo.communicationConsent === true}
            onChange={handleChangeCheckbox}
            type="checkbox"
          />
        </Form.Group>

        {/* Add more Form.Group components for additional fields */}

        <div className="d-flex justify-content-end">
          {ownerInfo.communicationConsent && (
            <ButtonS variant="primary" type="submit">
              {t("addOwner")}
            </ButtonS>
          )}
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
  color: white;
  background: var(--dark);
  border: 2px solid white;
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

export default Profile;
