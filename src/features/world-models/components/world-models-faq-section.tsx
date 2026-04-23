import Script from 'next/script';

type FaqItem = {
  question: string;
  answer: string;
};

export function WorldModelsFaqSection({
  title,
  items,
  scriptId,
}: {
  title: string;
  items: FaqItem[];
  scriptId: string;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-55px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-950">
      <Script
        id={scriptId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
        {title}
      </h2>
      <div className="mt-4 grid gap-4">
        {items.map((item) => (
          <div
            key={item.question}
            className="rounded-[20px] border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60"
          >
            <h3 className="text-base font-semibold text-slate-950 dark:text-white">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
