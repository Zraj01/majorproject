
const simulateInference = (diseaseType) => {
 
  const delay = 500 + Math.random() * 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
    
      const isPositive = Math.random() > 0.5;
      const confidence = 0.72 + Math.random() * 0.25; 
      resolve({
        result: isPositive ? 'Positive' : 'Negative',
        confidence: Math.round(confidence * 1000) / 1000,
      });
    }, delay);
  });
};

/**
 * Call ML inference (placeholder).
 * @param {string} diseaseType 
 * @param {string} imagePath 
 * @returns {Promise<{ result: string, confidence: number }>}
 */
const runInference = async (diseaseType, imagePath) => {
  const normalizedType = diseaseType.toUpperCase();
  if (normalizedType !== 'PNEUMONIA' && normalizedType !== 'TB') {
    throw new Error(`Unsupported disease type: ${diseaseType}`);
  }
  
  return simulateInference(normalizedType.toLowerCase());
};

module.exports = { runInference };
