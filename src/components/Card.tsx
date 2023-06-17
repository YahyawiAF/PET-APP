import { FC } from "react";
import styled from "styled-components";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { CgShapeHexagon } from "react-icons/cg";
import { AiOutlineDelete } from "react-icons/ai";

import Cat from "../assets/cat.jpg";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import supabase from "../config/supabaseClient";

const CardStyled = styled(Card)`
  border-radius: 0;
  box-shadow: 0px 0px 20px 3px #9f9d9de5;
  background: white;
  transition: 0.3s all ease;
  &:hover {
    transform: scale(0.99);
    box-shadow: 0px 0px 5px 2px #9f9d9de5;
  }
`;
const CardTitle = styled(Card.Title)`
  h4 {
    font-size: 16px;
    color: black;
    margin-bottom: 10px;
  }
`;
const CardText = styled(Card.Text)`
  color: black;
  font-size: 14px;
  display: flex;
  align-items: self-end;
  justify-content: flex-start;
  gap: 0.8rem;
  margin-bottom: 5px;
`;
const CgShapeHexagonStyled = styled(CgShapeHexagon)`
  color: black;
  font-size: 14px;
`;

const FiEditStyled = styled(FiEdit)`
  position: absolute;
  top: 15px;
  right: 10px;
  font-size: 16px;
  color: black;
  transition: 0.3s all;
  &:hover {
    transform: scale(1.08);
  }
`;

const ButtonS = styled(Button)`
  color: white;
  background: var(--dark);
  border: 2px solid white;
  transition: 0.4s all;
  &:hover {
    border: 2px solid var(--dark);
    background: white;
    color: black;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
`;

const CardImg = styled(Card.Img)`
  padding: 20px 65px;
  border-radius: 50%;
  @media only screen and (max-width: 600px) {
    width: 50%;
  }
`;

type Props = {
  img: string;
  id: string;
  pet: any;
  // handleDelete: (id: string) => Promise<void>;
};

export const CardCat: FC<Props> = ({ img, id, pet }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <CardStyled className="card mb-3">
      {/* <ImageWrapper>
        <CardImg  variant="top" src={Cat} />
      </ImageWrapper> */}
      <Card.Body>
        <CardTitle className="d-flex gap-2">
          <span className="fw-bold">
            {t("petNameLabel")}
            {":"}
          </span>{" "}
          {pet.name}
        </CardTitle>

        {/* <Card.Subtitle className="mb-2 text-muted">{pet.}</Card.Subtitle> */}
        <CardText>
          <span>
            <CgShapeHexagonStyled />
          </span>
          <span className="fw-bold">
            {t("breedLabel")}
            {":"}
          </span>{" "}
          {pet.breed.label}
        </CardText>

        <CardText>
          <span>
            <CgShapeHexagonStyled />
          </span>
          <span className="fw-bold">
            {t("genderLabel")}
            {":"}
          </span>{" "}
          {pet.gender}
        </CardText>

        <CardText>
          <span>
            <CgShapeHexagonStyled />
          </span>
          <span className="fw-bold">
            {t("dobLabel")}
            {":"}
          </span>{" "}
          {pet.dateOfBirth}
        </CardText>

        <CardText>
          <span>
            <CgShapeHexagonStyled />
          </span>
          <span className="fw-bold">
            {t("colorLabel")}
            {":"}
          </span>{" "}
          {pet.color}
        </CardText>

        <CardText>
          <span>
            <CgShapeHexagonStyled />
          </span>
          <span className="fw-bold">
            {t("firstVaccinationLabel")}
            {":"}
          </span>{" "}
          {pet.isFirstVaccination ? "Yes" : "No"}
        </CardText>

        {/* {!pet.isFirstVaccination && (
          <CardText>
            <span>
              <CgShapeHexagonStyled />
            </span>
            <span className="fw-bold">Vaccination reaction:</span>{" "}
            {pet.vaccinationReaction ? "Yes" : "No"}
          </CardText>
        )} */}

        {/* <CardText>
          <span>
            <CgShapeHexagonStyled />
          </span>
          <span className="fw-bold">
            {pet.gender === "Male" ? "Neutering:" : "Spaying:"}
          </span>{" "}
          {pet.neutering ? "Yes" : "No"}
        </CardText> */}

        {/* {!pet.neutering && (
          <CardText>
            <span>
              <CgShapeHexagonStyled />
            </span>
            <span className="fw-bold">Pregnant:</span>{" "}
            {pet.pregnant ? "Yes" : "No"}
          </CardText>
        )} */}
        {/* <CardText>
          <span>
            <CgShapeHexagonStyled />
          </span>
          <span className="fw-bold">Sick:</span> {pet.sick ? "Yes" : "No"}
        </CardText> */}
        <ButtonS onClick={() => navigate(`/form/${pet.id}`)}>
          {t("editPetInfoButton")}
        </ButtonS>
        {/* <ButtonS onClick={() => handleDelete(pet.id)}>
          <AiOutlineDelete color="white" />
        </ButtonS> */}
      </Card.Body>
    </CardStyled>
  );
};
