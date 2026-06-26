import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CardPage from "./pages/CardPage.tsx";
import Login from "./pages/Login.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/CardPage" element={<CardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
