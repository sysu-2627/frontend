<template>
  <div class="home-page">
    <div class="background-elements">
      <div class="bg-element square-1"></div>
      <div class="bg-element square-2"></div>
      <div class="bg-element circle-1"></div>
      <div class="bg-element circle-2"></div>
      <div class="bg-element line-1"></div>
      <div class="bg-element line-2"></div>
    </div>
    <div class="header">
      <div class="logo">SYSU</div>
      <div class="title">大型模型评估系统</div>
    </div>
    <div class="description">
      <p>软工综合实训项目</p>
      <p>开源、高效、全面</p>
      <p>大型模型评估系统和开放平台</p>
    </div>
    <div class="action-buttons">
      <router-link to="/evaluation" class="btn evaluation-btn">在线评估</router-link>
      <router-link to="/leaderboard" class="btn leaderboard-btn">查看排行榜 →</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
  color: white;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  text-align: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.background-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.bg-element {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.square-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
  transform: rotate(45deg);
  border-radius: 10px;
}

.square-2 {
  width: 80px;
  height: 80px;
  bottom: 15%;
  right: 15%;
  transform: rotate(30deg);
  border-radius: 8px;
}

.circle-1 {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  top: 60%;
  left: 15%;
}

.circle-2 {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  top: 20%;
  right: 10%;
}

.line-1 {
  width: 200px;
  height: 2px;
  top: 40%;
  left: 0;
  transform: rotate(45deg);
  transform-origin: left center;
}

.line-2 {
  width: 200px;
  height: 2px;
  bottom: 30%;
  right: 0;
  transform: rotate(-45deg);
  transform-origin: right center;
}

.header {
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
}

.logo {
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(90deg, #90caf9 0%, #ec407a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 40px;
  position: relative;
}

.description {
  margin-bottom: 50px;
  font-size: 1.2rem;
  line-height: 1.8;
  position: relative;
  z-index: 2;
}

.action-buttons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  width: 100%;
  position: relative;
  z-index: 2;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  min-width: 200px;
}

.evaluation-btn {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.leaderboard-btn {
  background-color: white;
  color: #283593;
}

.evaluation-btn:hover, .leaderboard-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .logo {
    font-size: 3rem;
  }
  
  .title {
    font-size: 1.8rem;
  }
  
  .bg-element {
    opacity: 0.3;
  }
}
</style> 