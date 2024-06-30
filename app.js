const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./Schemas/Movies')

const movies = require('./movies.json')

//Middleware para analizar cuerpos de solicitud JSON y URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(3000, () => {
    console.log('Servidor abierto en el puerto 3000');
});

app.get('/', (req, res) => {
    res.json({ message: 'Hola mundo' });
});

app.get('/movies', (req, res) => {
    const genre = req.query.genre; // Obtener el parámetro de consulta 'genre' /movies?genre=xxx
    if (genre) {
        // Filtrar películas por género si se proporciona el parámetro de consulta
        const filteredMovies = movies.filter(movie => movie.genre.includes(genre));
        res.json(filteredMovies);
    } else {
        // Si no se proporciona 'genre' en los parámetros de consulta, devolver todas las películas
        res.json(movies);
    }
});


app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const pelicula = movies.find(pelicula => pelicula.id === id);

    if (pelicula) {
        return res.json(pelicula);
    }
    res.status(404).json({ message: 'Película no encontrada' });
});

app.post('/movies',(req,res)=>{
    const resultado = validateMovie(req.body)
    if(resultado.error){
        res.status(400).json({error: JSON.parse(resultado.error.message)})
    }

    const newMovie = {
        id: crypto.randomUUID(), // Genera un UUID
        title: req.body.title,
        genre: req.body.genre,
        year: req.body.year,
        direction: req.body.direction,
        rate: req.body.rate,
        poster: req.body.poster,
        duration: req.body.duration
    }

    movies.push(newMovie)

    res.status(201).json(newMovie)
})

app.patch('/movies/:id',(req,res) =>{
    id = req.params.id
    const result = validatePartialMovie(req.body)
    const PeliculasIndex = movies.findIndex(x => x.id === id);
    const movie = movies[PeliculasIndex]

    if(!result) return res.status(404).json({message : 'error al validar la pelicula a actualizar'})
    if(PeliculasIndex == -1) return res.status(404).json({message : 'Pelicula no encontrada'})

    const updateMovie = {
        ...movies[PeliculasIndex],
        ...result.data
    }

    movies[PeliculasIndex] = updateMovie

    res.status(200).json(updateMovie)

    
})

//RECIBIR EL CUERPO DE UNA PETICION (FORMULARIO EN POSTMAN)
app.get('/formulariopostman', (req, res) => {
    res.json(req.body);
});

//RECIBIR EL PARAMETRO DE UNA PETICION POR MEDIO DE LA URL (UN LINK)
app.get('/formulariopostman/:nombre', (req, res) => {
    res.json(req.params);
});