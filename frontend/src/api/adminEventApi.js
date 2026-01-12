// adminEventApi.js

import api from "./axios";

/**
 * Fetch all events for admin management
 */
export const getAllEvents = () => {
    return api.get("/api/admin/events");
};

/**
 * Approve a pending event booking
 */
export const approveEvent = (id) => {
    return api.put(`/api/admin/events/${id}/approve`);
};

/**
 * Cancel an existing event booking
 */
export const cancelEvent = (id) => {
    return api.put(`/api/admin/events/${id}/cancel`);
};

/**
 * Check hall availability (Admin version)
 */
export const getHallAvailability = (params) => {
    return api.get("/api/admin/events/availability/halls", {
        params,
    });
};

// Hall Management
export const createEventHall = (hallData) => {
    return api.post("/api/admin/events/halls", hallData);
};

export const updateEventHall = (id, hallData) => {
    return api.put(`/api/admin/events/halls/${id}`, hallData);
};

export const deleteEventHall = (id) => {
    return api.delete(`/api/admin/events/halls/${id}`);
};

export const getEventHalls = () => {
    return api.get("/api/admin/events/halls");
};
