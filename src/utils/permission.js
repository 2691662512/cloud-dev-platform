/*
 * @Descripttion: 组件业务名
 * @version:
 * @Author: dty
 * @Date: 2024-12-18 21:04:44
 * @LastEditors: dty
 * @LastEditTime: 2024-12-18 21:04:54
 */
// 权限定义
export const Permissions = {
  // 用户管理权限
  USER_MANAGE: 'user:manage',

  // 项目管理权限
  PROJECT_MANAGE: 'project:manage',
  PROJECT_VIEW: 'project:view',

  // 团队管理权限
  TEAM_MANAGE: 'team:manage',
  TEAM_VIEW: 'team:view',

  // 代码管理权限
  CODE_WRITE: 'code:write',
  CODE_SUBMIT: 'code:submit',
  CODE_REVIEW: 'code:review',
  CODE_DEPLOY: 'code:deploy',

  // 系统监控权限
  SYSTEM_MONITOR: 'system:monitor',
}

// 角色权限配置
export const RolePermissions = {
  // 管理员拥有所有权限
  admin: Object.values(Permissions),

  // 项目经理权限
  manager: [
    Permissions.PROJECT_MANAGE,
    Permissions.PROJECT_VIEW,
    Permissions.TEAM_MANAGE,
    Permissions.TEAM_VIEW,
    Permissions.CODE_REVIEW,
    Permissions.CODE_WRITE,
    Permissions.CODE_SUBMIT,
  ],

  // 开发人员权限
  developer: [
    Permissions.PROJECT_VIEW,
    Permissions.TEAM_VIEW,
    Permissions.CODE_WRITE,
    Permissions.CODE_SUBMIT,
  ],

  // 运维人员权限
  ops: [
    Permissions.PROJECT_VIEW,
    Permissions.CODE_DEPLOY,
    Permissions.SYSTEM_MONITOR,
  ],
}

// 检查用户是否有某个权限
export function hasPermission(userRoles, permission) {
  if (!userRoles || userRoles.length === 0) return false

  // 如果是管理员，直接返回 true
  if (userRoles.includes('admin')) return true

  // 检查用户角色是否有对应权限
  return userRoles.some((role) => {
    const permissions = RolePermissions[role]
    return permissions && permissions.includes(permission)
  })
}

// 权限指令
export function setupPermissionDirective(app) {
  app.directive('permission', {
    mounted(el, binding) {
      const { value } = binding
      const userStore = useUserStore()

      if (value && !hasPermission(userStore.roles, value)) {
        el.parentNode?.removeChild(el)
      }
    },
  })
}
