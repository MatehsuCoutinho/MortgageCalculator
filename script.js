document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.calculator');
    const mortgageAmountInput = document.getElementById('Mortgage Amount');
    const mortgageTermInput = document.getElementById('Mortgage Term');
    const interestRateInput = document.getElementById('Interest Rate');
    const repaymentRadio = document.getElementById('repayment');
    const interestOnlyRadio = document.getElementById('interestOnly');
    const clearButton = document.querySelector('.clear-button');
    const calculateButton = document.querySelector('.calculate-button');
    const resultsSection = document.querySelector('.results');
    const resultsImage = resultsSection.querySelector('img');
    const resultsTitle = resultsSection.querySelector('h1');
    const resultsText = resultsSection.querySelector('p');

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(value);
    }

    function validateInput(input, minValue = 0) {
        const value = parseFloat(input.value.replace(/[^0-9.]/g, ''));
        const errorMessage = input.nextElementSibling;

        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }

        if (isNaN(value) || value <= minValue) {
            const error = document.createElement('span');
            error.className = 'error-message';
            error.textContent = `Please enter a valid value (greater than ${minValue})`;
            error.style.color = 'hsl(0, 70%, 50%)';
            error.style.fontSize = '0.75rem';
            error.style.marginTop = '0.25rem';
            error.style.display = 'block';
            input.insertAdjacentElement('afterend', error);
            input.classList.add('invalid');
            return false;
        }

        input.classList.remove('invalid');
        return true;
    }

    function calculateMortgage() {
        const isAmountValid = validateInput(mortgageAmountInput, 1000);
        const isTermValid = validateInput(mortgageTermInput, 1);
        const isRateValid = validateInput(interestRateInput, 0.1);

        if (!isAmountValid || !isTermValid || !isRateValid) return;

        const amount = parseFloat(mortgageAmountInput.value.replace(/[^0-9.]/g, ''));
        const termYears = parseFloat(mortgageTermInput.value.replace(/[^0-9.]/g, ''));
        const annualRate = parseFloat(interestRateInput.value.replace(/[^0-9.]/g, '')) / 100;
        const termMonths = termYears * 12;
        const monthlyRate = annualRate / 12;

        let monthlyPayment, totalPayment;

        if (repaymentRadio.checked) {
            monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
            totalPayment = monthlyPayment * termMonths;
        } else {
            monthlyPayment = amount * monthlyRate;
            totalPayment = amount + (monthlyPayment * termMonths);
        }

        resultsImage.src = 'assets/illustration-calculated.svg';
        resultsTitle.textContent = `Monthly Payment: ${formatCurrency(monthlyPayment)}`;
        resultsText.textContent = `Total payable in ${termYears} years: ${formatCurrency(totalPayment)}`;
    }

    function clearForm() {
        mortgageAmountInput.value = '';
        mortgageTermInput.value = '';
        interestRateInput.value = '';
        repaymentRadio.checked = true;
        resultsImage.src = 'assets/illustration-empty.svg';
        resultsTitle.textContent = 'Results shown here';
        resultsText.textContent = 'Complete the form and click "calculate repayments" to see what your monthly repayments would be.';
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        mortgageAmountInput.classList.remove('invalid');
        mortgageTermInput.classList.remove('invalid');
        interestRateInput.classList.remove('invalid');
    }

    calculateButton.addEventListener('click', function(e) {
        e.preventDefault();
        calculateMortgage();
    });

    clearButton.addEventListener('click', function(e) {
        e.preventDefault();
        clearForm();
    });

    mortgageAmountInput.addEventListener('input', function() {
        validateInput(this, 1000);
    });

    mortgageTermInput.addEventListener('input', function() {
        validateInput(this, 1);
    });

    interestRateInput.addEventListener('input', function() {
        validateInput(this, 0.1);
    });

    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateMortgage();
        }
    });
});