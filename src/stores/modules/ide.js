/*
 * @Descripttion: 组件业务名
 * @version:
 * @Author: dty
 * @Date: 2024-12-18 17:32:29
 * @LastEditors: dty
 * @LastEditTime: 2024-12-18 17:33:06
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIdeStore = defineStore('ide', () => {
  const currentFile = ref(null)
  const files = ref([])
  const openedFiles = ref([])
  const terminalOutput = ref('')

  function setCurrentFile(file) {
    currentFile.value = file
  }

  function addFile(file) {
    files.value.push(file)
  }

  function removeFile(fileId) {
    const index = files.value.findIndex((f) => f.id === fileId)
    if (index !== -1) {
      files.value.splice(index, 1)
    }
  }

  function openFile(file) {
    if (!openedFiles.value.find((f) => f.id === file.id)) {
      openedFiles.value.push(file)
    }
    setCurrentFile(file)
  }

  function closeFile(fileId) {
    const index = openedFiles.value.findIndex((f) => f.id === fileId)
    if (index !== -1) {
      openedFiles.value.splice(index, 1)
      if (currentFile.value?.id === fileId) {
        setCurrentFile(
          openedFiles.value[index - 1] || openedFiles.value[0] || null
        )
      }
    }
  }

  function appendTerminalOutput(text) {
    terminalOutput.value += text + '\n'
  }

  function clearTerminalOutput() {
    terminalOutput.value = ''
  }

  return {
    currentFile,
    files,
    openedFiles,
    terminalOutput,
    setCurrentFile,
    addFile,
    removeFile,
    openFile,
    closeFile,
    appendTerminalOutput,
    clearTerminalOutput,
  }
})
