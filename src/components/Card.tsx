import { FC } from "react";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";

type Props = {
  img: string;
  id: string;
  pet: any;
};

export const CardCat: FC<Props> = ({ img, id, pet }) => {
  const navigate = useNavigate();
  return (
    <Card className="card mb-4 box-shadow" >
      <Card.Body>
        <Card.Title><span className="fw-bold">Pet Name: </span>{pet.name}</Card.Title>

        {/* <Card.Subtitle className="mb-2 text-muted">{pet.}</Card.Subtitle> */}
        <Card.Text>
          <span className="fw-bold">Breed:</span> {pet.breed}
        </Card.Text>

        <Card.Text>
          <span className="fw-bold">Gender:</span> {pet.gender}
        </Card.Text>

        <Card.Text>
          <span className="fw-bold">Date of birth:</span> {pet.dateOfBirth}
        </Card.Text>

        <Card.Text>
          <span className="fw-bold">Color:</span> {pet.color}
        </Card.Text>

        <Card.Text>
          <span className="fw-bold">First vaccination:</span>{" "}
          {pet.isFirstVaccination ? "Yes" : "No"}
        </Card.Text>

        {!pet.isFirstVaccination && (
          <Card.Text>
            <span className="fw-bold">Vaccination reaction:</span>{" "}
            {pet.vaccinationReaction ? "Yes" : "No"}
          </Card.Text>
        )}

        <Card.Text>
          <span className="fw-bold">
            {pet.gender === "Male" ? "Neutering:" : "Spaying:"}
          </span>{" "}
          {pet.neutering ? "Yes" : "No"}
        </Card.Text>

        {!pet.neutering && (
          <Card.Text>
            <span className="fw-bold">Pregnant:</span>{" "}
            {pet.pregnant ? "Yes" : "No"}
          </Card.Text>
        )}
        <Card.Text>
          <span className="fw-bold">Sick:</span>{" "}
          {pet.sick ? "Yes" : "No"}
        </Card.Text>
        <Card.Link href={`/form/${pet.id}`}>Edite</Card.Link>
        {/* <Card.Link href="#">Another Link</Card.Link> */}
      </Card.Body>
    </Card>
  );
};
