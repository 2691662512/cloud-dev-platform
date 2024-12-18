<template>
  <div class="editor-container">
    <div class="editor-tabs">
      <el-tabs
        v-model="activeTab"
        type="card"
        closable
        @tab-remove="closeTab"
        @tab-click="switchTab"
      >
        <el-tab-pane
          v-for="file in openedFiles"
          :key="file.id"
          :label="file.name"
          :name="file.id"
        >
          <div
            :ref="(el) => setEditorRef(el, file.id)"
            class="monaco-editor"
          ></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { useIdeStore } from '../../stores/modules/ide'

const props = defineProps({
  openedFiles: {
    type: Array,
    required: true,
  },
  currentFile: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close-file', 'change-file'])
const ideStore = useIdeStore()
const activeTab = ref(null)
const editors = new Map() // 存储编辑器实例

// 设置编辑器容器引用
const setEditorRef = (el, fileId) => {
  if (el && !editors.has(fileId)) {
    const editor = monaco.editor.create(el, {
      value: props.openedFiles.find((f) => f.id === fileId)?.content || '',
      language: getLanguage(
        props.openedFiles.find((f) => f.id === fileId)?.name
      ),
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: true },
    })

    editors.set(fileId, editor)

    // 监听内容变化
    editor.onDidChangeModelContent(() => {
      emit('change-file', {
        id: fileId,
        content: editor.getValue(),
      })
    })
  }
}

// 获取文件语言
const getLanguage = (filename = '') => {
  const ext = filename.split('.').pop()
  const languageMap = {
    js: 'javascript',
    ts: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    vue: 'javascript',
    py: 'python',
    java: 'java',
    go: 'go',
  }
  return languageMap[ext] || 'plaintext'
}

// 关闭标签页
const closeTab = (targetName) => {
  const editor = editors.get(targetName)
  if (editor) {
    editor.dispose()
    editors.delete(targetName)
  }
  emit('close-file', targetName)
}

// 切换标签页
const switchTab = (tab) => {
  const file = props.openedFiles.find((f) => f.id === tab.props.name)
  if (file) {
    emit('change-file', file)
  }
}

// 组件卸载时清理编辑器实例
onBeforeUnmount(() => {
  editors.forEach((editor) => editor.dispose())
  editors.clear()
})
</script>

<style scoped>
.editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.monaco-editor {
  height: 100%;
  min-height: 300px;
}

:deep(.el-tabs__content) {
  flex: 1;
  height: calc(100% - 40px);
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style>
