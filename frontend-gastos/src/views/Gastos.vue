<template>
  <!-- Contenedor principal con diseño de Vuetify -->
  <v-container>
    <!-- Tarjeta que contiene la tabla de gastos -->
    <v-card>
      <!-- Título de la tarjeta -->
      <v-card-title>Mis Gastos</v-card-title>

      <!-- Sección de contenido de la tarjeta -->
      <v-card-text>
        <!-- Tabla de datos que muestra los gastos -->
        <!-- :items -> datos de la tabla (array de gastos)
             :headers -> define las columnas -->
        <v-data-table :items="gastos" :headers="headers" class="elevation-1">

          <!-- Slot personalizado para la columna 'acciones' -->
          <template v-slot:item.acciones="{ item }">
            <!-- Botón para editar el gasto -->
            <v-btn icon @click="editar(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <!-- Botón para eliminar el gasto -->
            <v-btn icon @click="eliminar(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>

      <!-- Sección inferior de la tarjeta con acciones -->
      <v-card-actions>
        <!-- Botón que redirige a la ruta de crear nuevo gasto -->
        <v-btn color="primary" @click="$router.push('/gastos/nuevo')">
          Agregar Gasto
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
/* Importaciones necesarias */
import { ref, onMounted } from 'vue' // Manejo de estado reactivo y ciclo de vida
import '@mdi/font/css/materialdesignicons.css' // Íconos Material Design
import { obtenerGastos, eliminarGasto } from '../api/gastos' // Funciones API

/* Estado reactivo para almacenar los gastos */
const gastos = ref([])

/* Definición de las columnas de la tabla */
const headers = [
  { text: 'Descripción', value: 'descripcion' }, // Columna de descripción del gasto
  { text: 'Monto', value: 'monto' },             // Columna del monto
  { text: 'Fecha', value: 'fecha_gasto' },       // Columna de fecha del gasto
  { text: 'Acciones', value: 'acciones', sortable: false }, // Botones de editar/eliminar
]

/* Función para cargar los gastos desde la API */
const cargar = async () => {
  const res = await obtenerGastos()      // Llama al endpoint para traer gastos
  gastos.value = res.data.gastos         // Asigna los datos obtenidos a la tabla
}

/* Función para eliminar un gasto */
const eliminar = async (id) => {
  await eliminarGasto(id) // Llama al endpoint para borrar gasto
  cargar()                // Recarga los datos actualizados
}

/* Función para editar un gasto (aquí solo hace log, se puede mejorar) */
const editar = (item) => {
  console.log('Editar', item)
}

/* Función para crear un nuevo gasto (aquí solo hace log, ya existe el botón que redirige) */
const nuevo = () => {
  console.log('Nuevo gasto')
}

/* Hook que ejecuta cargar() cuando el componente se monta */
onMounted(cargar)
</script>

<style>
/* Fondo general */
.v-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #5a2d91, #8e44ad);
  padding: 20px;
}

/* Card principal */
.v-card {
  width: 150%;
  max-width: 1500px; /* Más grande que antes */
  border-radius: 20px;
  padding: 50px;
  background: rgb(250, 9, 9);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 5px solid rgba(21, 212, 79, 0.25);
  box-shadow: 0 8px 25px rgba(239, 9, 9, 0.3);
  color: ff #fff;
}

/* Título */
.v-card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #131102; /* dorado */
  text-align: center;
}

/* Data table */
.v-data-table {
  border-radius: 15px;
  overflow: hidden;
  background: rgba(80, 19, 247, 0.08);
}

.v-data-table th {
  background: rgba(255, 215, 0, 0.2);
  color: #fff !important;
  font-weight: bold;
}

.v-data-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  transition: 0.3s;
}

/* Botón principal */
.v-btn {
  font-weight: bold;
  background: #ffd700 !important;
  color: #bbb!important;
  border-radius: 12px;
  padding: 10px 20px;
  transition: all 0.3s ease;
}

.v-btn:hover {
  background: #ffcc00 !important;
  transform: scale(1.05);
}


</style>
