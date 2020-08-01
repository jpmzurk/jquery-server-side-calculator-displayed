$(document).ready(onReady);

function onReady() {
    // load data from the server, put it on the DOM
    getCalculatorData();
    clickListeners();
}

function clickListeners() {
    $('#plusOperator, #minusOperator, #multiplyOperator, #divideOperator').on('click',  clickValue);
    $('#equalsButton').on('click', objectToServer);
    $('#resultsTarget').on('click', '.list' ,reEnterData)
}


let operations = [];


//A NEW WAY OF CAPTURING VALUES OF BUTTONS OR ELEMENTS FOR THAT MATTER
function clickValue(event) {
    event.preventDefault();
    operator = $(this).attr('value');
    operations.push(operator)
    $(this).siblings('button.operator').prop('disabled', true);
}


//POST THAT UNPROCESSED DATA!
function objectToServer() {
    let inputOne = $('#firstValue').val();
    let inputTwo = $('#secondValue').val();

    $(this).siblings('button.operator').prop('disabled', false);

    if ( operations.length === 0 || inputOne.length === 0 || inputTwo.length === 0) {
        alert('you must enter both numbers and an operator')
        $('#firstValue').val('');
        $('#secondValue').val('');
    }  else {

    let objectToSend = {
        numOne: Number(inputOne),
        numTwo: Number(inputTwo),
        operator: String(operations[0]),
        total : 0,
    }

    console.log(objectToSend);

    $.ajax({
        url: "/calculator",
        method: "POST",
        data: objectToSend,
        
    }).then(function (response) {
        console.log('response from POST', response);
        getCalculatorData();
        $('#firstValue').val('');
        $('#secondValue').val('');
        
        operations.length = 0;
       
    });
    }
}


//GO GET THAT PROCESSED DATA!
function getCalculatorData() {
    console.log('in get calculatorData');
    arrayOfEquations.length = 0;
    $.ajax({
        type: 'GET',
        url: '/calculator'
    }).then(function (response) {
        $('#resultsTarget').empty();
        addDataToDom (response);
    })
}





function addDataToDom(answer) {
    console.log('in addDataToDom');
    
    console.log(answer);
    arrayOfEquations.push(answer)
    // append data to the DOM
    for (let i = 0; i < answer.length; i++) {
        let returnedData = answer[i];
        $('#resultsTarget').append(`
        <li class="list-group-item list" data-index="${i}" >
            ${returnedData.numOne}  ${returnedData.operator} ${returnedData.numTwo} = ${returnedData.total}</li>
        `);
    }
}

let arrayOfEquations = [];

function reEnterData (){
    
    clickedIndex = $(this).attr('data-index');
    usableIndex = Number(clickedIndex)
    
    let anObject = arrayOfEquations[0];
    let desiredEquation = anObject[clickedIndex];
    
    reInputOne = Number(desiredEquation.numOne);
    reInputTwo = Number(desiredEquation.numTwo);
    operator = desiredEquation.operator;

    console.log(reInputOne, reInputTwo, operator);
    
    $('#firstValue').val(reInputOne);
    $('#secondValue').val(reInputTwo)
    if (operator === '+') {
        console.log('in if statement');
        
        $('#plusOperator').trigger('click');
    }

}