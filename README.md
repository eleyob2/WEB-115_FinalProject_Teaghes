# Custom Tournament Bracket Builder
**WEB-115 Final Project Proposal**
Student: 'Elnatan Teaghes' | Repo: '[WEB-115_FinalProject_Teaghes]'

---

## Overview

This project is a web-based Payroll Management System that allows a manager to add employees, enter work hours or salary information, and automatically calculate payroll results including gross pay, deductions, and net pay. The application is designed to model a simplified real-world payroll workflow while remaining manageable within the course timeline.

Users can create and manage multiple employees, calculate payroll for a pay period, and view payroll summaries dynamically generated on the page. All payroll data is saved in the browser so users can close the app and return without losing information.

The target user is a small business owner, manager, or student who wants a simple, easy-to-use payroll calculator without needing spreadsheet software or a backend server.

---

## Features

- Add new employees with name, role, and pay type (hourly or salaried).
-	Enter hours worked for hourly employees and automatically calculate overtime pay.
-	Calculate gross pay, deductions, and net pay for each employee.
-	Display a payroll summary table generated dynamically from employee data.
-	Edit or remove employees from the system.
-	Save all employee and payroll data so progress persists between sessions.
-	Reset payroll data after a pay period is complete.


---

## Core Requirements Coverage

| Requirement | Implementation |
|---|---|
| **If Statements & Loops** | Loops iterate through all employees to calculate and display payroll results. If statements determine pay type (hourly vs salaried), apply overtime when hours exceed 40, and handle deduction calculations. |
| **Event Listeners** | Submit listeners handle adding employees and calculating payroll. Click listeners allow users to remove employees, recalculate payroll, or reset the system. |
| **DOM Element Creation** | Employee cards, payroll rows, and summary totals are created dynamically using createElement() and appendChild(). No payroll data is hardcoded in the HTML. |
| **Classes & Subclasses** | A base Employee class stores shared properties like name and base pay. HourlyEmployee and SalariedEmployee extend Employee and override payroll calculation logic using extends and super(). |

---

## DLC — Additional Topics

### JSON & Local Storage
All employee records and payroll results are serialized using 'JSON.stringify()' and stored in 'localStorage'. When the app loads, 'JSON.parse()' restores the saved data so users can continue where they left off without a backend server. This allows payroll information to persist between browser sessions.

---

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- `localStorage` for persistence data
- VS Code + GitHub
