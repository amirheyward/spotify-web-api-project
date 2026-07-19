import "./App.css";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import CardPage from "./pages/CardPage.tsx";
import Login from "./pages/Login.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cardPage" element={<CardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
