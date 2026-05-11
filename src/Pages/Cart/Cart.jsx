import React, { useEffect, useState } from 'react';
import './Cart.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../redux-tookit/CartSlice';
import { toast } from 'react-toastify';
import { MdOutlineDeleteOutline } from "react-icons/md";
import SEO from '../../Components/SEO/SEO';
import Loader from '../../Components/Loader/Loader';

export default function Cart() {

  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  const token = localStorage.getItem("token");
  if (!token) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "15px"
      }}
    >
      <h1>Login to access cart</h1>

      <p style={{ color: "#777" }}>
        Please login to view your cart items
      </p>

      <button
        onClick={() => navigate("/")}
        style={{padding: "10px 20px",border: "none",background: "tomato",color: "#fff",borderRadius: "8px",cursor: "pointer"
        }}>
        Go Home
      </button>
    </div>
  );
}

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCart = async () => {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      const formatted = {};

      data.forEach(item => {
        formatted[item.food_id] = {
          quantity: item.quantity,
          food: item.food
        };
      });

      dispatch(setCart(formatted));
      setLoading(false);
    };

    fetchCart();
  }, []);


  const subTotal = Object.values(cartItems).reduce((acc, item) => {
    return acc + (item?.food?.price || 0) * item.quantity;
  }, 0);

  const deliveryFee = subTotal === 0 ? 0 : 2;
  const total = subTotal + deliveryFee - discount;

  const removeItem = async (id) => {
    await fetch(`${import.meta.env.VITE_API_URL}/cart/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const updated = { ...cartItems };
    delete updated[id];

    dispatch(setCart(updated));
    toast.info("Item Removed From Cart");
  };

  const applyPromo = () => {
    if (promo === "SAVE10") {
      setDiscount(subTotal * 0.1);
      toast.success("Promo Applied: 10% OFF");
    } else {
      toast.error("Invalid Promo Code");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className='cart'>

      <SEO
        title="Your Cart | Review Items - Plato"
        description="Review your cart items and proceed to checkout."
      />

      <div className="cart-items">

        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>

        <br />
        <hr />

        {Object.keys(cartItems).map((id) => {

          const item = cartItems[id];
          if (!item || item.quantity <= 0) return null;

          return (
            <div key={id}>

              <div className="cart-items-title cart-items-item">

                <img
                  src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/foods/${item.food?.image}`}
                  alt={item.food?.name}
                  style={{ width: "50px", borderRadius: "8px" }}
                />

                <p className='item-name'>
                  {item.food?.name}
                </p>

                <p>${item.food?.price}</p>

                <div className='qty-controls'>

                  <button
                    className='qty-btn'
                    onClick={async () => {

                      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/${id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ type: "dec" })
                      });

                      if (!res.ok) {
                        toast.error("Failed");
                        return;
                      }

                      const updated = { ...cartItems };

                      if (updated[id].quantity <= 1) {
                        delete updated[id];
                      } else {
                        updated[id] = {
                          ...updated[id],
                          quantity: updated[id].quantity - 1
                        };
                      }

                      dispatch(setCart(updated));
                    }}
                  >
                    -
                  </button>

                  <span className='item-qty'>
                    {item.quantity}
                  </span>

                  <button
                    className='qty-btn'
                    onClick={async () => {

                      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/${id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ type: "inc" })
                      });

                      if (!res.ok) {
                        toast.error("Failed");
                        return;
                      }

                      const updated = {
                        ...cartItems,
                        [id]: {
                          ...cartItems[id],
                          quantity: cartItems[id].quantity + 1
                        }
                      };

                      dispatch(setCart(updated));

                    }}
                  >
                    +
                  </button>
                </div>

                <p>
                  ${item.food?.price * item.quantity}
                </p>

                <p onClick={() => removeItem(id)} className='cross'>
                  <MdOutlineDeleteOutline style={{ color: "red", fontSize: "20px" }} />
                </p>

              </div>
              <hr />
            </div>
          );
        })}

      </div>

      <div className="cart-bottom">
        <div className="cart-total">

          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>SubTotal</p>
            <p>${subTotal}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${deliveryFee}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>${total}</b>
          </div>

          <button onClick={() => navigate("/order")}>
            PROCEED TO CHECKOUT
          </button>

        </div>

        <div className="cart-promocode">
          <p>If you have a promo code, enter it here</p>
          <div className="cart-promocode-input">

            <input
              type="text"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder='Promo Code'
            />

            <button onClick={applyPromo}>
              Submit
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}