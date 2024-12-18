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
          <div ref="editorContainer" class="monaco-editor"></div>
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
const editorContainer = ref(null)
const editor = ref(null)
const activeTab = ref(null)

// 初始化编辑器
onMounted(() => {
  if (editorContainer.value) {
    editor.value = monaco.editor.create(editorContainer.value, {
      value: '',
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: {
        enabled: true,
      },
    })

    // 监听内容变化
    editor.value.onDidChangeModelContent(() => {
      if (props.currentFile) {
        emit('change-file', {
          ...props.currentFile,
          content: editor.value.getValue(),
        })
      }
    })
  }
})

// 销毁编辑器
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.dispose()
  }
})

// 监听当前文件变化
watch(
  () => props.currentFile,
  (newFile) => {
    if (newFile && editor.value) {
      activeTab.value = newFile.id
      editor.value.setValue(newFile.content || '')
      editor.value.updateOptions({
        language: getLanguage(newFile.name),
      })
    }
  },
  { immediate: true }
)

const getLanguage = (filename) => {
  const ext = filename.split('.').pop()
  const languageMap = {
    js: 'javascript',
    ts: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    vue: 'vue',
    py: 'python',
    java: 'java',
    go: 'go',
  }
  return languageMap[ext] || 'plaintext'
}

const closeTab = (targetName) => {
  emit('close-file', targetName)
}

const switchTab = (tab) => {
  const file = props.openedFiles.find((f) => f.id === tab.props.name)
  if (file) {
    emit('change-file', file)
  }
}
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
