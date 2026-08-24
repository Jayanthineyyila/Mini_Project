import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient">
              <ShieldCheck className="size-5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <p className="font-serif text-base font-bold">CampusFix</p>
              <p className="text-[10px] tracking-wide text-muted-foreground uppercase">
                RGUKT Srikakulam
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            A maintenance reporting platform built for the students and staff of Rajiv Gandhi
            University of Knowledge Technologies, Srikakulam.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Quick links</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/report" className="hover:text-primary">
                Report an issue
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-primary">
                Track my complaints
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-primary">
                Admin dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Campus</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            RGUKT Srikakulam, Etcherla Mandal,
            <br />
            Srikakulam District, Andhra Pradesh — 532410
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CampusFix · RGUKT Srikakulam. Student maintenance grievance
        portal.
      </div>
    </footer>
  );
}
