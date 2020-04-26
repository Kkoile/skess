export interface Player {
    id: string;
    name: string;
    socketId?: string;
    activeParties?: Array<{partyId: string, socketId: string}>;
}