const zod = require('zod')

const movieSchema = zod.object({
    title: zod.string({
        invalid_type_error: 'El titulo no es valido',
        required_error: 'el titulo es obligatorio'
    }),
    year: zod.number().int().positive().min(1900).max(2024),
    director: zod.string(),
    duration: zod.number().int().positive(),
    rate: zod.number().min(0).max(10),
    poster: zod.string().url({
        message: 'poster debe ser una url'
    }),
    genre: zod.array(zod.enum(['Action','Adventure','Comedy','Drama','Fantasy','Horror','Thriller']),{
        required_error:'El genero es requerido',
        invalid_type_error:'debe ser un array'
    }) 
})

function validateMovie(object){
    return movieSchema.safeParse(object)
}

function validatePartialMovie(object){
    return movieSchema.partial().safeParse(object)
}

module.exports = {
    validateMovie,
    validatePartialMovie
};