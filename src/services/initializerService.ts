/**
 * Data Initialization Service
 * Handles initialization of demo data and setup
 * Toggle with: INITIALIZE_DEMO_DATA = true/false
 */

// Demo data is now disabled by default - use real API
const INITIALIZE_DEMO_DATA = false;

// ============================================
// DEMO DATA TYPES
// ============================================

export interface DemoUser {
  id: string;
  email: string;
  fullName: string;
  token: string;
}

export interface DemoProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface DemoDesign {
  id: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  downloads: number;
  likes: number;
}

// ============================================
// DEMO DATA
// ============================================

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'user-1',
    email: 'demo@example.com',
    fullName: 'Demo User',
    token: 'demo-token-12345',
  },
  {
    id: 'user-2',
    email: 'test@sustainique.com',
    fullName: 'Test User',
    token: 'demo-token-67890',
  },
];

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'prod-1',
    name: 'Organic Cotton T-Shirt',
    description: 'Premium organic cotton t-shirt with eco-friendly printing',
    price: 29.99,
    category: 't-shirt',
    image: '/products/tshirt-1.jpg',
  },
  {
    id: 'prod-2',
    name: 'Sustainable Hoodie',
    description: 'Comfortable and sustainable hoodie perfect for any occasion',
    price: 49.99,
    category: 'hoodie',
    image: '/products/hoodie-1.jpg',
  },
  {
    id: 'prod-3',
    name: 'Eco Tote Bag',
    description: 'Durable and stylish tote bag made from sustainable materials',
    price: 19.99,
    category: 'bag',
    image: '/products/bag-1.jpg',
  },
  {
    id: 'prod-4',
    name: 'Organic Sweatshirt',
    description: 'Soft and cozy sweatshirt for comfort and style',
    price: 44.99,
    category: 'sweatshirt',
    image: '/products/sweatshirt-1.jpg',
  },
  {
    id: 'prod-5',
    name: 'Sustainable Cap',
    description: 'Stylish cap made from recycled materials',
    price: 14.99,
    category: 'cap',
    image: '/products/cap-1.jpg',
  },
];

export const DEMO_DESIGNS: DemoDesign[] = [
  {
    id: 'design-1',
    name: 'Nature Vibes',
    description: 'Beautiful nature-inspired design with tree and mountains',
    image: '/designs/nature-vibes.jpg',
    creator: 'EcoArtist',
    downloads: 245,
    likes: 512,
  },
  {
    id: 'design-2',
    name: 'Ocean Waves',
    description: 'Relaxing ocean waves design perfect for summer',
    image: '/designs/ocean-waves.jpg',
    creator: 'WaveDesigner',
    downloads: 187,
    likes: 398,
  },
  {
    id: 'design-3',
    name: 'Forest Dreams',
    description: 'Mystical forest design with magical elements',
    image: '/designs/forest-dreams.jpg',
    creator: 'NatureCreator',
    downloads: 312,
    likes: 654,
  },
  {
    id: 'design-4',
    name: 'Green Energy',
    description: 'Modern design promoting renewable energy',
    image: '/designs/green-energy.jpg',
    creator: 'EcoWarrior',
    downloads: 156,
    likes: 289,
  },
  {
    id: 'design-5',
    name: 'Earth Day',
    description: 'Inspiring Earth Day design with planet focus',
    image: '/designs/earth-day.jpg',
    creator: 'PlanetLover',
    downloads: 423,
    likes: 876,
  },
];

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  DEMO_USER: 'demo_user',
  DEMO_CART: 'demo_cart',
  DEMO_FAVORITES: 'demo_favorites',
  DEMO_ADDRESSES: 'demo_addresses',
  INITIALIZATION_FLAG: 'sustainique_initialized',
};

// ============================================
// INITIALIZATION SERVICE
// ============================================

export class InitializerService {
  /**
   * Initialize demo data
   */
  static initialize(): void {
    if (!INITIALIZE_DEMO_DATA) {
      console.log('🚀 Demo data initialization disabled');
      return;
    }

    console.log('🌿 Initializing Sustainique demo data...');

    // Check if already initialized
    if (this.isInitialized()) {
      console.log('✅ Demo data already initialized');
      return;
    }

    try {
      // Initialize storage data
      this.initializeStorageData();

      // Mark as initialized
      this.markAsInitialized();

      console.log('✅ Demo data initialized successfully');
      console.log('📊 Available Demo Users:', DEMO_USERS);
      console.log('📦 Available Demo Products:', DEMO_PRODUCTS.length);
      console.log('🎨 Available Demo Designs:', DEMO_DESIGNS.length);
    } catch (error) {
      console.error('❌ Failed to initialize demo data:', error);
    }
  }

  /**
   * Initialize storage data
   */
  private static initializeStorageData(): void {
    // Initialize demo user
    if (!localStorage.getItem(STORAGE_KEYS.DEMO_USER)) {
      localStorage.setItem(
        STORAGE_KEYS.DEMO_USER,
        JSON.stringify(DEMO_USERS[0]),
      );
    }

    // Initialize cart
    if (!localStorage.getItem(STORAGE_KEYS.DEMO_CART)) {
      localStorage.setItem(
        STORAGE_KEYS.DEMO_CART,
        JSON.stringify([]),
      );
    }

    // Initialize favorites
    if (!localStorage.getItem(STORAGE_KEYS.DEMO_FAVORITES)) {
      localStorage.setItem(
        STORAGE_KEYS.DEMO_FAVORITES,
        JSON.stringify([]),
      );
    }

    // Initialize addresses
    if (!localStorage.getItem(STORAGE_KEYS.DEMO_ADDRESSES)) {
      const demoAddresses = [
        {
          id: 'addr-1',
          street: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          zipCode: '94105',
          isDefault: true,
        },
      ];
      localStorage.setItem(
        STORAGE_KEYS.DEMO_ADDRESSES,
        JSON.stringify(demoAddresses),
      );
    }
  }

  /**
   * Check if already initialized
   */
  static isInitialized(): boolean {
    return localStorage.getItem(STORAGE_KEYS.INITIALIZATION_FLAG) === 'true';
  }

  /**
   * Mark as initialized
   */
  private static markAsInitialized(): void {
    localStorage.setItem(STORAGE_KEYS.INITIALIZATION_FLAG, 'true');
  }

  /**
   * Reset all demo data
   */
  static reset(): void {
    console.log('🔄 Resetting demo data...');

    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log('✅ Demo data reset complete');
  }

  /**
   * Get demo user from storage
   */
  static getDemoUser(): DemoUser | null {
    const user = localStorage.getItem(STORAGE_KEYS.DEMO_USER);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get demo cart from storage
   */
  static getDemoCart(): any[] {
    const cart = localStorage.getItem(STORAGE_KEYS.DEMO_CART);
    return cart ? JSON.parse(cart) : [];
  }

  /**
   * Get demo favorites from storage
   */
  static getDemoFavorites(): any[] {
    const favorites = localStorage.getItem(STORAGE_KEYS.DEMO_FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  }

  /**
   * Get demo addresses from storage
   */
  static getDemoAddresses(): any[] {
    const addresses = localStorage.getItem(STORAGE_KEYS.DEMO_ADDRESSES);
    return addresses ? JSON.parse(addresses) : [];
  }

  /**
   * Get all demo data info
   */
  static getDemoDataInfo() {
    return {
      isInitialized: this.isInitialized(),
      users: DEMO_USERS,
      products: DEMO_PRODUCTS,
      designs: DEMO_DESIGNS,
      storage: {
        user: this.getDemoUser(),
        cart: this.getDemoCart(),
        favorites: this.getDemoFavorites(),
        addresses: this.getDemoAddresses(),
      },
    };
  }
}

// ============================================
// AUTO-INITIALIZE ON MODULE LOAD
// ============================================

// Initialize automatically when this module is imported
if (typeof window !== 'undefined') {
  InitializerService.initialize();

  // Expose to window for debugging
  (window as any).__SUSTAINIQUE_DEMO__ = {
    info: () => InitializerService.getDemoDataInfo(),
    reset: () => InitializerService.reset(),
    users: DEMO_USERS,
    products: DEMO_PRODUCTS,
    designs: DEMO_DESIGNS,
  };

  console.log(
    '💡 Tip: Access demo data via: window.__SUSTAINIQUE_DEMO__.info()',
  );
}

export default InitializerService;

