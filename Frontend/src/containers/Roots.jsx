import Navigation from "../components/navigation/Navigation";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../components/context/AuthContext"; // 👈 Importer ici

export default function RootLayout() {
    return (
        <AuthProvider> {/* ✅ ENROBER ICI */}
            <Navigation />
            <main>
                <Outlet />
            </main>
        </AuthProvider>
    );
}

