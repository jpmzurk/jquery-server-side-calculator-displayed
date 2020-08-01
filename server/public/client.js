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
    $('#deleteParent').on('click', '#clearHistory', deleteServerEquations)
}


let operations = [];


//FUN WAY OF CAPTURING VALUES OF BUTTONS OR ELEMENTS FOR THAT MATTER
//ALSO DISABLES OTHER BUTTONS ONCE A OPERATOR IS SELECTED 
function clickValue(event) {
    event.preventDefault();
    operator = $(this).attr('value');
    operations.push(operator)
    //disable buttons not clicked
    $(this).siblings('button.operator').prop('disabled', true);
}


//POST THAT UNPROCESSED DATA TO SERVER!
function objectToServer() {
    let inputOne = $('#firstValue').val();
    let inputTwo = $('#secondValue').val();

     //turn buttons not clicked back on
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


//GET THAT PROCESSED DATA!
function getCalculatorData() {
    console.log('in get calculatorData');

    $.ajax({
        type: 'GET',
        url: '/calculator'
    }).then(function (response) {
        $('#resultsTarget').empty();
       
        //clear array that holds equations to keep out duplicates
        arrayOfEquations.length = 0;
        //push processed data to array(equation) to be used with re-entering data on click
        arrayOfEquations.push(response)
        addDataToDom (response);
    }).catch( function( err ){
        console.log( err );
        alert( 'Unable to delete at this time. Try again later.' );
    })
}



//PUT YR PROCESSED DATA ON THE DOM
function addDataToDom(answer) {
    console.log('in addDataToDom heres the returned data', answer);
    
    // append that data to the DOM
    for (let i = 0; i < answer.length; i++) {
        let returnedData = answer[i];
        $('#resultsTarget').append(`
        <li class="list-group-item list" data-index="${i}" >
            ${returnedData.numOne}  ${returnedData.operator} ${returnedData.numTwo} = ${returnedData.total}</li>
        `);
    }

    let removeAllBtn = `<button class= "btn btn-warning" id="clearHistory" > clear your entire history</button>`;
    let listItems = $('li.list').length;
    if ( 
        listItems > 0
    ) {
        $('#deleteHistory').empty();
        $('#deleteHistory').append(removeAllBtn);
    } else {
        $('#deleteHistory').empty();
    }
    console.log('this is the list items total', listItems);
}


let arrayOfEquations = [];


//PUT THE CLICKED EQUATION BACK INTO FORM
function reEnterData (){
    //get the li index
    // clickedIndex = $(this).attr('data-index');
    let clickedIndex = $( this ).data( 'index' );
    //get the objects instead of the array
    let anObject = arrayOfEquations[0];
    //get clicked on equation 
    let desiredEquation = anObject[clickedIndex];
    
    //parse out individual data of equation
    reInputOne = Number(desiredEquation.numOne);
    reInputTwo = Number(desiredEquation.numTwo);
    operator = desiredEquation.operator;

    //sanity check
    console.log(reInputOne, reInputTwo, operator);
    
    //reset the values of inputs and operator buttons to match parsed equation data
    $('#firstValue').val(reInputOne);
    $('#secondValue').val(reInputTwo)

    //repress operator button, COOL!
    if (operator === '+') {
        $('#plusOperator').trigger('click');
    } else if (operator === '-') {
        $('#minusOperator').trigger('click');
    } else if (operator === '*') {
        $('#multiplyOperator').trigger('click');
    } else if (operator === '/') {
        $('#divideOperator').trigger('click');
    } 
}


function deleteServerEquations() {
    console.log('in delete');
    
    $.ajax({
        type: 'DELETE',
        url: '/calculator/delete'
    }).then( function( response ){
        getCalculatorData();
    }).catch( function( err ){
        console.log( err );
        alert( 'Unable to delete at this time. Try again later.' );
    })
}

