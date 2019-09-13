// Storage Controler


//Item controller
const ItemCtrl = (function(){
    //Item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / state
    const data = {
        items: [
            // {id: 0, name: 'Steak', calories: 1200},
            // {id: 1, name: 'Egg', calories: 100},
            // {id: 2, name: 'Pasta', calories: 200},
        ],
        currentItem: null,
        totalCalories: 0
    }
    
    //Public methods
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            } else{
                ID = 0;
            }

            //cal to num
            calories = parseInt(calories);
            
            // create new item

            newItem = new Item(ID, name, calories);

            //add to items array
            data.items.push(newItem);
            
            return newItem;
        },

        getItemById: function(id){
            let found = null;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            })
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total+= item.calories;
            });

            data.totalCalories = total;

            return data.totalCalories
        },
        logData: function(){
            return data;
        }
    }
})();


 
//UI controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addbtn: '.add-btn',
        updatebtn: '.update-btn',
        deletebtn: '.delete-btn',
        backbtn: '.back-btn',
        itemName: '#item-name',
        itemCal: '#item-calories',
        totalCal: '.total-calories'
    }
    return{
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`;
            });

            //Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name:document.querySelector(UISelectors.itemName).value,
                calories:document.querySelector(UISelectors.itemCal).value
            }
        },
        addListitem: function(item){
            //show list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            // add class
            li.className = 'collection-item';
            //Add ID
            li.id = `item-${item.id}`;
            //add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            //insert item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCal).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCal).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(total){

            document.querySelector(UISelectors.totalCal).textContent = total;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updatebtn).style.display = 'none';
            document.querySelector(UISelectors.deletebtn).style.display = 'none';
            document.querySelector(UISelectors.backbtn).style.display = 'none';
            document.querySelector(UISelectors.addbtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updatebtn).style.display = 'inline';
            document.querySelector(UISelectors.deletebtn).style.display = 'inline';
            document.querySelector(UISelectors.backbtn).style.display = 'inline';
            document.querySelector(UISelectors.addbtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
    
})();



// App controller
const App = (function(ItemCtrl, UICtrl){

    //Load event listeners
    const loadEventListeners = function(){
        //Get UISelectors
        const UISelectors = UICtrl.getSelectors();
        // Add Item event
        document.querySelector(UISelectors.addbtn).addEventListener('click', itemAddSubmit);

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
    };

    //add item submit
    const itemAddSubmit = function(e){
        //Get form input form UICtrl
        const input = UICtrl.getItemInput();

        //check for input
        if(input.name !== '' && input.calories !== ''){
            // add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            // add item to UI list
            UICtrl.addListitem(newItem);

            // Get total cal
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total cal to UI
            UICtrl.showTotalCalories(totalCalories);

            //clear fields
            UICtrl.clearInput();

        }

        e.preventDefault();
    }

    //update item submit
    const itemEditClick= function(e){
        if(e.target.classList.contains('edit-item')){
            //get list item id
            const listId = e.target.parentNode.parentNode.id;
            //break into array
            const listIdArr = listId.split('-');
            
            const id = parseInt(listIdArr[1]);

            //get item
            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }

    //Public methods
    return {
        init: function(){
            //clear edit sate / set initial set
            UICtrl.clearEditState();


            //Get items form data structure
            const items = ItemCtrl.getItems();

            //check if any items

            if(items.length === 0 ) {

                UICtrl.hideList();

            } else {
                //Populate Items
                UICtrl.populateItemList(items);                
            }

            // Get total cal
            const totalCalories = ItemCtrl.getTotalCalories();

            //add total cal to UI
            UICtrl.showTotalCalories(totalCalories);

            //Load event listeners
            loadEventListeners();

        }
    }

})(ItemCtrl, UICtrl);

App.init();
