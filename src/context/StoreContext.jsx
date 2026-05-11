import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvide = (props) => {

   const [food_list, setFoodList] = useState([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [loading, setLoading] = useState(true);

   const fetchFoods = async () => {

      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/foods`
      );
      
      const data = await res.json();
      setFoodList(data);
      setLoading(false);
   };

   useEffect(() => {
      fetchFoods();
   }, []);

   const contextValue = {
      food_list,
      fetchFoods,
      loading
   };

   return (
      <StoreContext.Provider value={contextValue}>
         {props.children}
      </StoreContext.Provider>
   );
};

export default StoreContextProvide;