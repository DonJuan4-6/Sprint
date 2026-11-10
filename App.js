import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';

export default function App() {
  const { width } = useWindowDimensions();
  const isWideScreen = width >= 640;

  const [nombre, setNombre] = useState('');
  const [ficha, setFicha] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tareas, setTareas] = useState([]);
  const [tituloTarea, setTituloTarea] = useState('');
  const [descripcionTarea, setDescripcionTarea] = useState('');
  const [categoriaTarea, setCategoriaTarea] = useState('');
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);
  const [errorTarea, setErrorTarea] = useState('');
  const [siguienteId, setSiguienteId] = useState(1);

  const tareasCompletadas = tareas.filter((tarea) => tarea.completada).length;
  const tareasPendientes = tareas.length - tareasCompletadas;

  const mostrarInformacion = () => {
    if (nombre.trim() === '' || ficha.trim() === '') {
      setMensaje('Por favor, completa todos los campos');
    } else {
      setMensaje(`Hola ${nombre}\nFicha: ${ficha}`);
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setFicha('');
    setMensaje('Limpiado correctamente');
  };

  const limpiarFormularioTarea = () => {
    setTituloTarea('');
    setDescripcionTarea('');
    setCategoriaTarea('');
    setTareaEnEdicion(null);
    setErrorTarea('');
  };

  const guardarTarea = () => {
    const tituloLimpio = tituloTarea.trim();
    if (!tituloLimpio) {
      setErrorTarea('Escribe un título para la tarea.');
      return;
    }
    if (!categoriaTarea) {
      setErrorTarea('Selecciona una categoría.');
      return;
    }

    if (tareaEnEdicion !== null) {
      setTareas((actuales) =>
        actuales.map((tarea) =>
          tarea.id === tareaEnEdicion
            ? {
                ...tarea,
                titulo: tituloLimpio,
                descripcion: descripcionTarea.trim(),
                categoria: categoriaTarea,
              }
            : tarea,
        ),
      );
    } else {
      setTareas((actuales) => [
        ...actuales,
        {
          id: siguienteId,
          titulo: tituloLimpio,
          descripcion: descripcionTarea.trim(),
          categoria: categoriaTarea,
          completada: false,
        },
      ]);
      setSiguienteId((id) => id + 1);
    }

    limpiarFormularioTarea();
  };

  const editarTarea = (tarea) => {
    setTituloTarea(tarea.titulo);
    setDescripcionTarea(tarea.descripcion);
    setCategoriaTarea(tarea.categoria);
    setTareaEnEdicion(tarea.id);
    setErrorTarea('');
  };

  const alternarTarea = (id) => {
    setTareas((actuales) =>
      actuales.map((tarea) =>
        tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea,
      ),
    );
  };

  const eliminarTarea = (id) => {
    setTareas((actuales) => actuales.filter((tarea) => tarea.id !== id));
    if (tareaEnEdicion === id) {
      limpiarFormularioTarea();
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.pagina,
        { flexDirection: isWideScreen ? 'row' : 'column' },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={[
          styles.panelLateral,
          { width: isWideScreen ? 270 : '100%' },
        ]}
      >
        <Text style={styles.titulo}>TaskManager</Text>
        <Text style={styles.subtitulo}>{mensaje}</Text>

        <Text style={styles.etiqueta}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu nombre completo"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.etiqueta}>Ficha</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu ficha"
          value={ficha}
          onChangeText={setFicha}
        />

        <Pressable
          style={styles.boton}
          onPress={mostrarInformacion}
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>Mostrar información</Text>
        </Pressable>

        <Pressable
          style={styles.botonLimpiar}
          onPress={limpiarFormulario}
          accessibilityRole="button"
        >
          <Text style={styles.textoBoton}>Limpiar formulario</Text>
        </Pressable>

        <View style={styles.resultado}>
          <Text style={styles.mensaje}>{mensaje}</Text>
        </View>
      </View>

      <View style={styles.panelContenido}>
        <Text style={styles.tituloContenido}>Gestión de tareas</Text>
        <Text style={styles.descripcionContenido}>
          Gestiona tus tareas fácilmente.
        </Text>

        <View style={styles.formularioTarea}>
          <Text style={styles.etiqueta}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Desarrollo del proyecto"
            value={tituloTarea}
            onChangeText={setTituloTarea}
            maxLength={100}
          />

          <Text style={styles.etiqueta}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputDescripcion]}
            placeholder="Detalles de la tarea (opcional)"
            value={descripcionTarea}
            onChangeText={setDescripcionTarea}
            multiline
            maxLength={500}
          />

          <Text style={styles.etiqueta}>Categoría</Text>
          <View style={styles.opcionesCategoria}>
            {['Análisis', 'Diseño', 'Código'].map((categoria) => {
              const seleccionada = categoriaTarea === categoria;
              return (
                <Pressable
                  key={categoria}
                  style={[
                    styles.opcionCategoria,
                    seleccionada && styles.opcionCategoriaSeleccionada,
                  ]}
                  onPress={() => {
                    setCategoriaTarea(categoria);
                    setErrorTarea('');
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Categoría ${categoria}`}
                  accessibilityState={{ selected: seleccionada }}
                >
                  <Text
                    style={[
                      styles.textoOpcionCategoria,
                      seleccionada && styles.textoOpcionCategoriaSeleccionada,
                    ]}
                  >
                    {categoria}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {errorTarea ? <Text style={styles.error}>{errorTarea}</Text> : null}

          <View style={styles.botonesFormulario}>
            <Pressable
              style={styles.boton}
              onPress={guardarTarea}
              accessibilityRole="button"
            >
              <Text style={styles.textoBoton}>
                {tareaEnEdicion !== null ? 'Guardar cambios' : 'Agregar tarea'}
              </Text>
            </Pressable>
            {tareaEnEdicion !== null ? (
              <Pressable
                style={styles.botonCancelar}
                onPress={limpiarFormularioTarea}
                accessibilityRole="button"
              >
                <Text style={styles.textoBotonSecundario}>Cancelar</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <Text style={styles.subtituloLista}>Mis tareas</Text>
        {tareas.length === 0 ? (
          <View style={styles.estadoVacio}>
            <Text style={styles.textoVacio}>
              Aún no tienes tareas. Agrega la primera usando el formulario.
            </Text>
          </View>
        ) : (
          tareas.map((tarea) => (
            <View key={tarea.id} style={styles.tarjetaTarea}>
              <View style={styles.detalleTarea}>
                <Text
                  style={[
                    styles.tituloTarea,
                    tarea.completada && styles.tareaCompletada,
                  ]}
                >
                  {tarea.titulo}
                </Text>
                {tarea.descripcion ? (
                  <Text style={styles.descripcionTarea}>{tarea.descripcion}</Text>
                ) : null}
                <Text style={styles.categoriaTarea}>Categoría: {tarea.categoria}</Text>
                <Text style={styles.estadoTarea}>
                  {tarea.completada ? 'Completada' : 'Pendiente'}
                </Text>
              </View>
              <View style={styles.accionesTarea}>
                <Pressable
                  style={styles.botonAccion}
                  onPress={() => alternarTarea(tarea.id)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'
                  }
                >
                  <Text style={styles.textoAccion}>
                    {tarea.completada ? 'Reabrir' : 'Completar'}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.botonAccion}
                  onPress={() => editarTarea(tarea)}
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${tarea.titulo}`}
                >
                  <Text style={styles.textoAccion}>Editar</Text>
                </Pressable>
                <Pressable
                  style={[styles.botonAccion, styles.botonEliminar]}
                  onPress={() => eliminarTarea(tarea.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar ${tarea.titulo}`}
                >
                  <Text style={styles.textoEliminar}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}

        <View style={styles.resumenTareas}>
          <View style={styles.itemResumen}>
            <Text style={styles.numeroResumen}>{tareas.length}</Text>
            <Text style={styles.etiquetaResumen}>Tareas</Text>
          </View>
          <View style={styles.itemResumen}>
            <Text style={styles.numeroResumen}>{tareasPendientes}</Text>
            <Text style={styles.etiquetaResumen}>Pendientes</Text>
          </View>
          <View style={styles.itemResumen}>
            <Text style={styles.numeroResumen}>{tareasCompletadas}</Text>
            <Text style={styles.etiquetaResumen}>Completadas</Text>
          </View>
        </View>
        
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pagina: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  panelLateral: {
    padding: 32,
    backgroundColor: '#F2F4F8',
  },
  panelContenido: {
    flex: 1,
    padding: 32,
    minWidth: 0,
  },
  titulo: {
    fontSize: 35,
    fontWeight: 'roboto-bold',
    textAlign: 'center',
    color: '#093378',
  },
  subtitulo: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 30,
  },
  etiqueta: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 7,
    color: '#334155',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    fontSize: 14,
  },
  inputDescripcion: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  opcionesCategoria: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  opcionCategoria: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  opcionCategoriaSeleccionada: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  textoOpcionCategoria: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  textoOpcionCategoriaSeleccionada: {
    color: '#1D4ED8',
  },
  boton: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonLimpiar: {
    backgroundColor: '#DC2626',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botonCancelar: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    marginTop: 10,
  },
  textoBotonSecundario: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultado: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    minHeight: 60,
    justifyContent: 'center',
  },
  mensaje: {
    fontSize: 15,
    textAlign: 'center',
    color: '#1E293B',
  },
  tituloContenido: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  descripcionContenido: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 24,
  },
  formularioTarea: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  botonesFormulario: {
    alignItems: 'stretch',
  },
  error: {
    color: '#B91C1C',
    marginBottom: 12,
  },
  subtituloLista: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 30,
    marginBottom: 14,
  },
  resumenTareas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: -5,
  },
  itemResumen: {
    flex: 1,
    minWidth: 105,
    marginHorizontal: 5,
    marginBottom: 10,
    padding: 16,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  numeroResumen: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  etiquetaResumen: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
  },
  estadoVacio: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  textoVacio: {
    color: '#64748B',
    textAlign: 'center',
  },
  tarjetaTarea: {
    padding: 18,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  detalleTarea: {
    marginBottom: 14,
  },
  tituloTarea: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  tareaCompletada: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  descripcionTarea: {
    marginTop: 5,
    fontSize: 20,
    color: '#475569',
  },
  categoriaTarea: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 5,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    fontSize: 18,
    fontWeight: '600',
  },
  estadoTarea: {
    marginTop: 8,
    color: '#1c9504',
    borderRadius: 12,
    width: 120,
    fontSize: 20,
    backgroundColor: '#daffd7',
    textAlign: 'center',
  },
  accionesTarea: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  botonAccion: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 6,
  },
  textoAccion: {
    color: '#1D4ED8',
    fontWeight: '600',
    fontSize: 20,
  },
  botonEliminar: {
    backgroundColor: '#FEF2F2',
  },
  textoEliminar: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 20,
  },
});
