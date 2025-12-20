using System.ComponentModel.DataAnnotations;

namespace Library2.Models
{
    public class Book
    {
        [Key]
        public int BookId { get; set; }

        [Required]
        public string Title { get; set; } 

        [Required]
        public string Author { get; set; } 

        public int AvailableCopies { get; set; } 

        public string CoverImageUrl { get; set; }

        // Navigation Property: A book can appear in many borrowing records
        public virtual ICollection<Borrowing>? Borrowings { get; set; }

    }
}
