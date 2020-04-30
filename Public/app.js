//Get a User Name
window.onload = function() {
  if (!localStorage.getItem("userName")) {
    let username = prompt("enter a user name");
    if (username !== null && username.trim() !== "") {
      localStorage.setItem("userName", username);
    } else {
      let guest = Math.floor(Math.random() * 10000);
      localStorage.setItem("userName", `User${guest}`);
    }
  }

  alert("Welcome " + localStorage.getItem("userName"));
  greet();
};

//Send Message

async function sendMessag(data) {
  const config = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };

  try {
    await fetch("/chat", config);
  } catch (error) {
    console.error(error);
  }
}

//Update the Veiw
function updateChat(event) {
  const chat = document.querySelector(".messages ul");
  event.userName === localStorage.getItem("userName")
    ? (chat.innerHTML += `<li class="current-user-message"> <b>${event.userName}</b> :${event.msg}</li>`)
    : (chat.innerHTML += `<li> <b>${event.userName}</b> :${event.msg}</li>`);
  document.querySelector(".messages ul li:last-child").scrollIntoView();
}

function greet() {
  const navmenu = document.getElementById("navmenu");
  const logout = document.createElement("li");
  const textLogout = document.createTextNode("Logut");
  logout.appendChild(textLogout);
  logout.addEventListener("click", () => {
    alert("Good Bye " + localStorage.getItem("userName"));
    localStorage.clear("userName");
    navmenu.lastElementChild.remove();
    navmenu.lastElementChild.remove();
    document.getElementById("form-chat").remove();
  });
  const li = document.createElement("li");
  const text = document.createTextNode(localStorage.getItem("userName"));
  li.appendChild(text);
  navmenu.appendChild(li);
  navmenu.appendChild(logout);
}

//Server-Stream-Event
function sse() {
  let eventSource = new EventSource(`http://localhost:5000/sse`);

  eventSource.addEventListener("message", e => {
    let chat = JSON.parse(e.data);
    
    updateChat(chat[chat.length - 1]);
  });
}

// Chat input
const form = document.getElementById("form-chat");
const input = document.querySelector("#form-chat textarea");

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!input.value.trim()) {
    return alert("Please enter a message :D ");
  }
  let userName = localStorage.getItem("userName");
  let msg = input.value;
  let data = { userName, msg };
  sendMessag(data);
  input.value = "";
});

sse();
