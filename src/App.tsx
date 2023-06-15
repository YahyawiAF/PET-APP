import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import RenderRoute from "./routes";
import { BreedProvider } from "./context/breedContext";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.min.css";
// pages
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BreedProvider>
          <RenderRoute />
        </BreedProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
