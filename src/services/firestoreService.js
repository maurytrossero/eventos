import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
const eventosCollection = "eventos"; // Colección para eventos
const cancionesCollection = "canciones"; // Colección para canciones asociadas a cada evento
// Función para crear un nuevo evento
export const addEvento = async (evento) => {
    try {
        const docRef = await addDoc(collection(db, eventosCollection), evento);
        console.log("Evento añadido con éxito:", evento);
        return docRef.id;
    }
    catch (e) {
        console.error("Error añadiendo evento: ", e);
    }
};
// Función para añadir una canción a un evento
export const addCancion = async (eventoId, cancion) => {
    try {
        const docRef = await addDoc(collection(db, `${eventosCollection}/${eventoId}/${cancionesCollection}`), cancion);
        console.log("Canción añadida con éxito:", cancion);
        return docRef.id;
    }
    catch (e) {
        console.error("Error añadiendo canción: ", e);
    }
};
// Función para obtener las canciones de un evento
export const getCancionesByEvento = async (eventoId) => {
    const snapshot = await getDocs(collection(db, `${eventosCollection}/${eventoId}/${cancionesCollection}`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
// Función para obtener todos los eventos
export const getEventos = async () => {
    const eventosCollectionRef = collection(db, eventosCollection);
    const eventosSnapshot = await getDocs(eventosCollectionRef);
    return eventosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
// Función para obtener un evento por ID
export const getEventoById = async (eventoId) => {
    const eventoDoc = doc(db, eventosCollection, eventoId);
    const eventoSnapshot = await getDoc(eventoDoc);
    if (eventoSnapshot.exists()) {
        return { id: eventoSnapshot.id, ...eventoSnapshot.data() };
    }
    else {
        throw new Error("Evento no encontrado");
    }
};
// Función para actualizar un evento por su ID
export const updateEvento = async (eventoId, data // Acepta cualquier campo, incluso FieldValue
) => {
    const eventoRef = doc(db, eventosCollection, eventoId);
    try {
        await updateDoc(eventoRef, data);
        console.log("Evento actualizado con éxito:", data);
    }
    catch (e) {
        console.error("Error actualizando el evento:", e);
        throw e;
    }
};
export const deleteEvento = async (eventoId) => {
    const docRef = doc(db, 'eventos', eventoId);
    await deleteDoc(docRef);
};
//# sourceMappingURL=firestoreService.js.map