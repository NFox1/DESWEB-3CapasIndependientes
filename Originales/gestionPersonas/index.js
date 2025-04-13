function guardarDatosPersona() {
  const nombre = document.getElementById("nombre").value;
  const dni = document.getElementById("dni").value;
  const fechaNacimiento = document.getElementById("fechaNacimiento").value;
  const direccion = document.getElementById("direccion").value;

  if (!nombre || !dni || !fechaNacimiento || !direccion) {
      alert("Por favor, complete todos los campos.");
      return;
  }

  const persona = {
      nombre: nombre,
      dni: dni,
      fechaNacimiento: fechaNacimiento,
      direccion: direccion
  };

  // Obtener los registros guardados desde localStorage (si existen)
  let personasGuardadas = JSON.parse(localStorage.getItem("personas")) || [];

  // Agregar la nueva persona al arreglo
  personasGuardadas.push(persona);

  // Guardar los datos en localStorage como un string JSON
  localStorage.setItem("personas", JSON.stringify(personasGuardadas));

  // Mostrar un mensaje indicando que los datos fueron guardados
  alert("Datos guardados exitosamente.");

  // Mostrar los datos guardados automáticamente
  mostrarDatosGuardados();
  mostrarTodosLosRegistros();
}

// Función para consultar y mostrar los datos guardados desde localStorage
function mostrarDatosGuardados() {
  // Obtener los datos guardados desde localStorage
  const personaGuardada = localStorage.getItem("personas");

  const datosDiv = document.getElementById("datosGuardados");

  if (personaGuardada) {
      const persona = JSON.parse(personaGuardada);

      // Mostrar los datos en el div con id "datosGuardados"
      datosDiv.innerHTML = `
          <strong>Nombre:</strong> ${persona.nombre} <br>
          <strong>DNI:</strong> ${persona.dni} <br>
          <strong>Fecha de Nacimiento:</strong> ${persona.fechaNacimiento} <br>
          <strong>Dirección:</strong> ${persona.direccion}
      `;
  } else {
      // Si no hay datos guardados
      datosDiv.innerHTML = "No se han encontrado datos guardados.";
  }
}

// Función para mostrar todos los registros guardados en localStorage
function mostrarTodosLosRegistros() {
  // Obtener todos los registros de personas guardados
  const personasGuardadas = JSON.parse(localStorage.getItem("personas")) || [];

  const registrosDiv = document.getElementById("todosRegistros");

  if (personasGuardadas.length > 0) {
      // Limpiar el área de registros
      registrosDiv.innerHTML = "";

      // Crear una lista para mostrar los registros
      const ul = document.createElement("ul");

      // Recorrer todos los registros y mostrarlos
      personasGuardadas.forEach((persona, index) => {
          const li = document.createElement("li");
          li.innerHTML = `
              <strong>Nombre:</strong> ${persona.nombre} <br>
              <strong>DNI:</strong> ${persona.dni} <br>
              <strong>Fecha de Nacimiento:</strong> ${persona.fechaNacimiento} <br>
              <strong>Dirección:</strong> ${persona.direccion} <br><br>
          `;
          ul.appendChild(li);
      });

      // Agregar la lista de registros al div
      registrosDiv.appendChild(ul);
  } else {
      registrosDiv.innerHTML = "No hay registros disponibles.";
  }
}

// Llamada a la función mostrarDatosGuardados() y mostrarTodosLosRegistros() al cargar la página
window.onload = function() {
  mostrarDatosGuardados();
  mostrarTodosLosRegistros();
};