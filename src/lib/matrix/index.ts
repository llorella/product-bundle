// Matrix configuration and loading
export {
  loadMatrixConfig,
  getMatrixConfigSync,
  getPrimaryAppFromConfig,
  getSecondaryAppsFromConfig,
  invalidateMatrixCache,
  setMatrixConfig,
  getMatrixVersion,
  getMatrixSource,
} from './config';

// Device detection (for native app routing)
export { extractDeviceInfo } from './features';
