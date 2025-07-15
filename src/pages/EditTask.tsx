import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  MenuItem
} from "@mui/material";

const EditTask: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { task } = location.state as {
    task: { id: number; title: string; status: string };
  };

  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Tarea editada:", { id: task.id, title, status });
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Editar Tarea
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSave}>
          <TextField
            fullWidth
            label="Título"
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            select
            fullWidth
            label="Estado"
            margin="normal"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="en progreso">En progreso</MenuItem>
            <MenuItem value="completada">Completada</MenuItem>
          </TextField>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            type="submit"
          >
            Guardar Cambios
          </Button>

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => navigate("/dashboard")}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditTask;
