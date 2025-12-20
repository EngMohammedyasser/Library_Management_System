using Library2.DTO;
using Library2.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Library2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        LibraryContext Dbcontext;
        public UserController(LibraryContext context) 
        { 
            Dbcontext = context;
        }


        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
           
            if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Name and Email are required.");
            }

            
            if (request.Password != request.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }

            
            bool emailExists = Dbcontext.Users.Any(u => u.Email == request.Email);
            if (emailExists)
            {
                return BadRequest("This email is already registered.");
            }

            
            var user = new User()
            {
                FullName = request.Name,
                Email = request.Email,
                // Using your helper
                Password = PasswordHelper.HashPassword(request.Password),
                Role = "Member" // Set a default role
            };

            
            try
            {
                Dbcontext.Users.Add(user);
                Dbcontext.SaveChanges();
            }
            catch (Exception ex)
            {
                // Log the error internally
                return StatusCode(500, "An error occurred while saving.");
            }

            return Ok(new { message = "Registration successful", userId = user.UserId , userName = user.FullName , Email=user.Email});
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // 1. Basic Validation
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and Password are required.");
            }

            // 2. Find User by Email
            var user = Dbcontext.Users.SingleOrDefault(u => u.Email == request.Email);

            // 3. Check if user exists AND if password is correct
            // Note: We use the helper to verify the hash against the database
            if (user == null || !PasswordHelper.VerifyPassword(request.Password, user.Password))
            {
                // Security Tip: Don't reveal if it was the email or password that was wrong
                return Unauthorized("Invalid email or password.");
            }

            // 4. Login Successful - Return safe data
            return Ok(new
            {
                message = "Login successful",
                userId = user.UserId,
                userName = user.FullName,  // Frontend needs this for display
                email = user.Email,
                role = user.Role  // Frontend needs this to show "Admin Dashboard" vs "Home Page"
            });
        }

        [HttpGet("getAllUsers")]
        public ActionResult GetAllUsers()
        {
            var users = Dbcontext.Users.Select(u => new 
            {
                u.UserId,
                u.FullName,
                u.Email,
                u.Role
            }).ToList();
            return Ok(users);
        }


        [HttpGet("UserBooks")]
        public IActionResult GetUserBooks()
        {
            var borrowings = Dbcontext.Borrowing.Include(b => b.Book).Include(b => b.User)
                .ToList();

            List<UserAndBook> userBooks = new List<UserAndBook>();

            foreach (var borrow in borrowings) 
            { 
               UserAndBook userAndBook = new UserAndBook();


                userAndBook.UserId = borrow.UserId;
                userAndBook.UserName = borrow.User.FullName;
                userAndBook.BookId = borrow.BookId;
                userAndBook.Title = borrow.Book.Title;
                userAndBook.borrowDate =borrow.BorrowDate;
                userBooks.Add(userAndBook);

            }

            return Ok(userBooks);
        }
       
    }
 
}
