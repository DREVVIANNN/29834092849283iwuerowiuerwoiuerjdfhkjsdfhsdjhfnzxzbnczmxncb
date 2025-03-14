let bitcoin = 0;
        let upgradeCost = 10;
        let user = null;
        let miningPower = 1;

        document.getElementById("mine-btn").addEventListener("click", () => {
            bitcoin += 1 * miningPower;
            updateUI();
        });

        document.getElementById("upgrade-btn").addEventListener("click", () => {
            if (bitcoin >= upgradeCost) {
                bitcoin -= upgradeCost;
                miningPower++;
                upgradeCost = Math.floor(upgradeCost * 1.5);
                updateUI();
            }
        });

        function updateUI() {
            document.getElementById("bitcoin").textContent = bitcoin;
            document.getElementById("upgrade-cost").textContent = upgradeCost;
        }

        document.getElementById("login-google").addEventListener("click", () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).then(result => {
                user = result.user;
                document.getElementById("username").textContent = `Welcome, ${user.displayName}`;
                document.getElementById("user-photo").src = user.photoURL;
                document.getElementById("user-photo").style.display = "block";
                document.getElementById("user-info").style.display = "flex";
                document.getElementById("login-google").style.display = "none";
                loadUserData();
            }).catch(error => {
                console.error("Login Failed", error);
            });
        });
        
        document.getElementById("logout-btn").addEventListener("click", () => {
            auth.signOut().then(() => {
                document.getElementById("user-info").style.display = "none";
                document.getElementById("login-google").style.display = "block";
                document.getElementById("username").textContent = "";
                document.getElementById("user-photo").style.display = "none";
            });
        });
        
        function loadUserData() {
            if (user) {
                const userRef = db.collection("users").doc(user.uid);
                userRef.get().then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        bitcoin = data.bitcoin || 0;
                        upgradeCost = data.upgradeCost || 10;
                        document.getElementById("bitcoin").textContent = bitcoin;
                        document.getElementById("upgrade-cost").textContent = upgradeCost;
                        document.getElementById("user-photo").src = user.photoURL;
                        document.getElementById("user-photo").style.display = "block";
                    }
                });
            }
        }
        
        function saveUserData() {
            if (user) {
                const userRef = db.collection("users").doc(user.uid);
                userRef.set({
                    bitcoin: bitcoin,
                    upgradeCost: upgradeCost,
                    miningPower: miningPower,
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
        const storage = firebase.storage();