import Navigation from "../components/navigation/Navigation";
import { Outlet } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher"; // ✅ AJOUTER CETTE LIGNE

export default function RootLayout() {
    return (
        <>
            <Navigation />
            <LanguageSwitcher />
            <main>
                <Outlet />
            </main>
        </>
    );
}
