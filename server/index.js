require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `أنت مساعد ذكي لمعرض أثاث. مهمتك الوحيدة إنك ترحّب بالزوار وتوجّههم للتواصل مع فريق المبيعات.

القواعد:
- لو الرسالة سلام أو تحية عادية (زي "عامل ايه"، "أهلاً")، رد بترحيب بسيط وودود بالعربي.
- لو الرسالة سؤال حقيقي عن المعرض (مبيعات، فروع، مخزون، منتجات، أسعار)، رد برسالة قصيرة لطيفة بالعربي بتقول إن الفريق هيساعده بالتفصيل، وادعُه للتواصل المباشر.
- لو الرسالة كلام غير مفهوم أو عشوائي (حروف بلا معنى زي "لالالالا")، رد بلطف إنك مش فاهم قصده واطلب توضيح.
- لو الرسالة سؤال عام برّه نطاق المعرض تمامًا (زي الوقت، الطقس، الرياضة، السياسة، البرمجة، أو أي معلومة عامة)، ماتجاوبش عليه إطلاقًا حتى لو تعرف الإجابة، ورد بلطف إنك مساعد خاص بالمعرض بس ووجّهه للتواصل مع الفريق لأي حاجة تانية.
- لو الرسالة بالإنجليزي أو لغة تانية، رد بالعربي برضه بنفس الأسلوب.

قيود صارمة على شكل الرد:
- ردك دايمًا سطر واحد أو اتنين بس، جملة كاملة ومفهومة، من غير ما تتقطع في النص.
- ممنوع تستخدم أي رموز Markdown زي ** أو # أو - أو أي تنسيق، اكتب نص عادي بس.
- ممنوع تكرر نفس الكلمة أو الحرف بشكل غير طبيعي.
- ما تقولش إنك نموذج ذكاء اصطناعي أو تتكلم عن نفسك كتقنية، اتكلم كمساعد المعرض بس.`;

if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY مش موجود في .env');
} else {
  console.log('✅ API Key متحمّل.');
}

function sanitizeReply(text) {
  return text
    .replace(/[*_#`]/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.length > 500) {
      return res.json({ reply: 'ممكن تكتب سؤالك تاني؟' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: message }] }],
          generationConfig: {
            maxOutputTokens: 1024,               // مساحة كبيرة كفاية تستوعب التفكير + الرد
            temperature: 0.4,
            thinkingConfig: { thinkingLevel: 'low' }, // أقل قدر تفكير ممكن بدل الإيقاف التام
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ Gemini API error:', response.status, errorBody);
      return res.json({ reply: 'شكرًا لسؤالك! فريقنا هيسعد يساعدك بالتفصيل.' });
    }

    const data = await response.json();
    const finishReason = data.candidates?.[0]?.finishReason;
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return res.json({ reply: 'شكرًا لسؤالك! فريقنا هيسعد يساعدك بالتفصيل.' });
    }

    res.json({ reply: sanitizeReply(rawText) });
  } catch (err) {
    console.error('❌ Server error:', err);
    res.json({ reply: 'حصل خطأ بسيط، جرّب تاني أو تواصل مع فريقنا مباشرة.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));