﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace midwaymeasures.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult BugReport()
        {
            return View();
        }

        public ActionResult Admin()
        {
            return View();
        }

        public ActionResult Bucks()
        {
            return View();
        }

        public ActionResult Me()
        {
            return View();
        }

        public ActionResult SyncBoards()
        {
            return View();
        }

        public ActionResult SyncCards()
        {
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}