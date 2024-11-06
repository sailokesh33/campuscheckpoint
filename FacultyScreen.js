import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';  // Import QRCode library

export default function FacultyScreen() {
  const [qrValue, setQrValue] = useState('');  // Store the QR code value

  // Example function to generate a unique QR code for the student
  const handleCreateQRCode = () => {
    // For example, creating a unique ID or URL for attendance
    const uniqueId = 'attendance-check-12345';  // You can generate dynamic IDs
    setQrValue(uniqueId);  // Set the QR code value
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, Faculty!</Text>

      {/* Button to generate the QR code */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleCreateQRCode}
      >
        <Text style={styles.buttonText}>Create QR Code</Text>
      </TouchableOpacity>

      {/* Display the generated QR code */}
      {qrValue ? (
        <View style={styles.qrCodeContainer}>
          <QRCode 
            value={qrValue}  // The value to encode in the QR code (unique ID)
            size={200}        // Adjust size as needed
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  qrCodeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
