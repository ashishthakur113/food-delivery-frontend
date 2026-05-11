import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate, useParams } from "react-router-dom";
import "./Admin.css";
import { toast } from "react-toastify";
import SEO from "../SEO/SEO";

export default function AddFoodItem() {

  const { fetchFoods } = useContext(StoreContext);
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    image: null,
    price: "",
    description: "",
    category: "",
    type: "veg",
  });


  useEffect(() => {
    if (isEdit) {
      const fetchFood = async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/foods/${id}`
          );

          const data = await res.json();
          setData(data);
          setFormData({
            ...data,
            image: null,
          });
        } 
        catch (error) {
          console.log(error);
          toast.error("Failed to fetch food item");
        }
      };
      fetchFood();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      form.append("name", formData.name);
      form.append("price", formData.price);
      form.append("description", formData.description);
      form.append("category", formData.category);
      form.append("type", formData.type);

      if (formData.image) {
        form.append("image", formData.image);
      }

      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/foods/${id}`
        : `${import.meta.env.VITE_API_URL}/foods`;

      if (isEdit) {
        form.append("_method", "PUT");
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: form,
      });

    const data = await res.json();
      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          toast.error(data.message || "Something went wrong");
        }
        return;
      }

      toast.success(
        isEdit
          ? "Food Item Updated"
          : "Food Item Added"
      );

      await fetchFoods();
      navigate("/admin/food-list");
    } 
    catch (error) {
      console.log(error);
      toast.error("Server Error");
    } 
    finally {
      setLoading(false);
    }
  };

  return (

    <div className="admin-container">
      <SEO
        title="Add Food - Plato Admin"
        description="Add new food items, upload images, and manage restaurant menu listings."
        noIndex={true}
      />
      <div className="admin-top">
        <h2>{isEdit ? "Edit Food Item" : "Add Food Item"} </h2>

        <button
          className="admin-btn secondary"
          onClick={() => navigate("/admin/dashboard")}>
          Back To DashBoard
        </button>

      </div>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >

        <div>
          <input type="text" name="name" placeholder="Food Name" value={formData.name} onChange={handleChange}/>
          {
            errors.name &&
            <p className="field-error">{errors.name[0]}</p>
          }
        </div>

        <div>
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange}/>
          {
            errors.price &&
            <p className="field-error">{errors.price[0]}</p>
          }
        </div>

        <div>
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange}/>
          {
            errors.category &&
            <p className="field-error">{errors.category[0]}</p>
          }
        </div>

        <div>
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
          {
            errors.description &&
            <p className="field-error">
              {errors.description[0]}
            </p>
          }
        </div>

        <div>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="veg">Veg</option>
            <option value="non-veg">Non Veg</option>
          </select>

          {
            errors.type &&
            <p className="field-error">{errors.type[0]}</p>
          }
        </div>

        { isEdit && !formData.image && data?.image && (
            <img
              src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/foods/${data.image}`}
              alt="" className="preview-img"
            />
          )
        }

        {
          formData.image &&
          typeof formData.image !== "string" && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt=""
              className="preview-img"
            />
          )
        }

        <div>
          <input type="file" name="image" onChange={handleChange}/>
          {
            errors.image &&
            <p className="field-error">{errors.image[0]}</p>
          }
        </div>

        <button
          className={`admin-btn ${loading ? "loading-btn" : ""}`}
          disabled={loading}
        >
          {
            loading
              ? (
                <span className="btn-loader-wrap">
                  <span className="mini-loader"></span>
                  {isEdit  ? "Updating..."  : "Adding..."}
                </span>
              )
              : (isEdit  ? "Update Food"  : "Add Food")
          }
        </button>
      </form>
    </div>
  );
}