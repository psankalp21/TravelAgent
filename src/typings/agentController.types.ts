export interface DriverPayload {
    name: string;
    dob: string;
    email: string;
    phone: string;
    available: boolean;
}

export interface TaxiPayload {
    id: string;
    model: string;
    category: string;
    capacity: number;
    fuel_type: string;
}

export interface ToggleDriverPayload {
    driver_id: number;
}

export interface ToggleTaxiPayload {
    taxi_id: string;
}

export interface AgentBookingPayload {
    booking_id: number;
    driver_id: number;
}

export interface AgentCategoryPayload {
    categoryName: string;
    categoryRate: number;
}

export interface RemoveCategoryQuery {
    categoryName: string;
}

export interface UpdateCategoryRatePayload {
    categoryName: string;
    new_categoryRate: number;
}

export interface GetCategoryRateQuery {
    categoryName: string;
}
