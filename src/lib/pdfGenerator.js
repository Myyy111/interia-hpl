import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generateQuotationPDF({ config, metadata, estimatedPrice, customer }) {
    const doc = new jsPDF();
    const { room, productSelection, design, fixtures } = config;
    const { products, materials, accessories } = metadata;

    const product = products.find(p => p.id === productSelection.productId);
    const material = materials.find(m => m.id === design.materialId);
    const accs = accessories.filter(a => design.accessories.includes(a.id));

    // --- BRAND COLORS ---
    const colorGold = [176, 141, 87]; // #b08d57
    const colorEspresso = [74, 66, 62]; // #4a423e


    // --- HEADER ---
    doc.setFillColor(...colorEspresso);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AFANDI INTERIOR', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 200, 200);
    doc.text('Custom Modern Furniture & Interior Specialist', 20, 32);

    // Date & ID
    const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(`Quotation No: AFN-${Date.now().toString().slice(-6)}`, 150, 20);
    doc.text(`Tanggal: ${dateStr}`, 150, 25);

    // --- CUSTOMER INFO ---
    doc.setTextColor(...colorEspresso);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DATA PELANGGAN', 20, 55);

    autoTable(doc, {
        startY: 60,
        margin: { left: 20 },
        theme: 'plain',
        body: [
            ['Nama Lengkap', customer?.name || '-'],
            ['Nomor WhatsApp', customer?.phone || '-'],
            ['Alamat Lokasi', customer?.address || '-'],
        ],
        bodyStyles: { fontSize: 10, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });

    // --- CONFIGURATION DETAILS ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RINCIAN PESANAN', 20, doc.lastAutoTable.finalY + 15);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        margin: { left: 20, right: 20 },
        headStyles: { fillColor: colorGold, textColor: 255, fontStyle: 'bold' },
        head: [['Kategori', 'Detail Spesifikasi']],
        body: [
            ['Produk Utama', `${product?.name || '-'} (${productSelection.shape})`],
            ['Gaya Desain', design.model],
            ['Material Utama', material?.name || '-'],
            ['Ukuran Ruangan', `${room.length}cm x ${room.width}cm x ${room.height}cm`],
            ['Bentuk Ruangan', room.shape],
            ['Pintu & Jendela', `${fixtures.length} item ditemukan`],
        ],
        styles: { fontSize: 10, cellPadding: 5 }
    });

    // --- ADD-ONS / ACCESSORIES ---
    if (accs.length > 0) {
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 10,
            margin: { left: 20, right: 20 },
            headStyles: { fillColor: [240, 240, 240], textColor: [50, 50, 50], fontStyle: 'bold' },
            head: [['Aksesori Tambahan', 'Biaya']],
            body: accs.map(a => [a.name, `Rp ${a.price.toLocaleString('id-ID')}`]),
            styles: { fontSize: 9, cellPadding: 4 }
        });
    }

    // --- SUMMARY & PRICE ---
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(20, finalY, 170, 30, 'F');
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(20, finalY, 170, 30, 'S');

    doc.setTextColor(...colorEspresso);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL ESTIMASI BIAYA:', 30, finalY + 13);

    doc.setTextColor(...colorGold);
    doc.setFontSize(18);
    doc.text(`Rp ${estimatedPrice.toLocaleString('id-ID')}`, 30, finalY + 23);

    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('*Estimasi harga ini belum termasuk diskon promo (jika ada).', 30, finalY + 38);
    doc.text('*Harga final akan ditentukan setelah survey lokasi dan pengecekan material.', 30, finalY + 43);

    // --- FOOTER ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Afandi Interior - Workshop: Jl. Raya Bogor KM 42, Depan GOR Pakansari', 105, 285, { align: 'center' });
        doc.text(`Halaman ${i} dari ${pageCount}`, 105, 290, { align: 'center' });
    }

    // --- SAVE FILE ---
    doc.save(`Afandi-Interior-Quotation-${customer?.name?.replace(/\s+/g, '-') || 'Draft'}.pdf`);
}
