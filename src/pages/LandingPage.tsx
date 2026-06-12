import React, { useState, useCallback, useEffect } from 'react';
import { trackPageEvent } from '@/services/analyticsService';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { HomeSeoHead } from '@/components/seo/HomeSeoHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/use-theme';
import { getSupabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import HeroInbox from '@/components/landing/HeroInbox';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/landing/ScrollReveal';
import FromJobToShortlistSection from '@/components/landing/FromJobToShortlistSection';
import { LandingVideo } from '@/components/landing/LandingVideo';
import VoiceWaveCanvas from '@/components/landing/VoiceWaveCanvas';

const LandingPage: React.FC = () => {
  const { isDark } = useTheme();

  useEffect(() => {
    trackPageEvent('landing_viewed');
  }, []);

  // Preload the alternate-theme posters so toggling between dark/light shows
  // the preview instantly while the matching video streams in.
  useEffect(() => {
    const bases = [
      '/landing/sourcing-borderless',
      '/landing/research-flow',
      '/landing/interview-reel',
      '/landing/manage-flow',
      '/landing/dashboard',
    ];
    const suffix = isDark ? '' : '-dark';
    const handle = window.setTimeout(() => {
      bases.forEach((base) => {
        const img = new Image();
        img.src = `${base}${suffix}-poster.jpg`;
      });
    }, 1500);
    return () => window.clearTimeout(handle);
  }, [isDark]);

  const [demoForm, setDemoForm] = useState({ email: '', message: '' });
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoError, setDemoError] = useState('');

  const handleDemoSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoError('');

    if (!demoForm.email) {
      setDemoError('We\'ll need your email to continue.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demoForm.email)) {
      setDemoError('That email doesn\'t look right. Try again.');
      return;
    }

    setDemoSubmitting(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('demo_requests').insert({
        email: demoForm.email,
        message: demoForm.message || null,
      });
      if (error) throw error;

      void supabase.functions.invoke('send-template-email', {
        body: {
          template: 'demo_request',
          recipientEmail: 'hello@staplehire.com',
          data: { email: demoForm.email, message: demoForm.message },
        },
      }).catch((err) => {
        trackPageEvent('landing_demo_email_failed', { reason: (err as { message?: string })?.message ?? 'unknown' });
      });

      trackPageEvent('landing_pilot_request_click', { location: 'form_submit' });
      setDemoSubmitted(true);
    } catch {
      setDemoError('Something broke on our end. Try again or reach out.');
    } finally {
      setDemoSubmitting(false);
    }
  }, [demoForm]);

  return (
    <SiteLayout>
      <HomeSeoHead />
      <main id="main">
      {/* 1. Hero — Pain-first */}
      <HeroInbox />

      {/* Hero demo — sourcing animation (full-bleed wave behind card) */}
      <section className="relative isolate z-0 min-h-0 overflow-x-clip px-4 pt-2 pb-10 sm:px-6 sm:pt-0 md:pb-20">
        <VoiceWaveCanvas fullBleed className="hidden md:block" />
        <div className="relative z-10 mx-auto min-h-0 w-full max-w-[1170px]">
          <ScrollReveal preset="scaleIn" amount={0}>
            <div className="overflow-hidden rounded-2xl border border-foreground/10 dark:border-white/15 bg-card shadow-2xl ring-1 ring-inset ring-white/0 dark:ring-white/5">
              <LandingVideo
                base="/landing/sourcing-borderless"
                width={1920}
                height={1080}
                alt="Staplehire agent sourcing candidates"
                className="relative z-10 block w-full h-auto rounded-2xl border-[0.5px] border-black dark:border-white"
                eager
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Trust strip — layout from Figma node 1064:2481 */}
      <section className="relative px-4 pt-[calc(0.5rem+32px)] pb-10 sm:px-6 sm:pb-12 md:pt-[calc(1rem+40px)] md:pb-16">
        <div className="max-w-[1170px] mx-auto min-h-0">
          <StaggerContainer className="flex min-h-0 flex-col items-center gap-8 md:gap-12" stagger={0.12}>
            <StaggerItem className="w-full min-h-0">
              <p className="typography-h2 text-center text-foreground">
                Helping teams hire
              </p>
            </StaggerItem>
            <StaggerItem className="w-full min-h-0">
              <div className="flex min-h-0 w-full flex-col items-center justify-center gap-y-6 pl-2 opacity-30 sm:flex-row sm:flex-wrap sm:gap-x-14 sm:gap-y-7 md:gap-x-16 md:gap-y-8">
                <img
                  src={isDark ? '/landing/logos/helloramp-dark.png' : '/landing/logos/helloramp.png'}
                  alt="HelloRamp.ai"
                  width={907}
                  height={144}
                  className="h-7 max-h-7 w-auto shrink-0 object-contain object-center [max-width:min(100%,280px)] sm:h-[42px] sm:max-h-[42px]"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src={isDark ? '/landing/logos/aetherworks-dark.png' : '/landing/logos/aetherworks.png'}
                  alt="Aetherworks"
                  width={777}
                  height={201}
                  className="h-9 max-h-9 w-auto shrink-0 object-contain object-center [max-width:min(100%,260px)] sm:h-[42px] sm:max-h-[42px]"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src={isDark ? '/landing/logos/reva-hr-dark.png' : '/landing/logos/reva-hr.png'}
                  alt="REVA HR Solutions"
                  width={isDark ? 1024 : 572}
                  height={isDark ? 343 : 195}
                  className="h-8 max-h-8 w-auto shrink-0 object-contain object-center [max-width:min(100%,240px)] sm:h-[42px] sm:max-h-[42px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <FromJobToShortlistSection />

      {/* How it works — closing dashboard reveal */}
      <section className="px-4 pt-14 pb-20 sm:px-6 sm:pt-20 md:pb-[calc(5rem+60px)]">
        <div className="max-w-[1280px] mx-auto">
          <StaggerContainer className="text-center mb-8 md:mb-10 space-y-3" stagger={0.12}>
            <StaggerItem>
              <h3 className="typography-h2 text-balance text-foreground">
                Hire faster, hire better
              </h3>
            </StaggerItem>
            <StaggerItem>
              <p className="para-lg text-muted-foreground max-w-[560px] mx-auto">
                Staplehire shows the strongest matches at the top, with interview recordings and signals one click away.
              </p>
            </StaggerItem>
          </StaggerContainer>
          <ScrollReveal preset="scaleIn">
            <div className="aspect-video overflow-hidden rounded-2xl border border-foreground/10 dark:border-white/15 bg-card shadow-2xl ring-1 ring-inset ring-white/0 dark:ring-white/5">
              <LandingVideo
                base="/landing/dashboard"
                width={1920}
                height={1080}
                alt="Staplehire dashboard with ranked shortlist"
                className="block size-full object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonial — layout per Figma 1055:421 */}
      <section className="relative isolate my-16 overflow-x-clip bg-[#F5F3F1] px-4 py-0 sm:my-20 sm:px-6 md:my-[100px] dark:bg-[#1C1C1C]">
        <div className="mx-auto max-w-[1118px]">
          <ScrollReveal>
            <div className="overflow-visible rounded-none">
              <div className="my-0 flex min-w-0 flex-col px-4 py-0 sm:px-8 md:px-10 lg:min-h-0 lg:flex-row lg:items-stretch">
                <div className="relative z-0 flex min-h-0 min-w-0 flex-1 flex-col lg:z-auto lg:justify-center lg:self-stretch lg:border-e lg:border-sh-hustle/50">
                  <div className="relative min-w-0">
                    <div
                      className="pointer-events-none absolute left-0 origin-top-left z-10 w-[min(76px,22vw)] -top-[40px] -translate-y-3 scale-[1.2] -rotate-3 max-[380px]:-top-[32px] sm:-top-[72px] sm:w-[120px] sm:translate-y-0 sm:scale-100 md:-top-[96px] md:w-[160px] lg:-top-[106px] lg:w-[172px] motion-reduce:rotate-0"
                      aria-hidden
                    >
                      <img
                        src={
                          isDark
                            ? '/landing/testimonial-quote-mark-dark.png'
                            : '/landing/testimonial-quote-mark.png'
                        }
                        alt=""
                        className="block h-auto w-full mix-blend-lighten dark:mix-blend-normal"
                        loading="lazy"
                        decoding="async"
                        width={589}
                        height={474}
                      />
                    </div>
                    <div className="relative z-0 min-w-0 pt-12 pb-5 sm:pb-7 md:pb-10">
                      <blockquote className="typography-quote text-balance break-words text-foreground">
                        We hired 3 people in two weeks. Staplehire sped up how fast we surfaced standout candidates alongside our existing process. My team could focus on shipping.
                      </blockquote>
                      <figcaption className="mt-8 sm:mt-10 md:mt-12">
                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-8 md:gap-10">
                          <img
                            src="/landing/testimonial-suresh.jpg"
                            alt=""
                            className="size-14 shrink-0 rounded-full border-[3px] border-sh-hustle object-cover sm:size-[72px] sm:border-4 md:size-[88px]"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="min-w-0 space-y-2 sm:space-y-3 font-outfit">
                            <p className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 break-words text-[16px] leading-[1.4] text-muted-foreground sm:text-[18px] md:gap-x-3 lg:text-[20px]">
                              <span>Suresh Krishnamurthy</span>
                              <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground/70" aria-hidden />
                              <span>Founder and CEO</span>
                            </p>
                            <p className="font-semibold text-[18px] leading-[1.3] text-foreground sm:text-[22px] md:text-[26px]">
                              <cite className="font-semibold not-italic">HelloRamp.ai</cite>
                            </p>
                          </div>
                        </div>
                      </figcaption>
                    </div>
                  </div>
                </div>
                <div className="relative z-0 hidden min-h-0 min-w-0 w-full shrink-0 self-stretch border-t border-sh-hustle/50 lg:z-auto lg:flex lg:w-[min(100%,402px)] lg:flex-col lg:border-t-0">
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-1.5 px-2 py-4 text-center sm:gap-3 sm:px-4 sm:py-6 md:gap-3.5 md:py-8 lg:flex-1 lg:border-b lg:border-sh-hustle/50 lg:py-8">
                    <p className="font-outfit text-[13px] font-normal leading-[1.4] text-muted-foreground sm:text-[14px] md:text-[16px] lg:para-lg">
                      Completed interviews
                    </p>
                    <p className="font-outfit text-[34px] font-medium leading-none tracking-tight text-foreground sm:text-[44px] md:text-[80px] lg:text-[96px]">
                      50+
                    </p>
                  </div>
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-center gap-1.5 border-s border-sh-hustle/50 px-2 py-4 text-center sm:gap-3 sm:px-4 sm:py-6 md:gap-3.5 md:py-8 lg:flex-1 lg:border-s-0 lg:py-8">
                    <p className="font-outfit text-[13px] font-normal leading-[1.4] text-muted-foreground sm:text-[14px] md:text-[16px] lg:para-lg">
                      Interview minutes completed
                    </p>
                    <p className="font-outfit text-[34px] font-medium leading-none tracking-tight text-foreground sm:text-[44px] md:text-[80px] lg:text-[96px]">
                      350+
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. CTA — dramatic treatment */}
      <section id="demo" className="relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-14 md:py-20">
        <div className="max-w-[1118px] mx-auto relative z-10">
          <StaggerContainer className="text-center mb-14" stagger={0.14}>
            <StaggerItem>
              <h2 className="typography-h2 mb-5 text-balance text-foreground">
                <span className="block">Find your people</span>
                <span className="block">with Staplehire</span>
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="mx-auto max-w-[624px] font-outfit text-[16px] font-light leading-[1.65] text-muted-foreground sm:text-[17px] md:text-[19px] md:leading-[1.7]">
                Try Staplehire on your next role. Early access is open.
              </p>
            </StaggerItem>
          </StaggerContainer>

          <ScrollReveal delay={0.1} className="max-w-[400px] mx-auto">
            <div className="relative">
              {demoSubmitted ? (
                <div className="relative z-10 flex min-h-[44px] items-center justify-center py-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center justify-center gap-4"
                  >
                    <CheckCircle2 className="size-5 text-[#2BA316]" strokeWidth={1.8} />
                    <p className="text-center font-normal text-sm leading-none text-muted-foreground">
                      Thanks! We'll be in touch shortly
                    </p>
                  </motion.div>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-4 relative z-10">
                  <div className="space-y-2">
                    <Label htmlFor="demo-email" className="font-outfit font-medium text-foreground">Work email</Label>
                    <Input
                      id="demo-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      placeholder="jane@company.com"
                      value={demoForm.email}
                      onChange={(e) => setDemoForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-white dark:bg-input/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="demo-context" className="font-outfit font-medium text-foreground">
                      What you're hiring for
                    </Label>
                    <Textarea
                      id="demo-context"
                      placeholder="e.g. 2 SDRs and a founding engineer"
                      value={demoForm.message}
                      onChange={(e) => setDemoForm(prev => ({ ...prev, message: e.target.value }))}
                      className="resize-none bg-white dark:bg-input/30"
                      rows={3}
                    />
                  </div>

                  {demoError && (
                    <div role="alert" aria-live="assertive" className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                      <p className="text-sm text-destructive font-medium">{demoError}</p>
                    </div>
                  )}

                  <div className="flex justify-center pt-2">
                    <Button
                      type="submit"
                      disabled={demoSubmitting}
                      className="rounded-full px-6 h-[46px] font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                    >
                      {demoSubmitting ? (
                        <>
                          <Loader2 className="size-5 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Request access
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section aria-label="Staplehire tagline" className="relative isolate overflow-hidden px-4 pt-12 pb-12 sm:px-6 sm:pt-16 sm:pb-14 md:pt-20 md:pb-20">
        <div className="relative z-10 max-w-[1118px] mx-auto text-center">
          <ScrollReveal>
            <p className="font-outfit font-bold leading-[1.2] text-foreground text-balance text-3xl sm:text-4xl md:text-[56px] md:whitespace-nowrap">
              <span className="relative inline-block overflow-visible pb-[0.3em]">
                Where great teams start.
                <svg
                  className="pointer-events-none absolute left-1/2 bottom-0 h-[0.4em] w-[calc(50%-40px)] md:w-[calc(100%-80px)] -translate-x-1/2 overflow-visible text-sh-hustle"
                  viewBox="0 0 320 14"
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    className="[stroke-width:4] md:[stroke-width:3]"
                    d="M 6 9 C 76 11 118 11.7 160 10.8 C 202 10.4 248 10.8 314 9"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="nonScalingStroke"
                  />
                </svg>
              </span>
            </p>
          </ScrollReveal>
        </div>
      </section>
      </main>
    </SiteLayout>
  );
};

export function Component() {
  return <LandingPage />;
}

export default LandingPage;
