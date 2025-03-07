// Set ayat Al-Quran acak
$.ajax({
  url: "https://api.banghasan.com/quran/format/json/acak",
  success: (results) => {
    const nomerAyat = results.acak.ar.ayat;
    const nomerSurat = results.acak.ar.surat;
    const namaSurat = results.surat.nama;
    const ayat = results.acak.ar.teks;
    const arti = results.acak.id.teks;

    $(".satu-ayat .ayat").text(ayat);
    $(".satu-ayat .surat").text(`Q.S ${namaSurat} ${nomerSurat}:${nomerAyat}`);
    $(".satu-ayat .arti").text(arti);
  },
});

const MasehiDays = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const MasehiMonths = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const masehiTime = new Date().getTime();
const masehiDay = new Date().getDay();
const masehiDate = new Date().getDate().toString();
const masehiMonth = (new Date().getMonth() + 1).toString();
const masehiYear = new Date().getFullYear().toString();
const masehiFullDate = `${masehiYear}/${
  masehiMonth.length == 1 ? "0" + masehiMonth : masehiMonth
}/${masehiDate.length == 1 ? "0" + masehiDate : masehiDate}`;

const hijriyahTime = new HijriDate().getTime();
const hijriyahDate = new HijriDate().getDate();
const hijriyahMonth = new HijriDate().getMonthName();
const hijriyahYear = new HijriDate().getFullYear();

// Set tanggal masehi dan hijriyah
$(".tanggal .masehi").text(
  `${MasehiDays[masehiDay]}, ${masehiDate} ${MasehiMonths[masehiMonth - 1]}`
);
$(".tanggal .hijriyah").text(
  `${hijriyahDate} ${hijriyahMonth} ${hijriyahYear} H`
);

// Set lokasi default pada bagian jadwal sholat
let lokasiDefault = JSON.parse(localStorage.getItem("kota-pilihan"));
if (!lokasiDefault) {
  lokasiDefault = {
    name: "Jakarta",
    id: 1301,
  };
}
$(".kota-pilihan").html(lokasiDefault.name);
$(".kota-pilihan").attr("data-id-kota", lokasiDefault.id);

$.ajax({
  url: `https://api.myquran.com/v2/sholat/jadwal/${lokasiDefault.id}/${masehiFullDate}`,
  success: (results) => {
    const jadwalSholat = results.data.jadwal;
    $(".jadwal.imsak .waktu").text(jadwalSholat.imsak);
    $(".jadwal.subuh .waktu").text(jadwalSholat.subuh);
    $(".jadwal.terbit .waktu").text(jadwalSholat.terbit);
    $(".jadwal.dhuha .waktu").text(jadwalSholat.dhuha);
    $(".jadwal.dzuhur .waktu").text(jadwalSholat.dzuhur);
    $(".jadwal.ashar .waktu").text(jadwalSholat.ashar);
    $(".jadwal.maghrib .waktu").text(jadwalSholat.maghrib);
    $(".jadwal.isya .waktu").text(jadwalSholat.isya);
  },
});

// Set modal daftar kota
$.ajax({
  url: "https://api.myquran.com/v2/sholat/kota/semua",
  success: (results) => {
    const daftarKota = results.data;
    let fragmentDaftarKota = "";
    daftarKota.forEach((kota) => {
      let namaKota = kota.lokasi.split(" ");
      for (let i = 0; i < namaKota.length; i++) {
        namaKota[i] = namaKota[i].toLowerCase();
        namaKota[i] = namaKota[i].replace(
          namaKota[i][0],
          namaKota[i][0].toUpperCase()
        );
      }

      fragmentDaftarKota += `
            <div class="kota m-0 p-2" data-id-kota="${
              kota.id
            }" data-bs-dismiss="modal">
              <h6 class="name m-0" style="font-weight: 400;">${namaKota.join(
                " "
              )}</h6>
            </div>
         `;
    });
    $(".daftar-kota .daftar").html(fragmentDaftarKota);

    // Set List.js
    new List("daftar-kota", {
      valueNames: ["name"],
    });

    // Ubah kota pilihan saat daftar kota di klik
    $(".kota").on("click", function () {
      $(".kota-pilihan").html($(this).text());
      $(".kota-pilihan").attr("data-id-kota", $(this).data("idKota"));

      localStorage.setItem(
        "kota-pilihan",
        JSON.stringify({
          name: $(this).text(),
          id: $(this).data("idKota"),
        })
      );

      gantiJadwalSholatDaerah($(this).data("idKota"), masehiFullDate);
    });
  },
});

// Set hari berikutnya dan hari sebelumnya pada jadwal sholat
let changedHijriyahTime = hijriyahTime;
let changedMasehiTime = masehiTime;
$(".tanggal-wrapper .prev-date").on("click", function () {
  changedHijriyahTime -= 86400000;
  changedMasehiTime -= 86400000;
  const changedHijriyahDate = new HijriDate(changedHijriyahTime).getDate();
  const changedHijriyahMonth = new HijriDate(
    changedHijriyahTime
  ).getMonthName();
  const changedHijriyahYear = new HijriDate(changedHijriyahTime).getFullYear();

  const changedMasehiDay = new Date(changedMasehiTime).getDay().toString();
  const changedMasehiDate = new Date(changedMasehiTime).getDate().toString();
  const changedMasehiMonth = (
    new Date(changedMasehiTime).getMonth() + 1
  ).toString();
  const changedMasehiYear = new Date(changedMasehiTime)
    .getFullYear()
    .toString();
  const changedMasehiFullDate = `${changedMasehiYear}/${
    changedMasehiMonth.length == 1
      ? "0" + changedMasehiMonth
      : changedMasehiMonth
  }/${
    changedMasehiDate.length == 1 ? "0" + changedMasehiDate : changedMasehiDate
  }`;

  $(".tanggal .masehi").text(
    `${MasehiDays[changedMasehiDay]}, ${changedMasehiDate} ${
      MasehiMonths[changedMasehiMonth - 1]
    }`
  );
  $(".tanggal .hijriyah").text(
    `${changedHijriyahDate} ${changedHijriyahMonth} ${changedHijriyahYear} H`
  );

  gantiJadwalSholatDaerah(
    $(".kota-pilihan").data("idKota"),
    changedMasehiFullDate
  );
});

$(".tanggal-wrapper .next-date").on("click", function () {
  changedHijriyahTime += 86400000;
  changedMasehiTime += 86400000;

  const changedHijriyahDate = new HijriDate(changedHijriyahTime).getDate();
  const changedHijriyahMonth = new HijriDate(
    changedHijriyahTime
  ).getMonthName();
  const changedHijriyahYear = new HijriDate(changedHijriyahTime).getFullYear();

  const changedMasehiDay = new Date(changedMasehiTime).getDay().toString();
  const changedMasehiDate = new Date(changedMasehiTime).getDate().toString();
  const changedMasehiMonth = (
    new Date(changedMasehiTime).getMonth() + 1
  ).toString();
  const changedMasehiYear = new Date(changedMasehiTime)
    .getFullYear()
    .toString();
  const changedMasehiFullDate = `${changedMasehiYear}/${
    changedMasehiMonth.length == 1
      ? "0" + changedMasehiMonth
      : changedMasehiMonth
  }/${
    changedMasehiDate.length == 1 ? "0" + changedMasehiDate : changedMasehiDate
  }`;

  $(".tanggal .masehi").text(
    `${MasehiDays[changedMasehiDay]}, ${changedMasehiDate} ${
      MasehiMonths[changedMasehiMonth - 1]
    }`
  );
  $(".tanggal .hijriyah").text(
    `${changedHijriyahDate} ${changedHijriyahMonth} ${changedHijriyahYear} H`
  );

  gantiJadwalSholatDaerah(
    $(".kota-pilihan").data("idKota"),
    changedMasehiFullDate
  );
});

function gantiJadwalSholatDaerah(idKota, tanggal) {
  console.log(idKota, tanggal);

  $(".jadwal.imsak .waktu").text("-");
  $(".jadwal.subuh .waktu").text("-");
  $(".jadwal.terbit .waktu").text("-");
  $(".jadwal.dhuha .waktu").text("-");
  $(".jadwal.dzuhur .waktu").text("-");
  $(".jadwal.ashar .waktu").text("-");
  $(".jadwal.maghrib .waktu").text("-");
  $(".jadwal.isya .waktu").text("-");

  // Set waktu sholat di kota pilihan
  $.ajax({
    url: `https://api.myquran.com/v2/sholat/jadwal/${idKota}/${tanggal}`,
    success: (results) => {
      const jadwalSholat = results.data.jadwal;
      $(".jadwal.imsak .waktu").text(jadwalSholat.imsak);
      $(".jadwal.subuh .waktu").text(jadwalSholat.subuh);
      $(".jadwal.terbit .waktu").text(jadwalSholat.terbit);
      $(".jadwal.dhuha .waktu").text(jadwalSholat.dhuha);
      $(".jadwal.dzuhur .waktu").text(jadwalSholat.dzuhur);
      $(".jadwal.ashar .waktu").text(jadwalSholat.ashar);
      $(".jadwal.maghrib .waktu").text(jadwalSholat.maghrib);
      $(".jadwal.isya .waktu").text(jadwalSholat.isya);
    },
  });
}

// Render random quotes islami
$.ajax({
  url: "quotes-islami.json",
  success: (results) => {
    const getRandom = Math.floor(Math.random() * results.length);
    const quotesRandom = results[getRandom];
    const fragmentQuotes = `
        <h6 class="text-start">Quotes Islami Untukmu:</h6>
        <h2 class="text-end my-3">${quotesRandom.arabic}</h2>
        <h6 class="text-start" style="font-style: italic; font-weight: 400;">${quotesRandom.arti}</h6>
      `;

    $(".widget-header").html(fragmentQuotes);

    // Menentukan tinggi header dan margin-bottom
    // Hal ini dilakukan karena beberapa quotes memiliki kalimat yang panjang, sehingga nantinya akan overlaping
    const widgetHeight = getComputedStyle(
      document.querySelector(".widget-header")
    ).height;
    document.querySelector(
      ".header"
    ).style.height = `calc(80vh + ${widgetHeight} / 2)`;
    document.querySelector(
      ".header"
    ).style.marginBottom = `calc(${widgetHeight} / 4 + 30px)`;
  },
});

//zakat
$(document).ready(function() {
    $('#jenisZakat').change(function() {
        $('.zakat-fields').hide();
        $('#' + $(this).val() + 'Fields').show();
    });

    $('#hitungMaal').click(function(e) {
        e.preventDefault();
        var harta = parseFloat($('#harta').val()) || 0;
        var hutang = parseFloat($('#hutang').val()) || 0;
        var nishab = parseFloat($('#nishabMaal').val()) || 0;
        var hasil = (harta - hutang) * 0.025;
        if (harta - hutang >= nishab) {
            $('#hasilMaal').html('Jumlah zakat maal: Rp ' + hasil.toLocaleString());
        } else {
            $('#hasilMaal').html('Harta belum mencapai nishab.');
        }
    });

    $('#hitungFitrah').click(function(e) {
        e.preventDefault();
        var jiwa = parseInt($('#jumlahJiwa').val()) || 0;
        var harga = parseFloat($('#hargaBeras').val()) || 0;
        var hasil = jiwa * 2.5 * harga;
        $('#hasilFitrah').html('Jumlah zakat fitrah: Rp ' + hasil.toLocaleString());
    });

    $('#hitungPenghasilan').click(function(e) {
        e.preventDefault();
        var penghasilan = parseFloat($('#penghasilanPerBulan').val()) || 0;
        var nishab = parseFloat($('#nishabPenghasilan').val()) || 0;
        var hasil = penghasilan * 0.025;
        if (penghasilan >= nishab) {
            $('#hasilPenghasilan').html('Jumlah zakat penghasilan: Rp ' + hasil.toLocaleString());
        } else {
            $('#hasilPenghasilan').html('Penghasilan belum mencapai nishab.');
        }
    });

    $('#hitungPerdagangan').click(function(e) {
        e.preventDefault();
        var modal = parseFloat($('#modalPerdagangan').val()) || 0;
        var keuntungan = parseFloat($('#keuntunganPerdagangan').val()) || 0;
        var hutang = parseFloat($('#hutangPerdagangan').val()) || 0;
        var nishab = parseFloat($('#nishabPerdagangan').val()) || 0;
        var hasil = (modal + keuntungan - hutang) * 0.025;
        if (modal + keuntungan - hutang >= nishab) {
            $('#hasilPerdagangan').html('Jumlah zakat perdagangan: Rp ' + hasil.toLocaleString());
        } else {
            $('#hasilPerdagangan').html('Harta belum mencapai nishab.');
        }
    });

    $('#hitungPertanian').click(function(e) {
        e.preventDefault();
        var hasilPanen = parseFloat($('#hasilPanen').val()) || 0;
        var hargaPerKg = parseFloat($('#hargaPerKg').val()) || 0;
        var biayaPengairan = parseFloat($('#biayaPengairan').val()) || 0;
        var nishab = parseFloat($('#nishabPertanian').val()) || 0;
        var hasil = (hasilPanen * hargaPerKg - biayaPengairan) * 0.05;
        if (hasilPanen >= nishab) {
            $('#hasilPertanian').html('Jumlah zakat pertanian: Rp ' + hasil.toLocaleString());
        } else {
            $('#hasilPertanian').html('Hasil panen belum mencapai nishab.');
        }
    });

    $('#hitungPeternakan').click(function(e) {
        e.preventDefault();
        var jumlahHewan = parseInt($('#jumlahHewan').val()) || 0;
        var jenisHewan = $('#jenisHewan').val();
        var hasil = 0;

        if (jenisHewan === 'unta') {
            if (jumlahHewan >= 5) {
                hasil = jumlahHewan / 5;
            }
        } else if (jenisHewan === 'sapi') {
            if (jumlahHewan >= 30) {
                hasil = jumlahHewan / 30;
            }
        } else if (jenisHewan === 'kambing') {
            if (jumlahHewan >= 40) {
                hasil = jumlahHewan / 40;
            }
        }

        if (hasil > 0) {
            $('#hasilPeternakan').html('Jumlah zakat peternakan: ' + hasil + ' ekor.');
        } else {
            $('#hasilPeternakan').html('Jumlah hewan belum mencapai nishab.');
        }
    });
});
//zakat

// JavaScript untuk Pop-up
window.onload = function () {
    document.getElementById('myPopup').style.display = 'block';
};

document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('myPopup').style.display = 'none';
});

// ... (JavaScript lainnya) ...

function copyLink() {
  navigator.clipboard.writeText("https://islamic-bit.netlify.app");
}
