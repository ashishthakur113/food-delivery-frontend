import React, { useEffect, useState } from 'react';
import './Admin.css';
import { useNavigate } from 'react-router-dom';
import SEO from '../SEO/SEO';


export default function AdminDashboard() {

    const [stats, setStats] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      const fetchDashboard = async () => {
        try {
           const res = await fetch(
             `${import.meta.env.VITE_API_URL}/admin/dashboard`,
                 {
                    headers: {
                       Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                 }
                );
            const data = await res.json();
            setStats(data); 
            console.log(data.recentOrders);
            
            } catch (error) {
                console.log(error);
            }
        };

        fetchDashboard();
    }, []);

    if (!stats) {
        return (
            <div className='admin-loading'>
                <h2>Loading Dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <SEO
              title="Admin Dashboard - Plato"
              description="Manage orders, users, foods, and platform analytics from the admin dashboard."
              noIndex={true}
            />

            <div className="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage foods, orders and platform analytics</p>
                </div>

                <div className="dashboard-actions">
                    <button onClick={() => navigate('/admin/add-food')}>
                        Add Food
                    </button>

                    <button onClick={() => navigate('/admin/food-list')}>
                        Food List
                    </button>
                </div>
            </div>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <h3>Total Users</h3>
                    <h1>{stats.totalUsers}</h1>
                </div>

                <div className="dashboard-card">
                    <h3>Total Orders</h3>
                    <h1>{stats.totalOrders}</h1>
                </div>

                <div className="dashboard-card">
                    <h3>Pending Orders</h3>
                    <h1>{stats.pendingOrders}</h1>
                </div>

                <div className="dashboard-card">
                    <h3>Total Revenue</h3>
                    <h1>₹{stats.totalRevenue}</h1>
                </div>

            </div>

            <div className="recent-orders">
                <h2>Recent Orders</h2>
                {stats.recentOrders.length > 0 ? (
                    stats.recentOrders.map(order => (
                        <div key={order.id} className="recent-order-card">
                            <div>
                                <p><b>Order ID:</b> #{order.id}</p>
                                <p>
                                   <b>Customer:</b>{" "}
                                   {order.first_name} {order.last_name}
                                </p>
                                <p><b>Status:</b> {order.status}</p>
                                <p>
                                  <b>Date:</b>{" "}
                                  {new Date(order.created_at).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p><b>Total:</b> ₹{order.total_price}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No recent orders found</p>
                )}
            </div>
        </div>
    );
}