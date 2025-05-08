<template>
  <div class="leaderboard-page">
    <div class="header">
      <div class="logo" @click="goHome">SYSU</div>
      <div class="breadcrumb">
        <router-link to="/" class="home-link">首页</router-link> / 模型排行榜
      </div>
    </div>

    <div class="main-content">
      <h1 class="page-title">大型模型性能排行榜</h1>
      
      <div class="filter-section">
        <div class="filter-group">
          <label>数据集类型</label>
          <select v-model="selectedDatasetType" class="filter-select" @change="fetchLeaderboard">
            <option value="all">全部</option>
            <option value="reasoning">推理能力</option>
            <option value="knowledge">知识问答</option>
            <option value="code">代码能力</option>
            <option value="math">数学能力</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>语言</label>
          <select v-model="selectedLanguage" class="filter-select" @change="fetchLeaderboard">
            <option value="all">全部</option>
            <option value="chinese">中文</option>
            <option value="english">英文</option>
            <option value="multilingual">多语言</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>排序方式</label>
          <select v-model="sortBy" class="filter-select" @change="fetchLeaderboard">
            <option value="score">总分</option>
            <option value="reasoning">推理能力</option>
            <option value="knowledge">知识</option>
            <option value="date">评估日期</option>
          </select>
        </div>
      </div>
      
      <div class="leaderboard-table" v-if="!isLoading">
        <table>
          <thead>
            <tr>
              <th class="rank-col">排名</th>
              <th class="model-col">模型</th>
              <th class="score-col" @click="toggleSort('overall')">
                总分
                <span v-if="sortField === 'overall'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="score-col" @click="toggleSort('reasoning')">
                推理
                <span v-if="sortField === 'reasoning'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="score-col" @click="toggleSort('knowledge')">
                知识
                <span v-if="sortField === 'knowledge'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="score-col" @click="toggleSort('math')">
                数学
                <span v-if="sortField === 'math'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="score-col" @click="toggleSort('code')">
                代码
                <span v-if="sortField === 'code'" class="sort-icon">
                  {{ sortDirection === 'asc' ? '↑' : '↓' }}
                </span>
              </th>
              <th class="date-col">评估日期</th>
              <th class="detail-col">详情</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(model, index) in models" :key="model.id">
              <td class="rank-col">{{ index + 1 }}</td>
              <td class="model-col">
                <div class="model-info">
                  <span class="model-name">{{ model.name }}</span>
                  <span class="model-org">{{ model.organization }}</span>
                </div>
              </td>
              <td class="score-col" :class="{'highlight': sortField === 'overall'}">
                {{ model.scores.overall.toFixed(1) }}
              </td>
              <td class="score-col" :class="{'highlight': sortField === 'reasoning'}">
                {{ model.scores.reasoning.toFixed(1) }}
              </td>
              <td class="score-col" :class="{'highlight': sortField === 'knowledge'}">
                {{ model.scores.knowledge.toFixed(1) }}
              </td>
              <td class="score-col" :class="{'highlight': sortField === 'math'}">
                {{ model.scores.math.toFixed(1) }}
              </td>
              <td class="score-col" :class="{'highlight': sortField === 'code'}">
                {{ model.scores.code.toFixed(1) }}
              </td>
              <td class="date-col">{{ model.date }}</td>
              <td class="detail-col">
                <button class="detail-btn" @click="viewDetails(model.id)">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="loading-indicator" v-if="isLoading">
        <div class="loading-spinner"></div>
        <p>加载数据中...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { leaderboardApi } from '../api';

export default {
  name: 'LeaderboardPage',
  data() {
    return {
      selectedDatasetType: 'all',
      selectedLanguage: 'all',
      sortBy: 'score',
      sortField: 'overall',
      sortDirection: 'desc',
      models: [],
      isLoading: true,
      modelDetail: null
    };
  },
  created() {
    this.fetchLeaderboard();
  },
  methods: {
    goHome() {
      this.$router.push('/');
    },
    async fetchLeaderboard() {
      this.isLoading = true;
      
      try {
        const params = {
          datasetType: this.selectedDatasetType,
          language: this.selectedLanguage,
          sortBy: this.sortField === 'overall' ? 'score' : this.sortField,
          sortDirection: this.sortDirection
        };
        
        this.models = await leaderboardApi.getLeaderboard(params);
      } catch (error) {
        console.error('获取排行榜数据失败:', error);
      } finally {
        this.isLoading = false;
      }
    },
    toggleSort(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'desc'; // 默认降序
      }
      
      this.fetchLeaderboard();
    },
    async viewDetails(modelId) {
      try {
        const detail = await leaderboardApi.getModelDetail(modelId);
        // 这里可以使用弹窗或者跳转到详情页
        alert(`模型: ${detail.name}\n组织: ${detail.organization}\n总分: ${detail.scores.overall}`);
      } catch (error) {
        console.error('获取模型详情失败:', error);
      }
    }
  }
};
</script>

<style scoped>
.leaderboard-page {
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
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.filter-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  min-width: 200px;
}

.filter-group label {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

.filter-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.leaderboard-table {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f7f9fc;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

th:hover {
  background-color: #e9f0f8;
}

.rank-col {
  width: 60px;
}

.model-col {
  width: 200px;
  text-align: left;
}

.score-col {
  width: 80px;
}

.date-col {
  width: 100px;
}

.detail-col {
  width: 80px;
}

.model-info {
  display: flex;
  flex-direction: column;
}

.model-name {
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 5px;
}

.model-org {
  font-size: 0.9rem;
  color: #666;
}

.highlight {
  background-color: #e3f2fd;
  font-weight: 600;
}

.sort-icon {
  margin-left: 5px;
}

.detail-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;
}

.detail-btn:hover {
  background-color: #1565c0;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #1976d2;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .filter-section {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .leaderboard-table {
    overflow-x: auto;
  }
  
  table {
    min-width: 800px;
  }
}
</style> 