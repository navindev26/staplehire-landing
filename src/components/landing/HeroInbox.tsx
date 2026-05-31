import { trackPageEvent } from '@/services/analyticsService';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HeroInbox() {
  return (
    <section id="features" className="relative isolate overflow-x-clip overflow-y-visible px-4 pt-14 pb-10 sm:px-6 md:pt-28 md:pb-20 md:overflow-hidden">
      {/* Dramatic gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[900px] pointer-events-none -z-10">
        <div className="absolute top-[100px] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(85,171,237,0.04),transparent_70%)] blur-[60px]" />
        <div className="absolute top-[80px] right-[20%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(181,150,229,0.04),transparent_70%)] blur-[60px]" />
      </div>

      <div className="max-w-[1560px] mx-auto relative z-10">
        {/* Headline */}
        <div className="max-w-[840px] lg:max-w-[920px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="typography-h1 max-lg:text-balance lg:text-pretty">
              <span className="lg:block">Your hiring agent.</span>{' '}
              <span className="lg:block">Sources, researches and interviews.</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 para-lg text-muted-foreground max-w-[720px] md:max-w-[660px] mx-auto"
          >
            Staplehire finds top talent, runs the first interview, and highlights your best people with interview recordings and signals.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex justify-center"
          >
            <a href="#demo" onClick={() => trackPageEvent('landing_pilot_request_click', { location: 'hero' })}>
              <Button className="rounded-full px-6 h-[46px] font-bold text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                Request access
              </Button>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
