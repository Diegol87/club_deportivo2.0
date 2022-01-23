const { it } = require('mocha')
const { describe } = require('mocha')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./index.js')

chai.use(chaiHttp)

describe('Vamos a probar la API REST', () => {
    it('Verificar que la ruta /deportes devuelve un JSON con la propiedad deportes y que sea un arreglo', (done) => {
        chai
            .request(server)
            .get('/deportes')
            .end((err, res) => {
                chai.expect(err).to.be.null
                chai.expect(res).to.have.status(200)
                const dato = JSON.parse(res.text)
                chai.expect(dato).to.have.property('deportes')
                chai.expect(dato.deportes).to.be.an('array')
                done()
            })
    })
})