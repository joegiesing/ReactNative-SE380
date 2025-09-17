import { useState, useCallback } from 'react';

export interface CurrentWeatherData {
  location: {
    name: string;
    region: string;
  };
  current: {
    tempF: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

export interface ForecastDay {
  date: string;
  day: {
    condition: {
      text: string;
      icon: string;
    };
    maxTempF: number;
    minTempF: number;
  };
}

export interface ForecastWeatherData {
  location: {
    name: string;
    region: string;
  };
  forecast: {
    forecastDay: ForecastDay[];
  };
}

interface UseWeatherApiResult {
  data: CurrentWeatherData | ForecastWeatherData | null;
  loading: boolean;
  error: string | null;
  fetchCurrentWeather: (location: string) => Promise<void>;
  fetchForecastWeather: (location: string, days: number) => Promise<void>;
}

const API_KEY = 'a56c5d07d1574ec7ab954554251609';
const BASE_URL = 'https://api.weatherapi.com/v1';

const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const mapResponseToCurrentWeatherData = (response: any): CurrentWeatherData => {
  const { current, location } = response.data;
  return {
    location: {
      name: location.name,
      region: location.region,
    },
    current: {
      tempF: Math.round(current.temp_f),
      condition: {
        text: current.condition.text,
        icon: `https:${current.condition.icon}`,
      },
    },
  };
};

const mapResponseToForecastWeatherData = (response: any): ForecastWeatherData => {
  const { forecast, location } = response.data;
  return {
    location: {
      name: location.name,
      region: location.region,
    },
    forecast: {
      forecastDay: forecast.forecastday.map((forecastDay: any) => ({
        date: getDayOfWeek(forecastDay.date),
        day: {
          condition: {
            text: forecastDay.day.condition.text,
            icon: `https:${forecastDay.day.condition.icon}`,
          },
          maxTempF: Math.round(forecastDay.day.maxtemp_f),
          minTempF: Math.round(forecastDay.day.mintemp_f),
        },
      })),
    },
  };
};

export const useWeatherApi = (): UseWeatherApiResult => {
  const [data, setData] = useState<CurrentWeatherData | ForecastWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentWeather = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${BASE_URL}/current.json?q=${location}&key=${API_KEY}`;
      console.log('Fetching current weather from:', url); // Debug log
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('API Error Response:', errorText); // Debug log
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Current weather API Response:', responseData); // Debug log
      const mappedData = mapResponseToCurrentWeatherData({ data: responseData });
      setData(mappedData);
    } catch (err) {
      console.error('Current weather fetch error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchForecastWeather = useCallback(async (location: string, days: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${BASE_URL}/forecast.json?q=${location}&days=${days}&key=${API_KEY}`;
      console.log('Fetching forecast from:', url); // Debug log
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('API Error Response:', errorText); // Debug log
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Forecast API Response:', responseData); // Debug log
      const mappedData = mapResponseToForecastWeatherData({ data: responseData });
      setData(mappedData);
    } catch (err) {
      console.error('Forecast fetch error:', err); // Debug log
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchCurrentWeather,
    fetchForecastWeather,
  };
};