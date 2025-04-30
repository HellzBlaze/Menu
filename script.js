document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const menuData = [ // Keep the menu data with descriptions and initial stock
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
    // *** Optional: Add a Reset Stock Button reference if you add it in HTML ***
    // const resetStockButton = document.getElementById('reset-stock-btn');


    // --- Functions ---

    // (Keep loadOrders, saveOrders, getItemById, formatCurrency, formatOrderId, getNextOrderId, updateMenuQuantityDisplay, addItemFromMenu, removeItemFromMenu, displayCart, submitOrder, showOrderConfirmation, hideOrderConfirmation, showNotification, hideNotification, updateOrderStatus, displayOrders, clearAllOrders, handleLogin, handleLogout, showLoggedInState, showLoginState)
    // ... (all existing functions remain here) ...

    // Load orders from Local Storage
    function loadOrders() {
        const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        try { const orders = storedOrders ? JSON.parse(storedOrders) : []; return orders.map(order => { if (typeof order.preparationStatus === 'undefined') order.preparationStatus = 'Pending'; if (typeof order.paymentStatus === 'undefined') order.paymentStatus = 'Pending'; order.id = (typeof order.id === 'string' && order.id.startsWith('ORD-')) ? 0 : parseInt(order.id, 10) || 0; return order; }).filter(order => order.id >= 0); } catch (e) { console.error("Error loading orders:", e); return []; }
    }
    function saveOrders() { localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders)); }
    // Load Stock from Local Storage
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
    function saveStock() { localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(currentStockLevels)); }
     function resetStock() {
         if (confirm("Are you sure you want to reset ALL stock levels to initial values?")) {
             currentStockLevels = {};
             menuData.forEach(item => { currentStockLevels[item.id] = item.stock; });
             saveStock();
             displayMenu();
             console.log("Stock levels reset.");
         }
     }
    function getItemById(itemId) { return menuData.find(item => item.id === itemId); }
    function formatCurrency(amount) { return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`; }
    function formatOrderId(numericId) { return String(numericId).padStart(3, '0'); }
    function getNextOrderId() {
        if (allOrders.length === 0) return 1;
        const ordersFromStorage = loadOrders();
        const maxId = ordersFromStorage.reduce((max, order) => { const currentId = Number(order.id); return currentId > max ? currentId : max; }, 0);
        return maxId + 1;
    }
    function updateMenuQuantityDisplay(itemId, newQuantity) {
        const listItem = menuItemsUl.querySelector(`li div[data-item-id="${itemId}"]`)?.closest('li'); // Find the list item using the control div's data attribute
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
    function addItemFromMenu(itemId) {
        const item = getItemById(itemId);
        if (!item) { console.error(`Attempted to add unknown item ID: ${itemId}`); showNotification("Error: Item not found.", 'danger'); return; }
        const currentStock = currentStockLevels[itemId] || 0;
        const currentQuantityInCart = currentCart[itemId] || 0;
        if (currentQuantityInCart + 1 > currentStock) { console.warn(`Cannot add more ${item.name}. Stock limit reached.`); showNotification(`Cannot add more ${item.name}. Out of stock.`, 'warning'); return; }
        currentCart[itemId] = currentQuantityInCart + 1; displayCart(); updateMenuQuantityDisplay(itemId, currentCart[itemId]); hideOrderConfirmation(); showNotification(`${item.name} added to order!`, 'success');
    }
    function removeItemFromMenu(itemId) {
        const currentQuantityInCart = currentCart[itemId] || 0;
        if (currentQuantityInCart > 0) {
             currentCart[itemId]--;
             if (currentCart[itemId] === 0) { delete currentCart[itemId]; }
             displayCart(); updateMenuQuantityDisplay(itemId, currentCart[itemId] || 0); hideOrderConfirmation();
        }
    }
    function displayCart() {
        cartItemsUl.innerHTML = ''; let total = 0; let itemCount = 0;
        Object.entries(currentCart).forEach(([itemId, quantity]) => {
            if (quantity > 0) {
                itemCount++; const item = getItemById(itemId);
                if (item) {
                    const itemTotal = item.price * quantity; const li = document.createElement('li');
                    li.innerHTML = `<div class="cart-item-details"><span class="cart-item-quantity">${quantity}x</span><span class="item-name">${item.name}</span></div><div><span class="item-price">${formatCurrency(itemTotal)}</span><button class="remove-item-btn" data-item-id="${itemId}">-</button></div>`;
                    li.querySelector('.remove-item-btn').addEventListener('click', () => removeItemFromCart(itemId)); cartItemsUl.appendChild(li); total += itemTotal;
                } else { console.warn(`Item ${itemId} not found.`); delete currentCart[itemId]; }
            }
        });
        emptyCartMessage.style.display = (itemCount === 0) ? 'flex' : 'none'; cartTotalSpan.textContent = total.toFixed(2); submitOrderBtn.disabled = itemCount === 0;
    }
    function submitOrder() {
        if (Object.keys(currentCart).length === 0) return;
        const orderItems = Object.entries(currentCart).map(([itemId, quantity]) => { const item = getItemById(itemId); if (!item) { console.error(`Item ${itemId} not found.`); return null; } return { id: itemId, name: item.name, quantity: quantity, price: item.price }; }).filter(item => item !== null);
        if (orderItems.length === 0) { alert("Error: Could not find items in cart."); displayCart(); return; }
        let stockError = false; const latestStock = loadStock();
        orderItems.forEach(item => { const currentStock = latestStock[item.id] || 0; if (item.quantity > currentStock) { console.error(`Stock Error: Tried to order ${item.quantity} of ${item.name} but only ${currentStock} available.`); stockError = true; } });
        if(stockError) { alert("Cannot submit order. Some items are now out of stock. Please review your cart."); currentCart = {}; displayCart(); displayMenu(); return; }
        const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0); const nextOrderId = getNextOrderId();
        const newOrder = { id: nextOrderId, timestamp: new Date().toISOString(), customerName: currentUserName || 'Walk-in Customer', items: orderItems, total: orderTotal, preparationStatus: 'Pending', paymentStatus: 'Pending' };
        orderItems.forEach(item => { currentStockLevels[item.id] = Math.max(0, (currentStockLevels[item.id] || 0) - item.quantity); }); saveStock();
        allOrders.push(newOrder); saveOrders();
        displayOrders(); displayMenu(); currentCart = {}; displayCart();
        showOrderConfirmation(`Order #${formatOrderId(newOrder.id)} submitted successfully!`); hideNotification();
    }
    function showOrderConfirmation(message) { orderConfirmationP.textContent = message; orderConfirmationP.style.display = 'block'; setTimeout(hideOrderConfirmation, 4000); }
    function hideOrderConfirmation() { orderConfirmationP.style.display = 'none'; }
    function showNotification(message, type = 'info') {
        if (notificationTimeoutId) { clearTimeout(notificationTimeoutId); }
        notificationArea.textContent = message; notificationArea.className = 'notification'; notificationArea.classList.add(type); notificationArea.classList.add('show');
        notificationTimeoutId = setTimeout(() => { hideNotification(); }, 2500);
    }
    function hideNotification() {
        notificationArea.classList.remove('show');
        setTimeout(() => { notificationArea.textContent = ''; notificationArea.classList.remove('success', 'warning', 'danger', 'info'); notificationTimeoutId = null; }, 300);
    }
    function updateOrderStatus(orderId, statusType, newValue) {
        allOrders = loadOrders(); const orderIndex = allOrders.findIndex(order => order.id === orderId);
        if (orderIndex > -1) { allOrders[orderIndex][statusType + 'Status'] = newValue; saveOrders(); displayOrders(); console.log(`Order #${formatOrderId(orderId)} ${statusType} status updated to: ${newValue}`); } else { console.error(`Order with ID ${orderId} not found for status update.`); }
    }
    function displayOrders() {
         if (!employeeView || !incomingOrdersDiv) return; incomingOrdersDiv.innerHTML = ''; const ordersToDisplay = loadOrders();
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
    function clearAllOrders() { if (confirm("Clear ALL orders? This will not reset stock.")) { allOrders = []; saveOrders(); displayOrders(); } }
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
        if(customerView && customerView.style.display !== 'none') { displayMenu(); }
        showLoginState();
         if (customerView) customerView.style.display = 'none';
        if (employeeView) employeeView.style.display = 'none';
    }
    function showLoggedInState() {
        loginView.style.display = 'none'; appContainer.style.display = 'block';
        loggedInUserNameSpan.textContent = currentUserName; loggedInUserRoleSpan.textContent = currentUserRole;
        customerView.style.display = 'none'; employeeView.style.display = 'none';
        if (submitOrderBtn) submitOrderBtn.removeEventListener('click', submitOrder);
        if (clearAllOrdersBtn) clearAllOrdersBtn.removeEventListener('click', clearAllOrders);
        if (logoutButton) logoutButton.removeEventListener('click', handleLogout);
        // if (resetStockButton) resetStockButton.removeEventListener('click', resetStock); // Remove if you add the button

        if (currentUserRole === 'customer') {
            customerView.style.display = 'block';
            displayMenu(); // Display menu with quantity controls
            displayCart(); hideOrderConfirmation();
            if (submitOrderBtn) submitOrderBtn.addEventListener('click', submitOrder);
        } else if (currentUserRole === 'employee') {
            employeeView.style.display = 'block';
            displayOrders();
            displayMenu(); // Display menu with stock editing inputs
            if (clearAllOrdersBtn) clearAllOrdersBtn.addEventListener('click', clearAllOrders);
            // if (resetStockButton) resetStockButton.addEventListener('click', resetStock); // Add listener if you add the button
        }
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    }
     function showLoginState() {
        loginView.style.display = 'block'; appContainer.style.display = 'none';
        customerView.style.display = 'none'; employeeView.style.display = 'none';
        if (nameInput) nameInput.value = ''; if (roleCustomerRadio) roleCustomerRadio.checked = true; if (loginErrorP) loginErrorP.textContent = '';
        if (submitOrderBtn) submitOrderBtn.removeEventListener('click', submitOrder);
        if (clearAllOrdersBtn) clearAllOrdersBtn.removeEventListener('click', clearAllOrders);
        if (logoutButton) logoutButton.removeEventListener('click', handleLogout);
        // if (resetStockButton) resetStockButton.removeEventListener('click', resetStock); // Remove if you add the button
        if (loginButton) loginButton.removeEventListener('click', handleLogin);
        if (loginButton) loginButton.addEventListener('click', handleLogin);
    }

    // *** NEW: Function to handle stock input changes by employee ***
    function updateStockFromInput(itemId, inputElement) {
        const rawValue = inputElement.value;
        const newStock = parseInt(rawValue, 10); // Parse the input value as an integer

        // *** Validation ***
        // Check if the parsed value is a valid number and non-negative
        if (isNaN(newStock) || newStock < 0) {
            console.warn(`Invalid stock value entered for item ${itemId}: "${rawValue}". Reverting to previous stock.`);
            // Revert the input field to the current valid stock level
            inputElement.value = currentStockLevels[itemId] || 0;
            showNotification("Invalid stock value. Please enter a non-negative number.", 'warning');
            return; // Stop the update process
        }
         // Optional: Check for fractional numbers if your stock isn't integer (unlikely for food items)
         if (newStock !== parseFloat(rawValue)) {
             console.warn(`Fractional stock value entered for item ${itemId}: "${rawValue}". Using integer part.`);
              // Input field will likely already show the integer due to type="number" and parsing,
              // but can explicitly set inputElement.value = newStock; if needed
              showNotification("Fractional stock value entered. Using whole number.", 'info');
         }
        // *** End Validation ***


        // Only update and save if the stock level has actually changed
        if (currentStockLevels[itemId] !== newStock) {
            console.log(`Updating stock for item ${itemId} to ${newStock}`);
            currentStockLevels[itemId] = newStock; // Update state
            saveStock(); // Save to localStorage

            // Notify other tabs / update customer view
            // Saving triggers the storage event, which will call loadStock + displayMenu everywhere.
            // We don't need to call displayMenu() again in THIS tab immediately, as the input value is already correct.
             showNotification(`Stock for ${getItemById(itemId)?.name || 'Item'} updated to ${newStock}.`, 'success');
        } else {
             console.log(`Stock for item ${itemId} unchanged.`);
        }
    }


    // Display Menu Items - MODIFIED for Quantity Control (Customer) / Stock Input (Employee)
    function displayMenu() {
        if (!menuItemsUl) return;

        menuItemsUl.innerHTML = ''; // Clear existing items
        menuData.forEach(item => {
            const li = document.createElement('li');
            const itemId = item.id;
            const currentStock = currentStockLevels[itemId] || 0;
            const quantityInCart = currentCart[itemId] || 0;

            // Add 'out-of-stock' class for Customer view only if stock is zero
            if (currentStock <= 0 && currentUserRole === 'customer') {
                li.classList.add('out-of-stock');
            }

            const itemDetailsDiv = document.createElement('div');
            itemDetailsDiv.classList.add('menu-item-details');
            itemDetailsDiv.innerHTML = `
                <span class="item-name">${item.name}</span>
                ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
            `;

            const itemActionDiv = document.createElement('div');
            itemActionDiv.classList.add('menu-item-action'); // Use this class for both roles

            if (currentUserRole === 'customer') {
                 // Customer View: Quantity Control or Out of Stock
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
                // Employee View: Price and Stock Editor
                itemActionDiv.innerHTML = `
                    <span class="item-price">${formatCurrency(item.price)}</span>
                    <div class="item-stock-editor">
                        <label>Stock:</label>
                        <input type="number" min="0" value="${currentStock}" data-item-id="${itemId}">
                    </div>
                `;
                 // *** Attach event listener to the stock input ***
                const stockInput = itemActionDiv.querySelector('input[type="number"]');
                 if (stockInput) {
                     // Use 'change' event to trigger update when input loses focus or Enter is pressed
                     stockInput.addEventListener('change', (event) => {
                         const itemId = event.target.dataset.itemId; // Get the item ID from data attribute
                         updateStockFromInput(itemId, event.target); // Pass item ID and the input element
                     });
                 }
            }

            li.appendChild(itemDetailsDiv);
            li.appendChild(itemActionDiv);
            menuItemsUl.appendChild(li);
        });
    }

    // (Rest of the functions remain unchanged as they rely on the state variables and helper functions)
    // removeFromCart remains the same
    // displayCart remains the same
    // submitOrder remains the same
    // showOrderConfirmation remains the same
    // hideOrderConfirmation remains the same
    // showNotification remains the same
    // hideNotification remains the same
    // updateOrderStatus remains the same
    // displayOrders remains the same
    // clearAllOrders remains the same
    // handleLogin remains the same
    // handleLogout remains the same
    // showLoggedInState remains the same
    // showLoginState remains the same


    // --- Event Listeners ---
    // Storage Listener - MODIFIED to handle stock changes, reload stock, and update menu/cart
    window.addEventListener('storage', (event) => {
        // console.log('Storage event:', event.key); // Debugging

        // Handle Orders changes (primarily for employee display)
        if (event.key === ORDERS_STORAGE_KEY && currentUserRole === 'employee') {
            console.log("Orders updated in another tab. Refreshing employee order view...");
            displayOrders(); // displayOrders calls loadOrders itself
        }

         // Handle Stock changes from other tabs
        if (event.key === STOCK_STORAGE_KEY) { // Listen for stock changes regardless of role
             console.log("Stock updated in another tab. Refreshing menu and potentially cart...");
             const oldStockLevels = {...currentStockLevels}; // Capture state before loading
             currentStockLevels = loadStock(); // Reload the latest stock data

             // Only check/clear cart if customer view is active
            if (currentUserRole === 'customer') {
                 let cartNeedsClearing = false;
                 Object.entries(currentCart).forEach(([itemId, quantity]) => {
                     const item = getItemById(itemId);
                     const stockBefore = oldStockLevels[itemId] || 0;
                     const stockAfter = currentStockLevels[itemId] || 0;

                     if (stockAfter < quantity && stockBefore >= quantity) {
                         console.warn(`Item ${item?.name || itemId} in cart (${quantity}) now exceeds new stock (${stockAfter}). Clearing cart.`);
                         cartNeedsClearing = true;
                     } else if (!item || stockAfter <= 0 && quantity > 0) {
                          console.warn(`Item ${item?.name || itemId} in cart (${quantity}) is now unavailable. Clearing cart.`);
                          cartNeedsClearing = true;
                     }
                 });

                if(cartNeedsClearing) {
                     alert("Stock levels have changed. Some items in your cart are no longer available in the requested quantity. Your cart has been cleared.");
                     currentCart = {}; // Clear the cart
                     displayCart(); // Update cart display
                }
            }


             // Always update the menu display regardless of cart clear, if relevant view is shown
             if (currentUserRole === 'customer' || currentUserRole === 'employee') {
                 displayMenu(); // Re-render the menu to reflect new stock/availability
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
