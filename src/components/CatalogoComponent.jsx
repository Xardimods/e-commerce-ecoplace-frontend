import { useEffect, useState } from "react";
import axios from "axios";
import CardComponent from "./CardComponent";
import PaginationComponent from "../common/PaginationComponent";
import SearchComponent from "./SearchComponent";
import '../styles/Global.css';

const CatalogoComponent = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(categoryId ? `http://34.201.92.59:3000/products/search?categories=${categoryId}` : "http://34.201.92.59:3000/products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los productos:", error);
        setLoading(false);
      }
    };
    cargarProductos();
  }, [categoryId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  if (loading) {
    return <div className="w-11/12">Cargando productos...</div>;
  }

  return (
    <main className="my-8 z-10 w-full min-h-full relative">
      <div className="w-full mx-auto m-4">
        <SearchComponent value={searchTerm} onChange={handleSearchChange} />
      </div>
      <div className="flex flex-col items-center w-full">
        <h2 className="text-4xl font-bold my-5">Lista de Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {currentProducts.map((product) => (
            <CardComponent
              key={product._id}
              id={product._id}
              productName={product.name}
              price={product.price}
              info={product.description}
              image={product.images[0]}
            />
          ))}
        </div>
        <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      {currentProducts.length === 0 && <div className="text-center py-4">No se encontraron productos.</div>}
    </main>
  );
};

export default CatalogoComponent;
