import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markup'; // HTML / XML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

export type CodeLanguage = 'python' | 'html' | 'css' | 'js' | 'react';

export interface CodeLanguageOption {
  id: CodeLanguage;
  name: string;
  badge: string;
  extension: string;
  prismLang: string;
  description: string;
  descriptionAr: string;
  sampleCode: string;
}

export const CODE_LANGUAGES: CodeLanguageOption[] = [
  {
    id: 'js',
    name: 'JavaScript',
    badge: 'JS',
    extension: '.js',
    prismLang: 'javascript',
    description: 'Modern ES6+ JavaScript syntax & async functions',
    descriptionAr: 'لغة جافا سكريبت الحديثة، كائنات، ودوال غير متزامنة',
    sampleCode: `// Almdrasa Front-End Track - JavaScript Snippet
async function fetchScholarshipData(studentId) {
  try {
    const response = await fetch(\`/api/students/\${studentId}\`);
    if (!response.ok) throw new Error("Student data fetch failed");
    const data = await response.json();
    return data.enrolledCourses;
  } catch (error) {
    console.error("Error loading curriculum:", error.message);
    return [];
  }
}`,
  },
  {
    id: 'react',
    name: 'React (JSX)',
    badge: 'React',
    extension: '.jsx',
    prismLang: 'jsx',
    description: 'React functional components, hooks & state',
    descriptionAr: 'مكونات React الوظيفية واستخدام الـ Hooks وإدارة الحالة',
    sampleCode: `import React, { useState, useEffect } from 'react';

export function ProjectProgress({ batchNumber = 6 }) {
  const [completedProjects, setCompletedProjects] = useState(0);

  useEffect(() => {
    // Sync student progress with Almdrasa Gateway
    document.title = \`Batch \${batchNumber} - \${completedProjects} Completed\`;
  }, [completedProjects, batchNumber]);

  return (
    <div className="card p-4 rounded-xl border border-white/10">
      <h3 className="font-bold text-lg">Almdrasa Student Dashboard</h3>
      <p>Submitted Projects: {completedProjects} / 20</p>
      <button onClick={() => setCompletedProjects((prev) => prev + 1)}>
        Submit Next Project
      </button>
    </div>
  );
}`,
  },
  {
    id: 'html',
    name: 'HTML5',
    badge: 'HTML',
    extension: '.html',
    prismLang: 'markup',
    description: 'Semantic HTML5 structure & accessibility tags',
    descriptionAr: 'هيكل HTML5 دلالي ومتوافق مع معايير الـ SEO وإمكانية الوصول',
    sampleCode: `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Almdrasa Gateway — الدفعة السادسة</title>
</head>
<body>
  <main class="container">
    <header class="hero-section">
      <h1>منصة المدرسة للبرمجة والتطوير</h1>
      <p>طريقك الاحترافي لاحتراف الـ Front-End وسوق العمل</p>
    </header>
  </main>
</body>
</html>`,
  },
  {
    id: 'css',
    name: 'CSS3 / Modern CSS',
    badge: 'CSS',
    extension: '.css',
    prismLang: 'css',
    description: 'Modern CSS Flexbox, Grid, animations & variables',
    descriptionAr: 'تنسيقات CSS حديثة، متغيرات، Flexbox وتدرجات فخمة',
    sampleCode: `:root {
  --primary-gold: #DFCA9F;
  --noir-bg: #141311;
  --card-radius: 1rem;
}

.developer-surface {
  display: flex;
  flex-direction: column;
  background-color: var(--noir-bg);
  border: 1px solid rgba(223, 202, 159, 0.2);
  border-radius: var(--card-radius);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.developer-surface:hover {
  transform: translateY(-4px);
  border-color: var(--primary-gold);
}`,
  },
  {
    id: 'python',
    name: 'Python',
    badge: 'Py',
    extension: '.py',
    prismLang: 'python',
    description: 'Python syntax, algorithms & clean scripts',
    descriptionAr: 'لغة بايثون، هياكل البيانات، الخوارزميات والبرمجة النظيفة',
    sampleCode: `# Almdrasa Computational Logic & Data Engineering
def calculate_scholarship_milestone(months_enrolled: int) -> dict:
    evaluation_month = 9
    safety_buffer_months = 3
    
    if months_enrolled < evaluation_month:
        return {"status": "Active Study", "elimination_risk": False}
    elif months_enrolled <= evaluation_month + safety_buffer_months:
        return {"status": "Free Safety Buffer", "extended_support": True}
    else:
        return {"status": "Graduated", "career_ready": True}

print(calculate_scholarship_milestone(months_enrolled=8))`,
  },
];

/**
 * Highlights raw code into VSCode One Dark Pro styled HTML with Prism tokens
 */
export function generateVsCodeSnippetHtml(
  code: string,
  language: CodeLanguageOption,
  isLtr: boolean
): string {
  const prismGrammar = Prism.languages[language.prismLang] || Prism.languages.javascript;
  const highlightedCode = Prism.highlight(code, prismGrammar, language.prismLang);

  const headerTitle = isLtr
    ? `snippet${language.extension} — ${language.name}`
    : `${language.name} — ملف${language.extension}`;

  return `
<div class="vscode-code-container" style="margin:16px 0;border-radius:14px;overflow:hidden;background:#1E1E1E;border:1px solid #333333;box-shadow:0 12px 32px rgba(0,0,0,0.4);font-family:'JetBrains Mono', Consolas, Monaco, monospace;direction:ltr;text-align:left;">
  <!-- VSCode Window Header -->
  <div style="background:#252526;padding:9px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #333333;user-select:none;">
    <div style="display:flex;align-items:center;gap:7px;">
      <span style="width:11px;height:11px;border-radius:50%;background:#FF5F56;display:inline-block;"></span>
      <span style="width:11px;height:11px;border-radius:50%;background:#FFBD2E;display:inline-block;"></span>
      <span style="width:11px;height:11px;border-radius:50%;background:#27C93F;display:inline-block;"></span>
      <span style="color:#CCCCCC;font-size:11.5px;margin-left:10px;font-weight:600;">${headerTitle}</span>
    </div>
    <span style="background:#3C3C3C;color:#DFCA9F;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:0.5px;">${language.badge}</span>
  </div>
  <!-- Code Body with Line Numbers & Syntax Highlighting -->
  <pre class="language-${language.prismLang}" style="margin:0;padding:16px;background:#1E1E1E;color:#D4D4D4;font-size:13px;line-height:1.65;overflow-x:auto;tab-size:2;font-family:'JetBrains Mono', Consolas, Monaco, 'Courier New', monospace;white-space:pre;"><code class="language-${language.prismLang}">${highlightedCode}</code></pre>
</div>
<p><br></p>
`.trim();
}
