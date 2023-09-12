import { fuel_api } from "./fuelapi";


export async function fare_estimator(source_state: string, distance: number, fuel_type, categoryAverage: number) {
    const response = await fuel_api(source_state)
    const petrol_cost = response.data.fuel.petrol.retailPrice
    const diesel_cost = response.data.fuel.diesel.retailPrice
    const petrol_fare = (distance / categoryAverage) * petrol_cost
    const diesel_fare = (distance / categoryAverage) * diesel_cost

    if (fuel_type == "petrol")
        return (petrol_fare)
    else if (fuel_type == "diesel")
        return (diesel_fare)
    else if (fuel_type == null)
        return ({ Petrol_Vehicle: petrol_fare.toFixed(0),Diesel_Vehicle: diesel_fare.toFixed(0) })
}