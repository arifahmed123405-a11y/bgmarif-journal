document.addEventListener("DOMContentLoaded", () => {

const SUPABASE_URL = "https://wiofipsuzqokzgssbsba.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpb2ZpcHN1enFva3pnc3Nic2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTA3ODYsImV4cCI6MjA5MDgyNjc4Nn0.DwOl39cDzNnCHqwnlzzYBSIhsTvI87nldgYRSDXGwc0"; // paste correct one

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// UI refs
const loginScreen = document.getElementById("loginScreen");
const signupScreen = document.getElementById("signupScreen");
const appScreen = document.getElementById("appScreen");

// NAV
document.getElementById("gotoSignup").onclick = () => {
    loginScreen.classList.add("hidden");
    signupScreen.classList.remove("hidden");
};

document.getElementById("gotoLogin").onclick = () => {
    signupScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
};

// LOGIN
document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await client.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        document.getElementById("loginError").innerText = error.message;
    } else {
        loadApp();
    }
};

// SIGNUP
document.getElementById("signupBtn").onclick = async () => {
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    const { error } = await client.auth.signUp({
        email,
        password
    });

    if (error) {
        document.getElementById("signupError").innerText = error.message;
    } else {
        alert("Check email for confirmation");
    }
};

// LOGOUT
document.getElementById("logoutBtn").onclick = async () => {
    await client.auth.signOut();
    location.reload();
};

// LOAD APP
async function loadApp() {
    const { data: { user } } = await client.auth.getUser();

    loginScreen.classList.add("hidden");
    signupScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");

    document.getElementById("userEmail").innerText = user.email;

    loadTrades();
}

// CREATE ACCOUNT (NO risk_per_trade anymore)
document.getElementById("createAcc").onclick = async () => {
    const name = document.getElementById("accName").value;
    const balance = document.getElementById("accBalance").value;

    const { data: { user } } = await client.auth.getUser();

    const { error } = await client.from("accounts").insert([{
        user_id: user.id,
        name,
        starting_balance: balance
    }]);

    if (error) alert(error.message);
    else alert("Account created");
};

// ADD TRADE
document.getElementById("addTrade").onclick = async () => {
    const amount = document.getElementById("tradeAmount").value;

    const { data: { user } } = await client.auth.getUser();

    const { error } = await client.from("trades").insert([{
        user_id: user.id,
        result: amount
    }]);

    if (error) alert(error.message);
    else loadTrades();
};

// LOAD TRADES
async function loadTrades() {
    const { data } = await client.from("trades").select("*");

    const container = document.getElementById("trades");
    container.innerHTML = "";

    data.forEach(trade => {
        const div = document.createElement("div");
        div.innerText = `$${trade.result}`;
        container.appendChild(div);
    });
}

});
