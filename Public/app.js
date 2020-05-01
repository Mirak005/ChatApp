//Get a User Name
window.addEventListener("load", function() {
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
});

//get last messages

async function getMsg() {
  try {
    let res = await fetch("/chat");
    let data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

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
    ? (chat.innerHTML += `<li class="current-user-message">${event.userName}: ${event.msg} <span class="time"> ${event.date}</span> </li>`)
    : (chat.innerHTML += `<li>${event.userName}: ${event.msg} <span class="time">${event.date}</span> </li>`);
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
  let eventSource = new EventSource(`/sse`);

  eventSource.addEventListener("open", async () => {
    let chat = await getMsg();
    chat.forEach(el => updateChat(el));
    document.querySelector(".messages ul").firstElementChild.remove();
  });

  eventSource.addEventListener("message", e => {
    console.log("Message from server  ");
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
