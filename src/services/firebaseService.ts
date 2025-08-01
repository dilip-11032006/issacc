import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { User, Component, BorrowRequest, Notification, LoginSession, SystemData } from '../types';

class FirebaseService {
  private static instance: FirebaseService;

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Authentication methods
  async signIn(email: string, password: string): Promise<FirebaseUser | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string): Promise<FirebaseUser | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  // User management
  async createUser(user: User): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Component management
  async createComponent(component: Component): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'components'), {
        ...component,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating component:', error);
      throw error;
    }
  }

  async getComponent(componentId: string): Promise<Component | null> {
    try {
      const docRef = doc(db, 'components', componentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Component;
      }
      return null;
    } catch (error) {
      console.error('Error getting component:', error);
      throw error;
    }
  }

  async updateComponent(componentId: string, componentData: Partial<Component>): Promise<void> {
    try {
      const docRef = doc(db, 'components', componentId);
      await updateDoc(docRef, {
        ...componentData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating component:', error);
      throw error;
    }
  }

  async getAllComponents(): Promise<Component[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'components'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Component[];
    } catch (error) {
      console.error('Error getting components:', error);
      throw error;
    }
  }

  // Request management
  async createRequest(request: BorrowRequest): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'requests'), {
        ...request,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  }

  async getRequest(requestId: string): Promise<BorrowRequest | null> {
    try {
      const docRef = doc(db, 'requests', requestId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as BorrowRequest;
      }
      return null;
    } catch (error) {
      console.error('Error getting request:', error);
      throw error;
    }
  }

  async updateRequest(requestId: string, requestData: Partial<BorrowRequest>): Promise<void> {
    try {
      const docRef = doc(db, 'requests', requestId);
      await updateDoc(docRef, {
        ...requestData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating request:', error);
      throw error;
    }
  }

  async getAllRequests(): Promise<BorrowRequest[]> {
    try {
      const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BorrowRequest[];
    } catch (error) {
      console.error('Error getting requests:', error);
      throw error;
    }
  }

  async getUserRequests(userId: string): Promise<BorrowRequest[]> {
    try {
      const q = query(
        collection(db, 'requests'), 
        where('studentId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BorrowRequest[];
    } catch (error) {
      console.error('Error getting user requests:', error);
      throw error;
    }
  }

  // Notification management
  async createNotification(notification: Notification): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, {
        read: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Login session management
  async createLoginSession(session: LoginSession): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'loginSessions'), {
        ...session,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating login session:', error);
      throw error;
    }
  }

  async updateLoginSession(sessionId: string, sessionData: Partial<LoginSession>): Promise<void> {
    try {
      const docRef = doc(db, 'loginSessions', sessionId);
      await updateDoc(docRef, {
        ...sessionData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating login session:', error);
      throw error;
    }
  }

  async getAllLoginSessions(): Promise<LoginSession[]> {
    try {
      const q = query(collection(db, 'loginSessions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LoginSession[];
    } catch (error) {
      console.error('Error getting login sessions:', error);
      throw error;
    }
  }

  // Real-time listeners
  onUsersChange(callback: (users: User[]) => void) {
    return onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      callback(users);
    });
  }

  onComponentsChange(callback: (components: Component[]) => void) {
    return onSnapshot(collection(db, 'components'), (snapshot) => {
      const components = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Component[];
      callback(components);
    });
  }

  onRequestsChange(callback: (requests: BorrowRequest[]) => void) {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BorrowRequest[];
      callback(requests);
    });
  }

  onUserNotificationsChange(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      callback(notifications);
    });
  }

  // Batch operations
  async initializeDefaultData(): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Check if admin user exists
      const adminUser = await this.getUserByEmail('admin@issacasimov.in');
      if (!adminUser) {
        // Create admin user
        const adminRef = doc(collection(db, 'users'));
        batch.set(adminRef, {
          name: 'Administrator',
          email: 'admin@issacasimov.in',
          role: 'admin',
          registeredAt: new Date().toISOString(),
          loginCount: 0,
          isActive: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // Check if default components exist
      const components = await this.getAllComponents();
      if (components.length === 0) {
        const defaultComponents = [
          {
            name: 'Arduino Uno R3',
            totalQuantity: 25,
            availableQuantity: 25,
            category: 'Microcontroller',
            description: 'Arduino Uno R3 development board'
          },
          {
            name: 'L298N Motor Driver',
            totalQuantity: 15,
            availableQuantity: 15,
            category: 'Motor Driver',
            description: 'Dual H-Bridge Motor Driver'
          },
          {
            name: 'Ultrasonic Sensor HC-SR04',
            totalQuantity: 20,
            availableQuantity: 20,
            category: 'Sensor',
            description: 'Ultrasonic distance sensor'
          },
          {
            name: 'Servo Motor SG90',
            totalQuantity: 30,
            availableQuantity: 30,
            category: 'Actuator',
            description: '9g micro servo motor'
          },
          {
            name: 'ESP32 Development Board',
            totalQuantity: 12,
            availableQuantity: 12,
            category: 'Microcontroller',
            description: 'WiFi and Bluetooth enabled microcontroller'
          }
        ];

        defaultComponents.forEach(component => {
          const componentRef = doc(collection(db, 'components'));
          batch.set(componentRef, {
            ...component,
            id: componentRef.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        });
      }

      await batch.commit();
      console.log('Default data initialized successfully');
    } catch (error) {
      console.error('Error initializing default data:', error);
      throw error;
    }
  }

  // Sync with local storage (for offline support)
  async syncToLocal(): Promise<void> {
    try {
      const [users, components, requests, notifications, loginSessions] = await Promise.all([
        this.getAllUsers(),
        this.getAllComponents(),
        this.getAllRequests(),
        // Get all notifications (you might want to limit this)
        getDocs(collection(db, 'notifications')).then(snapshot => 
          snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Notification[]
        ),
        this.getAllLoginSessions()
      ]);

      const systemData: SystemData = {
        users,
        components,
        requests,
        notifications,
        loginSessions
      };

      localStorage.setItem('isaacLabData', JSON.stringify(systemData));
      localStorage.setItem('lastFirebaseSync', new Date().toISOString());
    } catch (error) {
      console.error('Error syncing to local storage:', error);
      throw error;
    }
  }
}

export const firebaseService = FirebaseService.getInstance();