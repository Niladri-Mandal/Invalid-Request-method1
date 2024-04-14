const express = require('express');
const app = express();

app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));




app.get('/details', (req, res) => {
  const id = req.query.id;



  if (id ===' ') {
    res.send('Specify the value');
  }
  else if (!id) {
    res.send('Invalid Request');
  } 
   else {
    res.send(`Request received with value ${id}`);
  }
});



app.use((req, res, next) => {
    res.status(404).sendFile('404.html', { root: __dirname + '/public' });
  });


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
