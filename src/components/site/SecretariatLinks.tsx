import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getSecretariats,
  type Secretariat,
} from "@/services/secretariats";

export function SecretariatLinks() {
  const [secretariats, setSecretariats] = useState<Secretariat[]>([]);

  useEffect(() => {
    let mounted = true;

    getSecretariats()
      .then((data) => {
        if (mounted) {
          setSecretariats(data.slice(0, 6));
        }
      })
      .catch((error) => {
        console.error("Failed to load secretariats for footer:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ul className="space-y-2 text-sm opacity-80">
      {secretariats.map((s) => (
        <li key={s.id}>
          <Link
            to="/secretariats/$slug"
            params={{ slug: s.slug }}
            className="hover:text-brand"
          >
            {s.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}