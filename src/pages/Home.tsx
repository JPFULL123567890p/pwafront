import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-background">
      <div className="overlay">
        <h1 className="title">Bienvenido a Dental Art</h1>
        <p className="subtitle">Tu sonrisa, nuestro arte.</p>
        <div className="button-group">
          <Link to="/login"><button className="home-button">Iniciar Sesión</button></Link>
          <Link to="/register"><button className="home-button">Registrarse</button></Link>
          <Link to="/policies"><button className="home-button secondary">Políticas</button></Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
