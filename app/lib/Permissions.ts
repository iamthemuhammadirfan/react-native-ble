import { check, PERMISSIONS, RESULTS, PermissionStatus } from 'react-native-permissions';
import { Platform } from 'react-native';

const checkPermissionsOnLoad = async (): Promise<Record<string, PermissionStatus>> => {
  const permissionsToCheck = Platform.select({
    android: [
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    ],
    ios: [
      PERMISSIONS.IOS.BLUETOOTH,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ],
  });

  const results: Record<string, PermissionStatus> = {};

  if (permissionsToCheck) {
    for (const permission of permissionsToCheck) {
      const result = await check(permission);
      results[permission] = result;
    }
  }

  return results;
};

export  {checkPermissionsOnLoad}
