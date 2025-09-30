import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";

import { shoppingViewHeaderMenuItems } from "@/config";
import { logoutUser } from "@/store/auth-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import type { RootState } from "@/types";
import { useAppDispatch } from "@/hooks/redux";

import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import UserCartWrapper from "./cart-wrapper";

// ---------------- MenuItems ----------------
function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  interface MenuItem {
    id: string;
    path: string;
  }

  function handleNavigate(getCurrentMenuItem: MenuItem) {
    sessionStorage.removeItem("filters");

    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter) {
      setSearchParams(
        new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
      );
    } else {
      navigate(getCurrentMenuItem.path);
    }
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

// ---------------- HeaderRightContent ----------------
function HeaderRightContent() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function handleLogout() {
    try {
      console.log("Attempting logout..."); // Debug log

      // Dispatch logout action
      await dispatch(logoutUser()).unwrap();

      // Clear any additional storage if needed
      localStorage.removeItem("token");
      sessionStorage.clear();

      console.log("Logout successful"); // Debug log

      // Navigate to login page
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);

      // Force logout even if API call fails
      localStorage.removeItem("token");
      sessionStorage.clear();
      navigate("/auth/login");
    }
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  // Get the correct user name field
  const userName = (user as any)?.userName || (user as any)?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems?.items?.length ? cartItems.items : []}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
            <Avatar className="bg-black h-8 w-8">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {userInitial}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56 bg-white">
          <DropdownMenuLabel>Logged in as {userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              console.log("Account button clicked"); // Debug log
              navigate("/shop/account");
            }}
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              console.log("Logout button clicked"); // Debug log
              handleLogout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ---------------- ShoppingHeader ----------------
function ShoppingHeader() {
  const { user } = useSelector((state: RootState) => state.auth);

  // Debug log to check if user exists
  useEffect(() => {
    console.log("Current user in header:", user);
  }, [user]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs bg-white">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Desktop Menu */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
