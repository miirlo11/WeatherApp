import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Dimensions} from 'react-native';
import { getCurrentLocation } from './Location';
import { fetchWeather } from './WeatherAPI';
import { Picker } from '@react-native-picker/picker';


const locations = [
  {
    name: 'Current Location',
    latitude: null,
    longitude: null,
  },
  {
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    name: 'Los Angeles',
    latitude: 34.0522,
    longitude: -118.2437,
  },
  {
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
  },
];



export default function Weather() {
  const [location, setLocation] = useState(locations[0]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);



 
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const coords = location.latitude && location.longitude ? location : await getCurrentLocation();
        setLocation(coords);
        const data = await fetchWeather(coords.latitude, coords.longitude);
        setWeather(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchWeatherData();
  
    // Refresh the weather data every 10 minutes
    const intervalId = setInterval(() => {
      fetchWeatherData();
    }, 10 * 60 * 1000);
  
    // Clean up the interval
    return () => clearInterval(intervalId);
  }, [location]);

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!weather) {
    return <Text>Loading...</Text>;
  }

  const weatherIcon = weather.weather && weather.weather.length > 0
  ? `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`
  : null;


  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/pexels-pixabay-158163.jpg')} style={styles.background}>
        <Picker
          selectedValue={location}
          onValueChange={(value) => setLocation(value)}
          style={styles.picker}
        >
          {locations.map((location, index) => (
            <Picker.Item key={index} label={location.name} value={location} style={styles.pickername} />
          ))}
        </Picker>
      <View style={styles.headerContainer}>
        <Text style={styles.cityName}>{weather.weather.name}</Text>
        <Text style={styles.temperature}>{Math.round(weather.weather.main.temp)}°C</Text>
        <Image source={{ uri: weatherIcon }} style={styles.weatherIcon} />
        <Text style={styles.description}>{weather.weather.weather[0].description}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Feels like</Text>
          <Text style={styles.detailValue}>{Math.round(weather.weather.main.feels_like)}°C</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Min temperature</Text>
          <Text style={styles.detailValue}>{Math.round(weather.weather.main.temp_min)}°C</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Max temperature</Text>
          <Text style={styles.detailValue}>{Math.round(weather.weather.main.temp_max)}°C</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Humidity</Text>
          <Text style={styles.detailValue}>{weather.weather.main.humidity}%</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailTitle}>Wind speed</Text>
          <Text style={styles.detailValue}>{weather.weather.wind.speed} m/s</Text>
        </View>
      </View>
      </ImageBackground>
    </View>
  );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      backgroundColor: '#8FBABF',
    },
    background: {
      flex: 1,
      resizeMode: 'cover',
      width: '100%',
    },
    headerContainer: {
      alignItems: 'center',
      marginTop: 200,
      marginBottom: 50,
    },
    cityName: {
      fontSize: 32,
      marginBottom: 3,
      color: '#FFFFFF',
    },
    temperature: {
      fontSize: 48,
      color: '#FFFFFF',
    },
    weatherIcon: {},
    description: {
      fontSize: 20,
      marginTop: 16,
      textTransform: 'capitalize',
      color: '#FFFFFF',
    },
    detailsContainer: {
        padding: 16,
        width: '50%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        marginTop: -24,
        backgroundColor: '#03738C80',
        alignItems: 'center',
        alignSelf: 'center',
      },
    detail: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    
    },
    detailTitle: {
      fontSize: 20,
      flex: 1,
      color: '#FFFFFF',
    },
    detailValue: {
      fontSize: 20,
      flex: 1,
      textAlign: 'right',
      color: '#FFFFFF',
    },
    picker: {
        color: '#FFFFFF',
        marginTop: 20,
    },
    pickername: {
        fontSize:20,
    }
    
  });