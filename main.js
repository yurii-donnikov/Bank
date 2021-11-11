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

  async sumClientsDebt(callback, isActive){
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

let mainBlock = document.querySelector('.mainBlock');
mainBlock.innerHTML =
`<div class="cardBlock"></div>
 <div class="addCard">add card</div>
 <div class="popupWindow">
   <div class="backgroundWindow"></div>
   <div class="modalWindow">
    <input type="text" placeholder="name" data-id="name" class="name">
    <label for="isActive">Active?</label>
    <input type="radio" id="isActive" data-id="isActive" class="isActive">
    <div class="Debet">
      <p>Debet</p>
      <input type="number" placeholder="balance" class="balance" data-id="balanceDebet">
      <label for="isActiveDebet">Active card?</label>
      <input type="radio" id="isActiveDebet" class="isActive" data-id="isActiveDebet">
      <select class="currency" data-id="currencyDebet">
        <option>UAH</option>
        <option>EUR</option>
        <option>RUB</option>
        <option>PLN</option>
      </select>
    </div>
    <div class="Credit">
      <p>Credit</p>
      <input type="number" placeholder="balance" class="balance" data-id="balanceCredit">
      <input type="number" placeholder="limit" class="limit" data-id="limitCredit">
      <label for="isActiveCredit">Active card?</label>
      <input type="radio" id="isActiveCredit" class="isActive" data-id="isActiveCredit">
      <select class="currency" data-id="currencyCredit">
        <option>UAH</option>
        <option>EUR</option>
        <option>RUB</option>
        <option>PLN</option>
      </select>
    </div>
    <div class="buttonSave">save</div>
</div>`;
document.querySelector('.backgroundWindow').addEventListener('click', () => {
  document.querySelector('.popupWindow').style = 'display: none';
})
document.querySelector('.buttonSave').addEventListener('click', () => {
    changeCard();
})
document.querySelector('.addCard').addEventListener('click', () => {
    isFlag = true;
    document.querySelector('.popupWindow').style = 'display: block';
})
let clientCard;
let blockProperty;
let isFlag = false;
let indexActiveCard;

function createCard(){
    for(let i = 0; i < bank.clients.length; i++){
        if(!document.querySelector('.cardBlock').children[i]){
            clientCard = document.querySelector('.cardBlock').appendChild(document.createElement('div'));
            clientCard.className = 'clientCard';
            clientCard.setAttribute('data-id', i);
                for(let property in bank.clients[i]){
                    if(property === 'checks'){
                        createCheck(bank.clients[i][property]);
                    } else {
                        blockProperty = clientCard.appendChild(document.createElement('div'));
                        blockProperty.className = 'blockProperty';
                        blockProperty.innerHTML =
                        `<span class="property">${property}</span>
                         <span class="${property}">${bank.clients[i][property]}</span>`;
                    }
                }
            function createCheck(clientChecks){
                for(let i = 0; i < clientChecks.length; i++){
                    blockCheck = clientCard.appendChild(document.createElement('div'));
                    blockCheck.className = "blockCheck";
                    for(let item in clientChecks[i]){
                        blockProperty = blockCheck.appendChild(document.createElement('div'));
                        blockProperty.innerHTML =
                        `<span class="checkProperty">${item}</span>
                         <span class="${item}${clientChecks[i]['name']}">${clientChecks[i][item]}</span>`;
                    }
                }
            }
            buttonChange = clientCard.appendChild(document.createElement('div'));
            buttonChange.innerText = 'Change';
            buttonChange.className = 'buttonChange';
            buttonChange.addEventListener('click', () => {
                indexActiveCard = event.target.parentNode.getAttribute('data-id');
                document.querySelector('.popupWindow').style = 'display: block';
            })
            buttonDelete = clientCard.appendChild(document.createElement('div'));
            buttonDelete.innerText = 'Delete';
            buttonDelete.className = 'buttonDelete';
            buttonDelete.addEventListener('click', () => {
                event.target.parentNode.remove();
                bank.clients.splice(event.target.parentNode.getAttribute('data-id'), 1);
                overwriteAttribute();
            })
        }
    }
}
createCard()

function overwriteAttribute () {
    for(let i = 0; i < document.querySelector('.cardBlock').children.length; i++){
        document.querySelector('.cardBlock').children[i].setAttribute('data-id', i);
    }
}

let newClient = {checks: [],};
let indexObject = 0;

function changeCard() {
    let childrenPopup = document.querySelector('.modalWindow').children;
        for(let i = 0; i < childrenPopup.length; i++) {
            if(childrenPopup[i].className === 'Debet' || childrenPopup[i].className === 'Credit'){
                if(isFlag){
                    newClient.checks[indexObject] = {};
                    newClient.checks[indexObject]['name'] = childrenPopup[i].className;
                    newClient.checks[indexObject]['registration'] = new Date();
                    updateCheck(childrenPopup[i]);
                    indexObject++;
                } else {
                    updateCheck(childrenPopup[i]);
                }
            } else {
                if(childrenPopup[i].type === 'radio'){
                    let name = childrenPopup[i].className;
                    if(isFlag){
                        newClient[name] = childrenPopup[i].checked;
                    } 
                    else {
                        bank.clients[indexActiveCard][name] = childrenPopup[i].checked;
                        document.getElementsByClassName(childrenPopup[i].getAttribute('data-id'))[indexActiveCard].innerText = childrenPopup[i].checked;
                    }
                    childrenPopup[i].checked = false;
                } else {
                    if(childrenPopup[i].value) {
                        let name = childrenPopup[i].className;
                        if(isFlag){
                            newClient[name] = childrenPopup[i].value;
                            newClient['registration'] = new Date();
                        } else{
                            bank.clients[indexActiveCard][name] = childrenPopup[i].value;
                            document.getElementsByClassName(childrenPopup[i].getAttribute('data-id'))[indexActiveCard].innerText = childrenPopup[i].value;
                        }
                        childrenPopup[i].value = '';
                    }
                }
            }
        }
    
    function updateCheck(itemСheck){
        if(isFlag){
            for(let i = 0; i < itemСheck.children.length; i++){
                if(itemСheck.children[i].type === 'radio'){
                    let name = itemСheck.children[i].className;
                    newClient.checks[indexObject][name] = itemСheck.children[i].checked;
                    itemСheck.children[i].checked = false;
                } 
                else {
                    if(itemСheck.children[i].value) {
                        if(itemСheck.children[i].valueAsNumber) {
                            let name = itemСheck.children[i].className;
                            newClient.checks[indexObject][name] = itemСheck.children[i].valueAsNumber;
                            itemСheck.children[i].valueAsNumber = undefined;
                        } else {
                            let name = itemСheck.children[i].className;
                            newClient.checks[indexObject][name] = itemСheck.children[i].value;
                        }
                    }
                }
            } 
        } else {
            for(let i = 0; i < bank.clients[indexActiveCard].checks.length; i++){
                if(bank.clients[indexActiveCard].checks[i].name === itemСheck.className){
                    for(let j = 0; j < itemСheck.children.length; j++) {
                        if(itemСheck.children[j].type === 'radio'){
                            let nameClass = itemСheck.children[j].className;
                            bank.clients[indexActiveCard].checks[i][nameClass] = itemСheck.children[j].checked;
                            document.getElementsByClassName(itemСheck.children[j].getAttribute('data-id'))[indexActiveCard].innerText = 
                            itemСheck.children[j].checked;
                            itemСheck.children[j].checked = false;
                        } else {
                            if(itemСheck.children[j].value) {
                                if(itemСheck.children[j].valueAsNumber) {
                                    let nameClass = itemСheck.children[j].className;
                                    bank.clients[indexActiveCard].checks[i][nameClass] = itemСheck.children[j].valueAsNumber;
                                    document.getElementsByClassName(itemСheck.children[j].getAttribute('data-id'))[indexActiveCard].innerText = 
                                    itemСheck.children[j].valueAsNumber;
                                    itemСheck.children[j].valueAsNumber = undefined;
                                } else {
                                    let nameClass = itemСheck.children[j].className;
                                    bank.clients[indexActiveCard].checks[i][nameClass] = itemСheck.children[j].value;
                                    document.getElementsByClassName(itemСheck.children[j].getAttribute('data-id'))[indexActiveCard].innerText = 
                                    itemСheck.children[j].value;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if(isFlag) {
        bank.clients.push(newClient);
        isFlag = false;
        newClient = {checks: [],};
        indexObject = 0;
        createCard();
    }
    document.querySelector('.popupWindow').style = 'display: none';
}
