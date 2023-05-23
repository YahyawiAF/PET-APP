import { Button, Form } from "react-bootstrap";
import { Phone, Envelope } from "react-bootstrap-icons";

const Login = () => {
  return (
    <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
      <div className="40-w p-5 rounded bg-light">
        <div className="d-flex mb-3 gap-3">
          <Phone className="" size={24} />
          <Envelope size={24} />
        </div>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control placeholder="Enter Phone Numbe" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Confirm your phone number
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
