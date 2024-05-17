import { useState } from "react";
import CatalogoComponent from "../../components/CatalogoComponent";
import { Sidebar } from "../../components/Sidebar";
import LayoutComponent from "../../layout/LayoutMain";

const HomePage = () => {
  const [showSide, setShowSide] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleSide = () => {
    setShowSide(!showSide);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const resetCategory = () => {
    setSelectedCategoryId(null);
  };

  return (
    <>
      <LayoutComponent function={handleSide} resetCategory={resetCategory}>
        <div className="flex justify-center smm:justify-between min-h-[800px]">
          <Sidebar showSide={showSide} onCategorySelect={handleCategorySelect} />
          <CatalogoComponent categoryId={selectedCategoryId} />
        </div>
      </LayoutComponent>
    </>
  );
};

export default HomePage;
