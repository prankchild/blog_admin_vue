<template>
  <el-card class="box-card">
    <template
      v-if="titleName"
      #header
    >
      <div class="card-header">
        <span>{{ titleName }}</span>
        <div
          v-if="showHeaderBtn"
          class="header-btn"
        >
          <el-button
            color="#2a42b3"
            style="width: 70px;"
            @click="submit"
          >
            保存
          </el-button>
          <el-button
            style="width: 70px;"
            @click="cancel"
          >
            取消
          </el-button>
        </div>
      </div>
    </template>
    <slot />
  </el-card>
</template>

<script  setup name="Card">
import { defineProps } from 'vue'
const props = defineProps({
  titleName: {
    type: String,
    default: ''
  },
  showHeaderBtn: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['submit', 'cancel'])
const submit = () => {
  emit('submit')
}
const cancel = () => {
  emit('cancel')
}
</script>

<style scoped lang="scss">
.box-card{
  margin: 10px 0;
}
.card-header{
  display: flex;
  span{
    font-size: 14px;
    font-weight: 600;
  }
  .header-btn{
    margin-left: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
