import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentRole } from '../../auth/AuthSlice';
import logo from '../../../public/img/DALL·E_2024_03_31_20_04_37_Create_an_illustrative_logo_for_EcoPlace (1).webp';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const token = useSelector(selectCurrentToken);
  const role = useSelector(selectCurrentRole);

  const handleRedirect = () => {
    if (!token) {
      navigate("/login");
    } else {
      switch (role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Seller":
          navigate("/seller");
          break;
        case "Customer":
          navigate("/");
          break;
        default:
          navigate("/login");
          break;
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500 py-12 px-4 sm:px-6 lg:px-8">
      <img src={logo} alt="EcoPlace Logo" className="w-24 h-24 mb-4" />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-8xl font-bold text-red-600">403</h1>
        <p className="mt-4 text-2xl font-semibold text-gray-700">
          Acceso denegado.
        </p>
        <p className="mt-2 text-lg text-gray-600">
          Parece que no tienes permiso para acceder a esta página.
        </p>
        <button
          onClick={handleRedirect}
          className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

