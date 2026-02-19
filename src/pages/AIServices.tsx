import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Activity,
  ShieldAlert,
  CheckCircle2,
  MoreVertical,
  Cpu,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { MetricCard } from '@/components/Cards';
import { AIServiceForm } from '@/components/Forms';
import { AIService } from '@/lib/index';
import { mockAIServices } from '@/data/index';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AIAssistantPanel } from '@/components/AIAssistantPanel';
import { AIAssistantInline } from '@/components/AIAssistantInline';
import { Brain as BrainIcon } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const AIServices: React.FC = () => {
  const { t } = useI18n();
  const [services, setServices] = useState<AIService[]>(mockAIServices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddService = (data: any) => {
    const newService: AIService = {
      id: `SVC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: data.name,
      provider: data.provider,
      version: data.version,
      status: 'ACTIVE',
      riskScore: 0,
      lastAssessmentDate: new Date().toISOString().split('T')[0],
      complianceLevel: 0,
    };

    setServices([newService, ...services]);
    setIsFormOpen(false);
    toast.success(t('aiServices.toast.registered'));
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = services.filter(s => s.status === 'ACTIVE').length;
  const highRiskCount = services.filter(s => s.riskScore > 60).length;
  const avgCompliance = Math.round(services.reduce((acc, s) => acc + s.complianceLevel, 0) / services.length);

  const statusLabel = useMemo(() => ({
    ACTIVE: t('aiServices.status.active'),
    INACTIVE: t('aiServices.status.inactive'),
    DISCONTINUED: t('aiServices.status.discontinued'),
  }), [t]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('aiServices.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('aiServices.pageDesc')}
            </p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:opacity-90 transition-opacity">
                <Plus className="mr-2 h-4 w-4" />
                {t('aiServices.registerNew')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-xl">{t('aiServices.registerTitle')}</DialogTitle>
                <DialogDescription>
                  {t('aiServices.registerDesc')}
                </DialogDescription>
              </DialogHeader>
              <AIServiceForm onSubmit={handleAddService} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title={t('aiServices.metric.total')}
            value={services.length}
            change="+2"
            trend="up"
          />
          <MetricCard
            title={t('aiServices.metric.active')}
            value={activeCount}
            change="+1"
            trend="up"
          />
          <MetricCard
            title={t('aiServices.metric.riskAttention')}
            value={highRiskCount}
            change="-1"
            trend="down"
          />
          <MetricCard
            title={t('aiServices.metric.avgCompliance')}
            value={`${avgCompliance}%`}
            change="+5.2%"
            trend="up"
          />
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="bg-muted/50 mb-6">
            <TabsTrigger value="services" className="data-[state=active]:bg-background">
              <Cpu className="h-4 w-4 mr-1.5" />
              {t('aiServices.tab.services')}
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="data-[state=active]:bg-background gap-1.5">
              <BrainIcon className="h-4 w-4" />
              {t('aiServices.tab.aiAssistant')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-0 space-y-6">

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('aiServices.search.placeholder')}
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                {t('aiServices.filter')}
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <RefreshCw className="mr-2 h-4 w-4" />
                {t('aiServices.refresh')}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[250px]">{t('aiServices.table.serviceName')}</TableHead>
                  <TableHead>{t('aiServices.table.provider')}</TableHead>
                  <TableHead>{t('aiServices.table.status')}</TableHead>
                  <TableHead>{t('aiServices.table.riskScore')}</TableHead>
                  <TableHead>{t('aiServices.table.compliance')}</TableHead>
                  <TableHead>{t('aiServices.table.lastAssessment')}</TableHead>
                  <TableHead className="text-right">{t('aiServices.table.manage')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service, index) => (
                  <motion.tr
                    key={service.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-accent/50 transition-colors cursor-default"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <Cpu className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{service.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{service.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-foreground">{service.provider}</div>
                      <div className="text-xs text-muted-foreground">{service.version}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={service.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className={service.status === 'ACTIVE' ? 'bg-chart-4/20 text-chart-4 border-chart-4/30' : ''}
                      >
                        {statusLabel[service.status as keyof typeof statusLabel] ?? service.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-semibold ${
                          service.riskScore > 60 ? 'text-destructive' :
                          service.riskScore > 30 ? 'text-chart-2' : 'text-chart-4'
                        }`}>
                          {service.riskScore}
                        </div>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              service.riskScore > 60 ? 'bg-destructive' :
                              service.riskScore > 30 ? 'bg-chart-2' : 'bg-chart-4'
                            }`}
                            style={{ width: `${service.riskScore}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span>{t('aiServices.table.complianceRate')}</span>
                          <span className="font-medium">{service.complianceLevel}%</span>
                        </div>
                        <Progress value={service.complianceLevel} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {service.lastAssessmentDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>{t('aiServices.action.label')}</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <Activity className="mr-2 h-4 w-4 text-primary" />
                            {t('aiServices.action.monitor')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <ShieldAlert className="mr-2 h-4 w-4 text-chart-2" />
                            {t('aiServices.action.reassess')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <CheckCircle2 className="mr-2 h-4 w-4 text-chart-4" />
                            {t('aiServices.action.complianceDetail')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive cursor-pointer">
                            {t('aiServices.action.deactivate')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredServices.length === 0 && (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">{t('aiServices.noResults')}</h3>
              <p className="text-muted-foreground">{t('aiServices.noResultsDesc')}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">{t('aiServices.performance.title')}</h3>
              <Badge variant="outline" className="bg-chart-4/10 text-chart-4 border-chart-4/20">
                {t('aiServices.performance.normal')}
              </Badge>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">{t('aiServices.performance.avgResponse')}</div>
                  <div className="text-xl font-bold">245ms</div>
                  <div className="text-[10px] text-chart-4 mt-1">▼ 12ms</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">{t('aiServices.performance.errorRate')}</div>
                  <div className="text-xl font-bold text-chart-4">0.04%</div>
                  <div className="text-[10px] text-chart-4 mt-1">{t('aiServices.performance.stable')}</div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground mb-1">{t('aiServices.performance.availability')}</div>
                  <div className="text-xl font-bold">99.98%</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{t('aiServices.performance.slaCompliant')}</div>
                </div>
              </div>
              <div className="h-[200px] w-full bg-muted/10 rounded-lg border border-dashed border-border flex items-center justify-center">
                <span className="text-muted-foreground text-sm italic">{t('aiServices.performance.chartPlaceholder')}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary rounded-xl p-6 text-primary-foreground shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2">{t('aiServices.governance.title')}</h3>
              <p className="text-primary-foreground/80 text-sm mb-6">
                {t('aiServices.governance.desc')}
              </p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t('aiServices.governance.check1')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t('aiServices.governance.check2')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t('aiServices.governance.check3')}</span>
                </div>
              </div>
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-semibold">
                {t('aiServices.governance.generate')}
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {/* Background Pattern */}
            <div className="absolute -right-12 -bottom-12 opacity-10">
              <Cpu className="w-48 h-48 rotate-12" />
            </div>
          </div>
        </div>

          </TabsContent>

          <TabsContent value="ai-assistant" className="mt-0">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <AIAssistantInline
                  context="ai-services"
                  title={t('aiServices.aiAssistant.title')}
                  description={t('aiServices.aiAssistant.desc')}
                  contextData={JSON.stringify({
                    totalServices: services.length,
                    activeCount,
                    highRiskCount,
                    avgCompliance,
                    services: services.map(s => ({
                      id: s.id, name: s.name, provider: s.provider,
                      status: s.status, riskScore: s.riskScore,
                      complianceLevel: s.complianceLevel,
                    })),
                    performance: { avgResponseTime: '245ms', errorRate: '0.04%', availability: '99.98%' },
                  })}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Assistant (floating) */}
      <AIAssistantPanel
        context="ai-services"
        title={t('aiServices.aiAssistant.title')}
        contextData={JSON.stringify({
          totalServices: services.length,
          activeCount,
          highRiskCount,
          avgCompliance,
          services: services.map(s => ({
            id: s.id, name: s.name, provider: s.provider,
            status: s.status, riskScore: s.riskScore,
            complianceLevel: s.complianceLevel,
          })),
          performance: { avgResponseTime: '245ms', errorRate: '0.04%', availability: '99.98%' },
        })}
      />
    </Layout>
  );
};

export default AIServices;
