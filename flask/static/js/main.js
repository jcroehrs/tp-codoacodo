const articulosForm = document.querySelector('#articulosForm')
let articulos = [];
let editar = false;
let idarticulo = null;

window.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch ("/api/articulos");
    const articulo = await response.json()
    articulos = articulo
    mostrarArticulos(articulos)
});


articulosForm.addEventListener("submit", async e => {
    e.preventDefault()
    const titulo = articulosForm["producto"].value
    const descripcion = articulosForm["descripcion"].value
    const imagen = articulosForm["foto"].value
    const activo = true
    console.log(titulo, descripcion, imagen)

if(!editar){
  const response = await fetch("/api/articulos", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        titulo,
        descripcion,
        imagen,
        activo
    })
});

const producto = await response.json()

articulos.unshift(producto)
}else{
  console.log("editando...")
  const response = await fetch(`/api/articulos/${idarticulo}`, {
    method  : "PUT",
    headers: {
      "Content-Type": "application/json",
  },
    body: JSON.stringify({
      titulo,
      descripcion,
      imagen,
      activo,
    }),
  });
  const articuloEditado = await response.json();
  articulos = articulos.map((articulo) => articulo.id === articuloEditado.id ? articuloEditado : articulo);
}
mostrarArticulos(articulos)

articulosForm.reset();

    
})


function mostrarArticulos(articulos){
    const listaArticulos = document.querySelector('#listaArticulos')
    listaArticulos.innerHTML = ""
    articulos.forEach((articulo) => {
        const arti = document.createElement("article");
        arti.innerHTML = `
        
        <h3>${articulo.titulo}</h3>
          <div><img class="dibu1" src="${articulo.imagen}" </div>
          <p>
            Descripción: ${articulo.descripcion} <br>Autor: Mauricio Maeterlinck. <br> CABALLITO
          </p>
        </article>
        
        
        
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
        const btnEditar = arti.querySelector(".btn-editar")
        btnEditar.addEventListener("click", async (e) =>{
          const response = await fetch(`/api/articulos/${articulo.id}`);
          const data = await response.json();
          articulosForm["producto"].value = data.titulo;
          articulosForm["descripcion"].value = data.descripcion;
          articulosForm["foto"].value = data.imagen;
          editar = true;
          idarticulo = articulo.id;
          
          
        });
        listaArticulos.append(arti)
    });
}