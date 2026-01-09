
import { GoogleGenAI } from "@google/genai";
import { BRAND_INFO } from "../constants";

export async function generateDesignImage(
  basePrompt: string,
  options: {
    characters: string[]; // Support multiple character snippets
    vector: string;
    typography: string;
    logoBase64?: string;
    characterBase64?: string;
    customText?: string;
    side: 'front' | 'back';
  }
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const textToRender = options.customText || 'Chúc Mừng Năm Mới 2026';

  const sideContext = options.side === 'front' 
    ? `Mặt trước bao lì xì. 
       CHỮ BẮT BUỘC PHẢI HIỂN THỊ (VIẾT ĐÚNG DẤU TIẾNG VIỆT): "${textToRender}"
       Tên thương hiệu: "${BRAND_INFO.name}"`
    : `Mặt sau bao lì xì. 
       THÔNG TIN LIÊN HỆ BẮT BUỘC (VIẾT ĐÚNG DẤU TIẾNG VIỆT):
       - "${BRAND_INFO.name}"
       - Địa chỉ: "${BRAND_INFO.address}"
       - SĐT: "${BRAND_INFO.phone}"
       - Email: "${BRAND_INFO.email}"
       Phong cách phải đồng bộ hoàn toàn với mặt trước.`;

  const finalPrompt = `
    ROLE: Senior Graphic Designer.
    TASK: Create a professional 2026 Vietnamese Lunar New Year (Bao Li Xi) envelope design.
    
    TEXT RENDERING RULES (EXTREMELY IMPORTANT):
    - You MUST render Vietnamese text with 100% accuracy.
    - DO NOT skip any diacritics (dấu). 
    - Words like "Chúc", "Mừng", "Mới", "Đức", "Phương", "Chánh", "Hưng" must have correct marks.
    - If you are unsure about a character, use a clean, bold sans-serif or calligraphy font that supports UTF-8.
    
    VISUAL THEME: ${basePrompt}
    
    CHARACTERS TO COMBINE IN ONE SCENE:
    ${options.characters.join(' AND ')}
    ${options.characterBase64 ? "ALSO: Incorporate the person from the uploaded photo into the scene, stylized as a matching 3D Chibi character." : ""}
    
    DECORATIONS: ${options.vector}
    TYPOGRAPHY STYLE: ${options.typography}
    
    LAYOUT REQUIREMENTS:
    ${sideContext}
    
    ${options.logoBase64 ? 'Use the colors and style from the uploaded logo.' : ''}
    
    AESTHETIC: High-end 3D render, vibrant festive red and gold, luxury gold foil, professional print quality.
  `;

  try {
    const parts: any[] = [{ text: finalPrompt }];
    
    if (options.logoBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: options.logoBase64.split(',')[1] || options.logoBase64
        }
      });
    }
    
    if (options.characterBase64) {
      parts.push({
        inlineData: {
          mimeType: 'image/png',
          data: options.characterBase64.split(',')[1] || options.characterBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("Không tìm thấy dữ liệu ảnh từ AI.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}
