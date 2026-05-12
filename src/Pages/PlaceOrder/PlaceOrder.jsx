import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { useDispatch, useSelector } from 'react-redux';
import { getTotalCartAmount, clearCart } from '../../redux-tookit/CartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import SEO from '../../Components/SEO/SEO';
import { StoreContext } from '../../context/StoreContext';

export default function PlaceOrder() {

  const totalAmount = useSelector(getTotalCartAmount);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { user } = useSelector(state => state.auth);
  const { food_list } = useContext(StoreContext);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("deliveryInfo"));

    return {
      firstName: saved?.firstName || "",
      lastName: saved?.lastName || "",
      email: user?.email || "",
      street: saved?.street || "",
      area: saved?.area || "",
      city: saved?.city || "",
      state: saved?.state || "",
      zip: saved?.zip || "",
      phone: saved?.phone || "",
    };
  });

  const orderItems = Object.entries(cartItems).map(([id, item]) => {

    const food = food_list.find(food => food.id == id);
    if (!food) return null;

    return {
      id: food.id,
      quantity: item.quantity,
      price: food.price
    };

  }).filter(Boolean);


  const handlePayNow = async () => {

    if (totalAmount === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    try {

      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          phone: formData.phone,
          total_price: totalAmount + 2,
          items: orderItems
        })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error(orderData.message || "Order failed");
        return;
      }

      const orderId = orderData.order.id;

      const paymentRes = await fetch(`${import.meta.env.VITE_API_URL}/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          amount: totalAmount + 2,
          order_id: orderId
        })
      });

      const text = await paymentRes.text();

      console.log("SERVER RESPONSE:", text);

      return;

      if (!paymentRes.ok) {
        toast.error("Payment init failed");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: paymentData.amount,
        currency: "INR",
        order_id: paymentData.order_id,

        handler: async (response) => {
          await verifyPayment(response, orderId, orderItems);
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const verifyPayment = async (paymentData, orderId, items) => {

    try {

      await fetch(`${import.meta.env.VITE_API_URL}/payment/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...paymentData,
          order_id: orderId,
          items: items
        })
      });

      dispatch(clearCart());
      toast.success("Payment Successful");

      navigate("/yourOrder");

    } catch (error) {
      toast.error("Verification failed");
    }
  };

  useEffect(() => {
    localStorage.setItem("deliveryInfo", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        <h1>Login</h1>

        <p style={{ color: "#777" }}>
          Please login to Access This Page
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            border: "none",
            background: "tomato",
            color: "#fff",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <form className="place-order" onSubmit={(e) => e.preventDefault()}>

      <SEO
        title="Place Order - Plato"
        description="Enter delivery details and complete your order."
      />

      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-fields">
          <input name="firstName" placeholder="First Name"
            value={formData.firstName} onChange={handleChange} required />

          <input name="lastName" placeholder="Last Name"
            value={formData.lastName} onChange={handleChange} required />
        </div>

        <input name="email" value={formData.email} disabled />

        <input name="street" placeholder="Street"
          value={formData.street} onChange={handleChange} required />

        <input name="area" placeholder="Area"
          value={formData.area} onChange={handleChange} required />

        <div className="multi-fields">
          <input name="city" placeholder="City"
            value={formData.city} onChange={handleChange} required />

          <input name="state" placeholder="State"
            value={formData.state} onChange={handleChange} required />
        </div>

        <input name="zip" placeholder="Zip-code"
          value={formData.zip} onChange={handleChange} required />

        <input name="phone" placeholder="Phone"
          value={formData.phone} onChange={handleChange} required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">

          <h2>Cart Summary</h2>

          <div className="cart-total-details">
            <p>SubTotal</p>
            <p>${totalAmount}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>${totalAmount === 0 ? 0 : 2}</p>
          </div>

          <hr />

          <div className="cart-total-details">
            <b>Total</b>
            <b>${totalAmount === 0 ? 0 : totalAmount + 2}</b>
          </div>

          <button
            type="button"
            onClick={handlePayNow}
            disabled={loading}
          >
            {loading ? "PROCESSING..." : "PAY NOW"}
          </button>

        </div>
      </div>

    </form>
  );
}