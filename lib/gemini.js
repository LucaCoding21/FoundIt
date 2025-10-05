import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export async function analyzeFoundItem(imageFile) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    // Convert image to base64
    const base64Data = await fileToBase64(imageFile)
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: imageFile.type
      }
    }

    const prompt = `Extract item details for a lost & found listing. Focus ONLY on the item itself, ignore background/hands/lighting.

⚠️ CRITICAL: Only describe what you can CLEARLY SEE. DO NOT guess or make up details. If brand/model isn't visible, use generic terms.

CATEGORY (pick one):
- Clothing (hoodies, jackets, hats, gloves)
- Devices (phones, laptops, headphones, AirPods, calculators)
- Cables & Accessories (chargers, dongles, adapters, power banks, cables)
- Essentials (wallets, keys, IDs, glasses)
- Daily Items (water bottles, mugs, umbrellas)
- Other

RULES:
- Cables/chargers/adapters/power banks → "Cables & Accessories"
- Headphones/AirPods/earbuds → "Devices"  
- AirPods case → title is "AirPods" or "AirPods Pro" (not "AirPods Case")

TITLE: 2-4 words max. Use generic terms if brand unclear.

DESCRIPTION: Max 15 words. Only clearly visible details.
- If brand/model NOT clearly visible → use generic terms (e.g., "wireless earbuds" not "AirPods" unless you see Apple logo)
- Only mention condition if clearly visible
- DO NOT invent scratches, stains, or damage you don't see
Format: [Color] [Brand/Model if visible] [Item Type], [Condition if visible]
Examples:
- "White wireless earbuds case" (if brand unclear)
- "Black hoodie, appears unworn" (if brand unclear)
- "Blue water bottle, dented" (generic if brand unclear)

HIDDEN NOTES: Max 20 words. ONLY clearly visible verification details (scratches, serial numbers, unique marks). If nothing notable, write "none visible". DO NOT make up details.

Return valid JSON:
{
  "title": "2-4 words",
  "category": "exact category name from list",
  "description": "max 15 words, only visible details",
  "hidden_notes": "max 20 words, visible verification details or 'none visible'"
}`

    const result = await model.generateContent([prompt, imagePart])
    const response = result.response
    const text = response.text()
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/, '').replace(/\n?```$/, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/, '').replace(/\n?```$/, '')
    }
    
    const parsed = JSON.parse(jsonText)
    
    return {
      success: true,
      data: parsed
    }
  } catch (error) {
    console.error('Gemini analysis error:', error)
    return {
      success: false,
      error: error.message || 'Failed to analyze image'
    }
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

