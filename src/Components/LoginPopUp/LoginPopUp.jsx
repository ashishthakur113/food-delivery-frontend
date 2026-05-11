import React, { useState, useEffect } from "react";
import "./LoginPopUp.css";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux-tookit/AuthSlice";
import { setCart } from "../../redux-tookit/CartSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPopUp({ setShowLogin }) {

  const [currState, setCurrState] = useState("Login");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchCartAfterLogin = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const formattedCart = {};
      data.forEach(item => {
        formattedCart[item.food_id] = item.quantity;
      });

      dispatch(setCart(formattedCart));

    } catch (err) {
      console.log("Cart fetch failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url =
        currState === "Sign Up"
          ? `${import.meta.env.VITE_API_URL}/register`
          : `${import.meta.env.VITE_API_URL}/login`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      dispatch(loginSuccess(data));
      localStorage.setItem("token", data.token);

      await fetchCartAfterLogin(data.token);
      setShowLogin(false);

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }

    } catch (error) {
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  }, [currState]);

  return (
    <div className="login-popup">
      <form className="login-popup-cont" onSubmit={handleSubmit}>

        <div className="login-popup-title">
          <h2>{currState}</h2>
          <RxCross2 onClick={() => setShowLogin(false)} />
        </div>

        <div className="login-popup-inputs">

          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          )}

          <input  type="email"  placeholder="Your Email"  value={formData.email}
            onChange={(e) =>setFormData({ ...formData, email: e.target.value }) }
            required
          />

          <input type="password" placeholder="Enter Password" value={formData.password}
            onChange={(e) =>setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button disabled={loading} className={loading ? "loading-btn" : ""}>
          {
            loading
              ? (currState === "Sign Up" ? "Creating Account..." : "Logging In...")
              : (currState === "Sign Up" ? "Create Account" : "Login")
          }
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            By Continuing, I agree to the Terms of Use & Privacy Policy.
          </p>
        </div>

        {
          currState === "Login" ? (
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrState("Sign Up")}>
                Click here
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>
                Login here
              </span>
            </p>
          )
        }

      </form>
    </div>
  );
}