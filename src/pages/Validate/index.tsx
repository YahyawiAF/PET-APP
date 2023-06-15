import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import supabaseClient from "../../config/supabaseClient";
import { Button, Form } from "react-bootstrap";
import { Phone } from "react-bootstrap-icons";
import { useAuth } from "../../context/AuthProvider";
import { Session } from "@supabase/supabase-js";
interface FormData {
  phone: string;
}

const Validate = () => {
  let { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { setUser, setSession, session } = useAuth();

  const navigate = useNavigate();

  console.log("code", id);

  const [formData, setFormData] = useState<FormData>({
    phone: "",
    // Initialize other form field properties
  });

  useEffect(() => {
    if (session) {
      navigate("/home");
    }
  }, [session]);

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
      if (id) {
        const { data, error } = await supabaseClient.auth.verifyOtp({
          phone: formData.phone,
          token: id,
          type: "sms",
          options: {
            redirectTo: "https://pet-app-olive.vercel.app/home",
          },
        });
        if (data) {
          setSession(data as unknown as Session);
          setUser(data.user);
          navigate("/home");
        }
      }
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
          </Form>
        )}
      </div>
    </div>
  );
};

export default Validate;
