document.addEventListener('DOMContentLoaded', function() {
  const registrationInput = document.getElementById('registration');
  const submitButton = document.getElementById('submit');
  const resultDiv = document.getElementById('result');
  const valuationP = document.getElementById('valuation');
  const errorDiv = document.getElementById('error');
  const makeModelP = document.getElementById('makeModel');

  submitButton.addEventListener('click', async function() {
    const registration = registrationInput.value.trim().toUpperCase();
    if (registration.length === 0) {
      showError('Please enter a registration number.');
      return;
    }

    try {
      showLoading();
      const response = await fetch('https://resplendent-cat-e1c9a9.netlify.app/api/vehicle-valuation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registration }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          showError('Vehicle not found or valuation not available.');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        showError(data.error);
        return;
      }

      if (data.retailValuation) {
        showResult(data);
      } else {
        showError('Vehicle valuation data is incomplete.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showError('An error occurred while fetching the valuation. Please try again later.');
    }
  });

  function showResult(data) {
    resultDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    valuationP.textContent = `£${data.retailValuation.toLocaleString()}`;
    if (data.make && data.model) {
      makeModelP.textContent = `${data.make} ${data.model}`;
      makeModelP.classList.remove('hidden');
    }
  }

  function showError(message) {
    resultDiv.classList.add('hidden');
    errorDiv.classList.remove('hidden');
    errorDiv.querySelector('p').textContent = message;
    makeModelP.classList.add('hidden');
  }

  function showLoading() {
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    makeModelP.classList.add('hidden');
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading"></span>';
  }

  registrationInput.addEventListener('input', function() {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Get Valuation';
  });
});