const express = require('express')
const db_connector = require("./db_connector")
const task = require("./task")

const app = express()
app.use(express.json())

module.exports = app;

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', '*')
    next()
})

db_connector.connection.sync()

app.get("/tasks/",async function(req, res) {
    const result = await task.findAll()
    res.send(result);
})

function validate_string( str, field_name, messages ){
    if (!str) {
        messages.push(`${field_name} is required.`)
    } else if (typeof str !== 'string') {
        messages.push(`Type of '${field_name}' must be a string.`)
    }
}

function validate_int( intValue, field_name, messages ){
    if (intValue === undefined) {
        messages.push(`${field_name} is required.`);
    } else if (typeof intValue !== 'number') {
        messages.push(`Type of '${field_name}' must be a string.`);
    }
}

function validate_date( str_date, field_name, messages ){
    const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!datePattern.test(str_date)) {
        messages.push(`${field_name} must be in the format YYYY-MM-DD HH:MM.`)
    } else {
        const parsedDate = new Date(str_date);
        if (isNaN(parsedDate)) {
            messages.push(`${field_name} is a invalid date.`);
        }
        const today = new Date();
        if (parsedDate < today) {
            messages.push(`${field_name} cannot be in the past.`);
        }
    }
}

function validate_task_fields(req, res, next){
    try{
        var messages = []
        const { name, priority,description,scheduled_date,deadline,duration } = req.body
        validate_string( name, "name", messages )
        validate_int( priority, "priority", messages )
        if (description !== undefined) {
            validate_string( description, 'description', messages )
        }
        if (scheduled_date !== undefined) {
            validate_date( scheduled_date, "schedule_date", messages )
        }
        if (deadline !== undefined) {
            validate_date( deadline, "deadline", messages )
        }
        if (duration !== undefined) {
            validate_int( duration, "duration", messages )
        }
        if( messages.length > 0 ){
            return res.status(400).send({ error: messages })
        }
        
        next()
    }catch(error){
        console.error(error);
        return res.status(500).send({ error: "An error occurred while creating the task." });
    }
}

app.post("/tasks/",validate_task_fields,async function(req,res){
    try{
        const { name,priority,description,scheduled_date,deadline,duration } = req.body;
        const result = await task.create({
            name,priority,description,scheduled_date,deadline,duration
        })
        res.send(result)
    }catch(error){
        console.error(error);
        return res.status(500).send({ error: "An error occurred while creating the task." });
    }
})
