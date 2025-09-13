<template>
  
  <v-container>
    <v-card>
      <v-card-title>Mis Gastos</v-card-title>
      <v-card-text>
        <v-data-table :items="gastos" :headers="headers" class="elevation-1">
          <template v-slot:item.acciones="{ item }">
            <v-btn icon @click="editar(item)"><v-icon>mdi-pencil</v-icon></v-btn>
            <v-btn icon @click="eliminar(item.id)"><v-icon>mdi-delete</v-icon></v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="$router.push('/gastos/nuevo')">Agregar Gasto</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import { obtenerGastos, eliminarGasto } from '../api/gastos'

const gastos = ref([])
const headers = [
  { text: 'Descripción', value: 'descripcion' },
  { text: 'Monto', value: 'monto' },
  { text: 'Fecha', value: 'fecha_gasto' },
  { text: 'Acciones', value: 'acciones', sortable: false },
]

const cargar = async () => {
  const res = await obtenerGastos()
  gastos.value = res.data.gastos
}

const eliminar = async (id) => {
  await eliminarGasto(id)
  cargar()
}

const editar = (item) => {
  console.log('Editar', item)
}

const nuevo = () => {
  console.log('Nuevo gasto')
}

onMounted(cargar)
</script>
