import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Mail, Upload, X, FileText, ShieldCheck, CheckCircle, Loader2 } from 'lucide-react';
import FuturisticVinesBackground from '../components/ui/FuturisticVinesBackground';
import { Logo } from '../components/ui/Logo';
import { LanguageToggle } from '../components/ui/LanguageToggle';
import { RoleDropdown } from '../components/ui/RoleDropdown';
import { UserRole } from '../types';

export const LoginPage = ({
  onLogin,
  attemptLogin,
  onRegister,
  isAdminUnlocked,
  onUnlock,
  addToast,
  onResetPassword,
  onOAuthLogin
}: {
  onLogin: (role: UserRole, email?: string) => void,
  attemptLogin: (email: string, password: string, role: UserRole) => Promise<string>,
  onRegister: (name: string, email: string, password: string, role: UserRole, docs?: string[]) => Promise<string>,
  isAdminUnlocked: boolean,
  onUnlock: () => void,
  addToast: (msg: string, type: 'success' | 'destructive') => void,
  onResetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>,
  onOAuthLogin: (provider: 'google' | 'facebook', role?: string) => Promise<{ ok: boolean; error?: string }>
}) => {
  const { t } = useTranslation();
  const [role, setRole] = useState<UserRole>(UserRole.CONSUMER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [error, setError] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoadingProvider, setOauthLoadingProvider] = useState<'google' | 'facebook' | null>(null);
  const [regDocs, setRegDocs] = useState<string[]>([]);

  // Task 1: Password Show/Hide
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Task 2: Forgot Password
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSubmitted, setIsForgotSubmitted] = useState(false);

  // Task 3: Password Strength
  const getPasswordStrength = (pw: string) => {
    if (!pw) return { score: 0, label: '', color: 'bg-zinc-200' };
    if (pw.length < 8) return { score: 33, label: 'Weak', color: 'bg-red-500' };
    const hasSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(pw);
    if (hasSpecial) return { score: 100, label: 'Strong', color: 'bg-green-500' };
    return { score: 66, label: 'Fair', color: 'bg-yellow-500' };
  };

  const strength = getPasswordStrength(regPassword);

  // Google SVG icon
  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );

  // Facebook SVG icon
  const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    if (isLoading || oauthLoadingProvider) return;
    setError('');
    setOauthLoadingProvider(provider);
    const result = await onOAuthLogin(provider, role);
    if (!result.ok) {
      setError(result.error || 'Sign-in failed. Please try again.');
      setOauthLoadingProvider(null);
    }
    // If ok, the browser will redirect to the OAuth provider â€” no need to clear loading
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB per file
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const remaining = maxFiles - regDocs.length;
    const filesToProcess = (Array.from(files) as File[]).slice(0, remaining);
    filesToProcess.forEach(file => {
      if (!allowedTypes.includes(file.type)) return;
      if (file.size > maxSize) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setRegDocs(prev => prev.length < maxFiles ? [...prev, dataUrl] : prev);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeDoc = (idx: number) => {
    setRegDocs(prev => prev.filter((_, i) => i !== idx));
  };
  const [showUnlockedModal, setShowUnlockedModal] = useState(false);

  const STATIC_OTP = (import.meta as any).env?.VITE_ADMIN_OTP || '143143';

  const handleOtpSubmit = () => {
    if (isLoading) return;
    setIsLoading(true);
    setOtpError('');
    setTimeout(() => {
      if (otpInput.trim() === STATIC_OTP) {
        setShowOtpModal(false);
        setOtpInput('');
        setOtpError('');
        setIsLoading(false);
        onUnlock();
        setRole(UserRole.ADMIN);
        setShowUnlockedModal(true);
        setTimeout(() => setShowUnlockedModal(false), 3500);
      } else {
        setOtpError('Wrong secret code. Please try again.');
        setIsLoading(false);
      }
    }, 1200);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setIsLoading(true);
    const result = await onResetPassword(forgotEmail.trim().toLowerCase());
    setIsLoading(false);
    if (result.ok) {
      setIsForgotSubmitted(true);
      addToast('We sent a password reset link to your email!', 'success');
    } else {
      addToast(result.error || 'Failed to send reset email. Please try again.', 'destructive');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const result = await attemptLogin(email.trim().toLowerCase(), password, role);
    if (result === 'ok') {
      addToast(`Welcome back!`, 'success');
      onLogin(role, email.trim().toLowerCase());
    } else if (result === 'banned') {
      setError('ðŸš« Your account is locked. Please send a message to our team.');
    } else {
      setError('Wrong email or password. Please try again, or sign up if you are new.');
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    if (regPassword.length < 8) {
      setError('Your password is too short. Please make it 8 characters or more.');
      return;
    }
    // Documents are optional at registration for vendors
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const result = await onRegister(regName.trim(), regEmail.trim().toLowerCase(), regPassword, role, role === UserRole.VENDOR ? regDocs : undefined);
    if (result === 'ok') {
      addToast('Your account is ready! Welcome to AgriPresyo!', 'success');
      onLogin(role, regEmail.trim().toLowerCase());
    } else if (result === 'exists') {
      setError('You already have an account with this email. Please log in.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-4 sm:p-6 relative overflow-hidden text-zinc-900 dark:text-white">
      <FuturisticVinesBackground interactive={true} />
      <div className="absolute top-4 right-4 z-50"><LanguageToggle /></div>
      <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-green-400/10 blur-[60px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-green-400/10 blur-[60px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500 mt-4 sm:mt-8">
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <Logo
            size={80}
            className="text-green-500 mb-4 drop-shadow-[0_0_20px_rgba(34,197,94,0.1)] sm:hidden"
            onUnlock={() => {
              setShowOtpModal(true);
              setOtpInput('');
              setOtpError('');
            }}
          />
          <Logo
            size={120}
            className="text-green-500 mb-6 drop-shadow-[0_0_20px_rgba(34,197,94,0.1)] hidden sm:block"
            onUnlock={() => {
              setShowOtpModal(true);
              setOtpInput('');
              setOtpError('');
            }}
          />
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">
            <span className="text-green-500">Agri</span>
            <span className="text-zinc-700 dark:text-white/80">Presyo</span>
          </h1>
          <p className="text-zinc-500 font-bold mt-2 uppercase tracking-widest text-[10px]">{t('login.tagline')}</p>
        </div>

        <div className="bg-stone-50/80 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-20 w-full">
          <RoleDropdown role={role} setRole={setRole} isAdminUnlocked={isAdminUnlocked} />

          {showRegister ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Logo size={20} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 grayscale dark:brightness-200" />
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    required
                    className={`w-full bg-zinc-50 dark:bg-zinc-900 border ${error && regName.length === 0 ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-inner`}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                {error && regName.length === 0 && <p className="text-red-500 text-xs mt-1 ml-4">Please enter your name.</p>}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-700" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className={`w-full bg-zinc-50 dark:bg-zinc-900 border ${error && regEmail.length === 0 ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-inner`}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                {error && regEmail.length === 0 && <p className="text-red-500 text-xs mt-1 ml-4">Please enter your email.</p>}
                <div className="relative w-full">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-700 z-10" />
                  <input
                    type={showRegPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    className={`w-full bg-zinc-50 dark:bg-zinc-900 border ${error && regPassword.length === 0 ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-inner relative z-0`}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors z-20 flex items-center justify-center"
                    aria-label={showRegPassword ? "Hide password" : "Show password"}
                  >
                    {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {regPassword.length > 0 && (
                  <div className="px-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Password Strength: <span className={strength.color.replace('bg-', 'text-')}>{strength.label}</span></span>
                    </div>
                    <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${strength.color} transition-all duration-500`} 
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
                {error && regPassword.length === 0 && <p className="text-red-500 text-xs mt-1 ml-4">Please enter a password.</p>}

                {/* Vendor Document Upload */}
                {role === UserRole.VENDOR && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">Upload your ID or documents (JPEG, PNG, PDF) â€” You can do this now or later</p>
                    <label className="flex items-center justify-center gap-3 w-full bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-green-500/40 rounded-2xl py-5 cursor-pointer transition-all group">
                      <Upload className="w-5 h-5 text-zinc-600 group-hover:text-green-400 transition-colors" />
                      <span className="text-xs text-zinc-500 group-hover:text-zinc-300 font-bold uppercase tracking-widest transition-colors">Choose Files</span>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        multiple
                        onChange={handleDocUpload}
                        className="hidden"
                      />
                    </label>
                    {regDocs.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {regDocs.map((doc, i) => (
                          <div key={i} className="relative group/doc">
                            {doc.startsWith('data:application/pdf') ? (
                              <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center">
                                <FileText size={20} className="text-red-400" />
                                <span className="text-[8px] text-zinc-500 mt-0.5">PDF</span>
                              </div>
                            ) : (
                              <img src={doc} alt={`Doc ${i + 1}`} className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700" />
                            )}
                            <button
                              type="button"
                              onClick={() => removeDoc(i)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/doc:opacity-100 transition-opacity shadow-lg"
                            >
                              <X size={10} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] text-zinc-600">{regDocs.length}/5 files uploaded</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button type="button" onClick={() => setShowRegister(false)} className="flex-1 bg-zinc-100 dark:bg-black hover:bg-zinc-200 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-800 dark:hover:text-white py-3 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm border border-zinc-200 dark:border-zinc-800 transition-all">{t('actions.backToLogin')}</button>
                <button type="submit" disabled={isLoading} className={`flex-1 bg-green-500 text-black py-3 rounded-2xl font-black uppercase tracking-widest text-xs sm:text-sm hover:scale-105 transition-all ${isLoading ? 'btn-loading btn-loading-glow opacity-80' : ''}`}>{isLoading ? <><span className="btn-spinner" /> <span className="ml-2">{t('login.settingUp')}</span></> : t('actions.signup')}</button>
              </div>
              {error && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-700" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className={`w-full bg-zinc-50 dark:bg-zinc-900 border ${error && email.length === 0 ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-inner`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {error && email.length === 0 && <p className="text-red-500 text-xs mt-1 ml-4">Please enter your email.</p>}
                  <div className="relative w-full">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-700 z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      className={`w-full bg-zinc-50 dark:bg-zinc-900 border ${error && password.length === 0 ? 'border-red-500' : 'border-zinc-200 dark:border-zinc-800'} rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-inner relative z-0`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors z-20 flex items-center justify-center"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {error && password.length === 0 && <p className="text-red-500 text-xs mt-1 ml-4">Please enter your password.</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !!oauthLoadingProvider}
                  className={`w-full border py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${isLoading ? 'bg-green-500 text-black border-green-500 btn-loading btn-loading-glow opacity-90' : 'bg-stone-50 dark:bg-black text-green-600 dark:text-green-500 border-green-500/50 hover:bg-green-500 hover:text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.1)]'}`}
                >
                  {isLoading ? <><span className="btn-spinner" /> <span className="ml-2">{t('login.loggingIn')}</span></> : t('actions.login')}
                </button>
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-green-500 transition-colors"
                  >
                    {t('actions.forgotPassword')}
                  </button>
                </div>
              </form>

              {/* OAuth Sign-in Buttons */}
              {role !== UserRole.ADMIN && (
                <>
                  <div className="oauth-divider">
                    <span>{t('login.orContinueWith')}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('google')}
                      disabled={isLoading || !!oauthLoadingProvider}
                      className="btn-oauth btn-oauth-google"
                    >
                      {oauthLoadingProvider === 'google' ? <><span className="btn-spinner" /> <span className="ml-2">{t('common.loading')}</span></> : <><GoogleIcon /> {t('actions.signInGoogle')}</>}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuthLogin('facebook')}
                      disabled={isLoading || !!oauthLoadingProvider}
                      className="btn-oauth btn-oauth-facebook"
                    >
                      {oauthLoadingProvider === 'facebook' ? <><span className="btn-spinner" /> <span className="ml-2">{t('common.loading')}</span></> : <><FacebookIcon /> {t('actions.signInFacebook')}</>}
                    </button>
                  </div>
                </>
              )}

              {role !== UserRole.ADMIN && (
                <div className="text-center mt-4">
                  <button onClick={() => setShowRegister(true)} className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors">{t('login.newHere')} <span className="text-green-500 font-bold">{t('actions.signUpFree')}</span></button>
                </div>
              )}
              {error && <p className="text-center text-sm text-red-500 mt-2">{error}</p>}
            </>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/70 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-stone-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="text-green-500" size={32} />
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Admin Login</h2>
              <p className="text-zinc-500 text-xs mt-1 text-center">Enter your 6-digit code to continue</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-700" />
                <input
                  type="text"
                  placeholder="Enter Secret Code"
                  maxLength={6}
                  className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-green-400/30 text-zinc-900 dark:text-white text-center text-2xl tracking-[0.5em] font-mono transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 placeholder:text-base placeholder:tracking-normal shadow-inner"
                  value={otpInput}
                  onChange={(e) => {
                    setOtpInput(e.target.value.replace(/[^0-9]/g, ''));
                    setOtpError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleOtpSubmit()}
                  autoFocus
                />
              </div>
              {otpError && <p className="text-center text-sm text-red-500 font-bold">{otpError}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setShowOtpModal(false); setOtpInput(''); setOtpError(''); }}
                  className="flex-1 bg-black hover:bg-zinc-900 text-zinc-500 hover:text-white py-3 rounded-2xl font-black uppercase tracking-widest border border-zinc-800 transition-all text-sm"
                  aria-label="Cancel secret code check"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleOtpSubmit}
                  disabled={isLoading}
                  className={`flex-1 bg-green-500 text-black py-3 rounded-2xl font-black uppercase tracking-widest transition-all text-sm ${isLoading ? 'btn-loading btn-loading-glow opacity-80' : 'hover:scale-105'}`}
                >
                  {isLoading ? <><span className="btn-spinner" /> <span className="ml-1">Checking...</span></> : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task 2: Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/70 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-stone-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[32px] p-8 w-full max-w-sm shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="text-blue-500" size={32} />
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Forgot Password?</h2>
              <p className="text-zinc-500 text-xs mt-1 text-center">Type your email below. We'll send you a link to create a new password.</p>
            </div>
            
            {isForgotSubmitted ? (
              <div className="text-center py-6 animate-in fade-in duration-500">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-500" size={24} />
                </div>
                <p className="text-zinc-900 dark:text-white font-bold mb-2 uppercase tracking-widest text-xs">Email Sent!</p>
                <p className="text-zinc-500 text-xs mb-6">Check your email inbox for the password reset link.</p>
                <button
                  onClick={() => { setShowForgotModal(false); setIsForgotSubmitted(false); }}
                  className="w-full bg-green-500 text-black py-3 rounded-2xl font-black uppercase tracking-widest transition-all text-xs hover:scale-105"
                  aria-label="Back to login after link sent"
                >
                  Back to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-700" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-zinc-900 dark:text-white transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-inner"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForgotModal(false); setForgotEmail(''); }}
                    className="flex-1 bg-black hover:bg-zinc-900 text-zinc-500 hover:text-white py-3 rounded-2xl font-black uppercase tracking-widest border border-zinc-800 transition-all text-xs"
                    aria-label="Cancel forgot password"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 bg-blue-500 text-white py-3 rounded-2xl font-black uppercase tracking-widest transition-all text-xs ${isLoading ? 'btn-loading btn-loading-glow opacity-80' : 'hover:scale-105'}`}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Admin Unlocked Graphic Modal */}
      {showUnlockedModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={() => setShowUnlockedModal(false)}>
          {/* Backdrop with radial gradient */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" style={{ animation: 'adminUnlockFadeIn 0.4s ease-out' }} />

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center" style={{ animation: 'adminUnlockScaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            {/* Glow ring */}
            <div className="absolute w-48 h-48 rounded-full" style={{
              background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)',
              animation: 'adminUnlockGlowPulse 2s ease-in-out infinite',
              top: '-20px'
            }} />

            {/* Shield icon with ring */}
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full border-2 border-green-400/50 flex items-center justify-center" style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(34,197,94,0.25), rgba(0,0,0,0.5))',
                boxShadow: '0 0 40px rgba(34,197,94,0.3), inset 0 0 30px rgba(34,197,94,0.1)',
                animation: 'adminUnlockShieldPulse 1.5s ease-in-out infinite'
              }}>
                <ShieldCheck size={52} className="text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
              </div>
              {/* Ring animation */}
              <div className="absolute inset-[-8px] rounded-full border border-green-400/30" style={{ animation: 'adminUnlockRingExpand 2s ease-out infinite' }} />
              <div className="absolute inset-[-16px] rounded-full border border-green-400/15" style={{ animation: 'adminUnlockRingExpand 2s ease-out infinite 0.5s' }} />
            </div>

            {/* Text */}
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-2" style={{ textShadow: '0 0 30px rgba(34,197,94,0.5)' }}>
              ACCESS <span className="text-green-400">GRANTED</span>
            </h2>
            <p className="text-green-400/80 font-bold uppercase tracking-[0.3em] text-xs mb-4">Admin Mode Unlocked</p>
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" style={{ animation: 'adminUnlockDotPulse 1s ease-in-out infinite' }} />
              <span className="text-green-400 text-xs font-black uppercase tracking-widest">Ready</span>
            </div>

            {/* Tap to dismiss */}
            <p className="text-zinc-600 text-[10px] mt-6 uppercase tracking-widest" style={{ animation: 'adminUnlockFadeIn 1s ease-out 1s both' }}>Tap anywhere to start</p>
          </div>
        </div>
      )}
    </div>
  );
};

