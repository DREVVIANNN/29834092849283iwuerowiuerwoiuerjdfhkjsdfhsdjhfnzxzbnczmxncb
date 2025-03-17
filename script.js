    let bitdrevv = 0;
        let upgradeCost = 10;
        let miningPower = 1;
        let user = null;

        document.getElementById("mine-btn").addEventListener("click", () => {
            bitdrevv += 1 * miningPower;
            updateUI();
            saveUserData();
        });

        document.getElementById("upgrade-btn").addEventListener("click", () => {
            if (bitdrevv >= upgradeCost) {
                bitdrevv -= upgradeCost;
                miningPower++;
                upgradeCost = Math.ceil(upgradeCost * 5);
                updateUI();
                saveUserData();
            }
        });

        function updateUI() {
            document.getElementById("bitdrevv").textContent = bitdrevv;
            document.getElementById("upgrade-cost").textContent = upgradeCost;
        }

        function saveUserData() {
            if (auth.currentUser) {
                const userRef = db.collection("users").doc(user.uid);
                user && user.uid && db.collection("users").doc(user.uid).set({
                    bitdrevv: bitdrevv,
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
                        bitdrevv = data.bitdrevv || 0;
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
        
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const userRef = db.collection("users").doc(user.uid);
                
                userRef.get().then((doc) => {
                    if (!doc.exists) {
                        // If new user, create user doc
                        userRef.set({
                            uid: user.uid,
                            username: user.displayName,
                            photoURL: user.photoURL,
                            email: user.email,
                            verified: user.email === "sigmaboys968573@gmail.com" // Auto verify
                        });
                    } else {
                        // Update verified status if it's the correct email
                        if (user.email === "sigmaboys968573@gmail.com" && !doc.data().verified) {
                            userRef.update({ verified: true });
                        }
                    }
                }).catch(error => {
                    console.error("Error updating user:", error);
                });
            }
        });
        

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
                        bitdrevv = parseInt(localStorage.getItem("bitdrevv")) || 10; // New users get 10 BTD
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
                bitdrevv = 0;
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
                        bitdrevv = data.bitdrevv || 0;
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
        
        
        function googleLogin() {
            const provider = new firebase.auth.GoogleAuthProvider();
        
            firebase.auth().signInWithPopup(provider)
                .then(result => {
                    const user = result.user;
                    if (user) {
                        document.getElementById("username").textContent = user.displayName;
                        document.getElementById("login-google").style.display = "none";
                        document.getElementById("logout-btn").style.display = "block";
                        document.getElementById("user-info").style.display = "flex";
                        document.getElementById("user-photo").src = user.photoURL;
                        document.getElementById("user-photo").style.display = "block";
        
                        const userRef = db.collection("leaderboard").doc(user.uid);
        
                        userRef.get().then((doc) => {
                            if (!doc.exists) {
                                userRef.set({
                                    username: user.displayName || "Anonymous",
                                    btd: 0,  
                                    verified: false  // Default: Not verified
                                });
                            }
                        });
                    }
                })
                .catch(error => console.error("Login error:", error));
        }
        
        
        
        
        function saveUserData() {
            if (user) {
                console.log("📤 Saving progress for user:", user.uid);
        
                db.collection("users").doc(user.uid).set({
                    bitdrevv: bitdrevv,
                    upgradeCost: upgradeCost,
                    miningPower: miningPower,
                }).then(() => {
                    console.log("✅ Progress saved successfully.");
                }).catch(error => {
                    console.error("❌ Error saving progress:", error);
                });
            } else {
                console.log("🟡 No logged-in user. Saving progress to local storage...");
                localStorage.setItem("bitdrevv", bitdrevv);
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
            bitdrevv = parseInt(localStorage.getItem("bitdrevv")) || 0;
            upgradeCost = parseInt(localStorage.getItem("upgradeCost")) || 10;
            miningPower = parseInt(localStorage.getItem("miningPower")) || 1;
    
            updateUI();
        }
    });

    function mineBitdrevv() {
        let bitdrevv = parseInt(localStorage.getItem("bitdrevv") || "0");
        bitdrevv += 10; 
        localStorage.setItem("bitdrevv", bitdrevv);
        document.getElementById("bitdrevv").textContent = bitdrevv;
    
        const user = firebase.auth().currentUser;
        if (user) {
            const userRef = db.collection("leaderboard").doc(user.uid);
    
            userRef.get().then(doc => {
                if (doc.exists) {
                    let data = doc.data();
                    userRef.set({
                        username: user.displayName || "Anonymous",
                        btd: bitdrevv,
                        verified: data.verified || false // Keep the verified status
                    }, { merge: true });
                }
            }).catch(error => console.error("Firestore update error:", error));
        }
    }
    
    
    

    function displayLeaderboard() {
        const leaderboardRef = db.collection("leaderboard").orderBy("btd", "desc");
    
        leaderboardRef.onSnapshot((snapshot) => {
            const leaderboardList = document.getElementById("leaderboard-list");
            leaderboardList.innerHTML = ""; // Clear old data
    
            snapshot.forEach((doc) => {
                const data = doc.data();
                const listItem = document.createElement("li");
    
                // Check if user is verified
                const verifiedBadge = data.verified ? '<span id="verified-badge"><i class="ri-verified-badge-fill"></i></span>' : "";
    
                listItem.innerHTML = `<strong>${data.username}</strong> ${verifiedBadge} - ${data.btd} BTD`;
                leaderboardList.appendChild(listItem);
            });
        }, (error) => {
            console.error("Error fetching leaderboard:", error);
        });
    }
    
    // Load leaderboard when page opens
    document.addEventListener("DOMContentLoaded", displayLeaderboard);
    
    
    
    const emailRef = db.collection("emails");

// Check if logged-in user is the developer
firebase.auth().onAuthStateChanged((user) => {
    if (user && user.email === "fazrelmsyamil@gmail.com") {
        document.getElementById("send-email-container").style.display = "block";
    }
});

// Function to send email (only for the developer)
function sendEmail() {
    const message = document.getElementById("email-message").value;
    if (!message) return;

    const user = firebase.auth().currentUser;

    emailRef.add({
         username: user.displayName,
        photoURL: user.photoURL,
        verified: true, // Developer is verified
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: message,
        loves: 0,
        lovedBy: {}
    }).then(() => {
        document.getElementById("email-message").value = "";
        alert("Email sent to all players!");
    }).catch((error) => {
        console.error("Error sending email:", error);
    });
}

function loveMessage(emailId) {
    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You need to log in to love messages!");
        return;
    }

    const emailRef = db.collection("emails").doc(emailId);

    db.runTransaction(async (transaction) => {
        const doc = await transaction.get(emailRef);
        if (!doc.exists) {
            throw "Document does not exist!";
        }

        let data = doc.data();
        let lovesByUsers = data.lovedBy || {}; // Track loves
        let currentLoves = data.loves || 0;

        if (lovesByUsers[user.uid]) {
            // User already loved it, so remove
            delete lovesByUsers[user.uid];
            currentLoves--;
        } else {
            // User hasn't loved it, so add
            lovesByUsers[user.uid] = true;
            currentLoves++;
        }

        // Update Firestore
        transaction.update(emailRef, { loves: currentLoves, lovedBy: lovesByUsers });
    }).catch((error) => {
        console.error("Error updating love:", error);
    });
}




function loadEmails() {
    db.collection("emails").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        const emailList = document.getElementById("email-list");
        emailList.innerHTML = ""; // Clear previous messages

        snapshot.forEach((doc) => {
            const data = doc.data();
            let loveCount = data.lovedBy ? Object.keys(data.lovedBy).length : 0;

            const listItem = document.createElement("li");

            const date = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : "Just now";
            let usernameHTML = `<strong>${data.username}</strong>`;
            if (data.verified) {
                usernameHTML += ' <span id="verified-badge"><i class="ri-verified-badge-fill"></i></span>';
            }

            listItem.innerHTML = `
                <div class="email-header">
                    <img class="user-photo" src="${data.photoURL || 'default-avatar.png'}" alt="Profile">
                    <div>
                        <span>${usernameHTML}</span>
                        <small>${date}</small>
                    </div>
                </div>
                <p class="email-message">${data.message}</p>
                <a class="love-btn" onclick="loveMessage('${doc.id}')">
                    <i class="ri-heart-fill"></i> <span id="love-count-${doc.id}">${loveCount}</span>
                </a>
            `;

            emailList.appendChild(listItem);
        });
    });
}






// Load emails on page load
document.addEventListener("DOMContentLoaded", loadEmails);




 
    
    