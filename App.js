import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

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

  let unsubscribeFromLocation = null;

  const subscribeToLocation = async () => {

    let { status } = await requestForegroundPermissionsAsync();
    setPermissionsGranted(status === 'granted');

    if (unsubscribeFromLocation) {
      unsubscribeFromLocation();
    }

    unsubscribeFromLocation =  await watchPositionAsync({}, location => {
      console.log('received update:', location);
      setLocation(location);
      setMapRegion({
        ...mapRegion,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    })
  }

  useEffect(() => {
    subscribeToLocation();
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