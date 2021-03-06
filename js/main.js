// http://www.theodinproject.com/javascript-and-jquery/on-screen-calculator
'use strict';





///////////////////////////////////////////////////////////////////////////////
// initializes vars
///////////////////////////////////////////////////////////////////////////////
var num1 = '';
var num2 = '';
var operator = '';
var tape = [];
var calcStatus = {
    // are we done typing num1?
    num1Complete: false,
    // was an operator just pressed?
    // add 1 every time operator button is pressed consecutively
    operatorPressedCount: 0,
    // was equal just pressed?
    // 11-14-16 on further consideration, this may be not a great way to do this
    calculationComplete: false
};





///////////////////////////////////////////////////////////////////////////////
// calculator math functions
///////////////////////////////////////////////////////////////////////////////
var calculator = {
    add: function (a, b) {
        return ((+a) + (+b));
    },
    subtract: function (a, b) {
        return ((+a) - (+b));
    },
    multiply: function (a, b) {
        return ((+a) * (+b));
    },
    divide: function (a, b) {
        return ((+a) / (+b));
    }
};





///////////////////////////////////////////////////////////////////////////////
// for logging history to paper tape
///////////////////////////////////////////////////////////////////////////////
function logTape(str) {
    if (tape.length > 500) {
        tape.shift();
    }

    tape.push(str);
    document.getElementById('tapeDisplay').innerHTML = tape.join('');

    // scrolls to bottom of tape
    var tapeId = document.getElementById('tapeDisplay');
    tapeId.scrollTop = tapeId.scrollHeight;
}





///////////////////////////////////////////////////////////////////////////////
// for updating calculator displays
///////////////////////////////////////////////////////////////////////////////
function updateDisplay(dispId, dispContent) {
    document.getElementById('display' + dispId).innerHTML = dispContent;

    // if display overflows, adds ellipsis
    if (dispContent.length > 12) {
        updateDisplay(3, '\u2026');
    }
}





///////////////////////////////////////////////////////////////////////////////
// for updating debug display
///////////////////////////////////////////////////////////////////////////////
function updateDebug() {
    document.getElementById('num1Complete').textContent =
        ('num1Complete: ' + calcStatus.num1Complete.toString());

    document.getElementById('operatorPressedCount').textContent =
        ('operatorPressedCount: ' + calcStatus.operatorPressedCount.toString());

    document.getElementById('calculationComplete').textContent =
        ('calculationComplete: ' + calcStatus.calculationComplete.toString());
}





///////////////////////////////////////////////////////////////////////////////
// for resetting calculator values and displays
///////////////////////////////////////////////////////////////////////////////
function resetCalc() {
    num1 = '';
    num2 = '';
    operator = '';
    calcStatus = {
        num1Complete: false,
        operatorPressedCount: 0,
        calculationComplete: false
    };

    updateDisplay(1, '');
    updateDisplay(2, '0');
    updateDisplay(3, '');
    document.getElementById('tapeDisplay').innerHTML = '';

    updateDebug();
}





///////////////////////////////////////////////////////////////////////////////
// for clearing the paper tape
///////////////////////////////////////////////////////////////////////////////
function clearTape() {
    tape = [];
}





///////////////////////////////////////////////////////////////////////////////
// for recording a number button press by user
///////////////////////////////////////////////////////////////////////////////
function logNum(id) {
    var currentBtnId = document.getElementById(id);

    // Continues to add digits to num1
    // until an operator is pressed,
    // then starts to add digits to num2.
    if (calcStatus.calculationComplete === true) {
        // if equal button has just been pressed,
        // this now overwrites the carried over result
        // from that previous calculation
        num1 = currentBtnId.innerHTML;
        updateDisplay(2, num1);
    } else if (calcStatus.num1Complete === false) {
        // appends digits to num1,
        // until an operator button is pressed
        num1 += currentBtnId.innerHTML;
        updateDisplay(2, num1);
    } else {
        // appends digits to num2,
        // until equal or operator button is pressed
        num2 += currentBtnId.innerHTML;
        updateDisplay(2, num2);
    }

    logTape(currentBtnId.innerHTML);

    calcStatus.calculationComplete = false;
    calcStatus.operatorPressedCount = 0;
    updateDebug();
}





///////////////////////////////////////////////////////////////////////////////
// for calculating math result
///////////////////////////////////////////////////////////////////////////////
function calculateResult() {
    console.log('> START calculateResult()');
    console.log('tape = ' + tape);
    var result = (num1 || '0').toString();

    // if equal button is pressed without having a num2
    if (operator !== '' && num2 === '') {
        console.log('START if equal button is pressed without having a num2');
        console.log('tape = ' + tape);
        operator = '';
        tape.pop();
        logTape('<br>= ' + result + '<br>');
        console.log('tape = ' + tape);
        console.log('END if equal button is pressed without having a num2');
    }

    if (operator !== '' && num2 !== '') {
        if (calcStatus.operatorPressedCount >= 1) {
            // when operator button is double-pressed
            console.log('when operator button is double-pressed');
            result = calculator[operator](+num1, +num2);
            num2 = '';
        } else {
            // when equal button is pressed
            console.log('when equal button is pressed');
            result = calculator[operator](+num1, +num2);
            resetCalc();
        }
    }

    // carry over result
    num1 = result;
    updateDisplay(2, num1);

    // ? this keeps multiple button presses from
    // ? filling up the paper tape
    if (calcStatus.calculationComplete === false &&
        calcStatus.operatorPressedCount === 0) {
        console.log('START this keeps multiple button presses from');
        console.log('tape = ' + tape);
        logTape('<br>= ' + result + '<br>');
        console.log('tape = ' + tape);
        console.log('END this keeps multiple button presses from');
    }

    calcStatus.num1Complete = false;
    calcStatus.calculationComplete = true;
    updateDebug();
    console.log('tape = ' + tape);
    console.log('> END calculateResult()');
}





///////////////////////////////////////////////////////////////////////////////
// for recording operator button press by user
///////////////////////////////////////////////////////////////////////////////
function logOperand(id) {
    console.log('< START logOperand(id)');
    console.log('tape = ' + tape);
    var currentBtnId = document.getElementById(id);
    var strLog = '';

    if (calcStatus.num1Complete || calcStatus.operatorPressedCount >= 1) {
        // if num1, an operator button press, and num2
        // have been input by the user, the subsequent
        // press of an operator button will now
        // calculate that result,
        //
        // then a new calculation will be inferred to use
        // the previous result as the new num1,
        // with the new operator press,
        // and all that will be remaining is for
        // the user to input a value for num2
        calculateResult();
        calcStatus.operatorPressedCount += 1;
        updateDisplay(1, currentBtnId.innerHTML);
        operator = id;
        // this keeps the paper tape from being filled
        // with repeated operator button presses
        if (calcStatus.operatorPressedCount >= 2) {
            console.log('keeps the paper tape from being filled');
            console.log('1: ' + tape);
            tape.pop();
            console.log('2: ' + tape);
        }

        // for making the paper tape nicer
        // (e.g. press operator to complete a calculation,
        // immediately starting a new calculation)
        if (calcStatus.calculationComplete === true) {
            strLog = currentBtnId.innerHTML + ' ';
        } else {
            strLog = '<br>' + currentBtnId.innerHTML + ' ';
        }
    } else if (calcStatus.operatorPressedCount === 0) {
        // if this is the first time an operator button has been pressed
        console.log('START first time an operator button has been pressed');
        console.log('tape = ' + tape);
        calcStatus.operatorPressedCount = 1;
        updateDisplay(1, currentBtnId.innerHTML);
        operator = id;
        // this makes the paper tape look nicer
        strLog = '<br>' + currentBtnId.innerHTML + ' ';
        if (calcStatus.calculationComplete === true) {
            strLog = currentBtnId.innerHTML + ' ';
        }
        console.log('tape = ' + tape);
        console.log('END first time an operator button has been pressed');
    }

    logTape(strLog);

    calcStatus.num1Complete = true;
    calcStatus.calculationComplete = false;
    updateDebug();
    console.log('tape = ' + tape);
    console.log('< END logOperand(id)');
}
