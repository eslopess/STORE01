import express from "express"
import bodyParser from "body-Parser"
import pathDB from "./connect-db.js"
import listarDepartamentos from './mock/ListarDepartamentos.json' assert { type: 'json'}
import listarDepartamento from './mock/ListarDepartamento.json' assert { type: 'json'}

const useMock = 'false'

const appStore = express()
appStore.use(bodyParser.json()) //O "extend" habilita o JSON para suportar caracteres UTF-8
appStore.use(bodyParser.urlencoded( { extended: true}))


//--------------------------------------------------------------------

appStore.get('/departamentos', (req, res) => {
    const guardaMethod = req.method
    console.log(`${guardaMethod} /departamentos`)

/*  if (useMock) { res.send(listarDepartamentos) return } */

    pathDB.query('SELECT * FROM DEPARTAMENTOS', (err, result) => {
      if (err) {
        res.status(500)
        res.send(err)
    }
    res.send(result)
/*  res.send (ListarDepartamentos) */
    }) 
}) 

//---------------------------------------------------------------------

appStore.get('/departamentos/:guardaId', (req, res) => {
    const { guardaId } = req.params
    const guardaMethod = req.method
    console.log(`${guardaMethod} /departamentos/${guardaId}`) //só publica no Terminal - comando desnecessario em producao
  
/*  if (useMock) { res.send(listarDepartamento) return } */
  
    pathDB.query(`SELECT * FROM DEPARTAMENTOS WHERE id_departamento = '${guardaId}'`, (err, result) => {
      if (err) {
        res.status(500)
        res.send(err)
 res.send (ListarDepartamento)
      }
  
      if (result.length === 0) {
        res.status(404) // NOT FOUND
      }
  
      res.send(result)
/*    res.send (ListarDepartamento) */
    })
  
  })

//--------------------------------------------------------------------------
 
appStore.post('/departamentos', (req, res) => {

    const guardaMethod = req.method
    console.log(`${guardaMethod} /departamentos`)

    let { nome = '', sigla = '' } = req.body //let cria uma variavel local
    nome = nome.trim() //propriedade .trim remove os espaços em banco de uma string
    sigla = sigla.trim() //REGEX – Expressão regular - Validação de preenchimento de campos em formulários
    
      if (nome === '' || sigla === '') {
      res.send({
        message: 'Wrong or insufficient parameters',
        parameters_received: req.body
      })
      return
    }

    pathDB.query(`INSERT INTO DEPARTAMENTOS (nome, sigla) VALUES 
    ('${nome}', '${sigla}')`, (err, result) => {
    if (err) {
      res.status(500)
      res.send(err)
      return
    }
     
    if (result.insertId) {
        res.send({
          message: 'Register inserted with success',
          insertId: result.insertId
        })
        return
      }
    res.send(result)
    /* res.send(`${guardaMethod} /departamentos`) */
})
})

//---------------------------------------------------------------------------

appStore.put('/departamentos/:guardaId', (req, res) => {

    const { guardaId } = req.params
    const guardaMethod = req.method
    console.log(`${guardaMethod} /departamentos/${guardaId}`)
  
    let { nome = '', sigla = '' } = req.body
  
    nome = nome.trim()
    sigla = sigla.trim()
  
    if (nome === '' || sigla === '') {
      res.send({
        message: 'Wrong or insufficient parameters',
        parameters_received: req.body
      })
      return
    }

    pathDB.query(`UPDATE DEPARTAMENTOS SET nome='${nome}', sigla='${sigla}'
      WHERE id_departamento = ${guardaId}`, (err, result) => {
      if (err) {
        res.status(500)
        res.send(err)
        return
      }
      
      //Em caso de sucesso:
      if (result.affectedRows > 0) {
        res.send({
          message: 'Row updated with success',
          id_departamento: guardaId 
        })
        return
      }

      res.status(404)
      res.send({
        "message": "Row not found",
        "id_departamento": guardaId
      })
    })
})


//-----------------------------------------------------------------------------

appStore.delete('/departamento/:guardaId', (req, res) => { 
    const { guardaId } = req.params
    const guardaMethod = req.method
    console.log(`${guardaMethod} /departamentos/${guardaId}`)
  
    pathDB.query(`DELETE FROM DEPARTAMENTOS WHERE id_departamento = '${guardaId}'`, (err, result) => {
      if (err) { //idem linha anterior
        res.status(500)
        res.send(err)
        return
      }
  
      if (result.affectedRows > 0) {
        res.status(200)
        res.send({
          'message': 'Row deleted with success',
          'id_departamento': guardaId
        })
        return
      }
  
      res.status(404)
      res.send({
        "message": "Row not found",
        "id_departamentos": guardaId
      })
      
    })
  })
  
//-----------------------------------------------------------------------------


appStore.listen(3033, () => {
    console.log ('SERVER RUNNING 01 ...')

})