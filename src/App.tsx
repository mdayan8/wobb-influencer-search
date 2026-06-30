import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { ArrowLeft } from "lucide-react";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-violet-50/30 px-4 text-center dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/20">
      <p className="text-6xl font-bold text-slate-900 dark:text-white">404</p>
      <p className="mt-2 text-lg text-slate-500 dark:text-slate-400">
        Page not found
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-colors hover:bg-violet-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to search
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
