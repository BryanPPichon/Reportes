import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let addressData = {};
let ageData = {};
let serviceData = {};

// Función para calcular edad a partir de fecha de nacimiento
function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : null;
}

// Función para obtener datos de Firestore
async function fetchUserDataFromFirestore() {
  try {
    updateStatus("Conectado", "connected");
    const querySnapshot = await getDocs(collection(db, "user_profile"));

    let maleCount = 0;
    let femaleCount = 0;
    let maleAges = [];
    let femaleAges = [];
    let distralCount = 0;
    let misayaCount = 0;

    addressData = {};
    ageData = {};
    serviceData = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Procesar género
      if (data.gender) {
        const gender = data.gender.toLowerCase().trim();

        if (
          gender === "hombre" ||
          gender === "h" ||
          gender === "male" ||
          gender === "m" ||
          gender === "masculino"
        ) {
          maleCount++;
        } else if (
          gender === "mujer" ||
          gender === "f" ||
          gender === "female" ||
          gender === "femenino"
        ) {
          femaleCount++;
        }
      }

      // Procesar servicio
      if (data.service) {
        const service = data.service.toLowerCase().trim();

        if (service.includes("distral") || service.includes("la distral")) {
          distralCount++;
        } else if (
          service.includes("misaya") ||
          service.includes("spa misaya")
        ) {
          misayaCount++;
        }
      }

      // Procesar direcciones
      if (data.address) {
        addressData[data.address] = (addressData[data.address] || 0) + 1;
      }

      // Procesar edades
      if (data.birthday) {
        try {
          let birthDate;
          if (data.birthday.toDate) {
            birthDate = data.birthday.toDate();
          } else {
            birthDate = new Date(data.birthday);
          }

          const age = calculateAge(birthDate);
          if (age !== null) {
            const genderLower = data.gender
              ? data.gender.toLowerCase().trim()
              : "";

            if (
              genderLower === "hombre" ||
              genderLower === "h" ||
              genderLower === "male" ||
              genderLower === "m" ||
              genderLower === "masculino"
            ) {
              maleAges.push(age);
            } else if (
              genderLower === "mujer" ||
              genderLower === "f" ||
              genderLower === "female" ||
              genderLower === "femenino"
            ) {
              femaleAges.push(age);
            }
          }
        } catch (e) {
          console.error("Error procesando fecha:", e);
        }
      }
    });

    // Calcular promedios de edad
    const maleAgeAvg =
      maleAges.length > 0
        ? (maleAges.reduce((a, b) => a + b, 0) / maleAges.length).toFixed(1)
        : 0;
    const femaleAgeAvg =
      femaleAges.length > 0
        ? (femaleAges.reduce((a, b) => a + b, 0) / femaleAges.length).toFixed(1)
        : 0;
    const totalAgeAvg =
      maleAges.concat(femaleAges).length > 0
        ? (
            maleAges.concat(femaleAges).reduce((a, b) => a + b, 0) /
            (maleAges.length + femaleAges.length)
          ).toFixed(1)
        : 0;

    ageData = {
      Hombres: parseFloat(maleAgeAvg),
      Mujeres: parseFloat(femaleAgeAvg),
      Total: parseFloat(totalAgeAvg),
    };

    // Actualizar contadores
    const totalUsers = maleCount + femaleCount;
    const malePercentage =
      totalUsers > 0 ? ((maleCount / totalUsers) * 100).toFixed(1) : 0;
    const femalePercentage =
      totalUsers > 0 ? ((femaleCount / totalUsers) * 100).toFixed(1) : 0;

    document.getElementById("male-count").textContent = maleCount;
    document.getElementById("male-percentage").textContent =
      `(${malePercentage}%)`;
    document.getElementById("female-count").textContent = femaleCount;
    document.getElementById("female-percentage").textContent =
      `(${femalePercentage}%)`;
    document.getElementById("total-users").textContent = totalUsers;

    // Actualizar contadores de servicios
    document.getElementById("distral-count").textContent = distralCount;
    document.getElementById("misaya-count").textContent = misayaCount;

    renderCharts();
    updateLastUpdate();
    updateStatus("Datos cargados", "connected");
  } catch (error) {
    console.error("Error obteniendo datos:", error);
    updateStatus("Error al conectar", "error");
  }
}

// Función para renderizar gráficos
function renderCharts() {
  renderAddressChart();
  renderAgeChart();
}

// Gráfico de direcciones
function renderAddressChart() {
  const chart = document.getElementById("address-chart");
  const loading = document.getElementById("loading-address");

  if (Object.keys(addressData).length === 0) {
    loading.textContent = "No hay datos disponibles";
    return;
  }

  const sorted = Object.entries(addressData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  chart.innerHTML = "";
  const maxCount = Math.max(...sorted.map((item) => item[1]));

  sorted.forEach(([address, count]) => {
    const width = (count / maxCount) * 100;
    const shortAddress =
      address.length > 30 ? address.substring(0, 30) + "..." : address;

    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.innerHTML = `
            <div class="bar-label">
                <strong>${shortAddress}</strong>
            </div>
            <div class="bar" style="width: ${width}%;"></div>
            <div class="bar-count">${count}</div>
        `;
    chart.appendChild(bar);
  });

  loading.style.display = "none";
  chart.style.display = "flex";
}

// Gráfico de edades
function renderAgeChart() {
  const chart = document.getElementById("age-chart");
  const loading = document.getElementById("loading-age");

  if (Object.keys(ageData).length === 0) {
    loading.textContent = "No hay datos disponibles";
    return;
  }

  chart.innerHTML = "";
  const maxAge = Math.max(...Object.values(ageData));

  Object.entries(ageData).forEach(([gender, age]) => {
    const width = (age / maxAge) * 100;

    const bar = document.createElement("div");
    bar.className = "chart-bar";
    bar.innerHTML = `
            <div class="bar-label">
                <strong>${gender}</strong>
            </div>
            <div class="bar" style="width: ${width}%;"></div>
            <div class="bar-count">${age} años</div>
        `;
    chart.appendChild(bar);
  });

  loading.style.display = "none";
  chart.style.display = "flex";
}

// Actualizar estado de conexión
function updateStatus(text, status) {
  document.getElementById("status-text").textContent = text;
  const dot = document.getElementById("connection-status");
  dot.className = "status-dot " + status;
}

// Actualizar última actualización
function updateLastUpdate() {
  const now = new Date();
  document.getElementById("last-update").textContent =
    now.toLocaleString("es-MX");
}

// Actualizar datos
function refreshData() {
  updateStatus("Actualizando...", "connected");
  fetchUserDataFromFirestore();
}

// Cargar datos al iniciar
window.addEventListener("DOMContentLoaded", () => {
  fetchUserDataFromFirestore();
});

// Exponer función global
window.refreshData = refreshData;
