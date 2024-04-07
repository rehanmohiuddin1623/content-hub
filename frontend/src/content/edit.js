const quill = new Quill("#editor", {
  theme: "snow",
});

const fetchContent = async (contentId) => {
  try {
    const rawResp = await fetch(`http://127.0.0.1:3000/blog/${contentId}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resp = await rawResp.json();
    console.log(resp);
    return resp;
  } catch (err) {
    console.log(err);
  }
};

const onedit = async () => {
  try {
    const [, contentId] = window.location.search.split("contentId=");
    const { ops } = quill.getContents();
    const rawResp = await fetch(`http://127.0.0.1:3000/blog`, {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: contentId,
        content: ops,
        title: document.getElementById("title").value,
      }),
    });
    const resp = await rawResp.json();
    window.location.href = "/frontend/";
    return resp;
  } catch (err) {
    console.log(err);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const [, contentId] = window.location.search.split("contentId=");

  const { message = { content: [], title: "" } } = await fetchContent(
    contentId
  );
  quill.setContents(message.content);
  document.getElementById("title").value = message.title;
});
