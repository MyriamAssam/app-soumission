
import { Outlet } from "react-router-dom";

import Navigation from "../components/navigation/Navigation";
import LanguageSwitcher from "../components/LanguageSwitcher"; // 👈 importe ici
import { Outlet } from "react-router-dom";

export default function RootLayout() {
    return (
        <>
            <Navigation />
            <LanguageSwitcher /> {/* ✅ ici c'est bon, après I18nextProvider */}
            <main>
                <Outlet />
            </main>
        </>
    );
}
