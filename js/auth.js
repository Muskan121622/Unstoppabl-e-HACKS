// Authentication handling with MetaMask

const auth = {
    userAddress: null,

    init: async function () {
        const connectBtn = document.getElementById('connect-wallet');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => this.connect());
        }

        // Check if already connected
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    this.handleAccountsChanged(accounts);
                }
            } catch (error) {
                console.error('Error checking accounts:', error);
            }

            // Listen for changes
            window.ethereum.on('accountsChanged', (accounts) => this.handleAccountsChanged(accounts));
        }
    },

    connect: async function () {
        if (!window.ethereum) {
            alert('MetaMask is not installed. Please install it to use this feature.');
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.handleAccountsChanged(accounts);
        } catch (error) {
            console.error('User denied account access', error);
        }
    },

    handleAccountsChanged: function (accounts) {
        if (accounts.length === 0) {
            this.userAddress = null;
            this.updateUI(false);
        } else {
            this.userAddress = accounts[0];
            this.updateUI(true);
        }
    },

    updateUI: function (isConnected) {
        const connectBtn = document.getElementById('connect-wallet');
        if (!connectBtn) return;

        if (isConnected) {
            const shortAddress = `${this.userAddress.substring(0, 6)}...${this.userAddress.substring(38)}`;
            connectBtn.textContent = shortAddress;
            connectBtn.classList.add('connected');
            connectBtn.title = 'Connected: ' + this.userAddress;
        } else {
            connectBtn.textContent = 'Connect Wallet';
            connectBtn.classList.remove('connected');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});
