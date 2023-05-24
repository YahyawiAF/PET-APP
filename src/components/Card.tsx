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
    <Card className="card mb-4 box-shadow" style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{pet.name}</Card.Title>

        {/* <Card.Subtitle className="mb-2 text-muted">{pet.}</Card.Subtitle> */}
        <Card.Text>
          <span className="fw-bold">Breed:</span> {pet.breed}
        </Card.Text>

        <Card.Text>
          <span className="fw-bold">Date of birth:</span> {pet.dateOfBirth}
        </Card.Text>

        <Card.Text>
          <span className="fw-bold">Color:</span> {pet.color}
        </Card.Text>

        <Card.Text>
          <span className="fw-bold">First vaccination:</span> {pet.isFirstVaccination ? "Yes": "No"}
        </Card.Text>

        <Card.Text>Contact information: {pet.color}</Card.Text>
        <Card.Link href="/form">edite</Card.Link>
        {/* <Card.Link href="#">Another Link</Card.Link> */}
      </Card.Body>
    </Card>
  );
};
