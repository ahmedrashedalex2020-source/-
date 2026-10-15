import React, { useState } from 'react';
import { MenuItem, Category, RestaurantSettings } from '../../types/menu';
import { Download, Upload, FileSpreadsheet, FileJson, Database, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminDataExchangeProps {
  items: MenuItem[];
  categories: Category[];
  settings: RestaurantSettings;
  onBulkImportItems: (items: MenuItem[]) => Promise<{ added: number; updated: number }>;
  lang: 'ar' | 'en';
}

export const AdminDataExchange: React.FC<AdminDataExchangeProps> = ({
  items,
  categories,
  settings,
  onBulkImportItems,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Export to CSV
  const exportItemsToCsv = () => {
    const headers = [
      'id',
      'categoryId',
      'nameAr',
      'nameEn',
      'basePriceBaisa',
      'priceOMR',
      'hasVariants',
      'isAvailable',
      'isPublished',
      'extractionStatus',
      'sourceImage',
    ];

    const rows = items.map((i) => [
      i.id,
      i.categoryId,
      `"${i.nameAr.replace(/"/g, '""')}"`,
      `"${i.nameEn.replace(/"/g, '""')}"`,
      i.basePriceBaisa,
      (i.basePriceBaisa / 1000).toFixed(3),
      i.hasVariants ? 'true' : 'false',
      i.isAvailable ? 'true' : 'false',
      i.isPublished ? 'true' : 'false',
      i.extractionStatus,
      i.sourceImage,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `alexandrian_liver_menu_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Complete Backup JSON
  const exportFullBackupJson = () => {
    const backupData = {
      restaurant: settings,
      categories,
      menuItems: items,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `alexandrian_liver_full_backup_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle JSON file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setImportStatus(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        let incomingItems: MenuItem[] = [];
        if (Array.isArray(parsed)) {
          incomingItems = parsed;
        } else if (parsed.menuItems && Array.isArray(parsed.menuItems)) {
          incomingItems = parsed.menuItems;
        } else {
          throw new Error('Invalid JSON format: Expected array of menu items or backup object.');
        }

        const res = await onBulkImportItems(incomingItems);
        setImportStatus(
          isAr
            ? `تم استيراد ${res.added} عنصر إلى قاعدة البيانات بنجاح!`
            : `Successfully imported ${res.added} items into database!`
        );
      } catch (err: unknown) {
        setImportStatus(err instanceof Error ? err.message : 'Error importing file');
      } finally {
        setIsProcessing(false);
        e.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#E8D8B5]">
        <h2 className="text-xl font-black text-[#392A23] flex items-center gap-2">
          <Database className="w-5 h-5 text-[#A1312E]" />
          <span>{isAr ? 'تصدير واستيراد ونسخ بيانات المطعم' : 'Data Import & Export'}</span>
        </h2>
        <p className="text-xs text-[#755947] mt-0.5">
          {isAr
            ? 'تصدير القوائم إلى جداول Excel / CSV، وتنزيل نسخ احتياطية كاملة واستيراد ملفات البيانات'
            : 'Export menu to CSV or JSON formats, backup the database, or import structured files'}
        </p>
      </div>

      {importStatus && (
        <div className="p-4 bg-[#FFF9EF] border border-[#C58D38] rounded-2xl text-xs font-bold text-[#392A23] flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{importStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8D8B5] space-y-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#A1312E]" />
            <h3 className="text-sm font-bold text-[#392A23]">
              {isAr ? 'تصدير القائمة والنسخ الاحتياطي' : 'Export & Data Backup'}
            </h3>
          </div>

          <p className="text-xs text-[#755947]">
            {isAr
              ? 'تنزيل نسخة من الوجبات والأسعار والأقسام لفتحها في Excel أو حفظها كأرشيف.'
              : 'Download a clean copy of your menu records for spreadsheets or archiving.'}
          </p>

          <div className="space-y-2 pt-2">
            <button
              onClick={exportItemsToCsv}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E8D8B5] hover:border-[#A1312E] hover:bg-[#FFF9EF] transition text-xs font-bold text-[#392A23]"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>{isAr ? 'تصدير الوجبات كملف CSV (Excel)' : 'Export Menu Items to CSV'}</span>
              </div>
              <span className="text-[11px] text-[#755947]">{items.length} records</span>
            </button>

            <button
              onClick={exportFullBackupJson}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E8D8B5] hover:border-[#A1312E] hover:bg-[#FFF9EF] transition text-xs font-bold text-[#392A23]"
            >
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-blue-600" />
                <span>{isAr ? 'تنزيل نسخة احتياطية شاملة (JSON Backup)' : 'Full System Backup (JSON)'}</span>
              </div>
              <span className="text-[11px] text-[#755947]">Full DB</span>
            </button>
          </div>
        </div>

        {/* Import Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8D8B5] space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#A1312E]" />
            <h3 className="text-sm font-bold text-[#392A23]">
              {isAr ? 'استيراد ملفات البيانات (JSON)' : 'Import Menu Data'}
            </h3>
          </div>

          <p className="text-xs text-[#755947]">
            {isAr
              ? 'قم برفع ملف JSON يحتوي على بنية بيانات القائمة لتحديث أو إضافة وجبات بشكل جماعي.'
              : 'Upload a validated JSON file to bulk add or update menu records.'}
          </p>

          <div className="pt-2">
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#C58D38]/50 rounded-2xl cursor-pointer hover:bg-[#FFF9EF] transition">
              <Upload className="w-8 h-8 text-[#A1312E] mb-2" />
              <span className="text-xs font-bold text-[#392A23]">
                {isProcessing
                  ? (isAr ? 'جاري المعالجة...' : 'Processing...')
                  : (isAr ? 'اختر ملف JSON للاستيراد' : 'Click to select JSON file')}
              </span>
              <span className="text-[10px] text-gray-500 mt-1">.json format only</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
