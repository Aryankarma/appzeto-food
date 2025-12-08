import { Routes, Route } from "react-router-dom"
import DeliveryLayout from "./DeliveryLayout"

// Auth pages (no layout needed)
import DeliveryLogin from "../pages/auth/Login"
import DeliverySignup from "../pages/auth/Signup"
import DeliveryOTP from "../pages/auth/OTP"

// Main pages (with layout)
import DeliveryHome from "../pages/DeliveryHome"
import Notifications from "../pages/Notifications"
import MyOrders from "../pages/MyOrders"
import OrderRequestPage from "../pages/OrderRequestPage"
import GigBooking from "../pages/GigBooking"
import PickupDirectionsPage from "../pages/PickupDirectionsPage"
import ProfilePage from "../pages/ProfilePage"
import AcceptedOrderDetails from "../pages/AcceptedOrderDetails"
import MyAccount from "../pages/MyAccount"
import TransactionHistory from "../pages/TransactionHistory"
import EditProfile from "../pages/EditProfile"
import Settings from "../pages/Settings"
import Conversation from "../pages/Conversation"
import TermsAndConditions from "../pages/TermsAndConditions"
import PrivacyPolicy from "../pages/PrivacyPolicy"
import Payout from "../pages/Payout"
import DeductionStatement from "../pages/DeductionStatement"
import TipsStatement from "../pages/TipsStatement"
import PocketStatement from "../pages/PocketStatement"
import OffersPage from "../pages/OffersPage"
import UpdatesPage from "../pages/UpdatesPage"

export default function DeliveryRouter() {
  return (
    <Routes>
      {/* Auth routes - no layout */}
      <Route path="/login" element={<DeliveryLogin />} />
      <Route path="/signup" element={<DeliverySignup />} />
      <Route path="/otp" element={<DeliveryOTP />} />

      {/* Main routes with layout */}
      <Route 
        path="/" 
        element={
          <DeliveryLayout showGig={true}>
            <DeliveryHome />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/notifications" 
        element={
          <DeliveryLayout>
            <Notifications />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/orders" 
        element={
          <DeliveryLayout showGig={true}>
            <MyOrders />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/requests" 
        element={
          <DeliveryLayout showGig={true} showPocket={true}>
            <OrderRequestPage />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/gig" 
        element={
          <DeliveryLayout showGig={true}>
            <GigBooking />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/offers" 
        element={
          <DeliveryLayout showGig={true}>
            <OffersPage />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/pickup-directions" 
        element={
          <DeliveryLayout>
            <PickupDirectionsPage />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <DeliveryLayout showGig={true}>
            <ProfilePage />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/order/:orderId" 
        element={
          <DeliveryLayout>
            <AcceptedOrderDetails />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/account" 
        element={
          <DeliveryLayout>
            <MyAccount />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <DeliveryLayout>
            <TransactionHistory />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/payout" 
        element={
          <DeliveryLayout>
            <Payout />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/deduction-statement" 
        element={
          <DeliveryLayout>
            <DeductionStatement />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/tips-statement" 
        element={
          <DeliveryLayout>
            <TipsStatement />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/pocket-statement" 
        element={
          <DeliveryLayout>
            <PocketStatement />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/profile/edit" 
        element={
          <DeliveryLayout>
            <EditProfile />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/profile/settings" 
        element={
          <DeliveryLayout>
            <Settings />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/profile/conversation" 
        element={
          <DeliveryLayout>
            <Conversation />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/profile/terms" 
        element={
          <DeliveryLayout>
            <TermsAndConditions />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/profile/privacy" 
        element={
          <DeliveryLayout>
            <PrivacyPolicy />
          </DeliveryLayout>
        } 
      />
      <Route 
        path="/updates" 
        element={
          <DeliveryLayout showGig={true}>
            <UpdatesPage />
          </DeliveryLayout>
        } 
      />
    </Routes>
  )
}

