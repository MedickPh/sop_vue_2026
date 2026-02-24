<template>
  <div>
    <p>Жмиха додано! Перевірь введену інформацію по позивному: <br><span>{{ addUserData }}</span></p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  addUserData: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  background-color: rgba(10, 12, 18, 1);

}

span {
  color: red;
  font-size: 20px;
  text-align: center;
}

p {
  text-align: center;
}
</style>
