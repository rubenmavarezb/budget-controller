//Creating DOM structure

//Dom manipulator function
const sE = (elem) => document.querySelector(elem);

//The elements of the HTML in one object, just for keeping all in order and to practice
const DOM = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    addButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
}

//My own forEach function for querySelectorAll
const nodeEach = function(list, callback){
    for (let i = 0; i < list.length; i++) {
        callback(list[i],  i)
    }
}

///////////////////////////////////////////////////

//IIFE

//Budget controller
let budgetController = (() => {

    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1
        }
        
        calcPercentage = (totalIncome) => {
            (totalIncome > 0) ? this.percentage = Math.round((this.value/totalIncome) * 100) : this.percentage = -1;
        }
        getPercentage = () => this.percentage
    }

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }

    let calculateTotal = function (type){
        let sum = 0;
        data.allItems[type].forEach(item =>{
            sum += item.value;
        })
        data.totals[type] = sum;
      }

    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }
    return {
        addItem: function(type, des, val){
            let newItem, ID;

            //Create new ID
            (data.allItems[type].length > 0) ? ID = data.allItems[type][data.allItems[type].length - 1].id + 1 : ID = 0;

            //Creating new item
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            //Pushing into data structure
            data.allItems[type].push(newItem);

            //return it new element
            return newItem;
        },
        deleteItem: function(type, id){
            let ids, index

            ids = data.allItems[type].map(item => {
                return item.id;
            })
            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function(){
            //Calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //Calculate the percentage we spent
            (data.totals.inc > 0) ? data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100) : data.percentage = -1;
        },
        calculatePercentages: function() { 
            data.allItems.exp.forEach(ex => {
                ex.calcPercentage(data.totals.inc);
            })
         },
         getPercentages: function(){
            let allPerc = data.allItems.exp.map(ex => {
                return ex.getPercentage()
            })
            return allPerc
         },
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                perc: data.percentage
            }
        },
        testing: () => console.log(data)
    }
})();

//UI controller
let UIController = (() => {
    const formatNumber = function(n, type){
        let numSplit, int, dec;

        n = Math.abs(n);
        n = n.toFixed(2);

        numSplit = n.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        (int.length > 3) ? int = `${int.substr(0, int.length - 3)},${int.substr(int.length - 3, 3)}` : console.log('Error');

        return `${type === 'exp' ? '-' : '+'} ${int}.${dec}`;
    }
    return {
        getInput: function(){
            return{
                type: sE(DOM.inputType).value,
                description: sE(DOM.inputDescription).value,
                val: parseFloat(sE(DOM.inputValue).value) 
            }
        },
        addListItem: function(obj, type){
            let html, elem;

            if(type === 'exp'){
                elem = DOM.expensesContainer;

                html = `<div class="item clearfix" id="exp-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(obj.value, type)}</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`
            } else if(type === 'inc'){
                elem = DOM.incomeContainer;

                html = `<div class="item clearfix" id="inc-${obj.id}">
                            <div class="item__description">${obj.description}</div>
                            <div class="right clearfix">
                                <div class="item__value">${formatNumber(obj.value, type)}</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`
            }

            sE(elem).insertAdjacentHTML('beforeend', html);
        },
        deleteListItem: function(selectorID){
            let elem = sE(selectorID);
            elem.remove();
        },
        clearFields: function(){
            let fields, fieldsArr;

            fields = document.querySelectorAll(`${DOM.inputDescription}, ${DOM.inputValue}`);

            fieldsArr = Array.from(fields);

            fieldsArr.forEach((elem, i, arr) => {
                elem.value = "";
            });
            
            fieldsArr[0].focus();
        },
        displayBudget: function(obj){
            let type;

            (obj.budget > 0) ? type = 'inc' : type = 'exp';

            sE(DOM.budgetLabel).textContent = formatNumber(obj.budget, type);
            sE(DOM.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            sE(DOM.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            (obj.perc > 0) ? sE(DOM.percentageLabel).textContent = `${obj.perc}%` : sE(DOM.percentageLabel).textContent = '----';
        },
        displayPercentages: function(percentages){
            let fields = document.querySelectorAll(DOM.expPercLabel);

            nodeEach(fields, function(item, index){
                (percentages[index] > 0) ? item.textContent = `${percentages[index]}%` : item.textContent = '----'
            })
        },
        displayMonth: function(){
            let now, year, month

            const MONTHS = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]

            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            sE(DOM.dateLabel).textContent = `${MONTHS[month]}, ${year}`;
        },
        changeType: function(){
            let fields = document.querySelectorAll(`${DOM.inputType},${DOM.inputDescription},${DOM.inputValue}`);

            nodeEach(fields, function (item) { 
                (sE(DOM.inputType).value === 'exp') ? item.classList.add('red-focus') : item.classList.remove('red-focus')
             })

             sE(DOM.addButton).classList.toggle('red')
        }
    }
})();

//Global app controller
let controller = ((budgtCtrll, UICtrll) => {

    let setupEventListeners = function(){
        sE(DOM.addButton).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(e){
            if(e.key == 'Enter'){
                ctrlAddItem();
            }
        })

        sE(DOM.container).addEventListener('click', ctrlDeleteItem);

        sE(DOM.inputType).addEventListener('change', UICtrll.changeType)
    }

    let updateBudget = function(){
        //Calculate the budget
        budgtCtrll.calculateBudget();
        //Return the budget
        let budget = budgtCtrll.getBudget();
        //Display the budget
        UICtrll.displayBudget(budget)
    }
    let updatePercentages = function(){

        //Calculate percetages
        budgtCtrll.calculatePercentages();

        //Read ir from budget controller
        let percent = budgtCtrll.getPercentages();

        //update de UI
        UICtrll.displayPercentages(percent);

    }
    let ctrlAddItem = function(){
        let input, newItem

        //Get the field input data

        input = UICtrll.getInput();

        if (input.description !== "" && !isNaN(input.val) && input.val > 0){

            //Add the item to the budget controller
            newItem = budgtCtrll.addItem(input.type, input.description, input.val);

            //Add the item to the UI
            UICtrll.addListItem(newItem, input.type);

            //Clear the fields
            UICtrll.clearFields();

            //Calculate and update budget
            updateBudget();

            //Calculate and update the percentages
            updatePercentages();
        }
    }
    let ctrlDeleteItem = function (e) {
        let itemID, splitID, type, ID;

        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgtCtrll.deleteItem(type, ID);
            
            UICtrll.deleteListItem(`#${itemID}`);

            updateBudget();
            updatePercentages();
        }
      }

    return {
        init: function(){
            UICtrll.displayMonth();
            UICtrll.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                perc: -1
            });
            setupEventListeners();
        }
    }
})(budgetController, UIController);

controller.init();


/////////////////////////////////////////////////////////////////
