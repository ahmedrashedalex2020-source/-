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
  const FIXED_MENU_URL = 'https://kebdaaskndrany.ct.ws';
  const [targetUrl, setTargetUrl] = useState(FIXED_MENU_URL);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (targetUrl) {
      QRCode.toDataURL(targetUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: '#000000',
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
    <div className="space-y-4 sm:space-y-6 text-[#ededed] font-['Cairo',sans-serif]">
      {/* Header */}
      <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] shadow-sm">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <QrIcon className="w-5 h-5 text-[#00c853]" />
          <span>{isAr ? 'رمز الاستجابة السريعة (QR Code) للمنيو' : 'Menu QR Code'}</span>
        </h2>
        <p className="text-xs text-[#888888] mt-1">
          {isAr
            ? 'توليد وطباعة بطاقات QR لطاولات المطعم لتمكين الزبائن من مسح القائمة مباشرة وفتح المتجر الإلكتروني'
            : 'Generate high-resolution printable table QR codes for customer mobile devices'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* URL Settings & Controls */}
        <div className="bg-[#141414] p-4 sm:p-5 rounded-[12px] border border-[#222222] space-y-4 shadow-sm">
          <h3 className="text-sm font-black text-white">
            {isAr ? 'وجهة رابط القائمة الإلكترونية' : 'Public Menu Destination URL'}
          </h3>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#888888]">
              {isAr ? 'الرابط المستهدف للمسح' : 'Target Menu URL'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="flex-1 bg-[#0e0e0e] border border-[#282828] focus:border-[#00c853] rounded-xl p-2.5 text-xs font-mono text-white outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="p-2.5 bg-[#1c1c1c] hover:bg-[#252525] text-white border border-[#282828] rounded-xl transition cursor-pointer"
                title={isAr ? 'نسخ الرابط' : 'Copy link'}
              >
                {copied ? <Check className="w-4 h-4 text-[#00c853]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#777777]">
              {isAr
                ? 'يتم تحديث رمز QR تلقائياً عند تغيير الرابط أعلاه.'
                : 'QR code updates automatically as URL changes.'}
            </p>
          </div>

          <div className="pt-3 border-t border-[#1f1f1f] flex flex-wrap gap-2.5">
            <button
              onClick={handleDownloadPng}
              disabled={!qrDataUrl}
              className="flex items-center gap-2 bg-[#00c853] hover:bg-[#00b34a] text-black px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تحميل صورة QR (PNG)' : 'Download QR Image'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#252525] text-white border border-[#282828] px-4 py-2.5 rounded-xl text-xs font-black transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? 'طباعة بوستر الطاولة' : 'Print Table Stand'}</span>
            </button>
          </div>
        </div>

        {/* Live Printable Stand Preview */}
        <div className="flex justify-center">
          <div
            ref={printAreaRef}
            className="w-full max-w-sm bg-[#141414] p-6 rounded-[16px] border-2 border-[#282828] shadow-xl text-center space-y-4 print:bg-white print:text-black print:border-none"
          >
            {/* Brand Header */}
            <div className="flex justify-center">
              <BrandLogo size="lg" lightMode={true} />
            </div>

            <div className="border-y border-[#222222] py-2">
              <span className="text-xs font-black text-[#00c853] block">
                {isAr ? 'امسح الرمز لتصفح قائمة الطعام والطلب' : 'SCAN TO VIEW MENU & ORDER'}
              </span>
              <span className="text-[10px] text-[#888888] font-bold">
                {isAr ? 'كبدة إسكندراني • مشاوي • شاورما • حواوشي' : 'Alexandrian Liver • Grills • Shawarma'}
              </span>
            </div>

            {/* QR Code Container */}
            <div className="bg-white p-3 rounded-2xl border-2 border-[#222222] shadow-sm inline-block mx-auto">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Restaurant Menu QR Code"
                  className="w-44 h-44 mx-auto"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-xs text-black">
                  {isAr ? 'جاري توليد الرمز...' : 'Generating QR...'}
                </div>
              )}
            </div>

            {/* Target Menu URL */}
            <div className="bg-[#0e0e0e] print:bg-gray-100 py-1.5 px-3 rounded-xl border border-[#222222] print:border-gray-300">
              <span className="text-xs font-mono font-bold text-[#00c853] print:text-black">
                {targetUrl}
              </span>
            </div>

            {/* Address & Meta */}
            <div className="text-[11px] text-[#888888] font-bold space-y-1">
              <p>📍 {settings.addressAr}</p>
              <p className="text-white">📞 {settings.phone} • 💬 {settings.whatsapp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
