// script.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (Configuration constants, menuData, storage keys, access code, status definitions) ...
    const menuData = [ // Keep the menu data with descriptions
        { id: 'm1', name: 'Paneer Butter Masala', price: 280.00, description: 'Creamy tomato gravy with soft paneer cubes.' },
        { id: 'm2', name: 'Chicken Tikka Masala', price: 350.00, description: 'Grilled chicken chunks in a spiced curry sauce.' },
        { id: 'm3', name: 'Dal Makhani', price: 220.50, description: 'Rich, slow-cooked black lentils with butter and cream.' },
        { id: 'm4', name: 'Vegetable Biryani', price: 250.00, description: 'Aromatic basmati rice cooked with mixed vegetables and spices.' },
        { id: 'm5', name: 'Masala Dosa', price: 150.75, description: 'Crispy rice crepe filled with spiced potato mixture, served with sambar.' },
        { id: 'm6', name: 'Tandoori Roti', price: 30.00, description: 'Whole wheat bread baked in a traditional clay tandoor.' },
        { id: 'm7', name: 'Garlic Naan', price: 55.00, description: 'Soft leavened bread topped with garlic and butter, baked in tandoor.' },
        { id: 'm8', name: 'Jeera Rice', price: 120.00, description: 'Basmati rice tempered with cumin seeds and ghee.' },
        { id: 'm9', name: 'Chole Bhature', price: 180.00, description: 'Spicy chickpea curry served with fluffy deep-fried bread.' },
        { id: 'm10', name: 'Palak Paneer', price: 260.00, description: 'Indian cottage cheese in a smooth spinach gravy.' },
        { id: 'm11', name: 'Mutton Rogan Josh', price: 420.00, description: 'Tender mutton cooked in a flavourful Kashmiri red chili gravy.' },
        { id: 'm12', name: 'Fish Curry', price: 380.00, description: 'Tangy and spicy fish curry, varies by regional style.' },
        { id: 'm13', name: 'Samosa (2 pcs)', price: 60.00, description: 'Crispy pastry filled with spiced potatoes and peas.' },
        { id: 'm14', name: 'Gulab Jamun (2 pcs)', price: 70.00, description: 'Deep-fried milk solids dumplings soaked in sugar syrup.' },
        { id: 'm15', name: 'Ras Malai (2 pcs)', price: 90.00, description: 'Soft paneer discs soaked in sweetened, thickened milk.' },
        { id: 'm16', name: 'Fresh Lime Soda', price: 75.00, description: 'Refreshing drink with lime juice, soda, sugar/salt options.' },
        { id: 'm17', name: 'Mango Lassi', price: 110.00, description: 'Cooling yogurt-based drink blended with sweet mango pulp.' },
        { id: 'm18', name: 'Mixed Veg Raita', price: 95.00, description: 'Yogurt mixed with chopped vegetables and mild spices.' },
        { id: 'm19', name: 'Green Salad', price: 130.00, description: 'Assortment of fresh garden vegetables like cucumber, tomato, onion.' },
        { id: 'm20', name: 'Mineral Water Bottle', price: 40.00, description: 'Standard packaged drinking water (500ml/1L).' },
    ];

    const ORDERS_STORAGE_KEY = 'restaurantOrdersINR_v3';
    const USER_NAME_KEY = 'restaurantUserName';
    const USER_ROLE_KEY = 'restaurantUserRole';
    const CURRENCY_SYMBOL = '₹';
    const EMPLOYEE_ACCESS_CODE = '2724';

    const PREPARATION_STATUSES = ['Pending', 'In Progress', 'Ready'];
    const PAYMENT_STATUSES = ['Pending', 'Paid'];


    // --- State ---
    let currentCart = {}; // { itemId: quantity }
    let allOrders = loadOrders();
    let currentUserName = sessionStorage.getItem(USER_NAME_KEY);
    let currentUserRole = sessionStorage.getItem(USER_ROLE_KEY);
    let notificationTimeoutId = null;

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


    // --- Functions ---

    // (loadOrders, saveOrders, getItemById, formatCurrency, formatOrderId, getNextOrderId, showOrderConfirmation, hideOrderConfirmation, showNotification, hideNotification, updateOrderStatus, displayOrders, clearAllOrders, handleLogin, handleLogout, showLoggedInState, showLoginState remain the same except for calls to displayMenu/displayCart)
    function loadOrders() { /* ... same as before ... */
        const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        try { const orders = storedOrders ? JSON.parse(storedOrders) : []; return orders.map(order => { if (typeof order.preparationStatus === 'undefined') { order.preparationStatus = 'Pending'; } if (typeof order.paymentStatus === 'undefined') { order.paymentStatus = 'Pending'; } order.id = (typeof order.id === 'string' && order.id.startsWith('ORD-')) ? 0 : parseInt(order.id, 10) || 0; return order; }).filter(order => order.id >= 0); } catch (e) { console.error("Error loading orders:", e); return []; }
    }
    function saveOrders() { localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders)); }
    function getItemById(itemId) { return menuData.find(item => item.id === itemId); }
    function formatCurrency(amount) { return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`; }
    function formatOrderId(numericId) { return String(numericId).padStart(3, '0'); }
     function getNextOrderId() { /* ... same as before, loads fresh data ... */
        if (allOrders.length === 0) return 1;
        const ordersFromStorage = loadOrders();
        const maxId = ordersFromStorage.reduce((max, order) => { const currentId = Number(order.id); return currentId > max ? currentId : max; }, 0);
        return maxId + 1;
    }

    // *** NEW/MODIFIED: Functions to handle quantity change from menu item ***

    // Find the menu list item element for a given item ID
    function findMenuItemElement(itemId) {
        // We need to find the specific LI element within the menu UL
        // A good way is to add a data attribute to the LI itself in displayMenu
        return menuItemsUl.querySelector(`li[data-item-id="${itemId}"]`);
    }

    // Update the quantity display on the specific menu list item
    function updateMenuItemQuantityDisplay(itemId, quantity) {
        const menuItemElement = findMenuItemElement(itemId);
        if (menuItemElement) {
            const quantitySpan = menuItemElement.querySelector('.item-quantity-control .quantity');
            const decreaseButton = menuItemElement.querySelector('.item-quantity-control .decrease-quantity-btn');
            if (quantitySpan) {
                quantitySpan.textContent = quantity;
            }
             if (decreaseButton) {
                 // Disable decrease button if quantity is 0
                 decreaseButton.disabled = quantity === 0;
             }
        }
    }

    // Increment quantity (called by '+' button)
    function incrementQuantity(itemId) {
        currentCart[itemId] = (currentCart[itemId] || 0) + 1;
        updateMenuItemQuantityDisplay(itemId, currentCart[itemId]); // Update menu item display
        displayCart(); // Update cart summary
        hideOrderConfirmation(); // Hide order submitted message
        const item = getItemById(itemId);
        if (item) { showNotification(`${item.name} added to order!`); } // Show notification
    }

    // Decrement quantity (called by '-' button)
    function decrementQuantity(itemId) {
        if (currentCart[itemId] > 0) {
            currentCart[itemId]--;
            if (currentCart[itemId] === 0) {
                delete currentCart[itemId]; // Remove item if quantity is zero
            }
            updateMenuItemQuantityDisplay(itemId, currentCart[itemId] || 0); // Update menu item display
            displayCart(); // Update cart summary
             // Optional: Notification when item removed entirely?
             // if (currentCart[itemId] === undefined) { showNotification(`${getItemById(itemId)?.name || 'Item'} removed.`); }
        }
         hideOrderConfirmation(); // Hide order submitted message
    }


    // Display Menu Items - MODIFIED TO INCLUDE QUANTITY CONTROLS
    function displayMenu() {
        menuItemsUl.innerHTML = ''; // Clear existing items
        menuData.forEach(item => {
            const li = document.createElement('li');
            li.dataset.itemId = item.id; // *** Add data attribute to LI for easier lookup ***

            // Item Details (Name and Description)
            const itemDetailsDiv = document.createElement('div');
            itemDetailsDiv.classList.add('menu-item-details');
            itemDetailsDiv.innerHTML = `
                <span class="item-name">${item.name}</span>
                ${item.description ? `<p class="item-description">${item.description}</p>` : ''}
            `;

            // Item Action (Price and Quantity Controls)
            const itemActionDiv = document.createElement('div');
            itemActionDiv.classList.add('menu-item-action'); // Keep this class for layout

            // *** Quantity Controls Structure ***
            const initialQuantity = currentCart[item.id] || 0; // Get current quantity from cart
            const quantityControlsHtml = `
                <span class="item-price">${formatCurrency(item.price)}</span>
                <div class="item-quantity-control">
                    <button class="decrease-quantity-btn" data-item-id="${item.id}" ${initialQuantity === 0 ? 'disabled' : ''}>-</button>
                    <span class="quantity">${initialQuantity}</span>
                    <button class="increase-quantity-btn" data-item-id="${item.id}">+</button>
                </div>
            `;

            itemActionDiv.innerHTML = quantityControlsHtml;

            li.appendChild(itemDetailsDiv);
            li.appendChild(itemActionDiv);

            // *** Attach event listeners to the +/- buttons ***
            const decreaseButton = li.querySelector('.decrease-quantity-btn');
            const increaseButton = li.querySelector('.increase-quantity-btn');

            // Only add listeners if in customer role
            if (currentUserRole === 'customer') {
                decreaseButton.addEventListener('click', () => decrementQuantity(item.id));
                increaseButton.addEventListener('click', () => incrementQuantity(item.id));
            } else {
                 // Hide or disable controls for employee view
                 // Hiding the entire item-quantity-control div is probably best
                 itemActionDiv.style.display = 'none';
                 // Or just hide the buttons:
                 // decreaseButton.style.display = 'none';
                 // increaseButton.style.display = 'none';
                 // li.querySelector('.item-quantity-control .quantity').style.fontWeight = 'normal'; // Optional: style quantity display for employee
            }

            menuItemsUl.appendChild(li);
        });
    }


    // displayCart (Remains the same, called by increment/decrementQuantity)
     function displayCart() { /* ... same as before ... */
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

    // submitOrder - MODIFIED to call displayMenu after clearing cart
    function submitOrder() {
        if (Object.keys(currentCart).length === 0) return;
        const orderItems = Object.entries(currentCart).map(([itemId, quantity]) => { const item = getItemById(itemId); if (!item) { console.error(`Item ${itemId} not found.`); return null; } return { id: itemId, name: item.name, quantity: quantity, price: item.price }; }).filter(item => item !== null);
        if (orderItems.length === 0) { alert("Error: Could not find items in cart."); displayCart(); return; }
        const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const nextOrderId = getNextOrderId();
        const newOrder = {
            id: nextOrderId, timestamp: new Date().toISOString(), customerName: currentUserName || 'Walk-in Customer', items: orderItems, total: orderTotal,
            preparationStatus: 'Pending', paymentStatus: 'Pending'
        };
        allOrders.push(newOrder); saveOrders(); displayOrders();

        // *** Clear cart state and update displays ***
        currentCart = {};
        displayCart(); // Clears cart summary UI
        displayMenu(); // *** Re-renders menu items to show 0 quantity ***

        showOrderConfirmation(`Order #${formatOrderId(newOrder.id)} submitted successfully!`);
        hideNotification();
    }

    // (showOrderConfirmation, hideOrderConfirmation, showNotification, hideNotification) ... same as before ...
     function showOrderConfirmation(message) { orderConfirmationP.textContent = message; orderConfirmationP.style.display = 'block'; setTimeout(hideOrderConfirmation, 4000); }
     function hideOrderConfirmation() { orderConfirmationP.style.display = 'none'; }
     function showNotification(message) { if (notificationTimeoutId) { clearTimeout(notificationTimeoutId); } notificationArea.textContent = message; notificationArea.classList.add('show'); notificationTimeoutId = setTimeout(() => { hideNotification(); }, 2500); }
     function hideNotification() { notificationArea.classList.remove('show'); setTimeout(() => { notificationArea.textContent = ''; notificationTimeoutId = null; }, 300); }

    // updateOrderStatus (Remains the same)
    function updateOrderStatus(orderId, statusType, newValue) { /* ... same as before ... */
        allOrders = loadOrders();
        const orderIndex = allOrders.findIndex(order => order.id === orderId);
        if (orderIndex > -1) { allOrders[orderIndex][statusType + 'Status'] = newValue; saveOrders(); displayOrders(); console.log(`Order #${formatOrderId(orderId)} ${statusType} status updated to: ${newValue}`); } else { console.error(`Order ID ${orderId} not found.`); }
    }
    // displayOrders (Remains the same, only displays employee view)
    function displayOrders() { /* ... same as before ... */
        if (!employeeView || !incomingOrdersDiv) return; incomingOrdersDiv.innerHTML = ''; const ordersToDisplay = loadOrders();
        if (ordersToDisplay.length === 0) { incomingOrdersDiv.innerHTML = '<p>No orders yet.</p>'; return; }
        [...ordersToDisplay].reverse().forEach(order => {
            const orderDiv = document.createElement('div'); orderDiv.classList.add('order');
            const itemsHtml = order.items.map(item => `<li>${item.quantity}x ${item.name || '?'} <span>(${formatCurrency(item.price || 0)} each)</span></li>`).join('');
            const orderTime = new Date(order.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }); const orderDate = new Date(order.timestamp).toLocaleDateString(); const displayId = formatOrderId(order.id);
            orderDiv.innerHTML = `<h4><span class="order-id">Order: #${displayId}</span><span class="order-time">${orderDate} ${orderTime}</span></h4><p><strong>Customer:</strong> ${order.customerName || 'N/A'}</p><ul>${itemsHtml}</ul><p class="order-total">Total: ${formatCurrency(order.total)}</p><div class="order-statuses"><div class="status-group"><label for="prep-status-${order.id}">Preparation:</label><select id="prep-status-${order.id}" data-order-id="${order.id}" data-status-type="preparation">${PREPARATION_STATUSES.map(status => `<option value="${status}" ${order.preparationStatus === status ? 'selected' : ''}>${status}</option>`).join('')}</select></div><div class="status-group"><label for="payment-status-${order.id}">Payment:</label><select id="payment-status-${order.id}" data-order-id="${order.id}" data-status-type="payment">${PAYMENT_STATUSES.map(status => `<option value="${status}" ${order.paymentStatus === status ? 'selected' : ''}>${status}</option>`).join('')}</select></div></div>`;
            const prepSelect = orderDiv.querySelector(`#prep-status-${order.id}`); const paymentSelect = orderDiv.querySelector(`#payment-status-${order.id}`);
            if(prepSelect) { prepSelect.addEventListener('change', (event) => { const orderId = parseInt(event.target.dataset.orderId, 10); const newStatus = event.target.value; updateOrderStatus(orderId, 'preparation', newStatus); }); }
            if(paymentSelect) { paymentSelect.addEventListener('change', (event) => { const orderId = parseInt(event.target.dataset.orderId, 10); const newStatus = event.target.value; updateOrderStatus(orderId, 'payment', newStatus); }); }
            incomingOrdersDiv.appendChild(orderDiv);
        });
    }

    // clearAllOrders (Remains the same)
    function clearAllOrders() { if (confirm("Clear ALL orders?")) { allOrders = []; saveOrders(); displayOrders(); } }

    // Login/Logout Logic (Remains the same, showLoggedInState calls displayMenu/displayCart)
    function handleLogin() { /* ... same as before ... */
        const name = nameInput.value.trim(); const selectedRole = document.querySelector('input[name="role"]:checked').value; loginErrorP.textContent = '';
        if (!name) { loginErrorP.textContent = 'Please enter your name.'; nameInput.focus(); return; }
        if (selectedRole === 'employee') { const enteredCode = prompt("Employees, please enter the 4-digit access code:"); if (enteredCode === null) { loginErrorP.textContent = 'Login cancelled.'; return; } if (enteredCode.trim() !== EMPLOYEE_ACCESS_CODE) { loginErrorP.textContent = 'Invalid access code.'; return; } }
        sessionStorage.setItem(USER_NAME_KEY, name); sessionStorage.setItem(USER_ROLE_KEY, selectedRole); currentUserName = name; currentUserRole = selectedRole; showLoggedInState();
    }
    function handleLogout() { /* ... same as before, clears cart state ... */
        sessionStorage.removeItem(USER_NAME_KEY); sessionStorage.removeItem(USER_ROLE_KEY);
        currentUserName = null; currentUserRole = null; currentCart = {};
        showLoginState(); // showLoginState implicitly clears/resets views
    }
    function showLoggedInState() { /* ... calls displayMenu/displayCart when customer ... */
        loginView.style.display = 'none'; appContainer.style.display = 'block';
        loggedInUserNameSpan.textContent = currentUserName; loggedInUserRoleSpan.textContent = currentUserRole;
        customerView.style.display = 'none'; employeeView.style.display = 'none';
        if (submitOrderBtn) submitOrderBtn.removeEventListener('click', submitOrder);
        if (clearAllOrdersBtn) clearAllOrdersBtn.removeEventListener('click', clearAllOrders);
        if (logoutButton) logoutButton.removeEventListener('click', handleLogout);

        if (currentUserRole === 'customer') {
            customerView.style.display = 'block';
            displayMenu(); // *** This will now show quantity controls based on currentCart ***
            displayCart();
            hideOrderConfirmation();
            if (submitOrderBtn) submitOrderBtn.addEventListener('click', submitOrder);
        } else if (currentUserRole === 'employee') {
            employeeView.style.display = 'block'; displayOrders();
            if (clearAllOrdersBtn) clearAllOrdersBtn.addEventListener('click', clearAllOrders);
        }
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);
    }
     function showLoginState() { /* ... same as before ... */
        loginView.style.display = 'block'; appContainer.style.display = 'none';
        customerView.style.display = 'none'; employeeView.style.display = 'none';
        if (nameInput) nameInput.value = ''; if (roleCustomerRadio) roleCustomerRadio.checked = true; if (loginErrorP) loginErrorP.textContent = '';
        if (submitOrderBtn) submitOrderBtn.removeEventListener('click', submitOrder);
        if (clearAllOrdersBtn) clearAllOrdersBtn.removeEventListener('click', clearAllOrders);
        if (logoutButton) logoutButton.removeEventListener('click', handleLogout);
        if (loginButton) loginButton.removeEventListener('click', handleLogin);
        if (loginButton) loginButton.addEventListener('click', handleLogin);
    }


    // --- Event Listeners --- (Remains the same)
    window.addEventListener('storage', (event) => { /* ... same as before ... */
        if (event.key === ORDERS_STORAGE_KEY && currentUserRole === 'employee') {
            console.log("Orders updated in another tab. Refreshing employee view...");
            displayOrders();
        }
    });

    // --- Initialization --- (Remains the same)
    if (currentUserName && currentUserRole) { showLoggedInState(); } else { showLoginState(); }

}); // End DOMContentLoaded
