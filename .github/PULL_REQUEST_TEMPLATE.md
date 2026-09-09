## Ringkasan Perubahan (Summary)
Penjelasan ringkas mengenai perubahan kode, modul yang terpengaruh, atau perbaikan bug.

## Tipe Perubahan
- [ ] Bug fix (perbaikan kendala yang tidak merusak fungsionalitas yang ada)
- [ ] Fitur Baru (penambahan fungsionalitas modul BCM)
- [ ] Penyesuaian UI / Responsivitas HP
- [ ] Pembaruan Keamanan & RBAC / ISO 27001
- [ ] Penyesuaian Metodologi / Klausul ISO 22301 / Regulasi OJK

## Checklist Pengujian
- [ ] Kode lulus kompilasi TypeScript (
px tsc --noEmit) dengan 0 error
- [ ] Tampilan responsif diuji pada desktop dan browser mobile
- [ ] Hak akses RBAC teruji sesuai batasan wewenang peran
- [ ] Tidak ada kredensial atau rahasia sensitif yang terunggah
