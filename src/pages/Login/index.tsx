import { useState, ChangeEvent, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Phone } from "react-bootstrap-icons";
import { signInWithEmail } from "../../api/login";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../../config/supabaseClient";
import supabaseClient from "../../config/supabaseClient";
interface FormData {
  phone: string;
}

const PhoneNumber = ({ onClick }: { onClick: any }) => {
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    // Initialize other form field properties
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      // if (!/^\+[1-9]{1}[0-9]{3,14}$/.test(formData.phone)) {
      //   setError("Please enter a valid mobile number");
      //   return;
      // }
      const { error } = await supabaseClient.auth.signInWithOtp({
        phone: formData.phone,
      });
      if (error) {
        return {
          success: false,
          error,
        };
      }
      if (error) throw error;
      // alert('Check your email for the login link!')
    } catch (error) {
      console.log("error", error);
      // alert(error?.error_description || error?.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
      <div className="40-w p-5 rounded bg-light">
        <div className="d-flex mb-3 gap-3">
          <Phone className="" size={24} />
        </div>
        {loading ? (
          "Sending magic link..."
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Phone Numbe"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Confirm your phone number
            </Button>
            <p
              style={{ color: "blue", marginTop: "10px", cursor: "pointer" }}
              className="primary"
              onClick={onClick}
            >
              Login with email
            </p>
          </Form>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  const [changeLogin, setLogin] = useState(true);
  return (
    <div className="login vh-100 vw-100 d-flex justify-content-center align-items-center">
      <div className="40-w p-5 rounded bg-light">
        {changeLogin ? (
          <>
            <Auth
              otpType="sms"
              showLinks
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              magicLink
              providers={[]}
            />
            <Button
              onClick={() => setLogin(!changeLogin)}
              variant="primary w-100 "
              type="submit"
            >
              Login with phone
            </Button>
          </>
        ) : (
          <PhoneNumber onClick={() => setLogin(!changeLogin)} />
        )}
      </div>
    </div>
  );
};

export default Login;
