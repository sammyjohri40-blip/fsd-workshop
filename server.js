const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3000;

// Initial Data
let leaves = [
  { id: 701, employeeName: "Ananya Singh", employeeCode: "EMP101", leaveType: "Casual", days: 2, status: "Pending" },
  { id: 702, employeeName: "Rahul Verma", employeeCode: "EMP102", leaveType: "Sick", days: 1, status: "Approved" },
  { id: 703, employeeName: "Simran Kaur", employeeCode: "EMP103", leaveType: "Earned", days: 3, status: "Rejected" }
];

let nextId = 704;

function isValidLeave(body) {
  const { employeeName, employeeCode, leaveType, days, status } = body;
  if (!employeeName || !employeeCode || !leaveType || days === undefined || !status) return false;
  if (!Number.isInteger(days) || days <= 0) return false;
  if (!["Casual", "Sick", "Earned"].includes(leaveType)) return false;
  if (!["Pending", "Approved", "Rejected"].includes(status)) return false;
  return true;
}

// IMPORTANT: Specific routes BEFORE /:id

// 6. Filter by status - case-insensitive
app.get('/api/leaves/filter', (req, res) => {
  const status = req.query.status;
  if (!status) return res.json(leaves);
  const result = leaves.filter(l => l.status.toLowerCase() === status.toLowerCase());
  res.status(200).json(result);
});

// 7. Get pending only
app.get('/api/leaves/pending', (req, res) => {
  const result = leaves.filter(l => l.status === "Pending");
  res.status(200).json(result);
});

// 1. GET all
app.get('/api/leaves', (req, res) => {
  res.status(200).json(leaves);
});

// 3. GET by ID
app.get('/api/leaves/:id', (req, res) => {
  const leave = leaves.find(l => l.id === parseInt(req.params.id));
  if (!leave) return res.status(404).json({ message: "Leave request not found" });
  res.status(200).json(leave);
});

// 2. POST new
app.post('/api/leaves', (req, res) => {
  if (!isValidLeave(req.body)) {
    return res.status(400).json({ message: "Invalid input. Check required fields, days must be positive integer, leaveType must be Casual/Sick/Earned, status must be Pending/Approved/Rejected" });
  }
  const newLeave = { id: nextId++, ...req.body };
  leaves.push(newLeave);
  res.status(201).json(newLeave);
});

// 4. PUT update
app.put('/api/leaves/:id', (req, res) => {
  const index = leaves.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Leave request not found" });
  if (!isValidLeave(req.body)) {
    return res.status(400).json({ message: "Invalid input" });
  }
  leaves[index] = { id: leaves[index].id, ...req.body };
  res.status(200).json(leaves[index]);
});

// 5. DELETE
app.delete('/api/leaves/:id', (req, res) => {
  const index = leaves.findIndex(l => l.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Leave request not found" });
  leaves.splice(index, 1);
  res.status(200).json({ message: "Leave request deleted successfully" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));