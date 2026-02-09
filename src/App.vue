<template>
  <div class="main-menu">
    <div v-if="!isUserAuthenticated">
      <p>Введіть свій позивний</p>
      <input type="text" autocomplete="off" v-model="userCallsign">
      <button @click="setUser">Підтвердити</button>
    </div>
    <main v-else>
      <RouterView />
    </main>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';

const isUserAuthenticated = ref(false);
const userCallsign = ref('');
onMounted(() => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  if (isAuthenticated === 'true') {
    isUserAuthenticated.value = true;
    userCallsign.value = localStorage.getItem('userCallsign');
    
  }
});
const setUser = () => {
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userCallsign', userCallsign.value);
  isUserAuthenticated.value = true;
};
</script>

<style scoped>
input,
textarea,
select {
  margin: 10px 5px;
  border-radius: 5px;
  padding: 5px;
  width: 100%;

}

button {
  text-decoration: none;
  margin: 10px 5px;
  font-size: 20px;
  border: 5px solid;
  border-radius: 12px;
  background-color: transparent;
  padding: 15px;
  border-color: rgb(3, 51, 51);
  cursor: pointer;
  color: aliceblue;
  text-align: center;
  width: 100%;
}

p {
  text-align: center;
  font-size: 1.2rem;
}
</style>
