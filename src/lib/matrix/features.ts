import { Persona, Goal } from '../types';
import {
  UserFeatures,
  DeviceInfo,
  TimeContext,
  AcquisitionContext,
} from '../types/user-features';

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
 * Extract time context
 */
export function extractTimeContext(): TimeContext {
  const now = new Date();
  const hourOfDay = now.getHours();
  const dayOfWeek = now.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Determine time of day bucket
  let timeOfDayBucket: TimeContext['timeOfDayBucket'];
  if (hourOfDay >= 5 && hourOfDay < 12) {
    timeOfDayBucket = 'morning';
  } else if (hourOfDay >= 12 && hourOfDay < 17) {
    timeOfDayBucket = 'afternoon';
  } else if (hourOfDay >= 17 && hourOfDay < 21) {
    timeOfDayBucket = 'evening';
  } else {
    timeOfDayBucket = 'night';
  }

  // Get timezone
  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    // Fallback to UTC
  }

  return {
    hourOfDay,
    dayOfWeek,
    timezone,
    isWeekend,
    timeOfDayBucket,
  };
}

/**
 * Extract acquisition context from URL parameters and referrer
 */
export function extractAcquisitionContext(): AcquisitionContext {
  if (typeof window === 'undefined') {
    return { source: 'unknown' };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source') || undefined;
  const utmMedium = params.get('utm_medium') || undefined;
  const utmCampaign = params.get('utm_campaign') || undefined;

  // Determine source from UTM or referrer
  let source: AcquisitionContext['source'] = 'direct';
  let referrerDomain: string | undefined;

  if (document.referrer) {
    try {
      const referrerUrl = new URL(document.referrer);
      referrerDomain = referrerUrl.hostname;

      // Classify referrer
      if (/google|bing|yahoo|duckduckgo/i.test(referrerDomain)) {
        source = utmMedium === 'cpc' ? 'paid' : 'organic';
      } else if (/facebook|twitter|linkedin|instagram|tiktok/i.test(referrerDomain)) {
        source = 'social';
      } else if (referrerDomain !== window.location.hostname) {
        source = 'referral';
      }
    } catch {
      // Invalid referrer URL
    }
  }

  // UTM source overrides
  if (utmSource) {
    if (utmMedium === 'cpc' || utmMedium === 'ppc' || utmMedium === 'paid') {
      source = 'paid';
    } else if (utmMedium === 'email') {
      source = 'email';
    } else if (utmMedium === 'social') {
      source = 'social';
    } else if (utmMedium === 'referral') {
      source = 'referral';
    }
  }

  return {
    source,
    utmSource,
    utmMedium,
    utmCampaign,
    referrerDomain,
  };
}

/**
 * Extract complete user features
 */
export function extractUserFeatures(
  persona: Persona,
  goal: Goal,
  options?: {
    surveyCompletionTimeMs?: number;
    surveySkippedQuestions?: number;
  }
): UserFeatures {
  return {
    persona,
    goal,
    device: extractDeviceInfo(),
    time: extractTimeContext(),
    acquisition: extractAcquisitionContext(),
    surveyCompletionTimeMs: options?.surveyCompletionTimeMs,
    surveySkippedQuestions: options?.surveySkippedQuestions,
  };
}

/**
 * Store acquisition context on page load (before it's lost)
 */
export function captureAcquisitionContext(): void {
  if (typeof window === 'undefined') return;

  const key = 'every_acquisition_context';
  // Only capture if not already set
  if (!sessionStorage.getItem(key)) {
    const context = extractAcquisitionContext();
    sessionStorage.setItem(key, JSON.stringify(context));
  }
}

/**
 * Retrieve stored acquisition context
 */
export function getStoredAcquisitionContext(): AcquisitionContext {
  if (typeof window === 'undefined') {
    return { source: 'unknown' };
  }

  const key = 'every_acquisition_context';
  const stored = sessionStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall through to extract fresh
    }
  }

  return extractAcquisitionContext();
}
