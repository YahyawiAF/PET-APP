import { useState, ChangeEvent, FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Phone, Envelope } from "react-bootstrap-icons";
import { signInWithEmail } from "../../api/login";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import supabase from "../../config/supabaseClient";
interface FormData {
  email: string;
}

// const Login = () => {
//   const [formData, setFormData] = useState<FormData>({
//     email: '',
//     // Initialize other form field properties
//   });
//   const [loading, setLoading] = useState(false)

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log(formData);

//     try {
//       setLoading(true)
//       const { error, data: {session, user} } = await signInWithEmail(formData.email)
//       console.log("session", session)
//       console.log("user", user)
//       if (error) throw error
//       // alert('Check your email for the login link!')
//     } catch (error) {
//       console.log("error", error)
//       // alert(error?.error_description || error?.message)
//     } finally {
//       setLoading(false)
//     }

//   };

//   return (
//     <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
//       <div className="40-w p-5 rounded bg-light">
//         <div className="d-flex mb-3 gap-3">
//           <Phone className="" size={24} />
//           <Envelope size={24} />
//         </div>
//      {   loading ? (
//           'Sending magic link...'
//         ) :
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3" controlId="formBasicEmail">
//             <Form.Label>Phone Number</Form.Label>
//             <Form.Control
//             type="email"
//             placeholder="Enter Phone Numbe"
//             name="email"
//             value={formData.email || ''}
//             onChange={handleChange}
//             />
//           </Form.Group>
//           <Button variant="primary" type="submit">
//             Confirm your phone number
//           </Button>
//         </Form> }
//       </div>
//     </div>
//   );
// };

const Login = () => {
  
  return (
  <div className="login vh-100 vw-100 d-flex justify-content-center align-items-center">
    <div className="40-w p-5 rounded bg-light">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        magicLink
        providers={["google", "apple"]}
      />
    </div>
  </div>
)};

export default Login;
