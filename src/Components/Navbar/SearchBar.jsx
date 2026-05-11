import React, { useEffect, useState } from 'react'
import { MdSearch } from "react-icons/md";
import './Navbar.css'
import { useLocation, useNavigate } from 'react-router-dom';

export default function SearchBar() {

    const [inputValue, setInputValue] = useState(
        localStorage.getItem("searchTerm") || ""
    );

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/search') {
            setInputValue('');
        }
    }, [location.pathname]);


    const handleKey = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            localStorage.setItem(
                "searchTerm",
                inputValue.trim()
            );
            navigate('/search');
        }
    };

    useEffect(() => {
        if (
            location.pathname === "/search" &&
            inputValue.trim() === ""
        ) {
         const timer = setTimeout(() => {
             localStorage.removeItem("searchTerm");
             navigate("/");
         }, 1000);
            return () => clearTimeout(timer);
        }
    }, [inputValue, location.pathname, navigate]);

    return (
        <div className="navbar-search">
            <MdSearch className="search-icon" />
            <input  type="text"  placeholder="Search dishes"  value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKey}
            />

        </div>
    )
}