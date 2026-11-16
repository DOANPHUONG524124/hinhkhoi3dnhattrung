import { GoogleGenAI } from '@google/genai';

/**
 * Helper to send JSON response across Vercel Serverless Function and standard Node HTTP/Express
 */
function sendJson(res, statusCode, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  return res.end(JSON.stringify(data));
}

/**
 * Helper to safely extract JSON body
 */
async function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  if (req.readable) {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  return {};
}

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    if (typeof res.status === 'function' && typeof res.end === 'function') {
      return res.status(200).end();
    }
    res.statusCode = 200;
    return res.end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Chỉ chấp nhận phương thức POST.' });
  }

  // Validate GEMINI_API_KEY from environment variables
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !apiKey.trim()) {
    return sendJson(res, 503, {
      error: 'Chưa cấu hình GEMINI_API_KEY trên máy chủ. Vui lòng cấu hình biến môi trường GEMINI_API_KEY trong cài đặt dự án Vercel.',
    });
  }

  try {
    const body = await parseBody(req);
    const { prompt, shapeInfo, mode } = body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return sendJson(res, 400, {
        error: 'Nội dung câu hỏi không được để trống.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Bạn là "Trợ lý Toán học 3D" thân thiện, nhiệt tình và sư phạm, chuyên giảng dạy môn Toán hình học không gian cho học sinh tiểu học (Lớp 4 - Lớp 5) và hỗ trợ giáo viên Việt Nam.
Nguyên tắc giao tiếp:
1. Luôn dùng tiếng Việt chuẩn mực, xưng "Thầy/Cô Trợ lý" hoặc "Bạn Thỏ Toán Học" và gọi người dùng là "Em" hoặc "Bạn nhỏ" (hoặc "Thầy/Cô" nếu ở chế độ Giáo viên).
2. Dùng ngôn ngữ trong sáng, sinh động, dễ hiểu, dùng các hình ảnh so sánh thực tế đời thường (ví dụ: hình lập phương như con xúc xắc hay khối rubik; hình hộp chữ nhật như hộp sữa, bao diêm hay hộp bánh; hình trụ như lon sữa ông Thọ hay lon nước ngọt; hình nón như nón lá hay chiếc kem ốc quế; hình cầu như quả bóng đá hay quả địa cầu; hình lăng trụ tam giác như mái nhà hay lều cắm trại; hình chóp tứ giác như kim tự tháp Ai Cập).
3. Tuyệt đối KHÔNG tự bịa công thức hay tính toán sai. Hãy bám sát kiến thức SGK Toán tiểu học Việt Nam (Bộ Giáo Dục và Đào Tạo).
4. Phân biệt rõ ràng giữa chu vi (cm), diện tích đáy / diện tích xung quanh / diện tích toàn phần (cm²) và thể tích (cm³).
5. Trình bày ngắn gọn, có gạch đầu dòng rõ ràng, không dùng thuật ngữ đại học phức tạp.
6. Khi học sinh hỏi bài tập, hãy gợi ý từng bước từng bước để học sinh tự suy nghĩ giải ra, khích lệ và khen ngợi.`;

    const contextText = shapeInfo
      ? `\n[Thông tin hình khối hiện tại trong mô hình 3D]:\n- Tên hình: ${shapeInfo.name || 'Không xác định'}\n- Kích thước: ${JSON.stringify(shapeInfo.dimensions || {})}\n- Số mặt: ${shapeInfo.faces ?? 'N/A'}, Số cạnh: ${shapeInfo.edges ?? 'N/A'}, Số đỉnh: ${shapeInfo.vertices ?? 'N/A'}\n- Công thức & Kết quả hiện tại: Chu vi đáy=${shapeInfo.perimeterBottom || 'N/A'}, Diện tích đáy=${shapeInfo.areaBottom || 'N/A'}, Diện tích xung quanh=${shapeInfo.areaAround || 'N/A'}, Diện tích toàn phần=${shapeInfo.areaTotal || 'N/A'}, Thể tích=${shapeInfo.volume || 'N/A'}`
      : '';

    const fullPrompt = `${contextText}\n\n[Chế độ]: ${mode || 'Học sinh khám phá'}\n[Yêu cầu/Câu hỏi]: ${prompt.trim()}`;

    // Candidate models to try in case of model availability differences
    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
    ].filter(Boolean);

    const modelsToTry = [...new Set(candidateModels)];

    let lastError = null;
    let replyText = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: model,
          contents: fullPrompt,
          config: {
            systemInstruction,
          },
        });

        if (response && response.text) {
          replyText = response.text;
          break;
        }
      } catch (err) {
        lastError = err;
        // If error is 404 (model not found), try next model. Otherwise stop and report error.
        const errMsg = String(err?.message || '');
        const isNotFound = errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('NOT_FOUND');
        if (!isNotFound) {
          break;
        }
      }
    }

    if (!replyText) {
      throw lastError || new Error('Không nhận được phản hồi từ Gemini API.');
    }

    return sendJson(res, 200, { reply: replyText });
  } catch (error) {
    console.error('Gemini API Error in api/gemini/tutor.js:', error);
    const status = error?.status && typeof error.status === 'number' && error.status >= 400 && error.status < 600
      ? error.status
      : 500;

    let errorMessage = error?.message || 'Lỗi khi kết nối với Trợ lý AI Gemini.';
    try {
      const parsed = JSON.parse(errorMessage);
      if (parsed?.error?.message) {
        errorMessage = parsed.error.message;
      }
    } catch {
      // not JSON string, keep as is
    }

    return sendJson(res, status, {
      error: errorMessage,
    });
  }
}
