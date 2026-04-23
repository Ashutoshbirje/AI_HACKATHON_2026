import { useState, useEffect } from "react";
import "./TopBar.css";

function TopBar({ toggleSidebar, notifications = [], clearNotifications }) {
  const [showPanel, setShowPanel] = useState(false);
  const [readMap, setReadMap] = useState({});

  const notifList = [
    {
      id: 0,
      text: "Welcome to SmartHire AI",
      time: "Now",
    },
    ...notifications,
  ];

  const unreadCount = notifList.filter((n) => !readMap[n.id]).length;

  const togglePanel = () => {
    setShowPanel((prev) => !prev);
  };

  const markAsRead = (id) => {
    setReadMap((prev) => ({ ...prev, [id]: true }));
  };

  // 🔥 Auto open when new notification comes
  useEffect(() => {
    if (notifications.length > 0) {
      setShowPanel(true);
    }
  }, [notifications]);

  return (
    <header className="topbar">
      {/* Sidebar */}
      <div className="topbar-hamburger" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="topbar-actions">
        <div className="notification-wrapper">
          <button
            className="topbar-icon-btn notification-btn"
            onClick={togglePanel}
          >
            🔔

            {showPanel ? (
              <span className="notif-close">✖</span>
            ) : (
              unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )
            )}
          </button>

          {showPanel && (
            <div className="notification-panel">
              <div className="panel-header">
                <span>Notifications</span>

                {/* ✅ FIXED */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotifications();
                  }}
                >
                  Clear All
                </button>
              </div>

              <div className="panel-body">
                {notifList.length === 0 ? (
                  <p className="empty">No notifications</p>
                ) : (
                  notifList.map((notif) => {
                    const isRead = readMap[notif.id];

                    return (
                      <div
                        key={notif.id}
                        className={`notif-card ${
                          isRead ? "read" : "unread"
                        }`}
                      >
                        <div className="notif-header">
                          <span className="notif-time">
                            {notif.time || "Now"}
                          </span>

                          {!isRead && (
                            <button
                              onClick={() => markAsRead(notif.id)}
                              className="mark-read-btn"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>

                        <div className="notif-message">
                          {notif.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <button className="topbar-icon-btn profile-btn">👤</button>
      </div>
    </header>
  );
}

export default TopBar;