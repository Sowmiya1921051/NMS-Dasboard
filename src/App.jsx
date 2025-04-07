import React from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./components/Home";
import AddBroker from "./components/addBroker";
import SideNav from "./components/SideNav";
import Sample from "./components/sample";
import BrokerDetails from "./components/BrokerDetails";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import VerifiedProfile from "./components/VerifyProfile";
import UserDetail from "./components/UserDetail";
import BrokerList from "./components/brokerList";
import BrokerProfile from "./components/brokerProfile";
import BrokerVerify from "./components/brokerVerify";
import Reports from "./components/Reports";
import DealerVerify from "./components/DealerVerify";
import AuthPage from "./components/AuthPage";
import Numerology from "./components/Astrologers/Numerology";
import Astrologers from "./components/Astrologers";
import Parambariyam from "./components/Astrologers/Parambariyam";
import Vastu from "./components/Astrologers/Vasthu";
import Kairegai from "./components/Astrologers/Kairegai";
import EnthiramManthiram from "./components/Astrologers/EnthiramManthiram";
import ParigaraPoojaigal from "./components/Astrologers/ParigaraPoojaigal";
import KPJothidam from "./components/Astrologers/KPJothidam";
import Naadi from "./components/Astrologers/Naadi";
import OlaiSuvadi from "./components/Astrologers/OlaiSuvadi";
import AllInOneAstrologer from "./components/Astrologers/AllInOneAstrologer";
import MarraigeHall from "./components/AtoZservices/MarraigeHall";
import Catering from "./components/AtoZservices/Catering";
import Beautician from "./components/AtoZservices/Beautician"; 
import DressShops from "./components/AtoZservices/DressShops";
import FlowerService from "./components/AtoZservices/FlowerService";
import StageDecoration from "./components/AtoZservices/StageDecoration";
import PhotoAndVideo from "./components/AtoZservices/PhotoAndVideo";
import WeddingCard from "./components/AtoZservices/WeddingCard";
import AtoZservices from "./components/AtoZservices";
import Farmer from "./components/AtoZservices/Farmer";
import "./App.css"; // Import CSS for responsiveness

function App() {
  return (
    <BrowserRouter basename="/">
      <MainLayout />
    </BrowserRouter>
  );
}

function MainLayout() {
  const location = useLocation();
  const hideSideNav = location.pathname === "/AuthPage"; // Hide sidebar on AuthPage

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem("authToken");

  return (
    <div className="app-container">
      {/* Redirect to AuthPage only if user is NOT authenticated */}
      {!isAuthenticated && location.pathname !== "/AuthPage" ? (
        <Navigate to="/AuthPage" />
      ) : (
        <>
          {!hideSideNav && <SideNav />} {/* Show SideNav only if not on AuthPage */}
          <div className={`main-content ${hideSideNav ? "full-width" : ""} `}>
            <Routes>
              <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/AuthPage"} />} />
              <Route path="/AuthPage" element={<AuthPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/broker-details/:id" element={<BrokerDetails />} />
              <Route path="/add-broker" element={<AddBroker />} />
              <Route path="/sample" element={<Sample />} />
              <Route path="/DealerVerify" element={<DealerVerify />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/verifiedProfile" element={<VerifiedProfile />} />
              <Route path="/user-details/:id" element={<UserDetail />} />
              <Route path="/brokerlist" element={<BrokerList />} />
              <Route path="/brokerprofile" element={<BrokerProfile />} />
              <Route path="/brokerverify/:id" element={<BrokerVerify />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/Numerology" element={<Numerology />} />
              <Route path="/Astrologers" element={<Astrologers />} />
              <Route path="/Parambariyam" element={<Parambariyam />} />
              <Route path="/Vastu" element={<Vastu />} />
              <Route path="/Kairegai" element={<Kairegai />} />
              <Route path="/Enthiram-Manthiram" element={<EnthiramManthiram />} />
              <Route path="/Parigara-Poojaigal" element={<ParigaraPoojaigal />} /> 
              <Route path="/KP-Jothidam" element={<KPJothidam />} />
              <Route path="/Naadi" element={<Naadi />} />
              <Route path="/Olai-Suvadi" element={<OlaiSuvadi />} />
              <Route path="/All-In-One-Astrologer" element={<AllInOneAstrologer />} />
              <Route path="/Marraige-Hall" element={<MarraigeHall />} />
              <Route path="/Catering" element={<Catering />} />
              <Route path="/Beautician" element={<Beautician />} />
              <Route path="/Dress-Shops" element={<DressShops />} />
              <Route path="/Flower-Service" element={<FlowerService />} />
              <Route path="/Stage-Decoration" element={<StageDecoration />} />
              <Route path="/Photo-And-Video" element={<PhotoAndVideo />} />
              <Route path="/Wedding-Card" element={<WeddingCard />} />
              <Route path="/AtoZservices" element={<AtoZservices />} />
              <Route path="/Farmer" element={<Farmer />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
