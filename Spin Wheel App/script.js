const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
];

// Size of each piece
const data = [16, 16, 16, 16, 16, 16];

// Background color for each piece
var pieColors = [
  "#3C50E0", 
  "#2a3a7b", 
  "#4a5ee0", 
  "#1a2a4d", 
  "#3C50E0", 
  "#2a3a7b",
];

// Create chart
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: [], // Empty labels
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
  },
});

// Load stored winning numbers from localStorage, if available
let usedWinningNumbers = JSON.parse(localStorage.getItem('usedWinningNumbers')) || [];

// Function to generate a unique winning number
const valueGenerator = () => {
  // Generate an array of available numbers by excluding used numbers
  let availableNumbers = Array.from({ length: 51 }, (_, i) => i + 1).filter(n => !usedWinningNumbers.includes(n));

  // If all numbers have been used, disable further spins
  if (availableNumbers.length === 0) {
    finalValue.innerHTML = `<p>All numbers have been used. No more spins are available.</p>`;
    spinBtn.disabled = true;
    return;
  }

  // Generate a unique winning number from available numbers
  let randomIndex = Math.floor(Math.random() * availableNumbers.length);
  let randomWinningNumber = availableNumbers[randomIndex];

  // Add the new winning number to the set of used numbers
  usedWinningNumbers.push(randomWinningNumber);
  localStorage.setItem('usedWinningNumbers', JSON.stringify(usedWinningNumbers));

  // Display the winning number
  finalValue.innerHTML = `<p>Winning Number: ${randomWinningNumber}</p>`;
};

// Spinner count
let count = 0;
// 100 rotations for animation and last rotation for result
let resultValue = 51;

// Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  // Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  // Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  // Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    // Set rotation for piechart
    myChart.options.rotation = myChart.options.rotation + resultValue;
    // Update chart with new value
    myChart.update();
    // If rotation > 360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator();
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
      // Re-enable the spin button for the next spin only if there are numbers left
      if (usedWinningNumbers.length < 51) {
        spinBtn.disabled = false;
      }
    }
  }, 10);
});




