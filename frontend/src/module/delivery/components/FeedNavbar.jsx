// @FeedNavbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HelpCircle, ArrowRight, Phone } from "lucide-react";
import { toast } from "sonner";

const LS_KEY = "app:isOnline";
const TOAST_ID_KEY = "feedNavbar-onlineStatus";

/** Minimal bottom-sheet popup (self-contained) */
function BottomPopup({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  closeOnBackdropClick = true,
  maxHeight = "70vh",
}) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end"
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full bg-white rounded-t-2xl shadow-xl p-4"
        style={{ maxHeight, overflow: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded-md"
            >
              Close
            </button>
          )}
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export default function FeedNavbar({ className = "" }) {
  const navigate = useNavigate();

  // 1) Init from localStorage (no toast on mount)
  const [isOnline, setIsOnline] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) === true : false;
    } catch {
      return false;
    }
  });

  // 2) Persist to localStorage whenever it changes and notify other components
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(isOnline));
      // Dispatch custom event for same-tab sync (storage event only works across tabs)
      window.dispatchEvent(new CustomEvent('onlineStatusChanged'));
    } catch {}
  }, [isOnline]);

  // 3) Optional: sync across tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY && e.newValue != null) {
        const next = JSON.parse(e.newValue) === true;
        setIsOnline((prev) => (prev === next ? prev : next));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // prevent duplicate toasts using a global toast ID
  const showSingleToast = (isNowOnline) => {
    // Dismiss any existing toast with the same ID first
    toast.dismiss(TOAST_ID_KEY);
    
    // Show new toast with a consistent ID to prevent duplicates and offset position
    if (isNowOnline) {
      toast.success("You are now online", { 
        id: TOAST_ID_KEY,
        style: { marginTop: '80px' }
      });
    } else {
      toast("You are now offline", { 
        id: TOAST_ID_KEY,
        style: { marginTop: '80px' }
      });
    }
  };

  const handleProfileClick = () => navigate("/delivery/profile");

  const handleToggle = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    setIsOnline((prev) => {
      const next = !prev;
      showSingleToast(next);
      return next;
    });
  };

  // Inline options (same visuals as before)
  const helpOptions = [
    { id: "helpCenter", title: "Help Center", subtitle: "Browse common questions", icon: "helpCenter", onClick: () => toast("Opening Help Center…") },
    { id: "ticket", title: "Raise a Ticket", subtitle: "Report a problem", icon: "ticket", onClick: () => toast("Ticket flow…") },
    { id: "idCard", title: "Account & KYC", subtitle: "Manage your documents", icon: "idCard", onClick: () => toast("Account & KYC…") },
    { id: "language", title: "Language", subtitle: "Change app language", icon: "language", onClick: () => toast("Language settings…") },
  ];

  const emergencyOptions = [
    { id: "ambulance", title: "Medical Emergency", subtitle: "Call an ambulance", icon: "ambulance", onClick: () => toast("Dialing medical emergency…") },
    { id: "siren", title: "Emergency Call", subtitle: "Contact support hotline", icon: "siren", onClick: () => toast("Calling support hotline…") },
    { id: "police", title: "Contact Police", subtitle: "Nearest police support", icon: "police", onClick: () => toast("Contacting police…") },
    { id: "insurance", title: "Insurance", subtitle: "Policy & claim help", icon: "insurance", onClick: () => toast("Opening insurance help…") },
  ];

  const [showEmergencyPopup, setShowEmergencyPopup] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);

  return (
    <>
    <div className={`bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200 ${className}`}>
        {/* Online/Offline Toggle */}
      <div className="relative" style={{ zIndex: 100 }}>
        <button
          onClick={handleToggle}
          onTouchStart={(e) => e.stopPropagation()}
          className="focus:outline-none relative cursor-pointer"
          type="button"
          role="switch"
            aria-checked={isOnline}
            style={{ pointerEvents: "auto", zIndex: 100, WebkitTapHighlightColor: "transparent" }}
          >
            <div className={`relative w-20 h-8 rounded-full transition-colors duration-300 ${isOnline ? "bg-green-500" : "bg-gray-400"}`}>
            <span
              className={`text-[11px] font-bold text-white absolute top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 ${
                  isOnline ? "left-2" : "right-2"
              }`}
              style={{ opacity: 1, zIndex: 2, pointerEvents: "none" }}
            >
                {isOnline ? "Online" : "Offline"}
            </span>

            <motion.div
              className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                animate={{ x: isOnline ? 48 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ pointerEvents: "none", zIndex: 10 }}
            />
          </div>
        </button>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-3">
        {/* Emergency */}
        <button
            onClick={() => setShowEmergencyPopup(true)}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-red-600 transition-colors relative"
            title="Emergency"
        >
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </button>

        {/* Help */}
        <button
            onClick={() => setShowHelpPopup(true)}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
            title="Help"
        >
          <HelpCircle className="w-5 h-5 text-gray-700" />
        </button>

        {/* Profile */}
          <button onClick={handleProfileClick} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-gray-300" title="Profile">
          <img
            src="https://i.pravatar.cc/80?img=12"
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
                e.currentTarget.src = "https://ui-avatars.com/api/?name=User&background=ff8100&color=fff&size=40";
            }}
          />
        </button>
      </div>
    </div>

      {/* Help Popup */}
      <BottomPopup
        isOpen={showHelpPopup}
        onClose={() => setShowHelpPopup(false)}
        title="How can we help?"
        showCloseButton={true}
        closeOnBackdropClick={true}
        maxHeight="70vh"
      >
        <div className="py-2">
          {helpOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                option.onClick?.();
                setShowHelpPopup(false);
              }}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                {option.icon === "helpCenter" && <HelpCircle className="w-6 h-6 text-gray-700" />}
                {option.icon === "ticket" && (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                )}
                {option.icon === "idCard" && (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                )}
                {option.icon === "language" && (
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                )}
              </div>

              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.subtitle}</p>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 shrink-0" />
            </button>
          ))}
        </div>
      </BottomPopup>

      {/* Emergency Popup */}
      <BottomPopup
        isOpen={showEmergencyPopup}
        onClose={() => setShowEmergencyPopup(false)}
        title="Emergency help"
        showCloseButton={true}
        closeOnBackdropClick={true}
        maxHeight="70vh"
      >
        <div className="py-2">
          {emergencyOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                option.onClick?.();
                setShowEmergencyPopup(false);
              }}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center">
                {option.icon === "ambulance" && (
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500"></div>
                    <div className="absolute top-1 left-2 w-2 h-3 bg-red-500 rounded-sm"></div>
                    <div className="absolute top-1 right-2 w-2 h-3 bg-blue-500 rounded-sm"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zm0 2.18l8 4v7.64l-8 4-8-4V8.18l8-4z" />
                        <path d="M12 8L6 11v6l6 3 6-3v-6l-6-3z" />
                      </svg>
                    </div>
                    <div className="absolute bottom-1 left-0 right-0 text-[6px] font-bold text-white text-center">AMBULANCE</div>
                  </div>
                )}
                {option.icon === "siren" && (
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200 relative">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 border-2 border-yellow-400 rounded-full animate-pulse"></div>
                      </div>
                      <Phone className="w-5 h-5 text-yellow-400 z-10" />
                    </div>
                  </div>
                )}
                {option.icon === "police" && (
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-amber-700 rounded-t-lg"></div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-amber-800"></div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-2 bg-gray-800 rounded-full"></div>
                    </div>
                  </div>
                )}
                {option.icon === "insurance" && (
                  <div className="w-14 h-14 bg-yellow-400 rounded-lg flex items-center justify-center shadow-sm border border-gray-200 relative">
                    <div className="w-12 h-8 bg-white rounded-sm relative">
                      <div className="absolute left-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <div className="w-0.5 h-3 bg-red-500"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-600">{option.subtitle}</p>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </BottomPopup>
    </>
  );
}
