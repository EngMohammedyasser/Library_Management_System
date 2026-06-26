using Microsoft.EntityFrameworkCore;

namespace Library2.Models
{
    public class LibraryContext : DbContext
    {
        string sqlConStr = "Server = LAPTOP-7Q3T4RNM\\MSSQLSERVER01;Database = Library2;user Id = mahmoud;password = 123456;TrustServerCertificate=True;";

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(sqlConStr);

        }

        public DbSet<User> Users { get; set; }  

        public DbSet<Book> Books { get; set; }

        public DbSet<Borrowing> Borrowing { get; set; }


    }
}
