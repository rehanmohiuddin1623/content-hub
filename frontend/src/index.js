const BACKEND_URL="https://content-hub-tlr4.onrender.com";

const getContentLists = async () => {
  try {
    const rawResp = await fetch(`${BACKEND_URL}/blogs`, {
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

const onDelete = async (contentId) => {
  try {
    const rawResp = await fetch(`${BACKEND_URL}/blogs/${contentId}`, {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resp = await rawResp.json();
    // window.location.href = "/";
    return resp;
  } catch (err) {
    console.log(err);
  }
};

// const deleteContent = document.getElementById("delete-content");

// deleteContent.addEventListener("click", async (e) => {
//   console.log(e);
// });

document.addEventListener("DOMContentLoaded", async () => {
  const contentResponse = await getContentLists();
  const contents = contentResponse.message;
  console.log(contentResponse);
  const user = JSON.parse(localStorage.getItem("user") || {});
  if (user.role === 0) {
    const mainAcion = document.getElementById("main-action");
    const button = document.createElement("button");
    button.onclick = () => {
      window.location.href = "/src/content/create.html";
    };
    button.innerHTML = "Add Content";
    mainAcion.appendChild(button);
  }
  const tbody = document.querySelector("tbody");
  if (!contents.length) {
    tbody.innerHTML = "No Data <br /> Please Add Some Content";
    tbody.style.textAlign = "center";
    tbody.style.padding = "2rem";
    return;
  }
  contents.forEach((content, index) => {
    const tableRow = document.createElement("tr");
    tableRow.id = content._id;
    const [noCell, titleCell, actionCell] = [
      document.createElement("td"),
      document.createElement("td"),
      document.createElement("td"),
    ];
    const actions = [
      document.createElement("a"),
      document.createElement("button"),
    ];
    noCell.innerHTML = index + 1;
    // titleCell.innerHTML = content.title || "No Title";
    // actionCell.append([...actions]);
    tableRow.appendChild(noCell);
    const title = document.createElement("a");
    title.href = `//src/content/view.html?contentId=${content._id}`;
    title.innerHTML = content.title || "No Title";
    title.classList.add("content-title");
    titleCell.appendChild(title);
    tableRow.appendChild(titleCell);
    actions[0].innerHTML = "Edit";
    actions[0].href = `//src/content/edit.html?contentId=${content._id}`;
    actions[1].innerHTML = "Delete";
    actions[1].onclick = () => {
      onDelete(content._id);
    };
    actionCell.appendChild(actions[0]);
    actionCell.appendChild(actions[1]);
    actionCell.classList.add("actions");
    tableRow.appendChild(actionCell);
    tbody.appendChild(tableRow);
  });
});

/*
<tr>
            <td>1</td>
            <td>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry
            </td>
            <td class="actions">
              <a href="#">Edit</a>
              <a href="#">Delete</a>
              <a href="#">View</a>
            </td>
          </tr>

  */
