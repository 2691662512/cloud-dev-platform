<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>项目总数</span>
            </div>
          </template>
          <div class="card-value">8</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>运行中项目</span>
            </div>
          </template>
          <div class="card-value">5</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>构建次数</span>
            </div>
          </template>
          <div class="card-value">128</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>部署次数</span>
            </div>
          </template>
          <div class="card-value">96</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// 这里可以添加仪表盘的数据获取和处理逻辑
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
  text-align: center;
  padding: 20px 0;
}
</style>
