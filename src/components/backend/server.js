const express = require('express');
const cors = require('cors');
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const jwt = require('jsonwebtoken');

const app = express();

const dbPath = path.join(__dirname, 'mydatabase.db')
let database = null

app.use(cors());
app.use(express.json());

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3001, () =>
      console.log('Server Running at http://localhost:3001/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

app.post('/login/', async (request, response) => {
    const {email, password} = request.body
    const selectUserQuery = `SELECT * FROM users WHERE email = '${email}';`
    const databaseUser = await database.get(selectUserQuery)
    if (databaseUser === undefined) {
      response.status(400)
      response.send('Invalid user')
    } else {
      if (password === databaseUser.password) {
        const payload = {
          email: email,
        }
        const userName = databaseUser.name
        const jwtToken = jwt.sign(payload, 'secretToken')
        const employeesData = `SELECT * FROM employees;`;
        const data = await database.all(employeesData)
        response.send({jwtToken, userName, data})
      } else {
        response.status(400)
        response.send('Invalid password')
      }
    }
  })

  

  app.post('/employees-list', async (request, response) => {
    const { name, email, mobile, designation, gender, imageFile, course, createDate } = request.body;
  
    try {
      const checkEmailQuery = `SELECT * FROM employees WHERE email = ?;`;
      const existingUser = await database.get(checkEmailQuery, [email]);
  
      if (existingUser) {
        response.status(400).send('Duplicate Email');
        return;
      }
  
      const courseString = JSON.stringify(course);
      const insertEmployeeQuery = `
        INSERT INTO employees (name, email, mobile, designation, gender, course, date, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;
      
      await database.run(insertEmployeeQuery, [name, email, mobile, designation, gender, courseString, createDate, imageFile]);
      response.status(201).send('Success');
    } catch (error) {
      console.error('Error inserting employee:', error.message);
      response.status(500).send('Something went wrong');
    }
  });

  app.get('/employees', async (req, res) => {
    try {
      const getEmployeesQuery = `SELECT * FROM employees;`;
      const employees = await database.all(getEmployeesQuery);
  
      const formattedEmployees = employees.map(employee => ({
        ...employee,
        course: JSON.parse(employee.course),
      }));
  
      res.json(formattedEmployees);
    } catch (error) {
      res.status(500).send('Error fetching employees');
    }
  });


  app.get('/edit-employee/:id', async (request, response) => {
    const {id} = request.params;
    const getEmployeeQuery = `SELECT * FROM employees WHERE id = ${id};`
    const employee = await database.get(getEmployeeQuery);
    response.send(employee)
  })

  app.put('/employees/:id', async (request, response) => {
    const { id } = request.params;
    const { name, email, mobile, designation, gender, imageFile, course, date } = request.body;
  
    const courseString = JSON.stringify(course);
  
    const getEmployeesQuery = `UPDATE employees SET name=?, email=?, mobile=?, designation=?, gender=?, course=?, date=?, image=? WHERE id=?`;
    await database.run(getEmployeesQuery, [name, email, mobile, designation, gender, courseString, date, imageFile, id]);
    response.send('Employee Details Updated');
  });

  app.delete('/employees/:id', async (request, response) => {
    const {id} = request.params;
    const getEmployeesQuery = `DELETE FROM employees WHERE id=${id}`;
    await database.run(getEmployeesQuery);
    response.send('Employee Successfully Deleted')
  })

  