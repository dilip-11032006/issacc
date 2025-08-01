import { dataService } from './dataService';
import { firebaseService } from './firebaseService';
import { User, Component, BorrowRequest, Notification, LoginSession, SystemStats } from '../types';

class HybridDataService {
  private static instance: HybridDataService;
  private useFirebase: boolean = true;
  private isOnline: boolean = navigator.onLine;

  static getInstance(): HybridDataService {
    if (!HybridDataService.instance) {
      HybridDataService.instance = new HybridDataService();
    }
    return HybridDataService.instance;
  }

  constructor() {
    this.setupOnlineListener();
    this.initializeFirebase();
  }

  private setupOnlineListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncWhenOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private async initializeFirebase() {
    try {
      if (this.isOnline) {
        await firebaseService.initializeDefaultData();
        await firebaseService.syncToLocal();
      }
    } catch (error) {
      console.error('Firebase initialization failed, falling back to local storage:', error);
      this.useFirebase = false;
    }
  }

  private async syncWhenOnline() {
    if (this.isOnline && this.useFirebase) {
      try {
        await firebaseService.syncToLocal();
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }

  // User operations
  async addUser(user: User): Promise<void> {
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseId = await firebaseService.createUser(user);
        user.id = firebaseId;
      }
      dataService.addUser(user);
    } catch (error) {
      console.error('Error adding user:', error);
      // Fallback to local storage
      dataService.addUser(user);
    }
  }

  async updateUser(user: User): Promise<void> {
    try {
      if (this.isOnline && this.useFirebase) {
        await firebaseService.updateUser(user.id, user);
      }
      dataService.updateUser(user);
    } catch (error) {
      console.error('Error updating user:', error);
      // Fallback to local storage
      dataService.updateUser(user);
    }
  }

  async getUser(email: string): Promise<User | undefined> {
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseUser = await firebaseService.getUserByEmail(email);
        if (firebaseUser) {
          return firebaseUser;
        }
      }
    } catch (error) {
      console.error('Error getting user from Firebase:', error);
    }
    
    return dataService.getUser(email);
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    try {
      if (this.isOnline && this.useFirebase) {
        // Try Firebase authentication first
        const firebaseUser = await firebaseService.signIn(email, password);
        if (firebaseUser) {
          const userData = await firebaseService.getUserByEmail(email);
          if (userData) {
            // Update local data
            dataService.updateUser(userData);
            return userData;
          }
        }
      }
    } catch (error) {
      console.error('Firebase authentication failed, trying local:', error);
    }

    // Fallback to local authentication
    return dataService.authenticateUser(email, password);
  }

  // Component operations
  async getComponents(): Promise<Component[]> {
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseComponents = await firebaseService.getAllComponents();
        if (firebaseComponents.length > 0) {
          return firebaseComponents;
        }
      }
    } catch (error) {
      console.error('Error getting components from Firebase:', error);
    }

    return dataService.getComponents();
  }

  async updateComponent(component: Component): Promise<void> {
    try {
      if (this.isOnline && this.useFirebase) {
        await firebaseService.updateComponent(component.id, component);
      }
      dataService.updateComponent(component);
    } catch (error) {
      console.error('Error updating component:', error);
      dataService.updateComponent(component);
    }
  }

  async addComponent(component: Component): Promise<void> {
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseId = await firebaseService.createComponent(component);
        component.id = firebaseId;
      }
      dataService.addComponent(component);
    } catch (error) {
      console.error('Error adding component:', error);
      dataService.addComponent(component);
    }
  }

  // Request operations
  async addRequest(request: BorrowRequest): Promise<void> {
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseId = await firebaseService.createRequest(request);
        request.id = firebaseId;
      }
      dataService.addRequest(request);
    } catch (error) {
      console.error('Error adding request:', error);
      dataService.addRequest(request);
    }
  }

  async updateRequest(request: BorrowRequest): Promise<void> {
    try {
      if (this.isOnline && this.useFirebase) {
        await firebaseService.updateRequest(request.id, request);
      }
      dataService.updateRequest(request);
    } catch (error) {
      console.error('Error updating request:', error);
      dataService.updateRequest(request);
    }
  }

  async getRequests(): Promise<BorrowRequest[]> {
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseRequests = await firebaseService.getAllRequests();
        if (firebaseRequests.length > 0) {
          return firebaseRequests;
        }
      }
    } catch (error) {
      console.error('Error getting requests from Firebase:', error);
    }

    return dataService.getRequests();
  }

  async getUserRequests(userId: string): Promise<BorrowRequest[]> {
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseRequests = await firebaseService.getUserRequests(userId);
        if (firebaseRequests.length > 0) {
          return firebaseRequests;
        }
      }
    } catch (error) {
      console.error('Error getting user requests from Firebase:', error);
    }

    return dataService.getUserRequests(userId);
  }

  // Notification operations
  async addNotification(notification: Notification): Promise<void> {
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseId = await firebaseService.createNotification(notification);
        notification.id = firebaseId;
      }
      dataService.addNotification(notification);
    } catch (error) {
      console.error('Error adding notification:', error);
      dataService.addNotification(notification);
    }
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseNotifications = await firebaseService.getUserNotifications(userId);
        if (firebaseNotifications.length > 0) {
          return firebaseNotifications;
        }
      }
    } catch (error) {
      console.error('Error getting notifications from Firebase:', error);
    }

    return dataService.getUserNotifications(userId);
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      if (this.isOnline && this.useFirebase) {
        await firebaseService.markNotificationAsRead(notificationId);
      }
      dataService.markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      dataService.markNotificationAsRead(notificationId);
    }
  }

  // Login session operations
  async createLoginSession(user: User): Promise<LoginSession> {
    const session = dataService.createLoginSession(user);
    
    try {
      if (this.isOnline && this.useFirebase) {
        const firebaseId = await firebaseService.createLoginSession(session);
        session.id = firebaseId;
      }
    } catch (error) {
      console.error('Error creating login session in Firebase:', error);
    }

    return session;
  }

  async endLoginSession(userId: string): Promise<void> {
    try {
      if (this.isOnline && this.useFirebase) {
        // Find and update Firebase sessions
        const sessions = await firebaseService.getAllLoginSessions();
        const userSessions = sessions.filter(s => s.userId === userId && s.isActive);
        
        for (const session of userSessions) {
          await firebaseService.updateLoginSession(session.id, {
            isActive: false,
            logoutTime: new Date().toISOString(),
            sessionDuration: new Date().getTime() - new Date(session.loginTime).getTime()
          });
        }
      }
      dataService.endLoginSession(userId);
    } catch (error) {
      console.error('Error ending login session:', error);
      dataService.endLoginSession(userId);
    }
  }

  // Delegate other methods to dataService
  getLoginSessions(): LoginSession[] {
    return dataService.getLoginSessions();
  }

  getActiveUsers(): User[] {
    return dataService.getActiveUsers();
  }

  getSystemStats(): SystemStats {
    return dataService.getSystemStats();
  }

  exportLoginSessionsCSV(): string {
    return dataService.exportLoginSessionsCSV();
  }

  getData() {
    return dataService.getData();
  }

  setUserPassword(email: string, password: string): void {
    dataService.setUserPassword(email, password);
  }

  // Connection status
  getConnectionStatus(): { isOnline: boolean; useFirebase: boolean; lastSync: string | null } {
    return {
      isOnline: this.isOnline,
      useFirebase: this.useFirebase,
      lastSync: localStorage.getItem('lastFirebaseSync')
    };
  }
}

export const hybridDataService = HybridDataService.getInstance();