import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HeaderBanner from "../component/HeaderBanner";
import Navbar from "../component/NavBar";
import Login from "../Auth/Login";
import AllProducts from "../component/AllProduct";
import TopSellingAll from "../component/TopSellingAll";
import Casual from "../component/Casual";
import Formal from "../component/Formal";
import Party from "../component/Party";
import Gym from "../component/Gym";
import ProductDetail from "../component/ProductDetail";
import Cart from "../component/Cart";
import CheckOutPage from "../component/CheckOutPage";
import OrderSuccess from "../component/OrderSucessPage";
import "react-toastify/dist/ReactToastify.css";
import HeroSection from "../Pages/HeroSection";
import BrandsFooter from "../Pages/BrandFooter";
import NewArrivals from "../Pages/NewArrivals";
import TopSelling from "../Pages/TopSelling";
import Brands from "../Pages/Brands";
import OurHappyCustomer from "../Pages/OurHappyCustomer";
import FooterSection from "../Pages/FooterSection";
import PrivateRoute from "./ProtectedRoute.jsx/PrivateRoute";
import Order from "../component/Order";

const AppRoutes = () => {
  return (
    <Router>
      <ToastContainer />
      <HeaderBanner />
      <Navbar />

      <Routes>
        <Route
          path="/login"
          element={
            <PrivateRoute>
              <Login onClose={() => {}} onSwitch={() => {}} />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <BrandsFooter />
              <NewArrivals />
              <TopSelling />
              <Brands />
              <OurHappyCustomer />
              <FooterSection />
            </>
          }
        />

        {/* Category and product routes */}
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/top-selling" element={<TopSellingAll />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/casual" element={<Casual />} />
        <Route path="/formal" element={<Formal />} />
        <Route path="/party" element={<Party />} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Cart & Order */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkoutpage" element={<CheckOutPage />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
