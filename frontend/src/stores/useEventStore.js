import { create } from 'zustand';

const useEventStore = create((set) => ({
    events: [],
    setEvents: (events) => set({ events }),
    addEvent: (event) => set((state) => ({
        events: [...state.events, event]
    })),
    updateEvents: (newEvent) => set((state) => ({
        events: [...state.events, newEvent]
    })),
}));

export default useEventStore;