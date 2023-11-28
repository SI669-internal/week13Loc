import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GOOGLE_API_KEY } from './Secrets';

import { 
  requestForegroundPermissionsAsync,
  watchPositionAsync 
} from 'expo-location';

export default function App() {
  const initRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  const [ location, setLocation ] = useState(null);
  const [ permissionsGranted, setPermissionsGranted ] = useState(false);
  const [ mapRegion, setMapRegion ] = useState(initRegion);
  const [ places, setPlaces ] = useState([]);

  let unsubscribeFromLocation = null;

  const subscribeToLocation = async () => {

    let { status } = await requestForegroundPermissionsAsync();
    setPermissionsGranted(status === 'granted');

    if (unsubscribeFromLocation) {
      unsubscribeFromLocation();
    }

    unsubscribeFromLocation = await watchPositionAsync({}, location => {
      //console.log('received update:', location);
      setLocation(location);
      setMapRegion({
        ...mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    })
  }

  const searchLocations = async () => {
    let placesURI = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
    placesURI += 'location=' + location.coords.latitude;
    placesURI += '%2C' + location.coords.longitude;
    placesURI += '&type=restaurant';    
    //placesURI += '&keyword=indian';    
    placesURI += '&radius=5000';
    placesURI += '&key=' + GOOGLE_API_KEY;

    console.log(placesURI);
    let response = await fetch(placesURI);
    //console.log('r:', response);
    let results = await response.json();

    let newPlaces = [];
    for (let r of results.results) {
      let newPlace = {};
      newPlace.latitude = r.geometry.location.lat;
      newPlace.longitude = r.geometry.location.lng;
      newPlace.name = r.name;
      newPlace.id = r.place_id;
      newPlaces.push(newPlace);
    }
    console.log('places:', newPlaces);
    setPlaces(newPlaces);
  }


  useEffect(() => {
    subscribeToLocation();
    return(()=>{
      if (unsubscribeFromLocation) {
        unsubscribeFromLocation();
      }
    })
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        {permissionsGranted ?
          location ?
            `lat: ${location.coords.latitude} \n` + 
            `lon: ${location.coords.longitude}`
          :
            "Waiting..."
        :
          "Location permission granted."
        }

      </Text>
      <MapView 
        style={styles.map} 
        provider={PROVIDER_GOOGLE}
        region={mapRegion}  
        showsUserLocation={true}
      >
        {places.map(place => {
          console.log('hey');
          return (
            <Marker
              key={place.id}
              coordinate={{latitude: place.latitude, longitude: place.longitude}}
              title={place.name}
            />
          )
        })}
      </MapView> 
      <Button
        title="Search for Restaurants"
        onPress={searchLocations}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 24
  },
  map: {
    flex: 0.5,
    width: '100%',
    height: '100%'
  }
})