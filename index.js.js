const url = require('url')
const http = require('http')
const fs = require('fs')

const server = http
  .createServer((req, res) => {

    let deportesJSON = JSON.parse(fs.readFileSync('deportes.json','utf8'))
    let deportes = deportesJSON.deportes

    if (req.url == '/') {
      res.setHeader('content-type', 'text/html')
      fs.readFile('index.html', 'utf8', (err, data) => {
        res.end(data)
      })
    }

    //1. Crear una ruta GET que al consultardevuelva en formato JSON todos los deportes registrados

    if (req.url === '/deportes' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type' : 'application/json' })
      res.end(JSON.stringify(deportesJSON))
    }

    //2. Crear una ruta POST que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON. Debe generearsw una respuesta en caso de no recibir ambos valores en la consulta

    if (req.url === '/agregar' && req.method === 'POST') {
      let response = ''
      req.on('data', (body) => {
        response += body
      })

      req.on('end', () => {
        if(response.nombre === '' || response.precio === '')
          return res.end('Los campos de nombre y precio son obligatorios 😠') 

        const nuevoDeporte  =JSON.parse(response)

        deportesJSON.deportes.push(nuevoDeporte)

        fs.writeFile('deportes.json', JSON.stringify(deportesJSON), (err) => {
          if(err) return res.end('No se logra ingresar el nuevo deporte 😢')
          res.end('Registro con exito 😎')
        })
      })
    } 

    //3. Crear una ruta PUT que se actualice el precio de alguno de los deportes registrados y lo persistan en un arvhivo JSON. Debe generarse una respuesta en caso de no recibir ambos vaores e la consulta

    if (req.url === '/editar' && req.method === 'PUT') {
      let response = ''
      req.on('data', (body) => {
        response += body
      })

      req.on('end', () => {
        if(response.nombre === '' || response.precio === '') 
          return res.end('Los campos de nombre y precio son obligatorios 😠')

          const nuevoPrecio  =JSON.parse(response)
          
          deportesJSON.deportes = deportes.map((dep) => {
            if(dep.nombre === nuevoPrecio.nombre) {
              dep.precio = nuevoPrecio.precio
            }

            return dep
          })

          fs.writeFile('deportes.json', JSON.stringify(deportesJSON), (err) => {
            if(err) return res.end('No se logro cambiar le precio 😢')
            res.end('editado con exito 😎')
          })

        }
      )
    }

    //4. Crear una ruta DELETE que elimine un deporte basadp en su nombre solicitado desde el cliente

    if(req.url.includes('/eliminar') && req.method === 'DELETE') {

        const { nombre } = url.parse(req.url, true).query

        deportesJSON.deportes = deportes.filter((dep) => dep.nombre !== nombre)

        fs.writeFile('deportes.json', JSON.stringify(deportesJSON), (err) => {
          if(err) return res.end('El deporte no se puede eliminar ya que no existe 😢')
          res.end(`El deporte se elimino con exito 😎`)
        }) 
      
    }
  })
  server.listen(3000, () => {
    console.log('🚀🚀🚀')
  })

  module.exports = server
