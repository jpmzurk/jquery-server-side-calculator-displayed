const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;


app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static('server/public'));


let calculatorInfo = [];
let calculatorAnswers = [];

app.post("/calculator", (req, res) => {
    let sentObject = req.body;
    // console.log('this is the new equation', sentObject);
    calculatorInfo.push(sentObject)
    calculate(calculatorInfo)
    res.sendStatus(201);
})


app.get('/calculator', (req, res) => {
    console.log('in calculator GET');
    res.send(calculatorAnswers);
    calculatorInfo.length = 0;
});

function calculate(someObject) {
    console.log('in calculate');
    
    for (let i = 0; i < someObject.length; i++) {
        let newerObject = someObject[i];
        console.log(newerObject);
        if (newerObject.operator === '+'){
            let total = Number(newerObject.numOne) + Number(newerObject.numTwo);
            console.log(total);
            newerObject.total = total;
            calculatorAnswers.push(newerObject)
        } else if (newerObject.operator === '-'){
            let total = newerObject.numOne - newerObject.numTwo;
            newerObject.total = total;
            calculatorAnswers.push(newerObject)
        } else if (newerObject.operator == '*'){
            let total  = newerObject.numOne * newerObject.numTwo;
            newerObject.total = total;
            calculatorAnswers.push(newerObject)
        } else if (newerObject.operator == '/'){
            let total  = newerObject.numOne / newerObject.numTwo;
            newerObject.total = total;
            calculatorAnswers.push(newerObject)
        } else { 
            console.log('this is not an equation');
        }
        
    }
}


app.listen(PORT, () => {
    console.log('listening on port', PORT)
});