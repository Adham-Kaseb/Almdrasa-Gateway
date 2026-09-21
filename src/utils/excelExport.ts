import ExcelJS from 'exceljs';
import { AdminUser } from '../types/admin';

export async function exportStyledUsersExcel(users: AdminUser[]): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Almdrasa Gateway Platform';
  workbook.lastModifiedBy = 'إدارة المنصة';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('سجل الطلاب والمستخدمين', {
    views: [{ rightToLeft: true, showGridLines: true }],
    pageSetup: { orientation: 'landscape', paperSize: 9 },
  });

  // 1. Title Banner (Merged A1:N1)
  worksheet.mergeCells('A1:N1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'منصة المدرسة (Almdrasa Gateway) — سجل الطلاب وحسابات المنحة 2026';
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFDFCA9F' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF141311' },
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 42;

  // 2. Subtitle / Metadata (Merged A2:N2)
  worksheet.mergeCells('A2:N2');
  const subCell = worksheet.getCell('A2');
  const dateStr = new Date().toLocaleString('ar-EG', { dateStyle: 'full', timeStyle: 'short' });
  subCell.value = `تاريخ الاستخراج: ${dateStr}   |   إجمالي الحسابات: ${users.length} حساب   |   المصدر: قاعدة بيانات Supabase الرسمية`;
  subCell.font = { name: 'Arial', size: 10, bold: false, color: { argb: 'FFC8C2B7' } };
  subCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E1D19' },
  };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(2).height = 24;

  // 3. Spacer Row
  worksheet.getRow(3).height = 10;

  // 4. Define Columns
  const headers = [
    { key: 'idx', title: '#', width: 6 },
    { key: 'full_name', title: 'الاسم الكامل', width: 24 },
    { key: 'email', title: 'البريد الإلكتروني', width: 28 },
    { key: 'phone', title: 'رقم الهاتف', width: 16 },
    { key: 'country', title: 'الدولة / المدينة', width: 18 },
    { key: 'track', title: 'المسار الأكاديمي', width: 16 },
    { key: 'cohort_year', title: 'الدفعة', width: 10 },
    { key: 'scholarship_phase', title: 'المرحلة', width: 12 },
    { key: 'study_streak_days', title: 'أيام الالتزام', width: 14 },
    { key: 'total_hours_learned', title: 'ساعات الدراسة', width: 14 },
    { key: 'overall_progress', title: 'نسبة الإنجاز', width: 14 },
    { key: 'status', title: 'الحالة الأكاديمية', width: 16 },
    { key: 'role', title: 'الصلاحية', width: 12 },
    { key: 'created_at', title: 'تاريخ التسجيل', width: 18 },
  ];

  const headerRowNumber = 4;
  const headerRow = worksheet.getRow(headerRowNumber);
  headerRow.height = 30;

  headers.forEach((col, i) => {
    const colNumber = i + 1;
    worksheet.getColumn(colNumber).width = col.width;
    const cell = headerRow.getCell(colNumber);
    cell.value = col.title;
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF8A6D3B' }, // Warm executive bronze
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF5A4622' } },
      bottom: { style: 'medium', color: { argb: 'FF3A2D16' } },
      left: { style: 'thin', color: { argb: 'FF5A4622' } },
      right: { style: 'thin', color: { argb: 'FF5A4622' } },
    };
  });

  // 5. Data Rows
  let totalHours = 0;
  let totalProgress = 0;

  users.forEach((user, index) => {
    const rowNumber = headerRowNumber + 1 + index;
    const row = worksheet.getRow(rowNumber);
    row.height = 24;

    totalHours += user.total_hours_learned || 0;
    totalProgress += user.overall_progress || 0;

    const isEven = index % 2 === 0;
    const baseRowBg = isEven ? 'FFFFFFFF' : 'FFFDFBF7';

    const statusText =
      user.status === 'excelling'
        ? 'متفوق'
        : user.status === 'at_risk'
        ? 'معرض للإقصاء'
        : user.status === 'suspended'
        ? 'موقوف'
        : 'نشط';

    const statusFgColor =
      user.status === 'excelling'
        ? 'FF0D7E46'
        : user.status === 'at_risk'
        ? 'FFB91C1C'
        : user.status === 'suspended'
        ? 'FF4B5563'
        : 'FF1D4ED8';

    const statusBgColor =
      user.status === 'excelling'
        ? 'FFE6F9F0'
        : user.status === 'at_risk'
        ? 'FFFEE2E2'
        : user.status === 'suspended'
        ? 'FFF3F4F6'
        : 'FFEFF6FF';

    const locationStr = user.village ? `${user.country || 'مصر'} - ${user.village}` : user.country || 'مصر';
    const regDateStr = user.created_at ? new Date(user.created_at).toLocaleDateString('ar-EG') : '-';

    const rowValues = [
      index + 1,
      user.full_name,
      user.email,
      user.phone || '-',
      locationStr,
      user.track,
      user.cohort_year,
      `المرحلة ${user.scholarship_phase}`,
      `${user.study_streak_days} يوم`,
      `${user.total_hours_learned} ساعة`,
      `${user.overall_progress}%`,
      statusText,
      user.role === 'admin' ? 'مدير' : 'طالب',
      regDateStr,
    ];

    rowValues.forEach((val, colIdx) => {
      const cell = row.getCell(colIdx + 1);
      cell.value = val;
      cell.font = { name: 'Arial', size: 10, color: { argb: 'FF1C1917' } };

      // Default border
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5E0D8' } },
        bottom: { style: 'thin', color: { argb: 'FFE5E0D8' } },
        left: { style: 'thin', color: { argb: 'FFE5E0D8' } },
        right: { style: 'thin', color: { argb: 'FFE5E0D8' } },
      };

      // Specific styling per column
      if (colIdx === 0) {
        // Index
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: baseRowBg } };
      } else if (colIdx === 1) {
        // Name
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF141311' } };
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: baseRowBg } };
      } else if (colIdx === 2) {
        // Email
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: baseRowBg } };
      } else if (colIdx === 10) {
        // Progress
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF92400E' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDF8EE' } };
      } else if (colIdx === 11) {
        // Status Badge
        cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: statusFgColor } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusBgColor } };
      } else if (colIdx === 12) {
        // Role
        const isAdmin = user.role === 'admin';
        cell.font = { name: 'Arial', size: 10, bold: isAdmin, color: { argb: isAdmin ? 'FFB45309' : 'FF57534E' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: isAdmin ? 'FFFEF3C7' : baseRowBg } };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: baseRowBg } };
      }
    });
  });

  // 6. Summary / Total Row
  if (users.length > 0) {
    const summaryRowNumber = headerRowNumber + users.length + 1;
    const summaryRow = worksheet.getRow(summaryRowNumber);
    summaryRow.height = 28;

    const avgProgress = Math.round(totalProgress / users.length);

    const summaryValues: Record<number, string | number> = {
      1: 'Σ',
      2: `الإجمالي: ${users.length} طالب`,
      10: `${totalHours} ساعة إجمالية`,
      11: `متوسط ${avgProgress}%`,
    };

    for (let colNumber = 1; colNumber <= headers.length; colNumber++) {
      const cell = summaryRow.getCell(colNumber);
      cell.value = summaryValues[colNumber] || '';
      cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF141311' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2ECE1' },
      };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF8A6D3B' } },
        bottom: { style: 'double', color: { argb: 'FF8A6D3B' } },
        left: { style: 'thin', color: { argb: 'FFD6CEBF' } },
        right: { style: 'thin', color: { argb: 'FFD6CEBF' } },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    }
  }

  // 7. Generate and Download XLSX Buffer
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `Almdrasa_Gateway_Students_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
