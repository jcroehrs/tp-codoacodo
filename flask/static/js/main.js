const articulosForm = document.querySelector('#articulosForm')
let articulos = [];

window.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch ("/api/articulos");
    const articulo = await response.json()
    articulos = articulo
    mostrarArticulos(articulos)
});


articulosForm.addEventListener("submit", async e => {
    e.preventDefault()
    const titulo = articulosForm["producto"].value
    const descripcion = articulosForm["descripción"].value
    const imagen = articulosForm["foto"].value
    const activo = true
    console.log(titulo, descripcion, imagen)

const response = await fetch("/api/articulos", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        titulo,
        descripcion,
        imagen,
        activo
    })
})
const producto = await response.json()

articulos.unshift(producto)
mostrarArticulos(articulos)
console.log(producto)
articulosForm.reset();

    
})


function mostrarArticulos(articulos){
    const listaArticulos = document.querySelector('#listaArticulos')
    listaArticulos.innerHTML = ""
    articulos.forEach((articulo) => {
        const arti = document.createElement("li");
        arti.innerHTML = `
        <article>
        <h3>${articulo.titulo}</h3>
          <div><img class="dibu1" src="../static/img/art_250x250_libro1.png" alt="libro"></div>
          <p>
            ${articulo.descripcion} <br>Autor: Mauricio Maeterlinck. <br> CABALLITO
          </p>
        </article>
        
        
        <p>${articulo.imagen}</p>
        <div>
            <button class="btn-borrar">Borrar</button>
            <button class="btn-editar">Editar</button>
        </div>
        `;
        const btnBorrar = arti.querySelector(".btn-borrar");

        btnBorrar.addEventListener("click", async (e) => {
          const response = await fetch(`/api/articulos/${articulo.id}`, {
            method: "DELETE"
          });
    
          const data = await response.json();
    
          articulos = articulos.filter((articulo) => articulo.id !== data.id);
          mostrarArticulos(articulos);
        });
        listaArticulos.append(arti)
    })
}