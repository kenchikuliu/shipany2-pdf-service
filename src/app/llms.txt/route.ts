import { envConfigs } from '@/config';

export const dynamic = 'force-dynamic';

export function GET() {
  const body = [
    '# World Models Atlas',
    '',
    '> A bilingual entry point for world-model papers, projects, timelines, and weekly progress.',
    '',
    `Canonical: ${envConfigs.app_url}`,
    '',
    'Key pages:',
    `- Home: ${envConfigs.app_url}/`,
    `- Papers: ${envConfigs.app_url}/papers`,
    `- Projects: ${envConfigs.app_url}/projects`,
    `- Updates: ${envConfigs.app_url}/updates`,
    `- Timeline: ${envConfigs.app_url}/timeline`,
    `- Latest world model papers: ${envConfigs.app_url}/latest-world-model-papers`,
    `- Physical AI world models: ${envConfigs.app_url}/physical-ai-world-models`,
    '',
    'Focus:',
    '- World-model research and foundational papers',
    '- Embodied AI, robotics, autonomous driving, and physical AI',
    '- Weekly ecosystem shifts, lab releases, and system-level milestones',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
