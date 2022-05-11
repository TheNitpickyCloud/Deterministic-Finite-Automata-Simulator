<template>
  <span class="nodeText">
    <h3>{{ theID }}</h3>
  </span>
</template>

<script>


export default {
    props: ["theID"],
    setup(props){
        
    }
}
</script>

<style scoped>
.nodeText{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>