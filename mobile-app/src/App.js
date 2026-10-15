/**
 * Steak Probe Mobile App
 * React Native BLE Temperature Monitor
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

// BLE UUIDs
const TEMP_SERVICE_UUID = '1809'; // Health Thermometer Service
const TEMP_CHAR_UUID = '2A1C'; // Temperature Measurement

const App = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [targetTemp, setTargetTemp] = useState(145); // Medium-rare default

  useEffect(() => {
    // Initialize BLE
    BleManager.start({ showAlert: false });

    // Request permissions on Android
    if (Platform.OS === 'android') {
      requestPermissions();
    }

    // Setup listeners
    const listeners = [
      BleManager.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral),
      BleManager.addListener('BleManagerStopScan', handleStopScan),
      BleManager.addListener('BleManagerDisconnectPeripheral', handleDisconnect),
    ];

    return () => {
      listeners.forEach(listener => listener.remove());
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      
      if (Object.values(granted).some(g => g !== PermissionsAndroid.RESULTS.GRANTED)) {
        Alert.alert('Permissions Required', 'BLE permissions are required to scan for devices.');
      }
    } else if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission Required', 'Location permission is required for BLE scanning.');
      }
    }
  };

  const startScan = () => {
    setDevices([]);
    setIsScanning(true);
    BleManager.scan([], 10, true)
      .then(() => {
        console.log('Scanning started...');
      })
      .catch(error => {
        console.error('Scan error:', error);
        setIsScanning(false);
      });
  };

  const handleDiscoverPeripheral = (peripheral) => {
    console.log('Discovered:', peripheral);
    
    // Only show SteakProbe devices
    if (peripheral.name && peripheral.name.includes('SteakProbe')) {
      setDevices(prevDevices => {
        const exists = prevDevices.find(d => d.id === peripheral.id);
        if (!exists) {
          return [...prevDevices, peripheral];
        }
        return prevDevices;
      });
    }
  };

  const handleStopScan = () => {
    console.log('Scan stopped');
    setIsScanning(false);
  };

  const handleDisconnect = (peripheral) => {
    console.log('Disconnected from:', peripheral.peripheral);
    if (connectedDevice && connectedDevice.id === peripheral.peripheral) {
      setConnectedDevice(null);
      setTemperature(null);
    }
  };

  const connectToDevice = async (device) => {
    try {
      await BleManager.connect(device.id);
      console.log('Connected to:', device.name);
      
      // Retrieve services
      const peripheralInfo = await BleManager.retrieveServices(device.id);
      console.log('Services:', peripheralInfo);
      
      setConnectedDevice(device);
      
      // Start notifications for temperature
      await BleManager.startNotification(device.id, TEMP_SERVICE_UUID, TEMP_CHAR_UUID);
      
      // Setup notification handler
      BleManager.addListener('BleManagerDidUpdateValueForCharacteristic', handleTemperatureUpdate);
      
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Connection Failed', 'Could not connect to device.');
    }
  };

  const disconnect = async () => {
    if (connectedDevice) {
      try {
        await BleManager.disconnect(connectedDevice.id);
        setConnectedDevice(null);
        setTemperature(null);
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }
  };

  const handleTemperatureUpdate = (data) => {
    // Temperature is sent as uint32 * 100 (e.g., 13500 = 135.00°F)
    const tempRaw = data.value[0] | (data.value[1] << 8) | (data.value[2] << 16) | (data.value[3] << 24);
    const tempF = tempRaw / 100.0;
    
    setTemperature(tempF);
    
    // Alert if target temp reached
    if (tempF >= targetTemp && tempF < targetTemp + 2) {
      Alert.alert('Target Temperature Reached!', `${tempF.toFixed(1)}°F`);
    }
  };

  const renderDevice = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceCard}
      onPress={() => connectToDevice(item)}
    >
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
      <Text style={styles.connectButton}>Connect</Text>
    </TouchableOpacity>
  );

  const getTempColor = (temp) => {
    if (!temp) return '#999';
    if (temp < 120) return '#4A90E2'; // Blue - rare
    if (temp < 130) return '#E24A4A'; // Red - medium-rare
    if (temp < 140) return '#E27A4A'; // Orange - medium
    if (temp < 150) return '#E2A24A'; // Yellow - medium-well
    return '#666'; // Gray - well done
  };

  const getTempLabel = (temp) => {
    if (!temp) return 'Waiting...';
    if (temp < 120) return 'RARE';
    if (temp < 130) return 'MEDIUM-RARE';
    if (temp < 140) return 'MEDIUM';
    if (temp < 150) return 'MEDIUM-WELL';
    return 'WELL DONE';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🥩 Steak Probe</Text>
      </View>

      {!connectedDevice ? (
        <View style={styles.scanSection}>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonActive]}
            onPress={startScan}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? 'Scanning...' : 'Scan for Probes'}
            </Text>
          </TouchableOpacity>

          <FlatList
            data={devices}
            renderItem={renderDevice}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {isScanning ? 'Looking for probes...' : 'No probes found. Tap scan to start.'}
              </Text>
            }
          />
        </View>
      ) : (
        <View style={styles.connectedSection}>
          <View style={styles.deviceInfo}>
            <Text style={styles.connectedLabel}>Connected to:</Text>
            <Text style={styles.connectedName}>{connectedDevice.name}</Text>
          </View>

          <View style={[styles.tempDisplay, { borderColor: getTempColor(temperature) }]}>
            <Text style={[styles.tempValue, { color: getTempColor(temperature) }]}>
              {temperature ? `${temperature.toFixed(1)}°F` : '--.-°F'}
            </Text>
            <Text style={styles.tempLabel}>{getTempLabel(temperature)}</Text>
          </View>

          <View style={styles.targetSection}>
            <Text style={styles.targetLabel}>Target: {targetTemp}°F</Text>
            <View style={styles.targetButtons}>
              <TouchableOpacity onPress={() => setTargetTemp(125)} style={styles.targetButton}>
                <Text>RARE 125°F</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTargetTemp(135)} style={styles.targetButton}>
                <Text>MED-RARE 135°F</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTargetTemp(145)} style={styles.targetButton}>
                <Text>MEDIUM 145°F</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.disconnectButton} onPress={disconnect}>
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  scanSection: {
    flex: 1,
    padding: 20,
  },
  scanButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButtonActive: {
    backgroundColor: '#666',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceCard: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceId: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
  },
  connectButton: {
    color: '#4A90E2',
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  connectedSection: {
    flex: 1,
    padding: 20,
  },
  deviceInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  connectedLabel: {
    color: '#999',
    fontSize: 14,
  },
  connectedName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  tempDisplay: {
    borderWidth: 5,
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  tempValue: {
    fontSize: 72,
    fontWeight: 'bold',
  },
  tempLabel: {
    fontSize: 24,
    color: '#999',
    marginTop: 10,
  },
  targetSection: {
    marginBottom: 30,
  },
  targetLabel: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  targetButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  targetButton: {
    backgroundColor: '#2a2a2a',
    padding: 10,
    borderRadius: 8,
  },
  disconnectButton: {
    backgroundColor: '#E24A4A',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
