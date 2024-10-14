const express = require('express');
const numeroALetras = require('./app');  

const app = express();

app.get('/:numero', (req, res) => {
  const numero = parseFloat(req.params.numero);  
  const resultado = numeroALetras(numero);  
  res.send(resultado);  
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
