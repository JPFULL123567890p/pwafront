import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import backgroundImage from '../assets/foto.jpg';


const Login_Dentista: React.FC = () => {
  const Nnavigate = useNavigate();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password){
      setErrorMessage(" Por favor, completa todos los campos");
      return;
    }
    try{
      //Enviar datos al bakend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      //autenticacion 
      console.log('token recibido:', response.data.token);
      localStorage.setItem('token', `Bearer ${response.data.token}`);
      setErrorMessage ('');
      Nnavigate('/dashboard');
    }catch (error:any){

      //manejo de errores
      console.error("Error al iniciar sesion:", error);
      setErrorMessage(error.response?.data?.message || "Error al iniciar sesion. Por favor, intentalo de nuevo");
    }
    
   
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Iniciar Sesión Dentista
        </Typography>

        <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            margin="normal"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
           
          />
          <TextField
            fullWidth
            label="Contraseña"
            margin="normal"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            
            color="primary"
            sx={{ mt: 3 }}
          >
            Ingresar
          </Button>
        </Box>

        
                <Box
                                sx={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${backgroundImage})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    zIndex: -1,
                                    opacity: 0.3
                                }}
                            />

        <Typography variant="body2" sx={{ mt: 2 }}>
          ¿No tienes una cuenta?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => Nnavigate("/Register_Dentista")}
          >
            Regístrate aquí
          </Link>
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          ¿Eres Paciente?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => Nnavigate("/Login")}
          >
            Regístrate aquí
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login_Dentista;
