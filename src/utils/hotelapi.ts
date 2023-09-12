import axios, { AxiosRequestConfig } from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const KEY = process.env.HOTEL_API_KEY;

class findHotels {
    async fetchData(city:string) {
        const options: AxiosRequestConfig = {
            method: 'GET',
            url: 'https://best-booking-com-hotel.p.rapidapi.com/booking/best-accommodation',
            params: {
                cityName: city,
                countryName: 'India'
            },
            headers: {
                'X-RapidAPI-Key': KEY,
                'X-RapidAPI-Host': 'best-booking-com-hotel.p.rapidapi.com'
            }
        };
            const response = await axios.request(options);
            console.log(response.data);
            return response.data
    }

}
export const hotel = new findHotels();


