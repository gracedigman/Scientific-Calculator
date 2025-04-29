class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    executeFunction(func) {
        const number = parseFloat(this.currentOperand);
        let result;

        switch(func) {
            case 'sqrt':
                result = Math.sqrt(number);
                break;
            case 'square':
                result = Math.pow(number, 2);
                break;
            case 'sin':
                result = Math.sin(number * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(number * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(number * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(number);
                break;
            case 'pi':
                result = Math.PI;
                break;
            default:
                return;
        }

        this.currentOperand = result.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// DOM Elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Number Buttons
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
    });
});

// Operation Buttons
document.querySelectorAll('[data-operation]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operation'));
        calculator.updateDisplay();
    });
});

// Function Buttons
document.querySelectorAll('[data-function]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.executeFunction(button.getAttribute('data-function'));
        calculator.updateDisplay();
    });
});

// Equals Button
document.querySelector('[data-action="calculate"]').addEventListener('click', () => {
    calculator.calculate();
    calculator.updateDisplay();
});

// Clear Button
document.querySelector('[data-action="clear"]').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

// Delete Button
document.querySelector('[data-action="delete"]').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.calculate();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});