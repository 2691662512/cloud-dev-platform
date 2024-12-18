<template>
  <div class="user-profile">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button-group>
            <el-button type="primary" @click="handleEdit">
              {{ isEditing ? '保存' : '编辑' }}
            </el-button>
            <el-button type="warning" @click="passwordDialog = true">
              修改密码
            </el-button>
          </el-button-group>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :disabled="!isEditing"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>

        <el-form-item label="角色">
          <el-tag
            v-for="role in userStore.roles"
            :key="role.id"
            :type="getRoleType(role.name)"
          >
            {{ getRoleName(role.name) }}
          </el-tag>
        </el-form-item>

        <el-form-item label="权限">
          <el-tag
            v-for="permission in userPermissions"
            :key="permission"
            type="info"
            size="small"
            class="permission-tag"
          >
            {{ getPermissionName(permission) }}
          </el-tag>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialog" title="修改密码" width="500px">
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="passwordDialog = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useUserStore } from '../../stores/modules/user'
import { updateUserInfo, changePassword } from '../../api/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const isEditing = ref(false)
const formRef = ref()
const passwordDialog = ref(false)
const passwordFormRef = ref()

const form = reactive({
  username: '',
  email: '',
  phone: '',
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur',
    },
  ],
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const userPermissions = computed(() => {
  return userStore.roles.reduce((permissions, role) => {
    return [...permissions, ...role.permissions]
  }, [])
})

// 角色类型映射
const getRoleType = (role) => {
  const typeMap = {
    admin: 'danger',
    manager: 'warning',
    developer: 'success',
    ops: 'info',
  }
  return typeMap[role] || 'info'
}

// 角色名称映射
const getRoleName = (role) => {
  const nameMap = {
    admin: '管理员',
    manager: '项目经理',
    developer: '开发人员',
    ops: '运维人员',
  }
  return nameMap[role] || role
}

// 权限名称映射
const getPermissionName = (permission) => {
  const nameMap = {
    'user:manage': '用户管理',
    'project:manage': '项目管理',
    'team:manage': '团队管理',
    'code:write': '代码编写',
    'code:submit': '代码提交',
    'code:review': '代码审查',
    'code:deploy': '代码部署',
    'system:monitor': '系统监控',
  }
  return nameMap[permission] || permission
}

onMounted(async () => {
  const userInfo = userStore.userInfo
  if (userInfo) {
    form.username = userInfo.username
    form.email = userInfo.email
    form.phone = userInfo.phone
  }
})

const handleEdit = async () => {
  if (isEditing.value) {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      await updateUserInfo(form)
      await userStore.fetchUserInfo()
      isEditing.value = false
      ElMessage.success('更新成功')
    } catch (error) {
      ElMessage.error(error.message || '更新失败')
    }
  } else {
    isEditing.value = true
  }
}

const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    await changePassword(passwordForm)
    passwordDialog.value = false
    ElMessage.success('密码修改成功')
    // 清空表单
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    ElMessage.error(error.message || '密码修改失败')
  }
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.permission-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}
</style>
