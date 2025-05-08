<template>
  <div class="evaluation-page">
    <div class="header">
      <div class="logo" @click="goHome">SYSU</div>
      <div class="breadcrumb">
        <router-link to="/" class="home-link">首页</router-link> / 在线评估
      </div>
    </div>

    <div class="main-content">
      <h1 class="page-title">模型在线评估</h1>
      
      <div class="evaluation-card">
        <div class="form-group">
          <label>选择评估模型</label>
          <select v-model="selectedModel" class="select-input">
            <option value="" disabled>请选择模型</option>
            <option v-for="model in models" :key="model.id" :value="model.id">
              {{ model.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>选择数据集</label>
          <select v-model="selectedDataset" class="select-input">
            <option value="" disabled>请选择数据集</option>
            <option v-for="dataset in datasets" :key="dataset.id" :value="dataset.id">
              {{ dataset.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>评估参数配置</label>
          <div class="parameter-row">
            <span>并发度</span>
            <input type="number" v-model="concurrency" min="1" max="10" class="number-input" />
          </div>
          <div class="parameter-row">
            <span>最大序列长度</span>
            <input type="number" v-model="maxLength" min="128" step="128" class="number-input" />
          </div>
          <div class="parameter-row">
            <span>温度</span>
            <input type="range" v-model="temperature" min="0" max="1" step="0.1" class="range-input" />
            <span class="value-display">{{ temperature }}</span>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="start-btn" @click="startEvaluation" :disabled="!isFormValid || isSubmitting">
            {{ isSubmitting ? '提交中...' : '开始评估' }}
          </button>
        </div>
      </div>
      
      <div class="status-card" v-if="evaluationStatus">
        <h2>评估状态</h2>
        <div class="status-info">
          <div class="status-row">
            <span>状态：</span>
            <span :class="'status-' + evaluationStatus.status">{{ getStatusText(evaluationStatus.status) }}</span>
          </div>
          <div class="status-row" v-if="evaluationStatus.progress !== undefined">
            <span>进度：</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: evaluationStatus.progress + '%' }"></div>
            </div>
            <span>{{ evaluationStatus.progress }}%</span>
          </div>
          <div class="status-row" v-if="evaluationStatus.timeRemaining">
            <span>预计剩余时间：</span>
            <span>{{ evaluationStatus.timeRemaining }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { evaluationApi } from '../api';

export default {
  name: 'EvaluationPage',
  data() {
    return {
      selectedModel: '',
      selectedDataset: '',
      concurrency: 1,
      maxLength: 1024,
      temperature: 0.7,
      evaluationStatus: null,
      models: [],
      datasets: [],
      isSubmitting: false,
      evaluationId: null,
      statusInterval: null
    };
  },
  computed: {
    isFormValid() {
      return this.selectedModel && this.selectedDataset;
    }
  },
  created() {
    this.fetchModels();
    this.fetchDatasets();
  },
  beforeDestroy() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    async fetchModels() {
      try {
        this.models = await evaluationApi.getModels();
      } catch (error) {
        console.error('获取模型列表失败:', error);
      }
    },
    async fetchDatasets() {
      try {
        this.datasets = await evaluationApi.getDatasets();
      } catch (error) {
        console.error('获取数据集列表失败:', error);
      }
    },
    async startEvaluation() {
      if (!this.isFormValid || this.isSubmitting) return;
      
      this.isSubmitting = true;
      
      try {
        const params = {
          modelId: this.selectedModel,
          datasetId: this.selectedDataset,
          concurrency: this.concurrency,
          maxLength: this.maxLength,
          temperature: this.temperature
        };
        
        const result = await evaluationApi.startEvaluation(params);
        this.evaluationId = result.evaluationId;
        
        // 初始化评估状态
        this.evaluationStatus = {
          status: result.status,
          progress: 0,
          timeRemaining: '计算中...'
        };
        
        // 定期获取评估状态
        this.statusInterval = setInterval(async () => {
          await this.updateEvaluationStatus();
          
          // 如果评估完成，停止轮询
          if (this.evaluationStatus.status === 'completed' || this.evaluationStatus.status === 'failed') {
            clearInterval(this.statusInterval);
          }
        }, 2000);
      } catch (error) {
        console.error('启动评估失败:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async updateEvaluationStatus() {
      if (!this.evaluationId) return;
      
      try {
        const status = await evaluationApi.getEvaluationStatus(this.evaluationId);
        this.evaluationStatus = status;
      } catch (error) {
        console.error('获取评估状态失败:', error);
      }
    },
    getStatusText(status) {
      const statusMap = {
        'pending': '等待中',
        'running': '评估中',
        'completed': '已完成',
        'failed': '失败'
      };
      return statusMap[status] || status;
    }
  }
};
</script>

<style scoped>
.evaluation-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(90deg, #90caf9 0%, #ec407a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: 30px;
  cursor: pointer;
}

.breadcrumb {
  font-size: 1rem;
  color: #666;
}

.home-link {
  color: #1976d2;
  text-decoration: none;
}

.home-link:hover {
  text-decoration: underline;
}

.main-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.evaluation-card, .status-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.select-input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
}

.parameter-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.parameter-row span {
  flex: 1;
  color: #555;
}

.number-input, .range-input {
  width: 150px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.value-display {
  width: 40px;
  text-align: center;
}

.action-buttons {
  margin-top: 30px;
  text-align: center;
}

.start-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  min-width: 150px;
}

.start-btn:hover:not(:disabled) {
  background-color: #1565c0;
}

.start-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.status-info {
  margin-top: 20px;
}

.status-row {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.status-row > span:first-child {
  width: 120px;
  font-weight: 600;
  color: #555;
}

.status-pending {
  color: #ff9800;
  font-weight: 600;
}

.status-running {
  color: #2196f3;
  font-weight: 600;
}

.status-completed {
  color: #4caf50;
  font-weight: 600;
}

.status-failed {
  color: #f44336;
  font-weight: 600;
}

.progress-bar {
  flex: 1;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin: 0 15px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #2196f3;
  transition: width 0.5s ease;
}

@media (max-width: 768px) {
  .evaluation-card, .status-card {
    padding: 20px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .parameter-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .parameter-row span {
    margin-bottom: 5px;
  }
  
  .number-input, .range-input {
    width: 100%;
  }
}
</style> 