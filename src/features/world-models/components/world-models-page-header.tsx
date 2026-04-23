export function WorldModelsPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_-55px_rgba(15,23,42,0.38)] dark:border-slate-800 dark:bg-slate-950 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_35%),radial-gradient(circle_at_right,rgba(34,197,94,0.10),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_right,rgba(34,197,94,0.10),transparent_30%)]" />
      <div className="relative">
        <div className="inline-flex items-center rounded-full border border-sky-200/80 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-300">
          {eyebrow}
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl md:leading-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>
    </section>
  );
}
