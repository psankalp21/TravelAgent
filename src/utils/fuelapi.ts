const axios = require('axios');
import dotenv from 'dotenv';
dotenv.config();
const KEY = process.env.API_KEY;

export async function fuel_api(source_state: string) {

    const options = {
        method: 'GET',
        url: `https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1/fuel-prices/today/india/${source_state}`,
        headers: {
            'X-RapidAPI-Key': KEY,
            'X-RapidAPI-Host': 'daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response
    } catch (error) {
        console.error(error);
    }
}