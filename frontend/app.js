const API_BASE = "http://localhost:4000/api"; // Ajusta si tu backend vive en otro host

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const authMsg = document.getElementById("auth-msg");
const saveMsg = document.getElementById("save-msg");
const recordsList = document.getElementById("records");

function getToken() {
  return localStorage.getItem("token");
}
function setToken(t) {
  localStorage.setItem("token", t);
}
function clearToken() {
  localStorage.removeItem("token");
}
function showApp(isAuthed) {
  if (isAuthed) {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    loadRecords();
  } else {
    appSection.classList.add("hidden");
    authSection.classList.remove("hidden");
  }
}

async function registerSeed() {
  authMsg.textContent = "Registrando usuario demo...";
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Usuario Demo",
      email: "demo@example.com",
      password: "demo1234"
    })
  });
  const data = await res.json();
  if (!res.ok) {
    authMsg.textContent = data.error || "No se pudo registrar";
    return;
  }
  setToken(data.token);
  authMsg.textContent = "Usuario creado y logueado como demo@example.com";
  showApp(true);
}

async function login(e) {
  e.preventDefault();
  authMsg.textContent = "Autenticando...";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    authMsg.textContent = data.error || "Login falló";
    return;
  }
  setToken(data.token);
  authMsg.textContent = `Bienvenido, ${data.user.name}`;
  showApp(true);
}

async function saveRecord(e) {
  e.preventDefault();
  saveMsg.textContent = "Guardando...";
  const payload = {
    title: document.getElementById("title").value.trim(),
    value: Number(document.getElementById("value").value),
    notes: document.getElementById("notes").value.trim()
  };
  const res = await fetch(`${API_BASE}/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) {
    saveMsg.textContent = data.error || "Error al guardar";
    return;
  }
  saveMsg.textContent = "Registro creado ✔";
  document.getElementById("record-form").reset();
  loadRecords();
}

async function loadRecords() {
  recordsList.innerHTML = "<li>Cargando...</li>";
  const res = await fetch(`${API_BASE}/records`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  const data = await res.json();
  if (!res.ok) {
    recordsList.innerHTML = `<li>${data.error || "Error al listar"}</li>`;
    return;
  }
  recordsList.innerHTML = "";
  if (data.length === 0) {
    recordsList.innerHTML = "<li>(Sin registros)</li>";
    return;
  }
  for (const r of data) {
    const li = document.createElement("li");
    li.textContent = `[${new Date(r.createdAt).toLocaleString()}] ${r.title} = ${r.value} ${r.notes ? " - " + r.notes : ""}`;
    recordsList.appendChild(li);
  }
}

// Listeners
document.getElementById("login-form").addEventListener("submit", login);
document.getElementById("record-form").addEventListener("submit", saveRecord);
document.getElementById("reload-btn").addEventListener("click", loadRecords);
document.getElementById("logout-btn").addEventListener("click", () => { clearToken(); showApp(false); });
document.getElementById("seed-btn").addEventListener("click", registerSeed);

// Estado inicial
showApp(!!getToken());
