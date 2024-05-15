import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminNavComponent from '../components/AdminNavComponent';
import AdminSidebar from '../components/AdminSidebar';
import { showErrorAlert, showConfirmationAlert } from '../../../helpers/alerts';
import AdminFooterComponent from "../components/AdminFooterComponent";
import '../styles/AdminUPProducts.css';

const ADUPDProductsPages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: '',
    categories: [],
    countInStock: '',
    isFeatured: false,
  });
  const [categories, setCategories] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(null); // Para mostrar la imagen actual
  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    fetchProductDetails();
    fetchCategories();
  }, [id, token]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://34.201.92.59:3000/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const product = response.data;
      setFormData({ ...product, categories: product.categories.map(cat => cat._id) });
      setCurrentImage(product.images[0]); // Establece la imagen actual
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://34.201.92.59:3000/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, categories: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'categories') {
        value.forEach((category) => updateData.append('categories', category));
      } else {
        updateData.append(key, value);
      }
    });
    if (selectedFiles.length) {
      for (let file of selectedFiles) {
        updateData.append('images', file);
      }
    }

    try {
      await axios.patch(
        `http://34.201.92.59:3000/products/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      await showConfirmationAlert('¡Éxito!', 'Producto actualizado correctamente.', 'success', 'Aceptar');
      navigate('/admin/products/view'); // Asegura que esta ruta es correcta para ver productos
    } catch (error) {
      console.error("Error updating product:", error);
      showErrorAlert('Error', 'No se pudo actualizar el producto. Intente nuevamente.');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <div className="content-container">
        <AdminSidebar />
        <div className="main-content">
          <AdminNavComponent />
          <div className="content-wrapper">
            <div className="header">
              <h1>Actualizar Producto</h1>
              <div className="button-group">
                <Link to="/admin/products/view" className="btn btn-secondary">Regresar</Link>
              </div>
            </div>
            <div className="form-wrapper">
              <div className="form-card">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="form-group">
                    <label className="form-label">{formData.name}</label>
                    {currentImage && (
                      <div className="current-image">
                        <img
                          src={currentImage}
                          alt="Imagen actual del producto"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      multiple
                      className="form-control"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Nombre del Producto</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price" className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="categories" className="form-label">Categorías</label>
                    <select
                      multiple
                      className="form-control"
                      id="categories"
                      name="categories"
                      value={formData.categories}
                      onChange={handleCategoryChange}
                    >
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-actions">
                    <Link to="/admin/products/view" className="btn btn-secondary">Cancelar</Link>
                    <button type="submit" className="btn btn-primary">Actualizar Producto</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdminFooterComponent />
    </div>
  );
};

export default ADUPDProductsPages;
