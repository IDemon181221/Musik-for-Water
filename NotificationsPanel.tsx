import React from 'react';
import { useGame } from '../context/GameContext';

const NotificationsPanel: React.FC = () => {
  const { state, dismissNotification } = useGame();

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'danger':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      default:
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠️';
      case 'danger': return '🔴';
      default: return 'ℹ️';
    }
  };

  if (state.notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {state.notifications.slice(0, 5).map(notification => (
        <div
          key={notification.id}
          className={`
            p-4 rounded-lg border backdrop-blur-sm animate-slideIn
            ${getNotificationStyle(notification.type)}
          `}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">{getIcon(notification.type)}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              <p className="text-xs opacity-80 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(notification.id)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPanel;
