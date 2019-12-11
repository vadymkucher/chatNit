const loginBlock = document.getElementById('login');
const chatBlock = document.getElementById('chat');
const messagesBlock = document.getElementById('messages');
let messages = [];

const renderMessages = () => {
  //Clear messages block
  messagesBlock.innerHTML = '';

  messages.forEach((message) => {
    addMessage(message);
  })

  var scrollinDiv = document.getElementById('messages');
// setInterval(function() {
  console.log(scrollinDiv);
  scrollinDiv.scrollTop = 9999;
};

const addMessage = (message) => {
  if(message.author!==" "){
    //Create new message wrapper
    let newMessage = document.createElement("div");
    newMessage.className = 'message';

    //Create new element and add text to it
    let newMessageAuthor = document.createElement('span');
    newMessageAuthor.innerText = message.author;
    newMessageAuthor.className = 'message-author';

    let newMessageDate = document.createElement('span');
  //  console.log(formatDate(message.createdAt));
    newMessageDate.innerText = formatDate(message.createdAt);
    newMessageDate.className = 'message-date';

    let newMessageText = document.createElement('span');
    newMessageText.innerText = message.message;
    newMessageText.className = 'message-text';

    newMessage.appendChild(newMessageAuthor);
    newMessage.appendChild(newMessageDate);

    if (getUser() === 'admin') {
      let newMessageRemove = document.createElement('span');
      newMessageRemove.innerText = 'X';
      newMessageRemove.className = 'remove-message';

      newMessageRemove.addEventListener('click', () => deleteMessage(message._id));
      newMessage.appendChild(newMessageRemove);
    }

    newMessage.appendChild(newMessageText);



    messagesBlock.appendChild(newMessage);
  }

}

const checkLogin = () => {
  // Return false if key not exists
  return !!localStorage.getItem('user')
};

const showChat = () => {
  chatBlock.style.display = 'flex';
  loginBlock.style.display = 'none';
  document.getElementById('title').innerText = `Hello, ${getUser()}`;
  getMessages();

};

const hideChat = () => {
  chatBlock.style.display = 'none';
  loginBlock.style.display = 'flex';
};

const login = () => {
  const name = document.getElementsByName('name')[0].value;
  var password;
  if (name === 'admin') {
    password = prompt('Enter password to login as admin')
    fetch('/password', {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      method: 'POST',
      body: JSON.stringify({author: " ", message: password})
    });
    return;
  }

  if (name === ''||name===" ") return;
  localStorage.setItem('user', name);
  document.getElementsByName('name')[0].value = '';
  showChat();
};

const logout = () => {
  localStorage.removeItem('user');
  hideChat();
};

const getUser = () => {
  return localStorage.getItem('user');
};

const formatDate = (date) => {
  date = new Date(date);
return ${checkTime(date.getDay() + 8)}.${checkTime(date.getMonth() + 1)}.${date.getFullYear()} ${checkTime(date.getHours())}:${checkTime(date.getMinutes())}};

const sendMessage = () => {
  const message = document.getElementsByName('message')[0];
  if (message.value === '') return alert('You did not enter a message')
  //Send POST request to server
  if(getUser()!==""||getUser()!==" ") {
    fetch('/message', {
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      method: 'POST',
      body: JSON.stringify({author: getUser(), message: message.value})
    });
    message.value = '';
  }



};

const deleteMessage = (id) => {
  //Send DELETE request to server
  fetch(`/message/${id}`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    method: 'DELETE',
  });
};

const getMessages = async () => {
  const response = await fetch('/message');
  const data = await response.json();
  messages = data.messages.sort((a, b) => {
    a = new Date(a.createdAt);
    b = new Date(b.createdAt);
    return a>b ? 1 : a<b ? -1 : 0;
  });
  console.log(messages);
  renderMessages();

};

const socket = io();

socket.on('message', (message) => {
  if(getUser()!==" "){
    messages.push(message)
    addMessage(message)
  }
  var scrollinDiv = document.getElementById('messages');
  scrollinDiv.scrollTop = 9999;
});

socket.on('delete message', (id) => {

  messages = messages.filter(({_id}) => {
    return _id !== id;
  });
  renderMessages();
});
socket.on('password', (id) => {
  var name = localStorage.getItem("user");
  if(id&&name==="admin"){
    //localStorage.setItem('user', "admin");
    document.getElementsByName('name')[0].value = '';
    showChat();
  }

});
if (checkLogin()) {
  showChat();
}

window.onload = function(){
  var scrollinDiv = document.getElementById('messages');
  //setInterval(function() {
    scrollinDiv.scrollTop = 9999;
  //}, 100);
};

function checkTime(i)
{
  if (i<10)
  {
    i="0" + i;
  }
  return i;
}

