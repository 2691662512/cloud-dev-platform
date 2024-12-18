<template>
  <div class="file-tree">
    <div class="file-tree-header">
      <span>文件目录</span>
      <div class="file-tree-actions">
        <el-button-group>
          <el-button :icon="Document" link @click="$emit('new-file')" />
          <el-button :icon="FolderAdd" link @click="$emit('new-folder')" />
        </el-button-group>
      </div>
    </div>

    <el-tree
      :data="files"
      :props="defaultProps"
      node-key="id"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>
            <el-icon v-if="!data.isFile">
              <Folder />
            </el-icon>
            <el-icon v-else>
              <Document />
            </el-icon>
            {{ node.label }}
          </span>
          <span class="node-actions">
            <el-dropdown
              trigger="click"
              @command="(command) => handleCommand(command, data)"
            >
              <el-icon><More /></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="rename">重命名</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Document, FolderAdd, Folder, More } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const props = defineProps({
  files: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits([
  'file-click',
  'new-file',
  'new-folder',
  'delete-file',
  'rename-file',
])

const defaultProps = {
  children: 'children',
  label: 'name',
}

const handleNodeClick = (data) => {
  if (data.isFile) {
    emit('file-click', data)
  }
}

const handleCommand = async (command, data) => {
  if (command === 'rename') {
    try {
      const { value } = await ElMessageBox.prompt('请输入新名称', '重命名', {
        inputValue: data.name,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
      if (value) {
        emit('rename-file', { ...data, name: value })
      }
    } catch (e) {
      // 用户取消操作
    }
  } else if (command === 'delete') {
    try {
      await ElMessageBox.confirm(
        '确定要删除该文件吗？此操作不可恢复！',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      emit('delete-file', data)
    } catch (e) {
      // 用户取消操作
    }
  }
}
</script>

<style scoped>
.file-tree {
  height: 100%;
  border-right: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}

.file-tree-header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 8px;
}

.node-actions {
  opacity: 0;
  transition: opacity 0.3s;
}

.custom-tree-node:hover .node-actions {
  opacity: 1;
}

.el-icon {
  margin-right: 4px;
}
</style>
