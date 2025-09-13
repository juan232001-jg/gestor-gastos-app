// index.js
// -----------------------------------------------------------------------------
// Archivo principal de la aplicación.
// Configura el servidor Express, carga las variables de entorno,
// inicializa middlewares y define los puntos de entrada de las rutas.
// -----------------------------------------------------------------------------

// Importa Express, framework para crear aplicaciones web y APIs en Node.js
const express = require('express');

// Importa dotenv para poder leer las variables de entorno desde el archivo .env
const dotenv = require('dotenv');

const cors =require('cors')

// Importación de rutas (comentadas por ahora hasta que se implementen)
const authRoutes = require('./routes/auth');
const gastosRoutes = require('./routes/gastos');

// Carga las variables de entorno en process.env
dotenv.config(); 

// Crea una instancia de la aplicación Express
const app = express();

// Middleware para procesar solicitudes con cuerpo en formato JSON
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",  // Tu frontend en Vue
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true
}));
// Definición de rutas base (comentadas hasta activar los módulos)
app.use('/api/auth', authRoutes);     // Rutas para autenticación de usuarios
app.use('/api/gastos', gastosRoutes); // Rutas para gestión de gastos

// Inicia el servidor en el puerto definido en el archivo .env
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});