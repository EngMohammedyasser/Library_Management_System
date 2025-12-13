using Library2.DTO;
using Library2.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Library2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        LibraryContext _Dbcontext;

        public BookController(LibraryContext dbcontext)
        {
            _Dbcontext = dbcontext;
        }

        [HttpGet("showAllBooks")]
        public IActionResult getBooks()
        {
            List<Book> books = _Dbcontext.Books.ToList();

            return Ok(books);
        }

        [HttpGet("{title}")]
        public IActionResult getBookByTitle(string title) 
        { 
            var book = _Dbcontext.Books.FirstOrDefault(b => b.Title.ToLower() == title.ToLower());

            if (book != null)
            { 
              return Ok(book);
            }

            return NotFound("Book doesn't exist");

        }

        [HttpPost("Borrow")]
        public IActionResult BorrowBook([FromBody] BorrowRequest request)
        {
            var book = _Dbcontext.Books.FirstOrDefault(b => b.BookId == request.BookId);
            if (book == null || book.AvailableCopies <= 0)
            {
                return BadRequest("Book is not available for borrowing.");
            }
            var borrowing = new Borrowing
            {
                UserId = request.UserId,
                BookId = request.BookId,
                BorrowDate = DateTime.Now,
                DueDate = DateTime.Now.AddDays(14), // 2 weeks borrowing period
                Status = "Borrowed"
            };
            try {
                book.AvailableCopies -= 1;
                _Dbcontext.Borrowing.Add(borrowing);
                _Dbcontext.SaveChanges();
                return Ok(new { message = "Book borrowed successfully", borrowingId = borrowing.BorrowingId });

            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing the borrowing request.");
            }
        }

    }
}
