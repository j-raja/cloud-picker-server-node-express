import express from 'express';
import axios, { AxiosResponse } from 'axios';

const app = express();
const PORT = 80;

export interface Cloud {
    description: string,
    name: string,
    latitude: number,
    longitude: number,
    region: string,
    provider: string
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

app.get("/clouds", async (req: Request, res: any): Promise<Response> => {
    let result: AxiosResponse = await axios.get(`https://api.aiven.io/v1/clouds`);
    let clouds = convertResults(result.data.clouds);
    return res.status(200).send({
        clouds
    })
});

app.listen(PORT, () => {
    console.log(PORT);
    console.log(`Server is running here https://localhost:${PORT}`);
});

// Transform the API data before sending
function convertResults(clouds: [{ name: string; cloud_description: any; cloud_name: any; geo_latitude: any; geo_longitude: any; geo_region: any; }]): Cloud[] {
    let outputdata: Cloud[] = [];
    clouds.forEach((result) => {
        const provider = result.cloud_name.split("-")[0];
        const cloud: Cloud = {
            description: result.cloud_description,
            name: result.cloud_name,
            latitude: result.geo_latitude,
            longitude: result.geo_longitude,
            region: result.geo_region,
            provider: provider
        }
        outputdata.push(cloud);
    });
    return outputdata;
}

