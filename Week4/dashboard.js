const apiUrl = 'api.php';

async function callApi(action, payload = {}) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action, ...payload })
        });

        if (response.status === 401) {
            window.location.href = 'login.php';
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('API error', error);
        return { error: 'Unable to contact server' };
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

async function loadBalance() {
    const result = await callApi('getBalance');
    if (!result || result.error) return;
    document.getElementById('balance').textContent = formatCurrency(result.balance);
}

async function loadTransactions() {
    const result = await callApi('getTransactions');
    if (!result || result.error) return;
    const list = document.getElementById('transactionsList');
    list.innerHTML = result.transactions.length ? '' : '<p>No transactions found.</p>';

    result.transactions.forEach(tx => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.innerHTML = `
            <span>${tx.type.toUpperCase()}</span>
            <span>${formatCurrency(tx.amount)}</span>
            <span>${new Date(tx.created_at).toLocaleString()}</span>
        `;
        list.appendChild(item);
    });
}

async function deposit() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (!amount || amount <= 0) return alert('Enter a valid deposit amount.');
    const result = await callApi('deposit', { amount });
    if (result.error) return alert(result.error);
    await refreshDashboard();
    document.getElementById('amount').value = '';
}

async function withdraw() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (!amount || amount <= 0) return alert('Enter a valid withdrawal amount.');
    const result = await callApi('withdraw', { amount });
    if (result.error) return alert(result.error);
    await refreshDashboard();
    document.getElementById('amount').value = '';
}

async function refreshDashboard() {
    await loadBalance();
    await loadTransactions();
}

document.addEventListener('DOMContentLoaded', refreshDashboard);
