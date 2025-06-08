import { useEffect, useState } from "react";
import axios from "axios";
import Logo from "../assets/Acc_GT_Dimensional_RGB 1.png";
import "./Notifications.css";

export function Notifications({ userId, visible }) {
  const [notifications, setNotifications] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  const fetchNotifications = () => {
    if (!userId) return;
    axios
      .get(`/notifications/${userId}`)
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
        console.error("Error fetching notifications", err);
      });
  };

  const handleDelete = async (idnotificacion) => {
    setDeletingId(idnotificacion);
    
    setTimeout(async () => {
      try {
        await axios.delete(`https://pathexplorer-backend.onrender.com/api/notifications/${idnotificacion}`);
        setNotifications((prev) =>
          prev.filter((n) => n.idnotificacion !== idnotificacion)
        );
      } catch (err) {
        console.error("Error deleting notification", err);
      } finally {
        setDeletingId(null);
      }
    }, 200);
  };

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`https://pathexplorer-backend.onrender.com/api/notifications/${userId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setNotifications(res.data);
        } else {
          console.error("Unexpected response format", res.data);
          setNotifications([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching notifications", err);
        setNotifications([]);
      });
  }, [userId]);

  if (!visible) return null;

  return (
    <div className={`notifications-panel ${visible ? 'visible' : 'hidden'}`}>
      <h6 className="notifications-title">
        Notifications
      </h6>
      
      {notifications.length === 0 ? (
        <div className="notifications-empty-state">
          <div className="notifications-empty-icon">
            🔔
          </div>
          <p className="notifications-empty-text">
            No notifications available
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notif, index) => (
            <div
              key={notif.idnotificacion}
              className={`notification-item ${deletingId === notif.idnotificacion ? 'deleting' : ''}`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="notification-content">
                <img
                  src={Logo}
                  alt="Avatar"
                  className="notification-avatar"
                />
                <div className="notification-text">
                  <p className="notification-title">
                    {notif.titulo}
                  </p>
                  <p className="notification-message">
                    {notif.mensaje}
                  </p>
                  <p className="notification-date">
                    {notif.fecha}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(notif.idnotificacion)}
                className="delete-button"
                title="Eliminar notificación"
                disabled={deletingId === notif.idnotificacion}
              >
                {deletingId === notif.idnotificacion ? '⏳' : '×'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
