<template>
<div class="loadding-bank">
      <breeding-rhombus-spinner
  :animation-duration="2000"
  :size="65"
  color="#40d0b8"
/>
</div>
   
</template>

<script>
export default {

}
</script>

<style scoped>
.loadding-bank{
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 9999999;
    
}
</style>