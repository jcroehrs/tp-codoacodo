document.addEventListener("DOMContentLoaded", function() {
    // declaro constantes que escribiran el html con los nombres y datos obtenidos de la api
    const contenedor = document.getElementById('contenedor-integrantes');//Hace la relacion del id del div
    const integranteCopia = document.getElementById('integrante-template').content; //Hace la reclacion al template con el id integrante-template
    const nombres = ["Fabián Fucci", "Juan Carlos Roehrs", "Matias Ferrari", "Pablo Maison"]; // arma la lista con el nombre de los integrantes

    function AgregarIntegrante() {
        let contador = 0;
        let maxIntentos = 20;  // En esta variable se pone la cantidad de intentos que se consultara a la api
        let exitos = 0; // Con esta variable se controla la cantidad de hombre que se encontraron en la api
        let totalIntegrantes = 4; // Con esta variable ponemos las cantidad de integrantes que sean hombres queremos mostrar

        function fetchIntegrante() {
            if (exitos < totalIntegrantes && contador < maxIntentos) {
                // caemos la llamada a la api, para traer la informacion
                fetch("https://randomuser.me/api")
                    .then(response => response.json())
                    .then(data => {
                        // Procesamiento de la informacion que llega de la API
                        let genero = data.results[0].gender; // defenimos el genero con la informacion de la api
                        console.log(genero);

                        if (genero === "male") {// Hacemos el control del genero y armamos el objeto con la informacion de la api de cumplir la condicion
                            let nuevoIntegrante = integranteCopia.cloneNode(true);
                            nuevoIntegrante.querySelector("#Foto").src = data.results[0].picture.medium;
                            nuevoIntegrante.querySelector("#Foto").alt = "foto CV";
                            nuevoIntegrante.querySelector("#Nombre").innerHTML = nombres[exitos];
                            contenedor.appendChild(nuevoIntegrante);// se relaciona el objeto con el id contenedor
                            exitos++;
                        }

                        contador++;
                        console.log("Intentos: " + contador + ", Éxitos: " + exitos);

                        if (exitos < totalIntegrantes && contador < maxIntentos) {
                            fetchIntegrante();
                        } else if (exitos < totalIntegrantes) {
                            console.log("No se encontraron suficientes integrantes con el género 'male' en " + maxIntentos + " intentos.");
                        }
                    })
                    .catch(error => console.log("Ocurrió un error con la api! " + error));
            }
        }

        fetchIntegrante();//Se agrega el objeto al html
    }

    AgregarIntegrante();//Se llama a la funcion
});
