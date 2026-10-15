import React from 'react';
import { useAuth, BOOTSTRAP_ADMIN_EMAIL } from '../../context/AuthContext';
import { BrandLogo } from '../brand/BrandLogo';
import { Lock, ShieldAlert, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { user, isAdmin, signInWithGoogle, signOutUser, authError, loading } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-md rounded-3xl border border-[#E8D8B5] shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 ltr:right-4 rtl:left-4 p-2 text-gray-400 hover:text-gray-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <BrandLogo size="md" />
          </div>
          <h3 className="text-xl font-bold text-[#392A23]">
            تسجيل دخول الإدارة / Admin CMS
          </h3>
          <p className="text-xs text-[#755947] mt-1">
            بوابة المشرف المعتمد لإدارة الأسعار وقوائم الطعام
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#FFF9EF] border border-[#E8D8B5] rounded-2xl">
              <span className="text-xs text-[#755947] block font-medium">الحساب الحالي:</span>
              <p className="text-sm font-bold text-[#392A23] truncate">{user.email}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isAdmin
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isAdmin ? 'مشرف معتمد (Authorized Admin)' : 'غير مصرح (Unauthorized)'}
                </span>
              </div>
            </div>

            {!isAdmin && (
              <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                بريد المشرف الرئيسي المعتمد هو: <br />
                <strong className="select-all font-mono text-[11px]">{BOOTSTRAP_ADMIN_EMAIL}</strong>
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={signOutUser}
                className="flex-1 py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition"
              >
                تسجيل الخروج
              </button>
              {isAdmin && (
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-[#A1312E] hover:bg-[#862724] text-white rounded-xl text-xs font-bold transition"
                >
                  متابعة إلى لوحة التحكم
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-[#755947] leading-relaxed text-center">
              لتعديل الأسعار وإدارة الأقسام والمنتجات، يرجى تسجيل الدخول بحساب Google المعتمد.
            </p>

            <button
              onClick={() => signInWithGoogle()}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 py-3 px-4 rounded-xl font-bold text-sm shadow-xs transition hover:border-[#C58D38]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>تسجيل الدخول عبر Google</span>
            </button>

            <div className="text-[11px] text-[#755947]/70 text-center flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5 text-[#C58D38]" />
              <span>حساب المدير المعتمد: {BOOTSTRAP_ADMIN_EMAIL}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
