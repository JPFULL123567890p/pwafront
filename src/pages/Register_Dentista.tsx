import React, { useState } from "react";
import { TextField, Button, Container, Box, Typography, Link } from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import backgroundImage from '../assets/foto.jpg';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        username,
        email,
        password
      });
      console.log("Registro exitoso:", response.data);
      navigate("/Login");
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || "Error al registrar el usuario");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Registro Dentista
        </Typography>

        <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            margin="normal"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Correo Electrónico"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Contraseña"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3, backgroundColor: '#007b8f', '&:hover': { backgroundColor: '#005f6b' } }}
          >
            Registrarse
          </Button>

          <Button
            fullWidth
            variant="contained"
            component={RouterLink}
            to="/Home"
            sx={{ mt: 2, backgroundColor: '#007b8f', color: 'white', '&:hover': { backgroundColor: '#005f6b' } }}
          >
            Ir a Home
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

        

        <Typography variant="body2" sx={{ mt: 3 }}>
          ¿Ya tienes cuenta?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/Login_Dentista")}
          >
            Inicia sesión aquí
          </Link>
        </Typography>

         <Typography variant="body2" sx={{ mt: 3 }}>
                  ¿Eres Paciente? Inicia sesion aquí{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/Register")}
                  >
                    Inicia sesión aquí
                  </Link>
                </Typography>
      </Box>
    </Container>
  );
};

export default Register;
