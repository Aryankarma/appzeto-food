import { useState } from "react"
import { Bell, Info } from "lucide-react"

const adminNotifications = [
  {
    id: 1,
    topic: "Forget Password",
    description: "Choose How Admin Will Get Notified About Sent Notification On Forget Password.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 2,
    topic: "Deliveryman Self Registration",
    description: "Choose How Admin Will Get Notified About Sent Notification On Deliveryman Self Registration.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 3,
    topic: "Restaurant Self Registration",
    description: "Choose How Admin Will Get Notified About Sent Notification On Restaurant Self Registration.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 4,
    topic: "Campaign Join Request",
    description: "Choose How Admin Will Get Notified About Sent Notification On Campaign Join Request.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 5,
    topic: "Withdraw Request",
    description: "Choose How Admin Will Get Notified About Sent Notification On Withdraw Request.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 6,
    topic: "Order Refund Request",
    description: "Choose How Admin Will Get Notified About Sent Notification On Order Refund Request.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 7,
    topic: "Advertisement Add",
    description: "Choose How Admin Will Get Notified About Sent Notification On Advertisement Add.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 8,
    topic: "Advertisement Update",
    description: "Choose How Admin Will Get Notified About Sent Notification On Advertisement Update.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  }
]

const restaurantNotifications = [
  {
    id: 1,
    topic: "New Order Received",
    description: "Choose How Restaurant Will Get Notified About New Order Received.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 2,
    topic: "Order Status Update",
    description: "Choose How Restaurant Will Get Notified About Order Status Updates.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 3,
    topic: "Payment Received",
    description: "Choose How Restaurant Will Get Notified About Payment Received.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 4,
    topic: "Review Received",
    description: "Choose How Restaurant Will Get Notified About Customer Reviews.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 5,
    topic: "Withdrawal Request Status",
    description: "Choose How Restaurant Will Get Notified About Withdrawal Request Status.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 6,
    topic: "Campaign Invitation",
    description: "Choose How Restaurant Will Get Notified About Campaign Invitations.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 7,
    topic: "Order Cancelled",
    description: "Choose How Restaurant Will Get Notified About Order Cancellations.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 8,
    topic: "Food Out of Stock",
    description: "Choose How Restaurant Will Get Notified About Food Items Out of Stock.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  }
]

const customerNotifications = [
  {
    id: 1,
    topic: "Order Confirmation",
    description: "Choose How Customer Will Get Notified About Order Confirmation.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 2,
    topic: "Order Status Update",
    description: "Choose How Customer Will Get Notified About Order Status Updates.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 3,
    topic: "Order Delivered",
    description: "Choose How Customer Will Get Notified About Order Delivery.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 4,
    topic: "Order Cancelled",
    description: "Choose How Customer Will Get Notified About Order Cancellation.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 5,
    topic: "Payment Confirmation",
    description: "Choose How Customer Will Get Notified About Payment Confirmation.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 6,
    topic: "Promotional Offers",
    description: "Choose How Customer Will Get Notified About Promotional Offers.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 7,
    topic: "Refund Processed",
    description: "Choose How Customer Will Get Notified About Refund Processing.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 8,
    topic: "Wallet Transaction",
    description: "Choose How Customer Will Get Notified About Wallet Transactions.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  }
]

const deliverymanNotifications = [
  {
    id: 1,
    topic: "New Order Assignment",
    description: "Choose How Deliveryman Will Get Notified About New Order Assignment.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 2,
    topic: "Order Pickup Request",
    description: "Choose How Deliveryman Will Get Notified About Order Pickup Requests.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 3,
    topic: "Order Delivery Status",
    description: "Choose How Deliveryman Will Get Notified About Order Delivery Status.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 4,
    topic: "Payment Received",
    description: "Choose How Deliveryman Will Get Notified About Payment Received.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 5,
    topic: "Bonus Notification",
    description: "Choose How Deliveryman Will Get Notified About Bonus Notifications.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 6,
    topic: "Incentive Update",
    description: "Choose How Deliveryman Will Get Notified About Incentive Updates.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  },
  {
    id: 7,
    topic: "Shift Reminder",
    description: "Choose How Deliveryman Will Get Notified About Shift Reminders.",
    pushNotification: "N/A",
    mail: true,
    sms: true
  },
  {
    id: 8,
    topic: "Withdrawal Status",
    description: "Choose How Deliveryman Will Get Notified About Withdrawal Status.",
    pushNotification: "N/A",
    mail: true,
    sms: false
  }
]

const tabs = [
  { id: "admin", label: "Admin" },
  { id: "restaurant", label: "Restaurant" },
  { id: "customers", label: "Customers" },
  { id: "deliveryman", label: "Deliveryman" }
]

function ToggleSwitch({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center w-11 h-6 rounded-full border transition-all ${
        enabled
          ? "bg-blue-600 border-blue-600 justify-end"
          : "bg-slate-200 border-slate-300 justify-start"
      }`}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
    </button>
  )
}

export default function NotificationChannels() {
  const [activeTab, setActiveTab] = useState("admin")
  
  const getNotificationsForTab = (tab) => {
    switch(tab) {
      case "admin":
        return adminNotifications
      case "restaurant":
        return restaurantNotifications
      case "customers":
        return customerNotifications
      case "deliveryman":
        return deliverymanNotifications
      default:
        return adminNotifications
    }
  }

  const [notifications, setNotifications] = useState(() => getNotificationsForTab("admin"))

  // Update notifications when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setNotifications(getNotificationsForTab(tabId))
  }

  const handleMailToggle = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, mail: !notif.mail } : notif
    ))
  }

  const handleSMSToggle = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, sms: !notif.sms } : notif
    ))
  }

  return (
    <div className="p-2 lg:p-3 bg-slate-50 min-h-screen">
      <div className="w-full mx-auto max-w-6xl">
        {/* Page Title */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <Bell className="w-3.5 h-3.5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">Notification Channels Setup</h1>
          </div>
          <p className="text-xs text-slate-600 ml-9">
            From here you setup who can see what types of notification from StackFood
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-2 mb-3">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    SI
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Topics
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Push Notification
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Mail
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    SMS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {notifications.map((notification, index) => (
                  <tr key={notification.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-700">{index + 1}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div>
                        <p className="text-xs font-medium text-slate-900 mb-1">
                          {notification.topic}
                        </p>
                        <p className="text-[10px] text-slate-600">
                          {notification.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        className="px-2 py-1 text-[10px] font-medium bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                      >
                        {notification.pushNotification}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <ToggleSwitch
                        enabled={notification.mail}
                        onToggle={() => handleMailToggle(notification.id)}
                      />
                    </td>
                    <td className="px-3 py-3">
                      {notification.sms !== false ? (
                        <ToggleSwitch
                          enabled={notification.sms}
                          onToggle={() => handleSMSToggle(notification.id)}
                        />
                      ) : (
                        <button
                          type="button"
                          className="px-2 py-1 text-[10px] font-medium bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                        >
                          N/A
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
