import {
  GlassTable,
  GlassTableBody,
  GlassTableCell,
  GlassTableHeader,
  GlassTableRow,
  GlassTableHead,
} from "@/components/glass-table";
import { supabase } from "@/lib/supabase";
import CopyButton from "@/components/CopyButton";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Database() {
  const { data: links, error } = await supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data:", error.message);
    return (
      <div className="text-white text-center mt-20">Gagal memuat data.</div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen items-start sm:items-center justify-center
             p-4 pt-10 sm:pt-4 overflow-hidden font-sans"
    >
      <div
        className="absolute inset-0 z-10 bg-zinc-50/0 dark:bg-zinc-950/80
                pointer-events-none"
      />
      <main className="w-full max-w-2xl relative z-20">
        <GlassTable className="max-h-145 sm:max-h-120 ">
          <GlassTableHeader>
            <GlassTableRow>
              <GlassTableHead className="w-px whitespace-nowrap">Lembaga</GlassTableHead>
              <GlassTableHead>Slug</GlassTableHead>
              <GlassTableHead className="text-right w-px whitespace-nowrap">Klik</GlassTableHead>
              <GlassTableHead className="w-px whitespace-nowrap">Tanggal</GlassTableHead>
            </GlassTableRow>
          </GlassTableHeader>
          <GlassTableBody>
            {links?.map((link) => (
              <GlassTableRow key={link.id}>
                <GlassTableCell className="font-medium whitespace-nowrap">
                  {link.lembaga || "Umum"}
                </GlassTableCell>
                <GlassTableCell className="min-w-37.5">
                  <CopyButton slug={link.slug} />
                </GlassTableCell>
                <GlassTableCell className="text-right font-bold whitespace-nowrap">
                  {link.jumlah_klik || 0}
                </GlassTableCell>
                <GlassTableCell className="text-xs opacity-60 whitespace-nowrap">
                  {/* Format tanggal agar mudah dibaca */}
                  {new Date(link.created_at).toLocaleDateString("id-ID")}
                </GlassTableCell>
              </GlassTableRow>
            ))}
            {/* Tampilkan pesan jika data kosong */}
            {links?.length === 0 && (
              <GlassTableRow>
                <GlassTableCell
                  colSpan={4}
                  className="text-center py-10 opacity-50"
                >
                  Belum ada link yang dibuat.
                </GlassTableCell>
              </GlassTableRow>
            )}
          </GlassTableBody>
        </GlassTable>
      </main>
    </div>
  );
}
