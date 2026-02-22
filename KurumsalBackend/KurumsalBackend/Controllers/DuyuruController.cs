using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using KurumsalBackend.Models;
using System.Data;

namespace KurumsalBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DuyuruController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public DuyuruController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public JsonResult Getir()
        {
            List<Duyuru> duyuruListesi = new List<Duyuru>();
            string query = "sp_DuyurulariGetir";
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        while (myReader.Read())
                        {
                            Duyuru yeniDuyuru = new Duyuru
                            {
                                Id = Convert.ToInt32(myReader["Id"]),
                                Baslik = myReader["Baslik"].ToString(),
                                Icerik = myReader["Icerik"].ToString(),
                                Tarih = Convert.ToDateTime(myReader["Tarih"])
                            };
                            duyuruListesi.Add(yeniDuyuru);
                        }
                    }
                }
            }
            return new JsonResult(duyuruListesi);
        }
        [HttpPost] // Bu metodun Veri GÖNDERME işlemi olduğunu belirtir
        public JsonResult Ekle(Duyuru yeniDuyuru)
        {
            string query = "sp_DuyuruEkle";
            string sqlDataSource = _configuration.GetConnectionString("DefaultConnection");

            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.CommandType = CommandType.StoredProcedure;

                    // Parametreleri ekliyoruz (SQL Injection önlemi)
                    myCommand.Parameters.AddWithValue("@Baslik", yeniDuyuru.Baslik);
                    myCommand.Parameters.AddWithValue("@Icerik", yeniDuyuru.Icerik);

                    // ExecuteNonQuery: "Sadece çalıştır, bana veri getirmene gerek yok" demektir.
                    // Insert, Update, Delete işlemlerinde bu kullanılır.
                    myCommand.ExecuteNonQuery();
                }
            }

            return new JsonResult("Başarıyla Eklendi");
        }
    }
}