const apiUrl = 'api.php';

async function apiCall(action, payload = {}) {
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

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

async function loadDashboard() {
    const result = await apiCall('getBalance');
    if (!result || result.error) return alert(result.error || 'Failed to load dashboard.');

    document.getElementById('balance').textContent = formatCurrency(result.balance);
    document.getElementById('userEmail').textContent = result.email;
    loadTransactions();
}

async function loadTransactions() {
    const filters = {
        type: document.getElementById('filterType').value,
        from: document.getElementById('filterFrom').value,
        to: document.getElementById('filterTo').value,
    };

    const result = await apiCall('getTransactions', filters);
    if (!result || result.error) return alert(result.error || 'Unable to load transactions.');

    const list = document.getElementById('transactionsList');
    list.innerHTML = '';

    if (!result.transactions.length) {
        list.innerHTML = '<p class="empty-state">No transactions found.</p>';
        return;
    }

    result.transactions.forEach(tx => {
        const row = document.createElement('div');
        row.className = 'transaction-row';
        row.innerHTML = `
            <span class="tx-type ${tx.type}">${tx.type}</span>
            <span>${formatCurrency(tx.amount)}</span>
            <span>${new Date(tx.created_at).toLocaleString()}</span>
        `;
        list.appendChild(row);
    });
}

async function applyFilters() {
    await loadTransactions();
}

async function deposit() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (!amount || amount <= 0) return alert('Enter a valid amount.');
    const result = await apiCall('deposit', { amount });
    if (result.error) return alert(result.error);
    document.getElementById('amount').value = '';
    await loadDashboard();
}

async function withdraw() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (!amount || amount <= 0) return alert('Enter a valid amount.');
    const result = await apiCall('withdraw', { amount });
    if (result.error) return alert(result.error);
    document.getElementById('amount').value = '';
    await loadDashboard();
}

async function exportTransactions() {
    const type = document.getElementById('filterType').value;
    const from = document.getElementById('filterFrom').value;
    const to = document.getElementById('filterTo').value;
    const params = new URLSearchParams({ export: '1', type, from, to });
    const response = await fetch(`${apiUrl}?${params.toString()}`);

    if (!response.ok) {
        return alert('Export failed.');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'transactions.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', loadDashboard);
