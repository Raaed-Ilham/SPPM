import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCirclePlus } from "react-icons/fa6";
import axios from 'axios';

import TshirtCard from "./TShirtCard"; // Correct import path
import '../Dashboard/Dashboard.css';

function Dashboard() {
    const isAuthenticated = !!localStorage.getItem('token');
    const [tshirts, setTShirts] = useState([]); // Renamed 'data' to 'tshirts' for clarity
    // const [selectedTShirt, setSelectedTShirt] = useState(null);

    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/Login');
        }
    }, [isAuthenticated, navigate]);

    const fetchTShirts = async () => {
        try {
            const response = await axios.get("http://localhost:5001/images");
            setTShirts(response.data);
            console.log("Fetched T-shirts:", response.data);
        } catch (error) {
            console.error("Error fetching T-shirts:", error);
        }
    };

    useEffect(() => {
        fetchTShirts();
    }, []);

    // const handleTShirtSelect = (imageUrl) => {
    //     setSelectedTShirt(imageUrl);
    // };

    return (
        <div className="App">
            <header className="App-header">
                <img
                    src="https://thirstyforsoulboner.com/cdn/shop/files/Logo_Options_2_eb5ae955-48f3-48f3-a2f5-14d860ec88bd_300x300.png?v=1614321917"
                    alt="Soul Boners" />
            </header>
            <section>
                <div className='btn-container'>
                    <a href='/AddProduct' className='btn-add-product'><FaCirclePlus /> Add Product</a>
                </div>
                <div className="card-list">
                    {tshirts.map((tshirt, index) => ( // Changed 'data' to 'tshirt' for clarity
                        <TshirtCard
                            imageUrl={"http://localhost:5001/images/" + tshirt.image_url}
                            tshirt_id={tshirt.tshirt_id}
                            name={tshirt.title} // Assuming 'title' is the property name for T-shirt name
                            price={tshirt.price} // Assuming 'price' is the property name for T-shirt price
                            description={tshirt.description}
                            material={tshirt.material}
                            color={tshirt.color}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Dashboard;
