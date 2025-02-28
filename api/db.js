const { MongoClient } = require('mongodb');
const express = require('express');
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');


// Conexión a MongoDB
mongoose.connect('mongodb+srv://simontamarag:Simon304_@cluster0.qxkdcks.mongodb.net/ForeHome') //Aquí se pone el connection string al cluster que tenga, se puede copiar del propio DBCompass
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar con MongoDB:', err));


const app = express();
app.use(cors({
    origin: 'http://localhost:3001', // Permite solicitudes desde tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
}));

app.use(express.json());

// Nombre de la base de datos
const dbName = 'ForeHome';


const nombreSchema = new Schema({
    Nombres: String,
    Apellido: String
})

const datosSchema = new Schema({
    Nombre: [nombreSchema],
    Fecha_nacimiento: String
})

// Modelos
const usuariosSchema = new Schema({
    Correo: String,
    Contraseña: String,
    Datos_personales: [datosSchema],
    Clase: String,
});


const Usuario = mongoose.model('Usuario', usuariosSchema, 'Usuarios');


// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Listar todos los usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const Elementos = await Usuario.find();
        res.json(Elementos);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Actualizar un usuario
app.put('/usuarios/:id', async (req, res) => {
    try {
        const response = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Listar un usuario por ID
app.get('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        res.json(usuario);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Agregar un nuevo usuario
app.post('/usuarios', async (req, res) => {
    const usuario = new Usuario(req.body);
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(usuario.Contraseña, salt);
    usuario.Contraseña = contrasenaEncriptada;
    try {
        const response = await usuario.save();  // Guardar en la colección existente
        res.status(201).json(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

//Registro
async function registrarUsuario(nombre, correo, contrasena) {
    try {
        const response = await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Registro exitoso:", data);
            return data;
        } else {
            const errorData = await response.json();
            console.error("Error al registrar:", errorData);
            return errorData;
        }
    } catch (error) {
        console.error("Error de red:", error);
        throw error;
    }
}

// Función de inicio de sesión
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const SECRET_KEY = process.env.JWT_SECRET_KEY || 'tu_clave_secreta';

    try {
        const usuario = await Usuario.findOne({ Correo: email });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const passwordMatch = await bcrypt.compare(password, usuario.Contraseña);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar el token JWT
        const token = jwt.sign({ email: usuario.Correo }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
        
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
});


// Ruta protegida
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Acceso concedido', user: req.user.email });
});

// Eliminar un elemento
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const response = await Elemento.findByIdAndDelete(req.params.id);
        res.json(response);
    } catch (err) {
        res.status(500).send(err);
    }
});
