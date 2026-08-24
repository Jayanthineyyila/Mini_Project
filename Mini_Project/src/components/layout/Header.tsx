import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "My Reports" },
  { to: "/report", label: "Report Issue" },
  { to: "/admin", label: "Admin" },
] as const;

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 inset-x-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <motion.div
            whileHover={{ rotate: -6, scale: 1.05 }}
            className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient shadow-sm"
          >
            <ShieldCheck className="size-5 text-primary-foreground" />
          </motion.div>
          <div className="leading-tight">
            <p className="font-serif text-base font-bold text-foreground">CampusFix</p>
            <p className="text-[10px] tracking-wide text-muted-foreground uppercase">RGUKT Srikakulam</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
              activeProps={{ className: "bg-accent font-semibold text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons / User Profile */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <div className="mr-1 text-right leading-tight">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.rollNumber}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  void navigate({ to: "/" });
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="rounded-lg p-2 text-foreground transition-colors hover:bg-accent md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown Overlay (absolute position so bottom page content does NOT move) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute top-full inset-x-0 z-50 border-b border-border/80 bg-background/98 px-4 pb-5 pt-3 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1.5">
              {nav.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  activeProps={{ className: "bg-accent/80 font-semibold text-primary" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 flex gap-2.5 border-t border-border/60 pt-3">
                {user ? (
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-xl"
                    onClick={() => {
                      logout();
                      setOpen(false);
                      void navigate({ to: "/" });
                    }}
                  >
                    Log out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1 rounded-xl" asChild>
                      <Link to="/login" onClick={() => setOpen(false)}>
                        Log in
                      </Link>
                    </Button>
                    <Button className="flex-1 rounded-xl" asChild>
                      <Link to="/signup" onClick={() => setOpen(false)}>
                        Sign up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
