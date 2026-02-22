using KurumsalBackend.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. SERVÝSLERÝ EKLEME
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- CORS AYARI (KAPIYI AÇMA) ---
// React'in (localhost:5173) Backend'e eriþmesine izin veriyoruz.
builder.Services.AddCors(options =>
{
    options.AddPolicy("IzinVer", policy =>
    {
        policy.AllowAnyOrigin()  // Kim gelirse gelsin (React, Postman vs.)
              .AllowAnyMethod()  // GET, POST, PUT, DELETE hepsi serbest
              .AllowAnyHeader(); // Her türlü baþlýk kabul
    });
});
// --------------------------------

var app = builder.Build();

// 2. MIDDLEWARE (ARA KATMAN) SIRALAMASI ÇOK ÖNEMLÝDÝR!
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- CORS'U DEVREYE ALMA ---
// DÝKKAT: Bu satýr, UseAuthorization ve MapControllers'dan ÖNCE olmalý!
app.UseCors("IzinVer");
// ----------------------------

app.UseAuthorization();

app.MapControllers();

app.Run();