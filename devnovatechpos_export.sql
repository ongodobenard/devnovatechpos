-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: devnovatechpos
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_tokens`
--

DROP TABLE IF EXISTS `auth_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `token` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `auth_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_tokens`
--

LOCK TABLES `auth_tokens` WRITE;
/*!40000 ALTER TABLE `auth_tokens` DISABLE KEYS */;
INSERT INTO `auth_tokens` VALUES (1,1,'2729dcab4de8816aba3b8b87b2dcc9763954fb517de44e6f8dfe14c6987d0ac9','2026-06-27 09:06:39','2026-06-26 09:06:39'),(2,1,'2ce4a24b5113f1548e644f9d8437c6f8b459605edca71cc49b850ed29fad43dd','2026-06-27 09:10:06','2026-06-26 09:10:06'),(3,1,'77f1cc86926c92119a60f1070dcef4f38e66e6b1a4787d70801cd77498122922','2026-06-27 12:46:08','2026-06-26 12:46:08'),(4,1,'211c55179431c68be4a29f7179f97468b9bfa89a3b894e8376b9a327ec555bbe','2026-06-27 19:39:25','2026-06-26 19:39:25'),(5,2,'d2e0897096c68b63378b107f356d6b0316a35a2f20aa0510b62fc1e6c345608b','2026-06-27 19:45:37','2026-06-26 19:45:37'),(6,3,'85aa28920811179eee74d17fe554f2defa2723de6bdbbe13728b94217ebbcaad','2026-06-27 20:10:45','2026-06-26 20:10:45'),(7,2,'7defda2493da8510be507dd35653cffdb003f27dc6d9ef71669d05b6fca45376','2026-06-27 20:11:36','2026-06-26 20:11:36'),(8,3,'3c7a238f7f89422e142b17e85d252fd6864f6ec2e557fe0a445d92814cdcc143','2026-06-27 20:36:51','2026-06-26 20:36:51'),(9,3,'1654788b10b7862227b5f18a3f2133d3c10863b9a2003b8915b148549ce0c22f','2026-06-27 20:53:10','2026-06-26 20:53:10'),(10,2,'ef0b63e858b01c31703b187d5a8bc95837de6598ca2aff923fa1a97c3978de03','2026-06-27 20:55:16','2026-06-26 20:55:16'),(11,3,'7e67efbdafa7a555a7dd268bb68d9f7b4fc1627b898ce0cdaaedca2aa0bbdef4','2026-06-27 21:23:00','2026-06-26 21:23:00'),(12,3,'7c9450c4dd23854b09ce3be931ee2819836d8b66c0d1d9fb95d493cee2911a15','2026-06-27 21:32:26','2026-06-26 21:32:26'),(13,2,'2566bc5bb92c9f0bd39552e083f19b4c6c05e6a54955be4513d941d688470645','2026-06-27 21:34:34','2026-06-26 21:34:34'),(14,3,'020182a709a04d154ffe0e723d486dea8e7b174e22ccd293c417bc14cc1a7e4a','2026-06-27 22:12:22','2026-06-26 22:12:22'),(15,2,'b7dd5cfc99638c88ff9130f32262cae133387ccde91a25917023566fa48f10d9','2026-06-27 22:17:39','2026-06-26 22:17:39'),(16,3,'28edc269043b249fc206b43baa286a958cfbfd451d23590413d8f269c30c9478','2026-06-27 22:55:53','2026-06-26 22:55:53'),(17,2,'6ab62b2231a8104e854bb04ce3f129636a45b1c71e3a99877decbc57c8735a86','2026-06-27 23:05:39','2026-06-26 23:05:39'),(18,3,'4a6ef1e13ccf89bf11f369eec6416e50721946090fcf60a63df545d875ab94bc','2026-06-27 23:15:51','2026-06-26 23:15:51'),(19,2,'1535b8a75076f7e234b5c9d1c08b1da7bbdfdd9ec074f11d53dc7c8f2289741a','2026-06-27 23:55:07','2026-06-26 23:55:07'),(20,3,'8a81c6ac742f9ee10b2fab0123f930a0f4f5df0613ac9ddbe2747fe56897ff14','2026-06-28 00:00:00','2026-06-27 00:00:00'),(21,2,'3f2466a05648851f26e92bc9694dd43bc626c0481831f7d77ce0be7d1466b3d3','2026-06-28 00:06:20','2026-06-27 00:06:20'),(22,1,'df88aa22b6be0ea7e498807c4979f8c37ffb72117cc832f9b1d9771608e03938','2026-06-28 00:14:18','2026-06-27 00:14:18'),(23,4,'62ec9c08fadb3bdb775c37fb34d3cf92b7158292b80d0f9f0001a1c10a29c009','2026-06-28 00:15:58','2026-06-27 00:15:58'),(24,5,'33921eddfaf0ce5b9eae891ff7feff301992242d49c6ce4bed3213cbc78ad76c','2026-06-28 00:17:03','2026-06-27 00:17:03'),(25,4,'e7cb304ba210092ad515700fef5cbb8b67abe540ca52bd09bbf30586a9436b2d','2026-06-28 00:17:46','2026-06-27 00:17:46'),(26,5,'5ee2761618e952210776da75717f9bd64d4c958e78187b9255985233f9554edb','2026-06-28 00:20:10','2026-06-27 00:20:10'),(27,4,'e6ea47b21a42af14114cc982ef5e61a8eb5a2cda78e1c56cafe3c2aad3dc46a5','2026-06-28 00:21:21','2026-06-27 00:21:21'),(28,5,'dfe31a913ed112274a6bc3d20866d287a030fad04a845b345ad7aef9eb6a4ec2','2026-06-28 01:43:38','2026-06-27 01:43:38'),(29,4,'dfe2fc36be1c5116fdfbf1048e7da48dc633f921d30ce8f650ebe32daaeb475b','2026-06-28 01:45:32','2026-06-27 01:45:32'),(30,1,'00203bc249afcd5599508913a83f6627b7d64ddec211f2d214e4780abe51e7b2','2026-06-28 02:16:48','2026-06-27 02:16:48'),(31,6,'b2eaee624b9788e949b89b11688712260614053bcdfa72cd193d17095696ed9a','2026-06-28 02:17:53','2026-06-27 02:17:53');
/*!40000 ALTER TABLE `auth_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `businesses` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `business_type` enum('pharmacy','electronics','hardware','restaurant','other') NOT NULL,
  `owner_id` bigint(20) unsigned DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `subscription_plan` enum('basic','pro','enterprise') DEFAULT 'basic',
  `subscription_expires_at` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesses`
--

LOCK TABLES `businesses` WRITE;
/*!40000 ALTER TABLE `businesses` DISABLE KEYS */;
INSERT INTO `businesses` VALUES (1,'Test Pharm','pharmacy',2,'+254796038686','ongodobenard@gmail.com','14793-00400, NAIROBI','basic','2026-07-11',1,'2026-06-26 19:45:03','2026-06-26 19:45:04'),(2,'NB PHARM','pharmacy',4,'+254792216304','ongodobenard72@gmail.com','4658','basic','2026-07-12',1,'2026-06-27 00:15:43','2026-06-27 00:15:43'),(3,'ABC','pharmacy',6,'+254796038686','ongodobenard@gmail.com','14793-00400, NAIROBI','basic','2026-07-04',1,'2026-06-27 02:17:34','2026-06-27 02:17:34');
/*!40000 ALTER TABLE `businesses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `business_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Antibiotic',2,'2026-06-27 01:45:46'),(2,'Vitamins',2,'2026-06-27 01:46:57'),(3,'Mother and child',2,'2026-06-27 01:47:07'),(4,'ANT',3,'2026-06-27 02:18:02'),(5,'ABD',3,'2026-06-27 02:18:07'),(6,'DGR',3,'2026-06-27 02:18:11');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `loyalty_points` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,1,'Benard Ongodo','0796038686','ongodobenard@gmail.com',NULL,0,'2026-06-26 21:41:54','2026-06-26 21:41:54'),(2,3,'DORICE AUMA','0792216304','',NULL,0,'2026-06-27 10:04:05','2026-06-27 10:04:05');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `recorded_by` int(11) NOT NULL,
  `category` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL DEFAULT 'cash',
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,1,0,'Rent','sdkf',2000.00,'cash','2026-06-27','2026-06-26 22:06:29','2026-06-26 22:06:29'),(2,1,0,'Stock Purchase','ggjgjg',45000.00,'mpesa','2026-06-27','2026-06-26 22:50:52','2026-06-26 22:50:52'),(3,2,0,'Rent','rent',10000.00,'cash','2026-06-27','2026-06-27 01:40:04','2026-06-27 01:40:04'),(4,3,0,'Transport','TRA',200.00,'mpesa','2026-06-27','2026-06-27 10:04:35','2026-06-27 10:04:35');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `invoice_number` varchar(100) NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `total` decimal(10,2) NOT NULL,
  `status` enum('draft','sent','paid') DEFAULT 'draft',
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_06_25_195058_create_personal_access_tokens_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `generic_name` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `buying_price` decimal(10,2) DEFAULT 0.00,
  `selling_price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `reorder_level` int(11) DEFAULT 10,
  `unit` varchar(50) DEFAULT NULL,
  `barcode` varchar(100) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `business_id` (`business_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1027 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale_items`
--

DROP TABLE IF EXISTS `sale_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sale_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale_items`
--

LOCK TABLES `sale_items` WRITE;
/*!40000 ALTER TABLE `sale_items` DISABLE KEYS */;
INSERT INTO `sale_items` VALUES (1,1,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 20:27:38'),(2,2,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 20:35:32'),(3,3,1,'Rybelsous',3,7000.00,21000.00,'2026-06-26 20:56:37'),(4,4,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 21:33:26'),(5,5,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 21:33:57'),(6,6,1,'Rybelsous',9,7000.00,63000.00,'2026-06-26 21:37:31'),(7,7,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 21:38:28'),(8,8,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 21:46:47'),(9,9,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 21:47:20'),(10,10,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 21:48:07'),(11,11,1,'Rybelsous',2,7000.00,14000.00,'2026-06-26 22:10:09'),(12,12,1,'Rybelsous',4,7000.00,28000.00,'2026-06-26 22:16:57'),(13,13,2,'Mounjarou',6,10140.00,60840.00,'2026-06-26 22:38:52'),(14,14,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 22:52:03'),(15,15,2,'Mounjarou',10,10140.00,101400.00,'2026-06-26 23:44:04'),(16,16,2,'Mounjarou',1,10140.00,10140.00,'2026-06-26 23:45:14'),(17,17,2,'Mounjarou',39,10140.00,395460.00,'2026-06-26 23:45:56'),(18,17,1,'Rybelsous',5,7000.00,35000.00,'2026-06-26 23:45:56'),(19,18,1,'Rybelsous',2,7000.00,14000.00,'2026-06-26 23:47:01'),(20,19,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 23:47:31'),(21,20,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 23:53:43'),(22,21,1,'Rybelsous',1,7000.00,7000.00,'2026-06-26 23:54:01'),(23,22,1,'Rybelsous',2,7000.00,14000.00,'2026-06-26 23:59:27'),(24,22,2,'Mounjarou',1,10140.00,10140.00,'2026-06-26 23:59:27'),(25,23,2,'Mounjarou',1,10140.00,10140.00,'2026-06-27 00:00:50'),(26,24,2,'Mounjarou',1,10140.00,10140.00,'2026-06-27 00:02:48'),(27,25,2,'Mounjarou',1,10140.00,10140.00,'2026-06-27 00:05:11'),(28,25,1,'Rybelsous',1,7000.00,7000.00,'2026-06-27 00:05:11'),(29,26,2,'Mounjarou',1,10140.00,10140.00,'2026-06-27 00:05:29'),(30,26,1,'Rybelsous',1,7000.00,7000.00,'2026-06-27 00:05:29'),(31,27,3,'Pharametckc',1,10336.76,10336.76,'2026-06-27 00:19:32'),(32,28,3,'Pharametckc',2,10336.76,20673.52,'2026-06-27 00:20:41'),(33,29,4,'been',1,6650.00,6650.00,'2026-06-27 01:59:51'),(34,29,3,'Pharametckc',4,10336.76,41347.04,'2026-06-27 01:59:51'),(35,30,5,'A',1,130.00,130.00,'2026-06-27 02:21:27'),(36,30,6,'B',2,260.00,520.00,'2026-06-27 02:21:27'),(37,30,7,'C',3,390.00,1170.00,'2026-06-27 02:21:27'),(38,31,5,'A',1,130.00,130.00,'2026-06-27 10:01:52'),(39,31,6,'B',1,260.00,260.00,'2026-06-27 10:01:52');
/*!40000 ALTER TABLE `sale_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` bigint(20) unsigned DEFAULT NULL,
  `cashier_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `receipt_number` varchar(100) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT 0.00,
  `tax` decimal(10,2) DEFAULT 0.00,
  `amount_paid` decimal(10,2) NOT NULL,
  `change_given` decimal(10,2) DEFAULT 0.00,
  `is_returned` tinyint(1) DEFAULT 0,
  `returned_at` timestamp NULL DEFAULT NULL,
  `payment_method` enum('cash','mpesa','card') DEFAULT 'cash',
  `status` enum('completed','refunded','pending') DEFAULT 'completed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_number` (`receipt_number`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,1,2,NULL,'RCP-6A3EE0BADB57C',7000.00,0.00,966.00,9000.00,2000.00,0,NULL,'cash','completed','2026-06-26 20:27:38','2026-06-26 20:27:38'),(2,1,2,NULL,'RCP-6A3EE29463606',7000.00,0.00,966.00,56000.00,49000.00,0,NULL,'cash','completed','2026-06-26 20:35:32','2026-06-26 20:35:32'),(3,1,2,NULL,'RCP-6A3EE785263F5',21000.00,0.00,2897.00,21000.00,0.00,0,NULL,'cash','completed','2026-06-26 20:56:37','2026-06-26 20:56:37'),(4,1,3,NULL,'RCP-6A3EF0260F5A8',7000.00,0.00,966.00,8000.00,1000.00,0,NULL,'cash','completed','2026-06-26 21:33:26','2026-06-26 21:33:26'),(5,1,3,NULL,'RCP-6A3EF0458F6DD',7000.00,0.00,966.00,9000.00,2000.00,0,NULL,'cash','completed','2026-06-26 21:33:57','2026-06-26 21:33:57'),(6,1,2,NULL,'RCP-6A3EF11B2050E',63000.00,0.00,8690.00,76000.00,13000.00,0,NULL,'cash','completed','2026-06-26 21:37:31','2026-06-26 21:37:31'),(7,1,2,NULL,'RCP-6A3EF15448AF0',7000.00,0.00,966.00,8000.00,1000.00,0,NULL,'cash','completed','2026-06-26 21:38:28','2026-06-26 21:38:28'),(8,1,2,NULL,'RCP-6A3EF34714DF0',7000.00,0.00,966.00,7000.00,0.00,0,NULL,'cash','completed','2026-06-26 21:46:47','2026-06-26 21:46:47'),(9,1,2,NULL,'RCP-6A3EF368AA11E',7000.00,0.00,966.00,9000.00,2000.00,0,NULL,'cash','completed','2026-06-26 21:47:20','2026-06-26 21:47:20'),(10,1,2,NULL,'RCP-6A3EF397E84B7',7000.00,0.00,966.00,10000.00,3000.00,0,NULL,'cash','completed','2026-06-26 21:48:07','2026-06-26 21:48:07'),(11,1,2,NULL,'RCP-6A3EF8C158761',14000.00,0.00,1931.00,15000.00,1000.00,0,NULL,'cash','completed','2026-06-26 22:10:09','2026-06-26 22:10:09'),(12,1,3,NULL,'RCP-6A3EFA59DB8D1',28000.00,0.00,3862.00,30000.00,2000.00,0,NULL,'cash','completed','2026-06-26 22:16:57','2026-06-26 22:16:57'),(13,1,2,NULL,'RCP-6A3EFF7CBD419',60840.00,0.00,8392.00,70000.00,9160.00,0,NULL,'cash','completed','2026-06-26 22:38:52','2026-06-26 22:38:52'),(14,1,2,1,'RCP-6A3F0293D5364',7000.00,0.00,966.00,50000.00,43000.00,0,NULL,'cash','completed','2026-06-26 22:52:03','2026-06-26 22:52:03'),(15,1,3,NULL,'RCP-6A3F0EC4BDBB9',101400.00,0.00,13986.00,200000.00,98600.00,0,NULL,'cash','completed','2026-06-26 23:44:04','2026-06-26 23:44:04'),(16,1,3,NULL,'RCP-6A3F0F0A01550',10140.00,0.00,1399.00,20000.00,9860.00,0,NULL,'cash','completed','2026-06-26 23:45:14','2026-06-26 23:45:14'),(17,1,3,NULL,'RCP-6A3F0F34D4F82',430460.00,0.00,59374.00,440000.00,9540.00,0,NULL,'cash','completed','2026-06-26 23:45:56','2026-06-26 23:45:56'),(18,1,3,NULL,'RCP-6A3F0F75931C3',14000.00,0.00,1931.00,20000.00,6000.00,0,NULL,'cash','completed','2026-06-26 23:47:01','2026-06-26 23:47:01'),(19,1,3,1,'RCP-6A3F0F9342793',7000.00,0.00,966.00,10000.00,3000.00,0,NULL,'cash','completed','2026-06-26 23:47:31','2026-06-26 23:47:31'),(20,1,3,NULL,'RCP-6A3F1107381D1',7000.00,0.00,966.00,8000.00,1000.00,0,NULL,'cash','completed','2026-06-26 23:53:43','2026-06-26 23:53:43'),(21,1,3,NULL,'RCP-6A3F1119D6CCB',7000.00,0.00,966.00,8000.00,1000.00,0,NULL,'cash','completed','2026-06-26 23:54:01','2026-06-26 23:54:01'),(22,1,2,NULL,'RCP-6A3F125F7569E',24140.00,0.00,3330.00,30000.00,5860.00,0,NULL,'cash','completed','2026-06-26 23:59:27','2026-06-26 23:59:27'),(23,1,3,NULL,'RCP-6A3F12B2DA99E',10140.00,0.00,1399.00,12000.00,1860.00,0,NULL,'cash','completed','2026-06-27 00:00:50','2026-06-27 00:00:50'),(24,1,3,NULL,'RCP-6A3F1328F0062',10140.00,0.00,1399.00,10140.00,0.00,0,NULL,'cash','completed','2026-06-27 00:02:48','2026-06-27 00:02:48'),(25,1,3,NULL,'RCP-6A3F13B74E8B7',17140.00,0.00,2364.00,20000.00,2860.00,0,NULL,'cash','completed','2026-06-27 00:05:11','2026-06-27 00:05:11'),(26,1,3,NULL,'RCP-6A3F13C920130',17140.00,0.00,2364.00,20000.00,2860.00,0,NULL,'cash','completed','2026-06-27 00:05:29','2026-06-27 00:05:29'),(27,2,4,NULL,'RCP-6A3F17140E8AC',10336.76,0.00,1426.00,11000.00,663.24,0,NULL,'cash','completed','2026-06-27 00:19:32','2026-06-27 00:19:32'),(28,2,5,NULL,'RCP-6A3F1759AB4E8',20673.52,0.00,2852.00,21000.00,326.48,0,NULL,'cash','completed','2026-06-27 00:20:41','2026-06-27 00:20:41'),(29,2,4,NULL,'RCP-6A3F2E97AB7F4',47997.04,0.00,6620.00,50000.00,2002.96,0,NULL,'cash','completed','2026-06-27 01:59:51','2026-06-27 01:59:51'),(30,3,6,NULL,'RCP-6A3F33A75A71E',1820.00,0.00,251.00,2000.00,180.00,0,NULL,'cash','completed','2026-06-27 02:21:27','2026-06-27 02:21:27'),(31,3,6,NULL,'RCP-6A3F9F90B7DEF',390.00,0.00,54.00,390.00,0.00,0,NULL,'mpesa','completed','2026-06-27 10:01:52','2026-06-27 10:01:52');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_adjustments`
--

DROP TABLE IF EXISTS `stock_adjustments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stock_adjustments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `adjusted_by` int(11) NOT NULL,
  `type` enum('add','remove','damage','expiry') NOT NULL,
  `quantity` int(11) NOT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_adjustments`
--

LOCK TABLES `stock_adjustments` WRITE;
/*!40000 ALTER TABLE `stock_adjustments` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_adjustments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','cashier') DEFAULT 'cashier',
  `business_id` bigint(20) unsigned DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Super Admin','admin@devnovatechpos.com','super_admin',NULL,1,NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,NULL,NULL),(2,'B Pharm','admin@test.com','admin',1,1,NULL,'$2y$10$FveNr3kT7BRR7OfCCLzdhOo00ptCDR0pIY5CAVMqt5.hqrk/sZAUq',NULL,NULL,NULL),(3,'ongodo','ongodobenard@gmail.com','cashier',1,1,NULL,'$2y$10$dPLt8u5aaC3R.CCVnq7Of.5yCpOKGZ.FeOz00Mb5zkrkKE02imjHC',NULL,NULL,NULL),(4,'NB PHARM','admin@nb.com','admin',2,1,NULL,'$2y$10$IM9so58GB3f.H1DahQWG0uO5/iVc07trBMojV8hXzn76RZLSm1S96',NULL,NULL,NULL),(5,'nb','ongodobenard72@gmail.com','cashier',2,1,NULL,'$2y$10$CxChfFh2YHpzdAuwyCJt3OmnfbW/5GOAw9r2HJEJ6K68xj7OsXg26',NULL,NULL,NULL),(6,'ABC','ongodobenard35@gmail.com','admin',3,1,NULL,'$2y$10$Ti4FzK6CHugLkSE8zOHUjuXLhpzVp8Qvk31bP2FinsCleDp/Fxptm',NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-27 19:24:03
