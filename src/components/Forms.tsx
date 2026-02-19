import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RISK_LEVELS, COMPLIANCE_STATUS } from "@/lib/index";
import { useI18n } from "@/lib/i18n";

// --- Risk Assessment Form ---

type RiskAssessmentFormValues = {
  title: string;
  category: string;
  riskLevel: "UNACCEPTABLE" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
  assessor: string;
};

export function RiskAssessmentForm({ onSubmit }: { onSubmit: (data: RiskAssessmentFormValues) => void }) {
  const { t } = useI18n();

  const riskAssessmentSchema = useMemo(() => z.object({
    title: z.string().min(2, { message: t('forms.risk.validation.title') }),
    category: z.string().min(1, { message: t('forms.risk.validation.category') }),
    riskLevel: z.enum(["UNACCEPTABLE", "HIGH", "MEDIUM", "LOW"]),
    description: z.string().min(10, { message: t('forms.risk.validation.description') }),
    assessor: z.string().min(2, { message: t('forms.risk.validation.assessor') }),
  }), [t]);

  const form = useForm<RiskAssessmentFormValues>({
    resolver: zodResolver(riskAssessmentSchema),
    defaultValues: {
      title: "",
      category: "",
      riskLevel: "MEDIUM",
      description: "",
      assessor: "",
    },
  });

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          {t('forms.risk.title')}
        </CardTitle>
        <CardDescription>{t('forms.risk.desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('forms.risk.assessmentTitle')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('forms.risk.assessmentTitlePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.risk.category')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('forms.risk.categoryPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.risk.riskLevel')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('forms.risk.riskLevelPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(RISK_LEVELS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {t(value.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('forms.risk.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('forms.risk.descriptionPlaceholder')}
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assessor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('forms.risk.assessor')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('forms.risk.assessorPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
              {t('forms.risk.submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// --- Compliance Form ---

type ComplianceFormValues = {
  title: string;
  standard: string;
  status: "COMPLETED" | "IN_PROGRESS" | "FAILED" | "PENDING";
  score: number;
  findings: number;
};

export function ComplianceForm({ onSubmit }: { onSubmit: (data: ComplianceFormValues) => void }) {
  const { t } = useI18n();

  const complianceSchema = useMemo(() => z.object({
    title: z.string().min(2, { message: t('forms.compliance.validation.title') }),
    standard: z.string().min(1, { message: t('forms.compliance.validation.standard') }),
    status: z.enum(["COMPLETED", "IN_PROGRESS", "FAILED", "PENDING"]),
    score: z.coerce.number().min(0).max(100),
    findings: z.coerce.number().min(0),
  }), [t]);

  const form = useForm<ComplianceFormValues>({
    resolver: zodResolver(complianceSchema),
    defaultValues: {
      title: "",
      standard: "",
      status: "PENDING",
      score: 0,
      findings: 0,
    },
  });

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          {t('forms.compliance.title')}
        </CardTitle>
        <CardDescription>{t('forms.compliance.desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('forms.compliance.reportName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('forms.compliance.reportNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="standard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('forms.compliance.standard')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('forms.compliance.standardPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.compliance.status')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('forms.compliance.statusPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(COMPLIANCE_STATUS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {t(value.label)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.compliance.score')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="findings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.compliance.findings')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {t('forms.compliance.submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// --- AI Service Form ---

type AIServiceFormValues = {
  name: string;
  provider: string;
  version: string;
  status: "ACTIVE" | "INACTIVE" | "DEPRECATED";
  riskScore: number;
};

export function AIServiceForm({ onSubmit }: { onSubmit: (data: AIServiceFormValues) => void }) {
  const { t } = useI18n();

  const aiServiceSchema = useMemo(() => z.object({
    name: z.string().min(2, { message: t('forms.aiService.validation.name') }),
    provider: z.string().min(1, { message: t('forms.aiService.validation.provider') }),
    version: z.string().min(1, { message: t('forms.aiService.validation.version') }),
    status: z.enum(["ACTIVE", "INACTIVE", "DEPRECATED"]),
    riskScore: z.coerce.number().min(0).max(100),
  }), [t]);

  const form = useForm<AIServiceFormValues>({
    resolver: zodResolver(aiServiceSchema),
    defaultValues: {
      name: "",
      provider: "",
      version: "1.0.0",
      status: "ACTIVE",
      riskScore: 0,
    },
  });

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          {t('forms.aiService.title')}
        </CardTitle>
        <CardDescription>{t('forms.aiService.desc')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.aiService.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('forms.aiService.namePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.aiService.provider')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('forms.aiService.providerPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.aiService.version')}</FormLabel>
                    <FormControl>
                      <Input placeholder="1.0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.aiService.status')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('forms.aiService.statusPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">{t('forms.aiService.statusActive')}</SelectItem>
                        <SelectItem value="INACTIVE">{t('forms.aiService.statusInactive')}</SelectItem>
                        <SelectItem value="DEPRECATED">{t('forms.aiService.statusDeprecated')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="riskScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('forms.aiService.riskScore')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>{t('forms.aiService.riskScoreDesc')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {t('forms.aiService.submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
