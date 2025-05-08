// 模拟API请求
// 实际项目中应该使用axios等HTTP库进行真实的API调用

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模型评估API
export const evaluationApi = {
  // 获取可用模型列表
  async getModels() {
    await delay(500);
    return [
      { id: 'model1', name: 'GPT-4' },
      { id: 'model2', name: 'Claude 3' },
      { id: 'model3', name: 'Llama 3' },
      { id: 'model4', name: 'Gemini Pro' },
      { id: 'model5', name: 'Custom Model' }
    ];
  },
  
  // 获取可用数据集列表
  async getDatasets() {
    await delay(500);
    return [
      { id: 'ds1', name: 'MMLU' },
      { id: 'ds2', name: 'HumanEval' },
      { id: 'ds3', name: 'GSM8K' },
      { id: 'ds4', name: 'C-Eval' },
      { id: 'ds5', name: 'HELM' }
    ];
  },
  
  // 开始评估任务
  async startEvaluation(params) {
    await delay(1000);
    console.log('评估参数:', params); // 使用参数
    // 返回评估任务ID
    return {
      evaluationId: 'eval-' + Math.random().toString(36).substring(2, 10),
      status: 'pending'
    };
  },
  
  // 获取评估任务状态
  async getEvaluationStatus(evaluationId) {
    await delay(500);
    // 模拟随机进度
    const progress = Math.floor(Math.random() * 100);
    return {
      evaluationId,
      status: progress < 100 ? 'running' : 'completed',
      progress,
      timeRemaining: progress < 100 ? `约 ${Math.ceil((100 - progress) / 10)} 分钟` : ''
    };
  }
};

// 排行榜API
export const leaderboardApi = {
  // 获取排行榜数据
  async getLeaderboard(params = {}) {
    await delay(800);
    const models = [
      {
        id: 1,
        name: 'GPT-4 Turbo',
        organization: 'OpenAI',
        scores: {
          overall: 89.4,
          reasoning: 92.7,
          knowledge: 90.1,
          math: 88.5,
          code: 86.3
        },
        date: '2023-12-15'
      },
      {
        id: 2,
        name: 'Claude 3 Opus',
        organization: 'Anthropic',
        scores: {
          overall: 87.9,
          reasoning: 90.2,
          knowledge: 88.7,
          math: 86.1,
          code: 86.6
        },
        date: '2024-03-05'
      },
      {
        id: 3,
        name: 'Gemini Pro',
        organization: 'Google',
        scores: {
          overall: 85.7,
          reasoning: 88.3,
          knowledge: 87.9,
          math: 84.2,
          code: 82.4
        },
        date: '2023-12-20'
      },
      {
        id: 4,
        name: 'Llama 3 70B',
        organization: 'Meta AI',
        scores: {
          overall: 84.6,
          reasoning: 85.1,
          knowledge: 83.8,
          math: 83.6,
          code: 85.9
        },
        date: '2024-04-10'
      },
      {
        id: 5,
        name: 'GLM-4',
        organization: '智谱AI',
        scores: {
          overall: 83.8,
          reasoning: 84.7,
          knowledge: 86.2,
          math: 82.5,
          code: 81.8
        },
        date: '2024-01-15'
      }
    ];
    
    // 简单的过滤和排序
    let result = [...models];
    
    if (params.datasetType && params.datasetType !== 'all') {
      // 模拟筛选
    }
    
    if (params.language && params.language !== 'all') {
      // 模拟筛选
    }
    
    if (params.sortBy) {
      const field = params.sortBy === 'score' ? 'overall' : params.sortBy;
      const direction = params.sortDirection || 'desc';
      
      result.sort((a, b) => {
        let valueA, valueB;
        
        if (field === 'date') {
          valueA = new Date(a.date);
          valueB = new Date(b.date);
        } else {
          valueA = a.scores[field];
          valueB = b.scores[field];
        }
        
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      });
    }
    
    return result;
  },
  
  // 获取模型详情
  async getModelDetail(modelId) {
    await delay(700);
    // 模拟返回详细评估结果
    return {
      id: modelId,
      name: 'GPT-4 Turbo',
      organization: 'OpenAI',
      description: '由OpenAI开发的最新大型语言模型，拥有强大的推理和知识能力。',
      scores: {
        overall: 89.4,
        reasoning: 92.7,
        knowledge: 90.1,
        math: 88.5,
        code: 86.3
      },
      date: '2023-12-15',
      detailedScores: {
        mmlu: 83.5,
        humanEval: 86.3,
        gsm8k: 92.1,
        cEval: 91.4,
        helm: 85.7
      }
    };
  }
};

// 导出所有API
export default {
  evaluation: evaluationApi,
  leaderboard: leaderboardApi
}; 