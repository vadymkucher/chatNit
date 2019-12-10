const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');


const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


const Message = require('./models/Message');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

//Connect to MongoDB, settings for preventing warnings
mongoose.connect('mongodb+srv://Vadym:kucher8967@cluster0-j99vi.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

//Handler for POST request to '/message'
app.post('/message', async (req, res) => {
  //Create message and save to DB
  const message = await Message.create(req.body);
  res.json({ success: true });
  //Send message to all connected users

  if(req.body.author!==" ")
    io.emit('message', message);
});
app.post('/password', async (req) => {
  var message = req.body;
  var pass = "111";
  if(message.message===pass){
    io.emit('password', true);
  } else {
    io.emit('password', false);
  }
  //  console.log(req)
  // console.log(res)
});
//Handler for GET request to '/message'
app.get('/message', async (req, res) => {
  //Get all messaged from DB
  const messages = await Message.find();

  res.json({ success: true, messages });
});

//Handler for DELETE request to '/message/:id' e.g. '/message/1'
app.delete('/message/:id', async (req, res) => {
  //Get message id from request url
  const id = req.params.id;

  //Delete message from DB
  await Message.findByIdAndDelete(id);

  res.json({ success: true, id });

  //Send message to all connected users
  io.emit('delete message', id);

});


http.listen(3000, () => {
  console.log('Server listening in 3000 port')
})
