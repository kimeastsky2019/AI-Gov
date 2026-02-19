import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Activity,
  FileText,
  ArrowRight,
  Lock,
  CheckCircle2,
  Zap,
  BarChart3,
  Search,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IMAGES } from '@/assets/images';
import { ROUTE_PATHS } from '@/lib';
import { MetricCard, ProcessCard } from '@/components/Cards';
import { useI18n, LANGUAGES } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

const Home: React.FC = () => {
  const { t, lang, setLang } = useI18n();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {/* Navigation - Landing Version */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/images/logo-gng.png" alt="GnG International" className="h-9 object-contain" />
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">{t('home.features')}</a>
            <a href="#process" className="hover:text-primary transition-colors">{t('home.process')}</a>
            <a href="#security" className="hover:text-primary transition-colors">{t('home.security')}</a>
          </nav>
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1">
              {(Object.keys(LANGUAGES) as Lang[]).map(l => (
                <button key={l} onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${lang === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-primary'}`}>
                  {LANGUAGES[l].flag}
                </button>
              ))}
            </div>
            <Button variant="ghost" asChild>
              <Link to="/login">{t('home.cta.login')}</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Link to="/register">{t('home.cta.trial')}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="max-w-2xl"
              >
                <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
                  <Zap className="w-3 h-3" />
                  <span>{t('home.hero.badge')}</span>
                </motion.div>
                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight"
                >
                  {t('home.hero.h1a')} <br />
                  <span className="text-primary">{t('home.hero.h1b')}</span>, AIGov
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="text-xl text-muted-foreground mb-8 leading-relaxed"
                >
                  {t('home.hero.desc')}
                </motion.p>
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="h-14 px-8 text-lg bg-primary">
                    <Link to={ROUTE_PATHS.DASHBOARD}>
                      {t('home.cta.dashboard')} <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                    {t('home.cta.contact')}
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
                  <img
                    src={IMAGES.DASHBOARD_1}
                    alt="AI Governance Dashboard"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              </motion.div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </section>

        {/* Key Metrics Section */}
        <section className="py-16 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6">
              <MetricCard
                title={t('home.metric1.title')}
                value={t('home.metric1.value')}
                change={t('home.metric1.change')}
                trend="up"
              />
              <MetricCard
                title={t('home.metric2.title')}
                value={t('home.metric2.value')}
                change={t('home.metric2.change')}
                trend="up"
              />
              <MetricCard
                title={t('home.metric3.title')}
                value={t('home.metric3.value')}
                change={t('home.metric3.change')}
                trend="down"
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">{t('home.features.title')}</h2>
              <p className="text-muted-foreground text-lg">
                {t('home.features.desc')}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Search, title: t('home.feat1.title'), desc: t('home.feat1.desc') },
                { icon: Globe, title: t('home.feat2.title'), desc: t('home.feat2.desc') },
                { icon: Activity, title: t('home.feat3.title'), desc: t('home.feat3.desc') },
                { icon: FileText, title: t('home.feat4.title'), desc: t('home.feat4.desc') },
                { icon: Lock, title: t('home.feat5.title'), desc: t('home.feat5.desc') },
                { icon: CheckCircle2, title: t('home.feat6.title'), desc: t('home.feat6.desc') }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-2xl border border-border bg-card hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">{t('home.process.title')}</h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                  {t('home.process.desc')}
                </p>
                <div className="space-y-4">
                  <ProcessCard
                    title={t('home.step1.title')}
                    description={t('home.step1.desc')}
                    status={t('home.step1.status')}
                    icon={<Search className="w-5 h-5" />}
                  />
                  <ProcessCard
                    title={t('home.step2.title')}
                    description={t('home.step2.desc')}
                    status={t('home.step2.status')}
                    icon={<BarChart3 className="w-5 h-5" />}
                  />
                  <ProcessCard
                    title={t('home.step3.title')}
                    description={t('home.step3.desc')}
                    status={t('home.step3.status')}
                    icon={<Activity className="w-5 h-5" />}
                  />
                  <ProcessCard
                    title={t('home.step4.title')}
                    description={t('home.step4.desc')}
                    status={t('home.step4.status')}
                    icon={<CheckCircle2 className="w-5 h-5" />}
                  />
                </div>
              </div>
              <div className="relative">
                <img
                  src={IMAGES.AI_SAFETY_8}
                  alt="Governance Process"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-primary p-6 rounded-2xl shadow-xl text-primary-foreground max-w-xs">
                  <p className="text-sm font-medium opacity-90">Expert Insight</p>
                  <p className="text-lg font-bold">{t('home.insight')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-[2.5rem] overflow-hidden relative">
              <div className="absolute inset-0 opacity-20">
                <img
                  src={IMAGES.SECURITY_5}
                  alt="Security Background"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 px-8 py-20 lg:p-24 flex flex-col items-center text-center">
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  {t('home.security.title')}
                </h2>
                <p className="text-primary-foreground/80 text-lg max-w-2xl mb-12">
                  {t('home.security.desc')}
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Lock className="w-5 h-5" /> {t('home.security.iso')}
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <ShieldCheck className="w-5 h-5" /> {t('home.security.gdpr')}
                  </div>
                  <div className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle2 className="w-5 h-5" /> {t('home.security.soc')}
                  </div>
                </div>
                <Button size="lg" variant="secondary" className="mt-12 h-14 px-10 text-lg" asChild>
                  <Link to={ROUTE_PATHS.DASHBOARD}>{t('home.cta.start')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <img src="/images/logo-gng.png" alt="GnG International" className="h-7 object-contain" />
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">{t('home.footer.terms')}</a>
              <a href="#" className="hover:text-primary transition-colors">{t('home.footer.privacy')}</a>
              <a href="#" className="hover:text-primary transition-colors">{t('home.footer.cookies')}</a>
              <a href="#" className="hover:text-primary transition-colors">{t('home.footer.support')}</a>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('app.copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
