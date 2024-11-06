import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';  // QR Code Scanner
import * as ImagePicker from 'expo-image-picker';  // Camera for taking photo
import * as Location from 'expo-location';  // Expo Location API

export default function StudentScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  const targetLocation = {
    latitude: 41.1066,
    longitude: -80.6481
  };

  // Request permissions for the camera and location
  const getPermissionsAsync = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');

    // Request location permission
    const locationStatus = await Location.requestForegroundPermissionsAsync();
    if (locationStatus.status === 'granted') {
      setLocationPermission(true);
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);  // Set current location
    } else {
      Alert.alert('Permission denied', 'You need to allow location access to proceed.');
    }
  };

  // Handle QR code scanning
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQrData(data);  // Store the scanned QR code data
  };

  // Request photo permission and open camera to take a photo
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result.uri);
      }
    } else {
      Alert.alert('Camera permission denied');
    }
  };

  // Function to check if the user is within range of the target location
  const isLocationValid = () => {
    if (!location) return false;
    const { latitude, longitude } = location;

    // Haversine formula to check if location is within a given distance (e.g., 100 meters)
    const toRadians = (degree) => degree * (Math.PI / 180);

    const lat1 = toRadians(targetLocation.latitude);
    const lon1 = toRadians(targetLocation.longitude);
    const lat2 = toRadians(latitude);
    const lon2 = toRadians(longitude);

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance <= 0.1; // Allow if within 100 meters
  };

  // Render the screen based on scan status
  useEffect(() => {
    if (hasPermission === null) {
      getPermissionsAsync();
    }
  }, [hasPermission]);

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned ? (
        // QR Code scanner
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        // After scanning, prompt for name input and take photo
        <View style={styles.formContainer}>
          <Text style={styles.header}>QR Code Scanned!</Text>
          <Text style={styles.label}>Please enter your name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
          
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          {photo && (
            <Image source={{ uri: photo }} style={styles.imagePreview} />
          )}

          {locationPermission ? (
            isLocationValid() ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => Alert.alert('Submitted!', `Name: ${name}\nQR Data: ${qrData}`)}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <Text style={styles.errorText}>You are not at the correct location, but your submission has been recorded.</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => Alert.alert('Submitted!', `Name: ${name}\nQR Data: ${qrData}`)}
                >
                  <Text style={styles.buttonText}>Submit Anyway</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            <Text style={styles.errorText}>Location permission not granted.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
});
