class Restaurant {
  constructor() {
    this.departments = [
      {
        number: 1,
        name: 'hall'
      },
      {
        number: 2,
        name: 'cook'
      },
      {
        number: 3,
        name: 'dessert cook'
      },
    ];
    this.employees = [
      {
        name:'maks',
        position: 'barman',
        isLeader: false,
        salary: 100,
        isWorks: true,
        department: 1,
      },
      {
        name:'oleg',
        position: 'ofitsiant',
        isLeader: false,
        salary: 100,
        isWorks: false,
        department: 1,
      },
      {
        name:'mari',
        position: 'assistant-cook',
        isLeader: false,
        salary: 100,
        isWorks: true,
        department: 2,
      },
      {
        name:'dima',
        position: 'cleaner',
        isLeader: false,
        salary: 100,
        isWorks: true,
        department: 2,
      },
      {
        name:'igor',
        position: 'dessert cook',
        isLeader: false,
        salary: 150,
        isWorks: false,
        department: 3,
      },
      {
        name:'Lexa',
        position: 'dessert cook',
        isLeader: false,
        salary: 120,
        isWorks: true,
        department: 3,
      }
    ]
  }

  sumSalary(callback){
    let result = {};
    if(this.departments.length && this.employees.length) {
      this.employees.forEach((employee) => {
        if(callback(employee)){
          if(result[employee.department]) {
            result[employee.department] += employee.salary;
          } else {
            result[employee.department] = employee.salary;
          }
        }
      })
      return result;
    }
    return null;
  }

  averageSalary(callback){
    let result = 0;
    let count = 0;
    if(this.departments.length && this.employees.length) {
      this.employees.forEach((employee) => {
        if(callback(employee)){
          count++;
          result += employee.salary;
        }
      })
      return result/count;
    }
    return null;
  }

  salaryMinToMax(callback){
    let result = {};
    if(this.departments.length && this.employees.length) {
      this.departments.forEach((department) => {
        result[department.number] = {};
        this.employees.forEach((employee) => {
          if(callback(employee) && department.number === employee.department){
            if(result[department.number][employee.position]){
              if(result[department.number][employee.position].min > employee.salary){
                result[department.number][employee.position].min = employee.salary;
              }
              if(result[department.number][employee.position].max < employee.salary){
                result[department.number][employee.position].max = employee.salary;
              }
            } else {
              result[department.number][employee.position] = {};
              result[department.number][employee.position].min = employee.salary;
              result[department.number][employee.position].max = employee.salary;
            }
          }
        })
        if(Object.keys(result[department.number]).length === 0){
          delete result[department.number];
        }
      })
      return result;
    }
    return null;
  }

  amountEmployee (callback) {
    let result = 0;
    if(this.departments.length && this.employees.length) {
      this.employees.forEach((employee) => {
        if(callback(employee)) {
          result++;
        }
      })
      return result;
    }
    return null;
  }

  departmentLeader(callback){
    let leader = [];
    let notLeader = [];
    if(this.departments.length && this.employees.length) {
      this.employees.forEach((employee) => {
        if(employee.isLeader) {
          leader.push(employee.department);
        }
        if(callback(employee)){
          notLeader.push(employee.department);
        }
      })
      if(leader.toString() === notLeader.toString()) {
        return leader;
      }
      leader.forEach((item) => {
        for(let i = 0; i < notLeader.length; i++){
          if(item === notLeader[i]){
            notLeader.splice(i, 1);
            i--;
          }
        }
      })
      for(let i = 1; i < notLeader.length; i++){
        if(notLeader[i] === notLeader[i - 1]){
          notLeader.splice(i, 1);
          i--;
        }
      }
      return notLeader;
    }
    return null;
  }
}
let restaurant = new Restaurant()

let mainBlock = document.querySelector('.mainBlock');
let cardBlock = document.createElement('div');
let buttonAddCard = document.createElement('div');
buttonAddCard.className = 'buttonAddCard';
buttonAddCard.innerText = 'add card';
cardBlock.className = 'cardBlock';
mainBlock.appendChild(cardBlock);
mainBlock.appendChild(buttonAddCard);
let changeEmployee;
let employeeCard;
let itemBlockInfo;
let employeeInfo;
let employeeProperty;
let eventTarget
let buttonDelete;
let isFlag = false;
let popupWindow = mainBlock.appendChild(document.createElement('div'));
popupWindow.className = 'popupWindow';
let backgroundWindow = popupWindow.appendChild(document.createElement('div'));
backgroundWindow.className = 'backgroundWindow';
backgroundWindow.addEventListener('click', () => {
  for(let i = 0; i < document.getElementsByClassName('inputInfo').length; i++){
    document.getElementsByClassName('inputInfo')[i].value = '';
  }
  isFlag = false;
  popupWindow.style = `display: none`;
})
let modalWindow = popupWindow.appendChild(document.createElement('div'));
modalWindow.className = 'modalWindow';
for(let props in restaurant.employees[0]) {
  if(props === 'isWorks') {
    let inputRadioBlock = document.createElement('div');
    inputRadioBlock.innerHTML = `<p>${props}</p>
    <input type="radio" id="contactChoice1" name="isWorks" value="true">
    <label for="contactChoice1">yes</label>
    <input type="radio" id="contactChoice2" name="isWorks" value="false">
    <label for="contactChoice2">no</label>`
    inputRadioBlock.className = 'inputInfo';
    modalWindow.appendChild(inputRadioBlock);
  } else {
    if(props === 'isLeader') {
      let inputRadioBlock = document.createElement('div');
      inputRadioBlock.innerHTML = `<p>${props}</p>
      <input type="radio" id="contactChoice3" name="isLeader" value="true" >
      <label for="contactChoice3">yes</label>
      <input type="radio" id="contactChoice4" name="isLeader" value="false">
      <label for="contactChoice4">no</label>`
      inputRadioBlock.className = 'inputInfo';
      modalWindow.appendChild(inputRadioBlock);
    }
    else{
      let input = document.createElement('input');
      input.type = 'text';
      input.placeholder = props;
      input.className = 'inputInfo';
      modalWindow.appendChild(input);
    }
  }
}
let buttonSave = modalWindow.appendChild(document.createElement('div'))
buttonSave.innerText = 'SAVE'
buttonSave.className = 'buttonSave'
let indexBlockEmployee

function createCard () {
  for(let i = 0; i < restaurant.employees.length; i++){
    if(!cardBlock.children[i]) {
      employeeCard = cardBlock.appendChild(document.createElement('div'));
      employeeCard.className = 'employeeCard';
      for(let item in restaurant.employees[i]) {
        itemBlockInfo = employeeCard.appendChild(document.createElement('div'));
        itemBlockInfo.className = 'itemBlockInfo';
        employeeProperty = itemBlockInfo.appendChild(document.createElement('div'));
        employeeInfo = itemBlockInfo.appendChild(document.createElement('div'));
        employeeProperty.innerText = item;
        employeeInfo.innerText = restaurant.employees[i][item];
        employeeInfo.className = item;
      }
      let buttonChange = document.createElement('div');
      buttonChange.innerText = 'change';
      changeEmployee = employeeCard.appendChild(buttonChange);
      changeEmployee.className = 'changeEmployee';
      changeEmployee.addEventListener('click', () => {
        popupWindow.style = `display: block`;
        eventTarget = event.target;
        isFlag = true;
        for(let i = 0; i < cardBlock.children.length; i++){
          if(eventTarget.parentNode === cardBlock.children[i]){
            indexBlockEmployee = i;
          }
        }
      })
      let deleteCard = document.createElement('div');
      deleteCard.innerText = 'delete';
      deleteCard.className = 'buttonDelete';
      buttonDelete = employeeCard.appendChild(deleteCard);
      buttonDelete.addEventListener('click', () => {
        let indexDeleteEmployee;
        for(let i = 0; i < cardBlock.children.length; i++){
          if(event.target.parentNode === cardBlock.children[i]){
            indexDeleteEmployee = i;
          }
        }
        restaurant.employees.splice(indexDeleteEmployee, 1);
        event.target.parentNode.remove();
      })
    }
  }
}
createCard ()

buttonAddCard.addEventListener('click', () => {
  popupWindow.style = `display: block`;
})

buttonSave.addEventListener('click', () => {
  changeCard();
})

function changeCard () {
  let elementInput = document.getElementsByClassName('inputInfo');
  if(isFlag){
    for(let i = 0; i < elementInput.length; i++) {
      if(elementInput[i].children.length){
        for(let j = 0; j < elementInput[i].children.length; j++) {
          if(elementInput[i].children[j].checked) {
            let elementInputRadio = elementInput[i].children[j].name;
            restaurant.employees[indexBlockEmployee][elementInputRadio] = Boolean(elementInput[i].children[j].value === 'true');
            eventTarget.parentElement.children[i].children[1].innerText = '' + elementInput[i].children[j].value;
          }
        }
      } else {
        if(elementInput[i].value !== '') {
          let elementInputName = elementInput[i].placeholder;
          if (elementInput[i].placeholder === 'salary' || elementInput[i].placeholder === 'department') {
            restaurant.employees[indexBlockEmployee][elementInputName] = Number(elementInput[i].value);
          } else {
            restaurant.employees[indexBlockEmployee][elementInputName] = elementInput[i].value
          }
          eventTarget.parentElement.children[i].children[1].innerText = elementInput[i].value
          elementInput[i].value = ''
        }
      }
    }
    isFlag = false;
  } else {
    let resultObject = {};
    for(let i = 0; i < elementInput.length; i++) {
      let definitelyInput = document.getElementsByClassName('inputInfo')[i];
      if(definitelyInput.children.length){
        for(let j = 0; j < definitelyInput.children.length; j++) {
          if(definitelyInput.children[j].checked) {
            resultObject[definitelyInput.children[j].name] = Boolean(definitelyInput.children[j].value === 'true');
          }
        }
      } else {
        if(elementInput[i].value !== '') {
          if (elementInput[i].placeholder === 'salary' || elementInput[i].placeholder === 'department') {
            resultObject[elementInput[i].placeholder] = Number(elementInput[i].value);
          } else {
            resultObject[elementInput[i].placeholder] = elementInput[i].value;
          }
          elementInput[i].value = '';
        }
      }
    }
    restaurant.employees.push(resultObject);
    createCard();
  }
  popupWindow.style = `display: none`;
}

let blockCalculateSalary = document.createElement('div');
mainBlock.appendChild(blockCalculateSalary);
blockCalculateSalary.className = 'sumSalary';
blockCalculateSalary.innerHTML = `
<div class="buttonSumSalary">calculate salary</div>
<div class="buttonAverageSalary">average salary</div>
<div class="buttonMinToMaxSalary">salary min and max</div>
<div class="buttonAmountEmployee">amount employee</div>
<p>is works</p>
<select class="selectIsWorks">
<option>true</option>
<option>false</option>
</select>
<p>Department</p>
<select class="selectDepartment">
<option>1</option>
<option>2</option>
<option>3</option>
</select>
<div class="resultElement"></div>
`;
document.querySelector('.buttonSumSalary').addEventListener('click', () => {
  for(let i = 0; i < document.querySelector('.resultElement').children.length; i++){
    document.querySelector('.resultElement').children[i].remove();
    i--;
  }
  let isWorksValue = Boolean (document.querySelector('.selectIsWorks').value === 'true');
  let dapartmentValue = Number (document.querySelector('.selectDepartment').value);
  let resultText = document.createElement('p');
  let result = restaurant.sumSalary((item) => item.department === dapartmentValue && item.isWorks === isWorksValue);
  for(let i in result) {
    document.querySelector('.resultElement').appendChild(resultText);
    resultText.innerText = `department ${i} - salary ${result[i]}`;
  }
})
document.querySelector('.buttonAverageSalary').addEventListener('click', () => {
  for(let i = 0; i < document.querySelector('.resultElement').children.length; i++){
    document.querySelector('.resultElement').children[i].remove();
    i--;
  }
  let isWorksValue = Boolean (document.querySelector('.selectIsWorks').value === 'true');
  let dapartmentValue = Number (document.querySelector('.selectDepartment').value);
  let resultText = document.createElement('p');
  document.querySelector('.resultElement').appendChild(resultText);
  result = restaurant.averageSalary((item) => item.department === dapartmentValue && item.isWorks === isWorksValue);
  resultText.innerText = `department ${dapartmentValue} - average salary ${result}`;
})
document.querySelector('.buttonMinToMaxSalary').addEventListener('click', () => {
  for(let i = 0; i < document.querySelector('.resultElement').children.length; i++){
    document.querySelector('.resultElement').children[i].remove();
    i--;
  }
  let isWorksValue = Boolean (document.querySelector('.selectIsWorks').value === 'true');
  let dapartmentValue = Number (document.querySelector('.selectDepartment').value);
  let result = restaurant.salaryMinToMax((item) => item.department === dapartmentValue && item.isWorks === isWorksValue);
  for(let i in result){
    for(let j in result[i]){
      let resultText = document.createElement('p');
      document.querySelector('.resultElement').appendChild(resultText);
      resultText.innerText = (` ${j}  min - ${result[i][j]['min']}, max - ${result[i][j]['max']}`);
    }
  }
})
document.querySelector('.buttonAmountEmployee').addEventListener('click', () => {
  for(let i = 0; i < document.querySelector('.resultElement').children.length; i++){
    document.querySelector('.resultElement').children[i].remove();
    i--;
  }
  let isWorksValue = Boolean (document.querySelector('.selectIsWorks').value === 'true');
  let dapartmentValue = Number (document.querySelector('.selectDepartment').value);
  let resultText = document.createElement('p');
  let result = restaurant.amountEmployee((item) => item.department === dapartmentValue && item.isWorks === isWorksValue);
  resultText.innerText = `department ${dapartmentValue}
  amount employee - ${result}`;
  document.querySelector('.resultElement').appendChild(resultText);
})


















class Bank {
  constructor(){
      this.clients = [
          {
              name: 'Ivan Ivanov',
              isActive: true,
              registration: new Date (2013, 13, 1),
              checks:[
                  {
                      name: 'Debet',
                      balance: 1000,
                      isActive: true,
                      activeData: new Date (2025, 1, 1),
                      currency: 'UAH',
                  },
                  {
                      name:'Credit',
                      balance: 1000,
                      limit: 1000,
                      isActive: true,
                      activeData: new Date (2025, 10, 1),
                      currency: 'UAH',
                  },
              ],
          },
          {
              name: 'Oleg Olegov',
              isActive: false,
              registration: new Date (2013, 13, 1),
              checks:[
                  {
                      name: 'Debet',
                      balance: 1000,
                      isActive: true,
                      activeData: new Date (2025, 13, 1),
                      currency: 'EUR',
                  },
                  {
                      name:'Credit',
                      balance: 100,
                      limit: 1000,
                      isActive: true,
                      activeData: new Date (2025, 13, 1),
                      currency: 'UAH',
                  }
              ],
          },
          {
              name: 'Roman Romanov',
              isActive: false,
              registration: new Date (2013, 13, 1),
              checks:[
                  {
                      name: 'Debet',
                      balance: 100,
                      isActive: true,
                      activeData: new Date (2025, 13, 1),
                      currency: 'UAH',
                  },
                  {
                      name:'Credit',
                      balance: 500,
                      limit: 1000,
                      isActive: true,
                      activeData: new Date (2025, 13, 1),
                      currency: 'EUR',
                  }
              ],
          }
      ]
  }

  async haveMoney(callback) {
      let response = await fetch ('https://freecurrencyapi.net/api/v2/latest?apikey=dae13160-3b0e-11ec-8361-e108ba6473f9');
      let currencies = (await response.json()).data;
      let result = 0;
      if(this.clients.length) {
          this.clients.forEach((client) => {
              if(client.checks.length) {
                  client.checks.forEach((check) => {
                      if(check.currency === callback(check)){
                          result += check.balance;
                      }
                      else {
                          result += (check.balance / currencies[check.currency]) * currencies[callback(check)];
                      }
                  })
              }
          })
          return result;
      }
      return null;
  }

  async debtMoney(callback){
      let response = await fetch ('https://freecurrencyapi.net/api/v2/latest?apikey=dae13160-3b0e-11ec-8361-e108ba6473f9');
      let {data} = await response.json();
      let result = 0;
      if(this.clients.length) {
          this.clients.forEach((client) => {
              if(client.checks.length){
                  client.checks.forEach((check) => {
                      if(check.name === 'Credit' && check.balance < check.limit){
                          if(check.currency === callback(check)){
                              result += check.limit - check.balance;
                          } else {
                              result += ((check.limit / data[check.currency]) * data[callback(check)]) - ((check.balance / data[check.currency]) * data[callback(check)]);
                          }
                      }
                  })
              }
          })
         return result;
      }
      return null;
  }

  async sumClientsDebt(callback, isActive){   // ( (i) => 'EUR', (i) => !i.isActive )
      let response = await fetch ('https://freecurrencyapi.net/api/v2/latest?apikey=dae13160-3b0e-11ec-8361-e108ba6473f9');
      let currencies = (await response.json()).data;
      let result = {};
      result.clients = 0;
      result.debt = 0;
      if(this.clients.length) {
          this.clients.forEach((client) => {
              if(isActive(client)){
                  client.checks.forEach((check) => {
                      if(check.name === 'Credit' && check.balance < check.limit){
                          if(check.currency === callback(check)){
                              result.clients++;
                              result.debt += check.limit - check.balance;
                          } else {
                              result.clients++;
                              result.debt += ((check.limit / currencies[check.currency]) * currencies[callback(check)]) - ((check.balance / currencies[check.currency]) * currencies[callback(check)]);
                          }
                      }
                  })
              }
          })
         return result;
      }
      return null;
  }
}
let bank = new Bank()
