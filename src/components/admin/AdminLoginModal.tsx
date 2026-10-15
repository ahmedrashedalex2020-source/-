import React, { useState } from 'react';
import {
  useAuth,
  BOOTSTRAP_ADMIN_EMAIL,
  DEFAULT_MASTER_PIN,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD,
} from '../../context/AuthContext';
import { BrandLogo } from '../brand/BrandLogo';
import {
  Lock,
  User,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  X,
  Clock,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  Delete,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  configuredUsername?: string;
  configuredPassword?: string;
  configuredPin?: string;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  configuredUsername,
  configuredPassword,
  configuredPin,
  onSuccess,
}) => {
  const {
    isAdmin,
    isPinUnlocked,
    signInWithGoogle,
    unlockWithCredentials,
    unlockWithPin,
    lockAdmin,
    authError,
    sessionNotice,
    clearAuthError,
    clearSessionNotice,
  } = useAuth();

  // Primary method is now Username & Password
  const [activeMethod, setActiveMethod] = useState<'credentials' | 'pin' | 'google'>('credentials');
  
  // Credentials state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // PIN state
  const [pinInput, setPinInput] = useState('');
  const [isErrorShake, setIsErrorShake] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const directAdminLink = 'https://kebdaaskndrany.ct.ws/#admin';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directAdminLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput) return;

    const ok = unlockWithCredentials(
      usernameInput,
      passwordInput,
      configuredUsername,
      configuredPassword
    );

    if (ok) {
      setUsernameInput('');
      setPasswordInput('');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);
    }
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput.trim().length === 0) return;

    const ok = unlockWithPin(pinInput, configuredPin);
    if (ok) {
      setPinInput('');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setIsErrorShake(true);
      setTimeout(() => setIsErrorShake(false), 500);
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pinInput.length < 8) {
      const next = pinInput + val;
      setPinInput(next);
      if (next.length === (configuredPin?.length || 4)) {
        setTimeout(() => {
          const ok = unlockWithPin(next, configuredPin);
          if (ok) {
            setPinInput('');
            if (onSuccess) onSuccess();
            onClose();
          } else {
            setIsErrorShake(true);
            setTimeout(() => setIsErrorShake(false), 500);
          }
        }, 80);
      }
    }
  };

  const handleKeypadBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
  };

  const handleKeypadClear = () => {
    setPinInput('');
    clearAuthError();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={`relative bg-[#141414] w-full max-w-md rounded-[16px] border border-[#262626] shadow-2xl p-5 sm:p-7 overflow-hidden text-[#ededed] font-['Cairo',sans-serif] ${
          isErrorShake ? 'animate-bounce' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00c853] via-emerald-400 to-[#00c853]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-[#777777] hover:text-white hover:bg-[#1c1c1c] rounded-full transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <BrandLogo size="md" lightMode={true} />
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center gap-2">
            <span>تسجيل الدخول إلى لوحة التحكم</span>
            <span className="text-[10px] bg-[#00c853]/15 text-[#00c853] px-2 py-0.5 rounded-full font-bold border border-[#00c853]/30">
              Admin
            </span>
          </h3>
          <p className="text-xs text-[#888888] font-medium mt-0.5">
            لوحة الإدارة المشفرة لمطعم كبدة إسكندراني
          </p>
        </div>

        {/* Direct Link Banner */}
        <div className="mb-4 p-2.5 bg-[#0e0e0e] border border-[#222222] rounded-xl flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 truncate">
            <ExternalLink className="w-3.5 h-3.5 text-[#00c853] shrink-0" />
            <span className="text-[#888888] text-[11px] truncate">
              رابط الدخول المباشر: <code className="text-[#00c853] font-mono font-bold">kebdaaskndrany.ct.ws/#admin</code>
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="shrink-0 inline-flex items-center gap-1 bg-[#1c1c1c] hover:bg-[#252525] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold border border-[#282828] transition cursor-pointer"
            title="نسخ الرابط المباشر"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00c853]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'تم النسخ' : 'نسخ'}</span>
          </button>
        </div>

        {/* Session Inactivity Alert Notice */}
        {sessionNotice && (
          <div className="mb-4 p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{sessionNotice}</span>
              <button
                onClick={clearSessionNotice}
                className="block mt-1 font-bold underline hover:text-amber-200"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {authError && (
          <div className="mb-4 p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">
              <span className="font-semibold">{authError}</span>
            </div>
            <button
              onClick={clearAuthError}
              className="text-rose-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* If Already Authenticated */}
        {isAdmin ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#1c1c1c] border border-[#282828] rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-[#00c853]" />
                <span className="text-xs text-[#00c853] font-bold">
                  {isPinUnlocked ? 'الجلسة مفتوحة بصلاحيات المشرف' : 'مفتوح عبر حساب المشرف المعتمد'}
                </span>
              </div>
              <p className="text-xs text-[#888888] mt-1">
                لديك كافة الصلاحيات لإدارة الوجبات والأسعار واستقبال الطلبات ومتابعة الإحصائيات.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  lockAdmin();
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 border border-[#282828] hover:bg-[#1c1c1c] text-[#888888] hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                قفل الجلسة والخروج
              </button>
              <button
                onClick={() => {
                  if (onSuccess) onSuccess();
                  onClose();
                }}
                className="flex-1 py-2.5 px-4 bg-[#00c853] hover:bg-[#00b34a] text-black rounded-xl text-xs font-black transition cursor-pointer shadow-md"
              >
                متابعة للوحة التحكم
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Toggle Method Tabs */}
            <div className="flex rounded-xl bg-[#0b0b0b] border border-[#222222] p-1 mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveMethod('credentials');
                  clearAuthError();
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeMethod === 'credentials'
                    ? 'bg-[#1c1c1c] text-[#00c853] shadow-xs'
                    : 'text-[#777777] hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>يوزر وباسورد</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMethod('pin');
                  clearAuthError();
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeMethod === 'pin'
                    ? 'bg-[#1c1c1c] text-[#00c853] shadow-xs'
                    : 'text-[#777777] hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>رمز PIN</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMethod('google');
                  clearAuthError();
                }}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeMethod === 'google'
                    ? 'bg-[#1c1c1c] text-[#00c853] shadow-xs'
                    : 'text-[#777777] hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Google</span>
              </button>
            </div>

            {/* METHOD 1: USERNAME & PASSWORD */}
            {activeMethod === 'credentials' && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#aaaaaa] mb-1">
                    اسم المستخدم (Username)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-3 pr-10 py-2.5 border border-[#282828] focus:border-[#00c853] rounded-xl bg-[#0e0e0e] text-white text-sm font-bold outline-none"
                    />
                    <div className="absolute right-3 top-3 text-[#666666] pointer-events-none">
                      <User className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#aaaaaa] mb-1">
                    كلمة المرور (Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 border border-[#282828] focus:border-[#00c853] rounded-xl bg-[#0e0e0e] text-white text-sm font-bold outline-none"
                    />
                    <div className="absolute right-3 top-3 text-[#666666] pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-2.5 text-[#666666] hover:text-white p-0.5 cursor-pointer"
                      title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Default Credentials Hint */}
                <div className="bg-[#0e0e0e] p-2.5 rounded-xl border border-[#222222] text-[11px] text-[#888888] flex items-center justify-between">
                  <div>
                    <span>اليوزر الافتراضي: </span>
                    <strong className="text-white font-mono">{configuredUsername || DEFAULT_ADMIN_USERNAME}</strong>
                  </div>
                  <div>
                    <span>الباسورد: </span>
                    <strong className="text-[#00c853] font-mono">{configuredPassword || DEFAULT_ADMIN_PASSWORD}</strong>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={!usernameInput.trim() || !passwordInput}
                  className="w-full py-2.5 px-4 bg-[#00c853] hover:bg-[#00b34a] active:scale-98 disabled:opacity-40 text-black rounded-xl text-xs font-black shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>دخول لوحة التحكم</span>
                </button>
              </form>
            )}

            {/* METHOD 2: PIN KEYPAD */}
            {activeMethod === 'pin' && (
              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#aaaaaa] mb-1.5 text-center">
                    أدخل رمز الحماية السري (PIN)
                  </label>

                  {/* PIN Display Dots */}
                  <div className="flex justify-center items-center gap-2.5 my-3">
                    {[0, 1, 2, 3].map((idx) => {
                      const isFilled = pinInput.length > idx;
                      return (
                        <div
                          key={idx}
                          className={`w-11 h-12 rounded-xl flex items-center justify-center text-lg font-black transition-all ${
                            isFilled
                              ? 'bg-[#1c1c1c] text-[#00c853] border-2 border-[#00c853] shadow-md scale-105'
                              : 'bg-[#0e0e0e] text-[#444444] border border-[#222222]'
                          }`}
                        >
                          {isFilled ? '●' : ''}
                        </div>
                      );
                    })}
                  </div>

                  <input
                    type="password"
                    maxLength={8}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="اكتب الرمز هنا..."
                    className="w-full text-center text-sm font-mono tracking-widest px-3 py-2 border border-[#282828] rounded-xl bg-[#0e0e0e] text-white focus:outline-none focus:border-[#00c853]"
                  />
                </div>

                {/* Touch Keypad (0-9) */}
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => handleKeypadPress(digit)}
                      className="h-11 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] active:scale-95 text-white hover:text-[#00c853] font-bold text-base transition flex items-center justify-center border border-[#262626] shadow-xs cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleKeypadClear}
                    className="h-11 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] active:scale-95 text-[#777777] hover:text-white font-bold text-xs transition flex items-center justify-center border border-[#262626] cursor-pointer"
                  >
                    مسح
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKeypadPress('0')}
                    className="h-11 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] active:scale-95 text-white hover:text-[#00c853] font-bold text-base transition flex items-center justify-center border border-[#262626] shadow-xs cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={handleKeypadBackspace}
                    className="h-11 rounded-xl bg-[#1c1c1c] hover:bg-rose-950/40 hover:text-rose-400 active:scale-95 text-[#777777] transition flex items-center justify-center border border-[#262626] cursor-pointer"
                    aria-label="Backspace"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={pinInput.trim().length === 0}
                  className="w-full py-2.5 px-4 bg-[#00c853] hover:bg-[#00b34a] active:scale-98 disabled:opacity-40 text-black rounded-xl text-xs font-black shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4 stroke-[2.5]" />
                  <span>فتح برمز PIN</span>
                </button>

                <div className="text-[11px] text-[#777777] text-center">
                  رمز PIN الافتراضي: <strong className="text-white font-mono">{configuredPin || DEFAULT_MASTER_PIN}</strong>
                </div>
              </form>
            )}

            {/* METHOD 3: GOOGLE SIGN IN */}
            {activeMethod === 'google' && (
              <div className="space-y-4 py-2">
                <p className="text-xs text-[#888888] leading-relaxed text-center">
                  دخول مباشر لمالك ومسؤول المطعم عبر بريد Google المعتمد.
                </p>

                <button
                  onClick={() => signInWithGoogle()}
                  className="w-full flex items-center justify-center gap-3 bg-[#1c1c1c] hover:bg-[#252525] border border-[#282828] text-white py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition hover:border-[#00c853] cursor-pointer"
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
                  <span>تسجيل الدخول بحساب Google المعتمد</span>
                </button>

                <div className="text-[11px] text-[#777777] text-center flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#00c853]" />
                  <span>البريد المعتمد: {BOOTSTRAP_ADMIN_EMAIL}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
