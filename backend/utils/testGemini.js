require('dotenv').config({ path: '../.env' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
You are a medical assistance AI incorporated into a healthcare application.
The user's chest X-ray was analyzed for PNEUMONIA.
The result is: Negative with a confidence of 89.8%.
User Location is unknown. In the hospitals list, provide 3 well-known National Emergency Medical Helplines or major National Hospitals. Make sure the hospital names imply Emergency / National Helpline.

Task:
1. Provide a "guidance" field with simple, practical instructions on what the user should do next.
   - If the result is Positive for Pneumonia or TB: emphasize that they should seek urgent medical care. Provide basic precautions (e.g., rest, hydration, isolation to prevent spread), and list warning signs that require emergency attention (severe breathing difficulty, high fever, chest pain, coughing blood). Keep it non-technical, safety-focused, and action-oriented.
   - If the result is Negative: provide general health advice, such as "No significant findings, but continue routine care. If you experience persistent symptoms, consult a doctor."

2. Provide a "hospitals" field (an array of objects).
   - If the user's location is known, search or simulate finding 3-5 nearby hospitals suitable for this condition.
   - If the user's location is unknown/unavailable, provide 3-5 established emergency / national helplines or telemedicine services that are generally accessible. 
   - Each hospital/helpline object must have:
     - "name": Name of the hospital or helpline
     - "address": Address or "National Helpline"
     - "distance": Distance (e.g., "5 km") or "N/A"
     - "contact": A contact phone number or emergency line (e.g., "112", "911", or local helpline)

Return ONLY valid JSON with this exact structure:
{
  "guidance": "string",
  "hospitals": [
    { "name": "string", "address": "string", "distance": "string", "contact": "string" }
  ]
}
`;

  try {
    const response = await model.generateContent(prompt);
    console.log("Response text:");
    console.log(response.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
