import React, { useState } from 'react';
import {
  Globe,
  Server,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FolderTree,
  UploadCloud,
  FileCode,
  HelpCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface AdminHostingGuideProps {
  lang: 'ar' | 'en';
}

export const AdminHostingGuide: React.FC<AdminHostingGuideProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const nsRecords = [
    { name: 'Nameserver 1', value: 'ns1.epizy.com' },
    { name: 'Nameserver 2', value: 'ns2.epizy.com' },
    { name: 'Alternative NS 1', value: 'ns1.infinityfree.com' },
    { name: 'Alternative NS 2', value: 'ns2.infinityfree.com' },
  ];

  const htaccessContent = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#18110D] text-white p-6 rounded-2xl shadow-xl border border-slate-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                دليل ربط الدومين واستضافة InfinityFree
                <span className="text-xs bg-emerald-500 text-slate-900 font-extrabold px-2.5 py-0.5 rounded-full">
                  شرح مصري خطوة بخطوة 🇪🇬
                </span>
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                ازاي ترفع مشروع المنيو الإلكتروني بتاعك على InfinityFree وتربطه بدومين مخصص وتخليه يشتغل بسرعة وبدون أي أخطاء.
              </p>
            </div>
          </div>

          <a
            href="https://dash.infinityfree.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition"
          >
            <span>لوحة تحكم InfinityFree</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1: DNS & Nameservers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D8B5]/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black text-sm flex items-center justify-center">
                  1
                </span>
                <h3 className="text-lg font-black text-[#392A23]">
                  ربط الـ DNS والـ Nameservers
                </h3>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                أهم خطوة
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              عشان موقع InfinityFree يقبل الدومين بتاعك (سواء اشتريته من GoDaddy، Namecheap، أو أي شركة)، لازم الأول تغير الـ <strong>Nameservers (NS)</strong> لـ سيرفرات InfinityFree:
            </p>

            <div className="space-y-2 mb-4">
              {nsRecords.slice(0, 2).map((ns, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div>
                    <span className="text-xs text-gray-500 font-bold block">{ns.name}</span>
                    <span className="font-mono text-sm font-black text-slate-800">{ns.value}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(ns.value, ns.value)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold transition shadow-sm"
                  >
                    {copiedKey === ns.value ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                💡 معلومة مهمة من لوحة InfinityFree:
              </p>
              <p>
                بعد ما تغير الـ Nameservers في موقع الدومين، استنى من 15 دقيقة لحد ساعتين (انتشار الـ DNS)، وبعدين افتح لوحة InfinityFree واضغط <strong>"Add Custom Domain"</strong> واكتب الدومين بتاعك.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Build & Files */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D8B5]/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-black text-sm flex items-center justify-center">
                  2
                </span>
                <h3 className="text-lg font-black text-[#392A23]">
                  تجهيز ملفات المشروع (Build)
                </h3>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                جاهز ومحمي
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              المشروع معمول بـ React + Vite، يعني موقع ثابت سريع جداً (SPA). الملفات المجهزة بتتحط جوة مجلد اسمه <code>dist</code>:
            </p>

            <div className="bg-slate-900 text-slate-100 p-3.5 rounded-xl font-mono text-xs mb-4 flex items-center justify-between">
              <span>npm run build</span>
              <button
                onClick={() => copyToClipboard('npm run build', 'npmbuild')}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded transition"
              >
                {copiedKey === 'npmbuild' ? 'تم النسخ!' : 'نسخ الأمر'}
              </button>
            </div>

            <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-3.5 space-y-2 text-xs text-emerald-900">
              <p className="font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                ملف .htaccess تم إعداده تلقائياً!
              </p>
              <p className="text-emerald-800">
                أضفنا ملف <code>.htaccess</code> مخصوص لسيرفر Apache الخاص بـ InfinityFree عشان لما الزبون يعمل Refresh أو يفتح رابط مباشر ما يظهرلوش خطأ 404.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Upload to htdocs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D8B5]/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-black text-sm flex items-center justify-center">
                  3
                </span>
                <h3 className="text-lg font-black text-[#392A23]">
                  الرفع إلى مجلد htdocs في الاستضافة
                </h3>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md">
                عبر FTP أو File Manager
              </span>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2.5">
                <FolderTree className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">افتح مجلد htdocs:</strong>
                  <span className="text-xs text-gray-500">
                    في لوحة InfinityFree، افتح "Online File Manager" أو استخدم FileZilla، وادخل مجلد <code>htdocs</code>.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">احذف الملفات الافتراضية:</strong>
                  <span className="text-xs text-gray-500">
                    امسح أي ملف تجريبي قديم زي <code>default.php</code> أو <code>index2.html</code> لو كان موجود.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <UploadCloud className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900">ارفع محتويات مجلد dist:</strong>
                  <span className="text-xs text-gray-500">
                    ارفع الملفات اللي جوة dist مباشرة (ملف <code>index.html</code> ومجلد <code>assets</code> وملف <code>.htaccess</code>).
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Real-time Cloud Sync */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8D8B5]/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                  4
                </span>
                <h3 className="text-lg font-black text-[#392A23]">
                  تزامن الأسعار والطلبات سحابياً
                </h3>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                Firebase Firestore
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              المشروع مربوط بـ Firebase Firestore السحابي. الميزة الكبرى هنا:
            </p>

            <ul className="space-y-2 text-xs text-gray-700 mb-4">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>أي تعديل لسعر أو إضافة وجبة أو تعديل رقم الواتساب بيظهر للزبائن <strong>فوراً</strong> بدون إعادة رفع الملفات!</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>لوحة التحكم محمية بحساب المدير وكلمة السر، ومتاحة على أي جهاز بتدخل منه.</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>رسائل واتساب تجميع الطلبات بتشتغل مباشرة على أرقام هواتف الزبائن ورقم المطعم.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* htaccess Viewer Box */}
      <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">محتوى ملف .htaccess (جاهز للتحميل والنسخ)</span>
          </div>
          <button
            onClick={() => copyToClipboard(htaccessContent, 'htaccess')}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition"
          >
            {copiedKey === 'htaccess' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>تم نسخ الملف!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ محتوى .htaccess</span>
              </>
            )}
          </button>
        </div>
        <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-3 bg-slate-950 rounded-xl">
          {htaccessContent}
        </pre>
      </div>
    </div>
  );
};
