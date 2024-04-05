import { useEffect, useState } from 'react'
import axios from 'axios'
import CardComponent from './CardComponent'

const CatalogoComponent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const response = await axios.get('https://ecoplace.3.us-1.fl0.io/products');
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
      }
    }
    cargarProductos();
  },[])

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  console.log(products);

  return (
    <div className="w-11/12">
      <h1>Lista de Productos</h1>
      <div className="grid gap-12 min-w-20 lg:grid-cols-3 sm:grid-cols-1 transition-all">
        {products.map((product) => (
          <CardComponent 
          key={product._id}
          productName={product.name}
          price={product.price}
          info={product.description} />
          
        ))}
      </div>
    </div>
  );
  
}

export default CatalogoComponent