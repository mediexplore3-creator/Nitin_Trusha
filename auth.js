// auth.js - Shared authentication utilities
const firebaseConfig = {
  apiKey: "AIzaSyDg0IEoIbnoXZc79qgFGrWnAiJKtOUcdSU",
  authDomain: "nd-store-399c9.firebaseapp.com",
  projectId: "nd-store-399c9",
  storageBucket: "nd-store-399c9.firebasestorage.app",
  messagingSenderId: "789884520415",
  appId: "1:789884520415:web:9b78785ed3837d3c64666a",
  measurementId: "G-K4DXJFLXFZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Authentication state observer
function initAuthStateListener() {
  auth.onAuthStateChanged((user) => {
    updateNavigation(user);
    if (user) {
      // User is signed in
      console.log('User is signed in:', user.email);
    } else {
      // User is signed out
      console.log('User is signed out');
    }
  });
}

// Update navigation based on auth state
function updateNavigation(user) {
  const authLinks = document.getElementById('authLinks');
  const mobileAuthLinks = document.getElementById('mobileAuthLinks');
  
  if (!authLinks && !mobileAuthLinks) return;
  
  const authHTML = user ? `
        <li class="nav-user-profile">
            <a href="profile.html" class="user-avatar">
                <i class="fas fa-user-circle"></i>
                <span>Profile</span>
            </a>
            <ul class="user-dropdown">
                <li><a href="profile.html"><i class="fas fa-user"></i> My Profile</a></li>
                <li><a href="profile.html?tab=settings"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </li>
    ` : `
        <li><a href="form-login.html">Login/Register</a></li>
    `;
  
  const mobileAuthHTML = user ? `
        <li class="nav-user-profile mobile">
            <a href="profile.html" class="user-avatar">
                <i class="fas fa-user-circle"></i>
                <span>Profile</span>
            </a>
            <ul class="user-dropdown">
                <li><a href="profile.html"><i class="fas fa-user"></i> My Profile</a></li>
                <li><a href="profile.html?tab=settings"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="#" id="mobileLogoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        </li>
    ` : `
        <li><a href="form-login.html">Login/Register</a></li>
    `;
  
  if (authLinks) authLinks.innerHTML = authHTML;
  if (mobileAuthLinks) mobileAuthLinks.innerHTML = mobileAuthHTML;
  
  // Add logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener('click', handleLogout);
  }
}

// Handle logout
async function handleLogout(e) {
  e.preventDefault();
  try {
    await auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Error during logout. Please try again.');
  }
}

// Get current user data
async function getCurrentUserData() {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const userDoc = await db.collection('users').doc(user.uid).get();
    return userDoc.exists ? userDoc.data() : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

// Check if user is authenticated (for protected pages)
function requireAuth(redirectUrl = 'form-login.html') {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
        reject(new Error('User not authenticated'));
      }
    });
  });
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initAuthStateListener();
});