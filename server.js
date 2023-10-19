const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const moment = require('moment');
const cors = require('cors')
const app = express()
const port = 8000;

const connection = {
  "host":"localhost",
  "user":"root", 
  "database":"sil"
}
app.use(cors())
app.use(bodyParser.json());
app.get('/users' , async (req, res) => {
  const conn =  await mysql.createConnection(connection);
  const [data] = await conn.query("SELECT * FROM users");
  conn.end();
  res.json(data);
});

app.post('/users' , async(req, res) => {
  try {
      const conn =  await mysql.createConnection(connection);
      const [maxId] = await conn.query("SELECT MAX(users_id) AS max_id FROM users");
      let nextId = 1;

    if (maxId[0].max_id) {
        nextId = parseInt(maxId[0].max_id) + 1;
    }
      const [data] = await conn.query(
          "INSERT INTO users (`users_id`,`fname`, `lname`, `sex`, `email`, `upassword`,`username`) VALUES (?,?, ?, ?, ?, ?,?)",
           [
            nextId, 
            req.body.fname,
            req.body.lname,
            req.body.sex,
            req.body.email,
            req.body.upassword,
            1
          ])
      conn.end(); 
      res.json({
          "message": "บันทึกข้อมูลสำเร็จแล้ว",
          "id": nextId,
          "data": req.body
      });
  } catch (error) {
      res.status(500).json({"message: " :error.message});
  }
});

app.put('/users/:id' , async(req, res) => { 
  try {
    const conn = await mysql.createConnection((connection));  
      const [data] = await conn.query("UPDATE `users` SET `users_id`= ?,`fname`= ?,`lname`= ?,`sex`= ?,`email`= ?,`upassword`= ?,`username`=? WHERE ?",
      [
        req.body.fname,
        req.body.lname,
        req.body.sex,
        req.body.email,
        req.body.upassword,
      ]);
      conn.end();
      res.json({
          "message": "แก้ไขข้อมูลสำเร็จแล้ว",
          "id": req.params.id,
          "data": req.body
      });
  } catch (error) {
      res.status(500).json({"message: " :error.message});
  }

});

app.get('/users/:id' , async (req, res) => {
  try{
      const conn =  await mysql.createConnection(connection);
      const [data] = await conn.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
      conn.end();
      let user = data.length == 0 ? {} : data[0];
      res.json(user);
  }catch(error) {
      res.sapp.get('/users/:id' , async (req, res) => {
tatus(500).json({"message: " :error.message});
  }
      )}
});

app.delete('/users/:id' , async(req, res) => {
    try {
        let id = req.params.id;
        const conn = await mysql.createConnection(connection);
        await conn.query("DELETE FROM users WHERE id = ?", [id]);
        conn.end();
        res.json({
            "message": "ลบข้อมูลสำเร็จแล้ว",
            "id": id
         });
    } catch (error) {
        res.status(500).json({"message: " :error.message});
    } 
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});