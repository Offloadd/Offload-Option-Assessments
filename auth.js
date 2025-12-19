// ============================================================================
// FIREBASE AUTH FUNCTIONS
// ============================================================================

async function handleCreateAccount() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const btn = document.getElementById('createAccountBtn');
    
    if (!email || !password) {
        showAuthMessage('Please enter email and password', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    btn.disabled = true;
    btn.textContent = 'Creating Account...';
    
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        showAuthMessage('Account created successfully!', 'success');
    } catch (error) {
        console.error('Create account error:', error);
        showAuthMessage(getFirebaseErrorMessage(error), 'error');
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }
}

async function handleSignIn() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const btn = document.getElementById('signInBtn');
    
    if (!email || !password) {
        showAuthMessage('Please enter email and password', 'error');
        return;
    }
    
    btn.disabled = true;
    btn.textContent = 'Signing In...';
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.error('Sign in error:', error);
        showAuthMessage(getFirebaseErrorMessage(error), 'error');
        btn.disabled = false;
        btn.textContent = 'Sign In';
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
        state.entries = [];
        render();
        displayEntries();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out: ' + error.message);
    }
}

function showAuthMessage(message, type) {
    const authMessage = document.getElementById('authMessage');
    authMessage.textContent = message;
    authMessage.className = 'auth-message show ' + (type === 'success' ? 'success' : '');
}

function getFirebaseErrorMessage(error) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered. Try signing in instead.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled. Please contact support.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.'
    };
    
    return errorMessages[error.code] || error.message;
}
