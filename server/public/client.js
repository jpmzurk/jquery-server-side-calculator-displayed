$(document).ready(onReady);

function onReady() {
    // load data from the server, put it on the DOM
    getCalculatorData();
    clickListeners();
    keyPressListeners();
}

function clickListeners() {
    $('#squareRoot').on('click', hideInput);
    $('#plusOperator, #minusOperator, #multiplyOperator, #divideOperator, #squareRoot').on('click',  clickValue);
    $('#equalsButton').on('click', objectFilter);
    $('#resultsTarget').on('click', '.list' ,reEnterData)
    $('#deleteParent').on('click', '#clearHistory', deleteServerEquations)
    $('#resultsTarget').on('click', '.useTotal' , useTotal)
    $('#resultsTarget').on('click', '.deleteThis' , singleDelete)
}

function keyPressListeners() {
    $(document).keyup(function (e) { 
        if (e.shiftKey === false) {     
            if (e.which === 187 || e.which === 13) {
                $('#equalsButton').siblings('button.operator').prop('disabled', false);
                objectFilter();
        }   else if (e.which === 189){

            console.log('you pressed -');
            if (
                $('#minusOperator').prop('disabled') === false &&
                $('#minusOperator').siblings('button.operator').prop('disabled') === true 
            ) {
                $('#minusOperator').siblings('button.operator').prop('disabled', false)

            } else {
            $('#minusOperator').siblings('button.operator').prop('disabled', false);
            $('#minusOperator').trigger('click'); 
            }
        } else if (e.which === 191){
            console.log('you pressed /');
            if (
                $('#divideOperator').prop('disabled') === false &&
                $('#divideOperator').siblings('button.operator').prop('disabled') === true 
            ) {
                $('#divideOperator').siblings('button.operator').prop('disabled', false)

            } else {
            $('#divideOperator').siblings('button.operator').prop('disabled', false);
            $('#divideOperator').trigger('click'); 
            }
        } 
        }
        else if (e.shiftKey === true ){
            if (e.which === 187){
                console.log('you pressed +');
                if (
                    $('#plusOperator').prop('disabled') === false &&
                    $('#plusOperator').siblings('button.operator').prop('disabled') === true 
                ) {
                    $('#plusOperator').siblings('button.operator').prop('disabled', false)
    
                } else {
                $('#plusOperator').siblings('button.operator').prop('disabled', false);
                $('#plusOperator').trigger('click'); 
                }
            } else if (e.which === 56){
                console.log('you pressed *');
                if (
                    $('#multiplyOperator').prop('disabled') === false &&
                    $('#multiplyOperator').siblings('button.operator').prop('disabled') === true 
                ) {
                    $('#multiplyOperator').siblings('button.operator').prop('disabled', false)
    
                } else {
                $('#multiplyOperator').siblings('button.operator').prop('disabled', false);
                $('#multiplyOperator').trigger('click'); 
                }
            }
        }

    })
} 


let operations = [];

function clickValue(event) {
    event.preventDefault();

    //if / else statements toggle the buttons on / off if the user clicks same button  twice 
    if (   
        $(this).prop('disabled') === false &&
        $(this).siblings('button.operator').prop('disabled') === true) 
    {
        console.log('prop is enabled')
        $(this).siblings('button.operator').prop('disabled', false)
        operations.length = 0;
    } else {
        operations.length = 0;
        operator = $(this).attr('value');
        operations.push(operator)
        $(this).siblings('button.operator').prop('disabled', true);
    }
}

        //filter and package data in object before being sent to server
function objectFilter() {
    let inputOne = $('#firstValue').val();
    let inputTwo = $('#secondValue').val();
    let operatorValue = String(operations[0]);
    
     //turn buttons not clicked back on
    $(this).siblings('button.operator').prop('disabled', false);
    // keeps form from sending if any value or operator is empty. 
    if ( operations.length === 0 || inputOne.length === 0 || inputTwo.length === 0) {
        alert('with regular operators (+ - / *)you must enter numbers in both fields and select an operator')
    }  else if (operatorValue !== '√'){

            let objectToSend = {
                numOne: Number(inputOne),
                numTwo: Number(inputTwo),
                operator: operatorValue,
                total : 0,
            }
            console.log(objectToSend)
            postData(objectToSend)

    } else if ((operatorValue) === '√'){
            let objectToSend = {
            numOne: 'empty',
            numTwo: Number(inputTwo),
            operator: operatorValue,
            total : 0,
        }
            console.log(objectToSend)
            postData(objectToSend)    
            
    }

}

//POST DATA TO SERVER!
function postData(anotherObject) {
    console.log('in postData', anotherObject);
    
    $.ajax({
        url: "/calculator",
        method: "POST",
        data: anotherObject,
            
    }).then(function (response) {
            console.log('response from POST', response);
            getCalculatorData();
            $('#firstValue').val('');
            $('#secondValue').val('');
            operations.length = 0;
        
    }).catch( function( err ){
            console.log( err );
            alert( 'Unable to post anything at this time. Try again later.' );
    })
}

function hideInput() {
    if ( $('#squareRoot').siblings('button.operator').prop('disabled') === true)
        { $('#firstValue').show();
        $('#firstValue').val('')
        $('#plusOperator').removeClass('list')
 
    } else if ($('#squareRoot').siblings('button.operator').prop('disabled') === false){
        $('#firstValue').hide();
        $('#firstValue').val('')
        $('#plusOperator').addClass('list')
    }

    $('#firstValue').val(0);
}



//GET THAT PROCESSED DATA!
function getCalculatorData() {
    console.log('in get calculatorData');
    console.log(arrayOfEquations);
    
    $.ajax({
        type: 'GET',
        url: '/calculator'
    }).then(function (response) {
        $('#resultsTarget').empty();
        console.log(response);
        //clear array that holds equations to remove old entries
        arrayOfEquations.length = 0;
        //push processed data to array(equation) to be used with re-entering data on click
        arrayOfEquations.push(response)
        $('#firstValue').show();
        addDataToDom (response);
    }).catch( function( err ){
        console.log( err );
        alert( 'Unable to get data, try again later.' );
    })
}


//PUT YR PROCESSED DATA ON THE DOM
function addDataToDom(answer) {
    console.log('in addDataToDom heres the returned data', answer);

    let useTotalBtn = `<button class= "btn btn-warning useTotal form-control"> Use Total</button>`
    let deleteThisBtn = `<button class= "btn btn-outline-danger deleteThis form-control"> Remove This Equation </button>`
    // append that data to the DOM
    for (let i = 0; i < answer.length; i++) {
        let returnedData = answer[i];
        if (returnedData.numOne === 'empty') {
            $('#resultsTarget').append(`
            <form class="form-inline toDelete">
            <li class="list-group-item list form-control" data-index="${i}" >
                ${returnedData.operator} ${returnedData.numTwo} = ${returnedData.total} </li> ${useTotalBtn} ${deleteThisBtn}
            <form>    
            `);
        } else {
        $('#resultsTarget').append(`
        <form class="form-inline toDelete">
        <li class="list-group-item list form-control" data-index="${i}" >
            ${returnedData.numOne}  ${returnedData.operator} ${returnedData.numTwo} = ${returnedData.total} </li> ${useTotalBtn} ${deleteThisBtn}
        <form>    
        `);
        }
    }
    //add the clear all button ONLY if there is at least list item with the class of list
    let removeAllBtn = `<button class= "btn btn-danger" id="clearHistory" > Clear The Entire History</button>`;
    let listItems = $('li.list').length;
    if ( 
        listItems > 0
    ) {
        $('#deleteHistory').empty();
        $('#deleteHistory').append(removeAllBtn);
    } else {
        $('#deleteHistory').empty();
    }
}


//need an array to deal with list items
let arrayOfEquations = [];

//PUT THE CLICKED LI (EQUATION) BACK INTO FORM
function reEnterData (){
    //get the li index
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
        //this request will ask the server to empty the array of objects on server
    }).then( function( response ){
        getCalculatorData();
        //clear input fields in case USE TOTAL button has been pressed or user has inputs in the fields
        $('#clearButton').trigger('click')
    }).catch( function( err ){
        console.log( err );
        alert( 'Unable to delete at this time. Try again later.' );
    })
}

function useTotal (event) {
    event.preventDefault();
    clickedIndex = $(this).siblings('.list').data( 'index' );
    let anObject = arrayOfEquations[0];
    //get clicked on equation 
    let desiredEquation = anObject[clickedIndex];
    let total = desiredEquation.total;
    $('#firstValue').val(total);
}


function singleDelete(event) {
    event.preventDefault();
    console.log('in singleDelete');
    let index = $(this).siblings('.list').data( 'index' );
    console.log(index);
    
    $.ajax({
        type: 'DELETE',
        url: '/calculator/' + index
    }).then( function( response ){
        console.log(response);
        getCalculatorData()
    }).catch( function( err ){
        console.log( err );
        alert( 'Unable to delete at this time. Try again later.' );
    })

}

