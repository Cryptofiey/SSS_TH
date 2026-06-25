import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfigData from "../firebase-applet-config.json";
import { DocumentStatus } from "./types";

// Initialize Firebase with resilience and fallback
let app;
let db: any = null;
let isFirebaseAvailable = false;

try {
  if (firebaseConfigData && firebaseConfigData.apiKey) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfigData);
    } else {
      app = getApp();
    }
    // We specify the customized firestoreDatabaseId if provided in firebase-applet-config.json
    db = getFirestore(app, firebaseConfigData.firestoreDatabaseId || undefined);
    isFirebaseAvailable = true;
    console.log("Firebase initialized successfully with Firestore DB ID:", firebaseConfigData.firestoreDatabaseId);
  }
} catch (error) {
  console.warn("Firebase initialization failed, falling back to local storage:", error);
}

export { db, isFirebaseAvailable };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentUser = isFirebaseAvailable ? getAuth().currentUser : null;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// RESILIENT DB HELPERS
// These helpers automatically use Firestore if available, otherwise fallback to localStorage!

export async function saveBookingToDb(booking: any): Promise<string> {
  const cleanBooking = {
    ...booking,
    createdAt: booking.createdAt || new Date().toISOString(),
  };

  if (isFirebaseAvailable && db) {
    try {
      const docRef = await addDoc(collection(db, "bookings"), cleanBooking);
      return docRef.id;
    } catch (e: any) {
      console.error("Firestore save booking error:", e);
      handleFirestoreError(e, OperationType.WRITE, "bookings");
    }
  }

  // Fallback to localStorage
  const bookings = JSON.parse(localStorage.getItem("th_bookings") || "[]");
  const id = booking.id || "b_" + Math.random().toString(36).substr(2, 9);
  const newBooking = { ...cleanBooking, id };
  bookings.push(newBooking);
  localStorage.setItem("th_bookings", JSON.stringify(bookings));
  return id;
}

export async function getBookingsFromDb(userId: string): Promise<any[]> {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const bookings: any[] = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      return bookings;
    } catch (e: any) {
      console.error("Firestore get bookings error:", e);
      if (e?.message?.includes("permission") || e?.message?.includes("Missing or insufficient permissions")) {
        handleFirestoreError(e, OperationType.GET, "bookings");
      }
      // Fallback to query everything if ordering/index is missing or errors
      try {
        const qSimple = query(collection(db, "bookings"), where("userId", "==", userId));
        const querySnapshot = await getDocs(qSimple);
        const bookings: any[] = [];
        querySnapshot.forEach((doc) => {
          bookings.push({ id: doc.id, ...doc.data() });
        });
        return bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (innerError: any) {
        console.error("Simple Firestore get bookings also failed:", innerError);
        handleFirestoreError(innerError, OperationType.GET, "bookings");
      }
    }
  }

  // Fallback
  const bookings = JSON.parse(localStorage.getItem("th_bookings") || "[]");
  return bookings.filter((b: any) => b.userId === userId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateBookingInDb(bookingId: string, updates: any): Promise<boolean> {
  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, "bookings", bookingId);
      await updateDoc(docRef, updates);
      return true;
    } catch (e: any) {
      console.error("Firestore update booking error:", e);
      handleFirestoreError(e, OperationType.WRITE, `bookings/${bookingId}`);
    }
  }

  // Fallback
  const bookings = JSON.parse(localStorage.getItem("th_bookings") || "[]");
  const idx = bookings.findIndex((b: any) => b.id === bookingId);
  if (idx !== -1) {
    bookings[idx] = { ...bookings[idx], ...updates };
    localStorage.setItem("th_bookings", JSON.stringify(bookings));
    return true;
  }
  return false;
}

export async function saveChatMessageToDb(userId: string, message: any): Promise<void> {
  const cleanMsg = {
    ...message,
    userId,
    timestamp: message.timestamp || new Date().toISOString(),
  };

  if (isFirebaseAvailable && db) {
    try {
      await addDoc(collection(db, "chat_messages"), cleanMsg);
      return;
    } catch (e: any) {
      console.error("Firestore save chat error:", e);
      handleFirestoreError(e, OperationType.WRITE, "chat_messages");
    }
  }

  // Fallback
  const chats = JSON.parse(localStorage.getItem(`th_chats_${userId}`) || "[]");
  chats.push(cleanMsg);
  localStorage.setItem(`th_chats_${userId}`, JSON.stringify(chats));
}

export async function getChatMessagesFromDb(userId: string): Promise<any[]> {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(
        collection(db, "chat_messages"),
        where("userId", "==", userId),
        orderBy("timestamp", "asc")
      );
      const querySnapshot = await getDocs(q);
      const messages: any[] = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      return messages;
    } catch (e: any) {
      console.error("Firestore get chats error:", e);
      if (e?.message?.includes("permission") || e?.message?.includes("Missing or insufficient permissions")) {
        handleFirestoreError(e, OperationType.GET, "chat_messages");
      }
      try {
        const qSimple = query(collection(db, "chat_messages"), where("userId", "==", userId));
        const querySnapshot = await getDocs(qSimple);
        const messages: any[] = [];
        querySnapshot.forEach((doc) => {
          messages.push({ id: doc.id, ...doc.data() });
        });
        return messages.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      } catch (innerError: any) {
        console.error("Simple Firestore get chats failed:", innerError);
        handleFirestoreError(innerError, OperationType.GET, "chat_messages");
      }
    }
  }

  // Fallback
  return JSON.parse(localStorage.getItem(`th_chats_${userId}`) || "[]");
}

export async function saveProfileToDb(profile: any): Promise<void> {
  if (isFirebaseAvailable && db) {
    try {
      await setDoc(doc(db, "users", profile.uid), profile, { merge: true });
      return;
    } catch (e: any) {
      console.error("Firestore save profile error:", e);
      handleFirestoreError(e, OperationType.WRITE, `users/${profile.uid}`);
    }
  }

  // Fallback
  localStorage.setItem(`th_profile_${profile.uid}`, JSON.stringify(profile));
  localStorage.setItem("th_current_uid", profile.uid);
}

export async function getProfileFromDb(uid: string): Promise<any | null> {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      }
    } catch (e: any) {
      console.error("Firestore get profile error:", e);
      handleFirestoreError(e, OperationType.GET, "users");
    }
  }

  // Fallback
  const profileStr = localStorage.getItem(`th_profile_${uid}`);
  return profileStr ? JSON.parse(profileStr) : null;
}

export async function getReferredUsersFromDb(uid: string): Promise<any[]> {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, "users"), where("referredBy", "==", uid));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      return list;
    } catch (e: any) {
      console.error("Firestore get referred users error:", e);
      handleFirestoreError(e, OperationType.GET, "users");
    }
  }

  // Fallback
  const list: any[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("th_profile_")) {
        const val = localStorage.getItem(key);
        if (val) {
          const profile = JSON.parse(val);
          if (profile && profile.referredBy === uid) {
            list.push(profile);
          }
        }
      }
    }
  } catch (err) {
    console.error("Local storage get referred users error:", err);
  }
  return list;
}

export async function saveNotificationToDb(notification: any): Promise<string> {
  const cleanNotification = {
    ...notification,
    createdAt: notification.createdAt || new Date().toISOString(),
    read: notification.read ?? false,
  };

  if (isFirebaseAvailable && db) {
    try {
      const docRef = await addDoc(collection(db, "notifications"), cleanNotification);
      return docRef.id;
    } catch (e: any) {
      console.error("Firestore save notification error:", e);
      handleFirestoreError(e, OperationType.WRITE, "notifications");
    }
  }

  // Fallback
  const notifications = JSON.parse(localStorage.getItem("th_notifications") || "[]");
  const id = notification.id || "n_" + Math.random().toString(36).substr(2, 9);
  const newNotification = { ...cleanNotification, id };
  notifications.push(newNotification);
  localStorage.setItem("th_notifications", JSON.stringify(notifications));
  return id;
}

export async function getNotificationsFromDb(userId: string): Promise<any[]> {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const notifications: any[] = [];
      querySnapshot.forEach((doc) => {
        notifications.push({ id: doc.id, ...doc.data() });
      });
      return notifications;
    } catch (e: any) {
      console.error("Firestore get notifications error:", e);
      if (e?.message?.includes("permission") || e?.message?.includes("Missing or insufficient permissions")) {
        handleFirestoreError(e, OperationType.GET, "notifications");
      }
      try {
        const qSimple = query(collection(db, "notifications"), where("userId", "==", userId));
        const querySnapshot = await getDocs(qSimple);
        const notifications: any[] = [];
        querySnapshot.forEach((doc) => {
          notifications.push({ id: doc.id, ...doc.data() });
        });
        return notifications.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (innerError: any) {
        console.error("Simple Firestore get notifications failed:", innerError);
        handleFirestoreError(innerError, OperationType.GET, "notifications");
      }
    }
  }

  // Fallback
  const notifications = JSON.parse(localStorage.getItem("th_notifications") || "[]");
  return notifications.filter((n: any) => n.userId === userId).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function markNotificationAsReadInDb(notificationId: string): Promise<boolean> {
  if (isFirebaseAvailable && db) {
    try {
      const docRef = doc(db, "notifications", notificationId);
      await updateDoc(docRef, { read: true });
      return true;
    } catch (e: any) {
      console.error("Firestore mark notification as read error:", e);
      handleFirestoreError(e, OperationType.WRITE, `notifications/${notificationId}`);
    }
  }

  // Fallback
  const notifications = JSON.parse(localStorage.getItem("th_notifications") || "[]");
  const idx = notifications.findIndex((n: any) => n.id === notificationId);
  if (idx !== -1) {
    notifications[idx].read = true;
    localStorage.setItem("th_notifications", JSON.stringify(notifications));
    return true;
  }
  return false;
}

export async function markAllNotificationsAsReadInDb(userId: string): Promise<boolean> {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(collection(db, "notifications"), where("userId", "==", userId), where("read", "==", false));
      const querySnapshot = await getDocs(q);
      const promises: Promise<any>[] = [];
      querySnapshot.forEach((docSnap) => {
        promises.push(updateDoc(doc(db, "notifications", docSnap.id), { read: true }));
      });
      await Promise.all(promises);
      return true;
    } catch (e: any) {
      console.error("Firestore mark all notifications as read error:", e);
      handleFirestoreError(e, OperationType.WRITE, "notifications");
    }
  }

  // Fallback
  const notifications = JSON.parse(localStorage.getItem("th_notifications") || "[]");
  const updated = notifications.map((n: any) => n.userId === userId ? { ...n, read: true } : n);
  localStorage.setItem("th_notifications", JSON.stringify(updated));
  return true;
}

export async function saveUserDocumentToDb(userId: string, docItem: DocumentStatus): Promise<void> {
  const cleanDoc = {
    userId,
    id: docItem.id,
    name: docItem.name,
    status: docItem.status,
    lastUpdated: docItem.lastUpdated,
    notes: docItem.notes || "",
    fileData: docItem.fileData || "",
    fileName: docItem.fileName || "",
    fileSize: docItem.fileSize || ""
  };

  if (isFirebaseAvailable && db) {
    try {
      // Use setDoc with a deterministic path to merge documents cleanly: documents/{userId}_{docItem.id}
      const docRef = doc(db, "documents", `${userId}_${docItem.id}`);
      await setDoc(docRef, cleanDoc, { merge: true });
      return;
    } catch (e: any) {
      console.error("Firestore save document error:", e);
      handleFirestoreError(e, OperationType.WRITE, `documents/${userId}_${docItem.id}`);
    }
  }

  // Fallback
  const docs = JSON.parse(localStorage.getItem(`th_docs_${userId}`) || "[]");
  const idx = docs.findIndex((d: any) => d.id === docItem.id);
  if (idx !== -1) {
    docs[idx] = cleanDoc;
  } else {
    docs.push(cleanDoc);
  }
  localStorage.setItem(`th_docs_${userId}`, JSON.stringify(docs));
}

export async function getUserDocumentsFromDb(userId: string): Promise<DocumentStatus[]> {
  if (isFirebaseAvailable && db) {
    try {
      const q = query(
        collection(db, "documents"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const docsList: DocumentStatus[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        docsList.push({
          id: data.id,
          name: data.name,
          status: data.status,
          lastUpdated: data.lastUpdated,
          notes: data.notes,
          fileData: data.fileData,
          fileName: data.fileName,
          fileSize: data.fileSize
        });
      });
      return docsList;
    } catch (e: any) {
      console.error("Firestore get documents error:", e);
      handleFirestoreError(e, OperationType.GET, "documents");
    }
  }

  // Fallback
  return JSON.parse(localStorage.getItem(`th_docs_${userId}`) || "[]");
}
