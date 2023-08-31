import axios from "axios";

export async function distance_api(source: string, destination: string) {
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
    const response = await axios.request(options);
    const data_res = response.data.route.car;
    const distance = parseFloat(data_res.distance).toFixed(1);
    const durationInSeconds = parseFloat(data_res.duration);
    const duration = (durationInSeconds / 3600).toFixed(1);

    return({distance:distance,duration:duration})
}