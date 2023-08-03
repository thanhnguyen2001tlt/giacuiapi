const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Employee = require('../models/employee');
const employeeRouter = express.Router();
const secretKey = "MySuperSecretKey113";

// Đăng nhập
employeeRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Tìm kiếm nhân viên dựa trên username
    const employee = await Employee.findOne({ username });

    if (!employee) {
      // Nếu không tìm thấy nhân viên, trả về lỗi đăng nhập không thành công
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Kiểm tra mật khẩu
    const passwordMatch = await bcrypt.compare(password, employee.password);


    if (!passwordMatch) {
      // Nếu mật khẩu không khớp, trả về lỗi đăng nhập không thành công
      return res.status(401).json({ error: 'Not macth username or password' });
    }




    const token = jwt.sign(
      { employeeId: employee._id, role: employee.role },
      secretKey,
      { expiresIn: '12h' }
    );

    // Trả về mã thông báo và thông tin nhân viên đã đăng nhập thành công
    res.json({ token, employee });
  } catch (error) {
    console.error('Login failed', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Middleware xác thực JWT
function authenticateJWT(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secretKey, (err, decodedToken) => {
      if (err) {
        console.error('JWT verification failed', err);
        return res.status(403).json({ error: 'Invalid token' });
      }

      req.employeeId = decodedToken.employeeId;
      req.role = decodedToken.role;
      next();
    });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}
// Lấy Thông tin nhân viên id
employeeRouter.get('/employees/:id', authenticateJWT, async (req, res) => {
  try {
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error('Failed to get employee', error);
    res.status(500).json({ error: 'Failed to get employee' });
  }
});


// Lấy danh sách nhân viên
employeeRouter.get('/employees', authenticateJWT, async (req, res) => {
  try {
    if (req.role == 'admin') {
      const employees = await Employee.find({ role: { $ne: 'admin' } });
      res.json(employees);
    }
  } catch (error) {
    console.error('Failed to get employees', error);
    res.status(500).json({ error: 'Failed to get employees' });
  }
});

// Thêm nhân viên mới
employeeRouter.post('/employees', authenticateJWT, async (req, res) => {
  // Kiểm tra vai trò của người dùng
  if (req.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can add employees' });
  }

  const { name, username, password, role, image, phone, cccd, address } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const employee = new Employee({
    name,
    username,
    password: hashedPassword,
    role,
    image,
    phone,
    cccd,
    address,
  });

  try {
    const savedEmployee = await employee.save();
    res.json(savedEmployee);
  } catch (error) {
    console.error('Failed to create employee', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Cập nhật thông tin nhân viên
employeeRouter.put('/employees/:id', authenticateJWT, async (req, res) => {
  // Kiểm tra vai trò của người dùng
  if (req.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can update employees' });
  }

  const { id } = req.params;
  const { name, username, password, image, phone, cccd, address } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    employee.name = name || employee.name;
    employee.username = username || employee.username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      employee.password = hashedPassword;
    }
    employee.image = image || employee.image;
    employee.phone = phone || employee.phone;
    employee.cccd = cccd || employee.cccd;
    employee.address = address || employee.address;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Failed to update employee', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});


// Xóa nhân viên
employeeRouter.delete('/employees/:id', authenticateJWT, async (req, res) => {
  // Kiểm tra vai trò của người dùng
  if (req.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can delete employees' });
  }

  const { id } = req.params;

  try {
    await Employee.findByIdAndRemove(id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Failed to delete employee', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = employeeRouter;