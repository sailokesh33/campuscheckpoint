import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Are you a Student or Faculty?</Text>

      {/* Button for Student */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Student')}  // Navigate to Student Screen
      >
        <Text style={styles.buttonText}>Student</Text>
      </TouchableOpacity>

      {/* Button for Faculty */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate('Faculty')}  // Navigate to Faculty Screen
      >
        <Text style={styles.buttonText}>Faculty</Text>
      </TouchableOpacity>
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
});
