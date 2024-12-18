<template>
  <div class="ide-container">
    <div class="project-list">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>项目列表</span>
            <el-button type="primary" @click="createProject">
              新建项目
            </el-button>
          </div>
        </template>

        <el-table :data="projects" style="width: 100%">
          <el-table-column prop="name" label="项目名称" />
          <el-table-column prop="language" label="语言">
            <template #default="{ row }">
              <el-tag>{{ row.language }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="最后更新" />
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button-group>
                <el-button type="primary" link @click="openProject(row)">
                  打开
                </el-button>
                <el-button type="danger" link @click="deleteProject(row)">
                  删除
                </el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 新建项目对话框 -->
    <el-dialog v-model="dialogVisible" title="新建项目" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="语言" prop="language">
          <el-select v-model="form.language" style="width: 100%">
            <el-option label="JavaScript" value="javascript" />
            <el-option label="Python" value="python" />
            <el-option label="Java" value="java" />
            <el-option label="Go" value="go" />
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const dialogVisible = ref(false)
const formRef = ref()

const projects = ref([
  {
    id: 1,
    name: '示例项目',
    language: 'javascript',
    updateTime: '2024-03-20 10:00:00',
    description: '这是一个示例项目',
  },
])

const form = reactive({
  name: '',
  language: 'javascript',
  description: '',
})

const rules = {
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
  ],
  language: [{ required: true, message: '请选择编程语言', trigger: 'change' }],
}

const createProject = () => {
  form.name = ''
  form.language = 'javascript'
  form.description = ''
  dialogVisible.value = true
}

const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const newProject = {
      id: Date.now(),
      ...form,
      updateTime: new Date().toLocaleString(),
    }
    projects.value.push(newProject)
    ElMessage.success('创建成功')
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const openProject = (project) => {
  router.push(`/ide/${project.id}`)
}

const deleteProject = async (project) => {
  try {
    await ElMessageBox.confirm('确定要删除该项目吗？此操作不可恢复！', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const index = projects.value.findIndex((p) => p.id === project.id)
    if (index !== -1) {
      projects.value.splice(index, 1)
    }
    ElMessage.success('删除成功')
  } catch (error) {
    console.error('删除取消:', error)
  }
}
</script>

<style scoped>
.ide-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
