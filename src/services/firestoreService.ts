import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";

interface Cancion {
    id?: string;
    nombre: string;
    interprete: string;
}

interface Evento {
    id?: string;
    nombre: string;
    fecha: string;
    lugar?: string; // Si también necesitas el lugar
}

const eventosCollection = "eventos"; // Colección para eventos
const cancionesCollection = "canciones"; // Colección para canciones asociadas a cada evento

// Función para crear un nuevo evento
export const addEvento = async (evento: Evento): Promise<string | void> => {
    try {
        const docRef = await addDoc(collection(db, eventosCollection), evento);
        console.log("Evento añadido con éxito:", evento);
        return docRef.id;
    } catch (e) {
        console.error("Error añadiendo evento: ", e);
    }
};

// Función para añadir una canción a un evento
export const addCancion = async (eventoId: string, cancion: Cancion): Promise<string | void> => {
    try {
        const docRef = await addDoc(collection(db, `${eventosCollection}/${eventoId}/${cancionesCollection}`), cancion);
        console.log("Canción añadida con éxito:", cancion);
        return docRef.id;
    } catch (e) {
        console.error("Error añadiendo canción: ", e);
    }
};

// Función para obtener las canciones de un evento
export const getCancionesByEvento = async (eventoId: string): Promise<Cancion[]> => {
    const snapshot = await getDocs(collection(db, `${eventosCollection}/${eventoId}/${cancionesCollection}`));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Cancion[];
};

// Función para obtener todos los eventos
export const getEventos = async (): Promise<Evento[]> => {
    const eventosCollectionRef = collection(db, eventosCollection);
    const eventosSnapshot = await getDocs(eventosCollectionRef);
    return eventosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Evento[];
};

// Función para obtener un evento por ID
export const getEventoById = async (eventoId: string): Promise<Evento> => {
    const eventoDoc = doc(db, eventosCollection, eventoId);
    const eventoSnapshot = await getDoc(eventoDoc);
    if (eventoSnapshot.exists()) {
        return { id: eventoSnapshot.id, ...eventoSnapshot.data() } as Evento;
    } else {
        throw new Error("Evento no encontrado");
    }
};
