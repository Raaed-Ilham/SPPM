// EditProduct.js
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../AddProducts/AddProducts.css';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        material: '',
        image_url: '',
        color: '',
        price: ''
    });

    useEffect(() => {
        if (id) {
            // Fetch product details based on ID and populate the form fields
            axios.get(`http://localhost:5001/single-product/${id}`)
                .then(response => {
                    const productData = response.data;
                    setFormData({
                        title: productData.title,
                        description: productData.description,
                        material: productData.material,
                        image_url: productData.image_url,
                        color: productData.color,
                        price: productData.price
                    });
                })
                .catch(error => {
                    console.error('Error fetching product details:', error);
                });
        }
    }, [id]);

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

            const updateProductResponse = await axios.put(`http://localhost:5001/update-product/${id}`, productData);
            const updatedProduct = updateProductResponse.data;

            // Reset form after successful submission
            setFormData({
                title: '',
                description: '',
                material: '',
                image_url: '',
                color: '',
                price: ''
            });

            // Navigate to appropriate page after submission
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
            <form onSubmit={handleSubmit} className="edit-product-form">
                    <h2>Edit Product</h2>

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

                    <button type="submit" className='btn btn-primary'>Update Product</button>
                </form>
            </section>
        </div>
    );
}

export default EditProduct;