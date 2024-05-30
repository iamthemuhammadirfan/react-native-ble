import { BleManager, Device } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

class BluetoothManager {
  private manager: BleManager;

  constructor() {
    this.manager = new BleManager();
  }

  async requestPermissions(): Promise<void> {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      const allGranted = Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (!allGranted) {
        throw new Error("All required permissions not granted");
      }
    } else if (Platform.OS === "ios") {
      const bluetoothPermission = await check(PERMISSIONS.IOS.BLUETOOTH);
      if (bluetoothPermission !== RESULTS.GRANTED) {
        await request(PERMISSIONS.IOS.BLUETOOTH);
      }

      const locationPermission = await check(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      if (locationPermission !== RESULTS.GRANTED) {
        await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }
    }
  }

  scanForDevices(callback: (device: Device) => void): void {
    console.log("enterted");
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn(error);
        return;
      }
      if (device) {
    // console.log("device", device);
        callback(device);
      }
    });
  }

  stopScan(): void {
    this.manager.stopDeviceScan();
  }

  async connectToDevice(deviceId: string): Promise<Device | null> {
    try {
      const device = await this.manager.connectToDevice(deviceId);
      return device;
    } catch (error) {
      console.warn("Connection error", error);
      return null;
    }
  }

  async disconnectFromDevice(deviceId: string): Promise<void> {
    try {
      await this.manager.cancelDeviceConnection(deviceId);
    } catch (error) {
      console.warn("Disconnection error", error);
    }
  }
}

export default new BluetoothManager();
