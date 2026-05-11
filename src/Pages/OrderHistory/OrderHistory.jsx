import React, { useEffect, useState } from 'react';
import './OrderHistory.css';
import SEO from '../../Components/SEO/SEO';
import Loader from '../../Components/Loader/Loader';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading , setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        const data = await res.json();
        setOrders(data);
      }
      catch (error) {
        console.log(error);
      }
      finally{
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

   const token = localStorage.getItem("token");
     if (!token) {
     return (
       <div
         style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "15px"
         }}  >
         <h1>Login</h1>
   
         <p style={{ color: "#777" }}>
           Please login to view Order History 
         </p>
   
         <button
           onClick={() => navigate("/")}
           style={{ padding: "10px 20px", border: "none", background: "tomato", color: "#fff", borderRadius: "8px", cursor: "pointer"
           }} >
           Go Home
         </button>
       </div>
     );
  }

  if(loading){
    return <Loader/>
  }

  return (
    <div className="order-history">
      <SEO
        title="Your Orders | Order History - Plato"
        description="View your food order history, track past orders, and review the meals delivered to you from your favorite local restaurants."
      />
      <h2>Your Orders</h2>

      {orders.length === 0 ? (

       <div className="no-orders">
         <h3>No Orders Placed Yet</h3>
         <p>Your ordered food will appear here.</p>
       </div>
     
       ): (
      
      orders.map(order => (
        <div key={order.id} className="order-card">

          <div className="order-meta">
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>Date:</b> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><b>Arriving In:</b> 20 mins</p>
            <p className={`status ${order.status}`}> {order.status}</p>
          </div>

          <div className="order-items">
            {(order.items || []).map(item => (
              <div key={item.id} className="order-item">

                <img  src={`${import.meta.env.VITE_API_IMAGE_URL}/${item.food.image}`} alt={item.food.name} />

                <div>
                  <p className="item-name">{item.food.name}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                </div>

              </div>
            ))}
          </div>

          <div className="order-total">
            <b>Total:</b> $ {order.total_price}
          </div>

        </div>
      )))}
    </div>
  );
}
