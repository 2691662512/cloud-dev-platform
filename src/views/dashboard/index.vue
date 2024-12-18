<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>我的项目</span>
            </div>
          </template>
          <div>{{ projectCount }} 个项目</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>代码提交</span>
            </div>
          </template>
          <div>{{ commitCount }} 次提交</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>待处理任务</span>
            </div>
          </template>
          <div>{{ taskCount }} 个任务</div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>团队成员</span>
            </div>
          </template>
          <div>{{ memberCount }} 名成员</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const projectCount = ref(0)
const commitCount = ref(0)
const taskCount = ref(0)
const memberCount = ref(0)

// TODO: 从后端获取数据
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.el-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
