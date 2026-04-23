import { localizeText } from './content/localize';
import { loadWorldModelsContent } from './content/loaders';

type HubListItem = {
  slug: string;
  title: string;
  summary: string;
  meta: string;
  href: string;
};

type SeoHubData = {
  key: string;
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: Array<{
    title: string;
    type: 'papers' | 'projects' | 'updates';
    items: HubListItem[];
  }>;
  relatedLinks: Array<{
    href: string;
    label: string;
    description: string;
  }>;
  faq: Array<{ question: string; answer: string }>;
};

type SeoHubKey =
  | 'latest-world-model-papers'
  | 'world-model-projects'
  | 'physical-ai-world-models'
  | 'embodied-ai-papers';

function sortByDateDesc<T>(items: T[], getDate: (item: T) => string | undefined) {
  return [...items].sort((a, b) => {
    const left = new Date(getDate(a) ?? 0).getTime();
    const right = new Date(getDate(b) ?? 0).getTime();
    return right - left;
  });
}

export async function getSeoHubData(
  key: SeoHubKey,
  locale: string
): Promise<SeoHubData> {
  const content = await loadWorldModelsContent();
  const isZh = locale === 'zh';

  const paperItem = (paper: (typeof content.papers)[number]): HubListItem => ({
    slug: paper.slug,
    title: localizeText(paper, locale, 'title_zh', 'title_en'),
    summary: localizeText(
      paper,
      locale,
      'editorial_summary_zh',
      'editorial_summary_en'
    ),
    meta: `${paper.paper_venue} · ${paper.year}`,
    href: `/papers/${paper.slug}`,
  });

  const projectItem = (project: (typeof content.projects)[number]): HubListItem => ({
    slug: project.slug,
    title: project.name,
    summary: localizeText(
      project,
      locale,
      'editorial_summary_zh',
      'editorial_summary_en'
    ),
    meta: `${project.organization} · ${project.type.replace('-', ' ')}`,
    href: `/projects/${project.slug}`,
  });

  const updateItem = (update: (typeof content.updates)[number]): HubListItem => ({
    slug: update.slug,
    title: localizeText(update, locale, 'title_zh', 'title_en'),
    summary: localizeText(update, locale, 'summary_zh', 'summary_en'),
    meta: `${update.date} · ${update.source_name}`,
    href: `/updates/${update.slug}`,
  });

  if (key === 'latest-world-model-papers') {
    const latestPapers = sortByDateDesc(content.papers, (item) => item.publication_date);
    return {
      key,
      path: '/latest-world-model-papers',
      title: isZh ? '最新世界模型论文' : 'Latest World Model Papers',
      description: isZh
        ? '按时间追踪世界模型相关论文，快速查看最近值得读的研究。'
        : 'Track recent world-model papers and scan the research worth reading next.',
      eyebrow: isZh ? '论文聚合页' : 'Paper hub',
      intro: isZh
        ? '这个页面按发布时间汇总世界模型相关论文，适合用来追踪最近一段时间的研究脉络。'
        : 'This page groups world-model papers by recency so readers can follow how the research frontier is moving.',
      sections: [
        {
          title: isZh ? '最新论文' : 'Latest papers',
          type: 'papers',
          items: latestPapers.slice(0, 12).map(paperItem),
        },
      ],
      relatedLinks: [
        {
          href: '/papers',
          label: isZh ? '查看全部论文' : 'Browse all papers',
          description: isZh ? '进入完整论文索引。' : 'Open the full papers index.',
        },
        {
          href: '/topics/world-models',
          label: isZh ? '世界模型专题' : 'World models topic',
          description: isZh ? '从专题页进入领域地图。' : 'Use the topic page as a field map.',
        },
      ],
      faq: [
        {
          question: isZh ? '这个页面适合怎么用？' : 'How should readers use this page?',
          answer: isZh
            ? '如果你想快速补最近的研究动态，这个页面最适合按时间扫一遍，然后再点进对应专题页深入。'
            : 'Use it as a recency-first scan, then jump into topic pages when a paper points to a deeper branch.',
        },
      ],
    };
  }

  if (key === 'world-model-projects') {
    const latestProjects = sortByDateDesc(content.projects, (item) => item.release_date);
    return {
      key,
      path: '/world-model-projects',
      title: isZh ? '世界模型项目与产品' : 'World Model Projects and Products',
      description: isZh
        ? '聚合世界模型相关项目、平台和产品，便于快速比较不同机构的方向。'
        : 'Compare world-model projects, platforms, and products across labs and companies.',
      eyebrow: isZh ? '项目聚合页' : 'Project hub',
      intro: isZh
        ? '如果你更关心产业落地，而不是只看论文，这个页面是进入世界模型项目版图的最快入口。'
        : 'If you care about productization more than papers alone, this page is the fastest way into the project landscape.',
      sections: [
        {
          title: isZh ? '代表项目' : 'Notable projects',
          type: 'projects',
          items: latestProjects.slice(0, 12).map(projectItem),
        },
      ],
      relatedLinks: [
        {
          href: '/projects',
          label: isZh ? '查看全部项目' : 'Browse all projects',
          description: isZh ? '进入完整项目索引。' : 'Open the full project index.',
        },
        {
          href: '/updates',
          label: isZh ? '跟踪项目更新' : 'Track project updates',
          description: isZh ? '看近期产品和系统进展。' : 'Follow recent system and product releases.',
        },
      ],
      faq: [
        {
          question: isZh ? '为什么项目页和论文页要分开？' : 'Why separate projects from papers?',
          answer: isZh
            ? '因为很多用户想看的是谁在做平台、谁在做产品，而不是只看研究论文。项目页更适合观察产业路线。'
            : 'Because many readers want to compare platforms and product directions, not just research output. The project layer surfaces that product story directly.',
        },
      ],
    };
  }

  if (key === 'physical-ai-world-models') {
    const physicalTopicSet = new Set([
      'embodied-world-models',
      'robotics-world-models',
      'driving-world-models',
    ]);
    const physicalPapers = sortByDateDesc(
      content.papers.filter((paper) => paper.topics.some((topic) => physicalTopicSet.has(topic))),
      (item) => item.publication_date
    );
    const physicalProjects = sortByDateDesc(
      content.projects.filter((project) =>
        project.topics.some((topic) => physicalTopicSet.has(topic))
      ),
      (item) => item.release_date
    );
    const physicalUpdates = sortByDateDesc(
      content.updates.filter((update) =>
        update.topics.some((topic) => physicalTopicSet.has(topic))
      ),
      (item) => item.date
    );
    return {
      key,
      path: '/physical-ai-world-models',
      title: isZh ? 'Physical AI 与世界模型' : 'Physical AI and World Models',
      description: isZh
        ? '追踪 Physical AI、机器人与自动驾驶方向中的世界模型论文、项目和最新动态。'
        : 'Track world-model papers, projects, and updates across physical AI, robotics, and autonomous driving.',
      eyebrow: isZh ? 'Physical AI 聚合页' : 'Physical AI hub',
      intro: isZh
        ? '这个页面把 Physical AI 相关的世界模型内容聚到一起，适合看机器人、具身智能和自动驾驶这些分支如何汇合。'
        : 'This hub groups the world-model stack for physical AI so readers can compare how robotics, embodied systems, and driving are starting to converge.',
      sections: [
        {
          title: isZh ? '关键论文' : 'Key papers',
          type: 'papers',
          items: physicalPapers.slice(0, 6).map(paperItem),
        },
        {
          title: isZh ? '代表项目' : 'Featured projects',
          type: 'projects',
          items: physicalProjects.slice(0, 6).map(projectItem),
        },
        {
          title: isZh ? '最新进展' : 'Latest updates',
          type: 'updates',
          items: physicalUpdates.slice(0, 6).map(updateItem),
        },
      ],
      relatedLinks: [
        {
          href: '/topics/embodied-world-models',
          label: isZh ? '具身世界模型专题' : 'Embodied world models',
          description: isZh ? '进入具身方向专题页。' : 'Go deeper into embodied systems.',
        },
        {
          href: '/topics/robotics-world-models',
          label: isZh ? '机器人世界模型专题' : 'Robotics world models',
          description: isZh ? '比较机器人平台路线。' : 'Compare robotics platform directions.',
        },
      ],
      faq: [
        {
          question: isZh ? '为什么 Physical AI 需要世界模型？' : 'Why does physical AI need world models?',
          answer: isZh
            ? '因为 Physical AI 需要在行动前进行预测、仿真和规划，而世界模型正好提供这套中间层能力。'
            : 'Because physical AI needs prediction, rehearsal, and planning before action, and world models provide that intermediate layer.',
        },
      ],
    };
  }

  const embodiedPapers = sortByDateDesc(
    content.papers.filter((paper) =>
      paper.topics.some((topic) =>
        ['embodied-world-models', 'robotics-world-models'].includes(topic)
      )
    ),
    (item) => item.publication_date
  );

  return {
    key,
    path: '/embodied-ai-papers',
    title: isZh ? '具身智能与世界模型论文' : 'Embodied AI Papers on World Models',
    description: isZh
      ? '聚合具身智能与机器人相关的世界模型论文，方便快速进入该分支。'
      : 'A focused reading list of world-model papers for embodied AI and robotics.',
    eyebrow: isZh ? '具身论文页' : 'Embodied AI paper hub',
    intro: isZh
      ? '如果你要优先补具身智能方向，这个页面把最相关的世界模型论文放到了一起。'
      : 'If embodied AI is your priority, this page collects the most relevant world-model papers in one place.',
    sections: [
      {
        title: isZh ? '具身方向论文' : 'Embodied AI papers',
        type: 'papers',
        items: embodiedPapers.slice(0, 12).map(paperItem),
      },
    ],
    relatedLinks: [
      {
        href: '/topics/embodied-world-models',
        label: isZh ? '具身世界模型专题' : 'Embodied world models',
        description: isZh ? '进入主题页看项目与更新。' : 'Open the topic page for projects and updates.',
      },
      {
        href: '/physical-ai-world-models',
        label: isZh ? 'Physical AI 聚合页' : 'Physical AI hub',
        description: isZh ? '继续查看更宽的 Physical AI 版图。' : 'Zoom out to the broader physical-AI landscape.',
      },
    ],
    faq: [
      {
        question: isZh ? '这些论文和通用世界模型论文有什么不同？' : 'How are these different from generic world-model papers?',
        answer: isZh
          ? '它们更强调行动、控制、机器人执行和 sim-to-real，而不只是环境建模本身。'
          : 'They emphasize action, control, robot execution, and sim-to-real transfer rather than environment modeling alone.',
      },
    ],
  };
}

export const seoHubPaths: string[] = [
  '/latest-world-model-papers',
  '/world-model-projects',
  '/physical-ai-world-models',
  '/embodied-ai-papers',
];

export type { SeoHubKey, SeoHubData };
