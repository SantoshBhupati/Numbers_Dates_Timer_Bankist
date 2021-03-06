'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-12-10T17:01:17.194Z',
    '2021-12-12T23:36:17.929Z',
    '2021-12-14T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
  const formatDisplaydate = function(date,locale){

    const calcDaysPassed = (date1,date2) => Math.round(Math.abs((date2 - date1) / (1000*60*60*24)));
    const days = calcDaysPassed(new Date(),date);
    // console.log(days);
    if(days === 0) return 'Today';
    if(days === 1) return 'Yestarday';
    if(days <= 7) return `${days} days ago`;
    else{

    // const day  = `${date.getDate()}`.padStart(2,0);
    // const month = `${date.getMonth()+1}`.padStart(2,0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return Intl.DateTimeFormat(locale).format(date);
    }
  }
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
     
     const date = new Date(acc.movementsDates[i]);
     const displayDate = formatDisplaydate(date,acc.locale);
    
     const formatedMov = formatCur(mov,acc.locale,acc.currency)
    
  
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const formatCur = function(value,locale,currency){
  return new Intl.NumberFormat(locale,{
    style :'currency',
    currency : currency
  }).format(value);
}

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance,acc.locale,acc.currency)

};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes,acc.locale,acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out,acc.locale,acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest,acc.locale,acc.currency); 
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount,timer;


// //EXPREATING API 
// const now = new Date();

// const options = {
//   hour : 'numeric',
//   minute : 'numeric',
//   day : 'numeric',
//   month : 'numeric',
//   year : 'numeric',
//   // weekday : 'long'

// }
//   const locale = navigator.language
//   console.log(locale);

// labelDate.textContent = new Intl.DateTimeFormat(locale ,options).format(now);  // every country has different format such as d/m/y ,m/d/y ,y/m/d


//TIMER SETUP
const startLogOutTimer = function(){
  let time  = 120;
  const tick =() => {
    const min =  String(Math.trunc(time/60)).padStart(2,0);
    const sec = String(Math.trunc(time%60)).padStart(2,0);
    labelTimer.textContent = `${min}:${sec}`;
    if(time ===0){
      clearInterval(timer);
      labelWelcome.textContent = `Login to Get Started`
      containerApp.style.opacity = 0;
    }
    time--;
  }
  tick();
  const timer =  setInterval(tick, 1000);
  return timer;
}

//FAKE ACCOUNT TO DISPLAY
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;




btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //dates
const now = new Date();

const options = {
  hour : 'numeric',
  minute : 'numeric',
  day : 'numeric',
  month : 'numeric',
  year : 'numeric',
  // weekday : 'long'

}
  // const locale = navigator.language
  // console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale ,options).format(now);  // every country has different format such as d/m/y ,m/d/y ,y/m/d

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  // Calling Timer Function
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add The Dates
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    //Reset Time
    clearInterval(timer);
    // console.log(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    setTimeout(function(){
    currentAccount.movements.push(amount);
  
     //Add Transfer Date
      currentAccount.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
       //Reset Time
       clearInterval(timer);
       timer = startLogOutTimer();
  },2500)
}
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

console.log(23 === 23.0);
console.log(Number('23'));
console.log(+'23');

//parsining
console.log(Number.parseInt('30px')); //30
console.log(Number.parseInt('e23')); //NaN;
//infinite method
 console.log(Number.isFinite(20));  //true
 console.log(Number.isFinite('20')); // false

 //MATH AND ROUNDING

 console.log(Math.sqrt(25)); // 5
 console.log(25 ** (1/2)); // 5
 console.log(8 ** (1/3)); // 2

 console.log(Math.max(12,222,34,67,890)); // 890
 console.log(Math.max(12 ,34,56,'78',67)); //78 it follows type conversion
 console.log(Math.max(12,'45px',34,10)) ; //NaN it does not follow parsinig

 console.log(Math.min(12,3,67,8,90)); // 3
 console.log(Math.PI * Number.parseFloat('5px') ** 2);  //Area of circle : 78.53981633974483

 console.log(Math.random()) // it gives number between 0 to 1

 const randomInt = (max,min) => Math.trunc(Math.random() * (max- min)+1) + min;
 console.log(randomInt(5,2));

 //ROUNDING INTEGERS
 console.log(Math.trunc(23.90)); // 23
 
 //round has differences
 console.log(Math.round(23.67)); // 24
 console.log(Math.round(23.34)); //23

 //celi
 console.log(Math.ceil(23.34)); //24
 console.log(Math.ceil(23.90)); //24

 //floor
 console.log(Math.floor(56.12)); //56
 console.log(Math.floor(56.90)); //56

 //tofixed - always return a string
 console.log((2.7).toFixed(0))  // 3
 console.log((2.7).toFixed(3)) //2.700
 console.log(+(2.745).toFixed(2)) //2.75 and its a number 

 //REMAINDER OPERATOR
 console.log(5/2); // 2
 console.log(5 %2); // 1

 const isEven = (n)=> n % 2 === 0;

 console.log(isEven(6)); // true
 console.log(isEven(5)); // false

 //some pratical example
 labelBalance.addEventListener('click',function(){
 [...document.querySelectorAll('.movements__row')].forEach(function(row,i){
   if(i % 2 ===0) row.style.backgroundColor = 'orangered';
 })});


 //BIGINT
 console.log(2 ** 53 -1);//9007199254740991 javascript does not allow bigger than this number(integer);
 console.log(Number.MAX_SAFE_INTEGER);//9007199254740991

  console.log(121313131313241241414113535n); // n  coverts normal number into bigint

  //OPERATIONS
  // work same 
  console.log(12113123131n +334343444n);  //12447466575n
  console.log(131444423n * 12322141444n); //1619676772230966812n


  // Creates Dates
  new Date();
  // 1
  // const now = new Date();
  // console.log(now); //Mon Dec 13 2021 16:54:31 GMT+0530 (India Standard Time)
  
  //2

//   console.log(new Date('Sat Dec 25 2021')); //Sat Dec 25 2021 00:00:00 GMT+0530 (India Standard Time
 
//   // in javascript month is started from 0 base means jan : 0 feb :1 march : 2 and so on

//   console.log(new Date(2037,10,23,12,4,5)); //Mon Nov 23 2037 12:04:05 GMT+0530 (India Standard Time) here 10 means ocotober
  
//   console.log(new Date(2037,10,31));  //Tue Dec 01 2037 00:00:00 GMT+0530 (India Standard Time)
//   // note the point javascript has autocorrect method in this case november month has 30 days but we wrote 31 javasccript enginge autocoorect shows decmberr 1

//   console.log(new Date(0));  //Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time) here javascript date class is started

//  // it is formula to convert into miliseconds

//   console.log(new Date(3 * 24 * 60 * 60 * 1000 ));  //Sun Jan 04 1970 05:30:00 GMT+0530 (India Standard Time)

//   // Working With Dates

  // const Future = new Date(2037,10,23,12,4,5);

  // console.log(now.getFullYear()); //2021
  // console.log(now.getMonth()) ;  //11
  // console.log(now.getDate()); //13
  // console.log(now.getDay()); //1
  // console.log(now.getHours()); //17
  // console.log(now.getMinutes()); //19
  // console.log(now.getSeconds()); //9
  // console.log(now.getMilliseconds()); //810
  // console.log(now.toISOString());  //2021-12-13T11:51:11.040Z



  //OPERATIONS WITH DATES

  const future = new Date(2037,10,23,12,4,5);
  console.log(Number(future));
  console.log(+future);

  

  // const days1 = calcDaysPassed(new Date(2037,10,3),new Date(2037,10,12));
  // console.log(days1);

  //INTL DATES
  const num = 12323412.56;
  const options = {
    style: "unit", // percentage,celius,cuurency
    unit : 'mile-per-hour'
  }
  console.log('US',new Intl.NumberFormat('en-US',options).format(num));
  console.log('Germany',new Intl.NumberFormat('de-DE',options).format(num));
  console.log('Arebic',new Intl.NumberFormat('ar-SY',options).format(num));


//   //SETTIMEOUT AND SETINTERVAL
//   // Timers

// // setTimeout
// const ingredients = ['olives', 'spinach'];
// const pizzaTimer = setTimeout(
//   (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} ????`),
//   3000,
//   ...ingredients
// );
// console.log('Waiting...');

// if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// // setInterval
// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 1000);
