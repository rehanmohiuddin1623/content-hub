const BACKEND_URL="https://content-hub-tlr4.onrender.com";

const signin = async ({ username, password }) => {
  try {
    const rawResp = await fetch(`${BACKEND_URL}/login`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const resp = await rawResp.json();
    console.log(resp);
    localStorage.setItem("user", JSON.stringify(resp.message));
    window.location.href = "/";
  } catch (err) {
    console.log(err);
  }
};

const login = (e) => {
  e.preventDefault();
  const [username, password] = [
    document.querySelector('[name="username"]').value,
    document.querySelector('[name="password"]').value,
  ];
  signin({ username, password });
  console.log({ username, password });
};

const form = document.getElementById("login-form");

form.addEventListener("submit", login);
