import React, { useState, useMemo } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  ClipboardCheck,
  Cpu,
  FileText,
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  X,
  User,
  Brain,
  Sparkles,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTE_PATHS } from "@/lib/index";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const { t } = useI18n();

  const navItems = useMemo(() => [
    { title: t('nav.dashboard'), path: ROUTE_PATHS.DASHBOARD, icon: LayoutDashboard },
    { title: t('nav.riskAssessment'), path: ROUTE_PATHS.RISK_ASSESSMENT, icon: ShieldCheck },
    { title: t('nav.compliance'), path: ROUTE_PATHS.COMPLIANCE, icon: ClipboardCheck },
    { title: t('nav.aiServices'), path: ROUTE_PATHS.AI_SERVICES, icon: Cpu },
    { title: t('nav.reports'), path: ROUTE_PATHS.REPORTS, icon: FileText },
    { title: t('nav.aiIntelligence'), path: ROUTE_PATHS.AI_INTELLIGENCE, icon: Brain },
    { title: t('nav.sllmStudio'), path: ROUTE_PATHS.SLLM_STUDIO, icon: Sparkles },
  ], [t]);

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="px-6 py-6 flex items-center gap-3">
        <img src="/images/logo-gng.png" alt="GnG International" className="h-10 object-contain" />
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5 transition-colors" />
              <span className="text-sm">{item.title}</span>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 mt-auto border-t border-sidebar-border">
        <div className="bg-accent/30 rounded-xl p-4 mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">{t('layout.currentPlan')}</p>
          <p className="text-sm font-bold text-foreground">{t('layout.planName')}</p>
          <div className="mt-2 w-full bg-muted rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full w-[75%]" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">{t('layout.complianceProgress')}</p>
        </div>

        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">{t('nav.logout')}</span>
        </Button>
      </div>
    </div>
  );
};

const LANG_LABELS: Record<string, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
};

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, lang, setLang } = useI18n();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 border-r border-border overflow-hidden bg-sidebar shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72 border-none">
          <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('layout.search.placeholder')}
                className="bg-accent/50 border-none rounded-full pl-10 pr-4 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(LANG_LABELS) as Array<'ko' | 'en' | 'zh'>).map((l) => (
                  <DropdownMenuItem
                    key={l}
                    onClick={() => setLang(l)}
                    className={cn(lang === l && "font-semibold bg-accent")}
                  >
                    {LANG_LABELS[l]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Button>

            <Separator orientation="vertical" className="h-6 hidden sm:block" />

            <div className="flex items-center gap-3 pl-2 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none text-foreground">{t('layout.user.name')}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{t('layout.user.team')}</p>
              </div>
              <Avatar className="h-9 w-9 border border-border group-hover:border-primary/50 transition-colors">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">
          <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8 px-4 lg:px-8 bg-muted/30">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Top: Brand + Links */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <img src="/images/logo-gng.png" alt="GnG International" className="h-7 object-contain" />
              </div>
              <div className="flex items-center gap-6">
                <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{t('layout.footer.terms')}</Link>
                <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{t('layout.footer.privacy')}</Link>
                <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{t('layout.footer.cookies')}</Link>
                <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">{t('layout.footer.support')}</Link>
              </div>
            </div>

            <Separator />

            {/* Bottom: Company Info + Copyright */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground/80">{t('layout.footer.companyName')}</span>
                  <span className="mx-1.5">|</span>{t('layout.footer.ceo')}
                  <span className="mx-1.5">|</span>{t('layout.footer.bizNo')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t('layout.footer.address')}
                  <span className="mx-1.5">|</span>{t('layout.footer.tel')}
                  <span className="mx-1.5">|</span>{t('layout.footer.email')}
                </p>
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {t('layout.footer.copyright')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
