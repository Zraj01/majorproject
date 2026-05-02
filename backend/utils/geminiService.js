const { GoogleGenerativeAI } = require("@google/generative-ai");


const apiKeys = (process.env.GEMINI_API_KEY || "").split(",").map(k => k.trim()).filter(k => k.length > 0);
let currentKeyIndex = 0;

const getFallbackData = (diseaseType, result) => {
  const isPositive = result.toLowerCase() === "positive";
  
  if (!isPositive) {
    return {
      urgencyLevel: "Low",
      whatToDoNow: [
        "Continue normal daily activities",
        "Stay hydrated",
        "Monitor symptoms",
        "Consult a doctor if symptoms worsen"
      ],
      warningSigns: [
        "Difficulty breathing",
        "High fever",
        "Chest pain",
        "Persistent cough"
      ],
      locationStatus: "Location fallback activated",
      nearbyHospitals: [
        { name: "Ambulance", address: "India", distance: "N/A", contact: "108" }
      ],
      timestamp: new Date().toISOString()
    };
  }

  if (diseaseType === "TB" || diseaseType === "TUBERCULOSIS") {
    return {
      urgencyLevel: "High",
      whatToDoNow: [
        "Visit a healthcare provider immediately",
        "Avoid close contact with others",
        "Wear a mask",
        "Ensure proper ventilation"
      ],
      warningSigns: [
        "Severe breathing difficulty",
        "Chest pain",
        "High fever",
        "Coughing blood"
      ],
      locationStatus: "Location fallback activated",
      nearbyHospitals: [
        { name: "Ambulance", address: "India", distance: "N/A", contact: "108" }
      ],
      timestamp: new Date().toISOString()
    };
  }


  return {
    urgencyLevel: "Medium",
    whatToDoNow: [
      "Visit a doctor or nearby hospital soon",
      "Take adequate rest",
      "Drink plenty of fluids",
      "Monitor breathing and temperature"
    ],
    warningSigns: [
      "Difficulty breathing",
      "Chest pain",
      "High fever",
      "Persistent cough",
      "Coughing blood"
    ],
    locationStatus: "Location fallback activated",
    nearbyHospitals: [
      { name: "Ambulance", address: "India", distance: "N/A", contact: "108" }
    ],
    timestamp: new Date().toISOString()
  };
};

const getAnalysisAndGuidance = async (diseaseType, result, confidence, location) => {
  if (apiKeys.length === 0) {
    console.error("No Gemini API keys configured. Falling back.");
    return getFallbackData(diseaseType, result);
  }

  const confidencePct = (confidence * 100).toFixed(1);
  
  const isLocationAvailable = location && location !== "Unknown Location";
  const locationPrompt = isLocationAvailable
    ? `The user's location is: ${location}. Please return 3 to 5 nearby hospitals appropriate for this condition.`
    : `The user's location is NOT available. In "locationStatus", say: "Please enter your city or PIN code to find nearby hospitals." Leave nearbyHospitals empty.`;

  const prompt = `
You are a medical assistance AI incorporated into a healthcare application.
The user's chest X-ray was analyzed for ${diseaseType}.
The result is: ${result} with a confidence of ${confidencePct}%.

${locationPrompt}

Task:
Generate a valid JSON object with EXACTLY these keys:
- "urgencyLevel": "Low", "Medium", or "High"
- "whatToDoNow": Array of short action-oriented string instructions
- "warningSigns": Array of string symptoms
- "locationStatus": A short string explaining if location was used or needs to be entered.
- "nearbyHospitals": Array of objects (if location is provided). Each must have "name", "address", "distance", and "contact". If location is NOT provided, leave this empty [].
- "timestamp": current ISO timestamp string

Ensure whatToDoNow and warningSigns are medically appropriate for ${diseaseType} and the result (${result}).
If the result is Negative, advise continuing routine care. If Positive, advise seeking medical attention appropriately.

Return ONLY valid JSON:
{
  "urgencyLevel": "",
  "whatToDoNow": [],
  "warningSigns": [],
  "locationStatus": "",
  "nearbyHospitals": [],
  "timestamp": ""
}
`;

  let lastError;
  const maxAttempts = apiKeys.length;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const activeKey = apiKeys[currentKeyIndex];
      const genAI = new GoogleGenerativeAI(activeKey);
      
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const response = await model.generateContent(prompt);
      let text = response.response.text();
      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      
      const startIdx = text.indexOf('{');
      const endIdx = text.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        text = text.substring(startIdx, endIdx + 1);
      }

      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch (e) {
        console.error(`Failed to parse this exact text from Gemini (Key: ${currentKeyIndex + 1}):`, text);
        throw new Error("Invalid JSON structure returned by Gemini");
      }

      if (!parsedData.urgencyLevel || !Array.isArray(parsedData.whatToDoNow)) {
        throw new Error("Missing required JSON fields from Gemini");
      }

      return parsedData;

    } catch (error) {
      lastError = error;
      const errorMsg = error?.message || "";
      const errorStatus = error?.status || 0;


      if (errorStatus === 429 || errorMsg.includes("429") || errorMsg.includes("Quota") || errorMsg.includes("Too Many Requests")) {
        console.warn(`[Gemini API] Key ${currentKeyIndex + 1} hit rate limit. Rotating to next key...`);
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      } else {

        break;
      }
    }
  }


  console.error("Gemini API Error (Triggering Fallback):", lastError?.message || lastError);
  return getFallbackData(diseaseType, result);
};

module.exports = {
  getAnalysisAndGuidance
};
