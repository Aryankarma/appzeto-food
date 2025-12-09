import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

// Order statistics icons (admin assets)
import deliveredIcon from "../assets/Dashboard-icons/image1.png";
import cancelledIcon from "../assets/Dashboard-icons/image2.png";
import refundedIcon from "../assets/Dashboard-icons/image3.png";
import paymentFailedIcon from "../assets/Dashboard-icons/image4.png";
import unassignedIcon from "../assets/Dashboard-icons/image5.png";
import acceptedIcon from "../assets/Dashboard-icons/image6.png";
import cookingIcon from "../assets/Dashboard-icons/image7.png";
import pickedUpIcon from "../assets/Dashboard-icons/image8.png";
import icon9 from "../assets/Dashboard-icons/image9.png";
import icon10 from "../assets/Dashboard-icons/image10.png";
import icon11 from "../assets/Dashboard-icons/image11.png";
import icon12 from "../assets/Dashboard-icons/image12.png";
import icon13 from "../assets/Dashboard-icons/image13.png";
import icon14 from "../assets/Dashboard-icons/image14.png";
import icon15 from "../assets/Dashboard-icons/image15.png";
import icon16 from "../assets/Dashboard-icons/image16.png";
import icon17 from "../assets/Dashboard-icons/image17.png";
import icon18 from "../assets/Dashboard-icons/image18.png";
import icon19 from "../assets/Dashboard-icons/image19.png";
import icon20 from "../assets/Dashboard-icons/image20.png";
import icon21 from "../assets/Dashboard-icons/image21.png";
import icon22 from "../assets/Dashboard-icons/image22.png";
import icon23 from "../assets/Dashboard-icons/image23.png";
import icon24 from "../assets/Dashboard-icons/image24.png";
import icon25 from "../assets/Dashboard-icons/image25.png";
import icon26 from "../assets/Dashboard-icons/image26.png";
import icon27 from "../assets/Dashboard-icons/image27.png";

// Small circle icon for list items
import mostPopularIcon from "../assets/Dashboard-icons/most-popular.png";

// Food photos from src/assets
import food1 from "@/assets/photo-1604382354936-07c5d9983bd3.jpg";
import food2 from "@/assets/mae-mu-PTdm4YUtloY-unsplash.jpg";
import food3 from "@/assets/mae-mu-I7A_pHLcQK8-unsplash.jpg";
import food4 from "@/assets/mae-mu-GIUc-l74UT8-unsplash.jpg";
import food5 from "@/assets/eiliv-aceron-mAQZ3X_8_l0-unsplash.jpg";
import food6 from "@/assets/pixzolo-photography-BiWb1Y8wpZk-unsplash.jpg";

export default function AdminHome() {
  const [selectedZone, setSelectedZone] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("overall");
  const [isLoading, setIsLoading] = useState(false);

  // Simulate data loading when filters change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedZone, selectedPeriod]);

  // Mock data generation based on filters
  const getOrderStats = () => {
    // Simulate different data based on zone and period
    const baseStats = [
      {
        value: 51,
        label: "Delivered orders",
        icon: deliveredIcon,
        bg: "bg-green-50 border-green-200",
      },
      {
        value: 11,
        label: "Canceled orders",
        icon: cancelledIcon,
        bg: "bg-pink-50 border-pink-200",
      },
      {
        value: 0,
        label: "Refunded orders",
        icon: refundedIcon,
        bg: "bg-yellow-50 border-yellow-200",
      },
      {
        value: 1,
        label: "Payment failed orders",
        icon: paymentFailedIcon,
        bg: "bg-red-50 border-red-200",
      },
      {
        value: 79,
        label: "Unassigned Orders",
        icon: unassignedIcon,
        bg: "bg-blue-50 border-blue-200",
      },
      {
        value: 3,
        label: "Accepted By Delivery Man",
        icon: acceptedIcon,
        bg: "bg-purple-50 border-purple-200",
      },
      {
        value: 5,
        label: "Cooking In Restaurant",
        icon: cookingIcon,
        bg: "bg-green-50 border-green-200",
      },
      {
        value: 1,
        label: "Picked Up By Delivery Man",
        icon: pickedUpIcon,
        bg: "bg-yellow-50 border-yellow-200",
      },
    ];

    // Modify values based on selected filters (mock data)
    if (selectedZone !== "all" || selectedPeriod !== "overall") {
      return baseStats.map((stat) => ({
        ...stat,
        value: Math.floor(stat.value * (0.7 + Math.random() * 0.6)), // Random variation
      }));
    }
    return baseStats;
  };

  const orderStats = getOrderStats();

  const mostPopularRestaurants = [
    "Café Monarch",
    "Hungry Puppets",
    "Cheese Burger",
    "Redcliff Cafe",
    "Vintage Kitchen",
    "The Capital Grill",
    "Mini Kebab",
    "Pizza restaurant",
    "Cheesy Restaurant",
    "Tasty Takeaways",
    "The Great Impasta",
    "Italian Fast Food",
  ];

  const topRatedFoods = [
    { name: "Mutton Biriyani", rating: "5.0", reviews: 1, image: food1 },
    { name: "Burger Combo", rating: "5.0", reviews: 1, image: food2 },
    { name: "Veg Momos", rating: "5.0", reviews: 1, image: food3 },
    { name: "Toll House Pie", rating: "5.0", reviews: 1, image: food4 },
    { name: "Meat Pizza", rating: "4.5", reviews: 3, image: food5 },
    { name: "Hazelnut semifreddo", rating: "4.0", reviews: 1, image: food6 },
  ];

  const topSellingFoods = [
    { name: "Medu Vada", sold: 9, image: food2 },
    { name: "Meat Pizza", sold: 6, image: food5 },
    { name: "Hazelnut semifreddo", sold: 3, image: food6 },
    { name: "Grilled lemon herb M...", sold: 3, image: food4 },
    { name: "Burger Combo", sold: 2, image: food1 },
    { name: "Mutton Biriyani", sold: 2, image: food3 },
  ];

  const topDeliveryman = [
    { name: "Esther", orders: 4 },
    { name: "Jane", orders: 4 },
    { name: "Kathryn", orders: 3 },
    { name: "Jhon", orders: 3 },
    { name: "Robert", orders: 2 },
    { name: "Jerome", orders: 2 },
  ];

  const topRestaurants = [
    { name: "Hungry Puppets", orders: 18 },
    { name: "Café Monarch", orders: 8 },
    { name: "Cheese Burger", orders: 2 },
    { name: "Frying Nemo", orders: 2 },
    { name: "The Capital Grill", orders: 2 },
    { name: "Cheesy Restaurant", orders: 1 },
  ];

  // Generate monthly data based on filters
  const getMonthlyData = () => {
    const baseData = [
      { month: "Jan", adminCommission: 0, totalSell: 0, subscription: 0 },
      { month: "Feb", adminCommission: 0, totalSell: 0, subscription: 0 },
      { month: "Mar", adminCommission: 0, totalSell: 0, subscription: 0 },
      { month: "Apr", adminCommission: 0, totalSell: 0, subscription: 0 },
      { month: "May", adminCommission: 0, totalSell: 0, subscription: 0 },
      { month: "Jun", adminCommission: 0, totalSell: 0, subscription: 0 },
      {
        month: "Jul",
        adminCommission: 246.5,
        totalSell: 7993.23,
        subscription: 0,
      },
      { month: "Aug", adminCommission: 0, totalSell: 0, subscription: 0 },
      { month: "Sep", adminCommission: 0, totalSell: 0, subscription: 0 },
      { month: "Oct", adminCommission: 0, totalSell: 0, subscription: 0 },
      { month: "Nov", adminCommission: 0, totalSell: 0, subscription: 0 },
      { month: "Dec", adminCommission: 0, totalSell: 0, subscription: 0 },
    ];

    // Modify data based on filters (mock variation)
    if (selectedZone !== "all" || selectedPeriod !== "overall") {
      return baseData.map((m) => ({
        ...m,
        adminCommission: Math.floor(m.adminCommission * (0.6 + Math.random() * 0.8) * 100) / 100,
        totalSell: Math.floor(m.totalSell * (0.6 + Math.random() * 0.8) * 100) / 100,
        subscription: Math.floor(m.subscription * (0.6 + Math.random() * 0.8) * 100) / 100,
      }));
    }
    return baseData;
  };

  const monthlyData = getMonthlyData();

  return (
    <div className="pt-2 pb-6 px-6 space-y-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-[#8adde7] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-[#6B7280]">Loading...</span>
          </div>
        </div>
      )}
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Welcome, Jhon.</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Hello here you can manage your orders by zone.
          </p>
        </div>
        <div className="relative">
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="px-4 py-2 min-w-[180px] border border-[#E5E7EB] rounded-md text-sm text-[#111827] bg-white">
              <SelectValue placeholder="All zones" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All zones</SelectItem>
              <SelectItem value="zone1">Zone 1</SelectItem>
              <SelectItem value="zone2">Zone 2</SelectItem>
              <SelectItem value="zone3">Zone 3</SelectItem>
              <SelectItem value="zone4">Zone 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Order statistics cards */}
      <Card className="border-[#E5E7EB] shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-semibold text-[#111827]">
              Order statistics
            </CardTitle>
            <span className="inline-block px-3 py-1 rounded-md text-xs font-medium" style={{ color: '#8adde7', backgroundColor: '#d6ffff' }}>
              Zone : {selectedZone === "all" ? "All" : selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}
            </span>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="px-3 py-1.5 border border-[#E5E7EB] rounded-md text-xs bg-white text-[#111827] h-auto">
              <SelectValue placeholder="Overall" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {orderStats.map((item, idx) => (
            <div
              key={idx}
              className={`${item.bg} border rounded-lg px-3 py-3 flex items-center justify-between`}
            >
              <div className="flex flex-col items-start">
                <p className="text-xl font-semibold text-[#111827] leading-none">
                  {item.value}
                </p>
                <p className="mt-1 text-[11px] text-[#6B7280] leading-tight">
                  {item.label}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-6 h-6 object-contain"
                  />
                </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sales Chart */}
      <Card className="border-[#E5E7EB] shadow-sm">
        <CardHeader className="flex items-center justify-between pb-2">
          <div className="flex-1 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
              <img src={icon9} alt="admin commission" className="w-4 h-4 object-contain" />
                <span className="w-3 h-3 rounded-full bg-[#3B82F6]" />
              <span className="text-sm font-medium text-[#111827]">
                Admin commission: $ {monthlyData.reduce((sum, m) => sum + m.adminCommission, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
              <img src={deliveredIcon} alt="total sell" className="w-4 h-4 object-contain" />
                <span className="w-3 h-3 rounded-full bg-[#10B981]" />
              <span className="text-sm font-medium text-[#111827]">Total sell: $ {monthlyData.reduce((sum, m) => sum + m.totalSell, 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex items-center gap-2">
              <img src={acceptedIcon} alt="subscription" className="w-4 h-4 object-contain" />
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="text-sm font-medium text-[#111827]">Subscription: $ {monthlyData.reduce((sum, m) => sum + m.subscription, 0).toFixed(2)}</span>
              </div>
            </div>
          <span className="px-3 py-1 rounded-md text-[11px] font-medium" style={{ color: '#8adde7', backgroundColor: '#d6ffff' }}>
            Zone : {selectedZone === "all" ? "All" : selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}
          </span>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-80 flex flex-col">

            {/* Chart area */}
            <div className="flex-1 flex">
              {/* Y axis labels */}
              <div className="flex flex-col justify-between pr-4 text-[10px] text-[#6B7280]">
                <span>8000.000</span>
                <span>6000.000</span>
                <span>4000.000</span>
                <span>2000.000</span>
                <span>0.000</span>
              </div>

              {/* Bars */}
              <div className="relative flex-1">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="border-t border-dashed border-[#E5E7EB]"
                    />
                  ))}
                </div>

                {/* Bars themselves */}
                <div className="relative h-full flex items-end justify-start gap-1 px-2">
                  {monthlyData.map((m) => {
                    const max = 8000;
                    const adminHeight = (m.adminCommission / max) * 260;
                    const totalHeight = (m.totalSell / max) * 260;
                    const subHeight = (m.subscription / max) * 260;
                    return (
                      <div
                        key={m.month}
                        className="flex flex-col items-center gap-2 flex-shrink-0"
                      >
                        <div className="flex items-end gap-1 h-64">
                          {/* Admin commission bar */}
                          <div
                            className="w-5 rounded-t bg-[#3B82F6]"
                            style={{ height: `${adminHeight}px` }}
                          />
                          {/* Total sell bar */}
                          <div
                            className="w-5 rounded-t bg-[#10B981]"
                            style={{ height: `${totalHeight}px` }}
                          />
                          {/* Subscription bar */}
                          <div
                            className="w-5 rounded-t bg-[#F59E0B]"
                            style={{ height: `${subHeight}px` }}
                          />
                        </div>
                        <span className="text-[11px] text-[#6B7280]">
                          {m.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User statistics + Most popular restaurants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User statistics */}
        <Card className="border-[#E5E7EB] shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={icon9} alt="user statistics" className="w-4 h-4 object-contain" />
            <CardTitle className="text-sm font-semibold text-[#111827]">
              User Statistics
            </CardTitle>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 rounded-md text-[11px] font-medium" style={{ color: '#8adde7', backgroundColor: '#d6ffff' }}>
                  Zone : {selectedZone === "all" ? "All" : selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}
                </span>
                <div className="relative">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="px-3 py-1.5 pr-6 border border-[#E5E7EB] rounded-md text-xs bg-white text-[#111827] h-auto">
                      <SelectValue placeholder="Overall" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overall">Overall</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                {/* Single circle with colored segments based on percentages */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #14B8A6 0deg 61.2deg,
                      #60A5FA 61.2deg 90deg,
                      #F97316 90deg 360deg
                    )`,
                    mask: 'radial-gradient(circle, transparent 50%, black 50%)',
                    WebkitMask: 'radial-gradient(circle, transparent 50%, black 50%)'
                  }}
                />
                {/* Text labels inside segments */}
                {/* Customer - 17% at center of 0-61.2deg segment (~30.6deg) */}
                <div 
                  className="absolute top-1/2 left-1/2 text-[11px] font-bold text-black pointer-events-none"
                  style={{
                    transform: 'translate(-50%, -50%) rotate(30.6deg) translateY(-85px) rotate(-30.6deg)'
                  }}
                >
                  17%
                </div>
                {/* Restaurant - 8% at center of 61.2-90deg segment (~75.6deg) */}
                <div 
                  className="absolute top-1/2 left-1/2 text-[11px] font-bold text-black pointer-events-none"
                  style={{
                    transform: 'translate(-50%, -50%) rotate(75.6deg) translateY(-85px) rotate(-75.6deg)'
                  }}
                >
                  8%
                </div>
                {/* Delivery man - 75% at center of 90-360deg segment (~225deg) */}
                <div 
                  className="absolute top-1/2 left-1/2 text-[11px] font-bold text-black pointer-events-none"
                  style={{
                    transform: 'translate(-50%, -50%) rotate(225deg) translateY(-85px) rotate(-225deg)'
                  }}
                >
                  75%
                </div>
                <div className="absolute inset-[64px] rounded-full bg-white flex flex-col items-center justify-center text-center">
                  <p className="text-xs text-[#6B7280]">Total</p>
                  <p className="text-xl font-semibold text-[#111827]">88</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#14B8A6]" />
                  <span className="text-[#4B5563]">Customer (17.0%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#60A5FA]" />
                  <span className="text-[#4B5563]">Restaurant (8.0%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#F97316]" />
                  <span className="text-[#4B5563]">Delivery man (75.0%)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Most popular restaurants */}
        <Card className="border-[#E5E7EB] shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={mostPopularIcon} alt="most popular" className="w-4 h-4 object-contain" />
              <CardTitle className="text-sm font-semibold text-[#111827]">
                Most Popular Restaurants
              </CardTitle>
              </div>
              <span className="px-3 py-1 rounded-md text-[11px] font-medium" style={{ color: '#8adde7', backgroundColor: '#d6ffff' }}>
                Zone : {selectedZone === "all" ? "All" : selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mostPopularRestaurants.map((name, idx) => {
                // Use specific restaurant icons from Dashboard icons (image10-image21)
                const restaurantIcons = [
                  icon10, icon11, icon12, icon13, icon14, icon15, icon16,
                  icon17, icon18, icon19, icon20, icon21
                ];
                const restaurantIcon = restaurantIcons[idx % restaurantIcons.length];
                return (
                <div
                  key={idx}
                    className="flex items-center justify-between py-2 px-3 border border-[#E5E7EB] rounded-xl bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF7ED] flex items-center justify-center flex-shrink-0">
                      <img
                          src={restaurantIcon}
                          alt={name}
                          className="w-6 h-6 object-contain"
                      />
                    </div>
                    <span className="text-xs font-medium text-[#111827]">
                      {name}
                    </span>
                  </div>
                    <span className="text-xs text-[#EF4444] font-medium">
                    ❤ {idx < 3 ? 7 - idx : 1}
                  </span>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Deliveryman + Top Restaurants (screenshot style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Deliveryman */}
        <Card className="border-[#E5E7EB] shadow-sm">
          <CardHeader className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <img src={pickedUpIcon} alt="top deliveryman" className="w-4 h-4 object-contain" />
            <CardTitle className="text-sm font-semibold text-[#111827]">
              Top Deliveryman
            </CardTitle>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E5F6FF] text-[11px] text-[#0284C7]">
              Zone : {selectedZone === "all" ? "All" : selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topDeliveryman.map((person, idx) => {
                // Use deliveryman icons from Dashboard icons (icon22-27)
                const deliverymanIcons = [icon22, icon23, icon24, icon25, icon26, icon27];
                const deliverymanIcon = deliverymanIcons[idx % deliverymanIcons.length];
                return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-6 flex flex-col items-center shadow-sm"
                >
                  <div className="w-20 h-20 rounded-full bg-[#FFF7ED] border-2 border-[#FDBA74] flex items-center justify-center mb-4 overflow-hidden">
                      <img
                        src={deliverymanIcon}
                        alt={person.name}
                        className="w-12 h-12 object-contain"
                      />
                  </div>
                  <p className="text-sm font-semibold text-[#111827]">
                    {person.name}
                  </p>
                  <p className="text-xs mt-1">
                    <span className="text-[#F97316] font-semibold mr-1">
                      {person.orders}
                    </span>
                    <span className="text-[#6B7280]">Orders</span>
                  </p>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Restaurants */}
        <Card className="border-[#E5E7EB] shadow-sm">
          <CardHeader className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <img src={mostPopularIcon} alt="top restaurants" className="w-4 h-4 object-contain" />
            <CardTitle className="text-sm font-semibold text-[#111827]">
              Top Restaurants
            </CardTitle>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#E5F6FF] text-[11px] text-[#0284C7]">
              Zone : {selectedZone === "all" ? "All" : selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}
            </span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {topRestaurants.map((restaurant, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center">
                      <img
                        src={mostPopularIcon}
                        alt="restaurant icon"
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">
                        {restaurant.name}
                      </p>
                      <p className="text-xs text-[#6B7280] flex items-center gap-1">
                        <span className="text-[#F97316] font-semibold">
                          {restaurant.orders}
                        </span>
                        <span>Orders</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top rated foods + Top selling foods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top rated foods */}
        <Card className="border-[#E5E7EB] shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={cookingIcon} alt="top rated foods" className="w-4 h-4 object-contain" />
              <CardTitle className="text-sm font-semibold text-[#111827]">
                Top Rated Foods
              </CardTitle>
              </div>
              <span className="text-[11px] text-[#9BA6B7]">Zone : {selectedZone === "all" ? "All" : selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {topRatedFoods.map((food, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-[#E5E7EB]">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-[#111827] mb-1 line-clamp-2">
                    {food.name}
                  </p>
                  <p className="text-[10px] text-[#F59E0B] mb-0.5">
                    ★ {food.rating}
                  </p>
                  <p className="text-[10px] text-[#9BA6B7]">
                    {food.reviews} Reviews
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top selling foods */}
        <Card className="border-[#E5E7EB] shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={deliveredIcon} alt="top selling foods" className="w-4 h-4 object-contain" />
              <CardTitle className="text-sm font-semibold text-[#111827]">
                Top Selling Foods
              </CardTitle>
              </div>
              <span className="text-[11px] text-[#9BA6B7]">Zone : {selectedZone === "all" ? "All" : selectedZone.charAt(0).toUpperCase() + selectedZone.slice(1)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {topSellingFoods.map((food, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-[#E5E7EB]">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-[#111827] mb-1 line-clamp-2">
                    {food.name}
                  </p>
                  <p className="text-[10px] text-[#9BA6B7]">
                    Sold: {food.sold}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-[#E5E7EB] text-[11px] text-[#6B7280]">
        <p>© Appzeto Food. Copyright 2025</p>
        <div className="flex flex-wrap items-center gap-4">
          <span>Business setup</span>
          <span>Profile</span>
          <span>Dashboard</span>
          <span>Software Version 8.6</span>
        </div>
      </div>
    </div>
  );
}
