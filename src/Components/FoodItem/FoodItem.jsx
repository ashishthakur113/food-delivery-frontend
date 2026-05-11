import React from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { FaLeaf } from "react-icons/fa";
import { GiChickenOven } from "react-icons/gi";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCart } from '../../redux-tookit/CartSlice';

export default function FoodItem({ id, name, price, description, image, type }) {

  const cartItems = useSelector((state) => state.cart.cartItems);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const item = cartItems[id];

  
const updateLocalCart = (newQty) => {

  const updatedCart = { ...cartItems };

  if (newQty > 0) {
    updatedCart[id] = {
      ...updatedCart[id],
      quantity: newQty
    };

  } else {
    delete updatedCart[id];
  }
  dispatch(setCart(updatedCart));
};


  const addToCart = async () => {
    updateLocalCart(1);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ food_id: id })
    });

    if (!res.ok) {
      toast.error("Failed to add");
      return;
    }
    toast.success("Added to Cart");
  };

 const updateQty = async (type) => {
  const currentQty = item?.quantity || 0;

  let newQty = type === "inc" ? currentQty + 1 : currentQty - 1;

  if (newQty <= 0) {
    newQty = 0;
  }

  const oldQty = currentQty;

  updateLocalCart(newQty);

  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/cart/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      }
    );

    if (!res.ok) {
      updateLocalCart(oldQty);
      toast.error("Update failed");
      return;
    }

  } catch (error) {
    updateLocalCart(oldQty);
    toast.error("Something went wrong");
  }
};

  return (
    <div className='food-item'>
      <div className="food-item-img-cont">
        <img
          src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/foods/${image}`}
          alt={name}
          className="food-item-img"
        />

        <span className={`food-type-badge ${type}`}>
          {type === "veg" ? <FaLeaf /> : <GiChickenOven />}
        </span>

        {!item ? (
          <img
            src={assets.add_icon_white}
            className="add"
            onClick={addToCart}
            alt=""
          />
        ) : (
          <div className='food-item-counter'>

            <img src={assets.remove_icon_red} onClick={() => updateQty("dec")} alt=""/>

            <p>{item.quantity}</p>

            <img  src={assets.add_icon_green}  onClick={() => updateQty("inc")}  alt=""/>

          </div>
        )}

      </div>

      <div className='food-item-info'>

        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>

        <p className="food-item-desc">{description}</p>
        <p className='food-item-price'>${price}</p>

      </div>

    </div>
  );
}