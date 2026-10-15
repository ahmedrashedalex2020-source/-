import React, { useState, useEffect, useRef } from 'react';
import { RestaurantSettings } from '../../types/menu';
import { BrandLogo } from '../brand/BrandLogo';
import QRCode from 'qrcode';
import { Download, Printer, Copy, Check, QrCode as QrIcon } from 'lucide-react';

interface AdminQRCodeProps {
  settings: RestaurantSettings;
  lang: 'ar' | 'en';
}

export const AdminQRCode: React.FC<AdminQRCodeProps> = ({ settings, lang }) => {
  const isAr = lang === 'ar';
  const [targetUrl, setTargetUrl] = useState(
    settings.publicMenuUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetUrl) {
      QRCode.toDataURL(targetUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: '#392A23',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [targetUrl]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Alexandrian-Liver-Menu-QR.png`;
    a.click();
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8D8B5]">
        <h2 className="text-xl font-black text-[#392A23] flex items-center gap-2">
          <QrIcon className="w-5 h-5 text-[#A1312E]" />
          <span>{isAr ? 'إدارة وطباعة رمز الاستجابة السريعة (QR Code)' : 'QR Code Management'}</span>
        </h2>
        <p className="text-xs text-[#755947] mt-0.5">
          {isAr
            ? 'توليد وطباعة بطاقات QR لطاولات المطعم لتمكين الزبائن من مسح القائمة مباشرة على هواتفهم'
            : 'Generate high-resolution printable table QR codes for customer mobile devices'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URL Settings & Controls */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8D8B5] space-y-4">
          <h3 className="text-sm font-bold text-[#392A23]">
            {isAr ? 'وجهة رابط القائمة الإلكترونية' : 'Public Menu Destination URL'}
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#755947]">
              {isAr ? 'الرابط المستهدف للمسح' : 'Menu URL to encode in QR'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="flex-1 bg-[#FFF9EF] border border-[#E8D8B5] rounded-xl p-2.5 text-xs font-mono text-[#392A23] outline-hidden focus:border-[#A1312E]"
              />
              <button
                onClick={handleCopyUrl}
                className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                title={isAr ? 'نسخ الرابط' : 'Copy link'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-gray-500">
              {isAr
                ? 'يتم تحديث رمز QR تلقائياً عند تغيير الرابط أعلاه.'
                : 'QR code updates automatically as URL changes.'}
            </p>
          </div>

          <div className="pt-4 border-t border-[#E8D8B5] flex flex-wrap gap-3">
            <button
              onClick={handleDownloadPng}
              disabled={!qrDataUrl}
              className="flex items-center gap-2 bg-[#A1312E] hover:bg-[#862724] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تحميل صورة QR بدقة عالية (PNG)' : 'Download QR Image (PNG)'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#392A23] hover:bg-[#201713] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? 'طباعة بطاقة الطاولة المجهزة' : 'Print Table Stand Poster'}</span>
            </button>
          </div>
        </div>

        {/* Live Printable Stand Preview */}
        <div className="flex justify-center">
          <div
            ref={printAreaRef}
            className="w-full max-w-sm bg-[#FFF9EF] p-6 rounded-3xl border-4 border-[#C58D38] shadow-xl text-center space-y-4 print:border-none print:shadow-none"
          >
            {/* Brand Header */}
            <div className="flex justify-center">
              <BrandLogo size="lg" />
            </div>

            <div className="border-y border-[#E8D8B5] py-2">
              <span className="text-xs font-extrabold text-[#A1312E] block">
                {isAr ? 'امسح الرمز لتصفح قائمة الطعام' : 'SCAN TO VIEW OUR DIGITAL MENU'}
              </span>
              <span className="text-[10px] text-[#755947] font-semibold">
                {isAr ? 'كبدة إسكندراني • مشاوي • شاورما • عيوش' : 'Alexandrian Liver • Grills • Shawarma'}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#E8D8B5] shadow-xs inline-block mx-auto">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Restaurant Menu QR Code"
                  className="w-48 h-48 mx-auto"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-gray-400">
                  {isAr ? 'جاري توليد الرمز...' : 'Generating QR...'}
                </div>
              )}
            </div>

            {/* Address & Meta */}
            <div className="text-[11px] text-[#755947] font-bold space-y-1">
              <p>📍 {settings.addressAr}</p>
              <p className="text-[#A1312E]">📞 {settings.phone} • 💬 {settings.whatsapp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
