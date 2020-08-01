$(document).ready(onReady);

function onReady() {
    // load data from the server, put it on the DOM
    getCalculatorData();
    clickListeners();
}

function clickListeners() {
    $('#plusOperator, #minusOperator, #multiplyOperator, #divideOperator').on('click',  clickValue);
    $('#equalsButton').on('click', objectToServer);
}


let operations = [];


function clickValue(event) {
    event.preventDefault();

    operator = $(this).attr('value');
    console.log(operator);
    operations.push(operator)
    $(this).siblings('button.operator').prop('disabled', true);
    console.log(operations);
    
}



function objectToServer() {
    // event.preventDefault();
    // let inputOne = $('#firstValue').val();
    // let inputTwo = $('#secondValue').val();

    // console.log(inputOne.length);
     $(this).siblings('button.operator').prop('disabled', false);

    if ( operations.length === 0) {
        alert('you must enter both numbers and only one operator')
        $('#firstValue').val('');
        $('#secondValue').val('');

    } else {
    let objectToSend = {
        numOne: Number($('#firstValue').val()),
        numTwo: Number($('#secondValue').val()),
        operator : String(operations[0]),
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



function getCalculatorData() {
    console.log('in get calculatorData');
    
    $.ajax({
        type: 'GET',
        url: '/calculator'
    }).then(function (response) {
        $('#resultsTarget').empty();
        addDataToDom (response);
    })
}


//basic add to dom function 


function addDataToDom(answer) {
    console.log('in addDataToDom');
    
    console.log(answer);
    
    // append data to the DOM
    for (let i = 0; i < answer.length; i++) {
        let returnedData = answer[i];
        $('#resultsTarget').append(`
           
        <li class="list-group-item list " data-index="${i}" >${returnedData.numOne}  ${returnedData.operator} ${returnedData.numTwo} = ${returnedData.total}</li>
        `);
    }
    
}