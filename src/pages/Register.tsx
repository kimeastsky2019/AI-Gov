import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Eye, EyeOff, Mail, Lock, User, Building2, Briefcase, Phone,
  AlertCircle, CheckCircle2, ArrowRight, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useI18n, LANGUAGES } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

/* ═══ Social Icons (same as Login) ═══ */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);
const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.65 1.727 4.989 4.338 6.357l-1.1 4.083a.3.3 0 00.455.336l4.67-3.074c.533.064 1.08.098 1.637.098 5.523 0 10-3.463 10-7.8C22 6.463 17.523 3 12 3z" fill="#FEE500"/>
  </svg>
);

interface FormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  company: string;
  title: string;
  phone: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, lang, setLang } = useI18n();

  const [form, setForm] = useState<FormData>({
    name: '', email: '', password: '', passwordConfirm: '',
    company: '', title: '', phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const updateField = (field: keyof FormData, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // Password strength
  const getPasswordStrength = (pw: string): { score: number; label: string; color: string } => {
    if (!pw) return { score: 0, label: '', color: '' };
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 1) return { score: 20, label: t('register.pwStrength.veryWeak'), color: 'bg-red-500' };
    if (s === 2) return { score: 40, label: t('register.pwStrength.weak'), color: 'bg-orange-500' };
    if (s === 3) return { score: 60, label: t('register.pwStrength.fair'), color: 'bg-yellow-500' };
    if (s === 4) return { score: 80, label: t('register.pwStrength.strong'), color: 'bg-green-500' };
    return { score: 100, label: t('register.pwStrength.veryStrong'), color: 'bg-emerald-500' };
  };

  const pwStrength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password) {
      setError(t('register.error.required'));
      return;
    }
    if (form.password.length < 6) {
      setError(t('register.error.passwordLength'));
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError(t('register.error.passwordMatch'));
      return;
    }
    if (!agreeTerms) {
      setError(t('register.error.terms'));
      return;
    }

    setIsLoading(true);
    const result = await register({
      email: form.email,
      password: form.password,
      name: form.name,
      company: form.company || undefined,
      title: form.title || undefined,
      phone: form.phone || undefined,
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || t('register.error.required'));
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-3"
          >
            <img src="/images/logo-gng.png" alt="GnG International" className="h-10 object-contain mx-auto" />
          </motion.div>
          {/* Language Switcher */}
          <div className="flex justify-center gap-2 mb-3">
            {(Object.keys(LANGUAGES) as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${lang === l ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-200/60 hover:bg-white/20'}`}>
                {LANGUAGES[l].flag} {LANGUAGES[l].label}
              </button>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{t('register.title')}</h1>
          <p className="text-blue-200/50 mt-1 text-sm">{t('register.subtitle')}</p>
        </div>

        <Card className="border-0 bg-white/[0.07] backdrop-blur-xl shadow-2xl shadow-black/20">
          <CardContent className="p-8">
            {/* Social Register */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <Button
                type="button"
                variant="outline"
                className="h-11 bg-white hover:bg-gray-50 text-gray-600 border-gray-200 text-xs gap-2"
                onClick={() => setError(t('login.social.google.error'))}
              >
                <GoogleIcon /> {t('register.social.google')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 bg-[#1877F2] hover:bg-[#166FE5] text-white border-0 text-xs gap-2"
                onClick={() => setError(t('login.social.facebook.error'))}
              >
                <FacebookIcon /> {t('register.social.facebook')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 bg-[#FEE500] hover:bg-[#FDD800] text-[#3C1E1E] border-0 text-xs gap-2"
                onClick={() => setError(t('login.social.kakao.error'))}
              >
                <KakaoIcon /> {t('register.social.kakao')}
              </Button>
            </div>

            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 text-blue-200/40">{t('register.divider')}</span>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Required: Name & Email */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-blue-100/70 text-xs font-medium flex items-center gap-1">
                    <User className="w-3 h-3" /> {t('register.name.label')} <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    placeholder={t('register.name.placeholder')}
                    value={form.name}
                    onChange={e => updateField('name', e.target.value)}
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 text-sm"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-blue-100/70 text-xs font-medium flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {t('register.email.label')} <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder={t('register.email.placeholder')}
                    value={form.email}
                    onChange={e => updateField('email', e.target.value)}
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-blue-100/70 text-xs font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" /> {t('register.password.label')} <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('register.password.placeholder')}
                      value={form.password}
                      onChange={e => updateField('password', e.target.value)}
                      className="h-11 pr-9 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-300/40 hover:text-blue-300/70"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${pwStrength.color} transition-all`} style={{ width: `${pwStrength.score}%` }} />
                      </div>
                      <span className="text-[10px] text-blue-200/50">{pwStrength.label}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-blue-100/70 text-xs font-medium">{t('register.passwordConfirm.label')} <span className="text-red-400">*</span></Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('register.passwordConfirm.placeholder')}
                      value={form.passwordConfirm}
                      onChange={e => updateField('passwordConfirm', e.target.value)}
                      className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 text-sm"
                      required
                    />
                    {form.passwordConfirm && form.password === form.passwordConfirm && (
                      <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Optional: Company & Title */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-blue-100/70 text-xs font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {t('register.company.label')}
                  </Label>
                  <Input
                    placeholder={t('register.company.placeholder')}
                    value={form.company}
                    onChange={e => updateField('company', e.target.value)}
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-blue-100/70 text-xs font-medium flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> {t('register.jobTitle.label')}
                  </Label>
                  <Input
                    placeholder={t('register.jobTitle.placeholder')}
                    value={form.title}
                    onChange={e => updateField('title', e.target.value)}
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="text-blue-100/70 text-xs font-medium flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {t('register.phone.label')}
                </Label>
                <Input
                  type="tel"
                  placeholder={t('register.phone.placeholder')}
                  value={form.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 text-sm"
                />
              </div>

              {/* Terms */}
              <label className="flex items-start gap-2.5 cursor-pointer group mt-2">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-4.5 h-4.5 w-[18px] h-[18px] rounded border border-white/20 bg-white/5 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                    {agreeTerms && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </div>
                <span className="text-blue-200/50 text-xs leading-relaxed group-hover:text-blue-200/70 transition-colors">
                  {t('register.termsAgree')}{' '}
                  <span className="text-blue-300/70 underline cursor-pointer">{t('register.terms')}</span>{' & '}
                  <span className="text-blue-300/70 underline cursor-pointer">{t('register.privacy')}</span>
                </span>
              </label>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 mt-1 gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t('register.submit')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t('register.hasAccount')}
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-blue-200/30 text-xs mt-5">
          &copy; 2026 GnG International. All Rights Reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
