import { describe, it, expect } from 'vitest';
import {
  getFriendlyStudentName,
  normalizeArabicText,
  queryAlmdrasaKnowledge,
} from '../utils/botKnowledgeEngine';

describe('Bot Knowledge Engine & Personalization Tests', () => {
  it('extracts friendly student name accurately', () => {
    expect(getFriendlyStudentName('أدهم كاسب')).toBe('أدهم');
    expect(getFriendlyStudentName('خالد أحمد')).toBe('خالد');
    expect(getFriendlyStudentName('Adham Kaseb')).toBe('Adham');
    expect(getFriendlyStudentName('')).toBe('طالبنا العزيز');
    expect(getFriendlyStudentName(null)).toBe('طالبنا العزيز');
    expect(getFriendlyStudentName(undefined)).toBe('طالبنا العزيز');
  });

  it('normalizes Arabic text correctly for flexible matching', () => {
    expect(normalizeArabicText('إِقْصَاءٌ')).toBe('اقصاء');
    expect(normalizeArabicText('الْمَدْرَسَةُ')).toBe('المدرسه');
    expect(normalizeArabicText('دَوْرَاتٌ عَمَلِيَّةٌ')).toBe('دورات عمليه');
  });

  it('answers elimination policy questions and references the elimination window', () => {
    const res = queryAlmdrasaKnowledge('ما هي شروط الإقصاء وموعد الـ 9 أشهر؟', 'أدهم كاسب');
    expect(res.text).toContain('أدهم');
    expect(res.text).toContain('مرحلة إقصاء واحدة فقط');
    expect(res.text).toContain('3 شهور مجاناً');
    expect(res.actionWindow).toBe('elimination');
  });

  it('answers scholarship pricing, discounts, and installment questions', () => {
    const res = queryAlmdrasaKnowledge('كم سعر المنحة وهل يوجد تقسيط؟', 'خالد');
    expect(res.text).toContain('خالد');
    expect(res.text).toContain('87%');
    expect(res.text).toContain('4,499');
    expect(res.text).toContain('899');
    expect(res.actionWindow).toBe('scholarship');
  });

  it('answers internship and homains career questions', () => {
    const res = queryAlmdrasaKnowledge('هل يوجد تدريب عملي في شركة homains؟', 'سارة');
    expect(res.text).toContain('سارة');
    expect(res.text).toContain('homains');
    expect(res.text).toContain('تدريب ميداني مدفوع');
    expect(res.actionWindow).toBe('scholarship');
  });

  it('answers weekly zoom meetings and mentorship questions', () => {
    const res = queryAlmdrasaKnowledge('متى مواعيد اجتماعات Zoom مع المينتورز؟', 'عمر');
    expect(res.text).toContain('عمر');
    expect(res.text).toContain('Zoom');
    expect(res.text).toContain('Mentors');
    expect(res.actionWindow).toBe('meetings');
  });

  it('answers prerequisites and English language questions reassuringly', () => {
    const res = queryAlmdrasaKnowledge('هل لازم أكون شاطر في الإنجليزي أو خريج حاسبات؟', 'منى');
    expect(res.text).toContain('منى');
    expect(res.text).toContain('لا يشترط إتقان اللغة الإنجليزية');
    expect(res.text).toContain('للمبتدئين من الصفر');
    expect(res.actionWindow).toBe('faqs');
  });

  it('handles general or unmatched inquiries with a welcoming personalized fallback', () => {
    const res = queryAlmdrasaKnowledge('مرحبا كيف حالك اليوم؟', 'أحمد');
    expect(res.text).toContain('أحمد');
    expect(res.text).toContain('منصة المدرسة');
    expect(res.actionWindow).toBe('scholarship');
  });

  it('provides rich answers for all predefined quick commands', () => {
    const commands = [
      'عايز أعرف تفاصيل ونظام الإقصاء والتقييم في الدفعة السادسة',
      'إيه هي أسعار المنحة وتفاصيل التقسيط والدفع؟',
      'إيه هو المنهج والتقنيات اللي هندرسها والمشاريع العملية؟',
      'إيه هي مواعيد المنحة والجدول الزمني وميعاد التخرج؟',
      'عايز أعرف تفاصيل تدريب شركة homains وفرص التوظيف',
      'إزاي بنحضر الاجتماعات الأسبوعية والدعم المباشر ومراجعة الكود؟',
    ];

    for (const cmd of commands) {
      const res = queryAlmdrasaKnowledge(cmd, 'أدهم');
      expect(res.text).toBeTruthy();
      expect(res.text).toContain('أدهم');
      expect(res.actionWindow).toBeDefined();
    }
  });
});

