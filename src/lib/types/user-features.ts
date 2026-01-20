/**
 * Device information for tracking
 */
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown';
  browser: 'chrome' | 'safari' | 'firefox' | 'edge' | 'other';
}

/**
 * Compact device info for event payloads
 */
export interface DeviceInfoCompact {
  device_type: string;
  device_os: string;
}

/**
 * Convert device info to compact format for event tracking
 */
export function toCompactDeviceInfo(device: DeviceInfo): DeviceInfoCompact {
  return {
    device_type: device.type,
    device_os: device.os,
  };
}
