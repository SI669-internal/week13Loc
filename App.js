import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import { 
  requestForegroundPermissionsAsync,
  watchPositionAsync 
} from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [ permissionsGranted, setPermissionsGranted ] = useState(false);

  let unsubscribeFromLocation = null;

  const subscribeToLocation = async () => {

    let { status } = await requestForegroundPermissionsAsync();
    setPermissionsGranted(status === 'granted');

    if (unsubscribeFromLocation) {
      unsubscribeFromLocation();
    }

    unsubscribeFromLocation = watchPositionAsync({}, location => {
      console.log('received update:', location);
      setLocation(location);
    })
  }

  useEffect(() => {
    subscribeToLocation();
  }, []);

  console.log(PROVIDER_GOOGLE);
 
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
      <MapView style={styles.map} provider={PROVIDER_GOOGLE}/> 
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