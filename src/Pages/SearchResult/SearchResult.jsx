import React, { useEffect, useState } from 'react'
import './SearchResult.css'
import FoodItem from '../../Components/FoodItem/FoodItem'
import SEO from '../../Components/SEO/SEO'
import Loader from '../../Components/Loader/Loader'

export default function SearchResult() {

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchTerm = localStorage.getItem("searchTerm");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm || searchTerm.trim() === "") {
        return;
      }
      setLoading(true);

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/foods/search/${searchTerm}`
        );

        const data = await res.json();
        setFoods(data);
      } 
      catch (error) {
        console.log(error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  if (loading) {
    return <Loader />
  }

  if (!searchTerm || searchTerm.trim() === "") {
    return (
      <div className="search-result">
        <h2>No search yet</h2>
        <p>Please search for a dish to see results.</p>
      </div>
    )
  }

  return (
    <div className="search-result">
      <SEO
        title={`Search Results for "${searchTerm}" | Plato Food Delivery`}
        description={`Find delicious ${searchTerm} dishes on Plato.`}
      />

      <h2>
        Search Results for "{searchTerm}"
      </h2>

      {foods.length > 0 ? (
        <div className="search-grid">
          {foods.map((item) => (

            <FoodItem key={item.id} id={item.id} name={item.name} price={item.price} description={item.description} image={item.image} type={item.type}
            />
          ))}
        </div>
      ) : (
        <p>No dishes found</p>
      )}
    </div>
  )
}