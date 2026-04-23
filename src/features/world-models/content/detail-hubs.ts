export type DetailHubItem = {
  slug: string;
  href: string;
  titleEn: string;
  titleZh: string;
  summaryEn: string;
  summaryZh: string;
};

const hubCatalog: DetailHubItem[] = [
  {
    slug: 'latest-world-model-papers',
    href: '/latest-world-model-papers',
    titleEn: 'Latest world model papers',
    titleZh: '最新世界模型论文',
    summaryEn: 'A recency-first reading list across the world-model field.',
    summaryZh: '按时间快速扫世界模型领域最近值得读的论文。',
  },
  {
    slug: 'world-model-projects',
    href: '/world-model-projects',
    titleEn: 'World model projects',
    titleZh: '世界模型项目',
    summaryEn: 'Compare platforms, demos, and products in one place.',
    summaryZh: '把平台、产品和代表系统放到一起比较。',
  },
  {
    slug: 'physical-ai-world-models',
    href: '/physical-ai-world-models',
    titleEn: 'Physical AI world models',
    titleZh: 'Physical AI 世界模型',
    summaryEn: 'A hub for robotics, embodied systems, and driving.',
    summaryZh: '聚合机器人、具身系统和自动驾驶相关内容。',
  },
  {
    slug: 'embodied-ai-papers',
    href: '/embodied-ai-papers',
    titleEn: 'Embodied AI papers',
    titleZh: '具身智能论文',
    summaryEn: 'A focused reading list for embodied and robotics directions.',
    summaryZh: '面向具身和机器人方向的聚合阅读页。',
  },
];

export function getRecommendedHubs(topics: string[]) {
  const hubs: DetailHubItem[] = [];

  hubs.push(hubCatalog[0], hubCatalog[1]);

  if (
    topics.some((topic) =>
      ['embodied-world-models', 'robotics-world-models', 'driving-world-models'].includes(
        topic
      )
    )
  ) {
    hubs.push(hubCatalog[2]);
  }

  if (
    topics.some((topic) =>
      ['embodied-world-models', 'robotics-world-models'].includes(topic)
    )
  ) {
    hubs.push(hubCatalog[3]);
  }

  return hubs.filter(
    (hub, index, array) => array.findIndex((item) => item.slug === hub.slug) === index
  );
}
