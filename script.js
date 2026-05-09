const fileInput = document.getElementById("employee-file"); 
const loginSection = document.getElementById("login-section"); 
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const actionsSection = document.getElementById("actions");
const greetingEl = document.getElementById("greeting");
const payrollForm = document.getElementById("payroll-form");
const hoursInput = document.getElementById("hours");
const overtimeInput = document.getElementById("overtime");
const printButton = document.getElementById("print-pay");
const eventButton = document.getElementById("event");
const logoutButton = document.getElementById("logout");
const payResult = document.getElementById("pay-result");
const messageEl = document.getElementById("message");
const STORAGE_KEY = "payrollEmployees";

let employees = {};
let currentUser = null;

function loadSavedEmployees() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (!savedData) {
    return false;
  }

  try {
    const parsed = JSON.parse(savedData);
    employees = {};

    for (const [username, record] of Object.entries(parsed)) {
      const employee = createEmployeeFromType(
        record.name,
        record.password,
        record.rate,
        record.type || "Hourly"
      );
      employee.gross = record.gross || 0;
      employee.tax = record.tax || 0;
      employee.net = record.net || 0;
      employees[username] = employee;
    }

    return Object.keys(employees).length > 0;
  } catch (error) {
    console.error("Failed to load saved employees:", error);
    return false;
  }
}

function saveEmployees() {
  const plainEmployees = {};

  for (const [username, employee] of Object.entries(employees)) {
    plainEmployees[username] = {
      name: employee.name,
      password: employee.password,
      rate: employee.rate,
      type: employee.type || "Hourly",
      gross: employee.gross,
      tax: employee.tax,
      net: employee.net,
    };
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(plainEmployees));
}

function initializeStoredEmployees() {
  if (loadSavedEmployees()) {
    loginSection.classList.remove("hidden");
    actionsSection.classList.add("hidden");
    showMessage("Loaded saved employees from a previous session. Please login.");
  } else {
    loadEmployeesFromCSVUrl("Payroll_Code-2.csv");
  }
}

class Employee {
  constructor(name, password, rate) {
    this.name = name;
    this.password = password;
    this.rate = Number(rate);
    this.gross = 0;
    this.tax = 0;
    this.net = 0;
  }

  calculatePayroll(hours, overtime) {
    const gross = hours * this.rate + overtime * this.rate * 1.25;
    const tax = gross * 0.1;
    const net = gross - tax;
    this.gross = gross;
    this.tax = tax;
    this.net = net;
    return { gross, tax, net };
  }
}

class HourlyEmployee extends Employee {
  constructor(name, password, rate) {
    super(name, password, rate);
    this.type = "Hourly";
  }

  calculatePayroll(hours, overtime) {
    if (hours < 40) {
      return super.calculatePayroll(hours, 0);
    }
    return super.calculatePayroll(hours, overtime);
  }
}

class SalariedEmployee extends Employee {
  constructor(name, password, rate) {
    super(name, password, rate);
    this.type = "Salaried";
  }

  calculatePayroll() {
    const gross = this.rate;
    const tax = gross * 0.1;
    const net = gross - tax;
    this.gross = gross;
    this.tax = tax;
    this.net = net;
    return { gross, tax, net };
  }
}

function showMessage(text, type = "info") {
  messageEl.textContent = "";
  const messageText = document.createElement("span");
  messageText.textContent = text;
  messageText.style.fontWeight = "600";
  messageEl.appendChild(messageText);
  messageEl.style.borderColor = type === "error" ? "#fca5a5" : "#93c5fd";
  messageEl.style.background = type === "error" ? "#fef2f2" : "#eef2ff";
}

function clearMessage() {
  messageEl.textContent = "";
}

function parseCSV(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return {};
  }

  if (/name/i.test(lines[0]) && /password/i.test(lines[0]) && /rate/i.test(lines[0])) {
    lines.shift();
  }

  const records = {};

  for (const line of lines) {
    const parts = line.split(",").map((value) => value.trim());
    const [name, password, rate, type = "Hourly"] = parts;
    const numericRate = Number(rate);

    if (!name || !password || Number.isNaN(numericRate)) {
      continue;
    }

    records[name] = createEmployeeFromType(name, password, numericRate, type);
  }

  return records;
}

function createEmployeeFromType(name, password, rate, type) {
  if (type.toLowerCase() === "salaried") {
    return new SalariedEmployee(name, password, rate);
  }
  return new HourlyEmployee(name, password, rate);
}

function loadEmployeesFromCSVUrl(url) {
  fetch(url)
    .then(response => response.text())
    .then(text => {
      employees = parseCSV(text);

      if (Object.keys(employees).length === 0) {
        showMessage("No valid employee records found in the CSV.", "error");
        return;
      }

      saveEmployees();
      loginSection.classList.remove("hidden");
      actionsSection.classList.add("hidden");
      currentUser = null;
      payResult.textContent = "";
      showMessage("Employees loaded successfully and saved to local storage. Please login.");
    })
    .catch(error => {
      showMessage("Unable to load the CSV file.", "error");
      console.error(error);
    });
}

function setLoggedIn(username) {
  currentUser = username;
  greetingEl.textContent = `Logged in as ${username}.`;
  loginSection.classList.add("hidden");
  actionsSection.classList.remove("hidden");
  clearMessage();
  payResult.textContent = "";
}

function setLoggedOut() {
  currentUser = null;
  greetingEl.textContent = "";
  loginSection.classList.remove("hidden");
  actionsSection.classList.add("hidden");
  payResult.textContent = "";
  usernameInput.value = "";
  passwordInput.value = "";
  hoursInput.value = "0";
  overtimeInput.value = "0";
  showMessage("You have been logged out.");
}

function login(event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showMessage("Username and password are required.", "error");
    return;
  }

  if (!employees[username] || employees[username].password !== password) {
    showMessage("Invalid username or password.", "error");
    return;
  }

  setLoggedIn(username);
}

function calculatePayroll(event) {
  event.preventDefault();

  if (!currentUser) {
    showMessage("Please log in first.", "error");
    return;
  }

  const employee = employees[currentUser];
  const hours = Number(hoursInput.value);
  const overtime = Number(overtimeInput.value);

  if (Number.isNaN(hours) || hours < 0 || Number.isNaN(overtime) || overtime < 0) {
    showMessage("Please enter valid hours and overtime values.", "error");
    return;
  }

  const payrollData = employee.calculatePayroll(hours, overtime);
  saveEmployees();
  renderPayrollResult(payrollData);
  showMessage("Payroll calculated successfully.");
}

function printPay() {
  if (!currentUser) {
    showMessage("Please log in before printing pay details.", "error");
    return;
  }

  const employee = employees[currentUser];

  if (employee.gross === 0 && employee.net === 0) {
    showMessage("Calculate payroll first before printing the pay details.", "error");
    return;
  }

  renderPayrollResult({ gross: employee.gross, tax: employee.tax, net: employee.net });
  showMessage("Pay information displayed below.");
}

function showEvent() {
  if (!currentUser) {
    showMessage("Please log in to see the greeting.", "error");
    return;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
  let greeting = "Good Evening";

  if (now.getHours() < 12) {
    greeting = "Good Morning";
  } else if (now.getHours() < 18) {
    greeting = "Good Afternoon";
  }

  payResult.textContent = "";
  const eventMessage = document.createElement("p");
  eventMessage.textContent = `${greeting} ${currentUser}! It's ${timeStr} on ${dateStr}.`;
  payResult.appendChild(eventMessage);
  showMessage("Event greeting shown.");
}

function renderPayrollResult({ gross, tax, net }) {
  payResult.textContent = "";

  const grossLine = document.createElement("p");
  grossLine.innerHTML = `<strong>Gross Pay:</strong> ${formatCurrency(gross)}`;

  const taxLine = document.createElement("p");
  taxLine.innerHTML = `<strong>Tax:</strong> ${formatCurrency(tax)}`;

  const netLine = document.createElement("p");
  netLine.innerHTML = `<strong>Net Pay:</strong> ${formatCurrency(net)}`;

  payResult.appendChild(grossLine);
  payResult.appendChild(taxLine);
  payResult.appendChild(netLine);
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

loginForm.addEventListener("submit", login);
payrollForm.addEventListener("submit", calculatePayroll);
printButton.addEventListener("click", printPay);
eventButton.addEventListener("click", showEvent);
logoutButton.addEventListener("click", setLoggedOut);

initializeStoredEmployees();