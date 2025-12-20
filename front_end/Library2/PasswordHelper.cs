namespace Library2;
using BCrypt.Net;

public static class PasswordHelper
{
    // Encrypts the password before saving to the DB
    public static string HashPassword(string plainPassword)
    {
        return BCrypt.HashPassword(plainPassword);
    }

    // Checks if the entered password matches the hash in the DB
    public static bool VerifyPassword(string inputPassword, string storedHash)
    {
        return BCrypt.Verify(inputPassword, storedHash);
    }
}