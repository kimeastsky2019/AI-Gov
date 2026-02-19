import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useI18n, LANGUAGES } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

/* ═══ Social Provider SVG Icons ═══ */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const KakaoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.65 1.727 4.989 4.338 6.357l-1.1 4.083a.3.3 0 00.455.336l4.67-3.074c.533.064 1.08.098 1.637.098 5.523 0 10-3.463 10-7.8C22 6.463 17.523 3 12 3z" fill="#FEE500"/>
    <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.65 1.727 4.989 4.338 6.357l-1.1 4.083a.3.3 0 00.455.336l4.67-3.074c.533.064 1.08.098 1.637.098 5.523 0 10-3.463 10-7.8C22 6.463 17.523 3 12 3z" fill="#FEE500"/>
    <path d="M8.5 9h-1a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h.5v1a.5.5 0 00.854.354L10.207 13H11a.5.5 0 00.5-.5v-3A.5.5 0 0011 9H8.5z" fill="#3C1E1E" opacity="0"/>
  </svg>
);

declare global {
  interface Window {
    google?: any;
    FB?: any;
    Kakao?: any;
  }
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t, lang, setLang } = useI18n();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || t('login.error.invalid'));
    }
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: string) => {
    setError('');
    // In production, these would redirect to OAuth flows.
    // For now, show informational message.
    if (provider === 'google') {
      setError(t('login.social.google.error'));
    } else if (provider === 'facebook') {
      setError(t('login.social.facebook.error'));
    } else if (provider === 'kakao') {
      setError(t('login.social.kakao.error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-4"
          >
            <img src="/images/logo-gng.png" alt="GnG International" className="h-12 object-contain mx-auto" />
          </motion.div>
          {/* Language Switcher */}
          <div className="flex justify-center gap-2 mb-4">
            {(Object.keys(LANGUAGES) as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${lang === l ? 'bg-blue-500 text-white' : 'bg-white/10 text-blue-200/60 hover:bg-white/20'}`}>
                {LANGUAGES[l].flag} {LANGUAGES[l].label}
              </button>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {t('app.name')}
          </h1>
          <p className="text-blue-200/60 mt-2 text-sm">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-0 bg-white/[0.07] backdrop-blur-xl shadow-2xl shadow-black/20">
          <CardContent className="p-8">
            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 font-medium text-sm gap-3 transition-all hover:shadow-md"
                onClick={() => handleSocialLogin('google')}
              >
                <GoogleIcon />
                {t('login.social.google')}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 bg-[#1877F2] hover:bg-[#166FE5] text-white border-0 font-medium text-sm gap-2 transition-all hover:shadow-md"
                  onClick={() => handleSocialLogin('facebook')}
                >
                  <FacebookIcon />
                  {t('login.social.facebook')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 bg-[#FEE500] hover:bg-[#FDD800] text-[#3C1E1E] border-0 font-medium text-sm gap-2 transition-all hover:shadow-md"
                  onClick={() => handleSocialLogin('kakao')}
                >
                  <KakaoIcon />
                  {t('login.social.kakao')}
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-transparent text-blue-200/40 backdrop-blur-sm">
                  {t('login.divider')}
                </span>
              </div>
            </div>

            {/* Error Message */}
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-100/70 text-sm font-medium">{t('login.email.label')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('login.email.placeholder')}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 focus:ring-blue-400/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-100/70 text-sm font-medium">{t('login.password.label')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/40" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('login.password.placeholder')}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-blue-400/50 focus:ring-blue-400/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/40 hover:text-blue-300/70 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 mt-2 gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {t('login.submit')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <span className="text-blue-200/40 text-sm">{t('login.noAccount')} </span>
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                {t('login.register')}
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-blue-200/30 text-xs mt-6">
          &copy; 2026 GnG International. All Rights Reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
