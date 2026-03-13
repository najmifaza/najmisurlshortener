"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 1. Import Zod dan React Hook Form
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// 2. Buat Skema Validasi Zod (Sangat Ketat & Profesional)
const formSchema = z.object({
  urlAsli: z.string().min(1, { message: "URL Asli tidak boleh kosong." }).url({
    message: "Format tidak valid. Harus diawali http:// atau https://",
  }),
  slug: z
    .string()
    .min(3, { message: "Slug minimal 3 karakter." })
    .max(20, { message: "Slug maksimal 20 karakter." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug hanya boleh berisi huruf kecil, angka, dan strip (-).",
    }),
});

// Infer type dari schema
type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 3. Inisialisasi React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urlAsli: "",
      slug: "",
    },
  });

  // 4. Fungsi Submit yang baru (Data sudah PASTI valid saat masuk ke sini)
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSuccessMessage(""); // Reset pesan sukses

    // Simpan ke Supabase
    const { error } = await supabase
      .from("links")
      .insert([{ url_asli: data.urlAsli, slug: data.slug }]);

    if (error) {
      // Cek apakah error karena slug sudah dipakai (Error code unik di PostgreSQL biasanya 23505)
      if (error.code === "23505") {
        alert("Gagal: Slug ini sudah digunakan. Silakan pilih slug lain.");
      } else {
        alert("Gagal membuat link: " + error.message);
      }
    } else {
      setSuccessMessage(`Berhasil! Link Anda: localhost:3000/${data.slug}`);
      reset(); // Kosongkan form otomatis setelah berhasil
    }
    setLoading(false);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-zinc-950
       p-4"
    >
      <main className="w-full max-w-md">
        <div
          className="flex flex-col bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 border
       border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex justify-center mb-8">
            <Image
              className="dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={24}
              priority
            />
          </div>

          <div className="w-full space-y-6 text-center sm:text-left">
            <h2 className="font-bold text-2xl text-zinc-900 dark:text-zinc-50 text-center">
              Generate Short Link
            </h2>

            {successMessage && (
              <div
                className="p-3 bg-green-100 text-green-700 rounded-md text-sm text-center border
       border-green-200"
              >
                {successMessage}
              </div>
            )}

            {/* Hubungkan form dengan handleSubmit dari React Hook Form */}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 text-left"
            >
              <div className="space-y-2">
                <Label htmlFor="urlAsli">Real URL</Label>
                <Input
                  id="urlAsli"
                  type="text"
                  placeholder="https://contoh.com/artikel-sangat-panjang"
                  {...register("urlAsli")} // Pengganti value & onChange
                  className={errors.urlAsli ? "border-red-500" : ""}
                />
                {/* Tampilkan pesan error Zod jika ada */}
                {errors.urlAsli && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.urlAsli.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Short URL</Label>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-sm">/</span>
                  <Input
                    id="slug"
                    type="text"
                    placeholder="promoku-2026"
                    {...register("slug")} // Pengganti value & onChange
                    className={errors.slug ? "border-red-500" : ""}
                  />
                </div>
                {/* Tampilkan pesan error Zod jika ada */}
                {errors.slug && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Generating..." : "Generate"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
