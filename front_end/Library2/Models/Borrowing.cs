using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Library2.Models
{
    public class Borrowing
    {
        [Key]
        public int BorrowingId { get; set; }

        // Foreign Key linking to User
        [ForeignKey("User")]
        public int UserId { get; set; } 
        public virtual User User { get; set; }

        // Foreign Key linking to Book
        [ForeignKey("Book")]
        public int BookId { get; set; } 
        public virtual Book Book { get; set; }

        [Required]
        public DateTime BorrowDate { get; set; } 

        [Required]
        public DateTime DueDate { get; set; } 

        // Nullable because it hasn't been returned yet
        public DateTime? ReturnDate { get; set; }

        // Tracks if the book is "Borrowed", "Returned", or "Overdue"
        public string Status { get; set; } = "Borrowed";

    }
}
