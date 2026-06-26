using System.ComponentModel.DataAnnotations;

namespace Library2.Models
{
    public class User
    {
        public int UserId { get; set; }

        [Required]
        public string FullName { get; set; } 

        [Required]
        [EmailAddress]
        public string Email { get; set; } 

        [Required]
        public string Password { get; set; } 

        // Distinguishes between "Admin" (who sees the dashboard) and regular "Member"
        public string Role { get; set; } = "Member";

        // Navigation Property: A user can have many borrowing records
        public virtual ICollection<Borrowing>? Borrowings { get; set; }

    }
}
