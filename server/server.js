const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;


app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static('server/public'));

//basically a temporary array for pre-calculated objects
let calculatorInfo = [];
//post-calculated objects
let calculatorAnswers = [];

app.post("/calculator", (req, res) => {
    let sentObject = req.body;
    // console.log('this is the new equation', sentObject);
    calculatorInfo.push(sentObject)
    //calculate those objects!
    calculate(calculatorInfo)
    res.sendStatus(201);
})


app.get('/calculator', (req, res) => {
    console.log('in calculator GET');
    //send back the array of objects that have the total key/value pair
    res.send(calculatorAnswers);
    //clear pre-calculated objects
    calculatorInfo.length = 0;
});


app.delete( '/calculator/delete', ( req, res )=>{
    console.log( 'in /calculator/delete', req.body );
    calculatorAnswers.length = 0;
    res.sendStatus( 200 );
 })

 app.delete( '/calculator/:index', ( req, res )=>{
    console.log( 'in /calculator index:', req.params.index );
    let indexToRemove = req.params.index;
    //remove equation from answers array by index number
    calculatorAnswers.splice(indexToRemove, 1)
    res.sendStatus( 200 );
 }) 



function calculate(someObject) {
    console.log('in calculate');
    //calculates sent objects 
    //then pushes the object with the total as a key/value to answers array on server
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
        } else if (newerObject.operator == '√'){
            let total = Math.sqrt(Number(newerObject.numTwo));
            newerObject.total = total;
            calculatorAnswers.push(newerObject)
        }else { 
            console.log('this is not an equation');
        }
        
    }
}


// app.post("/calculator", (req, res) => {
//     let sentObject = req.body;
//     // console.log('this is the new equation', sentObject);
//     calculatorInfo.push(sentObject)
//     //calculate those objects!
//     calculateSquare(calculatorInfo)
//     res.sendStatus(201);
// })

// function calculateSquare(anObject) {
//     console.log('in calculate');
//     //calculates sent objects 
//     //then pushes the object with the total as a key/value to answers array on server
//     for (let i = 0; i < anObject.length; i++) {
//         let newerObject = anObject[i];
//         console.log(newerObject);
        
//         let total = Math.sqrt(Number(newerObject.numTwo));
//         console.log(total);
//         newerObject.total = total;
//         calculatorAnswers.push(newerObject)
        
//     }
// }



app.listen(PORT, () => {
    console.log('listening on port', PORT)
});