import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <p className="font-display text-7xl font-black text-emerald-200">٤٠٤</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-emerald-950">الصفحة غير موجودة</h1>
      <p className="mt-2 text-emerald-900/60">ربما نُقلت الصفحة أو أن الرابط غير صحيح.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800">
        العودة إلى الرئيسية
      </Link>
    </div>
  );
}
