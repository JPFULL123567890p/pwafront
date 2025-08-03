import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Container, Box, TextField, List,
    ListItem, ListItemText, ListItemSecondaryAction, IconButton, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Select, Stack
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { saveTask, getTasks, deleteTask } from '../utils/localDB';
import { checkConnection, listenForReconnection } from '../utils/connectionStatus';
import { useNavigate } from 'react-router-dom';

// Importa tu imagen de fondo
import backgroundImage from '../assets/dental-background.jpg'; // Ajusta la ruta según tu estructura

interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
    pendingSync?: boolean;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleNavigateToCitas = () => {
        navigate('/dashboard');
    };

    const fetchTasks = async () => {
        const offlineTasks = await getTasks();
        if (checkConnection()) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/tasks', {
                    headers: { Authorization: token },
                });
                const syncedTaskIds = new Set(response.data.map((task: Task) => task.id));
                const filteredOfflineTasks = offlineTasks.filter(task => !syncedTaskIds.has(task.id));
                setTasks([...response.data, ...filteredOfflineTasks]);
            } catch (error) {
                setErrorMessage('Error al obtener las tareas.');
            }
        } else {
            setTasks(offlineTasks);
        }
    };

    const handleAddTask = async () => {
        const newTask: Task = {
            id: Date.now(),
            title: taskTitle,
            description: taskDescription,
            status: 'Pendiente',
            pendingSync: !checkConnection(),
        };
        if (checkConnection()) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post(
                    'http://localhost:5000/api/tasks',
                    { title: taskTitle, description: taskDescription, status: 'Pendiente' },
                    { headers: { Authorization: token } }
                );
                setTasks(prev => [...prev, response.data]);
                fetchTasks();
            } catch (error) {
                setErrorMessage('Error al agregar tarea.');
            }
        } else {
            await saveTask(newTask);
            setTasks(prev => [...prev, newTask]);
        }
        setTaskTitle('');
        setTaskDescription('');
    };

    const handleEditClick = (task: Task) => {
        setEditTask(task);
        setOpen(true);
    };

    const handleUpdateTask = async () => {
        if (!editTask) return;
        if (checkConnection()) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.put(
                    `http://localhost:5000/api/tasks/${editTask.id}`,
                    { title: editTask.title, description: editTask.description, status: editTask.status },
                    { headers: { Authorization: token } }
                );
                setTasks(tasks.map(task => (task.id === editTask.id ? response.data : task)));
            } catch (error) {
                setErrorMessage('Error al actualizar tarea.');
            }
        } else {
            await saveTask({ ...editTask, pendingSync: true });
            setTasks(prev => prev.map(task => (task.id === editTask.id ? { ...editTask, pendingSync: true } : task)));
        }
        setOpen(false);
    };

    const handleDeleteTask = (task: Task) => {
        setTaskToDelete(task);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteTask = async () => {
        if (!taskToDelete) return;
        if (checkConnection()) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/tasks/${taskToDelete.id}`, {
                    headers: { Authorization: token },
                });
                setTasks(prev => prev.filter(task => task.id !== taskToDelete.id));
            } catch (error) {
                setErrorMessage('Error al eliminar tarea.');
            }
        } else {
            await deleteTask(taskToDelete.id);
            setTasks(prev => prev.filter(task => task.id !== taskToDelete.id));
        }
        setDeleteDialogOpen(false);
    };

    useEffect(() => {
        fetchTasks();
        listenForReconnection(fetchTasks);
    }, []);

    return (
        <>
            {/* Fondo */}
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

            {/* NavBar */}
            <AppBar position="fixed"  sx={{ backgroundColor: '#007b8f' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Dental-Art | Dashboard
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button color="inherit" onClick={handleNavigateToCitas}>Mis Citas</Button>
                        <Button color="inherit" onClick={handleNavigateToCitas}>Principal</Button>
                        <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
                        
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* Contenido */}
            <Container maxWidth="md" sx={{ mt: 12 }}>
                <Box sx={{ textAlign: 'center', backdropFilter: 'blur(2px)', p: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.8)' }}>
                    <Typography variant="h4">Mis Tareas</Typography>

                 

                    <List sx={{ mt: 4 }}>
                        {tasks.map(task => (
                            <ListItem key={task.id} divider>
                                <ListItemText
                                    primary={`${task.title} ${task.pendingSync ? '(Pendiente de sincronización)' : ''}`}
                                    secondary={`Estado: ${task.status} | Descripción: ${task.description || 'No especificada'}`}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleEditClick(task)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => handleDeleteTask(task)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* Dialogs */}
                <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                    <DialogTitle>¿Estás seguro de que deseas eliminar esta tarea?</DialogTitle>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                        <Button variant="contained" color="error" onClick={confirmDeleteTask}>Eliminar</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogTitle>Editar Tarea</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label="Título"
                            value={editTask?.title || ''}
                            onChange={(e) => setEditTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            fullWidth
                            label="Descripción"
                            value={editTask?.description || ''}
                            onChange={(e) => setEditTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                            sx={{ mt: 2 }}
                        />
                        <Select
                            fullWidth
                            value={editTask?.status || 'Pendiente'}
                            onChange={(e) => setEditTask(prev => prev ? { ...prev, status: e.target.value } : null)}
                            sx={{ mt: 2 }}
                        >
                            <MenuItem value="Pendiente">Pendiente</MenuItem>
                            <MenuItem value="En Progreso">En Progreso</MenuItem>
                            <MenuItem value="Completado">Completado</MenuItem>
                        </Select>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button variant="contained" onClick={handleUpdateTask}>Guardar Cambios</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default Dashboard;
