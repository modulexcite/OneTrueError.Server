﻿using System.ComponentModel.DataAnnotations;

namespace OneTrueError.Web.Areas.Admin.Models
{
    public class AccountViewModel
    {
        [Required, StringLength(40)]
        public string UserName { get; set; }

        [Required, StringLength(255)]
        public string EmailAddress { get; set; }

        [Required, StringLength(40)]
        public string Password { get; set; }

    }
}