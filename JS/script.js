/**
 * BMI Calculator Configuration
 */
const BMI_CONFIG = {
  CATEGORIES: {
    UNDERWEIGHT: 'Kekurangan berat badan',
    NORMAL: 'Normal (ideal)',
    OVERWEIGHT: 'Kelebihan berat badan',
    OBESITY: 'Kegemukan (Obesitas)'
  },
  
  RANGES: {
    MALE: {
      UNDERWEIGHT: [0, 18.4],
      NORMAL: [18.5, 24.9],
      OVERWEIGHT: [25.0, 29.9],
      OBESITY: [30.0, Infinity]
    },
    FEMALE: {
      UNDERWEIGHT: [0, 16.9],
      NORMAL: [17.0, 23.9],
      OVERWEIGHT: [24.0, 27.0],
      OBESITY: [27.1, Infinity]
    }
  },
  
  MESSAGES: {
    UNDERWEIGHT: {
      desc: 'Anda memiliki berat badan kurang dari normal.',
      suggestion: 'Jika BMI Anda berada dalam kategori ini maka Anda dianjurkan untuk menambah berat badan hingga batas normal.',
      advice: 'Perbanyak asupan makanan bergizi dan konsultasikan dengan ahli gizi untuk peningkatan berat badan.',
      diseases: ['Kekurangan gizi', 'Gangguan pertumbuhan', 'Sistem kekebalan tubuh lemah', 'Gangguan kesuburan']
    },
    NORMAL: {
      desc: 'Anda memiliki berat badan dalam kisaran normal.',
      suggestion: 'Jika BMI Anda berada dalam kategori ini maka Anda memiliki berat badan yang sehat.',
      advice: 'Lanjutkan gaya hidup sehat dengan pola makan seimbang dan olahraga teratur.',
      diseases: ['Tidak ada']
    },
    OVERWEIGHT: {
      desc: 'Anda memiliki berat badan berlebih.',
      suggestion: 'Jika BMI Anda berada dalam kategori ini maka Anda dianjurkan untuk menurunkan berat badan hingga batas normal.',
      advice: 'Lakukan penyesuaian pola makan dan rutin berolahraga untuk menurunkan berat badan.',
      diseases: ['Diabetes Tipe 2', 'Serangan Jantung', 'Hipertensi', 'Gastroesophageal Reflux Disease', 'Osteoarthritis', 'Kanker', 'Kolesterol Tinggi']
    },
    OBESITY: {
      desc: 'Anda memiliki berat badan yang sangat berlebih.',
      suggestion: 'Jika BMI Anda berada dalam kategori ini maka Anda dianjurkan untuk mengurangi berat badan hingga batas normal.',
      advice: 'Segera konsultasikan dengan ahli gizi untuk penurunan berat badan yang sehat.',
      diseases: ['Penyakit Jantung', 'Stroke', 'Kanker', 'Masalah Pencernaan', 'Sleep Apnea', 'Osteoartritis']
    }
  }
};

/**
 * DOM Elements References
 */
const DOM = {
  form: document.getElementById('form'),
  resultSection: document.getElementById('result'),
  homeSection: document.getElementById('home'),
  elements: {
    resultTitle: document.getElementById('result-title'),
    resultBmi: document.getElementById('result-bmi'),
    resultDesc: document.getElementById('result-desc'),
    resultText: document.getElementById('result-text'),
    suggestionText: document.getElementById('suggestion-text'),
    adviceText: document.getElementById('advice-text'),
    riskTitle: document.getElementById('risk-title'),
    listRisk: document.getElementById('list-risk')
  },
  errorMessages: {
    gender: document.getElementById('genderErrorMessage'),
    weight: document.getElementById('weightErrorMessage'),
    age: document.getElementById('ageErrorMessage'),
    height: document.getElementById('heightErrorMessage')
  }
};

/**
 * Utility Functions
 */
const helpers = {
  clearErrors: () => {
    Object.values(DOM.errorMessages).forEach(el => el.textContent = '');
  },

  validateNumber: (value, fieldName) => {
    if (isNaN(value) || value <= 0) {
      DOM.errorMessages[fieldName].textContent = 
        `${fieldName} harus berupa angka lebih dari 0`;
      return false;
    }
    return true;
  },

  createListItem: text => {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }
};

/**
 * Core Functions
 */
const calculateBMI = (weight, height) => {
  const heightInMeter = height / 100;
  return (weight / (heightInMeter ** 2)).toFixed(1);
};

const determineCategory = (bmi, gender) => {
  const ranges = gender === 'Pria' ? BMI_CONFIG.RANGES.MALE : BMI_CONFIG.RANGES.FEMALE;
  
  return Object.entries(ranges).find(([_, [min, max]]) => 
    bmi >= min && bmi <= max
  )[0];
};

const getBMIStatus = (bmi, gender) => {
  const categoryKey = determineCategory(bmi, gender);
  return BMI_CONFIG.CATEGORIES[categoryKey.toUpperCase()];
};

const getStatusData = status => {
  const statusKey = Object.keys(BMI_CONFIG.CATEGORIES)
    .find(key => BMI_CONFIG.CATEGORIES[key] === status);
  return BMI_CONFIG.MESSAGES[statusKey];
};

/**
 * Display Functions
 */
const updateDisplay = (bmi, status) => {
  const statusData = getStatusData(status);
  
  // Update result values
  DOM.elements.resultTitle.textContent = status;
  DOM.elements.resultBmi.textContent = bmi;
  DOM.elements.resultDesc.textContent = statusData.desc;
  DOM.elements.resultText.textContent = `Hasil BMI: ${bmi}`;
  DOM.elements.suggestionText.textContent = statusData.suggestion;
  DOM.elements.adviceText.textContent = statusData.advice;
  DOM.elements.riskTitle.textContent = `Beberapa resiko penyakit yang berasal dari tubuh ${status}`;

  // Update risk list
  DOM.elements.listRisk.innerHTML = '';
  statusData.diseases.forEach(disease => 
    DOM.elements.listRisk.appendChild(helpers.createListItem(disease))
  );

  // // Toggle sections
  // DOM.homeSection.style.display = 'none';
  // DOM.resultSection.style.display = 'block';
  // DOM.resultSection.scrollIntoView({ behavior: 'smooth' });
};

/**
 * Event Handlers
 */
const handleCalculate = () => {
  helpers.clearErrors();
  
  const inputs = {
    weight: +DOM.form.weight.value,
    height: +DOM.form.height.value,
    age: +DOM.form.age.value,
    gender: DOM.form.gender.value
  };

  const isValid = [
    helpers.validateNumber(inputs.weight, 'weight'),
    helpers.validateNumber(inputs.height, 'height'),
    helpers.validateNumber(inputs.age, 'age'),
    inputs.gender ? true : (DOM.errorMessages.gender.textContent = 'Pilih jenis kelamin terlebih dahulu')
  ].every(result => result);

  if (!isValid) return;

  const bmi = calculateBMI(inputs.weight, inputs.height);
  const status = getBMIStatus(bmi, inputs.gender);
  updateDisplay(bmi, status);
};

const handleReset = () => {
  DOM.form.reset();
  // Reset semua tampilan hasil
  DOM.elements.resultTitle.textContent = 'Kategori BMI';
  DOM.elements.resultBmi.textContent = '0';
  DOM.elements.resultDesc.textContent = 'Status BMI';
  DOM.elements.resultText.textContent = 'Hasil BMI';
  DOM.elements.suggestionText.textContent = 'Informasi BMI';
  DOM.elements.adviceText.textContent = 'Saran BMI';
  DOM.elements.riskTitle.textContent = 'Risk Tittle';
  DOM.elements.listRisk.innerHTML = 'list Risk';
  
  // DOM.homeSection.style.display = 'block'; // atau 'flex'
  // DOM.resultSection.style.display = 'none';
  helpers.clearErrors();
  DOM.form.scrollIntoView({ behavior: 'smooth' });
};

// Inisialisasi awal
// DOM.resultSection.style.display = 'none'; 

/**
 * Event Listeners
 */
document.querySelector('.btn[onclick="checkBMI()"]')
  .addEventListener('click', handleCalculate);
  
document.querySelector('.btn[onclick="regenerateBMI()"]')
  .addEventListener('click', handleReset);