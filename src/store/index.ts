import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, ProductVariant, CartItem, User, Address, ShippingOption } from '@/types';

// ============================================
// CART STORE
// ============================================

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.variantId === variant.id
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                id: `cart-${Date.now()}`,
                productId: product.id,
                variantId: variant.id,
                quantity,
                product,
                variant,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.variantId !== variantId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.variantId === variantId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.variant.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'adalagi-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// ============================================
// USER/AUTH STORE
// ============================================

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  addresses: Address[];
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      addresses: [],

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setAddresses: (addresses) => set({ addresses }),

      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),

      updateAddress: (address) =>
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === address.id ? address : a
          ),
        })),

      removeAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        })),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          addresses: [],
        }),
    }),
    {
      name: 'adalagi-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, addresses: state.addresses }),
    }
  )
);

// ============================================
// UI STORE
// ============================================

interface UIState {
  isMenuOpen: boolean;
  isLoading: boolean;
  loadingMessage: string;
  searchQuery: string;
  setMenuOpen: (open: boolean) => void;
  toggleMenu: () => void;
  setLoading: (loading: boolean, message?: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMenuOpen: false,
  isLoading: false,
  loadingMessage: '',
  searchQuery: '',

  setMenuOpen: (open) => set({ isMenuOpen: open }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setLoading: (loading, message = 'Loading...') =>
    set({ isLoading: loading, loadingMessage: message }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

// ============================================
// CHECKOUT STORE
// ============================================

interface CheckoutState {
  step: 'cart' | 'shipping' | 'payment' | 'confirmation';
  shippingData: {
    recipientName: string;
    phone: string;
    province: string;
    provinceId: string;
    city: string;
    cityId: string;
    district: string;
    districtId: string;
    postalCode: string;
    fullAddress: string;
  } | null;
  selectedCourier: ShippingOption | null;
  discountCode: string;
  discountAmount: number;
  selectedPaymentType: string;
  selectedPaymentMethod: string;
  
  setStep: (step: CheckoutState['step']) => void;
  setShippingData: (data: CheckoutState['shippingData']) => void;
  setSelectedCourier: (courier: CheckoutState['selectedCourier']) => void;
  setDiscountCode: (code: string, amount: number) => void;
  setPaymentMethod: (type: string, method: string) => void;
  reset: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      step: 'cart',
      shippingData: null,
      selectedCourier: null,
      discountCode: '',
      discountAmount: 0,
      selectedPaymentType: '',
      selectedPaymentMethod: '',

      setStep: (step) => set({ step }),
      setShippingData: (data) => set({ shippingData: data }),
      setSelectedCourier: (courier) => set({ selectedCourier: courier }),
      setDiscountCode: (code, amount) =>
        set({ discountCode: code, discountAmount: amount }),
      setPaymentMethod: (type, method) =>
        set({ selectedPaymentType: type, selectedPaymentMethod: method }),
      reset: () =>
        set({
          step: 'cart',
          shippingData: null,
          selectedCourier: null,
          discountCode: '',
          discountAmount: 0,
          selectedPaymentType: '',
          selectedPaymentMethod: '',
        }),
    }),
    {
      name: 'adalagi-checkout',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
