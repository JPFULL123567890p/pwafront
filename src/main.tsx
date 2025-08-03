import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard2";
import Home from "./pages/Home";

import Login_Dentista from "./pages/Login_Dentista";
import Register_Dentista from "./pages/Register_Dentista";


import "./styles/theme";
import registerServiceWorker from "./utils/registerServiceWorker";

registerServiceWorker();


ReactDOM.createRoot(document.getElementById("root")as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard2" element={<Dashboard2 />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Login_Dentista" element={<Login_Dentista />} />
        <Route path="/Register_Dentista" element={<Register_Dentista />} />
      
      </Routes>
    </Router>
  </React.StrictMode>
);





