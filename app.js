// Storage Controler
const StorageCtrl = (function(){

    return{
        storeItem: function(item){

            let items;
            //check items in ls
            if (localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem(items));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));

            }


        },
        getItemsFromStoradge: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updated){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updated.id === item.id){
                    items.splice(index, 1, updated);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach(function(item, index){
              if(id === item.id){
                items.splice(index, 1);
              }
            });
            localStorage.setItem('items', JSON.stringify(items));
          },
          clearItemsFromStorage: function(){
            localStorage.removeItem('items');
          }
    }

})();


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
        items: StorageCtrl.getItemsFromStoradge(),
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
        updateItem: function(name, calories){
            // cal to num
            calories = parseInt(calories);

            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },  
        deleteItem: function(id){

            const ids = data.items.map(function(item){
                return item.id;
            });

            //get index

            const index = ids.indexOf(id);
            // remove item
            data.items.splice(index, 1);

        },
        clearAllItemsListed: function(){
            data.items = [];
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
        clearbtn: '.clear-btn',
        updatebtn: '.update-btn',
        deletebtn: '.delete-btn',
        backbtn: '.back-btn',
        itemName: '#item-name',
        itemCal: '#item-calories',
        totalCal: '.total-calories',
        listItems: '#item-list li'
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
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //node list to arrau
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            })
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
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
        removeAllItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
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
const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    //Load event listeners
    const loadEventListeners = function(){
        //Get UISelectors
        const UISelectors = UICtrl.getSelectors();
        // Add Item event
        document.querySelector(UISelectors.addbtn).addEventListener('click', itemAddSubmit);

        //disable submit after enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //update item event
        document.querySelector(UISelectors.updatebtn).addEventListener('click', itemUpdateSubmit);

        //delete item evenet
        document.querySelector(UISelectors.deletebtn).addEventListener('click', itemDeleteSubmit);

        //back button event
        document.querySelector(UISelectors.backbtn).addEventListener('click', UICtrl.clearEditState)

        //clear all btn event   
        document.querySelector(UISelectors.clearbtn).addEventListener('click',clearAllItems)
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

            //Store in LS
            StoreageCtrl.storeItem(newItem);

            //clear fields
            UICtrl.clearInput();

        }

        e.preventDefault();
    };

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
    };

    //update item submit
    const itemUpdateSubmit = function(e){

        //get item input
        const input = UICtrl.getItemInput();

        const updated = ItemCtrl.updateItem(input.name, input.calories);

        //update ui
        UICtrl.updateListItem(updated);

        const totalCalories = ItemCtrl.getTotalCalories();

        //add total cal to UI
        UICtrl.showTotalCalories(totalCalories);

        //Update Local storage
        StoreageCtrl.updateItemStorage(updated);


        UICtrl.clearEditState();

        e.preventDefault();
    };

   
    //del button event

    const itemDeleteSubmit = function(e){

        //get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //del from data struct
        ItemCtrl.deleteItem(currentItem.id);

        //delete from ui
        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();

        //add total cal to UI
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();


        e.preventDefault();
    };


    const clearAllItems = function(){
        //remove items from data structure
        ItemCtrl.clearAllItemsListed();

        const totalCalories = ItemCtrl.getTotalCalories();

        //add total cal to UI
        UICtrl.showTotalCalories(totalCalories);

        //remove items from UI
        UICtrl.removeAllItems();

        StorageCtrl.clearItemsFromStorage();

        //hide ul
        UICtrl.hideList();

    };

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

})(ItemCtrl,StorageCtrl, UICtrl);

App.init();
