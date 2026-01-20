/**
 * Device detection for native app routing
 */

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown';
  browser: 'chrome' | 'safari' | 'firefox' | 'edge' | 'other';
}

/**
 * Extract device information from the browser
 */
export function extractDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return { type: 'desktop', os: 'unknown', browser: 'other' };
  }

  const ua = navigator.userAgent.toLowerCase();

  // Detect device type
  let type: DeviceInfo['type'] = 'desktop';
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    type = 'mobile';
  } else if (/ipad|tablet|playbook|silk/i.test(ua)) {
    type = 'tablet';
  }

  // Detect OS
  let os: DeviceInfo['os'] = 'unknown';
  if (/iphone|ipad|ipod/i.test(ua)) {
    os = 'ios';
  } else if (/android/i.test(ua)) {
    os = 'android';
  } else if (/mac/i.test(ua)) {
    os = 'macos';
  } else if (/win/i.test(ua)) {
    os = 'windows';
  } else if (/linux/i.test(ua)) {
    os = 'linux';
  }

  // Detect browser
  let browser: DeviceInfo['browser'] = 'other';
  if (/chrome/i.test(ua) && !/edge/i.test(ua)) {
    browser = 'chrome';
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = 'safari';
  } else if (/firefox/i.test(ua)) {
    browser = 'firefox';
  } else if (/edge/i.test(ua)) {
    browser = 'edge';
  }

  return { type, os, browser };
}

/**
 * Check if user can run native Mac apps
 */
export function canRunMacApps(): boolean {
  const device = extractDeviceInfo();
  return device.os === 'macos';
}
