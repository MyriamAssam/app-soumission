// RootLayout.jsx
import Navigation from "../components/navigation/Navigation";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../components/context/AuthContext"; // 👈 import ici

export default function RootLayout() {
    return (
        <AuthProvider> {/* 👈 ENTOURE ICI */}
            <>
                <Navigation />
                <main>
                    <Outlet />
                </main>
            </>
        </AuthProvider>
    );
}
