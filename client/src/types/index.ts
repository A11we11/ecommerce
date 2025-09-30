// Fix your EditProduct type definition
/* export interface EditProduct {
  id: string;
  formData: ProductFormData; 
}
 */

export interface OrderData {
  userId: string | undefined;
  cartId: string | undefined;
  cartItems: {
    productId: string;
    title: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  addressInfo: {
    addressId: string | undefined;
    address: string;
    city: string;
    pincode: string;
    phone: string;
    notes: string;
  };
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  orderDate: Date;
  orderUpdateDate: Date;
  paymentId: string;
  payerId: string;
}

// Define the review data interface
export interface ReviewData {
  productId: string;
  userId: string;
  userName: string;
  reviewMessage: string;
  reviewValue: number;
}

// Define parameter interfaces

export interface FetchAllFilteredProductsParams {
  filterParams: Record<string, string[]>;
  sortParams: string;
}

export interface CapturePaymentParams {
  paymentId: string;
  payerId: string;
  orderId: string;
}

export interface UpdateCartQuantityParams {
  userId: string | undefined;
  productId: string;
  quantity: number;
}

export interface DeleteCartItemParams {
  userId: string | undefined;
  productId: string;
}

export interface AddToCartParams {
  userId: string | undefined;
  productId: string;
  quantity: number;
}

// Define interfaces for the parameters
export interface EditAddressParams {
  userId: string | undefined;
  addressId: string;
  formData: AddressFormData;
}

export interface DeleteAddressParams {
  userId: string | undefined;
  addressId: string;
}

export interface AddAddressParams {
  userId: string | undefined;
  formData?: AddressFormData;
}

export interface AdminOrderState {
  orderList: Order[];
  orderDetails: Order | null;
  isLoading?: boolean; // Add this missing property
}

export interface UpdateOrderStatusPayload {
  id: string;
  orderStatus: string;
}
export interface EditProduct {
  id: string;
  formData: ProductFormData;
}

export interface SearchState {
  searchResults: Product[]; // or whatever type your search results are
  loading: boolean;
  error: string | null;
}

export interface FilterParams {
  [key: string]: string[];
}

//  Add AdminProductState interface
export interface AdminProductState {
  productList: Product[];
  loading: boolean;
}

//  Update form data interface
export interface ProductFormData {
  [key: string]: string | null | number;
  image: string | null;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: string;
  salePrice: string;
  totalStock: string;
  averageReview: number;
}

export interface AddressFormData {
  [key: string]: string | null | number;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes: string;
}

export interface currentSelectedProps {
  /*  [key: string]: string | null | number; */
  _id?: string;
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes: string;
}

//  Add CommonFeatureState interface
export interface FeatureImage {
  _id: string;
  image: string;
}

export interface CommonFeatureState {
  featureImageList: FeatureImage[];
  loading: boolean;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading?: boolean;
  isLoading?: boolean;
}

// Address types
export interface Address {
  _id?: string;
  address: string;
  city: string;
  phone: string;
  pincode: string;
  notes: string;
  userId?: string;
}

export interface AddressState {
  addressList: Address[];
  loading?: boolean;
  isLoading?: boolean;
}

// Product types
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  salePrice: number;
  brand: string;
  category: string;
  image: string;
  totalStock: number;
}

export interface ProductState {
  productList: Product[];
  productDetails: Product | null;
  loading: boolean;
}

// Cart types
export interface CartItem {
  productId: string;
  quantity: number;
  title: string;
  image: string;
  price: number;
  salePrice?: number;
}

export interface CartState {
  cartItems: {
    _id?: string; // Add this
    items: CartItem[];
  };
  loading: boolean;
}

// Order types
export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  _id?: string;
  cartId?: string;
  userId?: string;
  cartItems: OrderItem[];
  addressInfo?: Address;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  orderDate: string;
  orderUpdateDate: string;
  paymentId: string;
  payerId: string;
}

export interface OrderState {
  orderList: Order[];
  orderDetails: Order | null;
  loading: boolean;
  approvalURL: string;
}

// Review types
export interface Review {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  reviewMessage: string;
  reviewValue: number;
}

export interface ReviewState {
  reviews: Review[];
  loading: boolean;
}

// Form types
export interface FormControl {
  id?: string;
  name: string;
  label: string;
  placeholder?: string;
  componentType: "input" | "select" | "textarea";
  type?: string;
  options?: Array<{ id: string; label: string }>;
}

export interface SelectOption {
  id: string;
  label: string;
}

// Filter types
export interface Filters {
  [key: string]: string[];
}

// Redux root state

export interface RootState {
  auth: AuthState;
  shopAddress: AddressState;
  shopProducts: ProductState;
  shopCart: CartState;
  shopOrder: OrderState;
  shopReview: ReviewState;
  commonFeature: CommonFeatureState;
  adminProducts: AdminProductState;
  shopSearch: SearchState;
}

// Event types
export interface FormEvent extends React.FormEvent<HTMLFormElement> {}
export interface MouseEvent extends React.MouseEvent<HTMLDivElement> {}

// Component prop types
export interface CheckAuthProps {
  isAuthenticated: boolean;
  user: User | null;
  children?: React.ReactNode;
}
/* 
export interface CommonFormProps<
  T extends Record<string, any> = ProductFormData
> {
  formControls: FormControl[];
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  onSubmit: (event: FormEvent) => void;
  buttonText: string;
  isBtnDisabled: boolean;
 
} */

// Or simple non-generic version
/* export interface CommonFormProps {
  formControls: FormControl[];
  formData: AddressFormData | ProductFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<AddressFormData | ProductFormData>
  >;
  onSubmit: (event: FormEvent) => void;
  buttonText: string;
  isBtnDisabled: boolean;
} */

export interface CommonFormProps<T extends Record<string, any>> {
  formControls: FormControl[];
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  onSubmit: (event: FormEvent) => void;
  /* onSubmit: (event: FormEvent<HTMLFormElement>) => void; */
  buttonText: string;
  isBtnDisabled?: boolean;
}

export interface StarRatingProps {
  rating: number;
  handleRatingChange?: (rating: number) => void;
}

export interface AddressCardProps {
  addressInfo?: Address;
  handleDeleteAddress?: (address: Address) => void;
  handleEditAddress?: (address: Address) => void;
  setCurrentSelectedAddress?: (address: Address | null) => void;
  selectedId?: string | null | currentSelectedProps;
}

export interface AddressProps {
  setCurrentSelectedAddress?: (address: Address) => void;
  selectedId?: string;
}

export interface UserCartItemsContentProps {
  cartItem: CartItem;
}

export interface UserCartWrapperProps {
  cartItems: CartItem[];
  setOpenCartSheet: (open: boolean) => void;
}

export interface ProductFilterProps {
  filters: Filters;
  handleFilter: (key: string, value: string) => void;
}

export interface ShoppingOrderDetailsViewProps {
  orderDetails: Order | null;
}

export interface ProductDetailsDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productDetails: Product | null;
}

export interface ShoppingProductTileProps {
  product: Product;
  handleGetProductDetails: (productId: string) => void;
  handleAddtoCart: (productId: string, totalStock: number) => void;
}
export interface FilterOptionsProps {
  [key: string]: Array<{ id: string; label: string }>;
}
