<!--
 * @Descripttion: 组件业务名
 * @version: 
 * @Author: dty
 * @Date: 2024-12-18 17:30:52
 * @LastEditors: dty
 * @LastEditTime: 2024-12-18 17:35:36
-->
<template>
  <div class="terminal-container">
    <div class="terminal-header">
      <span>终端输出</span>
      <el-button-group>
        <el-button :icon="Delete" link @click="clearOutput"> 清空 </el-button>
      </el-button-group>
    </div>
    <div class="terminal-content" ref="terminalContent">
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Delete } from '@element-plus/icons-vue'

const props = defineProps({
  output: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['clear'])
const terminalContent = ref(null)

// 自动滚动到底部
watch(
  () => props.output,
  () => {
    if (terminalContent.value) {
      setTimeout(() => {
        terminalContent.value.scrollTop = terminalContent.value.scrollHeight
      }, 0)
    }
  }
)

const clearOutput = () => {
  emit('clear')
}
</script>

<style scoped>
.terminal-container {
  height: 200px;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  color: #fff;
}

.terminal-header {
  padding: 8px;
  background-color: #2d2d2d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.terminal-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  font-family: 'Courier New', Courier, monospace;
}

.terminal-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

:deep(.el-button) {
  color: #fff;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #2d2d2d;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}
</style>
