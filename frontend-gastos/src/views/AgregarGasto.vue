<template>
  <v-container class="mt-5">
    <v-card>
      <v-card-title>Agregar nuevo gasto</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            label="Descripción"
            v-model="descripcion"
            :rules="[v => !!v || 'La descripción es obligatoria']"
            required
          />
          <v-text-field
            label="Monto"
            v-model="monto"
            type="number"
            :rules="[v => !!v || 'El monto es obligatorio']"
            required
          />
          <v-text-field
            label="Fecha"
            v-model="fecha_gasto"
            type="date"
            :rules="[v => !!v || 'La fecha es obligatoria']"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="cancelar">Cancelar</v-btn>
        <v-btn color="primary" @click="guardar">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { agregarGasto } from '../api/gastos'

const router = useRouter()
const descripcion = ref('')
const monto = ref('')
const fecha_gasto = ref('')
const valid = ref(false)
const formRef = ref(null)

const guardar = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid) return

  try {
    await agregarGasto({
      descripcion: descripcion.value,
      monto: monto.value,
      fecha_gasto: fecha_gasto.value,
    })
    alert('Gasto agregado con éxito')
    router.push('/gastos')
  } catch (error) {
    alert(error.response?.data?.message || 'Error al agregar gasto')
  }
}

const cancelar = () => {
  router.push('/gastos')
}
</script>
