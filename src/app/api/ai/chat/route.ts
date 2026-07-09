import { NextRequest, NextResponse } from 'next/server';
import { callAI, isAIConfigured } from '@/lib/ai';

const SYSTEM_PROMPT = `Bạn là trợ lý AI chuyên tư vấn phim cho website NhungMov (nhungmov.vercel.app). 
Bạn có thể:
- Gợi ý phim theo thể loại, quốc gia, năm, cảm xúc, tâm trạng
- So sánh phim
- Review phim
- Trả lời câu hỏi về diễn viên, đạo diễn
Trả lời bằng tiếng Việt, ngắn gọn, thân thiện.`;

export async function POST(request: NextRequest) {
  try {
    if (!isAIConfigured()) {
      return NextResponse.json({
        success: false,
        message: 'AI chưa được cấu hình. Vui lòng liên hệ quản trị viên.',
      });
    }

    const { messages } = await request.json();
    const allMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(messages || []),
    ];
    const reply = await callAI(allMessages, { temperature: 0.7, maxTokens: 500 });

    return NextResponse.json({ success: true, message: reply });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error',
    }, { status: 500 });
  }
}
