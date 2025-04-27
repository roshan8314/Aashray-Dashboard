// src/utils/notifications.ts

export interface Notification {
    id: string;
    message: string;
    timestamp: number;
  }
  
  let _subscribers: ((msgs: Notification[]) => void)[] = [];
  let _notifications: Notification[] = [];
  
  /**
   * Subscribe to notification list changes.
   * The callback is immediately called with the current list,
   * and then again whenever it changes.
   * Returns an unsubscribe function.
   */
  export function subscribeNotifications(fn: (msgs: Notification[]) => void) {
    _subscribers.push(fn);
    fn(_notifications);
    return () => {
      _subscribers = _subscribers.filter(s => s !== fn);
    };
  }
  
  /** Internal: broadcast the current list to all subscribers */
  function _broadcast() {
    _subscribers.forEach(fn => fn(_notifications));
  }
  
  /** Add a new notification message */
  export function addNotification(message: string) {
    const note: Notification = {
      id: Date.now().toString(),
      message,
      timestamp: Date.now()
    };
    _notifications = [note, ..._notifications];
    _broadcast();
  }
  
  /** Get the current list (read-only) */
  export function getNotifications(): Notification[] {
    return _notifications;
  }
  
  /** Clear all notifications */
  export function clearNotifications() {
    _notifications = [];
    _broadcast();
  }
  