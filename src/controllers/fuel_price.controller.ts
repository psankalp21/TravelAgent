import axios from 'axios';
import { Request, ResponseToolkit } from '@hapi/hapi';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.RAPID_API_KEY;

export const getFuelPrices = async (request: Request, h: ResponseToolkit): Promise<any> => {
    const options = {
        method: 'GET',
        url: 'https://daily-fuel-prices-update-india.p.rapidapi.com/car/v2/fuel/cities',
        headers: {
            src: 'android-app',
            appVersion: '1.0',
            deviceId: 'abcs',
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'daily-fuel-prices-update-india.p.rapidapi.com'
        }
    };
    
    try {
        const response = await axios.request(options);
        const data = response.data;
        return h.response(data).code(200);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
