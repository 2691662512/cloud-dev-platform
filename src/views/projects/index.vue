<template>
  <div class="projects-container">
    <div class="projects-header">
      <el-button type="primary" @click="handleCreate"> 创建项目 </el-button>
    </div>

    <el-table :data="projectList" style="width: 100%">
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'running' ? 'success' : 'info'">
            {{ row.status === 'running' ? '运行中' : '已停止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const projectList = ref([
  {
    id: 1,
    name: '示例项目',
    description: '这是一个示例项目',
    status: 'running',
  },
])

const handleCreate = () => {
  // 实现创建项目的逻辑
}

const handleEdit = (row) => {
  // 实现编辑项目的逻辑
}

const handleDelete = (row) => {
  // 实现删除项目的逻辑
}
</script>

<style scoped>
.projects-container {
  padding: 20px;
}

.projects-header {
  margin-bottom: 20px;
}
</style>
<template>
  <div class="projects-container">
    <div class="projects-header">
      <el-button type="primary" @click="handleCreate"> 创建项目 </el-button>
    </div>

    <el-table :data="projectList" style="width: 100%">
      <el-table-column prop="name" label="项目名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'running' ? 'success' : 'info'">
            {{ row.status === 'running' ? '运行中' : '已停止' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const projectList = ref([
  {
    id: 1,
    name: '示例项目',
    description: '这是一个示例项目',
    status: 'running',
  },
])

const handleCreate = () => {
  // 实现创建项目的逻辑
}

const handleEdit = (row) => {
  // 实现编辑项目的逻辑
}

const handleDelete = (row) => {
  // 实现删除项目的逻辑
}
</script>

<style scoped>
.projects-container {
  padding: 20px;
}

.projects-header {
  margin-bottom: 20px;
}
</style>
