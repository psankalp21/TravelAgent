
export interface AddBookingPayload {
    source_city: string;
    source_state: string;
    destination_city: string;
    destination_state: string;
    taxi_id: string;
    date_time: string;
}

export interface CheckFareQuery {
    source_city: string;
    source_state: string;
    destination_city: string;
    destination_state: string;
    categoryName: string;
}

export interface CancelBookingPayload {
    booking_id: number;
}

export interface ViewOneBookingQuery {
    booking_id: number;
}

export interface StartJourneyPayload {
    booking_id: number;
    otp: string;
}

export interface EndJourneyPayload {
    booking_id: number;
}

export interface GetTaxiQuery {
    capacity?: number;
    category?: string;
    fuel_type: string;
    date_time: string;
}

export interface reviewPayload
{
    booking_id:number;
    driver_rating:number;
    taxi_rating:number;
    journey_rating:number;
    comment?:string;
}

export interface updatePayload
{
    booking_id:number;
    driver_rating:number;
    taxi_rating:number;
    journey_rating:number;
    comment?:string;
}