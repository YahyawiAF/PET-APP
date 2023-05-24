import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import RenderRoute from "./routes";
// pages
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RenderRoute />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
