import { signOut } from "firebase/auth"
import { Link } from "react-router-dom"
import { auth } from "../config/firebase"
import { ReactNode } from "react"

const navItems = [
  { title: "🏠 Home", href: "/home" },
  { title: "🛒 Checkout", href: "/checkout" },
  { title: "💸 Payment", href: "/payment" },
  { title: "🧑🏿‍🤝‍🧑🏻 Customers", href: "/customers" },
  { title: "🔄 Subscriptions", href: "/subscriptions" },
]

export default function Header({ children }: { children?: ReactNode }) {
  return (
    <>
      <nav>
        <ul className="navbar-nav">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link to={item.href}>{item.title}</Link>
            </li>
          ))}
          <li className="d-flex" style={{ gap: 8 }}>
            {auth.currentUser?.photoURL && (
              <img
                width={50}
                height={50}
                src={auth.currentUser?.photoURL}
                alt="user image"
                className="rounded-circle"
              />
            )}
            <button
              className="btn btn-light"
              onClick={() => confirm("Sign out?") && signOut(auth)}
            >
              Sign out
            </button>
          </li>
        </ul>
      </nav>
      <main>{children}</main>
    </>
  )
}
