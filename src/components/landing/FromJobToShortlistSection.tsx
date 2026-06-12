import { StaggerContainer, StaggerItem } from '@/components/landing/ScrollReveal';
import { LandingVideo } from '@/components/landing/LandingVideo';

type Step = {
  title: string;
  body: string;
  base: string;
  width: number;
  height: number;
  aspect?: string;
};

const STEPS: Step[] = [
  {
    title: 'Source',
    body: 'Tell Staplehire what you\'re hiring for. It sources qualified candidates and brings back profiles, references, and fit signals on each one.',
    base: '/landing/research-flow',
    width: 1080,
    height: 1200,
    aspect: 'aspect-[9/10]',
  },
  {
    title: 'Interview',
    body: 'The agent runs structured interviews on the candidate\'s schedule. It catches contradictions, grades every answer against your bar, and saves the recording for you to review.',
    base: '/landing/interview-reel',
    width: 1080,
    height: 1440,
    aspect: 'aspect-[3/4]',
  },
  {
    title: 'Manage',
    body: 'Every candidate in one place, ranked by fit. Open one to see signals, the interview recording, and the analysis behind their score.',
    base: '/landing/manage-flow',
    width: 1080,
    height: 1200,
    aspect: 'aspect-[9/10]',
  },
];

export default function FromJobToShortlistSection() {
  return (
    <section
      id="features"
      className="relative scroll-mt-[88px] overflow-x-clip px-4 py-12 sm:px-6 md:py-20"
      aria-labelledby="from-job-to-shortlist-heading"
    >
      <div className="relative z-10 mx-auto flex max-w-[1170px] flex-col items-center gap-10 md:gap-24">
        <StaggerContainer className="w-full max-w-[859px] text-center" stagger={0.14}>
          <StaggerItem>
            <h2
              id="from-job-to-shortlist-heading"
              className="typography-h2 text-balance text-foreground"
            >
              How it works
            </h2>
          </StaggerItem>
        </StaggerContainer>

        <div className="flex w-full flex-col gap-28 sm:gap-16 md:gap-28">
          {STEPS.map((step, index) => {
            const isReversed = index % 2 === 1;
            const visualPreset = isReversed ? 'slideRight' : 'slideLeft';
            return (
              <StaggerContainer
                key={step.title}
                id={step.title.toLowerCase()}
                stagger={0.18}
                className="grid w-full scroll-mt-[88px] grid-cols-1 items-center gap-8 md:gap-14 lg:grid-cols-2"
              >
                <StaggerItem
                  preset={visualPreset}
                  className={`order-2 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <div className={`${step.aspect ?? 'aspect-video'} overflow-hidden rounded-2xl border border-foreground/10 dark:border-white/15 bg-card shadow-lg ring-1 ring-inset ring-white/0 dark:ring-white/5`}>
                    <LandingVideo
                      base={step.base}
                      width={step.width}
                      height={step.height}
                      alt={`Staplehire ${step.title.toLowerCase()} — ${step.body.slice(0, 80)}…`}
                      className="block size-full object-cover"
                    />
                  </div>
                </StaggerItem>
                <StaggerItem
                  className={`order-1 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <div className="space-y-4 max-w-[528px] mx-auto text-center lg:mx-0 lg:text-left">
                    <h3 className="typography-h3 text-balance text-foreground">
                      {step.title}
                    </h3>
                    <p className="para-lg text-muted-foreground">{step.body}</p>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            );
          })}
        </div>
      </div>
    </section>
  );
}
