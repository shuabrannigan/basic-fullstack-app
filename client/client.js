const form = document.querySelector(".app-form");
const loadingElement = document.querySelector(".loading");
const responseElement = document.querySelector(".responses");

const API_URL = "http://localhost:3000/item";
const DELETE_URL = "http://localhost:3000/item/id";

// loading gif not visible by default

loadingElement.style.display = "";

listAllItems();



//listen to when user submits form and insert data into db
form.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content");

  const item = {
    name,
    content
  };
  console.log(item);

  // make for display none, revert loading icon display.
  loadingElement.style.display = "";
  form.style.display = "none";

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(item),
    headers: {
      "content-type": "application/json"
    }
  })
    .then(response => response.json())
    .then(createddbItem => {
      console.log(createddbItem);
      form.reset();
      loadingElement.style.display = "none";
      form.style.display = "";
      listAllItems();
    });
});


// function creates table items with data from db
function listAllItems() {
  responseElement.innerHTML = "";
  fetch(API_URL)
    .then(response => response.json())
    .then(items => {
      console.log(items);
      items.reverse();
      items.forEach(item => {
        const id = item._id;
        const tr = document.createElement("tr");
        tr.setAttribute("class", "res-contain");
        tr.setAttribute("id", id);

        const header = document.createElement("td");
        header.textContent = item.name;

        const contents = document.createElement("td");
        contents.textContent = item.content;

        const date = document.createElement("td");
        date.textContent = new Date(item.created);

        const Delete = document.createElement("button");
        Delete.textContent = "Delete";
        Delete.setAttribute("class", "delete");
        Delete.setAttribute("type", "sumbit");
        Delete.setAttribute("onclick", "deleteElement()");

        tr.appendChild(header);
        tr.appendChild(contents);
        tr.appendChild(date);
        tr.appendChild(Delete);

        responseElement.appendChild(tr);
      });
      loadingElement.style.display = "none";
    });
}


// Delete Function 
function deleteElement() {
  const tableItem = document.querySelector(".res-contain");
  const id = tableItem.id;
  console.log(id);

  const item = {
    id
  };

  fetch(DELETE_URL, {
    method: "DELETE",
    body: JSON.stringify(item),
    headers: {
      "content-type": "application/json"
    }
  })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse);
      listAllItems();
    });
}
