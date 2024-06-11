import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddProducts.css';

function AddProducts() {
    const isAuthenticated = !!localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/Login');
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        material: '',
        image_url: '',
        color: '',
        price: ''
    });

    const { title, description, material, image_url, color, price } = formData;

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        setFormData({
            ...formData,
            image_url: event.target.files[0],
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const imageData = new FormData();
            imageData.append('image', formData.image_url);

            const response = await axios.post('http://localhost:5001/upload', imageData);
            const imageUrl = response.data.imageUrl;

            const productData = {
                title,
                description,
                material,
                image_url: imageUrl,
                color,
                price
            };

            const addProductResponse = await axios.post('http://localhost:5001/add-product', productData);
            const addedProduct = addProductResponse.data;

            //   onAdded(addedProduct);

            setFormData({
                title: '',
                description: '',
                material: '',
                image_url: '',
                color: '',
                price: ''
            });

            navigate(`/`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <img
                    src="https://thirstyforsoulboner.com/cdn/shop/files/Logo_Options_2_eb5ae955-48f3-48f3-a2f5-14d860ec88bd_300x300.png?v=1614321917"
                    alt="Soul Boners"
                />
            </header>
            <section>
                <form onSubmit={handleSubmit} className="add-product-form">
                    <h2>Add Product</h2>

                    <div className='form-group'>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            name="description"
                            id="description"
                            value={description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className='form-group'>
                        <label htmlFor="material">Material:</label>
                        <input
                            type="text"
                            name="material"
                            id="material"
                            value={material}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="image_url">Image URL:</label>
                        <input
                            type="file"
                            name="image_url"
                            id="image_url"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="color">Color:</label>
                        <input
                            type="text"
                            name="color"
                            id="color"
                            value={color}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="price">Price:</label>
                        <input
                            type="text"
                            name="price"
                            id="price"
                            value={price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className='btn btn-primary'>Add Product</button>
                </form>
            </section>
        </div>
    );
}

export default AddProducts;
