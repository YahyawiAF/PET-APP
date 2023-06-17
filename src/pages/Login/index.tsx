import { useState, ChangeEvent, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Phone } from "react-bootstrap-icons";
import { signInWithEmail } from "../../api/login";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../../config/supabaseClient";
import supabaseClient from "../../config/supabaseClient";
import { ReactComponent as IconPet } from "../../assets/pets-svgrepo-com.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "styled-components";

interface PhoneFormData {
  phone: string;
}

const PhoneNumber = ({ onClick }: { onClick: any }) => {
  const [phoneFormData, setphoneFormData] = useState<PhoneFormData>({
    phone: "",
    // Initialize other form field properties
  });
  const [loading, setLoading] = useState(false);
  const [showPhoneDisclaimer, setShowPhoneDisclaimer] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setphoneFormData({
      ...phoneFormData,
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
        phone: phoneFormData.phone,
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
      toast.success("Check your email for the magic link!", {
        autoClose: 2000,
      });
    }
  };

  const handleDisclaimer = () => {
    setShowPhoneDisclaimer(true);
  };

  return (
    <>
      <ToastContainer />
      {loading ? (
        "Sending magic link..."
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Cell Phone Number</Form.Label>
            <Form.Control
              className="mb-4"
              type="text"
              placeholder="Enter Cell Phone Number"
              name="phone"
              value={phoneFormData.phone || ""}
              onChange={handleChange}
            />
          </Form.Group>
          {!showPhoneDisclaimer && (
            <Button
              variant="primary"
              className="w-100"
              onClick={handleDisclaimer}
            >
              Confirm phone number
            </Button>
          )}
          {showPhoneDisclaimer && (
            <div>
              <h6
                style={{
                  borderBottom: "1px solid silver",
                  paddingBlock: "0.5rem",
                }}
              >
                Please be advised
              </h6>
              <p
                style={{
                  borderBottom: "1px solid silver",
                  paddingBottom: "0.5rem",
                  marginBottom: "2rem",
                }}
              >
                By entering your phone number you agree to receive login
                messages, pet reminders, and promotional text messages related
                to your pet
              </p>
              <Button variant="primary" type="submit" className="w-100">
                Submit phone number
              </Button>
            </div>
          )}

          <p
            style={{
              color: "blue",
              marginTop: "1rem",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
            className="primary"
            onClick={onClick}
          >
            Login with email
          </p>
        </Form>
      )}
    </>
  );
};

interface EmailFormData {
  email: string;
}

const Login = () => {
  const [changeLogin, setLogin] = useState(true);

  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    email: "",
    // Initialize other form field properties
  });
  const [loading, setLoading] = useState(false);
  // const [showPhoneDisclaimer, setShowPhoneDisclaimer] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailFormData({
      ...emailFormData,
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
      const { data, error } = await supabase.auth.signInWithOtp({
        email: emailFormData.email,
        // options: {
        //   emailRedirectTo: "https://example.com/welcome",
        // },
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
      toast.success("Check your email for the magic link!", {
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="login p-4 vh-100    d-flex justify-content-center align-items-center">
      <ToastContainer />

      <div className="p-5 rounded bg-light" style={{ maxWidth: "380px" }}>
        <div className="d-flex mb-5 justify-content-center">
          <div
            className="d-flex p-3 justify-content-center align-items-center rounded-circle bg-white"
            style={{
              boxShadow: "0 0 10px 1px #e3e3e3",
            }}
          >
            <IconPet
              style={{
                width: "40px",
                height: "40px",
                fill: "var(--dark)",
              }}
            />
          </div>
        </div>
        {changeLogin ? (
          <>
            {loading ? (
              "Sending magic link..."
            ) : (
              <>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <FormLabel>Email address</FormLabel>
                    <FormControl
                      className="mb-3"
                      type="email"
                      placeholder="Your email address"
                      name="email"
                      autoFocus
                      value={emailFormData.email || ""}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <SubmitButton
                    variant="primary"
                    className="w-100 mb-4"
                    type="submit"
                    // onClick={handleDisclaimer}
                  >
                    Send Magic Link
                  </SubmitButton>
                </Form>
                <div>
                  <h6
                    style={{
                      borderBottom: "1px solid silver",
                      paddingBlock: "0.5rem",
                    }}
                  >
                    Please be advised
                  </h6>
                  <p
                    style={{
                      borderBottom: "1px solid silver",
                      paddingBottom: "0.5rem",
                      marginBottom: "2rem",
                    }}
                  >
                    By entering your email you agree to receive login emails,
                    email pet reminders, and promotional email messages related
                    to your pet
                  </p>
                </div>
                <Button
                  onClick={() => setLogin(!changeLogin)}
                  variant="primary w-100 "
                  type="submit"
                >
                  Login with phone
                </Button>
              </>
            )}
          </>
        ) : (
          <PhoneNumber onClick={() => setLogin(!changeLogin)} />
        )}
      </div>
    </div>
  );
};

const FormLabel = styled(Form.Label)`
  color: gray;
  font-size: 15px;
  font-weight: 400;
`;

const FormControl = styled(Form.Control)`
  color: black !important;
  background: transparent;
  border-radius: 4px;
  padding: 10px 15px;
  border-style: solid;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;

  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 100ms;
  &:focus,
  &:active {
    box-shadow: none !important;
    background: transparent !important;
    border-color: gray;
  }
  &:hover {
    border-color: gray;
  }
  &::placeholder {
    color: darkgray;
    font-weight: 400;
  }
`;
const SubmitButton = styled(Button)`
  font-size: 14px;
  font-weight: 500;
  background-color: #3fcf8e;
  border-color: #34b27b;
  border-radius: 4px;
  padding: 10px 15px;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 100ms;
  &:hover {
    background-color: #34b27b;
    border-color: #34b27b;
  }
`;
export default Login;
