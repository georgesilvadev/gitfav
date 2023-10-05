import { GithubUser } from "./GithubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username);

      if (userExists) {
        throw new Error("Usuário já cadastrado");
      }

      const user = await GithubUser.search(username);
      if (user.login === undefined) {
        throw new Error("Usuário não localizado");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();

    } catch (error) {
      alert(error.message);
    }
  }

  delete(username) {
    const filteredEntries = this.entries.filter((entry) => 
    entry.login !== username);

    this.entries = filteredEntries;
    this.update();
    this.save();}

}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    //pesquisa a tag "tbody"
    this.tbody = this.root.querySelector("#table table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector("#favorite");

    addButton.onclick = () => {
      const { value } = this.root.querySelector("#input-search");
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".action button").onclick = () => {
        const isOk = confirm("Tem certeza que deseja remover esse usuário?");

        if (isOk) {
          console.log(user)
          this.delete(user.login);
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <!-- coluna do Usuário -->
    <td class="user">
        <img class="profile" src="https://github.com/maykbrito.png" alt="Imagem de Mayk Brito">
        <a href="https://github.com/maykbrito">
            <p>Mayk Brito</p>
            <span>maykbrito</span>
        </a>
    </td>

    <!-- coluna dos repositorios -->
    <td class="repositories">
        123
    </td>

    <!-- coluna dos Seguidores -->
    <td class="followers">
        12345
    </td>

    <!-- coluna da ação -->
    <td class="action">
        <button class="button-remove">Remover</button>
    </td>`;

    return tr;
  }

  removeAllTr() {
    //pesquisa todas linhas do tbody
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
