import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react'; // useEffect invoked when component is loaded
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from './components/UnitsPicker'
import ReloadIcon from './components/ReloadIcon'
import WeatherDetails from './components/WeatherDetails'
import {colors} from './utils/index'
 
const WEATHER_API_KEY = '25eb89767412207d8b5ca8bd82f60d71'
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'
 
export default function App() {
 const [errorMessage, setErrorMessage] = useState(null)
 const [currentWeather, setCurrentWeather] = useState(null)
 const [unitsSystem, setUnitsSystem] = useState('imperial') // 'metric' for celsius
 useEffect(() =>{ // cannot write async, hook limitaion.
   load();
 }, [unitsSystem]) // empty callback
 async function load() {
   setCurrentWeather(null)
   setErrorMessage(null)
   try {
     let { status } = await Location.requestPermissionsAsync(); // give info to application
    
     if(status !== 'granted') {
       setErrorMessage('Access to location is needed to run the app');
       return
     }
     const location = await Location.getCurrentPositionAsync()
 
     const {latitude, longitude} = location.coords;
 
     const weatherURL = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}`
    
     const response = await fetch(weatherURL) // makes request
 
     const result = await response.json()
 
     if(response.ok) {
       setCurrentWeather(result)
     }  else {
       setErrorMessage(result.message)
     }
 
   } catch (error) {
     setErrorMessage(error.message)
   }
 }
 
 if(currentWeather) {
 
   return (
     <View style={styles.container}>
       <StatusBar style="auto" />
       <View style={styles.main} >
           <UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem}/>
           <ReloadIcon load={load}/>
           <WeatherInfo currentWeather={currentWeather}/>
       </View>
       <WeatherDetails currentWeather={currentWeather} unitsSystem={unitsSystem}/>
     </View>
   )} else if (errorMessage) {
 return (
   <View style={styles.container}>
     <ReloadIcon load={load}/>
     <Text style={{textAlign: 'center'}}> {errorMessage} </Text>
     <StatusBar style="auto" />
   </View>
 )} else {
   return (
     <View style={styles.container}>
       <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
       <StatusBar style="auto" />
   </View>
   )
 }
}
 
const styles = StyleSheet.create({
 container: {
   flex: 1, // everything expands
   //alignItems: 'center',
   justifyContent: 'center',
 },
 main: {
   justifyContent: 'center',
   flex: 1
 }
});
