import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/calories.css'; 
import CustomModal from './modal';

let CaloriesForm = () => {
  let [formData, setFormData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    intensity: '',
    goal: '',
  });
  let [caloriesResult, setCaloriesResult] = useState(null);
   // Manejador para cambios en los campos del formulario
  let handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
    // Funcion para calcular las calorías obteniendo el jwt(con axios se accede al calculo hecho desde el backend)
  let handleCalculate = () => {
    let authToken = localStorage.getItem('token');
//si el jwt esta en el localStorage se pone en el encabezado para proceder con el calculo
    if (authToken) {
      let config = {
        headers: {
          'x-api-token-jwt': authToken,
        },
      };

      axios
        .post('http://localhost:5513/api/calories/calculate', formData, config)
        .then((response) => {
          setCaloriesResult(response.data.calories);
        })
        .catch((error) => {
          console.error('Error al calcular las calorías:', error);
        });
    } else {
      console.log('Usuario no autenticado. Debes iniciar sesión primero.');
    }
  };
   // Manejo de datos de cálculos guardados (para almacenarlos en localStorage y renderizarlos con el boton de mostrar lista de guardados)  
  let [savedCalculations, setSavedCalculations] = useState([]);
  let handleSaveCalculation = () => {
    let newCalculation = {
      formData,
      caloriesResult,
    };
  
    setSavedCalculations([...savedCalculations, newCalculation]);
    localStorage.setItem('savedCalculations', JSON.stringify([...savedCalculations, newCalculation]));
    alert('¡Datos guardados correctamente!');
  };
  
  
// Abrir y cerrar el modal
  let [isModalOpen, setIsModalOpen] = useState(false);

  let openModal = () => {
    setIsModalOpen(true);
  };

  let closeModal = () => {
    setIsModalOpen(false);
  };
  // Cargar datos de cálculos guardados al cargar el componente
  useEffect(() => {
    const savedCalculationsData = localStorage.getItem('savedCalculations');
    if (savedCalculationsData) {
      setSavedCalculations(JSON.parse(savedCalculationsData));
    }
  }, []);
  

  return (
    <div className="calories-form-container">
      <h2 className="calories-form-title">Calcula tus calorías aqui</h2>
      <div>
        <label>Edad:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} />
      </div>
      <div>
        <label>Género:</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Seleccione</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
      </div>
      <div>
        <label>Peso (en kg):</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
      </div>
      <div>
        <label>Altura (en cm, ejemplo: 150):</label>
        <input type="number" name="height" value={formData.height} onChange={handleChange} />
      </div>
      <div>
        <label>Nivel de intensidad:</label>
        <select name="intensity" value={formData.intensity} onChange={handleChange}>
          <option value="">Seleccione</option>
          <option value="bajo">Bajo</option>
          <option value="medio">Medio</option>
          <option value="alto">Alto</option>
        </select>
      </div>
      <div>
        <label>Objetivo:</label>
        <select name="goal" value={formData.goal} onChange={handleChange}>
          <option value="">Seleccione</option>
          <option value="mantener">Mantener</option>
          <option value="ganar">Ganar</option>
          <option value="bajar">Bajar</option>
        </select>
      </div>
      <div>
        <button onClick={handleCalculate}>Calcular</button>
      </div>
        {/* Resultado del calculo si son validos los parametros y el backend pude hacer la operacion*/}
      {caloriesResult !== null && (
        <div className="calories-result">
          <span className="calories-label">El aproximado de calorías a consumir diarias son:</span>
          <span className="calories-value">{caloriesResult}</span>
        </div>
      )}
      {/* Botón para guardar el calculo  y la informacion (peso, edad, etc)*/}
      {caloriesResult !== null && (
        <button onClick={handleSaveCalculation}>Guardar</button>
      )}
         {/* Botón para abrir el modal de datos guardados */}
      <button onClick={openModal}>Ver datos guardados</button>
         {/* Se renderiza el modal con los datos guardados */}
      <CustomModal isOpen={isModalOpen} onClose={closeModal} savedCalculations={savedCalculations} />
    </div>
  );
};
export default CaloriesForm;
