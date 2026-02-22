namespace KurumsalBackend.Models
{
    public class Duyuru
    {
        // SQL Tablosundaki kolonların aynısı
        public int Id { get; set; }
        public string Baslik { get; set; } = string.Empty;
        public string Icerik { get; set; } = string.Empty;
        public DateTime Tarih { get; set; }
    }
}