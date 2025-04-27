// src/components/NotificationBell.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import {
  subscribeNotifications,
  getNotifications,
  clearNotifications,
  Notification
} from '../utils/notifications';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Notification[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Subscribe once on mount
  useEffect(() => {
    const unsub = subscribeNotifications(setNotes);
    return unsub;
  }, []);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(o => !o)} className="relative p-2">
        <Bell size={24} className="text-white" />
        {notes.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {notes.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50"
        >
          <div className="px-4 py-2 font-medium border-b">Activity</div>
          <div className="max-h-48 overflow-y-auto">
            {notes.length > 0 ? (
              notes.map(n => (
                <div
                  key={n.id}
                  className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div>{n.message}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(n.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No activity</div>
            )}
          </div>
          {notes.length > 0 && (
            <button
              onClick={() => clearNotifications()}
              className="w-full px-4 py-2 text-left text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
