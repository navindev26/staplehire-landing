import { Head } from 'vite-react-ssg';

const HOME_TITLE =
  'Staplehire — AI hiring agent that sources, interviews & shortlists candidates';
const HOME_DESCRIPTION =
  'Staplehire is an AI hiring agent that sources top talent, runs first-round interviews, and delivers a ranked shortlist with interview recordings and signals — so you wake up to your next hire.';
const SITE_URL = 'https://staplehire.com';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Staplehire',
      url: `${SITE_URL}/`,
      logo: OG_IMAGE,
      description: 'AI hiring agent that sources, interviews, and shortlists candidates.',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'Staplehire',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Staplehire',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: 'https://app.staplehire.com/',
      description: HOME_DESCRIPTION,
      publisher: { '@id': `${SITE_URL}/#organization` },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Early access — request a demo on the website.',
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does Staplehire do?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Staplehire is an AI hiring agent that sources candidates, runs structured first-round interviews, and ranks applicants with interview recordings and hiring signals.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Staplehire interview candidates?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Candidates complete async voice interviews on their schedule. Staplehire scores answers against your hiring bar and saves recordings for your team to review.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who is Staplehire for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Founders and hiring teams who want to move faster on sourcing and screening without adding recruiter headcount.',
          },
        },
      ],
    },
  ],
};

export function HomeSeoHead() {
  return (
    <Head>
      <title>{HOME_TITLE}</title>
      <meta name="description" content={HOME_DESCRIPTION} />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#1c1c1c" media="(prefers-color-scheme: dark)" />
      <meta name="author" content="Staplehire" />
      <link rel="canonical" href={`${SITE_URL}/`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}/`} />
      <meta property="og:title" content={HOME_TITLE} />
      <meta property="og:description" content={HOME_DESCRIPTION} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="537" />
      <meta property="og:image:alt" content="Staplehire — your AI hiring agent" />
      <meta property="og:site_name" content="Staplehire" />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={HOME_TITLE} />
      <meta name="twitter:description" content={HOME_DESCRIPTION} />
      <meta name="twitter:image" content={OG_IMAGE} />
      <meta name="twitter:image:alt" content="Staplehire — your AI hiring agent" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}
