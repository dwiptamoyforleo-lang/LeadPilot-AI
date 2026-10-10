import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Deep Thinking Lead Analysis endpoint using gemini-3.1-pro-preview with ThinkingLevel.HIGH
app.post('/api/gemini/thinking-analyze', async (req, res) => {
  const { lead, complexQuery, industry, businessName } = req.body || {};

  if (!aiClient) {
    // Zero-cost rule simulation fallback
    return res.json({
      success: true,
      source: 'local_zero_cost_simulation',
      thinkingLevel: 'HIGH',
      message: 'Running local zero-cost high-intelligence simulation.',
    });
  }

  try {
    const prompt = `Analyze this complex lead scenario and customer query for "${businessName || 'Business'}" in the "${industry || 'services'}" industry.

Lead Information:
- Customer Name: ${lead?.name || 'Customer'}
- Current Status: ${lead?.status || 'Awaiting Reply'}
- Original Inquiry: ${lead?.enquiryDetails || 'No details provided'}
- Preferred Contact: ${lead?.preferredContactMethod || 'WhatsApp / SMS'}

Complex Objection / Customer Query to Resolve:
"${complexQuery || 'The customer has raised reservations about pricing, timeline commitments, and competitor options.'}"

Instructions:
1. Provide a step-by-step THINKING PROCESS (Psychological Intent, Friction Points, Commercial Stakes, Objection Deconstruction).
2. Formulate the OPTIMAL QUALIFICATION STRATEGY.
3. Write a high-converting, courteous, personalized RESPONSE DRAFT (100% TCPA compliant, non-aggressive, with a soft micro-commitment or appointment slot offer).`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
        systemInstruction:
          'You are LeadPilot AI Strategic Objection & Follow-Up Reasoner. You excel at deconstructing complex customer objections, balancing commercial urgency with genuine courtesy, and proposing precise, low-friction next steps.',
      },
    });

    return res.json({
      success: true,
      source: 'gemini-3.1-pro-preview',
      thinkingLevel: 'HIGH',
      analysis: response.text,
    });
  } catch (error: any) {
    console.error('Gemini API call failed:', error);
    return res.json({
      success: false,
      source: 'local_zero_cost_simulation',
      thinkingLevel: 'HIGH',
      error: error?.message || 'Gemini API call failed, falling back to local simulation.',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LeadPilot AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
