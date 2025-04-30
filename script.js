document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
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

    const ORDERS_STORAGE_KEY = 'restaurantOrdersINR_v3'; // Changed key again
    const USER_NAME_KEY = 'restaurantUserName';
    const USER_ROLE_KEY = 'restaurantUserRole';
    const CURRENCY_SYMBOL = '₹';
    const EMPLOYEE_ACCESS_CODE = '2724';

    // --- Status Definitions ---
    const PREPARATION_STATUSES = ['Pending', 'In Progress', 'Ready'];
    const PAYMENT_STATUSES = ['Pending', 'Paid'];

    // --- State ---
    let currentCart = {};
    let allOrders = loadOrders(); // Load orders on startup
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

    // Load orders from Local Storage - MODIFIED to add default statuses
    function loadOrders() {
        const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
        try {
            const orders = storedOrders ? JSON.parse(storedOrders) : [];
            return orders.map(order => {
                // Add default statuses if they are missing (for backward compatibility)
                if (typeof order.preparationStatus === 'undefined') {
                    order.preparationStatus = 'Pending';
                }
                 if (typeof order.paymentStatus === 'undefined') {
                    order.paymentStatus = 'Pending';
                }
                 // Ensure ID is numeric (from previous change)
                 order.id = (typeof order.id === 'string' && order.id.startsWith('ORD-')) ? 0 : parseInt(order.id, 10) || 0;

                return order;
            }).filter(order => order.id >= 0); // Filter out potentially corrupted orders
        } catch (e) {
            console.error("Error loading orders from local storage:", e);
            // Clear corrupted data
            // localStorage.removeItem(ORDERS_STORAGE_KEY); // Uncomment if you want to reset on load error
            return []; // Return empty array on error
        }
    }

    // Save orders to Local Storage (No change needed, it saves the object as is)
    function saveOrders() {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(allOrders));
    }

    // Find item details by ID (Remains the same)
    function getItemById(itemId) { return menuData.find(item => item.id === itemId); }
    // Format currency (Remains the same)
    function formatCurrency(amount) { return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`; }
    // Format Order ID to 3 digits (Remains the same)
    function formatOrderId(numericId) { return String(numericId).padStart(3, '0'); }
    // Get the next sequential order ID (Remains the same)
    function getNextOrderId() {
        if (allOrders.length === 0) return 1;
        // Need to load fresh data to ensure we get the latest max ID from other tabs
        const ordersFromStorage = loadOrders(); // Load fresh data here
        const maxId = ordersFromStorage.reduce((max, order) => {
             const currentId = Number(order.id);
             return currentId > max ? currentId : max;
            }, 0);
        return maxId + 1;
    }

    // displayMenu (Remains the same)
    function displayMenu() {
        menuItemsUl.innerHTML = '';
        menuData.forEach(item => {
            const li = document.createElement('li');
            const itemDetailsDiv = document.createElement('div'); itemDetailsDiv.classList.add('menu-item-details'); itemDetailsDiv.innerHTML = `<span class="item-name">${item.name}</span>${item.description ? `<p class="item-description">${item.description}</p>` : ''}`;
            const itemActionDiv = document.createElement('div'); itemActionDiv.classList.add('menu-item-action'); itemActionDiv.innerHTML = `<span class="item-price">${formatCurrency(item.price)}</span><button data-item-id="${item.id}">Add</button>`;
            li.appendChild(itemDetailsDiv); li.appendChild(itemActionDiv);
            const addButton = li.querySelector('button');
            if (currentUserRole === 'customer') { addButton.addEventListener('click', () => addToCart(item.id)); } else { addButton.style.display = 'none'; }
            menuItemsUl.appendChild(li);
        });
    }

    // addToCart (Remains the same, already modified for notification)
    function addToCart(itemId) {
        currentCart[itemId] = (currentCart[itemId] || 0) + 1;
        displayCart();
        hideOrderConfirmation(); // This hides the 'Order Submitted' message
        const item = getItemById(itemId);
        if (item) { showNotification(`${item.name} added to order!`); }
    }

    // removeFromCart (Remains the same)
    function removeFromCart(itemId) { if (currentCart[itemId] > 0) { currentCart[itemId]--; if (currentCart[itemId] === 0) { delete currentCart[itemId]; } displayCart(); } }
    // displayCart (Remains the same)
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

    // submitOrder (Remains the same)
    function submitOrder() {
        if (Object.keys(currentCart).length === 0) return;
        const orderItems = Object.entries(currentCart).map(([itemId, quantity]) => { const item = getItemById(itemId); if (!item) { console.error(`Item ${itemId} not found.`); return null; } return { id: itemId, name: item.name, quantity: quantity, price: item.price }; }).filter(item => item !== null);
        if (orderItems.length === 0) { alert("Error: Could not find items in cart."); displayCart(); return; }
        const orderTotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const nextOrderId = getNextOrderId();
        const newOrder = {
            id: nextOrderId,
            timestamp: new Date().toISOString(),
            customerName: currentUserName || 'Walk-in Customer',
            items: orderItems,
            total: orderTotal,
            preparationStatus: 'Pending', // *** Set initial statuses ***
            paymentStatus: 'Pending'
        };
        allOrders.push(newOrder); saveOrders(); displayOrders(); currentCart = {}; displayCart(); showOrderConfirmation(`Order #${formatOrderId(newOrder.id)} submitted successfully!`); hideNotification();
    }

    // showOrderConfirmation (Remains the same)
    function showOrderConfirmation(message) { orderConfirmationP.textContent = message; orderConfirmationP.style.display = 'block'; setTimeout(hideOrderConfirmation, 4000); }
    // hideOrderConfirmation (Remains the same)
    function hideOrderConfirmation() { orderConfirmationP.style.display = 'none'; }

    // showNotification (Remains the same)
    function showNotification(message) {
        if (notificationTimeoutId) { clearTimeout(notificationTimeoutId); }
        notificationArea.textContent = message;
        notificationArea.classList.add('show');
        notificationTimeoutId = setTimeout(() => { hideNotification(); }, 2500);
    }
    // hideNotification (Remains the same)
    function hideNotification() {
        notificationArea.classList.remove('show');
        setTimeout(() => { notificationArea.textContent = ''; notificationTimeoutId = null; }, 300);
    }

    // *** NEW: Function to update an order's status ***
    function updateOrderStatus(orderId, statusType, newValue) {
        // Ensure we are working with the latest data from storage
        allOrders = loadOrders();

        const orderIndex = allOrders.findIndex(order => order.id === orderId);

        if (orderIndex > -1) {
            // Update the specific status
            allOrders[orderIndex][statusType + 'Status'] = newValue; // statusType will be 'preparation' or 'payment'

            saveOrders(); // Save the updated list
            displayOrders(); // Re-render the list to show the change immediately
            console.log(`Order #${formatOrderId(orderId)} ${statusType} status updated to: ${newValue}`);

             // Optional: show a notification for the employee
             // showNotification(`Order #${formatOrderId(orderId)} status updated!`); // Might be too many notifications

        } else {
            console.error(`Order with ID ${orderId} not found for status update.`);
        }
    }


    // Display Incoming Orders (Employee View) - MODIFIED to add status controls
    function displayOrders() {
         if (!employeeView || !incomingOrdersDiv) return;
         incomingOrdersDiv.innerHTML = '';

         // Always load latest orders when displaying
         const ordersToDisplay = loadOrders();

        if (ordersToDisplay.length === 0) {
            incomingOrdersDiv.innerHTML = '<p>No orders yet.</p>';
            return;
        }

        // Sort by oldest first for employee view (optional, but common for task lists)
        // [...ordersToDisplay].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).forEach(order => { ... });
        // Or keep newest first as before:
         [...ordersToDisplay].reverse().forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order');

            const itemsHtml = order.items.map(item =>
                 `<li>${item.quantity}x ${item.name || '?'} <span>(${formatCurrency(item.price || 0)} each)</span></li>`
            ).join('');

            const orderTime = new Date(order.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
            const orderDate = new Date(order.timestamp).toLocaleDateString();
            const displayId = formatOrderId(order.id);

            orderDiv.innerHTML = `
                <h4>
                    <span class="order-id">Order: #${displayId}</span>
                    <span class="order-time">${orderDate} ${orderTime}</span>
                </h4>
                <p><strong>Customer:</strong> ${order.customerName || 'N/A'}</p>
                <ul>${itemsHtml}</ul>
                <p class="order-total">Total: ${formatCurrency(order.total)}</p>

                <div class="order-statuses">
                    <div class="status-group">
                        <label for="prep-status-${order.id}">Preparation:</label>
                        <select id="prep-status-${order.id}" data-order-id="${order.id}" data-status-type="preparation">
                            ${PREPARATION_STATUSES.map(status =>
                                `<option value="${status}" ${order.preparationStatus === status ? 'selected' : ''}>${status}</option>`
                            ).join('')}
                        </select>
                    </div>
                     <div class="status-group">
                        <label for="payment-status-${order.id}">Payment:</label>
                        <select id="payment-status-${order.id}" data-order-id="${order.id}" data-status-type="payment">
                             ${PAYMENT_STATUSES.map(status =>
                                `<option value="${status}" ${order.paymentStatus === status ? 'selected' : ''}>${status}</option>`
                             ).join('')}
                        </select>
                    </div>
                </div> <!-- End order-statuses -->

            `; // Added status controls here


            // *** Attach event listeners to the select menus ***
            const prepSelect = orderDiv.querySelector(`#prep-status-${order.id}`);
            const paymentSelect = orderDiv.querySelector(`#payment-status-${order.id}`);

            if(prepSelect) {
                prepSelect.addEventListener('change', (event) => {
                    const orderId = parseInt(event.target.dataset.orderId, 10); // Get numeric ID
                    const newStatus = event.target.value;
                    updateOrderStatus(orderId, 'preparation', newStatus);
                });
            }

             if(paymentSelect) {
                 paymentSelect.addEventListener('change', (event) => {
                     const orderId = parseInt(event.target.dataset.orderId, 10); // Get numeric ID
                     const newStatus = event.target.value;
                     updateOrderStatus(orderId, 'payment', newStatus);
                 });
             }


            incomingOrdersDiv.appendChild(orderDiv);
        });
    }

    // clearAllOrders (Remains the same)
    function clearAllOrders() { if (confirm("Clear ALL orders?")) { allOrders = []; saveOrders(); displayOrders(); } }


    // --- Login/Logout Logic --- (Remains the same)
    function handleLogin() {
        const name = nameInput.value.trim();
        const selectedRole = document.querySelector('input[name="role"]:checked').value;
        loginErrorP.textContent = '';
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
        showLoginState();
    }
    function showLoggedInState() {
        loginView.style.display = 'none'; appContainer.style.display = 'block';
        loggedInUserNameSpan.textContent = currentUserName; loggedInUserRoleSpan.textContent = currentUserRole;
        customerView.style.display = 'none'; employeeView.style.display = 'none';
        if (submitOrderBtn) submitOrderBtn.removeEventListener('click', submitOrder);
        if (clearAllOrdersBtn) clearAllOrdersBtn.removeEventListener('click', clearAllOrders);
        if (logoutButton) logoutButton.removeEventListener('click', handleLogout);

        if (currentUserRole === 'customer') {
            customerView.style.display = 'block'; displayMenu(); displayCart(); hideOrderConfirmation();
            if (submitOrderBtn) submitOrderBtn.addEventListener('click', submitOrder);
        } else if (currentUserRole === 'employee') {
            employeeView.style.display = 'block'; displayOrders(); // Display orders when employee logs in
            if (clearAllOrdersBtn) clearAllOrdersBtn.addEventListener('click', clearAllOrders);
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
        if (loginButton) loginButton.removeEventListener('click', handleLogin);
        if (loginButton) loginButton.addEventListener('click', handleLogin);
    }

    // --- Event Listeners ---
    // Storage Listener - MODIFIED to reload orders data before displaying
    window.addEventListener('storage', (event) => {
        if (event.key === ORDERS_STORAGE_KEY && currentUserRole === 'employee') {
            console.log("Orders updated in another tab. Refreshing employee view...");
            // No need to reload allOrders globally, displayOrders now calls loadOrders itself
            displayOrders();
        }
    });

    // --- Initialization --- (Remains the same)
    if (currentUserName && currentUserRole) { showLoggedInState(); } else { showLoginState(); }

}); // End DOMContentLoaded
