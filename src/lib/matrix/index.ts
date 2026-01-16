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

// User feature extraction
export {
  extractDeviceInfo,
  extractTimeContext,
  extractAcquisitionContext,
  extractUserFeatures,
  captureAcquisitionContext,
  getStoredAcquisitionContext,
} from './features';

// Heuristic computation
export {
  computeOptimizedMatrix,
  compareMatrices,
  getMatrixSummary,
} from './heuristics';
