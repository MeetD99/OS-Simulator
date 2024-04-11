// Define Semaphore class
class Semaphore {
  constructor(initialCount) {
    this.count = initialCount;
    this.waitQueue = [];
  }

  // Semaphore wait operation
  wait() {
    return new Promise((resolve) => {
      if (this.count > 0) {
        this.count--;
        resolve();
      } else {
        this.waitQueue.push(resolve);
      }
    });
  }

  // Semaphore signal operation
  signal() {
    if (this.waitQueue.length > 0) {
      const resolve = this.waitQueue.shift();
      resolve();
    } else {
      this.count++;
    }
  }
}

// Define constants
const numPhilosophers = 5;
const THINKING = 0;
const HUNGRY = 1;
const EATING = 2;
const MAX_EATING_CYCLES = 2;
const EATING_DURATION = 2000;
const THINKING_DURATION = 2000;


//   const DELAY_BETWEEN_ACTIONS = 5000;

// Initialize semaphores and states
const mutex = new Semaphore(1);
const s = [];
const state = new Array(numPhilosophers).fill(THINKING);
const eatingCount = new Array(numPhilosophers).fill(0);

for (let i = 0; i < numPhilosophers; i++) {
  s.push(new Semaphore(0));
}

// Define philosopher function
async function philosopher(i) {
  const philosopherDiv = document.getElementById(`philosopher${i}`);
  const diningResults = document.getElementById("dining-results");
  let eatingCycles = 0;

  while (eatingCycles < MAX_EATING_CYCLES) {
    await think(i, philosopherDiv);
    await takeForks(i);
    await eat(i, philosopherDiv);
    putForks(i);
    eatingCycles++;
    philosopherDiv.style.backgroundColor = '#1F618D';
  }
}

// Think function
async function think(i, philosopherDiv) {
  displayResult(`Philosopher ${i} is thinking`);
  state[i] = THINKING;
  philosopherDiv.style.backgroundColor = 'red';
  await delay(THINKING_DURATION);
  state[i] = EATING;
}

// Eat function
async function eat(i, philosopherDiv) {
  displayResult(`Philosopher ${i} is eating`);
  state[i] = EATING;
  philosopherDiv.style.backgroundColor = 'green';
  await delay(EATING_DURATION);
  state[i] = THINKING;
}

// Take forks function
async function takeForks(i) {
  await mutex.wait();
  state[i] = HUNGRY;
  test(i);
  mutex.signal();
  await s[i].wait();
}

// Test function
function test(i) {
  if (state[i] === HUNGRY && state[left(i)] !== EATING && state[right(i)] !== EATING) {
    state[i] = EATING;
    s[i].signal();
  }
}

// Put forks function
async function putForks(i) {
  await mutex.wait();
  state[i] = THINKING;
  test(left(i));
  test(right(i));
  mutex.signal();
}

// Utility function to calculate the index of the left philosopher
function left(i) {
  return (i + numPhilosophers - 1) % numPhilosophers;
}

// Utility function to calculate the index of the right philosopher
function right(i) {
  return (i + 1) % numPhilosophers;
}

// Utility function to introduce a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function displayResult(text) {
  const resultElement = document.createElement('p');
  resultElement.textContent = "$ " + text;
  const diningResults = document.getElementById("dining-results");
  diningResults.appendChild(resultElement);
}

function displayConsoleLogs(){
  const consoleLogs = document.getElementById('dining-results');
  consoleLogs.style.display = 'flex';
}

function clearResults() {
  const diningResults = document.getElementById("dining-results");
  diningResults.innerHTML = '';
}

function clearLogs(){
  const consoleLogs = document.getElementById('dining-results');
  consoleLogs.style.display = 'none';
}
// Create philosophers
function main() {
  clearResults();
  clearLogs();
  delay(2000);
  for (let i = 0; i < numPhilosophers; i++) {
      philosopher(i);
    }
}

document.getElementById("simbutton").addEventListener('click', main);
document.getElementById("resbutton").addEventListener('click', displayConsoleLogs);

