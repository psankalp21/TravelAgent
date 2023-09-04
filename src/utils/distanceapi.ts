import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();
const KEY = process.env.API_KEY;

export async function distance_api(source: string, destination: string) {
    const options = {
        method: 'POST',
        url: 'https://distanceto.p.rapidapi.com/distance/route',
        params: { car: 'true' },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': KEY,
            'X-RapidAPI-Host': 'distanceto.p.rapidapi.com'
        },
        data: {
            route: [
                {
                    country: 'IN',
                    name: source,
                },
                {
                    country: 'IN',
                    name: destination,
                },
            ],
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
    
    const response = await axios.request(options);
    const data_res = response.data.route.car;
    const distance = parseFloat(data_res.distance).toFixed(1);
    const durationInSeconds = parseFloat(data_res.duration);
    const duration = (durationInSeconds / 3600).toFixed(1);
    return ({ distance: distance, duration: duration })
}