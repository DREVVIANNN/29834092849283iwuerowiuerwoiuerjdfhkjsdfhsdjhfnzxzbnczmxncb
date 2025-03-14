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
                        bitcoin = doc.data().bitcoin || 0;
                        upgradeCost = doc.data().upgradeCost || 10;
                        miningPower = doc.data().miningPower || 1;
                    } else {
                        bitcoin = 50;
                        upgradeCost = 10;
                        saveUserData();
                    }
                    updateUI();
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
                loadUserData();
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
                        bitcoin = doc.data().bitcoin || 0;
                        upgradeCost = doc.data().upgradeCost || 10;
                        miningPower = doc.data().miningPower || 1;
                    } else {
                        // New users get 50 BTC for free
                        bitcoin = 50;
                        saveUserData();
                    }
                    updateUI();
                });
            }
        }
        
        
        function saveUserData() {
            if (auth.currentUser) {
                db.collection("users").doc(auth.currentUser.uid).set({
                    bitcoin: bitcoin,
                    upgradeCost: upgradeCost,
                    miningPower: miningPower
                });
            }
        }
        
        
        setInterval(saveUserData, 1000);

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
  