const express = require("express"); //imports the Express.js framework for routing and creating a server
const bodyParser = require("body-parser"); //imports the body-parser middleware, helps parse incoming request  bodies (form data, JSON)
const db = require("./dbConnection");
const cors = require('cors');



const app = express(); //intializes an express aoo
const port = 3000;
app.use(cors()); 

app.use(bodyParser.urlencoded({ extended: true })); //parses URL-encoded data
app.use(express.json()); //parses JSON formated data from requests

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');  
});

app.use(express.static(__dirname + '/public'));

//Add a new device
app.post('/inventory', (req, res) =>{ //req is request, requesting to put this data in
    const { name, Model, Condition } = req.body;
    const sql = 'INSERT INTO Device_Inventory (name, Model, `Condition`) VALUES (?, ?, ?)';
    //sends the sql query to the database
    db.query(sql, [name, Model, Condition], (err, result) =>{
        if (err) throw err;
        res.send('Device added Sucessfully!'); //response back to client
});
});

//show all devices
app.get('/getDevices', (req, res) => {
    console.log('GET .getDevices route called');
    const sql = 'SELECT * FROM Device_Inventory';
    //sends the sql query into the database
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('An error occured');
    } else {
        console.log('SQL query exceuted sucessfully');
        console.log('results:', results);
        res.json(results);
    }
});
});
//selecting specific device
app.get('/getDevicebyid', (req,res) =>{
    const id = req.query.id;
    const sql = 'SELECT * FROM Device_Inventory WHERE id = ?';
    db.query(sql, [id], (err,results) =>{
        if (err) {
            console.error('Database error', err);
            res.status(500).send ('An error occured');
        } else {
            res.json(results)
        }
    })
})
//updating specific device
app.post('/update', (req,res) => {
    const {id,name,Model, Condition} = req.body;
    const sql = 'UPDATE Device_Inventory SET name = ?, Model = ?, `Condition` = ? WHERE id =?';
    db.query(sql, [name,Model,Condition, id], (err, results) =>{
    if (err) throw err; 
    res.send('Device updated!');
});
});
//delete device
app.delete('/remove' ,(req,res) =>{
    const {id} = req.body;
    const sql = 'DELETE FROM Device_Inventory WHERE id=?';
    db.query(sql,[id],(err, results) =>{
        if (err) {
            console.error('Database error', err);
            res.status(500).send('An error occured');
        } else {
            res.send('Device Removed');
        }
    });
});

const multer = require('multer');
const upload = multer({dest: 'uploads/' });



//repairdevice
app.post('/repair', upload.single('deviceImage'), (req,res) =>{
    const {name, Model, Notes} =req.body;
    const imagePath = req.file ? req.file.path : null; //gets the file path once uploaded

    const sql = 'INSERT INTO Repair_Devices (name, Model, Notes, imagePath) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, Model, Notes, imagePath], (err,results)=>{
        if (err) {
            console.error('Error inserting device', err);
            res.status(500).send('Failed to add device')
        } else {
            res.send('Device added Succesfully');
        }
    });

});
app.listen(3000, () =>{
    console.log(`Server is runnning on port ${port}`);
});

                      
