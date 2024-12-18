<template>
  <div class="project-ide">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button-group>
        <el-button type="primary" :icon="Download" @click="saveProject">
          保存
        </el-button>
        <el-button :icon="Refresh" @click="formatCode"> 格式化 </el-button>
      </el-button-group>

      <el-button-group>
        <el-button type="success" :icon="VideoPlay" @click="runCode">
          运行
        </el-button>
        <el-button type="warning" :icon="VideoPause" @click="stopCode">
          停止
        </el-button>
      </el-button-group>
    </div>

    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 文件树 -->
      <FileTree
        :files="files"
        @file-click="handleFileClick"
        @new-file="handleNewFile"
        @new-folder="handleNewFolder"
        @delete-file="handleDeleteFile"
        @rename-file="handleRenameFile"
      />

      <!-- 编辑器区域 -->
      <div class="editor-area">
        <Editor
          :opened-files="ideStore.openedFiles"
          :current-file="ideStore.currentFile"
          @close-file="handleCloseFile"
          @change-file="handleFileChange"
        />
      </div>
    </div>

    <!-- 终端输出 -->
    <Terminal
      :output="ideStore.terminalOutput"
      @clear="ideStore.clearTerminalOutput"
    />

    <!-- 新建文件对话框 -->
    <el-dialog
      v-model="fileDialogVisible"
      :title="fileDialogType === 'file' ? '新建文件' : '新建文件夹'"
      width="500px"
    >
      <el-form
        ref="fileFormRef"
        :model="fileForm"
        :rules="fileRules"
        label-width="80px"
      >
        <el-form-item
          :label="fileDialogType === 'file' ? '文件名' : '文件夹名'"
          prop="name"
        >
          <el-input v-model="fileForm.name" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="fileDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFileForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { format } from 'prettier'
import {
  Download,
  Refresh,
  VideoPlay,
  VideoPause,
} from '@element-plus/icons-vue'
import { useIdeStore } from '../../stores/modules/ide'
import FileTree from '../../components/ide/FileTree.vue'
import Editor from '../../components/ide/Editor.vue'
import Terminal from '../../components/ide/Terminal.vue'

const route = useRoute()
const ideStore = useIdeStore()
const fileDialogVisible = ref(false)
const fileDialogType = ref('file')
const fileFormRef = ref()

const fileForm = ref({
  name: '',
})

const fileRules = {
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' },
  ],
}

// 示例文件结构
const files = ref([
  {
    id: '1',
    name: 'src',
    children: [
      {
        id: '2',
        name: 'main.js',
        isFile: true,
        content: '// 这是主文件\nconsole.log("Hello World!");',
      },
      {
        id: '3',
        name: 'components',
        children: [
          {
            id: '4',
            name: 'Hello.vue',
            isFile: true,
            content: '<template>\n  <div>Hello</div>\n</template>',
          },
        ],
      },
    ],
  },
])

onMounted(() => {
  // 加载项目数据
  const projectId = route.params.projectId
  // TODO: 从后端加载项目数据
})

const handleFileClick = (file) => {
  if (file.isFile) {
    ideStore.openFile(file)
  }
}

const handleNewFile = () => {
  fileDialogType.value = 'file'
  fileForm.value.name = ''
  fileDialogVisible.value = true
}

const handleNewFolder = () => {
  fileDialogType.value = 'folder'
  fileForm.value.name = ''
  fileDialogVisible.value = true
}

const submitFileForm = async () => {
  if (!fileFormRef.value) return

  try {
    await fileFormRef.value.validate()
    const newNode = {
      id: Date.now().toString(),
      name: fileForm.value.name,
      isFile: fileDialogType.value === 'file',
    }

    if (fileDialogType.value === 'file') {
      newNode.content = ''
    } else {
      newNode.children = []
    }

    files.value.push(newNode)
    fileDialogVisible.value = false
    ElMessage.success('创建成功')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleDeleteFile = async (file) => {
  const index = files.value.findIndex((f) => f.id === file.id)
  if (index !== -1) {
    files.value.splice(index, 1)
    if (file.isFile) {
      ideStore.closeFile(file.id)
    }
    ElMessage.success('删除成功')
  }
}

const handleRenameFile = (file) => {
  const target = files.value.find((f) => f.id === file.id)
  if (target) {
    target.name = file.name
    ElMessage.success('重命名成功')
  }
}

const handleCloseFile = (fileId) => {
  ideStore.closeFile(fileId)
}

const handleFileChange = (file) => {
  const target = files.value.find((f) => f.id === file.id)
  if (target) {
    target.content = file.content
  }
}

const saveProject = async () => {
  try {
    // TODO: 保存项目到后端
    ElMessage.success('保存成功')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  }
}

const formatCode = async () => {
  try {
    if (!ideStore.currentFile?.content) return

    const formatted = await format(ideStore.currentFile.content, {
      parser: 'babel',
      semi: false,
      singleQuote: true,
    })

    handleFileChange({
      id: ideStore.currentFile.id,
      content: formatted,
    })

    ElMessage.success('格式化成功')
  } catch (error) {
    ElMessage.error('格式化失败：' + error.message)
  }
}

const runCode = () => {
  ideStore.clearTerminalOutput()
  ideStore.appendTerminalOutput('开始运行...')

  try {
    // 这里添加运行代码的逻辑
    const code = ideStore.currentFile?.content
    if (code) {
      // 示例：简单的执行 JavaScript 代码
      const result = eval(code)
      ideStore.appendTerminalOutput('执行结果：' + result)
    }
  } catch (error) {
    ideStore.appendTerminalOutput('错误：' + error.message)
  }
}

const stopCode = () => {
  // TODO: 停止代码执行
  ideStore.appendTerminalOutput('已停止执行')
}
</script>

<style scoped>
.project-ide {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar {
  padding: 8px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  gap: 8px;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-area {
  flex: 1;
  overflow: hidden;
}

:deep(.el-dialog__body) {
  padding-top: 20px;
}
</style>
