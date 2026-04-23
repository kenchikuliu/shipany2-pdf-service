export type TopicOverride = {
  summaryTitleEn: string;
  summaryTitleZh: string;
  summaryBodyEn: string[];
  summaryBodyZh: string[];
  faq: Array<{
    questionEn: string;
    questionZh: string;
    answerEn: string;
    answerZh: string;
  }>;
};

export const topicOverrides: Record<string, TopicOverride> = {
  'world-models': {
    summaryTitleEn: 'Why the world-models topic matters',
    summaryTitleZh: '为什么要先理解世界模型这个主题',
    summaryBodyEn: [
      'World models sit at the intersection of prediction, simulation, planning, and controllable environment generation. That makes the topic a useful umbrella for understanding why video models, robotics stacks, and autonomous-driving systems are starting to look structurally similar.',
      'This page works best as a field map: start from the canonical papers, then compare how labs such as DeepMind, NVIDIA, Wayve, and OpenAI turn world-model ideas into products, infrastructure, and evaluation systems.',
    ],
    summaryBodyZh: [
      '世界模型位于预测、仿真、规划和可控环境生成的交叉点上，所以它是理解视频模型、机器人系统和自动驾驶平台为何开始出现相似结构的一把总钥匙。',
      '这个页面更适合作为全景地图来用：先看概念性论文，再对比 DeepMind、NVIDIA、Wayve、OpenAI 如何把世界模型推进成产品、基础设施和评测系统。',
    ],
    faq: [
      {
        questionEn: 'What counts as a world model?',
        questionZh: '什么样的系统可以算作世界模型？',
        answerEn:
          'On this site, a world model is any model or system that learns or encodes environment dynamics well enough to support prediction, simulation, planning, or controllable rollout.',
        answerZh:
          '在这个站里，只要一个模型或系统能够学习或编码环境动态，并进一步服务于预测、仿真、规划或可控展开，就可以被归入世界模型。',
      },
      {
        questionEn: 'Why are world models showing up in so many product categories?',
        questionZh: '为什么世界模型会同时出现在这么多产品类别里？',
        answerEn:
          'Because the same core capability, modeling how a world evolves, can support video generation, robot control, synthetic-data generation, scenario testing, and long-horizon agent planning.',
        answerZh:
          '因为“建模世界如何演化”这一核心能力，可以同时支撑视频生成、机器人控制、合成数据生成、场景测试和长程智能体规划。',
      },
      {
        questionEn: 'Where should a new reader start?',
        questionZh: '如果是新读者，应该从哪里开始？',
        answerEn:
          'Start with the foundational papers and then move to platform-level systems such as Genie, Cosmos, GAIA, or Gemini Robotics to see how the concept becomes operational.',
        answerZh:
          '建议先读概念性论文，再看 Genie、Cosmos、GAIA、Gemini Robotics 这类平台级系统，理解这个概念是如何变成可运行产品与基础设施的。',
      },
    ],
  },
  'embodied-world-models': {
    summaryTitleEn: 'Why embodied world models matter',
    summaryTitleZh: '为什么具身世界模型值得单独看',
    summaryBodyEn: [
      'Embodied world models bring the topic out of pure perception and into action. They matter because they connect internal simulation to robots, physical tasks, and sim-to-real transfer.',
      'This topic is useful when you want to understand the bridge between world understanding and physical execution: not just what an agent sees, but how it predicts outcomes before acting in the real world.',
    ],
    summaryBodyZh: [
      '具身世界模型把这个方向从“看懂世界”推进到“在世界里行动”。它的重要性在于把内部模拟和机器人、物理任务、sim-to-real 迁移真正连起来。',
      '如果你想理解“世界理解”如何过渡到“物理执行”，这个专题最有价值：它讨论的不只是智能体看到了什么，而是行动前如何预测后果。',
    ],
    faq: [
      {
        questionEn: 'How are embodied world models different from generic world models?',
        questionZh: '具身世界模型和一般的世界模型有什么区别？',
        answerEn:
          'Embodied world models are optimized for agents with bodies and actuators, so they care more about interaction, control, action consequences, and deployment in physical settings.',
        answerZh:
          '具身世界模型服务的是有身体和执行器的智能体，因此更关注交互、控制、动作后果以及在真实物理场景中的部署。',
      },
      {
        questionEn: 'Why do simulators matter so much here?',
        questionZh: '为什么模拟器在这里格外重要？',
        answerEn:
          'Because embodied systems need safe, scalable ways to rehearse action sequences. Simulators and learned world models together reduce the cost of testing policies in the real world.',
        answerZh:
          '因为具身系统需要一种安全、可扩展的方式来提前演练动作序列。模拟器和学习到的世界模型结合起来，能显著降低真实世界试错成本。',
      },
      {
        questionEn: 'Which systems best represent the topic today?',
        questionZh: '当前哪些系统最能代表这个主题？',
        answerEn:
          'Survey papers help with orientation, while systems like Gemini Robotics, Cosmos, and GR00T N1 show how embodied world models are turning into platform strategies.',
        answerZh:
          '如果是建立全景认知，综述最有效；如果是看产业路径，Gemini Robotics、Cosmos、GR00T N1 这些系统更能说明具身世界模型正在走向平台化。',
      },
    ],
  },
  'robotics-world-models': {
    summaryTitleEn: 'Why robotics world models are different',
    summaryTitleZh: '为什么机器人世界模型需要单独拆出来看',
    summaryBodyEn: [
      'Robotics world models turn prediction into control infrastructure. They are not only about generating plausible futures, but about helping a robot decide, rehearse, and transfer actions under uncertainty.',
      'This topic page is the best place to compare the platform layer: simulation, policy learning, robot reasoning, and deployment pipelines are converging around world-model-like abstractions.',
    ],
    summaryBodyZh: [
      '机器人世界模型把“预测”进一步变成“控制基础设施”。它关注的不只是生成合理未来，更是如何帮助机器人在不确定条件下做决策、演练动作并完成迁移。',
      '这个专题最适合用来比较平台层能力：仿真、策略学习、机器人推理和部署流水线，正在围绕类似世界模型的抽象逐步汇合。',
    ],
    faq: [
      {
        questionEn: 'What do robotics world models actually help with?',
        questionZh: '机器人世界模型到底能帮什么？',
        answerEn:
          'They help forecast outcomes, test skills in simulation, guide policy learning, and improve decision making before a robot acts in the physical world.',
        answerZh:
          '它们可以帮助机器人预测结果、在仿真中测试技能、指导策略学习，并在真实行动前提升决策质量。',
      },
      {
        questionEn: 'Are robotics world models only for humanoids?',
        questionZh: '机器人世界模型只适用于人形机器人吗？',
        answerEn:
          'No. Humanoids are one visible use case, but the broader pattern applies to manipulation, mobile robotics, and general physical AI systems.',
        answerZh:
          '不是。人形机器人只是更显眼的一个用例，这类方法同样适用于机械臂、移动机器人以及更广义的 Physical AI 系统。',
      },
      {
        questionEn: 'Why are NVIDIA and DeepMind important in this topic?',
        questionZh: '为什么 NVIDIA 和 DeepMind 在这个专题里这么重要？',
        answerEn:
          'Because they show two strong platform directions: integrated simulation-and-training stacks, and embodied reasoning systems that connect model intelligence to physical control.',
        answerZh:
          '因为它们分别展示了两条强平台路线：一条是仿真与训练一体化，另一条是把模型推理能力真正连接到物理控制的具身智能系统。',
      },
    ],
  },
};

export function getTopicOverride(slug: string) {
  return topicOverrides[slug] ?? null;
}
