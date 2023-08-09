import axios from 'axios';
import dotenv from 'dotenv';
import { Request, ResponseToolkit } from '@hapi/hapi';

dotenv.config();

const API_KEY = process.env.API_KEY;

export const getDistance = async (request: Request, h: ResponseToolkit): Promise<any> => {
    const { origin, destination } = <any>request.payload;

    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${API_KEY}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        return h.response(data).code(200);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
