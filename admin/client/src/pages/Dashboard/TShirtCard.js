import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
// Inside TshirtCard.js
import axios from 'axios';
import { FaTrash, FaPen } from 'react-icons/fa6';

function TShirtCard({ imageUrl, name, price, description, material, color, tshirt_id }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleEdit = (tshirt_id) => {
    // Navigate to the edit product page with the corresponding tshirt_id
    navigate(`/EditProduct/${tshirt_id}`);
  };

  const handleDelete = async (tshirt_id) => {
    try {
      console.log('Deleting product with ID:', tshirt_id); // Print ID to console
      const response = await axios.delete(`http://localhost:5001/delete-product/${tshirt_id}`);
      window.location.reload();
      console.log(response.data); // Log success message or handle response data if needed
      // Optionally, update state or perform any necessary cleanup
    } catch (error) {
      console.error('Error deleting product:', error);
      // Handle error (e.g., show error message to user)
      if (error.response) {
        console.error('Server error response:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  return (
    <div className="card" style={{ height: "auto" }}>
      <p className='card-id'>#{tshirt_id}</p>
      {imageUrl && <img src={imageUrl} className="card-img" alt={name} />}
      <div className="card-body">
        <h3 className='card-title'>{name}</h3>

        <p className="card-text">
          <span>Description</span>
          <span>{description}</span>
        </p>
        <p className="card-text">
          <span>Material</span>
          <span>{material}</span>
        </p>
        <p className="card-text">
          <span>Color</span>
          <span>{color}</span>
        </p>
        <p className="card-text">
          <span>Price</span>
          <span>{price}</span>
        </p>
        <div className="btn-container">
          <button className="btn btn-primary" onClick={() => handleEdit(tshirt_id)}><FaPen /></button>
          <button className="btn btn-secondary" onClick={() => handleDelete(tshirt_id)}><FaTrash /></button>
        </div>
      </div>
    </div >
  );
};

export default TShirtCard;