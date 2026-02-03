
import { GoogleGenAI } from "@google/genai";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLessonPlan = async (subject: string, topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a professional lesson plan for the subject "${subject}" on the topic "${topic}". Include objectives, materials, activities, and assessment. Format as Markdown.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate lesson plan. Please check your connection.";
  }
};

export const summarizeStudentProgress = async (studentName: string, attendanceCount: number, recentNotes: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short professional progress report for a student named ${studentName}. They have attended ${attendanceCount} days recently. Notes: ${recentNotes}. Keep it encouraging but realistic.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate summary.";
  }
};
