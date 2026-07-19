import "./App.css";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import CardPage from "./pages/CardPage.tsx";
import Login from "./pages/Login.tsx";
import { UserContext } from "./contexts/UserContext.tsx"
import { useState } from "react";

function App() {
  const [accessToken, setAccessToken] = useState("");

  return (
    <UserContext.Provider value={{accessToken: accessToken, setAccessToken: setAccessToken}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cardPage" element={<CardPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
