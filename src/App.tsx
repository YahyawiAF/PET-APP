import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import RenderRoute from "./routes";
import { ToastContainer } from "react-bootstrap";
import { BreedProvider } from "./context/breedContext";
import "react-toastify/dist/ReactToastify.css";
// pages
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BreedProvider>
          <ToastContainer />
          <RenderRoute />
        </BreedProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
