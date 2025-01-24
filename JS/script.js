document.getElementById('calculateBtn').addEventListener('click', function() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // convert to meters

    if (!weight || !height) {
        alert('Harap isi semua bidang!');
        return;
    }

    const bmi = (weight / (height * height)).toFixed(1);

    const resultElement = document.getElementById('bmiValue');
    const descriptionElement = document.getElementById('bmiResult');

    resultElement.textContent = bmi;

    if (bmi < 18.5) {
        descriptionElement.textContent = 'Berat Badan Kurang';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        descriptionElement.textContent = 'Berat Badan Ideal';
    } else if (bmi >= 25 && bmi <= 29.9) {
        descriptionElement.textContent = 'Berat Badan Lebih';
    } else {
        descriptionElement.textContent = 'Obesitas';
    }
});
