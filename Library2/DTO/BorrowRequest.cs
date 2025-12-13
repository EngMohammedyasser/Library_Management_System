namespace Library2.DTO
{
    public class BorrowRequest
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
        public DateTime BorrowDate { get; set; } = DateTime.Now;
        public DateTime DueDate { get; set; } = DateTime.Now.AddDays(14); // Default 2 weeks borrowing period

    }
}
