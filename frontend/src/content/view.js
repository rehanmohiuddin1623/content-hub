const BACKEND_URL="https://content-hub-tlr4.onrender.com";
const quill = new Quill("#editor", {
  theme: "snow",
});

const fetchContent = async (contentId) => {
  try {
    const rawResp = await fetch(`${BACKEND_URL}/blog/${contentId}`, {
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

document.addEventListener("DOMContentLoaded", async () => {
  const [, contentId] = window.location.search.split("contentId=");

  const { message = { content: [], title: "" } } = await fetchContent(
    contentId
  );
  quill.setContents(message.content);
  quill.enable(false);
  document.getElementById("title").value = message.title;
});
