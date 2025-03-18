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
  });
}

export async function addProxyServer(proxy: Omit<ProxyServer, "id">) {
  return await addDoc(collection(db, proxyServersCollection), proxy);
}

export async function updateProxyServer(id: string, data: Partial<ProxyServer>) {
  const docRef = doc(db, proxyServersCollection, id);
  await updateDoc(docRef, data);
}

export async function deleteProxyServer(id: string) {
  const docRef = doc(db, proxyServersCollection, id);
  await deleteDoc(docRef);
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
  });
}

export async function addProxySession(session: Omit<ProxySession, "id">) {
  return await addDoc(collection(db, proxySessionsCollection), session);
}

export async function updateProxySession(id: string, data: Partial<ProxySession>) {
  const docRef = doc(db, proxySessionsCollection, id);
  await updateDoc(docRef, data);
}
