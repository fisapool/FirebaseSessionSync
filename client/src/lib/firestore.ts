import { db } from "./firebase";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import type { ProxyServer, ProxySession } from "@shared/schema";

// Collection references
const proxyServersCollection = "proxyServers";
const proxySessionsCollection = "proxySessions";

// Proxy Server Operations
export function subscribeToProxyServers(userId: string, callback: (proxies: ProxyServer[]) => void) {
  const q = query(collection(db, proxyServersCollection), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const proxies = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProxyServer));
    callback(proxies);
  }, (error) => {
    console.error("Error subscribing to proxy servers:", error);
  });
}

export async function addProxyServer(userId: string, proxy: Omit<ProxyServer, "id" | "userId">) {
  try {
    const docRef = await addDoc(collection(db, proxyServersCollection), {
      ...proxy,
      userId,
      isActive: false,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding proxy server:", error);
    throw error;
  }
}

export async function updateProxyServer(id: string, data: Partial<ProxyServer>) {
  try {
    const docRef = doc(db, proxyServersCollection, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating proxy server:", error);
    throw error;
  }
}

export async function deleteProxyServer(id: string) {
  try {
    const docRef = doc(db, proxyServersCollection, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting proxy server:", error);
    throw error;
  }
}

// Proxy Session Operations
export function subscribeToProxySessions(userId: string, callback: (sessions: ProxySession[]) => void) {
  const q = query(collection(db, proxySessionsCollection), where("userId", "==", userId));

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ProxySession));
    callback(sessions);
  }, (error) => {
    console.error("Error subscribing to proxy sessions:", error);
  });
}

export async function addProxySession(userId: string, session: Omit<ProxySession, "id" | "userId">) {
  try {
    const docRef = await addDoc(collection(db, proxySessionsCollection), {
      ...session,
      userId,
      startTime: new Date(),
      endTime: null,
      bandwidthUsed: 0,
      averageLatency: null,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding proxy session:", error);
    throw error;
  }
}

export async function updateProxySession(id: string, data: Partial<ProxySession>) {
  try {
    const docRef = doc(db, proxySessionsCollection, id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating proxy session:", error);
    throw error;
  }
}