import { Routes, Route, Navigate } from "react-router-dom"
import Home from "@/pages/Home"
import UserRouter from "@/module/user/components/UserRouter"
import HomePage from "@/module/usermain/pages/HomePage"
import CategoriesPage from "@/module/usermain/pages/CategoriesPage"
import CategoryFoodsPage from "@/module/usermain/pages/CategoryFoodsPage"
import FoodDetailPage from "@/module/usermain/pages/FoodDetailPage"
import CartPage from "@/module/usermain/pages/CartPage"
import CheckoutPage from "@/module/usermain/pages/CheckoutPage"
import PaymentPage from "@/module/usermain/pages/PaymentPage"
import OrdersPage from "@/module/usermain/pages/OrdersPage"
import OrderDetailsPage from "@/module/usermain/pages/OrderDetailsPage"
import WishlistPage from "@/module/usermain/pages/WishlistPage"
import RestaurantOrdersPage from "@/module/restaurant/pages/OrdersPage"
import AllOrdersPage from "@/module/restaurant/pages/AllOrdersPage"
import RestaurantDetailsPage from "@/module/restaurant/pages/RestaurantDetailsPage"
import EditRestaurantPage from "@/module/restaurant/pages/EditRestaurantPage"
import FoodDetailsPage from "@/module/restaurant/pages/FoodDetailsPage"
import EditFoodPage from "@/module/restaurant/pages/EditFoodPage"
import AllFoodPage from "@/module/restaurant/pages/AllFoodPage"
import WalletPage from "@/module/restaurant/pages/WalletPage"
import RestaurantNotifications from "@/module/restaurant/pages/Notifications"
import OrderDetails from "@/module/restaurant/pages/OrderDetails"
import RestaurantSignIn from "@/module/restaurant/pages/auth/SignIn"
import RestaurantLogin from "@/module/restaurant/pages/auth/Login"
import RestaurantSignup from "@/module/restaurant/pages/auth/Signup"
import RestaurantOTP from "@/module/restaurant/pages/auth/OTP"
import RestaurantPanelRouter from "@/module/restaurant/panel/components/RestaurantPanelRouter"
import DeliveryLogin from "@/module/delivery/pages/auth/Login"
import DeliverySignup from "@/module/delivery/pages/auth/Signup"
import DeliveryOTP from "@/module/delivery/pages/auth/OTP"
import EditProfilePage from "@/module/restaurant/pages/EditProfilePage"
import AdvertisementsPage from "@/module/restaurant/pages/AdvertisementsPage"
import AdDetailsPage from "@/module/restaurant/pages/AdDetailsPage"
import NewAdvertisementPage from "@/module/restaurant/pages/NewAdvertisementPage"
import EditAdvertisementPage from "@/module/restaurant/pages/EditAdvertisementPage"
import CouponListPage from "@/module/restaurant/pages/CouponListPage"
import AddCouponPage from "@/module/restaurant/pages/AddCouponPage"
import EditCouponPage from "@/module/restaurant/pages/EditCouponPage"
import ReviewsPage from "@/module/restaurant/pages/ReviewsPage"
import UpdateReplyPage from "@/module/restaurant/pages/UpdateReplyPage"
import SettingsPage from "@/module/restaurant/pages/SettingsPage"
import PrivacyPolicyPage from "@/module/restaurant/pages/PrivacyPolicyPage"
import TermsAndConditionsPage from "@/module/restaurant/pages/TermsAndConditionsPage"
import RestaurantConfigPage from "@/module/restaurant/pages/RestaurantConfigPage"
import RestaurantCategoriesPage from "@/module/restaurant/pages/RestaurantCategoriesPage"
import BusinessPlanPage from "@/module/restaurant/pages/BusinessPlanPage"
import ConversationListPage from "@/module/restaurant/pages/ConversationListPage"
import ChatDetailPage from "@/module/restaurant/pages/ChatDetailPage"
import DeliveryHome from "@/module/delivery/pages/DeliveryHome"
import MyOrders from "@/module/delivery/pages/MyOrders"
import OrderRequestPage from "@/module/delivery/pages/OrderRequestPage"
import ProfilePage from "@/module/delivery/pages/ProfilePage"
import AcceptedOrderDetails from "@/module/delivery/pages/AcceptedOrderDetails"
import MyAccount from "@/module/delivery/pages/MyAccount"
import TransactionHistory from "@/module/delivery/pages/TransactionHistory"
import EditProfile from "@/module/delivery/pages/EditProfile"
import Settings from "@/module/delivery/pages/Settings"
import Conversation from "@/module/delivery/pages/Conversation"
import TermsAndConditions from "@/module/delivery/pages/TermsAndConditions"
import PrivacyPolicy from "@/module/delivery/pages/PrivacyPolicy"
import Notifications from "@/module/delivery/pages/Notifications"
import AdminRouter from "@/module/admin/components/AdminRouter"

export default function App() {
  return (
    <Routes>
      {/* Specific routes that should be matched before UserRouter */}
      <Route path="/routes" element={<Home />} />
      <Route path="/user" element={<Navigate to="/" replace />} />
      <Route path="/user/*" element={<UserRouter />} />
      <Route path="/restaurant/auth/sign-in" element={<RestaurantSignIn />} />
      <Route path="/restaurant/login" element={<RestaurantLogin />} />
      <Route path="/restaurant/signup" element={<RestaurantSignup />} />
      <Route path="/restaurant/otp" element={<RestaurantOTP />} />
      <Route path="/restaurant-panel/*" element={<RestaurantPanelRouter />} />
      <Route path="/usermain" element={<HomePage />} />
      <Route path="/usermain/categories" element={<CategoriesPage />} />
      <Route path="/usermain/category/:categoryName" element={<CategoryFoodsPage />} />
      <Route path="/usermain/food/:id" element={<FoodDetailPage />} />
      <Route path="/usermain/cart" element={<CartPage />} />
      <Route path="/usermain/checkout" element={<CheckoutPage />} />
      <Route path="/usermain/payment" element={<PaymentPage />} />
      <Route path="/usermain/orders" element={<OrdersPage />} />
      <Route path="/usermain/orders/:orderId" element={<OrderDetailsPage />} />
      <Route path="/usermain/wishlist" element={<WishlistPage />} />
      <Route path="/restaurant" element={<Navigate to="/restaurant-panel/dashboard" replace />} />
      <Route path="/restaurant/notifications" element={<RestaurantNotifications />} />
      <Route path="/restaurant/orders" element={<RestaurantOrdersPage />} />
      <Route path="/restaurant/orders/all" element={<AllOrdersPage />} />
      <Route path="/restaurant/orders/:orderId" element={<OrderDetails />} />
      <Route path="/restaurant/details" element={<RestaurantDetailsPage />} />
      <Route path="/restaurant/edit" element={<EditRestaurantPage />} />
      <Route path="/restaurant/food/all" element={<AllFoodPage />} />
      <Route path="/restaurant/food/:id" element={<FoodDetailsPage />} />
      <Route path="/restaurant/food/:id/edit" element={<EditFoodPage />} />
      <Route path="/restaurant/food/new" element={<EditFoodPage />} />
      <Route path="/restaurant/wallet" element={<WalletPage />} />
      <Route path="/restaurant/profile/edit" element={<EditProfilePage />} />
      <Route path="/restaurant/advertisements" element={<AdvertisementsPage />} />
      <Route path="/restaurant/advertisements/new" element={<NewAdvertisementPage />} />
      <Route path="/restaurant/advertisements/:id" element={<AdDetailsPage />} />
      <Route path="/restaurant/advertisements/:id/edit" element={<EditAdvertisementPage />} />
      <Route path="/restaurant/coupon" element={<CouponListPage />} />
      <Route path="/restaurant/coupon/new" element={<AddCouponPage />} />
      <Route path="/restaurant/coupon/:id/edit" element={<EditCouponPage />} />
      <Route path="/restaurant/reviews" element={<ReviewsPage />} />
      <Route path="/restaurant/reviews/:id/reply" element={<UpdateReplyPage />} />
      <Route path="/restaurant/settings" element={<SettingsPage />} />
      <Route path="/restaurant/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/restaurant/terms" element={<TermsAndConditionsPage />} />
      <Route path="/restaurant/config" element={<RestaurantConfigPage />} />
      <Route path="/restaurant/categories" element={<RestaurantCategoriesPage />} />
      <Route path="/restaurant/business-plan" element={<BusinessPlanPage />} />
      <Route path="/restaurant/conversation" element={<ConversationListPage />} />
      <Route path="/restaurant/conversation/:conversationId" element={<ChatDetailPage />} />
      <Route path="/delivery" element={<DeliveryHome />} />
      <Route path="/delivery/login" element={<DeliveryLogin />} />
      <Route path="/delivery/signup" element={<DeliverySignup />} />
      <Route path="/delivery/otp" element={<DeliveryOTP />} />
      <Route path="/delivery/notifications" element={<Notifications />} />
      <Route path="/delivery/orders" element={<MyOrders />} />
      <Route path="/delivery/requests" element={<OrderRequestPage />} />
      <Route path="/delivery/profile" element={<ProfilePage />} />
      <Route path="/delivery/order/:orderId" element={<AcceptedOrderDetails />} />
      <Route path="/delivery/account" element={<MyAccount />} />
      <Route path="/delivery/transactions" element={<TransactionHistory />} />
      <Route path="/delivery/profile/edit" element={<EditProfile />} />
      <Route path="/delivery/profile/settings" element={<Settings />} />
      <Route path="/delivery/profile/conversation" element={<Conversation />} />
      <Route path="/delivery/profile/terms" element={<TermsAndConditions />} />
      <Route path="/delivery/profile/privacy" element={<PrivacyPolicy />} />
      <Route path="/admin" element={<Navigate to="/admin/" replace />} />
      <Route path="/admin/*" element={<AdminRouter />} />
      
      {/* Catch-all route - UserRouter handles all other routes including root */}
      <Route path="/*" element={<UserRouter />} />
    </Routes>
  )
}