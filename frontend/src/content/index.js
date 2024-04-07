const quill = new Quill("#editor", {
  theme: "snow",
});

const createContent = async (ops) => {
  try {
    console.log("ops", document.getElementById("title").value);
    const rawResp = await fetch("http://127.0.0.1:3000/blogs", {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: ops,
        title: document.getElementById("title").value,
      }),
    });
    const resp = await rawResp.json();
    window.location.href = "/frontend/";
  } catch (err) {
    console.log(err);
  }
};

const oncreate = () => {
  const { ops } = quill.getContents();
  createContent(ops);
  console.log("oncreate", ops);
};
