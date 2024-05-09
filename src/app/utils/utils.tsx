export const getColorByTemperature = (temperature: number) => {
    if (temperature >= 90) {
        return '#cd3c3ceb';
    } else if (temperature >= 86) {
        return '#e9751ceb';
    } else if(temperature > 0) {
        return '#6ea318d9';
    } else {
        return '#0056b3';
    }
};

export const getWeather = async (city: string, date: string) => {
    const apiKey = import.meta.env.VITE_WEATHER_VISUAL_CROSSING_API_KEY;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${date}?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.days[0].temp;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
};