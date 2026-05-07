import { AVAILABLE_NOW_LABEL, OCCUPIED_LABEL } from "@/constants";
import {  Room } from "./webflow"


export const getAvailabilityDate = (room: Room): string => {
    const available = room.fieldData.available
    const availableFrom = room.fieldData["available-from"]
    if (available) {
        if (availableFrom) {
            const availDate = new Date(availableFrom);
            const now = new Date();

            if (!isNaN(availDate.getTime()) && availDate > now) {
                const day = availDate.getDate();
                const month = availDate.toLocaleString('default', { month: 'short' });
                return `Available from ${month} ${day}`;
            }
        }
        return AVAILABLE_NOW_LABEL;
    } else {
        return OCCUPIED_LABEL;
    }
}

export const getAvailabilityDateForProperty = (rooms: Room[]): string => {
    if (rooms.length === 0) return OCCUPIED_LABEL;

    const now = new Date();
    const availableRooms = rooms.filter((room) => room.fieldData.available);

    if (availableRooms.length === 0) return OCCUPIED_LABEL;

    const immediateAvailability = availableRooms.some((room) => {
        const availableFrom = room.fieldData["available-from"];
        if (!availableFrom) return true;

        const parsedDate = new Date(availableFrom);
        return Number.isNaN(parsedDate.getTime()) || parsedDate <= now;
    });

    if (immediateAvailability) return AVAILABLE_NOW_LABEL;

    let closestFutureDate: Date | null = null;

    availableRooms.forEach((room) => {
        const availableFrom = room.fieldData["available-from"];
        if (!availableFrom) return;

        const parsedDate = new Date(availableFrom);
        if (Number.isNaN(parsedDate.getTime()) || parsedDate <= now) return;

        if (!closestFutureDate || parsedDate < closestFutureDate) {
            closestFutureDate = parsedDate;
        }
    });

    if (!closestFutureDate) return AVAILABLE_NOW_LABEL;

    const day = closestFutureDate.getDate();
    const month = closestFutureDate.toLocaleString('default', { month: 'short' });
    return `Available from ${month} ${day}`;
}