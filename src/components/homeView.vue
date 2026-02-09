<template>
    <div class="nav_block">
        <router-link to="/addUser">Додати жмиха</router-link>
        <router-link to="/findUser">Знайти жмиха</router-link>
    </div>
</template>

<style scoped>
.nav_block {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

a {
    text-decoration: none;
    margin: 10px 5px;
    font-size: 25px;
    margin: 15px;
    border: 5px solid;
    border-radius: 12px;
    background-color: transparent;
    padding: 15px;
    border-color: rgb(3, 51, 51);
    cursor: pointer;
    color: aliceblue;
    text-align: center;
}
</style>
