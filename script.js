    let bitcoin = 0;
        let upgradeCost = 10;
        let miningPower = 1;
        let user = null;

        document.getElementById("mine-btn").addEventListener("click", () => {
            bitcoin += 1 * miningPower;
            updateUI();
            saveUserData();
        });

        document.getElementById("upgrade-btn").addEventListener("click", () => {
            if (bitcoin >= upgradeCost) {
                bitcoin -= upgradeCost;
                miningPower++;
                upgradeCost = Math.ceil(upgradeCost * 1.5);
                updateUI();
                saveUserData();
            }
        });

        function updateUI() {
            document.getElementById("bitcoin").textContent = bitcoin;
            document.getElementById("upgrade-cost").textContent = upgradeCost;
        }

        function saveUserData() {
            if (auth.currentUser) {
                const userRef = db.collection("users").doc(user.uid);
                user && user.uid && db.collection("users").doc(user.uid).set({
                    bitcoin: bitcoin,
                    upgradeCost: upgradeCost,
                    miningPower: miningPower
                });
            }
        }

        function loadUserData() {
            if (user) {
                const userRef = db.collection("users").doc(user.uid);
                userRef.get().then((doc) => {
                    if (doc.exists) {
                        let data = doc.data();
                        bitcoin = data.bitcoin || 0;
                        coins = data.coins || 0;
                        upgradeCost = data.upgradeCost || 10;
                        miningPower = data.miningPower || 1;
                        updateUI();
        
                        // Show Blue Verified Badge for Developer
                        if (user.email === "fazrelmsyamil@gmail.com") {
                            document.getElementById("verified-badge").style.display = "inline";
                        }
                    }
                });
            }
        }
        

        document.getElementById("login-google").addEventListener("click", () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then((result) => {
                user = result.user;
                document.getElementById("user-photo").src = user.photoURL;
                document.getElementById("user-photo").style.display = "block";
                document.getElementById("user-info").style.display = "flex";
                document.getElementById("username").textContent = user.displayName;
                document.getElementById("login-google").style.display = "none";
                document.getElementById("logout-btn").style.display = "block";
        
                const userRef = db.collection("users").doc(user.uid);
                
                // Check if the user already has data in Firestore
                userRef.get().then((doc) => {
                    if (doc.exists) {
                        // Load existing Firebase data
                        console.log("User found in database, loading progress...");
                         // Check if the user is the developer
            const isDeveloper = (user.email === "fazrelmsyamil@gmail.com");

            // Store user data in Firestore
            const userRef = db.collection("users").doc(user.uid);
            userRef.set({
                email: user.email,
                username: user.displayName,
                verified: isDeveloper, // Save verified status
            }, { merge: true }) // Prevent overwriting existing data

                        loadUserData();
                    } else {
                        // 🚀 Transfer guest progress to Firestore if available
                        bitcoin = parseInt(localStorage.getItem("bitcoin")) || 50; // New users get 50 BTC
                        upgradeCost = parseInt(localStorage.getItem("upgradeCost")) || 10;
                        miningPower = parseInt(localStorage.getItem("miningPower")) || 1;
        
                        // Save transferred progress to Firestore
                        saveUserData();
                    }
                });
            });
        });
        

        document.getElementById("logout-btn").addEventListener("click", () => {
            firebase.auth().signOut().then(() => {
                user = null;
                bitcoin = 0;
                upgradeCost = 10;
                miningPower = 1;
                updateUI();
                document.getElementById("user-info").style.display = "none";
                document.getElementById("login-google").style.display = "block";
            });
        });

        function loadUserData() {
            if (auth.currentUser) {
                const userRef = db.collection("users").doc(auth.currentUser.uid);
                userRef.get().then((doc) => {
                    if (doc.exists) {
                        let data = doc.data();
                        bitcoin = data.bitcoin || 0;
                        coins = data.coins || 0;
                        upgradeCost = data.upgradeCost || 10;
                        miningPower = data.miningPower || 1;
        
                        // **Check Verified Badge**
                        if (data.verified === true) {
                            document.getElementById("verified-badge").style.display = "inline-block";
                        } else {
                            document.getElementById("verified-badge").style.display = "none";
                        }
        
                        updateUI();
                    }
                });
            }
        }
        
        
        
        
        
        function saveUserData() {
            if (user) {
                console.log("📤 Saving progress for user:", user.uid);
        
                db.collection("users").doc(user.uid).set({
                    bitcoin: bitcoin,
                    upgradeCost: upgradeCost,
                    miningPower: miningPower,
                }).then(() => {
                    console.log("✅ Progress saved successfully.");
                }).catch(error => {
                    console.error("❌ Error saving progress:", error);
                });
            } else {
                console.log("🟡 No logged-in user. Saving progress to local storage...");
                localStorage.setItem("bitcoin", bitcoin);
                localStorage.setItem("upgradeCost", upgradeCost);
                localStorage.setItem("miningPower", miningPower);
            }
        }
        
        
        



const firebaseConfig = {
    apiKey: "AIzaSyBtmafoTlFm8EARO3i8kKVPOJjVph3On3M",
    authDomain: "login-77493.firebaseapp.com",
    projectId: "login-77493",
    storageBucket: "login-77493.firebasestorage.app",
    messagingSenderId: "851224192233",
    appId: "1:851224192233:web:eb95330e8ec6ae326bfc78"
  };
  firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => console.log("✅ Firebase Auth Persistence Enabled"))
    .catch(error => console.error("❌ Auth Persistence Error:", error));


    firebase.auth().onAuthStateChanged((loggedUser) => {
        if (loggedUser) {
            user = loggedUser;
            console.log("✅ User logged in:", user.displayName);
    
            // Update UI with user info
            document.getElementById("user-photo").src = user.photoURL;
            document.getElementById("user-photo").style.display = "block";
            document.getElementById("user-info").style.display = "flex";
            document.getElementById("username").textContent = user.displayName;
            document.getElementById("login-google").style.display = "none";
            document.getElementById("logout-btn").style.display = "inline";

            // **Check if the user is the developer, show blue checkmark**
        if (user.email === "fazrelmsyamil@gmail.com") {
            document.getElementById("verified-badge").style.display = "inline-block";
        } else {
            document.getElementById("verified-badge").style.display = "none";
        }
    
            // ✅ Call `loadUserData()` to retrieve progress from Firestore
            loadUserData();
        } else {
            console.log("🟡 No user logged in. Loading guest progress...");
    
            // Load progress from Local Storage for guests
            bitcoin = parseInt(localStorage.getItem("bitcoin")) || 0;
            upgradeCost = parseInt(localStorage.getItem("upgradeCost")) || 10;
            miningPower = parseInt(localStorage.getItem("miningPower")) || 1;
    
            updateUI();
        }
    });

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is logged in, set them online
            firebase.firestore().collection("leaderboard").doc(user.uid).set({
                online: true
            }, { merge: true });
    
            // Set user offline when they close the page
            window.addEventListener("beforeunload", () => {
                firebase.firestore().collection("leaderboard").doc(user.uid).set({
                    online: false
                }, { merge: true });
            });
        }
    });
    

    function displayLeaderboard() {
        const db = firebase.firestore();
        const leaderboardRef = db.collection("leaderboard").orderBy("btc", "desc");
    
        leaderboardRef.onSnapshot((snapshot) => {
            let leaderboardHTML = "<h2>Leaderboard</h2><ul>";
    
            snapshot.forEach((doc) => {
                let data = doc.data();
                if (data.online) { // Only show online users
                    leaderboardHTML += `<li>${data.username} - ${data.btc} BTC</li>`;
                }
            });
    
            leaderboardHTML += "</ul>";
            document.getElementById("leaderboard").innerHTML = leaderboardHTML;
        });
    }
    
    

    function mineBitcoin(userId, username) {
        const db = firebase.firestore();
        const userRef = db.collection("leaderboard").doc(userId);
    
        userRef.get().then((doc) => {
            let currentBtc = 0;
            if (doc.exists) {
                currentBtc = doc.data().btc;
            }
            
            // Update BTC and set user online
            userRef.set({ 
                username: username, 
                btc: currentBtc + 1, 
                online: true 
            }, { merge: true });
        });
    }
    

    
    
    
    
    


  