/*
 * @Descripttion: 组件业务名
 * @version: 
 * @Author: dty
 * @Date: 2024-12-18 15:28:07
 * @LastEditors: dty
 * @LastEditTime: 2024-12-18 22:09:46
 */
import { defineConfig } from 'vite'
import vue from '@vitejsplugin-vue'
mport path from 'path'
export default defineConfig({
 plugins: [vue()],
 resolve: {
   alias: {
     '@': path.resolve(__dirname, './src')
   }
 }
)