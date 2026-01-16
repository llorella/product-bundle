import { Persona, Goal, App } from '../types';
import { HeuristicType } from './matrix';

/**
 * Device information
 */
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown';
  browser: 'chrome' | 'safari' | 'firefox' | 'edge' | 'other';
}

/**
 * Time context
 */
export interface TimeContext {
  hourOfDay: number;        // 0-23
  dayOfWeek: number;        // 0-6 (Sunday = 0)
  timezone: string;         // IANA timezone string
  isWeekend: boolean;
  timeOfDayBucket: 'morning' | 'afternoon' | 'evening' | 'night';
}

/**
 * Referral/acquisition context
 */
export interface AcquisitionContext {
  source: 'organic' | 'paid' | 'referral' | 'direct' | 'social' | 'email' | 'unknown';
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrerDomain?: string;
}

/**
 * Complete user feature set for assignment decisions
 */
export interface UserFeatures {
  // Core survey data (existing)
  persona: Persona;
  goal: Goal;

  // Extended signals (new)
  device: DeviceInfo;
  time: TimeContext;
  acquisition: AcquisitionContext;

  // Behavioral signals (can be updated during session)
  surveyCompletionTimeMs?: number;
  surveySkippedQuestions?: number;

  // Historical (for returning users)
  previousAppsUsed?: App[];
  previousEscapeHatchUsed?: boolean;
}

/**
 * Assignment result with full context
 */
export interface AssignmentResult {
  primaryApp: App;
  secondaryApps: App[];

  // Why this assignment was made
  assignmentContext: {
    matrixVersion: string;
    cellConfidence: number;
    featureOverrideApplied?: string;
    heuristicUsed?: HeuristicType;
  };

  // For tracking
  features: UserFeatures;
}

/**
 * Compact user features for event payloads (smaller footprint)
 */
export interface UserFeaturesCompact {
  device_type: string;
  device_os: string;
  acquisition_source: string;
  time_of_day_bucket: string;
  is_weekend: boolean;
}

/**
 * Convert full features to compact format for event tracking
 */
export function toCompactFeatures(features: UserFeatures): UserFeaturesCompact {
  return {
    device_type: features.device.type,
    device_os: features.device.os,
    acquisition_source: features.acquisition.source,
    time_of_day_bucket: features.time.timeOfDayBucket,
    is_weekend: features.time.isWeekend,
  };
}
