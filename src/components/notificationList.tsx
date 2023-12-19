import React, { useEffect } from 'react';
import { List } from 'antd';
import { formatDate } from '../utils/dateFormat';
import { Link } from 'react-router-dom';
import { fetchNotifications } from '../api/notificationService';

interface Notification {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: string;
  message: string;
  payload: string;
  addedAt: string;
}

interface NotificationsProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  user: any;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  setNotifications,
  user,
}) => {
  useEffect(() => {
    if (notifications.length > 6) return;
    fetchNotifications({
      limit: 5,
      lastId: notifications[notifications.length - 1]?.id,
    }).then((newNotifications) =>
      setNotifications([...notifications, ...newNotifications]),
    );
  }, []);
  return (
    <div
      style={{
        maxHeight: '400px',
        overflow: 'auto',
        width: '400px',
        border: '1px solid #f0f0f0',
        borderRadius: '4px',
        padding: '16px',
        backgroundColor: '#fff',
      }}
      onScroll={(e: any) => {
        const bottom =
          e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (!bottom) return;

        fetchNotifications({
          lastId: notifications[notifications.length - 1].id,
          limit: 5,
        }).then((newNotifications) =>
          setNotifications([...notifications, ...newNotifications]),
        );
      }}
    >
      <List
        style={{
          width: '100%',
          height: '100%',
        }}
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item: Notification) => (
          <List.Item>
            <Link
              to={`/equipments/${JSON.parse(item.payload).id}`}
              style={{ width: '100%', display: 'flex', alignItems: 'center' }}
            >
              <List.Item.Meta
                title={item.message}
                description={`${formatDate(item.addedAt)}`}
              />
              <div
                style={{
                  backgroundColor:
                    new Date(item.createdAt) >
                    new Date(user.lastReadNotificationAt)
                      ? '#1677fe'
                      : '#fff',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                }}
              />
            </Link>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Notifications;
