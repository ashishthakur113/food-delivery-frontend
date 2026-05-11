import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Cart from './Pages/Cart/Cart'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Footer from './Components/Footer/Footer'
import LoginPopUp from './Components/LoginPopUp/LoginPopUp'
import SearchResult from './Pages/SearchResult/SearchResult'
import { ToastContainer , Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderHistory from './Pages/OrderHistory/OrderHistory'
import AboutPage from './Pages/About/AboutPage'
import Cursor from './GSAP/Cursor'
import AddFoodItem from './Components/Admin/AddFoodItem'
import FoodList from './Components/Admin/FoodList'
import AdminRoute from './Components/Admin/AdminRoute'
import AdminDashboard from './Components/Admin/AdminDashboard'



export default function App() {

  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
    
      {
        showLogin ? <LoginPopUp setShowLogin={setShowLogin} /> : <></>
      }
      <div className='app'>
        
        <Cursor/>
        <Navbar setShowLogin={setShowLogin} />
       <div className='main-content'>
         <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Cart' element={ <Cart /> } />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/search' element={<SearchResult />} />
          <Route path='/yourOrder' element={<OrderHistory/>}/>
          <Route path='/aboutus' element={<AboutPage/>}/>

          <Route path='/admin/add-food' 
            element ={
               <AdminRoute>
                <AddFoodItem/>
               </AdminRoute>
            }
           />
          <Route path='/admin/edit-food/:id' 
            element ={
               <AdminRoute>
                 <AddFoodItem/>
               </AdminRoute>
            }
           />
          <Route path='/admin/food-list' 
            element ={
               <AdminRoute>
                <FoodList/>
               </AdminRoute>
            }
           />
          <Route path='/admin/dashboard' 
            element ={
               <AdminRoute>
                <AdminDashboard/>
               </AdminRoute>
            }
           />
        </Routes>
       </div>
      </div>

      <Footer />

      <ToastContainer
        position="top-right" autoClose={2000} hideProgressBar={false}  newestOnTop={false}  closeOnClick={false}  rtl={false}    pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  )
}
