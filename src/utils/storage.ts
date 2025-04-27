import { Guest, Stay, Room } from '../types';

// LocalStorage keys
const GUESTS_KEY = 'hotel-aashray-guests';
const STAYS_KEY = 'hotel-aashray-stays';
const ROOMS_KEY = 'hotel-aashray-rooms';

// Guest methods
export const getGuests = (): Guest[] => {
  const guestsJSON = localStorage.getItem(GUESTS_KEY);
  return guestsJSON ? JSON.parse(guestsJSON) : [];
};

export const saveGuest = (guest: Guest): void => {
  const guests = getGuests();
  const existingIndex = guests.findIndex(g => g.id === guest.id);
  
  if (existingIndex >= 0) {
    guests[existingIndex] = guest;
  } else {
    guests.push(guest);
  }
  
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
};

export const deleteGuest = (id: string): void => {
  const guests = getGuests().filter(guest => guest.id !== id);
  localStorage.setItem(GUESTS_KEY, JSON.stringify(guests));
};

export const getGuestById = (id: string): Guest | undefined => {
  return getGuests().find(guest => guest.id === id);
};

// Stay methods
export const getStays = (): Stay[] => {
  const staysJSON = localStorage.getItem(STAYS_KEY);
  return staysJSON ? JSON.parse(staysJSON) : [];
};

export const saveStay = (stay: Stay): void => {
  const stays = getStays();
  const existingIndex = stays.findIndex(s => s.id === stay.id);
  
  if (existingIndex >= 0) {
    stays[existingIndex] = stay;
  } else {
    stays.push(stay);
  }
  
  localStorage.setItem(STAYS_KEY, JSON.stringify(stays));
};

export const deleteStay = (id: string): void => {
  const stays = getStays().filter(stay => stay.id !== id);
  localStorage.setItem(STAYS_KEY, JSON.stringify(stays));
};

export const getStayById = (id: string): Stay | undefined => {
  return getStays().find(stay => stay.id === id);
};

export const getActiveStays = (): Stay[] => {
  return getStays().filter(stay => stay.status === 'Active');
};

export const getCompletedStays = (): Stay[] => {
  return getStays().filter(stay => stay.status === 'Completed');
};

// Room methods
export const getRooms = (): Room[] => {
  const roomsJSON = localStorage.getItem(ROOMS_KEY);
  
  if (!roomsJSON) {
    // Initialize with some default rooms if none exist
    const defaultRooms: Room[] = [
      { roomNumber: '101', type: 'Double', status: 'Available' },
      { roomNumber: '102', type: 'Double', status: 'Available' },
      { roomNumber: '103', type: 'Double', status: 'Available' },
      { roomNumber: '104', type: 'Double', status: 'Available' },
      { roomNumber: '105', type: 'Double', status: 'Available' },
      { roomNumber: '106', type: 'Double', status: 'Available' },
      { roomNumber: '107', type: 'Double', status: 'Available' },
      { roomNumber: '108', type: 'Double', status: 'Available' },
    ];
    
    localStorage.setItem(ROOMS_KEY, JSON.stringify(defaultRooms));
    return defaultRooms;
  }
  
  return JSON.parse(roomsJSON);
};

export const saveRoom = (room: Room): void => {
  const rooms = getRooms();
  const existingIndex = rooms.findIndex(r => r.roomNumber === room.roomNumber);
  
  if (existingIndex >= 0) {
    rooms[existingIndex] = room;
  } else {
    rooms.push(room);
  }
  
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

export const getAvailableRooms = (): Room[] => {
  return getRooms().filter(room => room.status === 'Available');
};

export const updateRoomStatus = (roomNumber: string, status: Room['status']): void => {
  const rooms = getRooms();
  const room = rooms.find(r => r.roomNumber === roomNumber);
  
  if (room) {
    room.status = status;
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};