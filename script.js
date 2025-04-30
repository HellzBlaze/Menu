document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const menuData = [ // Keep the menu data with descriptions and stock
        { id: 'm1', name: 'Paneer Butter Masala', price: 280.00, description: 'Creamy tomato gravy with soft paneer cubes.', stock: 15 },
        { id: 'm2', name: 'Chicken Tikka Masala', price: 350.00, description: 'Grilled chicken chunks in a spiced curry sauce.', stock: 20 },
        { id: 'm3', name: 'Dal Makhani', price: 220.50, description: 'Rich, slow-cooked black lentils with butter and cream.', stock: 18 },
        { id: 'm4', name: 'Vegetable Biryani', price: 250.00, description: 'Aromatic basmati rice cooked with mixed vegetables and spices.', stock: 12 },
        { id: 'm5', name: 'Masala Dosa', price: 150.75, description: 'Crispy rice crepe filled with spiced potato mixture, served with sambar.', stock: 30 },
        { id: 'm6', name: 'Tandoori Roti', price: 30.00, description: 'Whole wheat bread baked in a traditional clay tandoor.', stock: 50 },
        { id: 'm7', name: 'Garlic Naan', price: 55.00, description: 'Soft leavened bread topped with garlic and butter, baked in tandoor.', stock: 45 },
        { id: 'm8', name: 'Jeera Rice', price: 120.00, description: 'Basmati rice tempered with cumin seeds and ghee.', stock: 25 },
        { id: 'm9', name: 'Chole Bhature', price: 180.00, description: 'Spicy chickpea curry served with fluffy deep-fried bread.', stock: 10 },
        { id: 'm10', name: 'Palak Paneer', price: 260.00, description: 'Indian cottage cheese in a smooth spinach gravy.', stock: 14 },
        { id: 'm11', name: 'Mutton Rogan Josh', price: 420.00, description: 'Tender mutton cooked in a flavourful Kashmiri red chili gravy.', stock: 8 },
        { id: 'm12', name: 'Fish Curry', price: 380.00, description: 'Tangy and spicy fish curry, varies by regional style.', stock: 9 },
        { id: 'm13', name: 'Samosa (2 pcs)', price: 60.00, description: 'Crispy pastry filled with spiced potatoes and peas.', stock: 40 },
        { id: 'm14', name: 'Gulab Jamun (2 pcs)', price: 70.00, description: 'Deep-fried milk solids dumplings soaked in sugar syrup.', stock: 22 },
        { id: 'm15', name: 'Ras Malai (2 pcs)', price: 90.00, description: 'Soft paneer discs soaked in sweetened, thickened milk.', stock: 16 },
        { id: 'm16', name: 'Fresh Lime Soda', price: 75.00, description: 'Refreshing drink with lime juice, soda, sugar/salt options.', stock: 35 },
        { id: 'm17', name: 'Mango Lassi', price: 110.00, description: 'Cooling yogurt-based drink blended with sweet mango pulp.', stock: 28 },
        { id: 'm18', name: 'Mixed Veg Raita', price: 95.00, description: 'Yogurt mixed with chopped vegetables and mild spices.', stock: 11 },
        { id: 'm19', name: 'Green Salad', price: 130.00, description: 'Assortment of fresh garden vegetables like cucumber, tomato, onion.', stock: 19 },
        { id: 'm20', name: 'Mineral Water Bottle', price: 40.00, description: 'Standard packaged drinking water (500ml/1L).', stock: 60 },
    ];

    const ORDERS_STORAGE_KEY = 'restaurantOrdersINR_v3';
    const STOCK_STORAGE_KEY = 'restaurantStockINR';
    const USER_NAME_KEY = 'restaurantUserName';
    const USER_ROLE_KEY = 'restaurantUserRole';
    const CURRENCY_SYMBOL = '₹';
    const EMPLOYEE_ACCESS_CODE = '2724';

    // --- Status Definitions ---
    const PREPARATION_STATUSES = ['Pending', 'In Progress', 'Ready'];
    const PAYMENT_STATUSES = ['Pending', 'Paid'];

    // --- State ---
    let currentCart = {};
    let allOrders = loadOrders();
    let currentUserName = sessionStorage.getItem(USER_NAME_KEY);
    let currentUserRole = sessionStorage.getItem(USER_ROLE_KEY);
    let notificationTimeoutId = null;
    let currentStockLevels = loadStock(); // Load stock on startup

    // --- DOM Elements ---
    // (Keep all existing DOM element references)
    const loginView = document.getElementById('login-view');
    const nameInput = document.getElementById('name');
    const loginButton = document.getElementById('login-btn');
    const loginErrorP = document.getElementById('login-error');
    const roleCustomerRadio = document.getElementById('role-customer');
    const appContainer = document.getElementById('app-container');
    const userInfoDiv = document.getElementById('user-info');
    const loggedInUserNameSpan = document.getElementById('logged-in-user-name');
    const loggedInUserRoleSpan = document.getElementById('logged-in-user-role');
    const logoutButton = document.getElementById('logout-btn');
    const customerView = document.getElementById('customer-view');
    const menuItemsUl = document.getElementById('menu-items');
    const cartItemsUl = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');
    const submitOrderBtn = document.getElementById('submit-order-btn');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const orderConfirmationP = document.getElementById('order-confirmation');
    const employeeView = document.getElementById('employee-view');
    const incomingOrdersDiv = document.getElementById('incoming-orders');
    const clearAllOrdersBtn = document.getElementById('clear-all-orders-btn');
    const notificationArea = document.getElementById('item-added-notification');

    // *** NEW: Inventory Management DOM Elements ***
    const inventoryItemsListUl = document.getElementById('inventory-items-list');
    const saveStockButton = document.getElementById('save-stock-btn');
    const resetStockButton = document.getElementById('reset-stock-btn');


    // --- Functions ---

    // Load orders from Local Storage (Remains the same)
    function loadOrders() {
        const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        try { const orders = storedOrders ? JSON.parse(storedOrders) : []; return orders.map(order => { if (typeof order.preparationStatus === 'undefined') order.preparationStatus = 'Pending'; if (typeof order.paymentStatus === 'undefined') order.paymentStatus = 'Pending'; order.id = (typeof order.id === 'string' && order.id.startsWith('ORD-')) ? 0 : parseInt(order.id, 10) || 0; return order; }).filter(order => order.id >= 0); } catch (e) { console.error("Error loading orders:", e); return []; }
    }
    // Save orders to Local Storage (Remains the same)
    function saveOrders() { localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders)); }
    // Load Stock from Local Storage (Remains the same, uses initial stock from menuData as fallback)
    function loadStock() {
        const storedStock = localStorage.getItem(STOCK_STORAGE_KEY);
        try {
            if (storedStock) {
                const stock = JSON.parse(storedStock);
                 const validStock = {};
                 menuData.forEach(item => { validStock[item.id] = (typeof stock[item.id] === 'number' && stock[item.id] >= 0) ? stock[item.id] : item.stock; });
                 return validStock;
            } else {
                const initialStock = {}; menuData.forEach(item => { initialStock[item.id] = item.stock; }); return initialStock;
            }
        } catch (e) { console.error("Error loading stock:", e); const initialStock = {}; menuData.forEach(item => { initialStock[item.id] = item.stock; }); return initialStock; }
    }
    // Save Stock to Local Storage (Remains the same)
    function saveStock() { localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(currentStockLevels)); }

     // Reset Stock to initial menuData levels (Remains the same)
     function resetStock() {
         if (confirm("Are you sure you want to reset ALL stock levels to initial values?")) {
             currentStockLevels = {}; // Clear current state
             menuData.forEach(item => { currentStockLevels[item.id] = item.stock; }); // Populate from initial data
             saveStock(); // Save the reset stock

             // Update displays that show stock
             displayMenu(); // Updates customer view (availability) and employee menu view (stock number)
             displayInventoryForEmployee(); // Updates the inventory list in the employee view
             displayCart(); // Check cart against reset stock (optional but safer)

             console.log("Stock levels reset.");
         }
     }


    // Find item details by ID (Remains the same)
    function getItemById(itemId) { return menuData.find(item => item.id === itemId); }
    // Format currency (Remains the same)
    function formatCurrency(amount) { return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`; }
    // Format Order ID to 3 digits (Remains the same)
    function formatOrderId(numericId) { return String(numericId).padStart(3, '0'); }
    // Get the next sequential order ID (Remains the same, relies on loadOrders)
    function getNextOrderId() {
        if (allOrders.length === 0) return 1;
        const ordersFromStorage = loadOrders();
        const maxId = ordersFromStorage.reduce((max, order) => { const currentId = Number(order.id); return currentId > max ? currentId : max; }, 0);
        return maxId + 1;
    }

    // Update the quantity displayed on the menu item (Remains the same)
    function updateMenuQuantityDisplay(itemId, newQuantity) {
        const listItem = menuItemsUl?.querySelector(`li .item-quantity-control[data-item-id="${itemId}"]`)?.closest('li');
        if (!listItem) return;
        const qtySpan = listItem.querySelector('.current-qty');
        if (qtySpan) {
             qtySpan.textContent = newQuantity;
             if (newQuantity > 0) { qtySpan.classList.add('in-cart'); } else { qtySpan.classList.remove('in-cart'); }
        }
        const increaseBtn = listItem.querySelector('.increase-qty');
        const decreaseBtn = listItem.querySelector('.decrease-qty');
        const item = getItemById(itemId);
        const currentStock = currentStockLevels[itemId] || 0;
        if (increaseBtn && item) { increaseBtn.disabled = (newQuantity >= currentStock); }
        if (decreaseBtn) { decreaseBtn.disabled = (newQuantity <= 0); }
    }

    // Handle adding one item from the menu (Remains the same)
    function addItemFromMenu(itemId) {
        const item = getItemById(itemId); if (!item) { console.error(`Unknown item ID: ${itemId}`); showNotification("Error: Item not found.", 'danger'); return; }
        const currentStock = currentStockLevels[itemId] || 0;
        const currentQuantityInCart = currentCart[itemId] || 0;
        if (currentQuantityInCart + 1 > currentStock) { showNotification(`Cannot add more ${item.name}. Out of stock.`, 'warning'); return; }
        currentCart[itemId] = currentQuantityInCart + 1;
        displayCart(); updateMenuQuantityDisplay(itemId, currentCart[itemId]); hideOrderConfirmation(); showNotification(`${item.name} added to order!`, 'success');
    }

    // Handle removing one item from the menu control (Remains the same)
    function removeItemFromMenu(itemId) {
        const currentQuantityInCart = currentCart[itemId] || 0;
        if (currentQuantityInCart > 0) {
             currentCart[itemId]--;
             if (currentCart[itemId] === 0) { delete currentCart[itemId]; }
             displayCart(); updateMenuQuantityDisplay(itemId, currentCart[itemId] || 0); hideOrderConfirmation();
        }
    }

    // Display Menu Items - MODIFIED slightly for employee stock display logic
    function displayMenu() {
        if (!menuItemsUl) return;
        menuItemsUl.innerHTML = '';
        menuData.forEach(item => {
            const li = document.createElement('li'); const itemId = item.id;
            const currentStock = currentStockLevels[itemId] || 0;
            const quantityInCart = currentCart[itemId] || 0; // Needed for customer view quantity control

            if (currentStock <= 0 && currentUserRole === 'customer') {
                li.classList.add('out-of-stock');
            }

            const itemDetailsDiv = document.createElement('div');
            itemDetailsDiv.classList.add('menu-item-details');
            itemDetailsDiv.innerHTML = `<span class="item-name">${item.name}</span>${item.description ? `<p class="item-description">${item.description}</p>` : ''}`;

            const itemActionDiv = document.createElement('div');
            itemActionDiv.classList.add('menu-item-action');

            if (currentUserRole === 'customer') {
                 itemActionDiv.innerHTML = `
                    <span class="item-price">${formatCurrency(item.price)}</span>
                    ${currentStock > 0 ?
                        `<div class="item-quantity-control" data-item-id="${itemId}">
                            <button class="decrease-qty">-</button>
                            <span class="current-qty">${quantityInCart}</span>
                            <button class="increase-qty">+</button>
                         </div>` :
                        `<span class="out-of-stock-message">Out of Stock</span>`
                    }
                 `;
                 const decreaseButton = itemActionDiv.querySelector('.decrease-qty');
                 const increaseButton = itemActionDiv.querySelector('.increase-qty');
                 if (decreaseButton) {
                     decreaseButton.addEventListener('click', () => removeItemFromMenu(itemId));
                     decreaseButton.disabled = (quantityInCart <= 0);
                 }
                 if (increaseButton) {
                     increaseButton.addEventListener('click', () => addItemFromMenu(itemId));
                     increaseButton.disabled = (quantityInCart >= currentStock);
                 }

            } else if (currentUserRole === 'employee') {
                // Employee view: Show price and stock level
                itemActionDiv.innerHTML = `
                    <span class="item-price">${formatCurrency(item.price)}</span>
                    <span class="item-stock">Stock: ${currentStock}</span>
                `;
            }

            li.appendChild(itemDetailsDiv); li.appendChild(itemActionDiv); menuItemsUl.appendChild(li);
        });
    }

    // removeFromCart (Remains the same, updates cart and menu item quantity)
    function removeFromCart(itemId) {
        if (currentCart[itemId] > 0) {
             currentCart[itemId]--;
             if (currentCart[itemId] === 0) { delete currentCart[itemId]; }
             displayCart();
             updateMenuQuantityDisplay(itemId, currentCart[itemId] || 0);
        }
    }
    // displayCart (Remains the same, updates only cart summary)
    function displayCart() {
        cartItemsUl.innerHTML = ''; let total = 0; let itemCount = 0;
        Object.entries(currentCart).forEach(([itemId, quantity]) => {
            if (quantity > 0) {
                itemCount++; const item = getItemById(itemId);
                if (item) {
                    const itemTotal = item.price * quantity; const li = document.createElement('li');
                    li.innerHTML = `<div class="cart-item-details"><span class="cart-item-quantity">${quantity}x</span><span class="item-name">${item.name}</span></div><div><span class="item-price">${formatCurrency(itemTotal)}</span><button class="remove-item-btn" data-item-id="${itemId}">-</button></div>`;
                    li.querySelector('.remove-item-btn').addEventListener('click', () => removeFromCart(itemId)); cartItemsUl.appendChild(li); total += itemTotal;
                } else { console.warn(`Item ${itemId} not found.`); delete currentCart[itemId]; }
            }
        });
        emptyCartMessage.style.display = (itemCount === 0) ? 'flex' : 'none'; cartTotalSpan.textContent = total.toFixed(2); submitOrderBtn.disabled = itemCount === 0;
    }

    // submitOrder (Remains the same, updates stock and then refreshes displays)
    function submitOrder() {
        if (Object.keys(currentCart).length === 0) return;
        const orderItems = Object.entries(currentCart).map(([itemId, quantity]) => { const item = getItemById(itemId); if (!item) { console.error(`Item ${itemId} not found.`); return null; } return { id: itemId, name: item.name, quantity: quantity, price: item.price }; }).filter(item => item !== null);
        if (orderItems.length === 0) { alert("Error: Could not find items in cart."); displayCart(); return; }
        let stockError = false; const latestStock = loadStock(); orderItems.forEach(item => { const currentStock = latestStock[item.id] || 0; if (item.quantity > currentStock) { console.error(`Stock Error: Ordered ${item.quantity} of ${item.name}, only ${currentStock} avail.`); stockError = true; } });
        if(stockError) { alert("Cannot submit order. Some items are now out of stock. Please review your cart."); currentCart = {}; displayCart(); displayMenu(); return; }

        const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const nextOrderId = getNextOrderId();
        const newOrder = { id: nextOrderId, timestamp: new Date().toISOString(), customerName: currentUserName || 'Walk-in Customer', items: orderItems, total: orderTotal, preparationStatus: 'Pending', paymentStatus: 'Pending' };

        orderItems.forEach(item => { currentStockLevels[item.id] = Math.max(0, (currentStockLevels[item.id] || 0) - item.quantity); });
        saveStock();

        allOrders.push(newOrder); saveOrders(); displayOrders();
        displayMenu(); // Update menu availability and employee stock counts
        // Note: displayInventoryForEmployee will be updated via storage event in other tabs

        currentCart = {}; displayCart(); showOrderConfirmation(`Order #${formatOrderId(newOrder.id)} submitted successfully!`); hideNotification();
    }

    // showOrderConfirmation (Remains the same)
    function showOrderConfirmation(message) { orderConfirmationP.textContent = message; orderConfirmationP.style.display = 'block'; setTimeout(hideOrderConfirmation, 4000); }
    // hideOrderConfirmation (Remains the same)
    function hideOrderConfirmation() { orderConfirmationP.style.display = 'none'; }

    // showNotification (Remains the same, includes type)
    function showNotification(message, type = 'info') {
        if (notificationTimeoutId) { clearTimeout(notificationTimeoutId); }
        notificationArea.textContent = message; notificationArea.className = 'notification'; notificationArea.classList.add(type); notificationArea.classList.add('show');
        notificationTimeoutId = setTimeout(() => { hideNotification(); }, 2500);
    }
    // hideNotification (Remains the same, clears type)
    function hideNotification() {
        notificationArea.classList.remove('show');
        setTimeout(() => { notificationArea.textContent = ''; notificationArea.classList.remove('success', 'warning', 'danger', 'info'); notificationTimeoutId = null; }, 300);
    }

    // updateOrderStatus (Remains the same, updates order status)
    function updateOrderStatus(orderId, statusType, newValue) {
        allOrders = loadOrders(); const orderIndex = allOrders.findIndex(order => order.id === orderId);
        if (orderIndex > -1) {
            allOrders[orderIndex][statusType + 'Status'] = newValue;
            saveOrders(); displayOrders();
            console.log(`Order #${formatOrderId(orderId)} ${statusType} status updated to: ${newValue}`);
        } else { console.error(`Order ${orderId} not found.`); }
    }

    // Display Incoming Orders (Employee View) (Remains the same)
    function displayOrders() {
         if (!employeeView || !incomingOrdersDiv) return;
         incomingOrdersDiv.innerHTML = ''; const ordersToDisplay = loadOrders();
        if (ordersToDisplay.length === 0) { incomingOrdersDiv.innerHTML = '<p>No orders yet.</p>'; return; }
         [...ordersToDisplay].reverse().forEach(order => {
            const orderDiv = document.createElement('div'); orderDiv.classList.add('order');
            const itemsHtml = order.items.map(item => `<li>${item.quantity}x ${item.name || '?'} <span>(${formatCurrency(item.price || 0)} each)</span></li>`).join('');
            const orderTime = new Date(order.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }); const orderDate = new Date(order.timestamp).toLocaleDateString(); const displayId = formatOrderId(order.id);
            orderDiv.innerHTML = `
                <h4><span class="order-id">Order: #${displayId}</span><span class="order-time">${orderDate} ${orderTime}</span></h4>
                <p><strong>Customer:</strong> ${order.customerName || 'N/A'}</p><ul>${itemsHtml}</ul><p class="order-total">Total: ${formatCurrency(order.total)}</p>
                <div class="order-statuses">
                    <div class="status-group">
                        <label for="prep-status-${order.id}">Preparation:</label>
                        <select id="prep-status-${order.id}" data-order-id="${order.id}" data-status-type="preparation">
                            ${PREPARATION_STATUSES.map(status => `<option value="${status}" ${order.preparationStatus === status ? 'selected' : ''}>${status}</option>`).join('')}
                        </select>
                    </div>
                     <div class="status-group">
                        <label for="payment-status-${order.id}">Payment:</label>
                        <select id="payment-status-${order.id}" data-order-id="${order.id}" data-status-type="payment">
                             ${PAYMENT_STATUSES.map(status => `<option value="${status}" ${order.paymentStatus === status ? 'selected' : ''}>${status}</option>`).join('')}
                        </select>
                    </div>
                </div>
            `;
            const prepSelect = orderDiv.querySelector(`#prep-status-${order.id}`); if(prepSelect) { prepSelect.addEventListener('change', (event) => { const orderId = parseInt(event.target.dataset.orderId, 10); const newStatus = event.target.value; updateOrderStatus(orderId, 'preparation', newStatus); }); }
            const paymentSelect = orderDiv.querySelector(`#payment-status-${order.id}`); if(paymentSelect) { paymentSelect.addEventListener('change', (event) => { const orderId = parseInt(event.target.dataset.orderId, 10); const newStatus = event.target.value; updateOrderStatus(orderId, 'payment', newStatus); }); }
            incomingOrdersDiv.appendChild(orderDiv);
        });
    }

    // clearAllOrders (Remains the same)
    function clearAllOrders() { if (confirm("Clear ALL orders? This will not reset stock.")) { allOrders = []; saveOrders(); displayOrders(); } }


    // *** NEW: Display Inventory Items for Employee ***
    function displayInventoryForEmployee() {
        if (!inventoryItemsListUl) return; // Ensure element exists

        inventoryItemsListUl.innerHTML = ''; // Clear existing items

        // Sort items alphabetically by name for easier management
        const sortedMenuItems = [...menuData].sort((a, b) => a.name.localeCompare(b.name));

        sortedMenuItems.forEach(item => {
            const itemId = item.id;
            const currentStock = currentStockLevels[itemId] || 0; // Get current stock, default to 0

            const li = document.createElement('li');
            li.innerHTML = `
                <span class="item-name">${item.name}</span>
                <div class="stock-input-group">
                    <label for="stock-${itemId}">Current:</label>
                    <span class="current-stock-display">${currentStock}</span>
                    <label for="stock-input-${itemId}">Set New:</label>
                    <input type="number" id="stock-input-${itemId}" data-item-id="${itemId}" value="${currentStock}" min="0">
                </div>
            `;

            // Optional: Add input listener if you want real-time feedback (less common for 'Save All')
            // const stockInput = li.querySelector(`#stock-input-${itemId}`);
            // if (stockInput) {
            //      stockInput.addEventListener('input', (event) => {
            //          // Handle potential non-numeric input or negative values
            //          let newValue = parseInt(event.target.value, 10);
            //          if (isNaN(newValue) || newValue < 0) {
            //              newValue = 0; // Or revert to previous value, or show error
            //              event.target.value = newValue;
            //          }
            //          // You could update a temporary object here if needed
            //          // console.log(`Input changed for ${item.name} to ${newValue}`);
            //      });
            // }


            inventoryItemsListUl.appendChild(li);
        });
         // Optional: Show a message if no menu items
         if (sortedMenuItems.length === 0) {
            inventoryItemsListUl.innerHTML = '<li>No menu items configured.</li>';
         }
    }

    // *** NEW: Function to Save all inventory input changes ***
    function saveInventoryChanges() {
        if (!inventoryItemsListUl) return;

        // Get all the number input fields in the inventory list
        const stockInputs = inventoryItemsListUl.querySelectorAll('input[type="number"][data-item-id]');

        if (stockInputs.length === 0) {
             showNotification("No inventory items to save.", 'info');
             return;
        }

        // Create a temporary object to hold the new stock levels
        const updatedStock = { ...currentStockLevels }; // Start with current levels

        stockInputs.forEach(input => {
            const itemId = input.dataset.itemId;
            let newValue = parseInt(input.value, 10); // Parse the input value as an integer

            // Basic validation
            if (isNaN(newValue) || newValue < 0) {
                newValue = 0; // Default to 0 for invalid input
                input.value = 0; // Correct the input field visually
                 console.warn(`Invalid stock entered for item ${itemId}. Setting to 0.`);
                 showNotification(`Invalid stock entered for an item. Set to 0.`, 'warning'); // Notify user
            }

            // Update the temporary stock object
            updatedStock[itemId] = newValue;
        });

        // Update the main stock state and save
        currentStockLevels = updatedStock;
        saveStock(); // Save the changes to localStorage

        // Refresh relevant displays
        displayMenu(); // Updates customer view (availability) and employee menu view (stock number)
        displayInventoryForEmployee(); // Re-renders the inventory list with updated values

        showNotification("Stock levels saved successfully!", 'success');
        console.log("Stock levels saved:", currentStockLevels);
    }


    // --- Login/Logout Logic --- (Modified to display/hide inventory)
    function handleLogin() {
        const name = nameInput.value.trim(); const selectedRole = document.querySelector('input[name="role"]:checked').value; loginErrorP.textContent = '';
        if (!name) { loginErrorP.textContent = 'Please enter your name.'; nameInput.focus(); return; }
        if (selectedRole === 'employee') {
            const enteredCode = prompt("Employees, please enter the 4-digit access code:");
            if (enteredCode === null) { loginErrorP.textContent = 'Login cancelled.'; return; }
            if (enteredCode.trim() !== EMPLOYEE_ACCESS_CODE) { loginErrorP.textContent = 'Invalid access code.'; return; }
        }
        sessionStorage.setItem(USER_NAME_KEY, name); sessionStorage.setItem(USER_ROLE_KEY, selectedRole);
        currentUserName = name; currentUserRole = selectedRole;
        showLoggedInState();
    }
    function handleLogout() {
        sessionStorage.removeItem(USER_NAME_KEY); sessionStorage.removeItem(USER_ROLE_KEY);
        currentUserName = null; currentUserRole = null; currentCart = {};
        displayCart();
        if(customerView && customerView.style.display !== 'none') { displayMenu(); } // Refresh menu to clear quantities
         // Clear inventory display on logout
        if (inventoryItemsListUl) inventoryItemsListUl.innerHTML = '<li>Loading Inventory...</li>';
        showLoginState();
        if (customerView) customerView.style.display = 'none';
        if (employeeView) employeeView.style.display = 'none';
    }
    function showLoggedInState() {
        loginView.style.display = 'none'; appContainer.style.display = 'block';
        loggedInUserNameSpan.textContent = currentUserName; loggedInUserRoleSpan.textContent = currentUserRole;

        // Hide all views first
        customerView.style.display = 'none';
        employeeView.style.display = 'none';

        // Remove old listeners before adding new ones
        if (submitOrderBtn) submitOrderBtn.removeEventListener('click', submitOrder);
        if (clearAllOrdersBtn) clearAllOrdersBtn.removeEventListener('click', clearAllOrders);
        if (saveStockButton) saveStockButton.removeEventListener('click', saveInventoryChanges); // *** Remove listener ***
        if (resetStockButton) resetStockButton.removeEventListener('click', resetStock); // *** Remove listener ***
        if (logoutButton) logoutButton.removeEventListener('click', handleLogout);

        // Show the correct view and attach listeners
        if (currentUserRole === 'customer') {
            customerView.style.display = 'block';
            displayMenu(); // Display menu with quantity controls for customers
            displayCart(); hideOrderConfirmation();
            if (submitOrderBtn) submitOrderBtn.addEventListener('click', submitOrder);
        } else if (currentUserRole === 'employee') {
            employeeView.style.display = 'block';
            displayOrders(); // Display orders
            displayMenu(); // Display menu with stock levels for employees
            displayInventoryForEmployee(); // *** NEW: Display inventory for employees ***

            // *** Attach NEW listeners for employee buttons ***
            if (clearAllOrdersBtn) clearAllOrdersBtn.addEventListener('click', clearAllOrders);
            if (saveStockButton) saveStockButton.addEventListener('click', saveInventoryChanges); // *** Attach listener ***
            if (resetStockButton) resetStockButton.addEventListener('click', resetStock); // *** Attach listener ***
        }

        // Always attach logout listener when logged in
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    }
     function showLoginState() {
        loginView.style.display = 'block'; appContainer.style.display = 'none';
        customerView.style.display = 'none'; employeeView.style.display = 'none';
        if (nameInput) nameInput.value = ''; if (roleCustomerRadio) roleCustomerRadio.checked = true; if (loginErrorP) loginErrorP.textContent = '';
        // Clean up displays when logging out/showing login
        if (menuItemsUl) menuItemsUl.innerHTML = '<li>Loading menu...</li>'; // Clear menu display
        if (cartItemsUl) cartItemsUl.innerHTML = '<li id="empty-cart-message">Your cart is empty.</li>'; // Clear cart display
        if (incomingOrdersDiv) incomingOrdersDiv.innerHTML = '<p>No orders yet.</p>'; // Clear orders display
         if (inventoryItemsListUl) inventoryItemsListUl.innerHTML = '<li>Loading Inventory...</li>'; // Clear inventory display

         // Remove all listeners when logging out
        if (submitOrderBtn) submitOrderBtn.removeEventListener('click', submitOrder);
        if (clearAllOrdersBtn) clearAllOrdersBtn.removeEventListener('click', clearAllOrders);
        if (saveStockButton) saveStockButton.removeEventListener('click', saveInventoryChanges); // *** Remove listener ***
        if (resetStockButton) resetStockButton.removeEventListener('click', resetStock); // *** Remove listener ***
        if (logoutButton) logoutButton.removeEventListener('click', handleLogout);
        if (loginButton) loginButton.removeEventListener('click', handleLogin);

         // Ensure login button listener is attached
        if (loginButton) loginButton.addEventListener('click', handleLogin);
    }


    // --- Event Listeners ---
    // Storage Listener - MODIFIED to update inventory display as well
    window.addEventListener('storage', (event) => {
        // console.log('Storage event:', event.key); // Debugging

        if (event.key === ORDERS_STORAGE_KEY && currentUserRole === 'employee') {
            console.log("Orders updated in another tab. Refreshing employee order view...");
            displayOrders();
        }

        // Handle Stock changes from other tabs
        if (event.key === STOCK_STORAGE_KEY) {
             console.log("Stock updated in another tab. Refreshing stock displays...");
             const oldStockLevels = {...currentStockLevels};
             currentStockLevels = loadStock(); // Reload the latest stock data

             let cartNeedsClearing = false;
             Object.entries(currentCart).forEach(([itemId, quantity]) => {
                 const item = getItemById(itemId);
                 const stockBefore = oldStockLevels[itemId] || 0;
                 const stockAfter = currentStockLevels[itemId] || 0;
                 if (stockAfter < quantity && stockBefore >= quantity) {
                      cartNeedsClearing = true;
                 } else if (!item || (stockAfter <= 0 && quantity > 0)) {
                      cartNeedsClearing = true;
                 }
             });

            if(cartNeedsClearing) {
                 alert("Stock levels have changed. Some items in your cart are no longer available in the requested quantity. Your cart has been cleared.");
                 currentCart = {};
                 displayCart(); // Update cart display
            }

             // Update menu display (for customer availability and employee stock list)
             if (currentUserRole === 'customer' || currentUserRole === 'employee') {
                 displayMenu();
             }
             // *** NEW: Update inventory display if employee is logged in ***
             if (currentUserRole === 'employee') {
                 displayInventoryForEmployee();
             }
        }
    });


    // --- Initialization ---
    // Load stock and orders before deciding which view to show
    currentStockLevels = loadStock();
    allOrders = loadOrders();

    if (currentUserName && currentUserRole) {
        showLoggedInState();
    } else {
        showLoginState();
    }

}); // End DOMContentLoaded
