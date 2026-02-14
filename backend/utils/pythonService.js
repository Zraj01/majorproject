const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const PYTHON_API_URL = process.env.PYTHON_API_URL;

/**
 * Call real Python ML inference API
 * @param {string} diseaseType - PNEUMONIA | TB (TB future use)
 * @param {string} imagePath - absolute path from multer
 */
const runInference = async (diseaseType, imagePath) => {
  if (!PYTHON_API_URL) {
    throw new Error("PYTHON_API_URL not set in .env");
  }

  const formData = new FormData();


  formData.append("file", fs.createReadStream(imagePath));

  try {
    const response = await axios.post(
      `${PYTHON_API_URL}/predict`, 
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 30000,
      }
    );

 

    return response.data;
  } catch (error) {
    console.error(
      "Python ML API Error:",
      error.response?.data || error.message
    );
    throw new Error("AI inference failed");
  }
};

module.exports = { runInference };
