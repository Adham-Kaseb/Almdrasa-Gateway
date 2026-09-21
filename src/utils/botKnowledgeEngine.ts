import { ALMDRASA_KNOWLEDGE_TOPICS, KnowledgeTopic } from '../data/almdrasaKnowledge';
import { WindowId } from '../types/os';

export interface BotKnowledgeResult {
  text: string;
  actionText?: string;
  actionWindow?: WindowId;
}

/**
 * Extracts a friendly display name for the student.
 */
export const getFriendlyStudentName = (fullName?: string | null): string => {
  if (!fullName || !fullName.trim()) return 'طالبنا العزيز';
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  return parts[0] || 'طالبنا العزيز';
};

/**
 * Normalizes Arabic text for flexible keyword matching (stripping diacritics, unifying alif/ya/ta marbuta).
 */
export const normalizeArabicText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // Remove tashkeel/diacritics
    .replace(/[أإآ]/g, 'ا') // Unify alif forms
    .replace(/ة/g, 'ه') // Unify ta marbuta with ha
    .replace(/ى/g, 'ي') // Unify alif maqsura with ya
    .trim();
};

/**
 * Intelligent matcher that searches Almdrasa verified knowledge base and returns a personalized answer.
 */
export const queryAlmdrasaKnowledge = (
  userText: string,
  rawStudentName?: string | null
): BotKnowledgeResult => {
  const studentName = getFriendlyStudentName(rawStudentName);
  const normalizedQuery = normalizeArabicText(userText);

  // Score each knowledge topic based on matching keywords
  let bestTopic: KnowledgeTopic | null = null;
  let maxScore = 0;

  for (const topic of ALMDRASA_KNOWLEDGE_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      const normalizedKw = normalizeArabicText(kw);
      if (normalizedQuery.includes(normalizedKw)) {
        // Longer keyword matches carry higher weight
        score += normalizedKw.length >= 4 ? 3 : 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestTopic = topic;
    }
  }

  // If a topic matched with positive score
  if (bestTopic && maxScore > 0) {
    return {
      text: bestTopic.generateAnswer(studentName),
      actionText: bestTopic.actionText,
      actionWindow: bestTopic.actionWindow,
    };
  }

  // Friendly fallback response in Egyptian Arabic maintaining the student's name
  return {
    text: `أهلاً بيك يا ${studentName}! أنا معاك هنا عشان أسهّل عليك كل خطوة في منصة المدرسة (Almdrasa).\n\n` +
      `تقدر تسألني براحتك بالبلدي عن أي حاجة من دول:\n` +
      `• تفاصيل وسعر المنحة ونظام التقسيط والخصم الـ 87%.\n` +
      `• نظام الإقصاء والـ 9 شهور وفترة الأمان الـ 3 شهور المجانية.\n` +
      `• منهج الدبلومة ومسارات الفرونت إند والـ 20 مشروع عملي.\n` +
      `• تدريب شركة homains للأوائل، ومواعيد اجتماعات Zoom الأسبوعية.\n\n` +
      `اسألني عن أي حاجة شاغلة بالك وهجاوبك عليها فوراً!`,
    actionText: 'استعراض تفاصيل المنحة الكاملة ←',
    actionWindow: 'scholarship',
  };
};
