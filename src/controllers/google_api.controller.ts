import axios from 'axios';
import dotenv from 'dotenv';
import { Request, ResponseToolkit } from '@hapi/hapi';

dotenv.config();

const API_KEY = process.env.API_KEY;

export const getDistance = async (source,destination): Promise<any> => {

    // const { source, destination } = <any>request.payload;
    const options = {
        method: 'POST',
        url: 'https://distanceto.p.rapidapi.com/distance/route',
        params: { car: 'true' },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'b9caf1cca2msh9228a609241864fp18a502jsne626318a2d92',
            'X-RapidAPI-Host': 'distanceto.p.rapidapi.com',
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
        },
    };

    try {
        const response = await axios.request(options);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
















    // const { origin, destination } = <any>request.payload;

    // const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${API_KEY}`;

    // try {
    //     const response = await axios.get(apiUrl);
    //     const data = response.data;
    //     return h.response(data).code(200);
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    //     throw error;
    // }
};
