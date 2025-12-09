<template>
  <v-app>
    <v-main>
      <router-view /> <!-- Aquí se cargan tus vistas (Login, Register, Gastos) -->
    </v-main>
  </v-app>
</template>

<script setup>

</script>
<style>
/* Opcional: darle fondo */
html,
body,
#app {
  height: 100%;
  margin: 0;
}
</style>
