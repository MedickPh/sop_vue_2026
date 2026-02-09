<template>
    <div>
        <p>{{ errorMessage }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    errorMessage: {
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
p {
    color: red;
    font-size: 20px;
    text-align: center;
}

</style>