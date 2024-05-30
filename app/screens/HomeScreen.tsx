import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid } from 'react-native';
import React, {useState, useEffect} from 'react';
import BluetoothManager from '../lib/BluetoothManager';
import {checkPermissionsOnLoad} from "../lib/Permissions";

export default function HomeScreen() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

   const initializePermissions = async () => {
      const permissionsStatus = await checkPermissionsOnLoad();
      console.log('Permissions status', permissionsStatus);
    };

  const requestPermissions = async () => {
    await initializePermissions();
    await BluetoothManager.requestPermissions();
  };

  const startScan = () => {
    setDevices([]);
    console.log('start scan');
    BluetoothManager.scanForDevices((device) => {
      console.log(device);
      setDevices((prevDevices) => ([
        ...prevDevices,
        device,
      ]));
      // setDevices((prevDevices) => {
      //   // if (!prevDevices.some(d => d.id === device.id)) {
      //   //   return [...prevDevices, device];
      //   // }
      //   return prevDevices;
      // });
    });
  };

  const stopScan = () => {
    setDevices([]);
    BluetoothManager.stopScan();
  };

   const connectToDevice = async (device) => {
    console.log(device);
    try {
      const connectedDevice = await BluetoothManager.connectToDevice(device.id);
      setConnectedDevice(connectedDevice);
      console.log('Connected to', connectedDevice.name);
    } catch (error) {
      console.warn('Connection error', error);
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      await BluetoothManager.disconnectFromDevice(connectedDevice.id);
      setConnectedDevice(null);
      console.log('Disconnected');
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);



  return (
   <View>
      <Button title="Start Scan" onPress={startScan} />
      <Button title="Stop Scan" onPress={stopScan} />
      {connectedDevice ? (
        <View>
          <Text>Connected to: {connectedDevice.name}</Text>
          <Button title="Disconnect" onPress={disconnectFromDevice} />
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => connectToDevice(item)} style={{
              backgroundColor:"lightgray",
              borderRadius:10,
              padding:10,
              marginBottom: 12
            }}>
              <Text>{item.name || 'Unnamed device'}</Text>
              <Text>{item.id}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
