const $ = (s) => document.querySelector(s);
const STORE_USERS = "journeyhub_users";
const STORE_TRIP = "journeyhub_trip";
const STORE_SESSION = "journeyhub_session";

const defaultTrip = {
  title: "Explore the beauty of Bali",
  description: "Perjalanan bersama, pengalaman tak terlupakan.",
  location: "Bali, Indonesia",
  date: "15–18 Desember 2026"
};
const users = () => JSON.parse(localStorage.getItem(STORE_USERS) || "[]");
const saveUsers = (data) => localStorage.setItem(STORE_USERS, JSON.stringify(data));
const trip = () => ({...defaultTrip, ...JSON.parse(localStorage.getItem(STORE_TRIP) || "{}")});
let authMode = "register";

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2800);
}
function showView(view) {
  ["#authView", "#participantView", "#adminView"].forEach(id => $(id).classList.add("hidden"));
  $(view).classList.remove("hidden");
  window.scrollTo(0, 0);
}
function setAuthMode(mode) {
  authMode = mode;
  const registering = mode === "register";
  $("#registerForm").classList.toggle("hidden", !registering);
  $("#loginForm").classList.toggle("hidden", registering);
  $("#authEyebrow").textContent = registering ? "WELCOME ABOARD" : "WELCOME BACK";
  $("#authTitle").textContent = registering ? "Buat akun peserta" : "Masuk ke akun";
  $("#authSubtitle").textContent = registering ? "Daftar untuk mengakses informasi perjalanan Anda." : "Masukkan nomor HP dan password yang sudah didaftarkan.";
  $("#authSwitch").innerHTML = registering
    ? 'Sudah punya akun? <button type="button" class="text-button" id="switchAuth">Masuk di sini</button>'
    : 'Belum punya akun? <button type="button" class="text-button" id="switchAuth">Daftar sekarang</button>';
  $("#switchAuth").addEventListener("click", () => setAuthMode(registering ? "login" : "register"));
}
function openParticipant(user) {
  localStorage.setItem(STORE_SESSION, JSON.stringify({role:"participant", phone:user.phone}));
  renderParticipant(user);
  showView("#participantView");
}
function renderParticipant(user) {
  const currentTrip = trip();
  $("#participantName").textContent = user.name.split(" ")[0];
  $("#userAvatar").textContent = user.name.charAt(0).toUpperCase();
  $("#tripTitle").textContent = currentTrip.title;
  $("#tripDescription").textContent = currentTrip.description;
  $("#tripLocation").textContent = currentTrip.location;
  $("#tripDate").textContent = currentTrip.date;
  $("#infoGrid").innerHTML = [
    ["⌖","Lokasi berkumpul","Titik kumpul dan alamat keberangkatan akan diinformasikan di sini."],
    ["◷","Waktu keberangkatan","Pastikan hadir 30 menit sebelum jadwal keberangkatan."],
    ["▣","Yang perlu disiapkan","Siapkan identitas diri dan perlengkapan pribadi."]
  ].map(x=>`<article class="info-card"><div class="info-icon">${x[0]}</div><strong>${x[1]}</strong><p>${x[2]}</p></article>`).join("");
  $("#agendaList").innerHTML = [
    ["07.30","Registrasi peserta","Berkumpul di titik keberangkatan."],
    ["08.00","Keberangkatan","Perjalanan menuju destinasi."],
    ["12.00","Makan siang & istirahat","Waktu bebas dan makan bersama."],
    ["15.00","Check-in & acara","Informasi kegiatan berikutnya akan diperbarui."]
  ].map(x=>`<div class="agenda-item"><span class="agenda-time">${x[0]}</span><span class="agenda-pin"></span><div><strong>${x[1]}</strong><p>${x[2]}</p></div></div>`).join("");
  $("#announcementList").innerHTML = `
    <article class="announcement"><div class="announcement-icon">✦</div><div><strong>Selamat datang di portal perjalanan!</strong><p>Periksa halaman ini secara berkala untuk mendapatkan informasi dan pembaruan terbaru.</p></div></article>
    <article class="announcement"><div class="announcement-icon">!</div><div><strong>Persiapan sebelum berangkat</strong><p>Pastikan data registrasi sudah benar dan siapkan identitas diri sebelum hari keberangkatan.</p></div></article>`;
}
function openAdmin() {
  localStorage.setItem(STORE_SESSION, JSON.stringify({role:"admin"}));
  renderAdmin();
  showView("#adminView");
}
function renderAdmin() {
  const list = users();
  $("#totalParticipants").textContent = list.length;
  $("#participantTable").innerHTML = list.length ? list.map(u=>`<tr><td><strong>${escapeHtml(u.name)}</strong></td><td>${escapeHtml(u.department)}</td><td>${escapeHtml(u.phone)}</td><td><span class="status-pill">Terdaftar</span></td></tr>`).join("") : '<tr><td colspan="4">Belum ada peserta. Coba daftar melalui halaman peserta.</td></tr>';
  const currentTrip = trip();
  const form = $("#contentForm");
  form.elements.title.value = currentTrip.title;
  form.elements.location.value = currentTrip.location;
  form.elements.date.value = currentTrip.date;
  form.elements.description.value = currentTrip.description;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
$("#registerForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  const phone = data.phone.replace(/\s+/g,"");
  if (users().some(u=>u.phone === phone)) return toast("Nomor HP sudah terdaftar. Silakan masuk.");
  if (data.password.length < 6) return toast("Password minimal 6 karakter.");
  const user = {name:data.name.trim(), department:data.department.trim(), phone, password:data.password};
  saveUsers([...users(), user]);
  e.currentTarget.reset();
  toast("Registrasi berhasil. Selamat datang!");
  openParticipant(user);
});
$("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  const user = users().find(u=>u.phone === data.phone.replace(/\s+/g,"") && u.password === data.password);
  if (!user) return toast("Nomor HP atau password tidak sesuai.");
  openParticipant(user);
});
$("#switchAuth").addEventListener("click", () => setAuthMode("login"));
$("#adminEntry").addEventListener("click", openAdmin);
document.querySelectorAll("[data-logout]").forEach(btn=>btn.addEventListener("click",()=>{
  localStorage.removeItem(STORE_SESSION);
  setAuthMode("register");
  showView("#authView");
  toast("Anda telah keluar.");
}));
$("#contentForm").addEventListener("submit", e=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  localStorage.setItem(STORE_TRIP, JSON.stringify(data));
  toast("Informasi perjalanan berhasil diperbarui.");
  renderAdmin();
});
function init() {
  setAuthMode("register");
  const session = JSON.parse(localStorage.getItem(STORE_SESSION) || "null");
  if (session?.role === "admin") { renderAdmin(); showView("#adminView"); }
  else if (session?.role === "participant") {
    const user = users().find(u=>u.phone === session.phone);
    if (user) { renderParticipant(user); showView("#participantView"); }
    else showView("#authView");
  } else showView("#authView");
}
init();
