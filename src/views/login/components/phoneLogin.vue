<template>
  <div class="user-login animate__animated animate__fadeInRightBig">
    <h2>手机登录</h2>
    <el-form>
      <el-form-item prop="name">
        <el-input
          v-model="ruleForm.username"
          placeholder="手机号码"
        />
      </el-form-item>
      <el-form-item prop="name">
        <div style="display: flex;width: 100%">
          <el-input
            v-model="ruleForm.username"
            placeholder="验证码"
            style="width: 100%"
          />
          <el-button style="margin-left: 20px;">
            获取验证码
          </el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          class="login-btn"
          :loading="false"
          color="#2a42b3"
        >
          登录
        </el-button>
      </el-form-item>
      <el-form-item>
        <div class="other-btn-container">
          <el-button
            class="other-btn-item"
            @click="otherBtnChange"
          >
            返回
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const emit = defineEmits(['cancelChange'])
const ruleForm = reactive({ username: '', checked1: false })
const otherBtnChange = () => {
  emit('cancelChange')
}
</script>
  <style scoped lang="scss">
  .user-login{
      width: 400px;
  }
  .login-btn{
    color:#fff;
    width: 100%;
    height: 40px;
  }
  .operation{
      width: 100%;
      .forgot{
          cursor: pointer;
          color: #2a42b3;
          float: right;
      }
  }
  .other-btn-container{
      width: 100%;
      display: flex;
      .other-btn-item{
          width: 100%;
          height: 40px;
      }
  }
  </style>
