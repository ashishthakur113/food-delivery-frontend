import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import Loader from "../Loader/Loader";
import { toast } from "react-toastify";
import SEO from "../SEO/SEO";

export default function FoodList() {

  const { food_list, fetchFoods, loading } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/foods/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
  });

    if (!res.ok) {
      toast.error("Delete Failed");
      return;
    }

    toast.info("Food Item Deleted");
    await fetchFoods();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-container">
      <SEO
        title="Food List - Plato Admin"
        description="View, edit, and manage all food items available on the platform."
        noIndex={true}
      />
      <div className="admin-top">
        <h2>Food List</h2>

        <button
          className="admin-btn "
          onClick={() => navigate("/admin/dashboard")}>
          Back To DashBoard
        </button>
      </div>

      <div className="food-list-wrapper">
        {
          food_list.map((item) => (
            <div className="food-row" key={item.id}>
              <img
                className="food-row-image"
                src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/foods/${item.image}`}
                alt={item.name}
              />

              <div className="food-row-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <div className="food-meta">
                  <span>₹ {item.price}</span>
                  <span>{item.category}</span>
                  <span>{item.type}</span>
                </div>
              </div>

              <div className="food-row-actions">
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/admin/edit-food/${item.id}`)
                  }
                >
                  Edit
                </button>

                <button  className="delete-btn"  onClick={() => handleDelete(item.id)}>
                  Delete
                </button>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  );
}