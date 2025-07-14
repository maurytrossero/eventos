//firestoreService.ts
import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc , FieldValue, deleteDoc,  serverTimestamp  } from "firebase/firestore";

interface Cancion {
    id?: string;
    nombre: string;
    interprete: string;
}

interface Evento {
    id?: string;
    nombre: string;
    fecha: string;
    lugar?: string;
    invitacion?: string; // 👈 Agregá esta línea
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
// Función para actualizar un evento por su ID
export const updateEvento = async (
  eventoId: string,
  data: { [key: string]: any } // Acepta cualquier campo, incluso FieldValue
): Promise<void> => {
  const eventoRef = doc(db, eventosCollection, eventoId);
  try {
    await updateDoc(eventoRef, data);
    console.log("Evento actualizado con éxito:", data);
  } catch (e) {
    console.error("Error actualizando el evento:", e);
    throw e;
  }
};

export const deleteEvento = async (eventoId: string) => {
  const docRef = doc(db, 'eventos', eventoId);
  await deleteDoc(docRef);
};

// Función para actualizar el plan de usuario (campo embebido)
// ==============================
export async function updateUserPlan(
  uid: string,
  planId: "premium" | "gratuito"
): Promise<void> {
  const userRef = doc(db, "usuarios", uid)
  await updateDoc(userRef, {
    plan: planId,
    planContratadoEn: serverTimestamp()
  })
}